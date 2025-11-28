const fs = require('fs');
const { createCanvas } = require('canvas');

// Create canvas
const canvas = createCanvas(600, 240);
const ctx = canvas.getContext('2d');

// Helper function for rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Draw background card with rounded corners
ctx.fillStyle = '#ffffff';
roundRect(ctx, 0, 0, 600, 240, 36);
ctx.fill();

// Draw border
ctx.strokeStyle = '#E5E7EB';
ctx.lineWidth = 3;
roundRect(ctx, 0, 0, 600, 240, 36);
ctx.stroke();

// Draw orange circle icon
const gradient = ctx.createLinearGradient(42, 72, 138, 168);
gradient.addColorStop(0, '#ff6600');
gradient.addColorStop(1, '#ff8533');
ctx.fillStyle = gradient;
ctx.beginPath();
ctx.arc(90, 120, 48, 0, Math.PI * 2);
ctx.fill();

// Draw M in circle
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 60px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('M', 90, 120);

// Draw "M" in orange
ctx.fillStyle = '#ff6600';
ctx.font = 'bold 66px Arial';
ctx.textAlign = 'left';
ctx.textBaseline = 'alphabetic';
ctx.fillText('M', 165, 114);

// Measure M width to position "oola"
const mWidth = ctx.measureText('M').width;

// Draw "oola" in dark blue with small gap
ctx.fillStyle = '#13294b';
ctx.font = 'bold 66px Arial';
ctx.fillText('oola', 165 + mWidth + 2, 114);

// Draw "Finance" tagline
ctx.fillStyle = '#6B7280';
ctx.font = '30px Arial';
ctx.fillText('Finance', 165, 156);

// Save PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/moola-logo.png', buffer);

console.log('✅ Logo generated successfully at public/moola-logo.png');
