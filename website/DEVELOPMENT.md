# YotsubaEngine Website - Guía de Desarrollo

## 📁 Estructura del Proyecto

```
website/
├── src/
│   ├── app/
│   │   ├── components/           # Componentes de la página
│   │   │   ├── hero/            # Sección hero principal
│   │   │   │   ├── hero.ts      # Lógica del componente
│   │   │   │   ├── hero.html    # Template HTML
│   │   │   │   └── hero.css     # Estilos del componente
│   │   │   ├── features/        # Grid de características
│   │   │   ├── showcase/        # Ejemplos de código
│   │   │   ├── get-started/     # Guía de inicio
│   │   │   └── footer/          # Footer del sitio
│   │   ├── app.ts               # Componente raíz
│   │   ├── app.html             # Template principal
│   │   ├── app.css              # Estilos globales del app
│   │   └── app.routes.ts        # Configuración de rutas
│   ├── material-theme.scss      # Tema personalizado Material
│   ├── styles.css              # Estilos globales
│   └── index.html              # HTML principal
├── angular.json                 # Configuración de Angular
├── package.json                 # Dependencias y scripts
├── tsconfig.json               # Configuración de TypeScript
├── README.md                   # Documentación del sitio
└── DEPLOYMENT.md               # Guía de despliegue

```

## 🎨 Diseño y Componentes

