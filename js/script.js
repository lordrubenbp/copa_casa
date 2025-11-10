
// Configuración


const CONFIG = {
    // ID de la hoja de Google Sheets
    //sheetId: process.env.sheetId,
    
    // API Key de Google Sheets
    //apiKey: process.env.apiKey,

    // Elimina o comenta esta línea:
// const apiKey = process.env.API_KEY;
    // Rango de datos que queremos obtener de la hoja
    range: 'Resultados Finales!A1:Z100',
    
    // Configuración de las casas
    houses: {
        PUB: {
            name: 'PUB',
            color: '#808080', // Gris
            shield: 'escudos/Escudo_PUB.png', // Escudo de la casa PUB
            description: 'Casa PUB - El astuto Zorro gris, símbolo de inteligencia y adaptabilidad'
        },
        MIM: {
            name: 'MIM',
            color: '#fb8500', // Naranja
            shield: 'escudos/Escudo_MIM.png', // Escudo de la casa MIM
            description: 'Casa MIM - El poderoso León naranja, símbolo de fuerza y liderazgo'
        },
        TUR: {
            name: 'TUR',
            color: '#219ebc', // Azul
            shield: 'escudos/Escudo_TUR.png', // Escudo de la casa TUR
            description: 'Casa TUR - El valiente Oso azul, símbolo de determinación y resistencia'
        },
        GAP: {
            name: 'GAP',
            color: '#e63946', // Rojo
            shield: 'escudos/Escudo_GAP.png', // Escudo de la casa GAP
            description: 'Casa GAP - La majestuosa Águila roja, símbolo de visión y libertad'
        }
    }
};

// Estado de la aplicación
let appState = {
    scores: {},
    prevScores: {}, // Puntuaciones anteriores para comparación
    history: [],
    lastUpdate: null
};

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Cargar puntuaciones previas de localStorage
    loadPreviousScores();
    
    // Inicializar la interfaz
    initializeApp();
    
    // Mostrar mensaje informativo sobre la funcionalidad de historial
    showInfoMessage();
    
    
    
        fetchData();

       
    
});

// Muestra un mensaje informativo sobre el almacenamiento y comparación de puntuaciones
function showInfoMessage() {
    // Verificar si ya se mostró el mensaje hoy (para no mostrarlo cada vez que se recargue la página)
    const lastMessageShown = localStorage.getItem('lastInfoMessageShown');
    const today = new Date().toDateString();
    
    if (lastMessageShown !== today) {
        // Crear el mensaje
        const statusMessage = document.createElement('div');
        statusMessage.className = 'status-message';
        statusMessage.style.backgroundColor = '#2196F3';
        statusMessage.style.color = 'white';
        statusMessage.innerHTML = '<i class="fas fa-info-circle"></i> Las puntuaciones ahora se guardan localmente y se comparan al actualizar, mostrando los cambios en el historial.';
        document.body.appendChild(statusMessage);
        
        // Eliminar el mensaje después de 6 segundos
        setTimeout(() => {
            statusMessage.classList.add('fade-out');
            setTimeout(() => {
                if (statusMessage.parentNode) {
                    statusMessage.parentNode.removeChild(statusMessage);
                }
            }, 500);
        }, 6000);
        
        // Guardar fecha para no mostrar de nuevo hoy
        localStorage.setItem('lastInfoMessageShown', today);
    }
}

// Función para cargar puntuaciones previas de localStorage
function loadPreviousScores() {
    try {
        const savedScores = localStorage.getItem('houseScores');
        const lastUpdate = localStorage.getItem('lastUpdate');
        
        if (savedScores) {
            appState.prevScores = JSON.parse(savedScores);
            console.log('Puntuaciones anteriores cargadas:', appState.prevScores);
            
            // Actualizar información de última actualización en la interfaz si existe
            if (lastUpdate) {
                updateLastSavedInfo(new Date(lastUpdate));
            }
        } else {
            console.log('No hay puntuaciones previas guardadas');
            appState.prevScores = { GAP: 0, MIM: 0, PUB: 0, TUR: 0 };
        }
    } catch (error) {
        console.error('Error al cargar puntuaciones previas:', error);
        appState.prevScores = { GAP: 0, MIM: 0, PUB: 0, TUR: 0 };
    }
}

