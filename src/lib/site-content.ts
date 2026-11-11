import { translations } from "@/lib/translations";
import type { Locale } from "@/lib/translations";

export interface TextField { key: string; group: string; label: string; es: string; en: string }

const additionalFields: TextField[] = [
  ["brand.name", "Marca", "Nombre", "EXCLUSIVE TINT", "EXCLUSIVE TINT"],
  ["brand.tagline", "Marca", "Lema", "Estudio Automotriz de Precisión", "Precision Automotive Studio"],
  ["marquee.brands", "Portada", "Marcas (separadas por coma)", "PORSCHE, TESLA, BMW M-SERIES, MERCEDES-BENZ, AUDI SPORT, RANGE ROVER, LAMBORGHINI, FERRARI, CORVETTE, LEXUS F-SPORT", "PORSCHE, TESLA, BMW M-SERIES, MERCEDES-BENZ, AUDI SPORT, RANGE ROVER, LAMBORGHINI, FERRARI, CORVETTE, LEXUS F-SPORT"],
  ["compare.eyebrow", "Comparativa", "Etiqueta", "Diferencia Infrarroja", "Infrared Difference"],
  ["compare.heading", "Comparativa", "Título", "Siente el cambio antes y después de la instalación", "Feel the difference before and after installation"],
  ["compare.intro", "Comparativa", "Introducción", "Desliza el divisor interactivo para comparar la protección del interior.", "Slide to compare interior protection."],
  ["compare.beforeBadge", "Comparativa", "Etiqueta antes", "Cristal de Fábrica", "Factory Glass"],
  ["compare.beforeTitle", "Comparativa", "Título antes", "Interior expuesto al sol", "Interior Exposed to Sun"],
  ["compare.beforeBody", "Comparativa", "Texto antes", "La luz solar puede elevar la temperatura y desgastar los materiales del interior.", "Sunlight can heat the cabin and wear interior materials."],
  ["compare.beforeLabel", "Comparativa", "Pie antes", "Sin polarizado", "Without Tint"],
  ["compare.afterBadge", "Comparativa", "Etiqueta después", "Nano-Cerámica Exclusive", "Exclusive Nano-Ceramic"],
  ["compare.afterTitle", "Comparativa", "Título después", "Interior protegido y más confortable", "Protected, More Comfortable Interior"],
  ["compare.afterBody", "Comparativa", "Texto después", "Una película adecuada puede reducir la entrada de calor y proteger el interior.", "The right film can reduce heat and protect the interior."],
  ["compare.afterLabel", "Comparativa", "Pie después", "Con polarizado cerámico", "With Ceramic Tint"],
  ["services.eyebrow", "Servicios", "Etiqueta", "Especialidades Exclusive Tint", "Exclusive Tint Specialties"],
  ["services.heading", "Servicios", "Título", "Tratamientos Estéticos y de Protección Vehicular", "Vehicle Protection and Appearance Services"],
  ["services.photoNote", "Servicios", "Nota de imágenes", "Imágenes ilustrativas. Consulta opciones y disponibilidad para tu vehículo.", "Illustrative images. Ask about options and availability for your vehicle."],
  ["pricing.eyebrow", "Precios", "Etiqueta", "Inversión Transparente", "Clear Pricing"],
  ["pricing.heading", "Precios", "Título", "Paquetes de Instalación Certificada", "Certified Installation Packages"],
  ["pricing.intro", "Precios", "Introducción", "Elige el nivel de rendimiento que mejor se adapte a tu vehículo y estilo de vida.", "Choose the level of protection that fits your vehicle and lifestyle."],
  ["pricing.recommended", "Precios", "Etiqueta recomendado", "Recomendado", "Recommended"],
  ["pricing.installation", "Precios", "Sufijo de precio", "/ instalación", "/ installation"],
  ["reviews.badge", "Opiniones", "Etiqueta", "Opiniones", "Reviews"],
  ["reviews.heading", "Opiniones", "Título", "Opiniones de Clientes", "Customer Reviews"],
  ["reviews.intro", "Opiniones", "Introducción", "Experiencias compartidas por nuestros clientes.", "Experiences shared by our customers."],
  ["reviews.empty", "Opiniones", "Sin opiniones", "Próximamente publicaremos opiniones de nuestros clientes.", "Customer reviews are coming soon."],
  ["reviews.loading", "Opiniones", "Cargando", "Cargando opiniones...", "Loading reviews..."],
  ["reviews.verified", "Opiniones", "Verificado", "Verificado", "Verified"],
  ["sim.eyebrow", "Simulador", "Etiqueta", "Simulador Interactivo de Tonalidades", "Interactive Tint Simulator"],
  ["sim.heading", "Simulador", "Título", "Elige el nivel de oscuridad para tu auto", "Choose the Tint Level for Your Car"],
  ["sim.intro", "Simulador", "Introducción", "Visualización orientativa de tonalidad. Confirma las prestaciones con la ficha técnica de la película.", "Tint preview only. Confirm performance with the film's technical sheet."],
  ["sim.selected", "Simulador", "Tono seleccionado", "Tono Seleccionado", "Selected Tint"],
  ["sim.preview", "Simulador", "Vista simulada", "Vista exterior simulada", "Simulated Exterior View"],
  ["sim.driver", "Simulador", "Conductor", "Conductor", "Driver"],
  ["sim.passenger", "Simulador", "Copiloto", "Copiloto", "Passenger"],
  ["sim.uv", "Simulador", "Rechazo UV", "Rechazo UV", "UV Rejection"],
  ["sim.heat", "Simulador", "Rechazo IR", "Rechazo Calor (IR)", "Heat Rejection (IR)"],
  ["sim.glare", "Simulador", "Destello", "Reducción Destello", "Glare Reduction"],
  ["sim.category", "Simulador", "Categoría", "Categoría", "Category"],
  ["sim.popular", "Simulador", "Más popular", "Más Popular", "Most Popular"],
  ["sim.recommendation", "Simulador", "Recomendación", "Recomendación", "Recommendation"],
  ["sim.legal", "Simulador", "Nota normativa", "Consulta la normativa local antes de elegir esta tonalidad.", "Check local rules before choosing this tint."],
  ["whatsapp.message.quote", "WhatsApp", "Mensaje cotización", "Hola Exclusive Tint, deseo cotizar un servicio", "Hello Exclusive Tint, I would like a quote"],
  ["whatsapp.message.book", "WhatsApp", "Mensaje cita", "Hola Exclusive Tint, deseo agendar mi cita", "Hello Exclusive Tint, I would like to book an appointment"],
  ["whatsapp.message.banner", "WhatsApp", "Mensaje banner", "Hola Exclusive Tint, quiero cotizar un servicio", "Hello Exclusive Tint, I would like a quote"],
].map(([key, group, label, es, en]) => ({ key, group, label, es, en }));

