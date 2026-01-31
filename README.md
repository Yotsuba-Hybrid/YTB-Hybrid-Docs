# YotsubaEngine Website

Sitio web promocional oficial de YotsubaEngine construido con Angular 21 y Angular Material.

## 🚀 Características

- **Angular 21**: Framework moderno y potente
- **Angular Material**: Componentes Material Design 3
- **Responsive Design**: Funciona perfectamente en todos los dispositivos
- **Diseño Moderno**: Inspirado en Godot Engine
- **Animaciones Fluidas**: Experiencia de usuario mejorada
- **SEO Optimizado**: Meta tags y estructura semántica

## 🛠️ Desarrollo

### Prerequisitos

- Node.js 20.x o superior
- npm 10.x o superior

### Instalación

```bash
npm install
```

### Servidor de Desarrollo

```bash
npm start
# o
ng serve
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias algún archivo fuente.

### Build

```bash
npm run build
# o
ng build
```

Los archivos compilados se guardarán en el directorio `dist/`.

### Build para Producción

```bash
ng build --configuration production
```

## 📦 Despliegue en GitHub Pages

### Configuración

1. Instala el paquete `angular-cli-ghpages`:

```bash
npm install -g angular-cli-ghpages
```

2. Construye y despliega:

```bash
ng build --configuration production --base-href "/YotsubaEngine/"
npx angular-cli-ghpages --dir=dist/website/browser
```

### Configuración Automática con GitHub Actions

El proyecto incluye un workflow de GitHub Actions que automáticamente construye y despliega el sitio en cada push a la rama principal.

## 🎨 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── hero/          # Sección hero con CTA
│   │   ├── features/      # Grid de características
│   │   ├── showcase/      # Ejemplos de código
│   │   ├── get-started/   # Guía de inicio rápido
│   │   └── footer/        # Footer con links
│   ├── app.component.*    # Componente raíz
│   └── app.routes.ts      # Configuración de rutas
├── material-theme.scss    # Tema personalizado de Material
├── styles.css            # Estilos globales
└── index.html           # HTML principal
```

## 🎨 Personalización

### Colores del Tema

Edita `src/material-theme.scss` para cambiar los colores del tema:

```scss
color: (
  primary: mat.$azure-palette,    // Color primario
  tertiary: mat.$orange-palette,  // Color secundario
),
```

### Tipografía

La fuente por defecto es Inter. Para cambiarla, modifica:

1. `src/index.html` - Actualiza el link de Google Fonts
2. `src/material-theme.scss` - Actualiza la familia de fuentes en typography
3. `src/styles.css` - Actualiza font-family global

## 📝 Licencia

MIT License - Ver el archivo LICENSE del proyecto principal.

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

- GitHub: [YotsubaEngine](https://github.com/yourusername/YotsubaEngine)
- Documentación: (Próximamente)
- Discord: (Próximamente)