// Función para guardar puntuaciones actuales en localStorage
function saveCurrentScores() {
    try {
        const now = new Date();
        localStorage.setItem('houseScores', JSON.stringify(appState.scores));
        localStorage.setItem('lastUpdate', now.toISOString());
        console.log('Puntuaciones actuales guardadas:', appState.scores);
        
        // Actualizar información de última actualización en la interfaz
        updateLastSavedInfo(now);
    } catch (error) {
        console.error('Error al guardar puntuaciones:', error);
    }
}

// Actualiza la información de la última actualización en la interfaz
function updateLastSavedInfo(date) {
    const historyTitle = document.querySelector('.history-section h2');
    if (historyTitle) {
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        // Crear o actualizar el elemento de información
        let infoElement = document.getElementById('last-saved-info');
        if (!infoElement) {
            infoElement = document.createElement('div');
            infoElement.id = 'last-saved-info';
            infoElement.className = 'last-saved-info';
            historyTitle.insertAdjacentElement('afterend', infoElement);
        }
        
        infoElement.innerHTML = `<i class="fas fa-history"></i> Última comparación: ${formattedDate}`;
    }
}

// Inicializa la interfaz de usuario
function initializeApp() {
    // Crear las tarjetas de las casas
    const housesContainer = document.getElementById('houses-container');
    housesContainer.innerHTML = '';
    
    // Crear un objeto para almacenar las tarjetas de las casas
    const houseCards = {};
    
    // Primero crear todas las tarjetas
    Object.keys(CONFIG.houses).forEach(houseCode => {
        const house = CONFIG.houses[houseCode];
        
        const houseCard = document.createElement('div');
        houseCard.className = 'house-card';
        houseCard.id = `house-${houseCode.toLowerCase()}`;
        houseCard.setAttribute('title', house.description);
        houseCard.setAttribute('data-house', houseCode);
        
        // Nuevo formato: posición, logo con color de fondo, y puntos a la derecha
        houseCard.innerHTML = `
            <div class="house-position-indicator position-1">1</div>
            <div class="house-info ${houseCode.toLowerCase()}-bg">
                <div class="house-shield">
                    <img src="${house.shield}" alt="Escudo ${house.name}" class="shield-image">
                </div>
                <h3 class="house-name">${house.name}</h3>
            </div>
            <div class="house-score">
                <div class="score-number">0</div>
                <div class="score-label">puntos</div>
            </div>
        `;
        
        // Almacenar la tarjeta en el objeto
        houseCards[houseCode] = houseCard;
    });
    
    // Si hay puntuaciones existentes, ordenar las tarjetas antes de añadirlas
    if (Object.keys(appState.scores).length > 0) {
        // Ordenar las casas por puntuación
        const sortedHouses = Object.keys(appState.scores)
            .sort((a, b) => appState.scores[b] - appState.scores[a]);
            
        // Añadir las tarjetas en orden de puntuación
        sortedHouses.forEach((houseCode, index) => {
            const houseCard = houseCards[houseCode];
            if (houseCard) {
                const position = index + 1;
                houseCard.setAttribute('data-position', position);
                
                // Actualizar el indicador de posición
                const positionIndicator = houseCard.querySelector('.house-position-indicator');
                positionIndicator.textContent = position;
                positionIndicator.className = `house-position-indicator position-${position}`;
                
                // Actualizar la puntuación
                const scoreElement = houseCard.querySelector('.score-number');
                scoreElement.textContent = appState.scores[houseCode];
                
                housesContainer.appendChild(houseCard);
            }
        });
    } else {
        // Si no hay puntuaciones, añadir las tarjetas en orden alfabético
        Object.keys(houseCards).sort().forEach((houseCode, index) => {
            const houseCard = houseCards[houseCode];
            const position = index + 1;
            houseCard.setAttribute('data-position', position);
            
            // Actualizar el indicador de posición
            const positionIndicator = houseCard.querySelector('.house-position-indicator');
            positionIndicator.textContent = position;
            positionIndicator.className = `house-position-indicator position-${position}`;
            
            housesContainer.appendChild(houseCard);
        });
    }
}

