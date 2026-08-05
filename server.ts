import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI Client lazily or safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'TecnoPlace E-Commerce' });
  });

  // AI Tech Assistant Endpoint
  app.post('/api/gemini/assistant', async (req, res) => {
    try {
      const { message, productContext, history } = req.body;

      const ai = getAiClient();
      if (!ai) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY no configurada. Configúrala en la pestaña de Secretos.',
          reply: 'Lo siento, la clave de API de Gemini no está configurada en el servidor. Por favor verifica los Secretos del proyecto.'
        });
      }

      let systemInstruction = `Eres "TecnoBot", el Asistente Experto en Tecnología y Asesor de Compras de TecnoPlace (el e-commerce de tecnología líder).
Tus respuestas deben ser en ESPAÑOL, amables, concisas, claras, técnicamente precisas y con tono profesional entusiasta de tecnología.
Ayudas a los clientes a elegir laptops, componentes PC, smartphones, consolas, audífonos y productos smart home según su presupuesto y necesidades.
Si el usuario pregunta sobre especificaciones técnicas (ej: compatibilidad de RAM, rendimiento en juegos o edición, duración de batería), explica la respuesta de manera didáctica.
Si te envían el contexto de un producto actual, toma esa información en cuenta para dar respuestas exactas sobre ese modelo.`;

      if (productContext) {
        systemInstruction += `\n\n[CONTEXTO DEL PRODUCTO ACTUAL QUE MIRA EL USUARIO]:
Nombre: ${productContext.name}
Marca: ${productContext.brand}
Precio: $${productContext.price} USD
Garantía: ${productContext.warranty}
Especificaciones clave: ${JSON.stringify(productContext.specs || [])}
Características: ${JSON.stringify(productContext.keyFeatures || [])}`;
      }

      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        for (const item of history) {
          contents.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }]
          });
        }
      }
      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || 'No pude generar una respuesta en este momento.';
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Error in TecnoBot AI assistant route:', error);
      res.status(500).json({
        error: error.message || 'Error al procesar consulta con IA',
        reply: 'Ocurrió un error al consultar a TecnoBot. Por favor intenta de nuevo.'
      });
    }
  });

  // Vite Middleware in Dev or Static serving in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TecnoPlace Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
