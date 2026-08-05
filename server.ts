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

  // Helper for smart fallback answers if API key is missing or quota/error occurs
  const getFallbackReply = (message: string, productContext: any): string => {
    const query = message.toLowerCase();
    
    if (productContext) {
      if (query.includes('precio') || query.includes('cuanto') || query.includes('cuesta')) {
        return `El **${productContext.name}** tiene un precio de **$${productContext.price} USD** con garantía oficial de **${productContext.warranty || '1 año'}**.`;
      }
      if (query.includes('garantia') || query.includes('garantía')) {
        return `El producto **${productContext.name}** incluye **${productContext.warranty || '1 año de garantía directa en TecnoPlace'}**.`;
      }
      return `Sobre el **${productContext.name}** ($${productContext.price} USD): Marca **${productContext.brand || 'TecnoPlace'}**. Excelente elección para tu setup. ¿Deseas información sobre envíos o métodos de pago?`;
    }

    if (query.includes('laptop') || query.includes('portatil') || query.includes('portátil') || query.includes('programacion') || query.includes('gaming')) {
      return '💻 Para laptop de alto rendimiento (gaming/programación), te recomendamos procesadores Intel Core i7 / Ryzen 7 con GPU RTX 4060 o superior. ¡Revisa la sección de Laptops en TecnoPlace para ver opciones destacadas!';
    }
    if (query.includes('iphone') || query.includes('samsung') || query.includes('camara') || query.includes('cámara') || query.includes('celular') || query.includes('telefono')) {
      return '📱 Para cámaras y potencia móvil, el **Samsung Galaxy S24 Ultra** cuenta con zoom 100x y 200MP, mientras que el **iPhone 15 Pro Max** destaca en video 4K y chip A17 Pro. ¡Ambos disponibles en TecnoPlace!';
    }
    if (query.includes('rtx') || query.includes('fuente') || query.includes('gpu') || query.includes('tarjeta grafica') || query.includes('tarjeta gráfica')) {
      return '🎮 Para tarjetas gráficas de alta potencia como la RTX 4080/4090, se recomienda una fuente de poder certificada de **850W a 1000W 80 Plus Gold**.';
    }
    if (query.includes('oferta') || query.includes('descuento') || query.includes('promocion') || query.includes('promoción')) {
      return '⚡ Tenemos excelentes ofertas de la semana en Laptops Gamer, Monitores de alta frecuencia y accesorios. ¡Aprovecha los descuentos vigentes en la página principal!';
    }
    if (query.includes('pago') || query.includes('tarjeta') || query.includes('qr') || query.includes('transferencia') || query.includes('cheque')) {
      return '💳 En TecnoPlace aceptamos Tarjetas de Crédito/Débito, PayPal, De una QR, Transferencia Bancaria Directa y Cheque. Elige tu método en la pantalla de Checkout.';
    }

    return '🤖 ¡Hola! Soy TecnoBot, tu asesor inteligente en TecnoPlace. Puedo guiarte para elegir la mejor laptop, componentes PC, smartphones o resolver dudas de tu compra. ¿En qué te puedo asesorar hoy?';
  };

  // AI Tech Assistant Endpoint
  app.post('/api/gemini/assistant', async (req, res) => {
    try {
      const { message, productContext, history } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ reply: 'Por favor envía un mensaje válido.' });
      }

      const ai = getAiClient();
      if (!ai) {
        // Return friendly fallback response when GEMINI_API_KEY is not set
        const fallback = getFallbackReply(message, productContext);
        return res.json({ reply: fallback });
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

      const replyText = response.text || getFallbackReply(message, productContext);
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Error in TecnoBot AI assistant route:', error);
      // Fallback on API quota or network error so user never gets blocked
      const fallback = getFallbackReply(req.body.message || '', req.body.productContext || null);
      res.json({
        reply: fallback
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