// Obtiene los datos de la API de Google Sheets
function fetchData() {

    // Mostrar indicador de carga
    document.getElementById('refresh-btn').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualizando...';

   fetch('/.netlify/functions/googleSheet')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    
    document.getElementById('refresh-btn').addEventListener('click', fetchData);
    
    processData(data);
            
    // Actualizar la interfaz con los nuevos datos
    updateUI();
    
    // Restaurar el botón de actualizar
    document.getElementById('refresh-btn').innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
    
    // Mostrar mensaje de éxito
    const footer = document.querySelector('footer p');
    if (footer) {
        const fechaActual = new Date();
        footer.innerHTML = `Copa de la Casa © ${fechaActual.getFullYear()} - Datos actualizados de la hoja: <a href="https://docs.google.com/spreadsheets/d/17-0KUikEdMoseLPJOqLJFQ9lNCjCziImRuHO4jJX02c" target="_blank">Proyecto piloto</a> - Última actualización: ${fechaActual.toLocaleString()}`;
    }
    
    // Añadir un mensaje de estado temporal
    const statusMessage = document.createElement('div');
    statusMessage.className = 'status-message success';
    statusMessage.innerHTML = '<i class="fas fa-check-circle"></i> Datos actualizados correctamente (leyendo celdas específicas: GAP:D2, MIM:D5, PUB:D7, TUR:D9)';
    document.body.appendChild(statusMessage);
    
    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
        statusMessage.classList.add('fade-out');
        setTimeout(() => {
            if (statusMessage.parentNode) {
                statusMessage.parentNode.removeChild(statusMessage);
            }
        }, 500);
    }, 3000);
  })
  .catch(error => {

    // Cargar datos de prueba si no hay API key configurada
    loadMockData();
        
    // Mostrar mensaje de que se están usando datos de prueba
    const refreshBtn = document.getElementById('refresh-btn');
    refreshBtn.innerHTML = '<i class="fas fa-info-circle"></i> Usando datos de prueba';
    refreshBtn.style.backgroundColor = '#f0ad4e';
    
    // Cambiar la funcionalidad del botón para mostrar un mensaje informativo
    refreshBtn.addEventListener('click', function() {
        alert('Para obtener datos reales, configura tu API key de Google Sheets en el archivo js/script.js');
    });
    console.error('Error al obtener los datos:', error);
    
    // Mensaje de error en la interfaz
    const housesContainer = document.getElementById('houses-container');
    housesContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>No se pudieron cargar los datos de la hoja de cálculo.</p>
            <p>El sistema intentará leer estas celdas (si existen):</p>
            <ul>
                <li>GAP: celda D2</li>
                <li>MIM: celda D5</li>
                <li>PUB: celda D7</li>
                <li>TUR: celda D9</li>
            </ul>
            <p>Si alguna celda no existe, se leerá como 0 puntos.</p>
            <p class="error-details">${error.message}</p>
        </div>
    `;
    
    // Restaurar el botón de actualizar
    document.getElementById('refresh-btn').innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
    
    // Añadir mensaje de estado de error
    const statusMessage = document.createElement('div');
    statusMessage.className = 'status-message error';
    statusMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error al cargar los datos. Revisa la configuración.';
    document.body.appendChild(statusMessage);
    
    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
        statusMessage.classList.add('fade-out');
        setTimeout(() => {
            if (statusMessage.parentNode) {
                statusMessage.parentNode.removeChild(statusMessage);
            }
        }, 500);
    }, 5000);
});

   
    
    
    
    
}

// Procesa los datos recibidos de la API
function processData(data) {
    // Verificar si hay datos
    if (!data.values || data.values.length === 0) {
        console.error('No hay datos en la hoja de cálculo.');
        throw new Error('No hay datos en la hoja de cálculo. Verifica que la hoja no esté vacía.');
    }
    
    console.log('Datos recibidos de la API:', data.values);
    
    // Inicializar puntuaciones con celdas específicas según la instrucción del usuario:
    // GAP: celda d2 (índice 3, fila 1)
    // MIM: celda d5 (índice 3, fila 4)
    // PUB: celda d7 (índice 3, fila 6)
    // TUR: celda d9 (índice 3, fila 8)
    const scores = {
        GAP: 0,
        MIM: 0, 
        PUB: 0,
        TUR: 0
    };
    
    try {
        console.log('Intentando leer puntuaciones de celdas específicas (aunque no todas las filas existan):');
        
        // Función auxiliar para leer una celda de forma segura
        function leerCeldaSegura(fila, columna, casa) {
            if (data.values.length > fila && data.values[fila] && data.values[fila].length > columna) {
                const valor = String(data.values[fila][columna]).trim();
                console.log(`Celda para ${casa} (fila ${fila+1}, columna ${columna+1}):`, valor);
                
                // Rechazar valores que contengan el símbolo de porcentaje
                if (valor.includes('%')) {
                    console.log(`La celda para ${casa} contiene un porcentaje y será ignorada:`, valor);
                    return 0;
                }
                
                const numeroParseado = parseInt(valor);
                if (!isNaN(numeroParseado)) {
                    return numeroParseado;
                } else {
                    console.log(`La celda para ${casa} no contiene un número válido:`, valor);
                }
            } else {
                console.log(`No se puede acceder a la celda para ${casa} (fila ${fila+1}, columna ${columna+1}) - No existe`);
            }
            return 0;
        }
        
        // Leer cada casa individualmente desde la columna D (índice 3)
        // Los índices de fila son: fila hoja - 1 (porque el array empieza en 0)
        scores.GAP = leerCeldaSegura(1, 3, 'GAP');  // D2 (fila 2, índice 1, columna D índice 3)
        scores.MIM = leerCeldaSegura(3, 3, 'MIM');  // D4 (fila 4, índice 3, columna D índice 3)
        scores.PUB = leerCeldaSegura(5, 3, 'PUB');  // D6 (fila 6, índice 5, columna D índice 3)
        scores.TUR = leerCeldaSegura(7, 3, 'TUR');  // D8 (fila 8, índice 7, columna D índice 3)
        
        // Mostrar las puntuaciones leídas
        console.log('Puntuaciones leídas directamente:', scores);
        
        // Alternativa: búsqueda inteligente si no encontramos puntuaciones en las celdas específicas
        if (scores.GAP === 0 && scores.MIM === 0 && scores.PUB === 0 && scores.TUR === 0) {
            console.log('No se encontraron puntuaciones en las celdas específicas. Intentando búsqueda por nombre de casa...');
            
            // Buscar en toda la hoja las casas por nombre
            for (let i = 0; i < data.values.length; i++) {
                const row = data.values[i];
                if (!row) continue;
                
                for (let j = 0; j < row.length; j++) {
                    const cell = row[j];
                    if (!cell) continue;
                    
                    // Verificar si la celda contiene el nombre de una casa
                    const cellText = String(cell).trim().toUpperCase();
                    if (['GAP', 'MIM', 'PUB', 'TUR'].includes(cellText)) {
                        console.log(`Encontrada casa ${cellText} en fila ${i+1}, columna ${j+1}`);
                        
                        // Intentar leer puntuación en la columna D (índice 3) de esta fila
                        if (row.length > 3 && !isNaN(parseInt(row[3]))) {
                            scores[cellText] = parseInt(row[3]);
                            console.log(`Puntuación para ${cellText}: ${scores[cellText]}`);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error al procesar las puntuaciones:', error);
    }
    
    console.log('Puntuaciones procesadas:', scores);
    
    // Calcular diferencias entre puntuaciones actuales y anteriores
    const differences = calculateDifferences(scores, appState.prevScores);
    console.log('Diferencias calculadas:', differences);
    
    // Generar historial a partir de las diferencias y puntuaciones
    const history = generateHistoryFromDifferences(differences);
    
    // Actualizar el estado de la aplicación
    appState.scores = scores;
    appState.history = history;
    appState.lastUpdate = new Date();
    
    // Guardar puntuaciones actuales para la próxima comparación
    saveCurrentScores();
}

// Calcula las diferencias entre puntuaciones actuales y anteriores
function calculateDifferences(currentScores, previousScores) {
    const differences = {};
    
    Object.keys(currentScores).forEach(house => {
        const current = currentScores[house] || 0;
        const previous = previousScores[house] || 0;
        const diff = current - previous;
        
        differences[house] = {
            current: current,
            previous: previous,
            difference: diff
        };
    });
    
    return differences;
}

// Genera entradas de historial a partir de las diferencias
function generateHistoryFromDifferences(differences) {
    const history = [];
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
    // Crear entradas de historial para cada casa
    Object.keys(differences).forEach(house => {
        const diff = differences[house];
        
        // Puntuación actual (total)
        history.push({
            date: dateStr,
            house: house,
            points: diff.current,
            description: `Puntuación actual`,
            isTotal: true
        });
        
        // Si hay diferencia con la puntuación anterior, agregar entrada específica
        if (diff.difference !== 0) {
            let diffDescription = '';
            let diffIcon = '';
            
            if (diff.difference > 0) {
                diffDescription = `¡Ganó ${diff.difference} puntos!`;
                diffIcon = 'fa-arrow-up';
            } else {
                diffDescription = `Perdió ${Math.abs(diff.difference)} puntos`;
                diffIcon = 'fa-arrow-down';
            }
            
            history.push({
                date: dateStr,
                house: house,
                points: diff.difference,
                description: diffDescription,
                isDifference: true,
                icon: diffIcon
            });
        }
    });
    
    // Ordenar el historial: primero las entradas de diferencia, luego por cantidad de puntos
    history.sort((a, b) => {
        // Primero colocar las entradas de diferencia
        if (a.isDifference && !b.isDifference) return -1;
        if (!a.isDifference && b.isDifference) return 1;
        
        // Dentro de cada grupo, ordenar por puntos (absolutos para diferencias)
        if (a.isDifference && b.isDifference) {
            return Math.abs(b.points) - Math.abs(a.points);
        }
        
        // Si son puntuaciones totales, ordenar normalmente
        return b.points - a.points;
    });
    
    return history;
}

// Actualiza la interfaz con los datos
function updateUI() {
    // Actualizar las puntuaciones
    Object.keys(appState.scores).forEach(houseCode => {
        const scoreElement = document.querySelector(`#house-${houseCode.toLowerCase()} .score-number`);
        if (scoreElement) {
            // Aplicar animación
            scoreElement.classList.add('pulse');
            
            // Actualizar el valor
            scoreElement.textContent = appState.scores[houseCode];
            
            // Quitar la animación después de completarse
            setTimeout(() => {
                scoreElement.classList.remove('pulse');
            }, 1000);
        }
    });
    
    // Ordenar las casas por puntuación para mostrar su posición
    const sortedHouses = Object.keys(appState.scores)
        .sort((a, b) => appState.scores[b] - appState.scores[a]);
    
    // Actualizar la posición de cada casa
    sortedHouses.forEach((houseCode, index) => {
        const houseCard = document.getElementById(`house-${houseCode.toLowerCase()}`);
        if (houseCard) {
            // Añadir atributo de posición para CSS
            houseCard.setAttribute('data-position', index + 1);
            
            const positionElement = houseCard.querySelector('.house-position-indicator');
            if (positionElement) {
                positionElement.textContent = index + 1;
                positionElement.className = `house-position-indicator position-${index + 1}`;
            }
        }
    });
    
    // Reordenar las tarjetas de las casas en el DOM según las puntuaciones
    const housesContainer = document.getElementById('houses-container');
    sortedHouses.forEach(houseCode => {
        const houseCard = document.getElementById(`house-${houseCode.toLowerCase()}`);
        if (houseCard) {
            // Movemos la tarjeta al final del contenedor, lo que las reordenará según el sortedHouses
            housesContainer.appendChild(houseCard);
        }
    });
    
    // Actualizar el historial
    const historyContainer = document.getElementById('history-container');
    historyContainer.innerHTML = '';
    
    // Mostrar las entradas del historial
    appState.history.forEach((entry, index) => {
        const historyEntry = document.createElement('div');
        historyEntry.className = `history-entry ${entry.house.toLowerCase()}-event`;
        
        // Si es una entrada de diferencia, aplicar estilo especial
        if (entry.isDifference) {
            historyEntry.classList.add(entry.points >= 0 ? 'positive-change' : 'negative-change');
        }
        
        // Crear contenido HTML de la entrada de historial
        let iconHTML = '';
        if (entry.isDifference) {
            const iconClass = entry.points >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            iconHTML = `<i class="fas ${iconClass} change-icon"></i>`;
        }
        
        let entryText = '';
        if (entry.isDifference) {
            entryText = `${entry.points >= 0 ? '+' : ''}${entry.points} puntos: ${entry.description}`;
        } else if (entry.isTotal) {
            entryText = `tiene ${entry.points} puntos`;
        } else {
            entryText = `tiene ${entry.points} puntos${entry.description ? ': ' + entry.description : ''}`;
        }
        
        historyEntry.innerHTML = `
            <div class="entry-date">${entry.date}</div>
            <div class="entry-description">
                ${iconHTML}
                <strong>${CONFIG.houses[entry.house].name}</strong> ${entryText}
            </div>
        `;
        
        // Añadir al DOM
        historyContainer.appendChild(historyEntry);
        
        // Aplicar animación con retraso según la posición
        setTimeout(() => {
            historyEntry.classList.add('slide-in');
        }, index * 150);
    });
    
    // Si no hay entradas en el historial, mostrar un mensaje
    if (appState.history.length === 0) {
        historyContainer.innerHTML = `
            <div class="no-history-message">
                <p>No hay entradas en el historial por el momento.</p>
            </div>
        `;
    }
}

