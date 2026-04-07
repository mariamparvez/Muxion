import { useEffect } from 'react';

export function FaviconSetter() {
  useEffect(() => {
    // Create canvas - 34x34 to match Figma design
    const canvas = document.createElement('canvas');
    canvas.width = 34;
    canvas.height = 34;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // TRANSPARENT background
    ctx.clearRect(0, 0, 34, 34);
    
    // Draw the filled circle (dark background) - 32x32 centered at (17, 17)
    ctx.fillStyle = '#1A1816';
    ctx.beginPath();
    ctx.arc(17, 17, 16, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the circle border (blue stroke) - 32x32 centered at (17, 17)
    ctx.strokeStyle = '#155DFC';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(17, 17, 16, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw M letter using the EXACT path from Figma: "M10 26V13.0725L17.31 19.2754L24 8V26"
    ctx.strokeStyle = '#155DFC';
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Translate to center the drawing (since circle is at x=1, y=1 in Figma with 32x32 size)
    ctx.save();
    ctx.translate(1, 1);
    
    ctx.beginPath();
    ctx.moveTo(10, 26);
    ctx.lineTo(10, 13.0725);
    ctx.lineTo(17.31, 19.2754);
    ctx.lineTo(24, 8);
    ctx.lineTo(24, 26);
    ctx.stroke();
    
    ctx.restore();
    
    // Convert to PNG and set as favicon
    const faviconUrl = canvas.toDataURL('image/png');
    
    // Remove existing favicons
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());
    
    // Add new favicon
    const link = document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = faviconUrl;
    document.head.appendChild(link);
    
    // Also add apple touch icon
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = faviconUrl;
    document.head.appendChild(appleLink);
    
  }, []);
  
  return null;
}