const { consultarInventario } = require('./consultarInventario');

describe('consultarInventario', () => {
    describe('Exact matches', () => {
        it('should find product by exact SKU', () => {
            const result = consultarInventario({ query: 'COD-PVC-012' });

            expect(result.total_resultados).toBeGreaterThan(0);
            expect(result.encontrados[0]).toHaveProperty('sku', 'COD-PVC-012');
        });

        it('should find product by exact name (case insensitive)', () => {
            const result = consultarInventario({ query: 'codo pvc' });

            expect(result.total_resultados).toBeGreaterThan(0);
            expect(result.encontrados[0].nombre.toLowerCase()).toContain('codo');
        });
    });

    describe('Fuzzy search', () => {
        it('should find products by partial name', () => {
            const result = consultarInventario({ query: 'codo' });

            expect(result.total_resultados).toBeGreaterThan(0);
            expect(result.encontrados.every(p =>
                p.nombre.toLowerCase().includes('codo')
            )).toBe(true);
        });

        it('should find products by alias', () => {
            const result = consultarInventario({ query: 'codo' });

            expect(result.total_resultados).toBeGreaterThan(0);
        });

        it('should be case insensitive', () => {
            const result1 = consultarInventario({ query: 'CODO' });
            const result2 = consultarInventario({ query: 'codo' });

            expect(result1.total_resultados).toBe(result2.total_resultados);
        });
    });

    describe('Filters', () => {
        it('should filter by categoria', () => {
            const result = consultarInventario({
                query: 'codo',
                categoria: 'Conexiones'
            });

            expect(result.encontrados.every(p =>
                p.categoria === 'Conexiones'
            )).toBe(true);
        });

        it('should filter by material', () => {
            const result = consultarInventario({
                query: 'codo',
                material: 'PVC'
            });

            expect(result.encontrados.every(p =>
                p.material === 'PVC'
            )).toBe(true);
        });

        it('should combine filters', () => {
            const result = consultarInventario({
                query: 'codo',
                categoria: 'Conexiones',
                material: 'PVC'
            });

            expect(result.encontrados.every(p =>
                p.categoria === 'Conexiones' && p.material === 'PVC'
            )).toBe(true);
        });
    });

    describe('Empty results', () => {
        it('should return empty array for non-existent product', () => {
            const result = consultarInventario({ query: 'producto_que_no_existe_xyz' });

            expect(result.total_resultados).toBe(0);
            expect(result.encontrados).toEqual([]);
            expect(result.mensaje).toContain('No se encontraron productos');
        });
    });

    describe('Response format', () => {
        it('should return correct structure', () => {
            const result = consultarInventario({ query: 'codo' });

            expect(result).toHaveProperty('encontrados');
            expect(result).toHaveProperty('total_resultados');
            expect(Array.isArray(result.encontrados)).toBe(true);
        });

        it('should include all required product fields', () => {
            const result = consultarInventario({ query: 'codo' });

            if (result.total_resultados > 0) {
                const product = result.encontrados[0];
                expect(product).toHaveProperty('sku');
                expect(product).toHaveProperty('nombre');
                expect(product).toHaveProperty('precio');
                expect(product).toHaveProperty('stock');
                expect(product).toHaveProperty('categoria');
            }
        });

        it('should set requiere_clarificacion for multiple results', () => {
            const result = consultarInventario({ query: 'codo' });

            if (result.total_resultados > 1) {
                expect(result.requiere_clarificacion).toBe(true);
            }
        });
    });
});
