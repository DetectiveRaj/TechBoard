// Canvas Setup
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const toolButtons = document.querySelectorAll('.tool-btn');
const colorPicker = document.getElementById('colorPicker');
const brushSizeInput = document.getElementById('brushSize');
const brushSizeLabel = document.getElementById('brushSizeLabel');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
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
let startX, startY;
const undoStack = [];
const redoStack = [];

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

// Brush size
brushSizeInput.addEventListener('input', (e) => {
    brushSize = e.target.value;
    brushSizeLabel.textContent = brushSize;
});

// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', updateCoordinates);

function startDrawing(e) {
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
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

function draw(e) {
    if (!isDrawing || currentTool === 'text') return;
    
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
        // For shapes, we'll redraw from the saved state
        redrawCanvas();
        drawShape(startX, startY, x, y);
    }
}

function stopDrawing() {
    isDrawing = false;
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
            ctx.strokeRect(x1, y1, width, height);
            break;
        case 'circle':
            const radius = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            ctx.beginPath();
            ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
            ctx.stroke();
            break;
    }
}

function showTextInput(x, y) {
    textInputBox.style.display = 'block';
    textInputBox.style.left = x + 'px';
    textInputBox.style.top = y + 'px';
    textInput.value = '';
    textInput.focus();
    
    textInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            ctx.font = `${brushSize * 4}px Arial`;
            ctx.fillStyle = currentColor;
            ctx.fillText(textInput.value, x, y + parseInt(brushSize) * 4);
            textInputBox.style.display = 'none';
            saveState();
        }
    };
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