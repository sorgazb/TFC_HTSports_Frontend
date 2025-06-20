# HT Sports Frontend

<p align="center">
  <img src="https://github.com/user-attachments/assets/6a510eb9-31b3-4e53-870d-d498d91de35a" alt="HT Sports Logo" />
</p>


![Angular](https://img.shields.io/badge/Angular-15.0.5-dd0031?style=for-the-badge&logo=angular)&nbsp;![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06b6d4?style=for-the-badge&logo=tailwind-css)&nbsp;![Angular Material](https://img.shields.io/badge/Angular_Material-15.0.5-1976d2?style=for-the-badge&logo=angular)&nbsp;![Ant Design](https://img.shields.io/badge/Ant_Design-5.3.2-0170fe?style=for-the-badge&logo=antdesign)&nbsp;![ngx-translate](https://img.shields.io/badge/ngx--translate-14.0.0-ea4335?style=for-the-badge&logo=ngx)&nbsp;![pdfmake](https://img.shields.io/badge/pdfmake-0.2.7-000000?style=for-the-badge)&nbsp;![PayPal](https://img.shields.io/badge/PayPal-Developer-003087?style=for-the-badge&logo=paypal)&nbsp;![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai)&nbsp;![Vercel](https://img.shields.io/badge/Vercel-Hosting-000000?style=for-the-badge&logo=vercel)

> **HT Sports Frontend** es la interfaz web responsiva para aficionados, jugadores y cuerpo técnico. Construida con Angular y Tailwind para ofrecer una experiencia moderna, rápida y modular.

---

## 📱 Descripción del Frontend

La parte cliente de **HT Sports** está desarrollada con **Angular 15.0.5** y estilizada con **Tailwind CSS 3.4.17**.  
Se aprovecha de:

- **Angular Material** & **Ant Design** para componentes UI profesionales.  
- **Lazy loading** y **Angular Router** para una navegación ágil.  
- **ngx-translate** para internacionalización en tiempo real.  
- **pdfmake** para generar entradas en PDF.  
- **Integración con APIs externas**:
  - **Face In Photo** API para detección de caras en imágenes.
  - **PayPal** para pasarelas de pago seguras.
  - **OpenAI** para funcionalidades de chat y generación de contenido.

El código está organizado en módulos y componentes, garantizando mantenibilidad y escalabilidad.

---

## 🏗️ Estructura del Proyecto

```txt
TFC_HTSports_Frontend/
├── .vscode/                   # Configuración del editor VSCode
├── scripts/                   # Scripts de construcción y SEO (sitemap, robots, OG)
├── src/
│   ├── app/
│   │   ├── class/             # Apartado de historia de equipos
│   │   ├── components/        # Componentes UI reutilizables
│   │   ├── directives/        # Directivas personalizadas
│   │   ├── interface/         # Interfaces y tipos TypeScript
│   │   ├── services/          # Servicios y consumo de APIs
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   └── app.component.css
│   ├── assets/                # Imágenes y estilos globales
│   ├── environments/          # Configuración de entornos
│   └── main.ts                # Punto de arranque de la app
├── .editorconfig              # Reglas de editor
├── .gitignore                 # Archivos y carpetas ignorados
├── angular.json               # Configuración de Angular CLI
├── package.json               # Dependencias y scripts NPM
├── package-lock.json          # Lockfile de NPM
├── tailwind.config.js         # Configuración de Tailwind CSS
├── tsconfig.app.json          # Configuración TS para la app
├── tsconfig.spec.json         # Configuración TS para tests
├── tsconfig.json              # Configuración global de TS
├── vercel.json                # Configuración de despliegue en Vercel
└── README.md                  # Documentación del proyecto
```

## ⚙️ Instalación y Entorno de Desarrollo
Clonar repositorio:
```txt
git clone https://github.com/sorgazb/TFC_HTSports_Frontend.git
cd TFC_HTSports_Frontend
```

Instalar dependencias:
```txt
npm install
```
Levantar en desarrollo
```txt
npm run start
```

## 🚀 Despliegue
Este proyecto está configurado para desplegarse automáticamente en Vercel:
Simplemente conecta el repositorio a Vercel y cada push a la rama main disparará un nuevo despliegue.

## 🤝 Contribución
Haz fork del repositorio.

Crea una rama de trabajo:

```txt
git checkout -b feature/mi-nueva-funcionalidad
```

Realiza tus cambios y haz commit.

Abre un Pull Request describiendo tus mejoras.

Proyecto Final GS‑DAW – Sergio Orgaz Bravo
