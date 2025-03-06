// Script para verificar los valores de celdas específicas
const CONFIG = {
    // ID de la hoja de Google Sheets
    sheetId: '1234567890', // Tu ID de hoja de cálculo
    
    // API Key de Google Sheets
    apiKey: process.env.GOOGLE_SHEETS_API_KEY || '',
    
    // Rangos específicos que queremos verificar
    ranges: [
        'Resultados Finales!D2', // GAP
        'Resultados Finales!D5', // MIM
        'Resultados Finales!D7', // PUB
        'Resultados Finales!D9'  // TUR
    ],
    
    // Rango completo para análisis
    rangoCompleto: 'Resultados Finales!A1:Z50'
};

// Función para obtener los valores de las celdas
async function checkCellValues() {
    // URL de la API de Google Sheets para obtener múltiples rangos
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.sheetId}/values:batchGet?ranges=${CONFIG.ranges.join('&ranges=')}&key=${CONFIG.apiKey}`;
    
    console.log('Consultando las celdas específicas...');
    console.log('URL de la API para celdas específicas:', apiUrl);
    
    try {
        // Obtener celdas específicas
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('\nRespuesta para celdas específicas:');
        
        if (data.valueRanges) {
            console.log('\nValores de las celdas específicas:');
            console.log('----------------------------------');
            
            // GAP - D2
            const gapValue = data.valueRanges[0].values ? data.valueRanges[0].values[0][0] : 'No disponible';
            console.log('GAP (D2):', gapValue);
            
            // MIM - D5
            const mimValue = data.valueRanges[1].values ? data.valueRanges[1].values[0][0] : 'No disponible';
            console.log('MIM (D5):', mimValue);
            
            // PUB - D7
            const pubValue = data.valueRanges[2].values ? data.valueRanges[2].values[0][0] : 'No disponible';
            console.log('PUB (D7):', pubValue);
            
            // TUR - D9
            const turValue = data.valueRanges[3].values ? data.valueRanges[3].values[0][0] : 'No disponible';
            console.log('TUR (D9):', turValue);
            
            // Mostrar un resumen
            console.log('\nResumen de valores:');
            console.log('------------------');
            console.log('- GAP (D2):', gapValue === 'No disponible' ? '❌ No existe' : `✅ ${gapValue}`);
            console.log('- MIM (D5):', mimValue === 'No disponible' ? '❌ No existe' : `✅ ${mimValue}`);
            console.log('- PUB (D7):', pubValue === 'No disponible' ? '❌ No existe' : `✅ ${pubValue}`);
            console.log('- TUR (D9):', turValue === 'No disponible' ? '❌ No existe' : `✅ ${turValue}`);
        } else {
            console.log('No se encontraron rangos de valores en la respuesta.');
        }
        
        // Obtener el rango completo para análisis de la estructura
        console.log('\nConsultando toda la hoja para análisis de estructura...');
        const responseCompleto = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.sheetId}/values/${CONFIG.rangoCompleto}?key=${CONFIG.apiKey}`);
        
        if (!responseCompleto.ok) {
            throw new Error(`Error HTTP al obtener rango completo: ${responseCompleto.status}`);
        }
        
        const dataCompleto = await responseCompleto.json();
        
        if (dataCompleto.values && dataCompleto.values.length > 0) {
            console.log('\nEstructura de la hoja:');
            console.log('---------------------');
            console.log(`La hoja tiene ${dataCompleto.values.length} filas.`);
            
            // Buscar casas por nombre
            console.log('\nBúsqueda de casas por nombre:');
            const casasEncontradas = {
                GAP: { encontrada: false, fila: -1, columna: -1 },
                MIM: { encontrada: false, fila: -1, columna: -1 },
                PUB: { encontrada: false, fila: -1, columna: -1 },
                TUR: { encontrada: false, fila: -1, columna: -1 }
            };
            
            for (let i = 0; i < dataCompleto.values.length; i++) {
                const row = dataCompleto.values[i];
                if (!row) continue;
                
                for (let j = 0; j < row.length; j++) {
                    const cell = row[j];
                    if (!cell) continue;
                    
                    const cellText = String(cell).trim().toUpperCase();
                    if (['GAP', 'MIM', 'PUB', 'TUR'].includes(cellText)) {
                        casasEncontradas[cellText] = { 
                            encontrada: true, 
                            fila: i + 1, 
                            columna: j + 1,
                            puntuacion: row.length > 3 ? row[3] : 'No disponible'
                        };
                    }
                }
            }
            
            // Mostrar resultados de búsqueda
            console.log('- GAP:', casasEncontradas.GAP.encontrada 
                ? `✅ Encontrada en fila ${casasEncontradas.GAP.fila}, columna ${casasEncontradas.GAP.columna}. Puntuación en columna D: ${casasEncontradas.GAP.puntuacion}` 
                : '❌ No encontrada por nombre');
            console.log('- MIM:', casasEncontradas.MIM.encontrada 
                ? `✅ Encontrada en fila ${casasEncontradas.MIM.fila}, columna ${casasEncontradas.MIM.columna}. Puntuación en columna D: ${casasEncontradas.MIM.puntuacion}` 
                : '❌ No encontrada por nombre');
            console.log('- PUB:', casasEncontradas.PUB.encontrada 
                ? `✅ Encontrada en fila ${casasEncontradas.PUB.fila}, columna ${casasEncontradas.PUB.columna}. Puntuación en columna D: ${casasEncontradas.PUB.puntuacion}` 
                : '❌ No encontrada por nombre');
            console.log('- TUR:', casasEncontradas.TUR.encontrada 
                ? `✅ Encontrada en fila ${casasEncontradas.TUR.fila}, columna ${casasEncontradas.TUR.columna}. Puntuación en columna D: ${casasEncontradas.TUR.puntuacion}` 
                : '❌ No encontrada por nombre');
            
            // Analizar la estructura de la columna D
            console.log('\nValores en la columna D (índice 3):');
            for (let i = 0; i < Math.min(dataCompleto.values.length, 15); i++) {
                const row = dataCompleto.values[i];
                if (row && row.length > 3) {
                    console.log(`D${i+1}: "${row[3]}"`);
                } else {
                    console.log(`D${i+1}: [celda vacía]`);
                }
            }
            
            if (dataCompleto.values.length > 15) {
                console.log('... (mostrando solo las primeras 15 filas)');
            }
        } else {
            console.log('La hoja de cálculo está vacía o no se recibieron datos.');
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

// Ejecutar la función de verificación
checkCellValues(); 