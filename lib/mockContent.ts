import type { MockPanelType } from "@/components/CapabilitySection";

export const capabilitySections: Array<{
  title: string;
  paragraph: string;
  bullets: string[];
  mockPanel: MockPanelType;
  imageRight: boolean;
}> = [
  {
    title: "Gestión de recepción y compromisos",
    paragraph:
      "Unificá la llegada de oportunidades desde correos y portales en un único Panel de Underwriting. La plataforma extrae datos estructurados, rastrea compromisos y mantiene el estado de cada submission en tiempo real.",
    bullets: [
      "Ingesta automática de correos y documentos",
      "Extracción estructurada de datos con IA",
      "Seguimiento de compromisos y plazos",
      "Panel de Underwriting unificado de submissions",
    ],
    mockPanel: "intake",
    imageRight: true,
  },
  {
    title: "Soporte a la decisión de underwriting",
    paragraph:
      "Obtené puntuación de oportunidades, control de capacidad y recomendaciones de participación integradas en el flujo de decisión. Todo el contexto necesario para decidir con confianza.",
    bullets: [
      "Puntuación de oportunidades",
      "Control de capacidad y límites",
      "Recomendación de participación",
      "Flujo de decisión auditable",
    ],
    mockPanel: "decision",
    imageRight: false,
  },
  {
    title: "Inteligencia de portafolio",
    paragraph:
      "Visualizá exposición, concentración y tendencias en tableros. Analizá motivos de rechazo y pronosticá el pipeline comercial para planificar con datos.",
    bullets: [
      "Tablero de visibilidad del portafolio",
      "Análisis de concentración y exposición",
      "Motivos de rechazo y tendencias",
      "Pronóstico de pipeline",
    ],
    mockPanel: "portfolio",
    imageRight: true,
  },
];

export const processSteps = [
  { label: "Ingresar solicitudes", subline: "Desde correo, portal o API" },
  { label: "Estructurar datos", subline: "Extracción y normalización automática" },
  { label: "Analizar y puntuar", subline: "Puntuación e indicadores con IA" },
  { label: "Decidir y hacer seguimiento", subline: "Flujo de trabajo y trazabilidad" },
];
