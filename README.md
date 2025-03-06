# Copa de la Casa - Panel de Puntuaciones

Una aplicación web moderna para mostrar las puntuaciones de la competición "Copa de la Casa" entre las casas PUB, MIM, TUR y GAP. La aplicación consume datos de una hoja de cálculo de Google Sheets.

## 📋 Características

- **Diseño Moderno y Responsivo**: Interfaz limpia y moderna que se adapta a diferentes tamaños de pantalla.
- **Actualización en Tiempo Real**: Botón para actualizar los datos desde la hoja de cálculo.
- **Animaciones Visuales**: Transiciones y animaciones suaves para una mejor experiencia de usuario.
- **Historial de Puntuaciones**: Muestra las últimas entradas del historial de puntos.
- **Personalizado para las Casas**: Cada casa tiene sus propios colores e iconos.

## 🚀 Instalación

1. Clona este repositorio o descarga los archivos.
2. No se requiere instalación adicional, pues es una aplicación web estática.

## ⚙️ Configuración

### 1. Configurar la hoja de cálculo de Google

1. Crea una nueva hoja de cálculo en Google Sheets.
2. En la primera hoja, renómbrala a "Puntuaciones".
3. Configura los encabezados en la primera fila, incluyendo los nombres de las casas: PUB, MIM, TUR, GAP.
4. En la segunda fila, coloca las puntuaciones actuales de cada casa.
5. A partir de la tercera fila, puedes añadir el historial de puntos con el siguiente formato:
   - Columna A: Fecha
   - Columnas de las casas: Puntos otorgados (solo llenar la columna de la casa que recibió puntos)
   - Última columna: Descripción o razón de los puntos

### 2. Configurar la API de Google Sheets

1. Ve a la [Consola de Google Cloud](https://console.cloud.google.com/).
2. Crea un nuevo proyecto o selecciona uno existente.
3. Habilita la API de Google Sheets para tu proyecto.
4. Crea una clave de API con restricciones adecuadas.
5. Establece tu hoja de cálculo como pública para lectura.

### 3. Configurar la aplicación

Abre el archivo `js/script.js` y modifica las siguientes líneas al inicio del archivo:

```javascript
const CONFIG = {
    // ID de la hoja de Google Sheets (ID que aparece en la URL de tu hoja)
    sheetId: 'TU_ID_DE_HOJA_DE_GOOGLE',
    
    // API Key de Google Sheets
    apiKey: 'TU_API_KEY_DE_GOOGLE',
    
    // Rango de datos que queremos obtener de la hoja
    range: 'Puntuaciones!A1:Z100',
    
    // ... resto de la configuración
};
```

## 🧪 Modo de prueba

Para probar la aplicación sin conectar a Google Sheets, puedes descomentar la última línea del archivo `js/script.js`:

```javascript
// Descomentar esta línea para cargar datos de prueba
loadMockData();
```

## 🖥️ Despliegue

Puedes desplegar esta aplicación en cualquier servidor web estático:

- GitHub Pages
- Netlify
- Vercel
- O simplemente abrir el archivo `index.html` en un navegador web

## 📝 Estructura de archivos

```
copa-de-la-casa/
│
├── index.html           # Página principal
├── css/
│   └── styles.css       # Estilos de la aplicación
├── js/
│   └── script.js        # Lógica de la aplicación
└── README.md            # Este archivo
```

## 🛠️ Tecnologías utilizadas

- HTML5
- CSS3 (con variables CSS y flexbox/grid)
- JavaScript (ES6+)
- Google Sheets API v4
- Font Awesome para iconos
- Google Fonts (Poppins)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles. 