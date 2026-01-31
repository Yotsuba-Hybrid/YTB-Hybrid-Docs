# ⚡ Quick Start - YotsubaEngine Website

## 🚀 Empezar en 3 Pasos

### 1️⃣ Instalar Dependencias
```bash
cd website
npm install
```

### 2️⃣ Iniciar Servidor de Desarrollo
```bash
npm start
```
Abre tu navegador en `http://localhost:4200/`

### 3️⃣ Compilar para Producción
```bash
npm run build:prod
```
Los archivos estarán en `dist/website/browser/`

## 📝 Comandos Principales

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia servidor de desarrollo |
| `npm run build` | Compila proyecto |
| `npm run build:prod` | Compila para producción |
| `npm run deploy` | Compila y despliega a GitHub Pages |
| `npm test` | Ejecuta tests |

## 📂 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `src/app/components/` | Componentes de la página |
| `src/material-theme.scss` | Tema de colores |
| `src/styles.css` | Estilos globales |
| `angular.json` | Configuración de Angular |
| `package.json` | Dependencias y scripts |

## 🎨 Personalización Rápida

### Cambiar Colores
Edita `src/material-theme.scss`:
```scss
color: (
  primary: mat.$blue-palette,     // Color primario
  tertiary: mat.$orange-palette,  // Color de acento
)
```

### Cambiar Textos
- Hero: `src/app/components/hero/hero.html`
- Features: `src/app/components/features/features.ts` (array `features`)
- Showcase: `src/app/components/showcase/showcase.ts` (array `showcaseItems`)
- Get Started: `src/app/components/get-started/get-started.ts` (array `steps`)

### Agregar Imágenes
1. Coloca imágenes en `public/`
2. Úsalas en HTML: `<img src="tu-imagen.png">`

## 🌐 Desplegar a GitHub Pages

### Automático (Recomendado)
1. Haz push a la rama `main`
2. GitHub Actions desplegará automáticamente

### Manual
```bash
npm run deploy
```

## 🆘 Problemas Comunes

### Puerto ocupado
```bash
ng serve --port 4300
```

### Error al compilar
```bash
rm -rf node_modules package-lock.json
npm install
```

### Estilos no se aplican
```bash
rm -rf .angular/cache
npm start
```

## 📚 Documentación Completa

- **README.md** - Información general
- **DEVELOPMENT.md** - Guía de desarrollo detallada
- **DEPLOYMENT.md** - Instrucciones de despliegue
- **PROJECT_SUMMARY.md** - Resumen del proyecto
- **LAYOUT_REFERENCE.md** - Referencia visual del diseño

## 🔗 Links Útiles

- [Angular Docs](https://angular.dev)
- [Angular Material](https://material.angular.dev)
- [Material Design 3](https://m3.material.io)

## ✨ Características Destacadas

✅ Angular 21 con Standalone Components
✅ Material Design 3
✅ Completamente Responsive
✅ Animaciones Fluidas
✅ SEO Optimizado
✅ GitHub Pages Ready
✅ Build Optimizado (~86 KB gzipped)

## 🎯 Próximos Pasos

1. Personaliza el contenido según tus necesidades
2. Agrega screenshots y demos de YotsubaEngine
3. Conecta los links de descarga y documentación
4. Despliega a GitHub Pages
5. Comparte con la comunidad

---

**¿Necesitas ayuda?** Revisa la documentación completa en los archivos MD del proyecto.
