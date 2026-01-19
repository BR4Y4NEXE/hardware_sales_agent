# Backend - QuoteMaster API

API backend para QuoteMaster, sistema de cotización con IA para ferreterías.

## 🚀 Setup

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

3. Agregar tu API key de Anthropic en `.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
```

4. Iniciar el servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📡 API Endpoints

### POST `/api/chat`

Procesa mensajes del vendedor y retorna cotizaciones.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Dame 50 codos pvc de media" }
  ]
}
```

**Response (Cotización):**
```json
{
  "tipo": "cotizacion",
  "items": [
    {
      "sku": "COD-PVC-012",
      "nombre": "Codo PVC 1/2\"",
      "cantidad": 50,
      "precio_unitario": 15.00,
      "subtotal": 750.00
    }
  ],
  "total": 750.00,
  "notas": "Todos los productos en stock"
}
```

**Response (Clarificación):**
```json
{
  "tipo": "clarificacion",
  "mensaje": "Tengo codos en PVC ($15), Cobre ($45) y Galvanizado ($35). ¿Cuál material necesitas?",
  "opciones": [...]
}
```

### GET `/health`

Health check endpoint.

## 🏗️ Estructura

```
backend/
├── src/
│   ├── index.js           # Express server
│   ├── routes/
│   │   └── chat.js        # POST /api/chat
│   ├── services/
│   │   └── claude.js      # Claude API handler
│   ├── tools/
│   │   └── consultarInventario.js  # Search algorithm
│   └── lib/
│       └── systemPrompt.js         # System prompt
└── data/
    └── inventario.json    # Product database
```

## 🔧 Deployment (Render)

1. Push código a GitHub
2. Crear nuevo Web Service en Render
3. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variable: `ANTHROPIC_API_KEY`
