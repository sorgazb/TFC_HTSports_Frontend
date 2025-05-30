const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist/TFC_Frontend');

// 🔧 Asegurarse de que la carpeta existe
fs.mkdirSync(distPath, { recursive: true });

// 1. Generar sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tfc-frontend-ten.vercel.app/</loc>
    <changefreq>weekly</changefreq>
  </url>
</urlset>`;

// 2. Escribir sitemap.xml
fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap);

// 3. Copiar robots.txt
fs.copyFileSync(
  path.join(__dirname, '../src/robots.txt'),
  path.join(distPath, 'robots.txt')
);

console.log('✅ sitemap.xml y robots.txt copiados a dist/TFC_Frontend/');