### Hero Section
- **Ubicación**: `src/app/components/hero/`
- **Descripción**: Sección principal con título, descripción, botones CTA y preview de código
- **Características**:
  - Animaciones de entrada (fadeInUp, fadeInRight)
  - Botones de descarga y learn more
  - Estadísticas del engine (100% Open Source, 6+ Platforms, C#)
  - Vista previa de código con sintaxis destacada
  - Patrón de grid animado de fondo

### Features Section
- **Ubicación**: `src/app/components/features/`
- **Descripción**: Grid responsive con las 9 características principales
- **Características**:
  - Cards con iconos Material Design
  - Efecto hover con elevación
  - Animaciones escalonadas al cargar
  - Grid adaptativo (3 columnas desktop, 1 columna móvil)

### Showcase Section
- **Ubicación**: `src/app/components/showcase/`
- **Descripción**: Ejemplos de código con explicaciones
- **Características**:
  - 3 ejemplos principales de API
  - Diseño alternado (izquierda-derecha)
  - Bloques de código con syntax highlight simulado
  - Responsive con orden cambiado en móvil

### Get Started Section
- **Ubicación**: `src/app/components/get-started/`
- **Descripción**: Guía paso a paso para comenzar
- **Características**:
  - 4 pasos numerados con conectores visuales
  - Comandos copiables con botón
  - CTA final con gradiente
  - Animaciones fadeInLeft

### Footer
- **Ubicación**: `src/app/components/footer/`
- **Descripción**: Footer con links y información
- **Características**:
  - Logo y descripción del proyecto
  - Links organizados en columnas (Producto, Desarrolladores, Comunidad)
  - Social links con iconos
  - Copyright y links legales

## 🎨 Sistema de Diseño

### Colores

El tema usa Material Design 3 con colores personalizados:

```scss
color: (
  primary: mat.$azure-palette,    // Azul vibrante (estilo Godot)
  tertiary: mat.$orange-palette,  // Naranja/Rosa energético
)
```

### Tipografía

```css
Font Family: 'Inter', system-ui, -apple-system, sans-serif
Weights: 300, 400, 500, 600, 700, 800, 900

Tamaños:
- Hero Title: 4rem (64px)
- Section Title: 2.5rem (40px)
- Subtitle: 1.5rem (24px)
- Body: 1rem (16px)
```

### Espaciado

```css
Padding de Secciones: 80px vertical
Container Max-Width: 1200px
Gap en Grids: 24px - 60px
```

### Breakpoints

```css
Desktop: > 968px
Tablet: 640px - 968px
Mobile: < 640px
```

## 🔧 Comandos Útiles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# Iniciar con puerto específico
ng serve --port 4300

# Abrir automáticamente en navegador
ng serve --open
```

### Build

```bash
# Build de desarrollo
npm run build

# Build de producción
npm run build:prod

# Build con análisis de bundle
ng build --configuration production --stats-json
npx webpack-bundle-analyzer dist/website/browser/stats.json
```

### Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
ng test --code-coverage

# Tests en modo watch
ng test --watch
```

### Linting

```bash
# Lint del código
ng lint

# Fix automático
ng lint --fix
```

## 🎯 Personalización

### Cambiar Colores del Tema

Edita `src/material-theme.scss`:

```scss
@include mat.theme((
  color: (
    primary: mat.$blue-palette,    // Cambia aquí
    tertiary: mat.$green-palette,  // y aquí
  ),
));
```

### Modificar Contenido

1. **Textos Hero**: Edita `src/app/components/hero/hero.html`
2. **Features**: Modifica el array en `src/app/components/features/features.ts`
3. **Showcase**: Actualiza `showcaseItems` en `src/app/components/showcase/showcase.ts`
4. **Pasos**: Cambia `steps` en `src/app/components/get-started/get-started.ts`

### Agregar Nuevas Secciones

```bash
# Generar nuevo componente
ng generate component components/mi-seccion --skip-tests

# Importar en app.ts
import { MiSeccion } from './components/mi-seccion/mi-seccion';

# Agregar a imports array en app.ts
imports: [
  // ... otros imports
  MiSeccion
]

# Usar en app.html
<app-mi-seccion></app-mi-seccion>
```

## 🐛 Debugging

### Angular DevTools

1. Instala [Angular DevTools](https://angular.dev/tools/devtools) en Chrome
2. Abre Chrome DevTools
3. Selecciona pestaña "Angular"

### Problemas Comunes

**Estilos no se aplican**
```bash
# Limpia caché de Angular
rm -rf .angular/cache
ng serve
```

**Error de compilación**
```bash
# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

**Error en build de producción**
```bash
# Aumenta memoria de Node.js
export NODE_OPTIONS=--max-old-space-size=4096
ng build --configuration production
```

## 📊 Performance

### Optimizaciones Aplicadas

- ✅ Lazy loading de rutas (preparado para futuro)
- ✅ OnPush change detection (puede implementarse)
- ✅ Production builds con AOT
- ✅ Tree shaking automático
- ✅ Minificación de CSS/JS
- ✅ Optimización de imágenes (cuando se agreguen)

### Métricas Objetivo

```
First Contentful Paint: < 1.5s
Time to Interactive: < 3.5s
Lighthouse Score: > 90
Bundle Size: < 500KB
```

## 🔐 Seguridad

### Headers Recomendados

Si usas un CDN o servidor custom, agrega estos headers:

```
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
```

## 📈 Analytics (Opcional)

### Integrar Google Analytics

1. Instala el paquete:
```bash
npm install --save @angular/fire
```

2. Agrega en `index.html` antes de `</head>`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🤝 Contribución

### Flujo de Trabajo

1. Fork del repositorio
2. Crear rama: `git checkout -b feature/nueva-seccion`
3. Hacer cambios y commits
4. Push: `git push origin feature/nueva-seccion`
5. Crear Pull Request

### Estándares de Código

- Usa componentes standalone
- Sigue convenciones de Angular Style Guide
- Prefiere composición sobre herencia
- Escribe código autodocumentado
- Agrega comentarios para lógica compleja

### Checklist de PR

- [ ] El código compila sin errores
- [ ] Estilos consistentes con el diseño actual
- [ ] Responsive en móvil, tablet y desktop
- [ ] Sin errores de consola
- [ ] Documentación actualizada

## 📚 Recursos

- [Angular Docs](https://angular.dev)
- [Angular Material](https://material.angular.dev)
- [Material Design 3](https://m3.material.io)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🆘 Soporte

Si encuentras problemas:
1. Revisa esta documentación
2. Busca en GitHub Issues
3. Crea un nuevo issue con detalles
4. Únete a Discord (próximamente)
