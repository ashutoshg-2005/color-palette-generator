import React, { useState, useRef, useEffect } from 'react';
import chroma from 'chroma-js';
import './ColorSwatch.css';

const ColorSwatch = ({ color, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ rotateX: 0, rotateY: 0 });
  const [copied, setCopied] = useState(false);
  const swatchRef = useRef(null);
  
  // Calculate text color contrast for better readability
  const textColor = chroma.contrast(color, 'white') > 4.5 ? 'white' : 'black';
  
  // Handle mouse move for 3D effect
  const handleMouseMove = (e) => {
    if (!swatchRef.current || !isHovered) return;
    
    const rect = swatchRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setMousePosition({ rotateX, rotateY });
  };
  
  // Handle click to copy color to clipboard
  const handleClick = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    onClick && onClick(color);
    
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };
  
  // Reset position when mouse leaves
  useEffect(() => {
    if (!isHovered) {
      setMousePosition({ rotateX: 0, rotateY: 0 });
    }
  }, [isHovered]);

  // Create 3D transform style
  const getTransformStyle = () => {
    const { rotateX, rotateY } = mousePosition;
    return {
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)${isHovered ? ' scale(1.05)' : ''}`,
      boxShadow: isHovered 
        ? `0px 10px 25px rgba(0,0,0,0.2), 
           ${rotateY > 0 ? -8 : 8}px ${rotateX > 0 ? -8 : 8}px 15px rgba(0,0,0,0.1)`
        : '0px 5px 15px rgba(0,0,0,0.1)'
    };
  };

  return (
    <div
      ref={swatchRef}
      className={`color-swatch-3d ${copied ? 'copied' : ''}`}
      style={{
        backgroundColor: color,
        color: textColor,
        ...getTransformStyle()
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
    >
      <div className="color-swatch-content">
        <span className="color-hex-value">{color}</span>
      </div>
      
      {/* Lighting effect */}
      <div className="color-swatch-lighting"></div>
      
      {/* Copy notification */}
      {copied && (
        <div className="copied-notification">
          Copied!
        </div>
      )}
    </div>
  );
};

export default ColorSwatch;