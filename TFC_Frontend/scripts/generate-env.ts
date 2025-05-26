const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, '../src/app/environments');

// 1. Crear carpeta environments si no existe
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

// Agrega las propiedades necesarias a las variables de entorno
const envContent = `
export const environment = {
  production: ${process.env['ENV_PROD'] === 'true'},
  apiUrl: '${process.env['ENV_API_URL']}',
  FACEINPHOTO_HOST: '${process.env['FACEINPHOTO_HOST']}',
  FACEINPHOTO_PORT: '${process.env['FACEINPHOTO_PORT']}',
  FACEINPHOTO_PROXY: '${process.env['FACEINPHOTO_PROXY']}'
  OPENIA_API_KEY: '${process.env['OPENIA_API_KEY']}'
};`;

const devPath = path.join(envDir, 'environment.ts');
const prodPath = path.join(envDir, 'environment.prod.ts');

console.log('Generando environment.ts en:', devPath);
console.log('Generando environment.prod.ts en:', prodPath);

// 2. Escribir archivos
fs.writeFileSync(devPath, envContent);
fs.writeFileSync(prodPath, envContent);

console.log('✅ Archivos de entorno generados correctamente.');