// Función para simular datos en modo de desarrollo (solo para pruebas)
function loadMockData() {
    // Simulamos puntuaciones basadas en las celdas específicas
    appState.scores = {
        GAP: 120, // D2
        MIM: 85,  // D5
        PUB: 100, // D7
        TUR: 95   // D9
    };
    
    // Calcular diferencias entre puntuaciones actuales y anteriores
    const differences = calculateDifferences(appState.scores, appState.prevScores);
    console.log('Diferencias calculadas (mock):', differences);
    
    // Generar historial a partir de las diferencias
    appState.history = generateHistoryFromDifferences(differences);
    
    appState.lastUpdate = new Date();
    
    // Guardar puntuaciones actuales para la próxima comparación
    saveCurrentScores();
    
    // Actualizar la interfaz con los datos simulados
    updateUI();
    
    // Añadir un mensaje de aviso
    const statusMessage = document.createElement('div');
    statusMessage.className = 'status-message';
    statusMessage.style.backgroundColor = '#ff9800';
    statusMessage.style.color = 'white';
    statusMessage.innerHTML = '<i class="fas fa-info-circle"></i> Usando datos de prueba (simulando celdas D2, D5, D7, D9 incluso si no existen en la hoja)';
    document.body.appendChild(statusMessage);
    
    // Eliminar el mensaje después de 5 segundos
    setTimeout(() => {
        statusMessage.classList.add('fade-out');
        setTimeout(() => {
            if (statusMessage.parentNode) {
                statusMessage.parentNode.removeChild(statusMessage);
            }
        }, 500);
    }, 5000);
}

