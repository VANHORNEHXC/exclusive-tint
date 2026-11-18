export type Locale = 'es' | 'en';

export const translations: Record<Locale, Record<string, string>> = {
  es: {
    // Nav
    'nav.simulador': 'Simulador',
    'nav.servicios': 'Servicios',
    'nav.tecnologia': 'Tecnología Térmica',
    'nav.precios': 'Paquetes',
    'nav.opiniones': 'Opiniones',

    // CTA
    'cta.agendar': 'Agendar Cita',
    'cta.probar': 'Probar Tonalidades',
    'whatsapp.cta': 'Cotiza 24/7 por WhatsApp',
    'whatsapp.ctaMobile': 'Cotiza 24/7',

    // Hero
    'hero.heading': 'Polarizado Cerámico & Protección de Élite para tu Auto',
    'hero.sub':
      'Rechaza hasta un 96% del calor infrarrojo y el 99.9% de los rayos UV con películas nano-cerámicas de grado aeroespacial y corte computarizado.',

    // Badge
    'badge.bot': 'Atención por WhatsApp',
    'badge.cotizaciones': 'Cotiza 24/7',

    // Trust highlights
    'trust.garantia': 'Garantía De Por Vida',
    'trust.garantiaDesc': 'En películas cerámicas y PPF',
    'trust.calor': 'Control Solar',
    'trust.calorDesc': 'Mayor confort en el interior',
    'trust.precision': 'Plotter de Precisión',
    'trust.precisionDesc': 'Corte digital sin contacto',
    'trust.tiempo': 'Agenda Flexible',
    'trust.tiempoDesc': 'Consulta disponibilidad',

    // Marquee
    'marquee.title': 'Corte digital certificado para vehículos de alta gama',

    // Banner
    'banner.title': '¿Tienes una consulta?',
    'banner.sub':
      'Puedes solicitar tu cotización 24/7. Envíanos por WhatsApp los datos de tu vehículo y el servicio que deseas.',
    'banner.cta': 'Cotiza 24/7 por WhatsApp',

    // Footer
    'footer.copy': '© 2025 Exclusive Tint. Todos los derechos reservados.',
  },

  en: {
    // Nav
    'nav.simulador': 'Simulator',
    'nav.servicios': 'Services',
    'nav.tecnologia': 'Thermal Tech',
    'nav.precios': 'Packages',
    'nav.opiniones': 'Reviews',

    // CTA
    'cta.agendar': 'Book Appointment',
    'cta.probar': 'Try Shades',
    'whatsapp.cta': 'Get a WhatsApp quote 24/7',
    'whatsapp.ctaMobile': 'Quote 24/7',

    // Hero
    'hero.heading': 'Ceramic Tint & Elite Protection for Your Car',
    'hero.sub':
      'Blocks up to 96% of infrared heat and 99.9% UV rays with aerospace‑grade nano‑ceramic films and computer‑precision cutting.',

    // Badge
    'badge.bot': 'WhatsApp contact',
    'badge.cotizaciones': 'Quotes 24/7',

    // Trust highlights
    'trust.garantia': 'Lifetime Warranty',
    'trust.garantiaDesc': 'On ceramic films & PPF',
    'trust.calor': 'Solar Control',
    'trust.calorDesc': 'More comfort inside',
    'trust.precision': 'Precision Plotter',
    'trust.precisionDesc': 'No‑touch digital cutting',
    'trust.tiempo': 'Flexible Scheduling',
    'trust.tiempoDesc': 'Ask for availability',

    // Marquee
    'marquee.title': 'Digital computer‑cut certified for high‑end vehicles',

    // Banner
    'banner.title': 'Have a question?',
    'banner.sub':
      'You can request a quote 24/7. Send us your vehicle details and the service you need on WhatsApp.',
    'banner.cta': 'Get a WhatsApp quote 24/7',

    // Footer
    'footer.copy': '© 2025 Exclusive Tint. All rights reserved.',
  },
};
