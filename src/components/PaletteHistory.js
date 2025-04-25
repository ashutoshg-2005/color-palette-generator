import React from 'react';
import './PaletteHistory.css';

const PaletteHistory = ({ history, onSelectPalette, onClearHistory }) => {
  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="palette-history-container animate-fade-in">
      <div className="palette-history-header">
        <h3>Palette History</h3>
        <button 
          className="clear-history-btn"
          onClick={onClearHistory}
        >
          Clear
        </button>
      </div>

      <div className="palettes-scroll-container">
        {history.map((item, index) => (
          <div
            key={index}
            className="history-palette-item animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onSelectPalette(item)}
          >
            <div className="history-color-preview">
              {item.palette.slice(0, 5).map((color, colorIndex) => (
                <div 
                  key={colorIndex} 
                  className="history-color-swatch"
                  style={{ backgroundColor: color }}
                />
              ))}
              {item.palette.length > 5 && (
                <div className="more-colors">+{item.palette.length - 5}</div>
              )}
            </div>
            <div className="history-palette-info">
              <span className="history-palette-timestamp">
                {new Date(item.timestamp).toLocaleTimeString()}
              </span>
              <span className="history-palette-label">
                {item.paletteType}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaletteHistory;