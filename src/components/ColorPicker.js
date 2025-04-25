import React, { useState, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import './ColorPicker.css';

const ColorPicker = ({ colors, activeIndex, onColorChange, onAddColor, onRemoveColor, onSelectColor }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [customColorInput, setCustomColorInput] = useState('');
  const [isInputValid, setIsInputValid] = useState(true);
  const inputRef = useRef(null);

  // Handle mouse move for 3D effect
  const handleMouseMove = (e) => {
    const container = e.currentTarget;
    const { left, top, width, height } = container.getBoundingClientRect();
    
    // Calculate position relative to center
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    // Transform based on mouse position
    setRotateX(-y * 10);  // Negative to make it follow mouse naturally
    setRotateY(x * 10);
  };

  // Reset rotation on mouse leave
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Validate hex color code
  const isValidHexColor = (color) => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  // Handle custom color input change
  const handleCustomColorChange = (e) => {
    const value = e.target.value;
    setCustomColorInput(value);
    
    // Validate only if input has content
    if (value) {
      const formattedValue = value.startsWith('#') ? value : `#${value}`;
      setIsInputValid(isValidHexColor(formattedValue));
    } else {
      setIsInputValid(true);
    }
  };

  // Handle custom color submission
  const handleCustomColorSubmit = (e) => {
    e.preventDefault();
    
    // Ensure the color starts with #
    let colorToAdd = customColorInput;
    if (colorToAdd && !colorToAdd.startsWith('#')) {
      colorToAdd = `#${colorToAdd}`;
    }
    
    if (colorToAdd && isValidHexColor(colorToAdd)) {
      onColorChange(colorToAdd, activeIndex);
      setCustomColorInput('');
      setIsInputValid(true);
    }
  };

  // Create 3D transform style
  const getContainerStyle = () => {
    return {
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    };
  };

  return (
    <div 
      className="color-picker-container"
      style={getContainerStyle()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h2>Base Colors</h2>
      <div className="base-colors-grid">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`base-color-item ${activeIndex === index ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onSelectColor(index)}
          >
            <div className="color-value">{color}</div>
            {colors.length > 1 && (
              <button
                className="remove-color"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveColor(index);
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}

        {colors.length < 5 && (
          <div
            className="add-color-button"
            onClick={onAddColor}
          >
            +
          </div>
        )}
      </div>

      {/* Custom color input form */}
      <form onSubmit={handleCustomColorSubmit} className="custom-color-form">
        <input
          ref={inputRef}
          type="text"
          value={customColorInput}
          onChange={handleCustomColorChange}
          placeholder="Enter hex color (#RRGGBB)"
          className={`custom-color-input ${!isInputValid ? 'invalid' : ''}`}
        />
        <button
          type="submit"
          className="custom-color-btn"
          disabled={!isInputValid || !customColorInput}
        >
          Apply
        </button>
      </form>

      <div className="color-picker-wrapper">
        <div className="picker-lighting"></div>
        <HexColorPicker 
          color={colors[activeIndex]}
          onChange={(color) => onColorChange(color, activeIndex)}
          className="react-colorful-enhanced"
        />
      </div>
    </div>
  );
};

export default ColorPicker;