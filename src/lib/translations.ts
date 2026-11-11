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
    'whatsapp.cta': 'Cotizar vía WhatsApp',

    // Hero
    'hero.heading': 'Polarizado Cerámico & Protección de Élite para tu Auto',
    'hero.sub':
      'Rechaza hasta un 96% del calor infrarrojo y el 99.9% de los rayos UV con películas nano-cerámicas de grado aeroespacial y corte computarizado.',

    // Badge
    'badge.bot': 'Bot Nocturno 24/7 Activo',
    'badge.cotizaciones': 'Cotizaciones inmediatas',

    // Trust highlights
    'trust.garantia': 'Garantía De Por Vida',
    'trust.garantiaDesc': 'En películas cerámicas y PPF',
    'trust.calor': '−15 °C Menos Calor',
    'trust.calorDesc': 'Interior más fresco en segundos',
    'trust.precision': 'Plotter de Precisión',
    'trust.precisionDesc': 'Corte digital sin contacto',
    'trust.tiempo': 'Instalación en 90 min',
    'trust.tiempoDesc': 'Bahía sellada y climatizada',

    // Marquee
    'marquee.title': 'Corte digital certificado para vehículos de alta gama',

    // Banner
    'banner.title': '¿Tienes una consulta tarde en la noche?',
    'banner.sub':
      'Nuestro bot de WhatsApp responde 24/7 — recibe una cotización instantánea sin esperar.',
    'banner.cta': 'Escribir al Bot de WhatsApp',

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
    'whatsapp.cta': 'Quote via WhatsApp',

    // Hero
    'hero.heading': 'Ceramic Tint & Elite Protection for Your Car',
    'hero.sub':
      'Blocks up to 96% of infrared heat and 99.9% UV rays with aerospace‑grade nano‑ceramic films and computer‑precision cutting.',

    // Badge
    'badge.bot': '24/7 WhatsApp Bot Active',
    'badge.cotizaciones': 'Instant quotes',

    // Trust highlights
    'trust.garantia': 'Lifetime Warranty',
    'trust.garantiaDesc': 'On ceramic films & PPF',
    'trust.calor': '−15 °C Less Heat',
    'trust.calorDesc': 'Cooler interior instantly',
    'trust.precision': 'Precision Plotter',
    'trust.precisionDesc': 'No‑touch digital cutting',
    'trust.tiempo': '90‑Min Installation',
    'trust.tiempoDesc': 'Sealed, climate‑controlled bay',

    // Marquee
    'marquee.title': 'Digital computer‑cut certified for high‑end vehicles',

    // Banner
    'banner.title': 'Have a late‑night question?',
    'banner.sub':
      'Our WhatsApp bot replies 24/7 — get an instant quote without waiting.',
    'banner.cta': 'Chat with WhatsApp Bot',

    // Footer
    'footer.copy': '© 2025 Exclusive Tint. All rights reserved.',
  },
};
