const fs = require('fs');
const path = require('path');

// Construir la ruta del archivo de imagen de manera segura
const imagePath = path.join(__dirname, "../public/images", 'twitterLogo.png');

// Leer el archivo de imagen
fs.readFile(imagePath, (err, data) => {
  if (err) {
    console.error('Error al leer el archivo:', err);
    return;
  }
  
  // Convertir el archivo a base64
  const base64Image = data.toString('base64');
  
  // Mostrar la imagen en base64
  console.log('data:image/jpeg;base64,' + base64Image);
});
