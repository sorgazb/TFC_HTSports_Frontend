const fs = require('fs');
const path = require('path');

// Crea el contenido del environment.ts
const envFileContent = `
export const environment = {
  production: ${process.env['ENV_PROD'] === 'true'},
  apiUrl: '${process.env['ENV_API_URL']}'
};
`;

// Ruta a los archivos
const devPath = path.join(__dirname, '../src/environments/environment.ts');
const prodPath = path.join(__dirname, '../src/environments/environment.prod.ts');

// Crear los archivos
fs.writeFileSync(devPath, envFileContent);
fs.writeFileSync(prodPath, envFileContent);

console.log('✅ Archivos de entorno generados correctamente');
