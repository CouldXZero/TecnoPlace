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
