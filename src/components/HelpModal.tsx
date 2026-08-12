import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  Bot,
  Sparkles,
  ShieldAlert,
  FileText,
  Lock,
  CheckCircle2,
  X,
  ChevronRight,
  Headphones,
  PhoneCall,
  Mail,
  RefreshCw,
  Award,
  BookOpen,
  UserCheck,
  MapPin
} from 'lucide-react';

import { generateSystemDocsPDF } from '../services/pdfGenerator';

export type HelpTabType =
  | 'centro-ayuda'
  | 'control-seguridad'
  | 'tecnobot'
  | 'proteccion-compras'
  | 'privacidad'
  | 'terminos';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: HelpTabType;
  onOpenAIBot: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'centro-ayuda',
  onOpenAIBot
}) => {
  const [activeTab, setActiveTab] = useState<HelpTabType>(initialTab);

  if (!isOpen) return null;

  const handleSelectTab = (tab: HelpTabType) => {
    if (tab === 'tecnobot') {
      onClose();
      onOpenAIBot();
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Header Modal */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Centro de Atención y Soporte</span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-blue-400/30">
                  TecnoPlace 2026
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Resuelve tus dudas, conoce nuestras garantías de seguridad y políticas de servicio.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Layout Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Navigation Sidebar */}
          <div className="w-full md:w-72 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 space-y-1.5 overflow-y-auto shrink-0">
            <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Menú de Ayuda
            </div>

            {/* Option 1: Centro de Ayuda */}
            <button
              onClick={() => handleSelectTab('centro-ayuda')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'centro-ayuda'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Headphones className="w-4 h-4" />
                <span>Centro de Ayuda</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Option 2: Control de Seguridad */}
            <button
              onClick={() => handleSelectTab('control-seguridad')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'control-seguridad'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Control de Seguridad</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Option 3: Chatea con Asesoria IA TecnoBot */}
            <button
              onClick={() => handleSelectTab('tecnobot')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95 shadow-xs cursor-pointer my-1"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>Asesoría IA TecnoBot</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </button>

            {/* Option 4: Protección de Compras TecnoPlace */}
            <button
              onClick={() => handleSelectTab('proteccion-compras')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'proteccion-compras'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Protección de Compras</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Option 5: Política de Privacidad */}
            <button
              onClick={() => handleSelectTab('privacidad')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'privacidad'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-slate-500" />
                <span>Política de Privacidad</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Option 6: Términos de Uso */}
            <button
              onClick={() => handleSelectTab('terminos')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'terminos'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Términos de Uso</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-70" />
            </button>

            <div className="pt-3 mt-3 border-t border-slate-200">
              <button
                onClick={() => generateSystemDocsPDF()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                title="Descargar Documentación PDF del Sistema"
              >
                <FileText className="w-4 h-4" />
                <span>Descargar Doc. PDF</span>
              </button>
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            {/* 1. CENTRO DE AYUDA */}
            {activeTab === 'centro-ayuda' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Headphones className="w-6 h-6 text-blue-600" />
                    <span>Centro de Ayuda y Preguntas Frecuentes</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Atención personalizada 24/7 para consultas sobre pedidos, envíos e instalaciones tecnológicas.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href="https://wa.me/593994146964?text=Hola%20TecnoPlace,%20deseo%20atenci%C3%B3n"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl p-4 space-y-2 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-emerald-900 font-bold text-xs">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="w-4 h-4 text-emerald-600" />
                        <span>Escríbenos por WhatsApp</span>
                      </div>
                      <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">EN VIVO</span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Respuesta rápida por chat con un asesor oficial.
                    </p>
                    <div className="text-xs font-black text-emerald-700 font-mono">
                      +593 99 414 6964
                    </div>
                  </a>

                  <a
                    href="https://maps.google.com/?q=Torre+TecnoPlace+Av+Tecnologica+2026"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl p-4 space-y-2 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-blue-900 font-bold text-xs">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Google Maps</span>
                      </div>
                      <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">UBICACIÓN</span>
                    </div>
                    <p className="text-[11px] text-blue-800">
                      Av. Principal Tecnológica #2026, Torre TecnoPlace.
                    </p>
                    <div className="text-xs font-black text-blue-700">
                      Ver en mapa →
                    </div>
                  </a>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>Soporte por Correo</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Respuestas en menos de 2 horas para garantías.
                    </p>
                    <div className="text-xs font-bold text-slate-800 font-mono">
                      soporte@tecnoplace.com
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-extrabold text-slate-900">Preguntas Frecuentes (FAQ)</h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
                      <div className="font-bold text-slate-800">¿Cómo realizo el seguimiento de mi pedido?</div>
                      <div className="text-slate-600">
                        Una vez completada la compra en Checkout, recibirás un código de rastreo en tu comprobante digital y podrás descargarlo en formato PDF.
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
                      <div className="font-bold text-slate-800">¿Cuáles son los tiempos de entrega de productos tecnológicos?</div>
                      <div className="text-slate-600">
                        Los pedidos en áreas urbanas se entregan en 24 a 48 horas con empaque reforzado anti-impactos.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CONTROL DE SEGURIDAD */}
            {activeTab === 'control-seguridad' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Lock className="w-6 h-6 text-emerald-600" />
                    <span>Control de Seguridad y Protección de Datos</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Protocolos bancarios avanzados, cifrado de alta densidad y autenticación segura de transacciones.
                  </p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-emerald-950 text-sm">Cifrado de Extremo a Extremo (SSL 256-bit)</div>
                    <p className="text-emerald-800 leading-relaxed">
                      Todas las comunicaciones de pago y procesamiento de facturas están blindadas mediante certificaciones bancarias internacionales. TecnoPlace nunca almacena datos sensibles de tarjetas ni claves de acceso.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Monitoreo Antifraude 24/7</span>
                    </div>
                    <p className="text-slate-600">Sistema automatizado de detección de anomalías y verificación de pagos.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Validación de Identidad</span>
                    </div>
                    <p className="text-slate-600">Verificación doble en compras corporativas y pedidos de alto volumen.</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PROTECCIÓN DE COMPRAS TECNOPLACE */}
            {activeTab === 'proteccion-compras' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Award className="w-6 h-6 text-amber-500" />
                    <span>Protección de Compras TecnoPlace</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Garantía de satisfacción total, sustitución inmediata y respaldo oficial de marcas líderes.
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
                    <ShieldAlert className="w-5 h-5 text-amber-600" />
                    <span>Cobertura Total 100% Garantizada</span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed">
                    Si el producto que recibes no coincide exactamente con las especificaciones o presenta cualquier defecto de fábrica, TecnoPlace se encarga del reembolso íntegro o sustitución sin ningún costo de envío para ti.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                    <RefreshCw className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Devoluciones Gratuitas dentro de 30 días</div>
                      <div className="text-slate-600">Puedes solicitar el cambio de producto sin complicaciones en un plazo de 30 días calendario.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                    <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-slate-800">Garantía Oficial de Fabricante</div>
                      <div className="text-slate-600">Todos los equipos cuentan con respaldo oficial directo de Apple, ASUS, Nvidia, PlayStation, Samsung y Intel.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. POLÍTICA DE PRIVACIDAD */}
            {activeTab === 'privacidad' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-slate-700" />
                    <span>Política de Privacidad y Tratamiento de Datos</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Compromiso con la confidencialidad, transparencia y no divulgación a terceros.
                  </p>
                </div>

                <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                  <p>
                    En <strong>TecnoPlace</strong> nos tomamos muy en serio la privacidad de nuestros clientes. Los datos solicitados durante la navegación y proceso de compra son procesados de acuerdo con normativas internacionales de protección de datos personales.
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="font-bold text-slate-900">Uso de la Información:</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      <li>Procesamiento exclusivo de facturas y entregas de mercadería tecnológica.</li>
                      <li>Envío de alertas de estado de pedidos y garantías aplicables.</li>
                      <li>Nunca vendemos ni comercializamos bases de datos con terceros.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 6. TÉRMINOS DE USO */}
            {activeTab === 'terminos' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-slate-700" />
                    <span>Términos y Condiciones de Uso TecnoPlace</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Acuerdo de servicio para la tienda virtual TecnoPlace e-Commerce 2026.
                  </p>
                </div>

                <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                  <p>
                    Al hacer uso de la plataforma <strong>TecnoPlace</strong>, aceptas las siguientes condiciones de servicio:
                  </p>
                  
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="font-bold text-slate-900">1. Precios e Inventarios</div>
                    <p className="text-slate-600">
                      Todos los precios mostrados incluyen impuestos aplicables y se expresan en dólares ($ USD). Las ofertas semanales están sujetas a disponibilidad de stock en almacén principal.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                    <div className="font-bold text-slate-900">2. Facturación Electrónica</div>
                    <p className="text-slate-600">
                      Las facturas se generan inmediatamente después de completar el pago en Checkout y pueden ser descargadas en formato PDF en cualquier momento.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
