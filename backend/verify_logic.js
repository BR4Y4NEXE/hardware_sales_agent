const { consultarInventario } = require('./src/tools/consultarInventario');
// Colors removed to avoid dependency


console.log('🔍 Iniciando Verificación de Lógica de Negocio...\n');

let errores = 0;
let pruebas = 0;

function assert(condition, message, actual) {
    pruebas++;
    if (condition) {
        console.log(`✅ PASS: ${message}`);
    } else {
        console.error(`❌ FAIL: ${message}`);
        if (actual) console.error('   Actual:', JSON.stringify(actual, null, 2));
        errores++;
    }
}

// 1. Prueba de Match Exacto
console.log('\n--- 1. Búsqueda Exacta ---');
const resExacto = consultarInventario({ query: 'COD-PVC-012' });
assert(resExacto.total_resultados === 1, 'Búsqueda por SKU debe retornar 1 resultado');
assert(resExacto.encontrados[0].sku === 'COD-PVC-012', 'SKU debe coincidir exactamente');
assert(resExacto.encontrados[0].precio === 15.00, 'Precio debe ser el de lista ($15.00)');

// 2. Prueba de Alias
console.log('\n--- 2. Búsqueda por Alias ---');
const resAlias = consultarInventario({ query: 'cinta blanca' });
assert(resAlias.encontrados.some(p => p.sku === 'SEL-TEF-003'), 'Debe encontrar Cinta Teflón por alias "cinta blanca"');

// 3. Prueba de Zero Hallucinations (Producto Inexistente)
console.log('\n--- 3. Regla Zero Hallucinations ---');
const resFake = consultarInventario({ query: 'tubo flujo de titanio' });
assert(resFake.total_resultados === 0, 'No debe encontrar productos inventados', resFake);
assert(resFake.mensaje === "No se encontraron productos que coincidan con 'tubo flujo de titanio'", 'Debe retornar mensaje de no encontrado', resFake.mensaje);

// 4. Prueba de Filtros (Material)
console.log('\n--- 4. Filtros de Material ---');
const resFiltro = consultarInventario({ query: 'codo', material: 'PVC' });
const todosPVC = resFiltro.encontrados.every(p => p.material === 'PVC');
assert(resFiltro.total_resultados > 0, 'Debe encontrar codos de PVC', resFiltro);
assert(todosPVC, 'Todos los resultados deben ser de material PVC', resFiltro.encontrados);

// 5. Prueba de Clarificación (Ambigüedad)
console.log('\n--- 5. Detección de Ambigüedad ---');
const resAmbiguo = consultarInventario({ query: 'codo 1/2' });
assert(resAmbiguo.requiere_clarificacion === true, 'Debe marcar flag de clarificación para "codo 1/2"', resAmbiguo);
assert(resAmbiguo.total_resultados > 1, 'Debe retornar múltiples opciones', resAmbiguo.total_resultados);

console.log('\n----------------------------------------');
if (errores === 0) {
    console.log(`🎉 VERIFICACIÓN EXITOSA: ${pruebas}/${pruebas} pruebas pasaron.`);
} else {
    console.error(`⚠️ FALLARON ${errores} de ${pruebas} pruebas.`);
    process.exit(1);
}