const serviceDefaults = [
  ["tint", "Nano-Ceramic Window Tint", "Películas cerámicas no metálicas de última generación con hasta 96% de rechazo infrarrojo. No interfieren con telecomunicaciones.", "Saber más", "Nano-Ceramic Window Tint", "Advanced non-metallic ceramic films that reduce infrared heat without interfering with signals.", "Learn more"],
  ["ppf", "Paint Protection Film (PPF)", "Blindaje transparente autorregenerable de uretano contra impactos de piedras de carretera, gravilla e insectos.", "Cotizar PPF", "Paint Protection Film (PPF)", "Self-healing clear protection against road debris and insects.", "Quote PPF"],
  ["coating", "Ceramic Coating 9H", "Sellado de cristales y carrocería con brillo hidrofóbico efecto espejo de ultra larga duración.", "Ver detalles", "Ceramic Coating 9H", "Hydrophobic ceramic finish for glass and paint.", "Details"],
  ["cut", "Corte Computarizado Digital", "Patrones exactos pre-cortados por software digital milimétrico para cada marca y modelo. Cero cortes sobre los cristales o empaques de tu auto.", "Ver tecnología", "Digital Precision Cutting", "Computer-cut patterns tailored to each vehicle model.", "See technology"],
  ["wrap", "Vinyl Wrap", "Personaliza el acabado de tu vehículo con vinil automotriz. Consulta colores, cobertura y disponibilidad.", "Consultar Vinyl Wrap", "Vinyl Wrap", "Customize your vehicle's finish with automotive vinyl. Ask about colors, coverage, and availability.", "Ask About Vinyl Wrap"],
];
for (const [id, esName, esDescription, esCta, enName, enDescription, enCta] of serviceDefaults) {
  additionalFields.push(
    { key: `service.${id}.name`, group: "Servicios", label: `${id} · nombre`, es: esName, en: enName },
    { key: `service.${id}.description`, group: "Servicios", label: `${id} · descripción`, es: esDescription, en: enDescription },
    { key: `service.${id}.cta`, group: "Servicios", label: `${id} · botón`, es: esCta, en: enCta },
  );
}

