import jsPDF from 'jspdf';
import { Order } from '../types';
import { formatPrice } from '../data/mockCoupons';

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Colors
  const primaryColor = [15, 23, 42]; // Slate 900
  const accentColor = [37, 99, 235]; // Blue 600
  const lightBg = [248, 250, 252]; // Slate 50

  // Header Banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 38, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('TECNOPLACE', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Factura Oficial de Compra - E-Commerce Tecnológico', 14, 25);
  doc.text('www.tecnoplace.com | soporte@tecnoplace.com', 14, 30);

  // Invoice Meta Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`FACTURA #${order.id}`, 196, 18, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${order.date}`, 196, 25, { align: 'right' });
  doc.text(`Estado: ${order.status.toUpperCase()}`, 196, 30, { align: 'right' });

  let y = 48;

  // Customer Info Box
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(14, y, 182, 38, 2, 2, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DATOS DE FACTURACIÓN Y COMPROBANTE', 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const billing = order.billingInfo;
  if (billing && billing.isConsumidorFinal) {
    doc.text(`Cliente: CONSUMIDOR FINAL`, 18, y + 14);
    doc.text(`Identificación: 9999999999 (Consumidor Anónimo)`, 18, y + 20);
    doc.text(`Email Facturación: ${billing.email || 'consumidorfinal@tecnoplace.com'}`, 18, y + 26);
    doc.text(`Envío a: ${order.shippingAddress.fullName} (${order.shippingAddress.street}, ${order.shippingAddress.city})`, 18, y + 32);
  } else if (billing) {
    doc.text(`Cliente / Razón Social: ${billing.name}`, 18, y + 14);
    doc.text(`${billing.taxIdType || 'RUC/DNI'}: ${billing.taxId}`, 18, y + 20);
    doc.text(`Email Facturación: ${billing.email}`, 18, y + 26);
    doc.text(`Dirección Fiscal: ${billing.address || order.shippingAddress.street}`, 18, y + 32);
  } else {
    doc.text(`Cliente: ${order.shippingAddress.fullName}`, 18, y + 14);
    doc.text(`Identificación: Consumidor Final (9999999999)`, 18, y + 20);
    doc.text(`Dirección: ${order.shippingAddress.street}, ${order.shippingAddress.city}`, 18, y + 26);
    doc.text(`Teléfono: ${order.shippingAddress.phone}`, 18, y + 32);
  }

  doc.setFont('helvetica', 'bold');
  doc.text(`Método de Pago: ${order.paymentMethod.type.toUpperCase()}`, 120, y + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(`Detalles: ${order.paymentMethod.details}`, 120, y + 20);
  doc.text(`Código Seguimiento: ${order.trackingCode}`, 120, y + 26);
  doc.text(`Teléfono Contacto: ${order.shippingAddress.phone}`, 120, y + 32);

  y += 46;

  // Table Header
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(14, y, 182, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('PRODUCTO', 18, y + 5.5);
  doc.text('CANT', 120, y + 5.5, { align: 'center' });
  doc.text('PRECIO UNIT.', 150, y + 5.5, { align: 'right' });
  doc.text('SUBTOTAL', 192, y + 5.5, { align: 'right' });

  y += 12;

  // Table Rows
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'normal');

  order.items.forEach((item, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y - 4, 182, 9, 'F');
    }

    const prodName = item.product.name.length > 55 ? item.product.name.substring(0, 52) + '...' : item.product.name;
    doc.text(prodName, 18, y + 1);
    doc.text(`${item.quantity}`, 120, y + 1, { align: 'center' });
    doc.text(formatPrice(item.product.price), 150, y + 1, { align: 'right' });
    doc.text(formatPrice(item.product.price * item.quantity), 192, y + 1, { align: 'right' });

    y += 9;
  });

  y += 6;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, 196, y);
  y += 8;

  // Summary Table
  const summaryX = 130;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  doc.text('Subtotal:', summaryX, y);
  doc.text(formatPrice(order.totalAmount + order.discountAmount - order.shippingCost - order.tax), 192, y, { align: 'right' });
  y += 6;

  if (order.discountAmount > 0) {
    doc.text('Descuento Aplicado:', summaryX, y);
    doc.text(`-${formatPrice(order.discountAmount)}`, 192, y, { align: 'right' });
    y += 6;
  }

  doc.text('Costo Envío:', summaryX, y);
  doc.text(order.shippingCost === 0 ? '¡GRATIS!' : formatPrice(order.shippingCost), 192, y, { align: 'right' });
  y += 6;

  doc.text('Impuesto (IVA 16%):', summaryX, y);
  doc.text(formatPrice(order.tax), 192, y, { align: 'right' });
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(37, 99, 235);
  doc.text('TOTAL A PAGAR:', summaryX, y);
  doc.text(formatPrice(order.totalAmount), 192, y, { align: 'right' });

  // Footer / Verification Stamp
  y = 265;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Garantía Oficial TecnoPlace Protegida. Todos los productos cuentan con sellos de autenticidad.', 105, y + 6, { align: 'center' });
  doc.text('Gracias por elegir TecnoPlace - Líderes en tecnología e innovación.', 105, y + 10, { align: 'center' });

  // Save File
  doc.save(`Factura_TecnoPlace_${order.id}.pdf`);
};

