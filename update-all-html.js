// Script para actualizar automáticamente todos los archivos HTML
// con las mejoras de impresión

const fs = require('fs');
const path = require('path');

// Lista de archivos HTML a actualizar
const htmlFiles = [
    'suterh-conserje.html',
    'suterh-mantenimiento.html',
    'libro-completo.html',
    'upsra-intro.html',
    'upsra-supervisor.html',
    'upsra-vigilador.html',
    'suterh-valet.html',
    'suterh-intro.html',
    'monitoreo.html',
    'anexos.html'
];

// Función para actualizar un archivo HTML
function updateHtmlFile(filename) {
    try {
        let content = fs.readFileSync(filename, 'utf8');
        
        // 1. Agregar el script helper después de html2pdf.js
        if (!content.includes('print-helper.js')) {
            content = content.replace(
                /<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/html2pdf\.js\/0\.10\.1\/html2pdf\.bundle\.min\.js"><\/script>/,
                '<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>\n    <script src="print-helper.js"></script>'
            );
        }
        
        // 2. Actualizar la función printDocument
        const newPrintFunction = `        function printDocument() {
            // Función mejorada de impresión con múltiples fallbacks
            if (window.enhancedPrint) {
                // Usar la función mejorada si está disponible
                window.enhancedPrint()
                    .then(result => {
                        console.log('Impresión exitosa:', result);
                    })
                    .catch(error => {
                        console.error('Error con enhancedPrint:', error);
                        fallbackPrint();
                    });
            } else {
                // Fallback a la función básica
                try {
                    // Forzar la aplicación de estilos de impresión
                    document.body.style.background = 'white';
                    document.body.style.color = 'black';
                    
                    // Esperar un momento para que los estilos se apliquen
                    setTimeout(function() {
                        // Intentar imprimir
                        if (window.print) {
                            window.print();
                        } else {
                            // Fallback para navegadores que no soportan window.print
                            alert('La función de impresión no está disponible en este navegador. Por favor use Ctrl+P (Cmd+P en Mac) para imprimir.');
                        }
                    }, 100);
                } catch (error) {
                    console.error('Error al imprimir:', error);
                    alert('Error al imprimir. Por favor use Ctrl+P (Cmd+P en Mac) para imprimir manualmente.');
                }
            }
        }
        
        function fallbackPrint() {
            alert('Para imprimir este documento:\\n\\n1. Presione Ctrl+P (Windows) o Cmd+P (Mac)\\n2. Configure las opciones de impresión\\n3. Seleccione "Imprimir"\\n\\nO use la función "Descargar PDF" como alternativa.');
        }`;

        // Reemplazar la función printDocument existente
        content = content.replace(
            /function printDocument\(\) \{[^}]*\}/s,
            newPrintFunction
        );
        
        // 3. Agregar eventos adicionales antes del cierre del script
        const additionalEvents = `
        // Agregar evento para detectar si la impresión fue cancelada
        window.addEventListener('afterprint', function() {
            console.log('Impresión completada');
        });
        
        // Agregar evento para detectar errores de impresión
        window.addEventListener('error', function(e) {
            console.error('Error en la página:', e);
        });
        
        // Agregar atajo de teclado para impresión
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                printDocument();
            }
        });`;
        
        // Agregar los eventos si no existen
        if (!content.includes('afterprint')) {
            content = content.replace(
                /(\s*)<\/script>/,
                additionalEvents + '$1</script>'
            );
        }
        
        // Guardar el archivo actualizado
        fs.writeFileSync(filename, content, 'utf8');
        console.log(`✅ ${filename} actualizado correctamente`);
        
    } catch (error) {
        console.error(`❌ Error actualizando ${filename}:`, error.message);
    }
}

// Ejecutar las actualizaciones
console.log('🔄 Iniciando actualización de archivos HTML...\n');

htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        updateHtmlFile(file);
    } else {
        console.log(`⚠️  Archivo ${file} no encontrado`);
    }
});

console.log('\n✅ Proceso de actualización completado!');
console.log('\n📝 Archivos actualizados:');
htmlFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`   - ${file}`);
    }
}); 