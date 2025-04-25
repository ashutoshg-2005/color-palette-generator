import React, { useState, useEffect, useCallback } from 'react';
import chroma from 'chroma-js';
import ColorPicker from './components/ColorPicker';
import ColorSwatch from './components/ColorSwatch';
import PaletteHistory from './components/PaletteHistory';
import './App.css';

function App() {
  const [baseColors, setBaseColors] = useState(['#ff5252', '#4caf50', '#2196f3']);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [generatedPalette, setGeneratedPalette] = useState([]);
  const [copiedColor, setCopiedColor] = useState(null);
  const [paletteType, setPaletteType] = useState('complementary');
  const [paletteHistory, setPaletteHistory] = useState([]);

  // Generate a palette based on the base colors and selected palette type
  const generatePalette = useCallback(() => {
    const palette = [];
    
    // Always include the base colors
    baseColors.forEach(color => {
      palette.push(color);
    });

    // Generate different palette types
    switch (paletteType) {
      case 'complementary':
        baseColors.forEach(color => {
          // Add complementary color
          palette.push(chroma(color).set('hsl.h', (chroma(color).get('hsl.h') + 180) % 360).hex());
        });
        break;
        
      case 'analogous':
        baseColors.forEach(color => {
          const hue = chroma(color).get('hsl.h');
          // Add colors 30° in either direction
          palette.push(chroma(color).set('hsl.h', (hue + 30) % 360).hex());
          palette.push(chroma(color).set('hsl.h', (hue - 30 + 360) % 360).hex());
        });
        break;
        
      case 'triadic':
        baseColors.forEach(color => {
          const hue = chroma(color).get('hsl.h');
          // Add two colors in 120° increments
          palette.push(chroma(color).set('hsl.h', (hue + 120) % 360).hex());
          palette.push(chroma(color).set('hsl.h', (hue + 240) % 360).hex());
        });
        break;
        
      case 'shades':
        baseColors.forEach(color => {
          // Create lighter and darker versions
          for (let i = 1; i <= 3; i++) {
            palette.push(chroma(color).brighten(i).hex());
            palette.push(chroma(color).darken(i).hex());
          }
        });
        break;
        
      default:
        // Default: add some variations
        baseColors.forEach(color => {
          // Lighter variations
          palette.push(chroma(color).brighten(1).hex());
          palette.push(chroma(color).brighten(2).hex());
          
          // Darker variations
          palette.push(chroma(color).darken(1).hex());
          palette.push(chroma(color).darken(2).hex());
        });
    }
    
    // Generate some mix colors between base colors if multiple colors exist
    if (baseColors.length >= 2) {
      for (let i = 0; i < baseColors.length; i++) {
        const nextIndex = (i + 1) % baseColors.length;
        palette.push(chroma.mix(baseColors[i], baseColors[nextIndex], 0.5).hex());
      }
    }
    
    // Remove duplicates and sort by hue
    const uniquePalette = [...new Set(palette)];
    const sortedPalette = uniquePalette.sort((a, b) => {
      return chroma(a).get('hsl.h') - chroma(b).get('hsl.h');
    });
    
    setGeneratedPalette(sortedPalette);
    
    // Add to history only on user-triggered changes, not on initial load
    if (paletteHistory.length > 0 || paletteType !== 'complementary') {
      const historyItem = {
        baseColors: [...baseColors],
        palette: sortedPalette,
        paletteType,
        timestamp: new Date().getTime()
      };
      
      setPaletteHistory(prev => {
        // Limit history to most recent 10 palettes
        const updatedHistory = [historyItem, ...prev];
        return updatedHistory.slice(0, 10);
      });
    }
  }, [baseColors, paletteType, paletteHistory.length]);

  // Generate palette whenever base colors change or palette type changes
  useEffect(() => {
    generatePalette();
  }, [generatePalette]);

  // Load palette history from localStorage on initial load
  useEffect(() => {
    const savedHistory = localStorage.getItem('paletteHistory');
    if (savedHistory) {
      try {
        setPaletteHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse palette history from localStorage:', error);
      }
    }
  }, []);

  // Save palette history to localStorage whenever it changes
  useEffect(() => {
    if (paletteHistory.length > 0) {
      localStorage.setItem('paletteHistory', JSON.stringify(paletteHistory));
    }
  }, [paletteHistory]);

  // Handle color change for base colors
  const handleColorChange = (color, index = activeColorIndex) => {
    const newBaseColors = [...baseColors];
    newBaseColors[index] = color;
    setBaseColors(newBaseColors);
  };

  // Add a new base color
  const addBaseColor = () => {
    if (baseColors.length < 5) {
      // Create a new color that's distinct from existing ones
      const newColor = chroma.random().hex();
      setBaseColors([...baseColors, newColor]);
      setActiveColorIndex(baseColors.length);
    }
  };

  // Remove a base color
  const removeBaseColor = (index) => {
    if (baseColors.length > 1) {
      const newColors = baseColors.filter((_, i) => i !== index);
      setBaseColors(newColors);
      setActiveColorIndex(Math.min(activeColorIndex, newColors.length - 1));
    }
  };

  // Copy color to clipboard and show notification
  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };
  
  // Select a palette from history
  const selectPaletteFromHistory = (historyItem) => {
    setBaseColors(historyItem.baseColors);
    setPaletteType(historyItem.paletteType);
  };
  
  // Clear palette history
  const clearPaletteHistory = () => {
    setPaletteHistory([]);
    localStorage.removeItem('paletteHistory');
  };

  return (
    <div className="App">
      <header>
        <h1 className="app-title animate-fade-in">Color Palette Generator</h1>
        <p className="app-subtitle animate-fade-in animate-delay-300">Create beautiful color combinations with 3D effects</p>
      </header>
      
      <main>
        <section className="controls-section">
          <div className="palette-type-selector animate-fade-in animate-slide-in-left">
            <h3>Palette Type</h3>
            <div className="palette-type-buttons">
              {['complementary', 'analogous', 'triadic', 'shades'].map((type) => (
                <button
                  key={type}
                  className={`palette-type-button ${paletteType === type ? 'active' : ''}`}
                  onClick={() => setPaletteType(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="animate-fade-in animate-slide-in-bottom animate-delay-500">
            <ColorPicker
              colors={baseColors}
              activeIndex={activeColorIndex}
              onColorChange={handleColorChange}
              onAddColor={addBaseColor}
              onRemoveColor={removeBaseColor}
              onSelectColor={setActiveColorIndex}
            />
          </div>
          
          {paletteHistory.length > 0 && (
            <div className="animate-fade-in animate-slide-in-bottom animate-delay-600">
              <PaletteHistory 
                history={paletteHistory}
                onSelectPalette={selectPaletteFromHistory}
                onClearHistory={clearPaletteHistory}
              />
            </div>
          )}
        </section>
        
        <section className="palette-section">
          <div className="palette-container animate-fade-in animate-slide-in-right animate-delay-700">
            <h2>Generated Palette</h2>
            <div className="palette-grid">
              {generatedPalette.map((color, index) => (
                <div 
                  key={`${color}-${index}`}
                  className="palette-grid-item animate-fade-in"
                  style={{animationDelay: `${index * 30}ms`}}
                >
                  <ColorSwatch 
                    color={color}
                    onClick={copyToClipboard}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer>
        <div className="animate-fade-in animate-delay-1000">
          <p>Click on any color swatch to copy its hex value to clipboard</p>
          <p className="footer-credits">Created with React and CSS animations</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
