const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist/tfc-frontend');

fs.mkdirSync(distPath, { recursive: true });

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://htsports.es/</loc>
    <changefreq>hourly</changefreq>
  </url>
</urlset>`;

fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemap);

fs.copyFileSync(
  path.join(__dirname, '../src/robots.txt'),
  path.join(distPath, 'robots.txt')
);

console.log('✅ sitemap.xml y robots.txt copiados a dist/tfc-frontend/');
