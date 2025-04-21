const fs = require('fs');
const path = require('path');

const envDir = path.join(__dirname, '../src/environments');

// 1. Crear carpeta environments si no existe
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const envContent = `
export const environment = {
  production: ${process.env['ENV_PROD'] === 'true'},
  apiUrl: '${process.env['ENV_API_URL']}'
};
`;

const devPath = path.join(envDir, 'environment.ts');
const prodPath = path.join(envDir, 'environment.prod.ts');

// 2. Escribir archivos
fs.writeFileSync(devPath, envContent);
fs.writeFileSync(prodPath, envContent);

console.log('✅ Archivos de entorno generados correctamente.');
