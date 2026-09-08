// Canvas Setup
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const toolButtons = document.querySelectorAll('.tool-btn');
const colorPicker = document.getElementById('colorPicker');
const brushSizeInput = document.getElementById('brushSize');
const brushSizeLabel = document.getElementById('brushSizeLabel');
const fillToggle = document.getElementById('fillToggle');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const imageBtn = document.getElementById('imageBtn');
const imageInput = document.getElementById('imageInput');
const toolStatus = document.getElementById('toolStatus');
const coordinateInfo = document.getElementById('coordinateInfo');
const textInputBox = document.getElementById('textInputBox');
const textInput = document.getElementById('textInput');
const colorPresets = document.querySelectorAll('.color-preset');

// State
let isDrawing = false;
let currentTool = 'pen';
let currentColor = '#000000';
let brushSize = 3;
let fillShape = false;
let startX, startY;
let textActive = false;
const undoStack = [];
const redoStack = [];

// Store original canvas data for shape preview
let originalImageData = null;

// Resize canvas to fit container
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    redrawCanvas();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Save canvas state for undo/redo
function saveState() {
    redoStack.length = 0;
    undoStack.push(canvas.toDataURL());
    if (undoStack.length > 20) undoStack.shift();
}

// Redraw canvas from saved state
function redrawCanvas() {
    if (undoStack.length === 0) return;
    const img = new Image();
    img.src = undoStack[undoStack.length - 1];
    img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
}

// Tool selection
toolButtons.forEach(btn => {
    if (!btn.classList.contains('dropdown-btn')) {
        btn.addEventListener('click', () => {
            toolButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTool = btn.dataset.tool;
            updateToolStatus();
            
            if (currentTool === 'text') {
                canvas.style.cursor = 'text';
            } else if (currentTool === 'eraser') {
                canvas.style.cursor = 'grab';
            } else {
                canvas.style.cursor = 'crosshair';
            }
        });
    }
});

// Color picker
colorPicker.addEventListener('change', (e) => {
    currentColor = e.target.value;
});

colorPresets.forEach(preset => {
    preset.addEventListener('click', () => {
        currentColor = preset.dataset.color;
        colorPicker.value = currentColor;
    });
});

// Fill toggle
fillToggle.addEventListener('change', (e) => {
    fillShape = e.target.checked;
});

// Brush size
brushSizeInput.addEventListener('input', (e) => {
    brushSize = e.target.value;
    brushSizeLabel.textContent = brushSize;
});

// Image insertion
if (imageBtn) {
    imageBtn.addEventListener('click', () => {
        imageInput.click();
    });
}

