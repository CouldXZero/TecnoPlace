import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Share2
} from 'lucide-react';
import { FilterState } from '../types';

interface FooterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenHelpModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ filters, setFilters, onOpenHelpModal }) => {
  const [mapLoaded, setMapLoaded] = useState(true);

  // Social media links list
  const socialLinks = [
    {
      name: 'Instagram',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white',
      badge: '@placetecnologi',
      url: 'https://www.instagram.com/placetecnologi/'
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.592 9 4.808V8z"/>
        </svg>
      ),
      color: 'bg-blue-600 hover:bg-blue-500 text-white',
      badge: 'Grupo TecnoPlace',
      url: 'https://www.facebook.com/groups/28478895455081875'
    },
    {
      name: 'TikTok',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.29 2.57.01.88.46 1.72 1.18 2.22.84.58 1.94.7 2.89.33.91-.35 1.59-1.18 1.77-2.12.08-1.08.03-2.17.04-3.25V.02z"/>
        </svg>
      ),
      color: 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700',
      badge: '@tecnoplace3',
      url: 'https://www.tiktok.com/@tecnoplace3'
    }
  ];

  const handleOpenGoogleMaps = () => {
    window.open('https://maps.google.com/?q=Torre+TecnoPlace+Av+Tecnologica+2026', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-24 sm:pb-12 mt-12 relative overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* TOP SECTION: Google Maps Location & WhatsApp Direct Access */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          
          {/* Left Column: Location Details */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold px-3 py-1 rounded-full mb-2">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Tienda Física Principal</span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                Nuestra Ubicación en Google Maps
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visítanos en nuestra tienda central para pruebas de equipos, entregas inmediatas y asesoría personalizada.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm">Dirección Completa:</div>
                  <div className="text-slate-300">Av. Principal Tecnológica #2026, Torre TecnoPlace, Piso 1, Sector Central</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">Estacionamiento gratuito para clientes TecnoPlace.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm">Horarios de Atención:</div>
                  <div className="text-slate-300">Lunes a Sábado: 9:00 AM - 8:00 PM</div>
                  <div className="text-slate-400">Domingos y Feriados: 10:00 AM - 4:00 PM</div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white text-sm">Teléfono Directo:</div>
                  <div className="text-emerald-400 font-mono font-bold text-sm">+593 99 414 6964</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenGoogleMaps}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer group"
            >
              <Navigation className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <span>Abrir en Google Maps GPS</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>

          {/* Right Column: Google Maps Interactive Iframe Frame */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="relative w-full h-72 sm:h-80 md:h-96 rounded-2xl overflow-hidden border border-slate-700 shadow-inner bg-slate-800">
              
              {/* Google Maps Real Styled Iframe Embed */}
              <iframe
                title="Google Maps Location TecnoPlace"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153166!3d-37.81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2s!4v1614323214567!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>

              {/* Overlay Badge */}
              <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-xs font-extrabold px-3 py-1.5 rounded-xl border border-slate-700 backdrop-blur-md flex items-center gap-2 shadow-lg">
                <MapPin className="w-4 h-4 text-red-500 animate-bounce" />
                <span>Tienda TecnoPlace 2026</span>
              </div>
            </div>
          </div>

        </div>

        {/* MIDDLE SECTION: Social Media Banner */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Share2 className="w-4 h-4" />
              <span>Nuestras Redes Sociales</span>
            </div>
            <h4 className="text-xl font-extrabold text-white mt-1">
              Conéctate con la Comunidad TecnoPlace
            </h4>
          </div>

          {/* Social Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 rounded-2xl flex flex-col justify-between space-y-3 transition-all hover:-translate-y-1 ${social.color}`}
              >
                <div className="flex items-center justify-between">
                  {social.icon}
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                    OFICIAL
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-sm">{social.name}</div>
                  <div className="text-[11px] opacity-90">{social.badge}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* BOTTOM NAVIGATION FOOTER LINKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-4">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                <img src="https://iili.io/CU4EPLB.png" alt="TecnoPlace Logo" className="h-6 w-auto max-w-[28px] object-contain" referrerPolicy="no-referrer" />
              </div>
              <span className="font-extrabold text-white text-lg">TecnoPlace</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Líderes en tecnología de vanguardia. Laptops M3, componentes de PC de alta gama, smartphones, consolas de videojuegos y gadgets inteligentes con garantía oficial.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Categorías Destacadas</div>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li><button onClick={() => setFilters({ ...filters, category: 'laptops' })} className="hover:text-blue-400 cursor-pointer">Laptops M3 & Gaming ROG</button></li>
              <li><button onClick={() => setFilters({ ...filters, category: 'smartphones' })} className="hover:text-blue-400 cursor-pointer">Smartphones Galaxy & iPhone</button></li>
              <li><button onClick={() => setFilters({ ...filters, category: 'gaming' })} className="hover:text-blue-400 cursor-pointer">PS5 Pro & Consolas</button></li>
              <li><button onClick={() => setFilters({ ...filters, category: 'pc-components' })} className="hover:text-blue-400 cursor-pointer">Tarjetas RTX 4090 & Componentes</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Centro de Soporte</div>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <button onClick={onOpenHelpModal} className="hover:text-blue-400 text-left cursor-pointer flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Centro de Ayuda y Preguntas</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenHelpModal} className="hover:text-blue-400 text-left cursor-pointer flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Protección de Compras 100%</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenHelpModal} className="hover:text-blue-400 text-left cursor-pointer">
                  Control de Seguridad y SSL
                </button>
              </li>
              <li>
                <button onClick={onOpenHelpModal} className="hover:text-blue-400 text-left cursor-pointer">
                  Términos y Políticas de Privacidad
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-white text-xs uppercase tracking-wider">Métodos de Pago Seguros</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aceptamos Visa, MasterCard, PayPal, Pago QR en línea, Criptomonedas y Pago Contra Entrega en tienda física.
            </p>
            <div className="flex items-center gap-2 pt-2 text-slate-400 text-xs font-mono">
              <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">SSL 256-bit</span>
              <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">PAGO SEGURO</span>
            </div>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
          © 2026 TecnoPlace Inc. Todos los derechos reservados. Tienda física y plataforma virtual de comercio electrónico.
        </div>

      </div>
    </footer>
  );
};
