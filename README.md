# 🎨 TechBoard - Interactive Drawing & Whiteboard

A modern, interactive, and user-friendly Drawing Board/Whiteboard web application where users can freely draw, write, add text, and create designs.

## ✨ Features

### Drawing Tools
- **✏️ Pen** - Free-form drawing with smooth lines
- **🧹 Eraser** - Remove content from the canvas
- **📏 Line** - Draw straight lines between two points
- **▭ Rectangle** - Create rectangular shapes
- **● Circle** - Draw circular shapes
- **📝 Text** - Add text to your designs

### Color & Customization
- **Color Picker** - Choose any color from the full spectrum
- **Color Presets** - Quick access to popular colors (Black, Red, Green, Blue, Orange, Purple)
- **Adjustable Brush Size** - Slider to control brush thickness (1-50px)

### Canvas Actions
- **↶ Undo** - Revert your last action (Ctrl+Z)
- **↷ Redo** - Restore your last undone action (Ctrl+Y)
- **🗑️ Clear** - Clear the entire canvas with confirmation
- **⬇️ Download** - Export your drawing as PNG image

### User Experience
- **Real-time Coordinate Display** - Track your mouse position on the canvas
- **Tool Status Bar** - See which tool is currently active
- **Responsive Design** - Works on different screen sizes
- **Smooth Animations** - Polished transitions and interactions
- **Keyboard Shortcuts** - Undo (Ctrl+Z) and Redo (Ctrl+Y)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DetectiveRaj/TechBoard.git
cd TechBoard
```

2. Open in browser:
```bash
# Simply open index.html in your web browser
open index.html
```

Or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 📁 Project Structure

```
TechBoard/
├── index.html      # Main HTML structure
├── styles.css      # Modern styling with CSS variables
├── app.js          # Core application logic
└── README.md       # Documentation
```

## 🎯 How to Use

1. **Select a Tool** - Click on any tool in the toolbar
2. **Choose a Color** - Use the color picker or presets
3. **Adjust Brush Size** - Drag the slider for desired thickness
4. **Draw/Create** - Click and drag on the canvas
5. **Add Text** - Select Text tool and click where you want to add text
6. **Undo/Redo** - Use buttons or keyboard shortcuts
7. **Download** - Export your creation as a PNG file

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #4f46e5;
    /* ... other colors ... */
}
```

### Adjusting Canvas Size
Modify the `resizeCanvas()` function in `app.js` to change default dimensions.

### Adding More Tools
Extend the toolbar by:
1. Adding a new button in `index.html`
2. Adding tool logic in the `draw()` function in `app.js`

## 🖥️ Browser Support

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers with touch support

## 📝 Technical Details

### Technology Stack
- **HTML5** - Canvas API for drawing
- **CSS3** - Modern styling with Flexbox and CSS Variables
- **Vanilla JavaScript** - No dependencies required

### Key Features Implementation
- HTML5 Canvas for rendering
- State management with undo/redo stack
- Event handling for mouse/keyboard interactions
- Image export functionality

## 🔮 Future Enhancements

- [ ] Touch support for tablets/mobile devices
- [ ] Multiple layers support
- [ ] Shape tools (arrows, polygons)
- [ ] Text styling options (font size, family, bold, italic)
- [ ] Fill/gradient support
- [ ] Drawing history panel
- [ ] Collaborative drawing
- [ ] Save/Load drawings
- [ ] Dark mode theme
- [ ] Mobile app version

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

If you encounter any issues or have suggestions, please open an issue on GitHub.

---

**Made with ❤️ by DetectiveRaj**