if (imageInput) {
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    saveState();
                    const maxWidth = canvas.width * 0.4;
                    const maxHeight = canvas.height * 0.4;
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                    
                    const x = (canvas.width - width) / 2;
                    const y = (canvas.height - height) / 2;
                    
                    ctx.drawImage(img, x, y, width, height);
                    saveState();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', updateCoordinates);

function startDrawing(e) {
    // Prevent drawing if text input is active
    if (textActive) {
        return;
    }
    
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    
    if (currentTool === 'text') {
        showTextInput(startX, startY);
        isDrawing = false;
        return;
    }
    
    saveState();
    
    if (['line', 'rectangle', 'circle', 'ellipse', 'triangle', 'polygon', 'star', 'arrow', 'rightarrow', 'diamond', 'hexagon', 'heart'].includes(currentTool)) {
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

function draw(e) {
    if (!isDrawing || currentTool === 'text' || textActive) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentTool === 'pen') {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
        startX = x;
        startY = y;
    } else if (currentTool === 'eraser') {
        ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    } else {
        if (originalImageData) {
            ctx.putImageData(originalImageData, 0, 0);
        }
        drawShape(startX, startY, x, y);
    }
}

function stopDrawing() {
    isDrawing = false;
    originalImageData = null;
}

function drawShape(x1, y1, x2, y2) {
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = brushSize;
    
    switch(currentTool) {
        case 'line':
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            break;
            
        case 'rectangle':
            const width = x2 - x1;
            const height = y2 - y1;
            if (fillShape) {
                ctx.fillRect(x1, y1, width, height);
            } else {
                ctx.strokeRect(x1, y1, width, height);
            }
            break;
            
        case 'circle':
            const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            ctx.beginPath();
            ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
            if (fillShape) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
            break;
            
        case 'ellipse':
            const radiusX = Math.abs(x2 - x1);
            const radiusY = Math.abs(y2 - y1);
            ctx.beginPath();
            ctx.ellipse(x1, y1, radiusX, radiusY, 0, 0, 2 * Math.PI);
            if (fillShape) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
            break;
            
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(x1, y2);
            ctx.lineTo(x2, y2);
            ctx.lineTo((x1 + x2) / 2, y1);
            ctx.closePath();
            if (fillShape) {
                ctx.fill();
            } else {
                ctx.stroke();
            }
            break;
            
        case 'polygon':
            drawPolygon(x1, y1, x2, y2, 6);
            break;
            
        case 'star':
            drawStar(x1, y1, x2, y2);
            break;
            
        case 'arrow':
            drawArrow(x1, y1, x2, y2);
            break;
            
        case 'rightarrow':
            drawRightArrow(x1, y1, x2, y2);
            break;
            
        case 'diamond':
            drawDiamond(x1, y1, x2, y2);
            break;
            
        case 'hexagon':
            drawPolygon(x1, y1, x2, y2, 6);
            break;
            
        case 'heart':
            drawHeart(x1, y1, x2, y2);
            break;
    }
}

function drawPolygon(x1, y1, x2, y2, sides) {
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = (2 * Math.PI) / sides;
    
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const x = x1 + radius * Math.cos(angle * i - Math.PI / 2);
        const y = y1 + radius * Math.sin(angle * i - Math.PI / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    if (fillShape) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

function drawStar(x1, y1, x2, y2) {
    const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const points = 5;
    const step = (Math.PI * 2) / (points * 2);
    
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? radius : radius / 2;
        const x = x1 + r * Math.cos(i * step - Math.PI / 2);
        const y = y1 + r * Math.sin(i * step - Math.PI / 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    if (fillShape) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

function drawArrow(x1, y1, x2, y2) {
    const headlen = 20;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function drawRightArrow(x1, y1, x2, y2) {
    const headlen = 15;
    const width = x2 - x1;
    const height = y2 - y1;
    
    if (fillShape) {
        ctx.fillRect(x1, y1 + height * 0.3, width * 0.7, height * 0.4);
    } else {
        ctx.strokeRect(x1, y1 + height * 0.3, width * 0.7, height * 0.4);
    }
    
    ctx.beginPath();
    ctx.moveTo(x2, y1 + height / 2);
    ctx.lineTo(x1 + width * 0.7, y1);
    ctx.lineTo(x1 + width * 0.7, y2);
    ctx.closePath();
    
    if (fillShape) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

function drawDiamond(x1, y1, x2, y2) {
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    
    ctx.beginPath();
    ctx.moveTo(centerX, y1);
    ctx.lineTo(x2, centerY);
    ctx.lineTo(centerX, y2);
    ctx.lineTo(x1, centerY);
    ctx.closePath();
    
    if (fillShape) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

function drawHeart(x1, y1, x2, y2) {
    const width = x2 - x1;
    const height = y2 - y1;
    const size = Math.min(width, height) / 2;
    
    ctx.beginPath();
    ctx.moveTo(x1 + width / 2, y2);
    
    ctx.bezierCurveTo(x1, y1 + size, x1, y1 + size * 0.5, x1 + size * 0.5, y1 + size * 0.5);
    ctx.bezierCurveTo(x1 + width * 0.25, y1, x1 + width * 0.5, y1, x1 + width * 0.5, y1 + size * 0.5);
    ctx.bezierCurveTo(x1 + width * 0.5, y1, x1 + width * 0.75, y1, x1 + width, y1 + size * 0.5);
    ctx.bezierCurveTo(x1 + width, y1 + size * 0.5, x1 + width, y1 + size, x1 + width / 2, y2);
    
    ctx.closePath();
    if (fillShape) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
}

function showTextInput(x, y) {
    textActive = true;
    textInputBox.style.display = 'block';
    textInputBox.style.left = x + 'px';
    textInputBox.style.top = y + 'px';
    textInput.value = '';
    textInput.focus();
    
    function finishText() {
        if (textInput.value.trim()) {
            ctx.font = `${parseInt(brushSize) * 4}px Arial`;
            ctx.fillStyle = currentColor;
            ctx.fillText(textInput.value, x, y + parseInt(brushSize) * 4);
            saveState();
        }
        textInputBox.style.display = 'none';
        textActive = false;
        textInput.removeEventListener('keypress', handleEnter);
        textInput.removeEventListener('blur', handleBlur);
    }
    
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            finishText();
        }
    };
    
    const handleBlur = () => {
        finishText();
    };
    
    textInput.addEventListener('keypress', handleEnter);
    textInput.addEventListener('blur', handleBlur);
}

function updateCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    coordinateInfo.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
}

function updateToolStatus() {
    const toolNames = {
        'pen': 'Pen',
        'eraser': 'Eraser',
        'line': 'Line',
        'rectangle': 'Rectangle',
        'circle': 'Circle',
        'ellipse': 'Ellipse',
        'triangle': 'Triangle',
        'polygon': 'Polygon',
        'star': 'Star',
        'arrow': 'Arrow',
        'rightarrow': 'Right Arrow',
        'diamond': 'Diamond',
        'hexagon': 'Hexagon',
        'heart': 'Heart',
        'text': 'Text'
    };
    toolStatus.textContent = `Tool: ${toolNames[currentTool]} | Ready to draw`;
}

// Undo/Redo
undoBtn.addEventListener('click', () => {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        redrawCanvas();
    }
});

redoBtn.addEventListener('click', () => {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        redrawCanvas();
    }
});

// Clear canvas
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the canvas?')) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        undoStack.length = 0;
        redoStack.length = 0;
        saveState();
    }
});

// Download canvas
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `techboard-${new Date().getTime()}.png`;
    link.click();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
            e.preventDefault();
            undoBtn.click();
        }
        if (e.key === 'y') {
            e.preventDefault();
            redoBtn.click();
        }
    }
});

// Initialize
saveState();
updateToolStatus();