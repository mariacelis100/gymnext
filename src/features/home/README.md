# COSMOS GYM Landing Page

## Implementación Actual
Hemos creado una landing page para COSMOS GYM siguiendo el diseño de la imagen de referencia. La implementación incluye:

1. **Barra de navegación** con logo real y cambio entre tema claro/oscuro
2. **Banner principal** con patrón geométrico de fondo
3. **Banner promocional** similar al de la imagen de referencia
4. **Tarjetas de características** para mostrar los servicios

## Imágenes Necesarias
Para completar la implementación, necesitas guardar las siguientes imágenes:

1. **Logo de COSMOS GYM (versión azul)**: 
   - Ruta: `/public/images/logo/cosmos-gym-logo-blue.png`
   - Color: Azul (#0043A4) sobre fondo transparente
   - Para tema claro

2. **Logo de COSMOS GYM (versión blanca)**: 
   - Ruta: `/public/images/logo/cosmos-gym-logo-white.png`
   - Color: Blanco (#FFFFFF) sobre fondo transparente
   - Para tema oscuro

3. **Patrón geométrico**:
   - Ruta: `/public/images/banner/cosmos-pattern.png`
   - Patrón de fondo azul geométrico como se ve en la imagen de referencia
   - Se usa como fondo en el banner y promo

4. **Imagen del modelo fitness**:
   - Ruta: `/public/images/banner/fitness-model.jpg`
   - Imagen de persona en ropa deportiva
   - Se usa en el banner promocional

## Cómo Usar
1. Guarda las imágenes en las rutas especificadas
2. Inicia el servidor con `npm run dev`
3. Abre tu navegador en `http://localhost:3000`
4. Prueba el cambio de tema con el botón de cambio de tema

## Estilo y Tipografía
- La tipografía usa la fuente Orbitron para un aspecto futurista
- Colores principales:
  - Azul del logo: #0043A4 (color principal)
  - Azul oscuro: #0A1A3F (fondo del tema claro)
  - Azul brillante: #00B7FF (acentos)
  - Negro rico: #0A0C10 (fondo del tema oscuro)
  - Blanco: #FFFFFF (texto principal)

## Adaptaciones para Dispositivos
La interfaz es completamente responsive y se adapta a:
- **Móviles**: Vista simplificada con menú hamburguesa
- **Tablets**: Diseño optimizado para tamaño medio
- **Desktop**: Diseño completo con todas las características

## Temas Claro/Oscuro
La aplicación implementa dos temas basados en el archivo .context:
1. **Tema Claro**: Fondo azul marino (#0A1A3F) con logo azul
2. **Tema Oscuro**: Fondo negro rico (#0A0C10) con logo blanco

## Próximos Pasos
1. Agregar funcionalidad al botón de cambio de tema
2. Implementar formulario de contacto
3. Añadir sección de testimonios
4. Crear página detallada para cada servicio 