const plans = [
  { id: "carbon", name: "Carbon Series", esTagline: "Estética deportiva con protección solar básica.", enTagline: "Sporty style with basic solar protection.", price: "$149", features: ["Bloqueo 99% rayos UV", "Reducción de calor de hasta 45%", "Garantía de 3 años contra decoloración", "Tonalidades disponibles: 5%, 20%, 35%", "Corte computarizado a la medida"], cta: "Cotizar Carbon" },
  { id: "ceramic", name: "Nano-Ceramic IR", esTagline: "Nuestra fórmula más vendida para máxima reducción térmica.", enTagline: "Our best-selling formula for thermal comfort.", price: "$299", features: ["Bloqueo 99.9% rayos UV dañinos", "Reducción térmica infrarroja de hasta 95%", "Cero interferencia con GPS, radio o celulares", "Garantía de por vida Exclusive Tint", "Instalación certificada en bahía sellada", "Incluye visera de parabrisas de cortesía"], cta: "Cotizar Nano-Ceramic" },
  { id: "ppf", name: "Ceramic + Full PPF", esTagline: "Protección definitiva contra impactos de piedras y rayos solares.", enTagline: "Complete protection against road debris and sunlight.", price: "$899", features: ["Tint Nano-Ceramic completo en todos los cristales", "Paint Protection Film (PPF) frontal autorregenerable", "Protección contra gravilla, piedras y rayones", "Recubrimiento hidrofóbico cerámico en lunas", "Garantía integral de 10 años"], cta: "Cotizar Protección Total" },
];
for (const plan of plans) {
  additionalFields.push(
    { key: `plan.${plan.id}.name`, group: "Precios", label: `${plan.id} · nombre`, es: plan.name, en: plan.name },
    { key: `plan.${plan.id}.tagline`, group: "Precios", label: `${plan.id} · descripción`, es: plan.esTagline, en: plan.enTagline },
    { key: `plan.${plan.id}.price`, group: "Precios", label: `${plan.id} · precio`, es: plan.price, en: plan.price },
    { key: `plan.${plan.id}.cta`, group: "Precios", label: `${plan.id} · botón`, es: plan.cta, en: "Request Quote" },
  );
  plan.features.forEach((feature, index) => additionalFields.push({ key: `plan.${plan.id}.feature${index + 1}`, group: "Precios", label: `${plan.id} · beneficio ${index + 1}`, es: feature, en: feature }));
}