// Actualiza las puntuaciones en la interfaz
function updateScores(scores) {
    // Guardar las puntuaciones en el estado de la aplicación
    appState.scores = scores;
    
    // Guardar las puntuaciones actuales en localStorage
    saveCurrentScores();
    
    // Ordenar las casas por puntuación
    const sortedHouses = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    
    // Actualizar las tarjetas de las casas
    sortedHouses.forEach((houseCode, index) => {
        const houseCard = document.getElementById(`house-${houseCode.toLowerCase()}`);
        if (houseCard) {
            // Actualizar la puntuación
            const scoreElement = houseCard.querySelector('.score-number');
            if (scoreElement) {
                scoreElement.textContent = scores[houseCode];
            }
            
            // Actualizar la posición
            houseCard.setAttribute('data-position', index + 1);
            
            const positionElement = houseCard.querySelector('.house-position-indicator');
            if (positionElement) {
                positionElement.textContent = index + 1;
                positionElement.className = `house-position-indicator position-${index + 1}`;
            }
        }
    });
    
    // Reordenar las tarjetas en el DOM
    const housesContainer = document.getElementById('houses-container');
    if (housesContainer) {
        // Eliminar todas las tarjetas
        const cards = Array.from(housesContainer.children);
        cards.forEach(card => card.remove());
        
        // Añadir las tarjetas en el nuevo orden
        sortedHouses.forEach(houseCode => {
            const houseCard = document.getElementById(`house-${houseCode.toLowerCase()}`);
            if (houseCard) {
                housesContainer.appendChild(houseCard);
            }
        });
    }
    
    // Comparar con puntuaciones anteriores y actualizar el historial
    updateHistory(scores);
}

