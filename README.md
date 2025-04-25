# Color Palette Generator

A beautiful, interactive web application for generating and exploring color palettes with stunning 3D effects and animations.

![Color Palette Generator Screenshot](https://via.placeholder.com/800x450.png?text=Color+Palette+Generator)

## Features

- **Multiple Palette Types**: Generate color harmonies including Complementary, Analogous, Triadic, and Shades
- **Custom Color Input**: Add your own hex color codes to use as base colors
- **3D Interactive Effects**: Enjoy interactive 3D animations when hovering over colors
- **Copy to Clipboard**: Easily copy any color's hex value with a single click
- **Palette History**: View and restore previously generated palettes
- **Responsive Design**: Works great on both desktop and mobile devices

## Technologies Used

- **React**: Built with React for a component-based UI
- **CSS Animations**: Smooth, performant animations without heavy dependencies
- **Chroma.js**: Advanced color manipulation and generation
- **React Colorful**: Lightweight and beautiful color picker component
- **Local Storage**: Persistent palette history across browser sessions

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/color-palette-generator.git
   ```

2. Navigate into the project directory:
   ```bash
   cd color-palette-generator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Usage

### Generating Palettes

1. **Select a Palette Type**: Choose from Complementary, Analogous, Triadic, or Shades
2. **Set Base Colors**: Use the color picker or input hex values directly
3. **Add/Remove Colors**: Add up to 5 base colors or remove existing ones
4. **Copy Colors**: Click on any color swatch to copy its hex value
5. **View History**: See previously generated palettes and restore them with a click

### Color Manipulation

- The app automatically generates variations based on your base colors
- Each palette type uses different color theory principles to create harmonious combinations
- Experiment with different base colors to discover unique color schemes

## How It Works

1. **Color Generation**: Uses chroma.js to create color variations based on selected palette type
2. **3D Effects**: Implements mouse tracking for realistic 3D tilting effects on color swatches
3. **Animation**: Uses CSS animations for smooth transitions and effects
4. **State Management**: React's useState and useEffect for component state and side effects
5. **Persistence**: localStorage to save palette history between sessions


## License

This project is licensed under the MIT License - see the LICENSE file for details.


