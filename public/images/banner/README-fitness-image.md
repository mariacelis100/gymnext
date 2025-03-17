# Imagen de Banner Principal

## Imagen de Mujer con Ropa Deportiva Roja (fitness-woman-red.jpg)

Para solucionar el problema del banner descentrado, sigue estas instrucciones:

1. Guarda la imagen de la mujer con ropa deportiva roja (que nos compartiste) en esta carpeta con el nombre `fitness-woman-red.jpg`

2. La imagen debe tener las siguientes características:
   - Resolución recomendada: al menos 1200x800px
   - Formato: JPG de alta calidad
   - Orientación: vertical/retrato
   - Asegúrate que la mujer esté centrada en la imagen

3. El nuevo componente HeroBanner está configurado para mostrar esta imagen de forma centrada y con el texto superpuesto correctamente.

4. Si la imagen sigue descentrada, puedes ajustar la propiedad `objectPosition` en el componente HeroBanner:
   ```
   objectPosition: 'center 40%', // Prueba con diferentes valores: 'center center', 'center 30%', etc.
   ```

## Ubicación
Guarda la imagen directamente en:
```
/public/images/banner/fitness-woman-red.jpg
```

Si necesitas realizar más ajustes al posicionamiento, edita el archivo:
```
/src/features/home/components/hero-banner.component.tsx
``` 