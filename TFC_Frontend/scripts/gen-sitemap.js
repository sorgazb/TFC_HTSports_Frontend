// scripts/gen-sitemap.js
const fs = require('fs');
const path = require('path');

// 1. Define aquí todas tus rutas (incluye la raíz y las subrutas)
const routes = [
  '/'
];

// 2. Construye las entradas <url> para cada ruta
const urls = routes.map(route => `
  <url>
    <loc>https://tfc-frontend-ten.vercel.app/${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`).join('');

// 3. Envuelve en <urlset>
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                      http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;

// 4. Asegúrate de que la carpeta de salida existe
const outDir = path.join(__dirname, '..', 'dist', 'browser');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 5. Escribe el archivo sitemap.xml en la carpeta de salida
const filePath = path.join(outDir, 'sitemap.xml');
fs.writeFileSync(filePath, sitemap.trim());

console.log(`✅ sitemap.xml generado en ${filePath}`);
