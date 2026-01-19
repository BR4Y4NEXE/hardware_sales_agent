const fs = require('fs');
const path = require('path');

// Load inventory once at startup
const inventarioPath = path.join(__dirname, '../../data/inventario.json');
let inventario = [];

try {
    const rawData = fs.readFileSync(inventarioPath, 'utf8');
    inventario = JSON.parse(rawData);
    console.log(`✅ Inventario cargado: ${inventario.length} productos`);
} catch (error) {
    console.error('❌ Error cargando inventario:', error.message);
    throw new Error('No se pudo cargar el inventario');
}

/**
 * Normaliza texto para búsqueda
 */
function normalize(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .trim();
}

/**
 * Busca productos en el inventario
 * 
 * Algoritmo de prioridad:
 * 1. Exact SKU match
 * 2. Exact Name match
 * 3. Alias match (includes)
 * 4. Fuzzy match (simple substring)
 * 
 * @param {Object} params
 * @param {string} params.query - Búsqueda principal
 * @param {string} [params.categoria] - Filtro opcional por categoría
 * @param {string} [params.material] - Filtro opcional por material
 * @returns {Object}
 */
function consultarInventario({ query, categoria = null, material = null }) {
    const normalizedQuery = normalize(query);

    let resultados = [];

    // 1. Exact SKU match
    const skuMatch = inventario.find(
        p => normalize(p.sku) === normalizedQuery
    );
    if (skuMatch) {
        resultados = [skuMatch];
    }

    // 2. If no SKU match, search in names and aliases (Token Based)
    if (resultados.length === 0) {
        const tokens = normalizedQuery.split(/\s+/);

        resultados = inventario.filter(producto => {
            const normalizedName = normalize(producto.nombre);
            const normalizedAliases = producto.aliases.map(a => normalize(a));

            // Check if ALL tokens are present in Name OR ANY Alias
            // Strategy: For each token, it must exist in Name OR (at least one alias)
            // Actually, often it's better: Check if ALL tokens are in the "searchable text" (Name + Aliases joined)

            // Let's create a "searchable bucket" for the product
            const searchableText = [normalizedName, ...normalizedAliases].join(' ');

            // Check if every token is in the searchable bucket
            return tokens.every(token => searchableText.includes(token));
        });
    }

    // 3. Apply filters (category and material)
    if (categoria) {
        const normalizedCategoria = normalize(categoria);
        resultados = resultados.filter(p =>
            normalize(p.categoria) === normalizedCategoria
        );
    }

    if (material) {
        const normalizedMaterial = normalize(material);
        resultados = resultados.filter(p =>
            p.material && normalize(p.material) === normalizedMaterial
        );
    }

    // Format response
    const encontrados = resultados.map(p => ({
        sku: p.sku,
        nombre: p.nombre,
        material: p.material,
        categoria: p.categoria,
        precio: p.precio,
        stock: p.stock,
        unidad: p.unidad
    }));

    const response = {
        encontrados,
        total_resultados: encontrados.length
    };

    // Add clarification flag if multiple results
    if (encontrados.length > 1) {
        response.requiere_clarificacion = true;
    }

    // Add message if no results
    if (encontrados.length === 0) {
        response.mensaje = `No se encontraron productos que coincidan con '${query}'`;
    }

    return response;
}

/**
 * Tool definition for Groq (OpenAI Compatible) API
 * Note: Simplified without enums for better compatibility
 */
const consultarInventarioTool = {
    type: "function",
    function: {
        name: "consultar_inventario",
        description: "Busca productos en el inventario de la ferretería. Permite buscar por nombre, SKU o alias coloquial. Puede filtrar por categoría y material.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Término de búsqueda principal (nombre, SKU, o alias coloquial)"
                },
                categoria: {
                    type: "string",
                    description: "Filtro opcional por categoría. Valores comunes: Conexiones, Tubería, Selladores, Válvulas, Grifería, Fijación"
                },
                material: {
                    type: "string",
                    description: "Filtro opcional por material. Valores comunes: PVC, Cobre, Galvanizado, Bronce, Acero"
                }
            },
            required: ["query"]
        }
    }
};

module.exports = {
    consultarInventario,
    consultarInventarioTool
};