export const generateSystemDocsPDF = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [15, 23, 42]; // Slate 900
  const accentColor = [217, 119, 6]; // Amber 600
  const blueColor = [37, 99, 235]; // Blue 600
  const bgLight = [248, 250, 252]; // Slate 50

  const addHeader = (pageNum: number) => {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 210, 22, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TECNOPLACE E-COMMERCE | DOCUMENTACIÓN TÉCNICA Y OPERATIVA', 14, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Página ${pageNum}`, 196, 14, { align: 'right' });
  };

  const addFooter = () => {
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 282, 196, 282);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Proyecto: TecnoPlace E-Commerce | URL: https://ais-pre-crp4kuq5gbeu2kywuwxoep-641965782224.us-east1.run.app', 14, 287);
    doc.text('Base de Datos: Google Firebase Firestore', 196, 287, { align: 'right' });
  };

  // PAGE 1: TITLE & ETAPA 1, ETAPA 2
  addHeader(1);

  let y = 32;

  // Document Title Banner
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.roundedRect(14, y, 182, 32, 3, 3, 'F');
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.8);
  doc.line(14, y, 14, y + 32);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('DOCUMENTACIÓN INTEGRAL DEL PROYECTO', 20, y + 10);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text('TecnoPlace E-Commerce - Plataforma Full-Stack e Inteligencia Artificial', 20, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Guía detallada de arquitectura, ciclo de vida en 5 etapas, agilidad y stack tecnológico.', 20, y + 24);

  y += 40;

  // ETAPA 1
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(14, y, 182, 8, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ETAPA 1: GENERACIÓN DE IDEAS Y CONCEPTUALIZACIÓN', 18, y + 5.5);

  y += 12;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('1.1 Identificación del Problema y Análisis de Mercado', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const text1 = 'El mercado e-commerce tecnológico exige experiencias fluidas, atención personalizada instantánea y gestión transparente de productos. TecnoPlace nace para responder a la necesidad de adquirir laptops gamer, smartphones de alta gama y componentes de PC con asesoramiento especializado en tiempo real y múltiples formas de pago adaptadas a la región.';
  const lines1 = doc.splitTextToSize(text1, 182);
  doc.text(lines1, 14, y);
  y += lines1.length * 4.5 + 3;

  doc.setFont('helvetica', 'bold');
  doc.text('1.2 Prototipado Inteligente con Figma IA', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const text2 = 'Utilizando herramientas de Inteligencia Artificial en Figma (Figma IA), se diseñó el sistema de componentes interactivos, tarjetas de productos con insignias dinámicas, carrito flotante de compras y el panel administrativo. Figma IA permitió iterar de forma acelerada la experiencia de usuario (UX/UI) y definir las jerarquías tipográficas y paletas de color optimizadas.';
  const lines2 = doc.splitTextToSize(text2, 182);
  doc.text(lines2, 14, y);
  y += lines2.length * 4.5 + 6;

  // ETAPA 2
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(14, y, 182, 8, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ETAPA 2: DESARROLLO Y CONSTRUCCIÓN FULL-STACK', 18, y + 5.5);

  y += 12;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('2.1 Desarrollo Asistido por IA con Google AI Studio', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const text3 = 'Se utilizó la plataforma Google AI Studio y el agente agentico Antigravity con modelos Gemini (Gemini 3.6 Flash / 1.5) para la generación de código modular TypeScript, componentes React 18, servidor de Express.js y la lógica de integración con servicios en la nube.';
  const lines3 = doc.splitTextToSize(text3, 182);
  doc.text(lines3, 14, y);
  y += lines3.length * 4.5 + 3;

  doc.setFont('helvetica', 'bold');
  doc.text('2.2 Arquitectura del Backend y Asistente Virtual TecnoBot', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const text4 = 'El servidor Node.js/Express (server.ts) expone la API /api/gemini/assistant. Cuenta con un motor de contingencia y respuestas estructuradas ("Fallback Engine") que garantiza respuesta al usuario incluso en ausencia de claves API o ante límites de cuota, respondiendo con datos precisos de precios, garantías e información técnica.';
  const lines4 = doc.splitTextToSize(text4, 182);
  doc.text(lines4, 14, y);
  y += lines4.length * 4.5 + 3;

  doc.setFont('helvetica', 'bold');
  doc.text('2.3 Integración de Base de Datos Firebase Firestore', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const text5 = 'Persistencia en la nube implementada con Google Firebase Cloud Firestore (ID: ai-studio-tecnoplaceecomme-03465408-3c1c-40b1-880c-6723e17ae6ac). El Panel de Administración integra un acceso directo e interactivo hacia la consola oficial de Firestore para auditar colecciones de productos, pedidos e historial de usuarios.';
  const lines5 = doc.splitTextToSize(text5, 182);
  doc.text(lines5, 14, y);

  addFooter();

  // PAGE 2: ETAPA 3, ETAPA 4, ETAPA 5
  doc.addPage();
  addHeader(2);
  y = 30;

  // ETAPA 3
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(14, y, 182, 8, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ETAPA 3: PRUEBAS, CONTROL DE CALIDAD Y RESILIENCIA', 18, y + 5.5);

  y += 12;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('3.1 Verificación Estática y Análisis de Tipos', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const text6 = 'Se ejecutan análisis estáticos rigurosos mediante TypeScript (tsc --noEmit) e inspección de código (lint_applet / compile_applet) para eliminar errores de sintaxis, discrepancias de datos o importaciones faltantes antes del pase a producción.';
  const lines6 = doc.splitTextToSize(text6, 182);
  doc.text(lines6, 14, y);
  y += lines6.length * 4.5 + 3;

  doc.setFont('helvetica', 'bold');
  doc.text('3.2 Pruebas de Resiliencia del Asistente IA', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const text7 = 'Se evaluó el comportamiento del chat interactivo simulando pérdidas de conexión con el backend y agotamiento de tokens. TecnoBot responde satisfactoriamente mediante su motor heurístico local ofreciendo respuestas de asesoría técnica de alta calidad.';
  const lines7 = doc.splitTextToSize(text7, 182);
  doc.text(lines7, 14, y);
  y += lines7.length * 4.5 + 6;

  // ETAPA 4
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(14, y, 182, 8, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ETAPA 4: DESPLIEGUE Y REPOSITORIO EN LA NUBE', 18, y + 5.5);

  y += 12;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('4.1 Repositorio GitHub y Pipeline CI/CD', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const text8 = 'El código fuente se gestiona bajo control de versiones con GitHub, permitiendo integración continua, trazabilidad de cambios y colaboración estructurada en ramas de trabajo.';
  const lines8 = doc.splitTextToSize(text8, 182);
  doc.text(lines8, 14, y);
  y += lines8.length * 4.5 + 3;

  doc.setFont('helvetica', 'bold');
  doc.text('4.2 Despliegue en Cloud Run / Vercel', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const text9 = 'La aplicación está empaquetada e implementada en la infraestructura de producción en la nube (Cloud Run / Vercel), ejecutándose en el puerto 3000 tras un proxy inverso Nginx de alta velocidad con soporte de HTTPS y certificados SSL.';
  const lines9 = doc.splitTextToSize(text9, 182);
  doc.text(lines9, 14, y);
  y += lines9.length * 4.5 + 3;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('URL Oficial de la App Web Publicada:', 14, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('https://ais-pre-crp4kuq5gbeu2kywuwxoep-641965782224.us-east1.run.app', 14, y);
  y += 8;

  // ETAPA 5
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(14, y, 182, 8, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('ETAPA 5: OPERACIONES Y MONITOREO CONTINUO', 18, y + 5.5);

  y += 12;

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('5.1 Gestión Administrativa de Inventario y Ventas', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const text10 = 'A través del Panel Admin, los operadores pueden añadir productos, modificar precios, configurar cupones de descuento, gestionar el inventario y exportar reportes detallados en CSV o PDF de forma automatizada.';
  const lines10 = doc.splitTextToSize(text10, 182);
  doc.text(lines10, 14, y);
  y += lines10.length * 4.5 + 3;

  doc.setFont('helvetica', 'bold');
  doc.text('5.2 Monitoreo Directo de la Base de Datos Firebase', 14, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  const text11 = 'El panel incluye un botón con enlace directo a la consola de Firebase Firestore para monitorear lecturas, escrituras y reglas de seguridad en tiempo real, garantizando la integridad de los datos del negocio.';
  const lines11 = doc.splitTextToSize(text11, 182);
  doc.text(lines11, 14, y);

  addFooter();

  // PAGE 3: LAS 5 MANERAS DE MEJORAR LA AGILIDAD & HERRAMIENTAS IA
  doc.addPage();
  addHeader(3);
  y = 30;

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(14, y, 182, 8, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('LAS 5 PILARES PARA MEJORAR LA AGILIDAD EN EL DESARROLLO DE SOFTWARE', 18, y + 5.5);

  y += 14;

  const pilares = [
    {
      num: '1. METODOLOGÍA',
      desc: 'Adopción de marcos de trabajo ágiles (Scrum/Kanban) combinados con sprints de prototipado acelerado por IA. Esto reduce el ciclo de retroalimentación con el cliente final y acorta drásticamente el tiempo de lanzamiento al mercado (Time-to-Market).'
    },
    {
      num: '2. ARQUITECTURA',
      desc: 'Diseño Full-Stack desacoplado y modular. La separación entre la interfaz de usuario en React, la API REST en Express.js y los servicios en la nube (Firebase Firestore) otorga independencia para escalar módulos de forma aislada sin afectar el resto del sistema.'
    },
    {
      num: '3. AUTOMATIZACIÓN',
      desc: 'Automatización de compilación, empaquetado con Vite/esbuild, linting estático, generación instantánea de comprobantes de venta en PDF (jsPDF) y creación automatizada de esta misma documentación técnica.'
    },
    {
      num: '4. INFRAESTRUCTURA',
      desc: 'Infraestructura Serverless y basada en contenedores distribuidos en la nube (Cloud Run / Vercel + Firebase). Esto elimina la sobrecarga operativa de administrar servidores físicos y proporciona escalabilidad elástica en picos de demanda.'
    },
    {
      num: '5. TECNOLOGÍA',
      desc: 'Stack de vanguardia con TypeScript, Vite, React 18, Tailwind CSS, Lucide Icons, Google Gemini API y Firebase Firestore, asegurando un código tipado, expresivo, mantenible y de alto rendimiento visual.'
    }
  ];

  pilares.forEach((pilar) => {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, 182, 18, 2, 2, 'F');
    doc.setDrawColor(217, 119, 6);
    doc.setLineWidth(0.6);
    doc.line(14, y, 14, y + 18);

    doc.setTextColor(217, 119, 6);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(pilar.num, 18, y + 5.5);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const pLines = doc.splitTextToSize(pilar.desc, 174);
    doc.text(pLines, 18, y + 10);

    y += 22;
  });

  y += 4;

  // ECOSISTEMA DE HERRAMIENTAS DE IA
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(14, y, 182, 8, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('HERRAMIENTAS DE IA Y PLATAFORMAS EN EL DESARROLLO DE LA APP WEB', 18, y + 5.5);

  y += 14;

  const tools = [
    { name: 'Figma IA', text: 'Prototipado rápido de interfaces de usuario, diseño responsive y generación inteligente de layouts.' },
    { name: 'Google AI Studio', text: 'Desarrollo asistido por agentes de IA agenticos y modelos Gemini para la escritura y optimización del código.' },
    { name: 'GitHub', text: 'Control de versiones en la nube, gestión colaborativa de ramas y pipelines de integración continua.' },
    { name: 'Vercel / Cloud Run', text: 'Hosting moderno de alto rendimiento en contenedores con despliegue automatizado e infraestructura serverless.' },
    { name: 'Enlace Publicado', text: 'https://ais-pre-crp4kuq5gbeu2kywuwxoep-641965782224.us-east1.run.app' }
  ];

  tools.forEach((tool) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${tool.name}:`, 18, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const tLines = doc.splitTextToSize(tool.text, 140);
    doc.text(tLines, 55, y);

    y += Math.max(tLines.length * 4, 5) + 2;
  });

  addFooter();

  // Save PDF
  doc.save('Documentacion_TecnoPlace_ECommerce.pdf');
};

