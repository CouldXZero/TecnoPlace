import { Product, CategoryInfo, Order } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'laptops',
    name: 'Laptops & Computadoras',
    iconName: 'Laptop',
    count: 18,
    description: 'Equipos portátiles para trabajo, programación, diseño y gaming extremo',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'smartphones',
    name: 'Smartphones & Tablets',
    iconName: 'Smartphone',
    count: 24,
    description: 'Últimos lanzamientos con cámaras de alta resolución y procesadores IA',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gaming',
    name: 'Gaming & Consolas',
    iconName: 'Gamepad2',
    count: 15,
    description: 'Consolas de nueva generación, mandos pro, monitores de alta frecuencia',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'audio',
    name: 'Audio & Sonido High-End',
    iconName: 'Headphones',
    count: 20,
    description: 'Audífonos Hi-Fi, canceladores de ruido activos y barras de sonido envolvente',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pc-components',
    name: 'Componentes PC & GPUs',
    iconName: 'Cpu',
    count: 32,
    description: 'Tarjetas gráficas RTX, procesadores de última generación, SSDs ultra rápidos',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'smart-home',
    name: 'Smart Home & IoT',
    iconName: 'Home',
    count: 12,
    description: 'Iluminación inteligente, asistentes de voz, cámaras de seguridad 4K',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wearables',
    name: 'Smartwatches & Wearables',
    iconName: 'Watch',
    count: 14,
    description: 'Relojes inteligentes con monitoreo biométrico avanzado y GPS dedicado',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'MacBook Pro 16" M3 Max',
    subtitle: 'Space Black | 36GB RAM | 1TB SSD',
    category: 'laptops',
    brand: 'Apple',
    price: 3499,
    originalPrice: 3899,
    rating: 4.9,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    isFeatured: true,
    isDeal: true,
    bestSeller: true,
    description: 'La laptop más potente de Apple jamás creada. Equipada con el chip M3 Max de 16 núcleos de CPU y 40 núcleos de GPU, ideal para edición de video 8K, renderizado 3D y desarrollo de software complejo.',
    keyFeatures: [
      'Chip Apple M3 Max de 16 núcleos',
      'Pantalla Liquid Retina XDR de 16.2 pulgadas (120Hz ProMotion)',
      '36 GB de memoria unificada de alta velocidad',
      '1 TB de almacenamiento SSD ultrarrápido',
      'Batería con hasta 22 horas de autonomía'
    ],
    warranty: '24 meses de garantía oficial Apple Care TecnoPlace Premium',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 5 },
      { storeName: 'TecnoPlace Zona Rosa', city: 'Bogotá', stock: 3 },
      { storeName: 'TecnoPlace Gran Vía', city: 'Madrid', stock: 4 }
    ],
    specs: [
      { name: 'Procesador', value: 'Apple M3 Max (16 CPU / 40 GPU)', group: 'Rendimiento' },
      { name: 'Memoria RAM', value: '36 GB Unificada', group: 'Memoria' },
      { name: 'Almacenamiento', value: '1 TB SSD PCIe Gen4', group: 'Almacenamiento' },
      { name: 'Pantalla', value: '16.2" Mini-LED Liquid Retina XDR 3024x1964 120Hz', group: 'Pantalla' },
      { name: 'Batería', value: '100 Wh (Carga Magsafe 3 140W)', group: 'Batería' },
      { name: 'Peso', value: '2.16 kg', group: 'Dimensiones' }
    ]
  },
  {
    id: 'prod-02',
    name: 'ASUS ROG Strix SCAR 18 (2026 Edition)',
    subtitle: 'Intel i9-14900HX | RTX 4090 16GB | 64GB DDR5',
    category: 'laptops',
    brand: 'ASUS',
    price: 3899,
    originalPrice: 4299,
    rating: 4.8,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    isFeatured: true,
    isDeal: true,
    isNew: true,
    description: 'La máxima expresión del gaming portátil. Dominador absoluto con procesador Intel Core i9 de 24 núcleos y GPU Nvidia GeForce RTX 4090 con TGP ilimitado de 175W y refrigeración con metal líquido.',
    keyFeatures: [
      'Tarjeta Gráfica NVIDIA GeForce RTX 4090 16GB GDDR6',
      'Pantalla ROG Nebula HDR 18" 2.5K 240Hz Mini LED',
      '64 GB RAM DDR5-5600MHz',
      '2 TB SSD NVMe M.2 en RAID 0',
      'Teclado mecánico RGB por tecla y barra de luz Per-Key'
    ],
    warranty: '36 meses de garantía con soporte en sitio',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 2 },
      { storeName: 'TecnoPlace Belgrano', city: 'Buenos Aires', stock: 4 },
      { storeName: 'TecnoPlace Costanera', city: 'Santiago', stock: 2 }
    ],
    specs: [
      { name: 'Procesador', value: 'Intel Core i9-14900HX (24 Núcleos, hasta 5.8 GHz)', group: 'Rendimiento' },
      { name: 'Tarjeta Gráfica', value: 'NVIDIA GeForce RTX 4090 16GB VRAM (175W)', group: 'Rendimiento' },
      { name: 'Memoria RAM', value: '64 GB DDR5 5600MHz (2x32GB)', group: 'Memoria' },
      { name: 'Pantalla', value: '18" Mini-LED QHD+ (2560x1600) 240Hz 3ms', group: 'Pantalla' },
      { name: 'Teclado', value: 'Mecánico Switches ópticos RGB Aura Sync', group: 'Diseño' }
    ]
  },
  {
    id: 'prod-03',
    name: 'Samsung Galaxy S24 Ultra 5G AI',
    subtitle: 'Titanium Gray | 512GB | 12GB RAM + S-Pen',
    category: 'smartphones',
    brand: 'Samsung',
    price: 1299,
    originalPrice: 1419,
    rating: 4.9,
    reviewCount: 210,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    isFeatured: true,
    bestSeller: true,
    description: 'El smartphone definitivo impulsado por Galaxy AI. Marcos de titanio ultrarresistentes, cámara principal de 200 MP con zoom óptico 10x y traducción de llamadas en tiempo real.',
    keyFeatures: [
      'Procesador Qualcomm Snapdragon 8 Gen 3 for Galaxy',
      'Cámara de 200 MP + Quad Telephoto System 100x Space Zoom',
      'Pantalla Dynamic AMOLED 2X de 6.8" plana con 2600 nits',
      'Funciones Galaxy AI: Circle to Search, Live Translate, Note Assist',
      'S-Pen integrado en el chasis con menor latencia'
    ],
    warranty: '12 meses Samsung Official Warranty + Seguro contra caídas TecnoShield',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 10 },
      { storeName: 'TecnoPlace Zona Rosa', city: 'Bogotá', stock: 8 },
      { storeName: 'TecnoPlace Gran Vía', city: 'Madrid', stock: 7 }
    ],
    specs: [
      { name: 'Procesador', value: 'Snapdragon 8 Gen 3 (4nm)', group: 'Rendimiento' },
      { name: 'Cámara Principal', value: '200 MP f/1.7 + 50 MP + 12 MP + 10 MP', group: 'Cámara' },
      { name: 'Pantalla', value: '6.8" Quad HD+ Dynamic AMOLED 2X (1-120Hz)', group: 'Pantalla' },
      { name: 'Batería', value: '5000 mAh Carga rápida 45W', group: 'Batería' }
    ]
  },
  {
    id: 'prod-04',
    name: 'iPhone 15 Pro Max',
    subtitle: 'Natural Titanium | 256GB | Chip A17 Pro',
    category: 'smartphones',
    brand: 'Apple',
    price: 1199,
    originalPrice: 1299,
    rating: 4.8,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    isFeatured: true,
    description: 'Diseñado en titanio de grado aeroespacial. Revolucionario chip A17 Pro con GPU de 6 núcleos capaz de ejecutar juegos de nivel consola como Resident Evil 4 y Death Stranding.',
    keyFeatures: [
      'Diseño en titanio ultraligero y resistente',
      'Chip A17 Pro con ray tracing acelerado por hardware',
      'Sistema de cámaras pro con teleobjetivo 5x (120mm)',
      'Boton de Acción personalizable',
      'Conector USB-C con velocidades USB 3 (hasta 10Gb/s)'
    ],
    warranty: '12 meses Apple Care Oficial',
    storeAvailability: [
      { storeName: 'TecnoPlace Gran Vía', city: 'Madrid', stock: 10 },
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 8 }
    ],
    specs: [
      { name: 'Procesador', value: 'Apple A17 Pro (3nm)', group: 'Rendimiento' },
      { name: 'Pantalla', value: '6.7" Super Retina XDR OLED ProMotion 120Hz', group: 'Pantalla' },
      { name: 'Cámara', value: '48 MP principal + 12 MP ultra gran angular + 12 MP teleobjetivo 5x', group: 'Cámara' },
      { name: 'Material', value: 'Chasis de titanio con cristal Ceramic Shield', group: 'Diseño' }
    ]
  },
  {
    id: 'prod-05',
    name: 'PlayStation 5 Pro Digital + Disc Drive Bundle',
    subtitle: 'Edición Limitada 2TB SSD | PSSR AI Upscaling',
    category: 'gaming',
    brand: 'Sony',
    price: 799,
    originalPrice: 849,
    rating: 4.9,
    reviewCount: 180,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    isDeal: true,
    isNew: true,
    bestSeller: true,
    description: 'La experiencia de juego en consola más avanzada. Con GPU mejorada 67% más potente, Ray Tracing avanzado y tecnología PSSR (PlayStation Spectral Super Resolution) para gráficos 4K a 60/120 FPS sin concesiones.',
    keyFeatures: [
      'Renderizado 45% más rápido con GPU avanzada',
      'PlayStation Spectral Super Resolution (PSSR AI)',
      'Ray Tracing mejorado de nivel avanzado',
      '2 TB de almacenamiento SSD ultra rápido integrado',
      'Soporte para Wi-Fi 7 y salidas 8K HDR'
    ],
    warranty: '24 meses de garantía oficial PlayStation',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 6 },
      { storeName: 'TecnoPlace Costanera', city: 'Santiago', stock: 5 },
      { storeName: 'TecnoPlace Gran Vía', city: 'Madrid', stock: 4 }
    ],
    specs: [
      { name: 'GPU', value: 'RDNA Custom 16.7 TFLOPS con PSSR AI', group: 'Consola' },
      { name: 'Almacenamiento', value: '2 TB SSD NVMe Custom (5.5 GB/s)', group: 'Consola' },
      { name: 'Salida de Video', value: 'HDMI 2.1 VRR 4K 120Hz / 8K 60Hz', group: 'Conectividad' }
    ]
  },
  {
    id: 'prod-06',
    name: 'Sony WH-1000XM5 Noise Canceling Headphones',
    subtitle: 'Black | 30h Batería | Audio Hi-Res LDAC',
    category: 'audio',
    brand: 'Sony',
    price: 349,
    originalPrice: 399,
    rating: 4.9,
    reviewCount: 420,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 30,
    isDeal: true,
    bestSeller: true,
    description: 'Los audífonos líderes en cancelación de ruido en el mundo. Dos procesadores y ocho micrófonos garantizan una cancelación de ruido sin precedentes y una calidad de llamada impecable.',
    keyFeatures: [
      'Procesador V1 de Sony + Procesador QN1 de Cancelación de Ruido',
      'Hasta 30 horas de autonomía con cancelación de ruido activada',
      'Control táctil inteligente y Speak-to-Chat automático',
      'Sonido de alta resolución Hi-Res Audio con LDAC',
      'Diseño ultra liviano con almohadillas de cuero sintético suave'
    ],
    warranty: '12 meses TecnoPlace Warranty',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 12 },
      { storeName: 'TecnoPlace Zona Rosa', city: 'Bogotá', stock: 10 },
      { storeName: 'TecnoPlace Belgrano', city: 'Buenos Aires', stock: 8 }
    ],
    specs: [
      { name: 'Drivers', value: '30 mm con diafragma de fibra de carbono', group: 'Audio' },
      { name: 'Respuesta de Frecuencia', value: '4 Hz - 40,000 Hz', group: 'Audio' },
      { name: 'Batería', value: '30 horas (ANC ON) / Carga en 3 min para 3 horas', group: 'Batería' }
    ]
  },
  {
    id: 'prod-07',
    name: 'NVIDIA GeForce RTX 4090 Founders Edition 24GB',
    subtitle: 'DLSS 3.5 | Ada Lovelace Architecture',
    category: 'pc-components',
    brand: 'Nvidia',
    price: 1899,
    originalPrice: 2099,
    rating: 4.9,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 5,
    isFeatured: true,
    isDeal: true,
    description: 'La tarjeta de video definitiva para entusiastas del PC Gaming, Inteligencia Artificial y Creación de Contenido. 24 GB de VRAM GDDR6X y núcleos Tensor de 4.ª generación con DLSS 3.5 Frame Generation.',
    keyFeatures: [
      'Arquitectura NVIDIA Ada Lovelace con 16,384 Núcleos CUDA',
      '24 GB GDDR6X a 384-bit',
      'Soporte completo para Ray Tracing de ruta completa (Full Ray Tracing)',
      'Aceleración por IA para render en Blender, Premiere, Stable Diffusion y LLMs',
      'Conector PCIe 4.0 x16 y fuente recomendada de 850W+'
    ],
    warranty: '36 meses de garantía oficial NVIDIA',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 2 },
      { storeName: 'TecnoPlace Gran Vía', city: 'Madrid', stock: 3 }
    ],
    specs: [
      { name: 'CUDA Cores', value: '16,384', group: 'GPU Specs' },
      { name: 'Memoria VRAM', value: '24 GB GDDR6X', group: 'GPU Specs' },
      { name: 'Reloj Boost', value: '2.52 GHz', group: 'GPU Specs' },
      { name: 'Consumo (TDP)', value: '450W (Conector 16-pin PCIe Gen 5)', group: 'Energía' }
    ]
  },
  {
    id: 'prod-08',
    name: 'Apple Watch Ultra 2 Titanium',
    subtitle: 'Ocean Band / GPS + Cellular 49mm',
    category: 'wearables',
    brand: 'Apple',
    price: 799,
    originalPrice: 849,
    rating: 4.8,
    reviewCount: 96,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    isNew: true,
    description: 'El reloj deportivo y de aventuras más resistente y potente. Caja de titanio de 49 mm, pantalla de 3000 nits superbrillante y GPS de doble frecuencia con precisión milimétrica.',
    keyFeatures: [
      'Caja de titanio de grado 5 resistente al agua hasta 100m',
      'Pantalla Always-On Retina con brillo pico de 3000 nits',
      'Gesture Double Tap para controlar sin tocar la pantalla',
      'Duración de batería de hasta 36 horas de uso normal y 72 horas en ahorro',
      'Sirena de emergencia de 86 decibelios audible a 180 metros'
    ],
    warranty: '12 meses Apple Care',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 6 },
      { storeName: 'TecnoPlace Zona Rosa', city: 'Bogotá', stock: 4 },
      { storeName: 'TecnoPlace Costanera', city: 'Santiago', stock: 4 }
    ],
    specs: [
      { name: 'Pantalla', value: '49mm LTPO OLED Retina (3000 nits)', group: 'Pantalla' },
      { name: 'Resistencia', value: 'Resistente a 100m (Certificado EN13319)', group: 'Construcción' },
      { name: 'Conectividad', value: 'LTE 4G Cellular + GPS L1+L5', group: 'Conectividad' }
    ]
  },
  {
    id: 'prod-09',
    name: 'Bose Smart Ultra Soundbar 4K Dolby Atmos',
    subtitle: 'Blanco Ártico | Voice4Video | AI Dialogue Mode',
    category: 'audio',
    brand: 'Bose',
    price: 899,
    originalPrice: 999,
    rating: 4.7,
    reviewCount: 62,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 9,
    isDeal: true,
    description: 'Sonido envolvente cinematográfico de nivel superior. Con soporte Dolby Atmos, tecnología Bose PhaseGuide y un Modo Diálogo impulsado por IA para voces nítidas incluso en escenas de acción intensa.',
    keyFeatures: [
      'Dolby Atmos y tecnología Bose PhaseGuide para sonido multidimensional',
      'Modo de Diálogo IA para una claridad de voz excepcional',
      'Conexión Wi-Fi, Bluetooth, Apple AirPlay 2 y Spotify Connect',
      'Calibración de audio ADAPTiQ personalizada según la acústica de tu sala',
      'Integración con Amazon Alexa y Google Assistant'
    ],
    warranty: '24 meses de garantía Bose',
    storeAvailability: [
      { storeName: 'TecnoPlace Gran Vía', city: 'Madrid', stock: 5 },
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 4 }
    ],
    specs: [
      { name: 'Audio Formats', value: 'Dolby Atmos, Dolby Digital, TrueHD', group: 'Audio' },
      { name: 'Conexión HDMI', value: 'HDMI eARC / Entrada Óptica', group: 'Conectividad' },
      { name: 'Inalámbrico', value: 'Wi-Fi 6, Bluetooth 5.3, AirPlay 2', group: 'Conectividad' }
    ]
  },
  {
    id: 'prod-10',
    name: 'Steam Deck OLED 1TB Limited Edition',
    subtitle: 'Pantalla HDR OLED 90Hz | Funda Transparente',
    category: 'gaming',
    brand: 'Logitech', // Valve
    price: 649,
    originalPrice: 699,
    rating: 4.9,
    reviewCount: 340,
    image: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 20,
    bestSeller: true,
    description: 'La reina de las consolas portátiles PC. Pantalla OLED con negros puros y brillo HDR de 1000 nits, mayor duración de batería, Wi-Fi 6E y peso reducido para sesiones prolongadas de juego.',
    keyFeatures: [
      'Pantalla OLED HDR de 7.4" a 90Hz con 1000 nits pico',
      'APU de AMD de 6nm optimizada para mayor eficiencia térmica',
      '1 TB de almacenamiento SSD NVMe ultrarrápido',
      'Módulo Wi-Fi 6E para descargas 3x más rápidas',
      'Batería mejorada de 50Wh (3 a 12 horas de juego)'
    ],
    warranty: '12 meses TecnoPlace direct guarantee',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 8 },
      { storeName: 'TecnoPlace Zona Rosa', city: 'Bogotá', stock: 6 },
      { storeName: 'TecnoPlace Belgrano', city: 'Buenos Aires', stock: 6 }
    ],
    specs: [
      { name: 'APU', value: 'AMD Custom Zen 2 (4c/8t) + RDNA 2 (8 CUs)', group: 'Hardware' },
      { name: 'Pantalla', value: '7.4" HDR OLED (1280x800) 90Hz', group: 'Pantalla' },
      { name: 'Memoria', value: '16 GB LPDDR5 integrados (6400 MT/s)', group: 'Memoria' }
    ]
  },
  {
    id: 'prod-11',
    name: 'LG C3 65" OLED EVO 4K Smart TV Gaming 120Hz',
    subtitle: 'Procesador α9 AI Gen6 | 4x HDMI 2.1 | G-Sync / FreeSync',
    category: 'smart-home',
    brand: 'Dell', // LG
    price: 1599,
    originalPrice: 1899,
    rating: 4.9,
    reviewCount: 75,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 7,
    isDeal: true,
    isFeatured: true,
    description: 'La pantalla de referencia para cine en casa y gaming. Negros infinitos gracias a sus píxeles autoiluminados OLED evo, compatibilidad completa con Nvidia G-Sync, AMD FreeSync Premium y VRR a 120Hz.',
    keyFeatures: [
      'Panel LG OLED evo 4K con Brightness Booster',
      'Procesador Inteligente Alpha 9 Gen6 con escalado 4K por IA',
      '4 puertos HDMI 2.1 de ancho de banda completo (48Gbps)',
      'Tiempo de respuesta ultra bajo de 0.1ms',
      'Dolby Vision IQ y Dolby Atmos integrados'
    ],
    warranty: '36 meses de garantía con panel protegido contra retención',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 4 },
      { storeName: 'TecnoPlace Gran Vía', city: 'Madrid', stock: 3 }
    ],
    specs: [
      { name: 'Panel', value: '65" OLED evo 4K UHD (3840 x 2160) 120Hz Native', group: 'Display' },
      { name: 'Procesador', value: 'a9 AI Processor Gen6 4K', group: 'Procesador' },
      { name: 'Gaming Features', value: 'G-Sync, FreeSync, VRR, ALLM, Game Optimizer', group: 'Gaming' }
    ]
  },
  {
    id: 'prod-12',
    name: 'Processor Intel Core i9-14900K 24-Cores 5.8GHz',
    subtitle: 'LGA1700 | 36MB Smart Cache | Unlocked',
    category: 'pc-components',
    brand: 'Dell', // Intel
    price: 549,
    originalPrice: 599,
    rating: 4.8,
    reviewCount: 110,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    stock: 16,
    description: 'Fuerza bruta para gaming extremo y multitarea pesada. 24 núcleos (8 P-Cores + 16 E-Cores) y 32 hilos que alcanzan hasta 6.0 GHz con Thermal Velocity Boost.',
    keyFeatures: [
      '24 Núcleos y 32 Hilos de procesamiento simultáneo',
      'Frecuencia Turbo Máxima de hasta 6.0 GHz',
      'Soporte para memorias DDR5-5600 y DDR4-3200',
      'Compatible con placas madre Chipset Intel Serie 600 y 700',
      'Gráficos integrados Intel UHD Graphics 770'
    ],
    warranty: '36 meses Intel Box Guarantee',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 8 },
      { storeName: 'TecnoPlace Zona Rosa', city: 'Bogotá', stock: 8 }
    ],
    specs: [
      { name: 'Núcleos/Hilos', value: '24 Núcleos (8 Performance + 16 Efficient) / 32 Hilos', group: 'CPU Specs' },
      { name: 'Caché', value: '36 MB Intel Smart Cache + 32 MB L2', group: 'CPU Specs' },
      { name: 'Socket', value: 'LGA 1700', group: 'CPU Specs' }
    ]
  },
  {
    id: 'prod-13',
    name: 'Logitech G PRO X Superlight 2 Wireless Mouse',
    subtitle: 'Magenta | Sensor HERO 2 32K DPI | 60g Peso',
    category: 'gaming',
    brand: 'Logitech',
    price: 149,
    originalPrice: 169,
    rating: 4.9,
    reviewCount: 290,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    stock: 40,
    bestSeller: true,
    description: 'El mouse de esports más icónico del mundo evolucionado. Con solo 60 gramos de peso, switches híbridos óptico-mecánicos Lightforce y sensor HERO 2 ultra preciso.',
    keyFeatures: [
      'Peso pluma de solo 60 gramos',
      'Sensor HERO 2 con seguimiento superior a 500 IPS y hasta 32,000 DPI',
      'Switches híbridos LIGHTFORCE de respuesta instantánea y mayor durabilidad',
      'Polling rate inalámbrico de 2,000 Hz',
      'Batería con hasta 95 horas de duración constante'
    ],
    warranty: '24 meses Logitech G Warranty',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 15 },
      { storeName: 'TecnoPlace Belgrano', city: 'Buenos Aires', stock: 15 },
      { storeName: 'TecnoPlace Costanera', city: 'Santiago', stock: 10 }
    ],
    specs: [
      { name: 'Sensor', value: 'HERO 2 (100 - 32,000 DPI)', group: 'Mouse Specs' },
      { name: 'Peso', value: '60 g', group: 'Mouse Specs' },
      { name: 'Conexión', value: 'LIGHTSPEED Inalámbrico USB-C', group: 'Conectividad' }
    ]
  },
  {
    id: 'prod-14',
    name: 'Xiaomi Robot Vacuum X10+ Omni Station',
    subtitle: 'Mopas autolimpiables | Succión 4000Pa | Navegación LiDAR',
    category: 'smart-home',
    brand: 'Xiaomi',
    price: 699,
    originalPrice: 799,
    rating: 4.7,
    reviewCount: 48,
    image: 'https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    stock: 11,
    isDeal: true,
    description: 'Aspirado y trapeado 100% automatizado. La base Omni lava las mopas con agua limpia, las seca con aire caliente, vacía el polvo de forma automática y llena el tanque de agua del robot.',
    keyFeatures: [
      'Estación base inteligente autosuficiente All-in-One',
      'Secado automático con aire caliente en 2 horas',
      'Potente succión de 4000 Pa con elevación de mopa en alfombras',
      'Esquivado de obstáculos por IA con cámara 3D S-Cross',
      'Control por app Xiaomi Home e integración con Google / Alexa'
    ],
    warranty: '12 meses Xiaomi Official Guarantee',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 6 },
      { storeName: 'TecnoPlace Gran Vía', city: 'Madrid', stock: 5 }
    ],
    specs: [
      { name: 'Succión', value: '4000 Pa en 4 niveles ajustables', group: 'Limpieza' },
      { name: 'Navegación', value: 'LDS Láser 360° + Reconocimiento de Objetos IA', group: 'Navegación' },
      { name: 'Capacidad Base', value: 'Bolsa de Polvo 2.5L / Tanque Agua 2.5L', group: 'Base' }
    ]
  },
  {
    id: 'prod-15',
    name: 'SSD Samsung 990 PRO 2TB NVMe M.2 PCIe 4.0',
    subtitle: 'Con Disipador Heatsink PS5 & PC | 7450 MB/s',
    category: 'pc-components',
    brand: 'Samsung',
    price: 189,
    originalPrice: 219,
    rating: 4.9,
    reviewCount: 310,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    additionalImages: [],
    stock: 50,
    isDeal: true,
    bestSeller: true,
    description: 'El SSD PCIe 4.0 más rápido del mercado. Velocidades de lectura secuencial de hasta 7450 MB/s con disipador térmico integrado de perfil bajo compatible con PS5 y tarjetas madre PC.',
    keyFeatures: [
      'Velocidad de lectura de hasta 7450 MB/s y escritura de 6900 MB/s',
      'Eficiencia energética 50% superior respecto al 980 PRO',
      'Disipador térmico Heatsink de perfil delgado para disipación óptima',
      'Controlador térmico nickel-coated patentado por Samsung',
      'Software Samsung Magician para mantenimiento y diagnóstico'
    ],
    warranty: '60 meses (5 años) de garantía limitada Samsung',
    storeAvailability: [
      { storeName: 'TecnoPlace Flagship Polanco', city: 'Ciudad de México', stock: 20 },
      { storeName: 'TecnoPlace Zona Rosa', city: 'Bogotá', stock: 15 },
      { storeName: 'TecnoPlace Gran Vía', city: 'Madrid', stock: 15 }
    ],
    specs: [
      { name: 'Formato', value: 'M.2 2280 NVMe 2.0', group: 'SSD Specs' },
      { name: 'Interfaz', value: 'PCIe Gen 4.0 x4', group: 'SSD Specs' },
      { name: 'Lectura/Escritura', value: '7,450 MB/s / 6,900 MB/s', group: 'Rendimiento' }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
  // AGOSTO 2026
  {
    id: 'TP-982103',
    date: '3 de Agosto de 2026',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 1 }, // MacBook Pro M3
      { product: MOCK_PRODUCTS[5], quantity: 1 }  // Sony WH-1000XM5
    ],
    totalAmount: 3848,
    discountAmount: 100,
    shippingCost: 15,
    tax: 434,
    status: 'processing',
    shippingAddress: {
      fullName: 'Carlos Mendoza Silva',
      street: 'Av. Insurgentes Sur #1458, Apt 402',
      city: 'Ciudad de México',
      state: 'CDMX',
      postalCode: '03920',
      country: 'México',
      phone: '+52 55 4910 3920'
    },
    paymentMethod: { type: 'card', details: 'Visa **** 4910' },
    trackingCode: 'TRK-2026-88401',
    estimatedDelivery: '5 de Agosto de 2026'
  },
  {
    id: 'TP-982102',
    date: '3 de Agosto de 2026',
    items: [
      { product: MOCK_PRODUCTS[2], quantity: 1 } // Samsung Galaxy S24 Ultra
    ],
    totalAmount: 1299,
    discountAmount: 0,
    shippingCost: 0,
    tax: 179,
    status: 'shipped',
    shippingAddress: {
      fullName: 'Sofía Ramírez López',
      street: 'Calle Vallarta #2091',
      city: 'Guadalajara',
      state: 'Jalisco',
      postalCode: '44100',
      country: 'México',
      phone: '+52 33 9102 3840'
    },
    paymentMethod: { type: 'paypal', details: 'PayPal (s.ramirez@gmail.com)' },
    trackingCode: 'TRK-2026-88399',
    estimatedDelivery: '4 de Agosto de 2026'
  },
  {
    id: 'TP-981980',
    date: '2 de Agosto de 2026',
    items: [
      { product: MOCK_PRODUCTS[4], quantity: 1 }, // PS5 Pro
      { product: MOCK_PRODUCTS[14], quantity: 1 } // SSD Samsung 990 PRO
    ],
    totalAmount: 988,
    discountAmount: 50,
    shippingCost: 15,
    tax: 124,
    status: 'delivered',
    shippingAddress: {
      fullName: 'Mateo Hernández Roca',
      street: 'Av. Constitución #800',
      city: 'Monterrey',
      state: 'Nuevo León',
      postalCode: '64000',
      country: 'México',
      phone: '+52 81 1234 5678'
    },
    paymentMethod: { type: 'card', details: 'Mastercard **** 8820' },
    trackingCode: 'TRK-2026-88120',
    estimatedDelivery: '3 de Agosto de 2026'
  },
  {
    id: 'TP-981540',
    date: '1 de Agosto de 2026',
    items: [
      { product: MOCK_PRODUCTS[1], quantity: 1 } // ASUS ROG Strix SCAR 18
    ],
    totalAmount: 3899,
    discountAmount: 0,
    shippingCost: 0,
    tax: 537,
    status: 'delivered',
    shippingAddress: {
      fullName: 'Lucía Torres Gómez',
      street: 'Carrera 7 #72-41',
      city: 'Bogotá',
      state: 'Cundinamarca',
      postalCode: '110221',
      country: 'Colombia',
      phone: '+57 310 982 3019'
    },
    paymentMethod: { type: 'transfer', details: 'Transferencia Bancaria Directa' },
    trackingCode: 'TRK-2026-87900',
    estimatedDelivery: '3 de Agosto de 2026'
  },

  // JULIO 2026
  {
    id: 'TP-978401',
    date: '28 de Julio de 2026',
    items: [
      { product: MOCK_PRODUCTS[3], quantity: 1 } // iPhone 15 Pro Max
    ],
    totalAmount: 1199,
    discountAmount: 50,
    shippingCost: 8,
    tax: 165,
    status: 'delivered',
    shippingAddress: {
      fullName: 'Gabriel Silva Morales',
      street: 'Av. Providencia #1920',
      city: 'Santiago',
      state: 'Región Metropolitana',
      postalCode: '7500000',
      country: 'Chile',
      phone: '+56 9 8765 4321'
    },
    paymentMethod: { type: 'card', details: 'Visa **** 1029' },
    trackingCode: 'TRK-2026-85102',
    estimatedDelivery: '30 de Julio de 2026'
  },
  {
    id: 'TP-976210',
    date: '15 de Julio de 2026',
    items: [
      { product: MOCK_PRODUCTS[0], quantity: 1 }, // MacBook Pro M3
      { product: MOCK_PRODUCTS[2], quantity: 1 }  // Samsung S24 Ultra
    ],
    totalAmount: 4798,
    discountAmount: 200,
    shippingCost: 0,
    tax: 633,
    status: 'delivered',
    shippingAddress: {
      fullName: 'Valentina Castro Ruiz',
      street: 'Calle de Velázquez #45',
      city: 'Madrid',
      state: 'Madrid',
      postalCode: '28001',
      country: 'España',
      phone: '+34 612 345 678'
    },
    paymentMethod: { type: 'card', details: 'Amex **** 9012' },
    trackingCode: 'TRK-2026-83400',
    estimatedDelivery: '18 de Julio de 2026'
  },
  {
    id: 'TP-971092',
    date: '4 de Julio de 2026',
    items: [
      { product: MOCK_PRODUCTS[5], quantity: 2 } // 2x Sony WH-1000XM5
    ],
    totalAmount: 698,
    discountAmount: 40,
    shippingCost: 15,
    tax: 93,
    status: 'delivered',
    shippingAddress: {
      fullName: 'Andrés Morales Paz',
      street: 'Av. Santa Fe #2040',
      city: 'Buenos Aires',
      state: 'CABA',
      postalCode: 'C1123',
      country: 'Argentina',
      phone: '+54 11 4920 1820'
    },
    paymentMethod: { type: 'paypal', details: 'PayPal (andres.m@paz.com)' },
    trackingCode: 'TRK-2026-81092',
    estimatedDelivery: '7 de Julio de 2026'
  },

  // JUNIO 2026
  {
    id: 'TP-962001',
    date: '20 de Junio de 2026',
    items: [
      { product: MOCK_PRODUCTS[4], quantity: 1 } // PS5 Pro
    ],
    totalAmount: 799,
    discountAmount: 0,
    shippingCost: 15,
    tax: 110,
    status: 'delivered',
    shippingAddress: {
      fullName: 'Camila Ortega Varela',
      street: 'Av. Javier Prado Este #450',
      city: 'Lima',
      state: 'Lima',
      postalCode: '15023',
      country: 'Perú',
      phone: '+51 987 654 321'
    },
    paymentMethod: { type: 'de_una_qr', details: 'De una QR (+593 99 414 6964)' },
    trackingCode: 'TRK-2026-78201',
    estimatedDelivery: '22 de Junio de 2026'
  },
  {
    id: 'TP-958900',
    date: '10 de Junio de 2026',
    items: [
      { product: MOCK_PRODUCTS[1], quantity: 1 } // ASUS ROG Strix SCAR 18
    ],
    totalAmount: 3899,
    discountAmount: 150,
    shippingCost: 0,
    tax: 516,
    status: 'delivered',
    shippingAddress: {
      fullName: 'Diego Fernández',
      street: 'Calle 12 #4-18',
      city: 'Quito',
      state: 'Pichincha',
      postalCode: '170150',
      country: 'Ecuador',
      phone: '+593 99 876 5432'
    },
    paymentMethod: { type: 'card', details: 'Visa **** 7712' },
    trackingCode: 'TRK-2026-75890',
    estimatedDelivery: '13 de Junio de 2026'
  }
];

