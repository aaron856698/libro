// Print Helper - Mejora la funcionalidad de impresión en entornos web
(function() {
    'use strict';
    
    // Función principal de impresión mejorada
    window.enhancedPrint = function() {
        return new Promise((resolve, reject) => {
            try {
                // Preparar la página para impresión
                prepareForPrint();
                
                // Intentar imprimir
                setTimeout(() => {
                    if (typeof window.print === 'function') {
                        window.print();
                        resolve('Impresión iniciada');
                    } else {
                        reject(new Error('Función de impresión no disponible'));
                    }
                }, 150);
                
            } catch (error) {
                reject(error);
            }
        });
    };
    
    // Preparar la página para impresión
    function prepareForPrint() {
        // Aplicar estilos de impresión manualmente
        const style = document.createElement('style');
        style.id = 'print-override';
        style.textContent = `
            @media print {
                body { background: white !important; color: black !important; }
                .book-container { box-shadow: none !important; margin: 0 !important; }
                .action-buttons { display: none !important; }
                .btn { display: none !important; }
                * { -webkit-print-color-adjust: exact !important; }
            }
        `;
        
        // Remover estilos anteriores si existen
        const existingStyle = document.getElementById('print-override');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        document.head.appendChild(style);
    }
    
    // Función de fallback para navegadores que no soportan window.print
    window.fallbackPrint = function() {
        alert('Para imprimir este documento:\n\n1. Presione Ctrl+P (Windows) o Cmd+P (Mac)\n2. Configure las opciones de impresión\n3. Seleccione "Imprimir"');
    };
    
    // Detectar si el navegador soporta impresión
    window.supportsPrint = function() {
        return typeof window.print === 'function';
    };
    
    // Evento para limpiar después de la impresión
    window.addEventListener('afterprint', function() {
        const style = document.getElementById('print-override');
        if (style) {
            style.remove();
        }
        console.log('Impresión completada');
    });
    
    // Evento para manejar errores
    window.addEventListener('error', function(e) {
        console.error('Error en la página:', e);
    });
    
    console.log('Print Helper cargado correctamente');
})(); 