const simulatorOptions = [
  ["5", "5% Limo Black", "Máxima Privacidad", "Bloqueo visual casi total del exterior hacia adentro. Máxima discreción."],
  ["20", "20% Dark Smoke", "Factory Match", "El equilibrio entre estética, visibilidad y privacidad."],
  ["35", "35% Medium Sport", "Equilibrio Diario", "Visibilidad nocturna con apariencia elegante."],
  ["50", "50% Light Neutral", "Sutil & Confort", "Protección térmica con oscurecimiento sutil."],
  ["70", "70% Clear Nano-Ceramic", "Protección Invisible", "Protección térmica con tonalidad clara."],
];
for (const [id, name, category, description] of simulatorOptions) {
  additionalFields.push(
    { key: `sim.option${id}.name`, group: "Simulador", label: `${id}% · nombre`, es: name, en: name },
    { key: `sim.option${id}.category`, group: "Simulador", label: `${id}% · categoría`, es: category, en: category },
    { key: `sim.option${id}.description`, group: "Simulador", label: `${id}% · descripción`, es: description, en: description },
  );
}

const existingFields: TextField[] = Object.keys(translations.es).map((key) => ({
  key,
  group: key.split(".")[0],
  label: key,
  es: translations.es[key],
  en: translations.en[key] ?? translations.es[key],
}));
export const SITE_TEXT_FIELDS: TextField[] = [...existingFields, ...additionalFields];
export const SITE_TEXT_KEYS = new Set(SITE_TEXT_FIELDS.map((field) => field.key));
export const defaultSiteTexts: Record<Locale, Record<string, string>> = {
  es: Object.fromEntries(SITE_TEXT_FIELDS.map((field) => [field.key, field.es])),
  en: Object.fromEntries(SITE_TEXT_FIELDS.map((field) => [field.key, field.en])),
};

export const SITE_IMAGE_SLOTS = [
  { slot: "hero", label: "Portada principal" },
  { slot: "compare_before", label: "Comparativa: antes" },
  { slot: "compare_after", label: "Comparativa: después" },
  { slot: "service_tint", label: "Servicio: polarizado" },
  { slot: "service_ppf", label: "Servicio: PPF" },
  { slot: "service_coating", label: "Servicio: coating" },
  { slot: "service_cut", label: "Servicio: corte" },
  { slot: "service_wrap", label: "Servicio: vinyl wrap" },
  { slot: "simulator", label: "Fondo del simulador" },
] as const;
export type SiteImageSlot = typeof SITE_IMAGE_SLOTS[number]["slot"];
export const SITE_IMAGE_KEYS = new Set<string>(SITE_IMAGE_SLOTS.map((item) => item.slot));
export interface SiteImage { slot: string; url: string; alt_es: string; alt_en: string; updated_at?: string }

const sample = (slot: string, file: string, alt_es: string, alt_en: string): SiteImage => ({
  slot, url: `/images/examples/${file}`, alt_es, alt_en,
});

export const SITE_SAMPLE_IMAGES: Record<SiteImageSlot, SiteImage> = {
  hero: sample("hero", "hero-car.jpg", "Auto deportivo oscuro al aire libre", "Dark sports car outdoors"),
  compare_before: sample("compare_before", "hero-car.jpg", "Auto antes de la simulación de polarizado", "Car before the tint simulation"),
  compare_after: sample("compare_after", "hero-car.jpg", "Auto en la simulación de polarizado", "Car in the tint simulation"),
  service_tint: sample("service_tint", "window-tint.jpg", "Técnico instalando película en la ventana de un auto", "Technician installing film on a car window"),
  service_ppf: sample("service_ppf", "ppf-film.jpg", "Técnicos aplicando película protectora a un auto", "Technicians applying protective film to a car"),
  service_coating: sample("service_coating", "coating-car.jpg", "Auto con acabado brillante en un estudio de detailing", "Glossy car in a detailing studio"),
  service_cut: sample("service_cut", "cutting-plotter.jpg", "Plotter de corte en funcionamiento", "Cutting plotter in use"),
  service_wrap: sample("service_wrap", "vinyl-wrap-install.jpg", "Técnico aplicando vinil al capó de un auto", "Technician applying vinyl to a car hood"),
  simulator: sample("simulator", "hero-car.jpg", "Auto oscuro para el simulador de tonalidades", "Dark car for the tint simulator"),
};
