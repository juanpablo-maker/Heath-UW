export const es = {
  common: {
    loading: "Cargando...",
    backToHome: "Volver al inicio",
  },
  nav: {
    ariaMain: "Principal",
    ariaMobile: "Móvil",
    menu: "Menú",
    platformMenuId: "nav-platform-menu",
    platform: "Plataforma",
    platformMenuAria: "Plataforma",
    platformItems: [
      { href: "/sectores", label: "Sectores" },
      { href: "/mesa-de-trabajo", label: "Panel de Underwriting" },
    ],
    solutions: { href: "/soluciones", label: "Soluciones" },
    company: { href: "/empresa", label: "Empresa" },
    signIn: "Iniciar sesión",
    dashboard: "Dashboard",
    cta: "Solicitar demo",
    footerLinks: [
      { href: "/sectores", label: "Sectores" },
      { href: "/mesa-de-trabajo", label: "Panel de Underwriting" },
      { href: "/soluciones", label: "Soluciones" },
      { href: "/empresa", label: "Empresa" },
    ],
  },
  languageSwitcher: {
    ariaLabel: "Seleccionar idioma",
    es: "ES",
    en: "EN",
  },
  dashboard: {
    meta: {
      title: "Underwriting Dashboard | Heath",
      description:
        "Visibilidad operativa del pipeline de submissions y decisiones automáticas.",
    },
    brand: "Heath",
    title: "Underwriting Dashboard",
    subtitle:
      "Visibilidad operativa del pipeline de submissions y decisiones automáticas.",
    partialErrorsTitle: "Algunas vistas no pudieron cargarse",
    sections: {
      kpisTitle: "Indicadores",
      kpisDesc: "Totales agregados desde la vista de KPIs.",
      chartsTitle: "Visualización",
      chartsDesc:
        "Distribución de decisiones, declines y actividad por broker.",
    },
    kpi: {
      total_submissions: "Submissions",
      total_in_review: "En revisión",
      total_decline: "Decline",
      total_refer: "Refer",
      total_accept: "Accept",
      total_reply_sent: "Reply enviado",
      total_without_decision: "Sin decisión",
      total_missing_country: "País faltante",
    },
    charts: {
      decisionTitle: "Distribución por decisión",
      decisionDesc: "Volumen agregado según la decisión automática.",
      declineTitle: "Razones de decline",
      declineDesc: "Frecuencia por motivo registrado.",
      brokerTitle: "Submissions por broker",
      brokerDesc: "Comparativa de volumen por intermediario.",
      emptyTitle: "Sin datos",
      emptyDesc: "La vista no devolvió filas en este momento.",
      countLabel: "Cantidad",
    },
    submissions: {
      title: "Pipeline de submissions",
      subtitle:
        "Vista operativa principal; scroll horizontal en pantallas pequeñas.",
      empty: "No hay submissions en esta vista.",
      colInsured: "Asegurado",
      colBroker: "Broker",
      colLine: "Línea",
      colCountry: "País",
      colCurrency: "Moneda",
      colLimit: "Límite",
      colDecision: "Decisión",
      colReason: "Motivo",
      colStatus: "Estado",
      colReply: "Reply",
      colCreated: "Creado",
    },
    alerts: {
      title: "Alertas operativas",
      subtitle: "Casos que requieren atención inmediata.",
      emptyTitle: "Sin alertas activas",
      emptyDesc:
        "Cuando existan incidencias, aparecerán aquí con el tipo y contexto.",
      labelType: "Tipo",
      labelInsuredBroker: "Asegurado / Broker",
      labelLineCountry: "Línea / País",
      labelDecisionReply: "Decisión / Reply",
    },
    sla: {
      title: "Rendimiento operativo (SLA)",
      subtitleEmpty: "Antigüedad y tiempos de respuesta por caso.",
      emptyTitle: "Sin registros SLA",
      emptyDesc:
        "Cuando haya datos en la vista, verás el seguimiento por antigüedad.",
      subtitleFull:
        "Casos con mayor antigüedad resaltados; umbrales orientativos 2h / 8h.",
      legendOver2h: "> 2h",
      legendOver8h: "> 8h",
      colInsured: "Asegurado",
      colBroker: "Broker",
      colDecision: "Decisión",
      colReply: "Reply",
      colAge: "Antigüedad",
      colReplyTime: "Tiempo reply",
      colCreated: "Creado",
    },
    badges: {
      replySent: "Enviado",
      replyPending: "Pendiente",
      noDataTitle: "Sin dato",
      decisionAccept: "Aceptar",
      decisionApproved: "Aprobado",
      decisionDecline: "Declinar",
      decisionDeclined: "Declinado",
      decisionRefer: "Derivar",
      decisionPending: "Pendiente",
    },
    config: {
      title: "Configuración de Supabase",
      envHint:
        "Añade NEXT_PUBLIC_SUPABASE_URL y una clave pública (NEXT_PUBLIC_SUPABASE_ANON_KEY o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) en .env.local y reinicia el servidor de desarrollo.",
    },
    errors: {
      missingEnvBody:
        "Faltan variables de entorno de Supabase. Configura la URL del proyecto y una clave pública.",
      loadFailed: "No se pudo cargar el dashboard",
      unexpected: "Error inesperado al obtener datos.",
      retry: "Reintentar",
    },
    minutesSuffix: "min",
  },
  hero: {
    badge: "Underwriting en tiempo real",
    subBadge: "Decisiones con contexto de portafolio",
    title: "La suscripción dejó de ser un proceso.",
    titleAccent: "Ahora es un sistema en tiempo real",
    description:
      "Centraliza oportunidades, evalúa riesgos y toma decisiones con contexto de portafolio en segundos.",
    primaryCta: "Ver cómo funciona",
    secondaryCta: "Solicitar demo",
  },
  footer: {
    description:
      "Plataforma de suscripción impulsada por IA para aseguradores y reaseguradores. Decisiones más rápidas y mejor control del portafolio.",
    contact: "Contáctanos",
    copyright: "© Heath. Todos los derechos reservados.",
  },
  forms: {
    demo: {
      name: "Nombre",
      namePlaceholder: "Tu nombre",
      email: "Correo corporativo",
      emailPlaceholder: "nombre@empresa.com",
      company: "Empresa",
      companyPlaceholder: "Aseguradora / reaseguradora",
      sending: "Enviando...",
      submit: "Enviar solicitud (simulación)",
      errors: {
        email: "Ingresá un correo corporativo válido.",
        name: "Ingresá tu nombre.",
        company: "Ingresá la empresa.",
      },
    },
    login: {
      title: "Iniciar sesión",
      subtitle: "Accedé al dashboard de suscripción (mock, sin backend).",
      email: "Correo corporativo",
      emailPlaceholder: "nombre@empresa.com",
      password: "Contraseña",
      passwordPlaceholder: "••••••••",
      submit: "Ir al dashboard",
      submitting: "Ingresando...",
      hint: "Demo: correo demo@heath.ai y contraseña demo",
      errors: {
        email: "Ingresá un correo válido.",
        password: "Ingresá tu contraseña.",
      },
    },
  },
  marketingLayout: {
    backHome: "Volver al inicio",
  },
  landing: {
    comparison: {
      kicker: "Comparación",
      title: "Velocidad y claridad frente al modelo tradicional",
      subtitle: "Mismo mercado, distinta forma de operar la mesa.",
      positiveTitle: "En segundos, con Heath",
      positiveBullets: [
        "Ingesta estructurada al instante",
        "Soporte a la decisión en tiempo real",
        "Suscripción consciente de capacidad",
      ],
      negativeTitle: "En días, de forma tradicional",
      negativeBullets: [
        "Procesamiento manual por correo",
        "Decisiones fragmentadas",
        "Sin visibilidad de la exposición",
      ],
    },
    process: {
      kicker: "Flujo",
      title: "Cómo funciona",
      subtitle: "De la recepción a la decisión en cuatro pasos claros.",
      steps: [
        { label: "Ingresar solicitudes", subline: "Desde correo, portal o API" },
        { label: "Estructurar datos", subline: "Extracción y normalización automática" },
        { label: "Analizar y puntuar", subline: "Puntuación e indicadores con IA" },
        { label: "Decidir y hacer seguimiento", subline: "Flujo de trabajo y trazabilidad" },
      ],
    },
    capabilities: {
      label: "Capacidad",
      sections: [
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
        },
      ],
    },
    social: {
      kicker: "Confianza",
      title: "Con la confianza de aseguradores y reaseguradores líderes",
      logos: ["Socio A", "Socio B", "Socio C", "Socio D", "Socio E", "Socio F"],
    },
    finalCta: {
      kicker: "Siguiente paso",
      title: "Empezá a suscribir con",
      titleAccent: "velocidad de mercado",
      description: "Pasá de solicitudes fragmentadas a inteligencia de suscripción estructurada.",
      primary: "Solicitar demo",
      secondary: "Panel de Underwriting",
    },
  },
  pages: {
    soluciones: {
      title: "Soluciones",
      subtitle: "Cómo los equipos implementan Heath en intake, decisiones y control de portafolio.",
      intro:
        "Desde la digitalización de solicitudes hasta la gobernanza de exposición, Heath conecta los flujos que las organizaciones de suscripción necesitan. Esta vista resume las capacidades que podés explorar en el recorrido y las demos.",
      bullets: [
        "Intake estructurado y triage para líneas especializadas",
        "Decisiones consistentes con contexto de auditoría",
        "Visibilidad de portafolio para límites y acumulación",
      ],
    },
    sectores: {
      title: "Sectores",
      subtitle: "Especialidad y profundidad por ramo, con flujos adaptados a cada mercado.",
      intro:
        "Heath está pensado para aseguradores y reaseguradores de líneas especializadas. Esta página es un marcador de posición de marketing: aquí podrás detallar aviación, marítimo, propiedad, construcción, PVT y otros sectores.",
      list: ["Aviación", "Marítimo", "Construcción", "Propiedad", "Violencia política y terrorismo", "Modelo enterprise multi-ramo"],
    },
    recursos: {
      title: "Recursos",
      subtitle: "Ideas, guías y novedades para equipos de suscripción e innovación.",
      intro: "Estructura alineada a sitios enterprise de insurtech: blog, eventos, medios y descargas.",
      items: [
        { t: "Blog", d: "Artículos sobre IA, orquestación y suscripción." },
        { t: "Eventos", d: "Webinars y encuentros con el sector." },
        { t: "Medios", d: "Notas de prensa y cobertura." },
        { t: "Documentos", d: "Documentación técnica y de negocio (próximamente)." },
      ],
    },
    empresa: {
      title: "Empresa",
      subtitle: "Construimos la siguiente generación de inteligencia de suscripción.",
      intro:
        "Historia, misión, alianzas y carreras. Texto provisional hasta definición de marca y mensajes corporativos.",
      upcoming: "Próximamente",
      upcomingItems: "Sobre nosotros · Asociarse con Heath · Oportunidades laborales",
    },
    exposicion: {
      title: "Gestión de exposición",
      subtitle: "Conocé el libro mientras lo construís: límites, acumulación y concentración.",
      p1: "Cada decisión se evalúa en contexto de portafolio, reduciendo sorpresas en renovación y reforzando el control de capacidad.",
      p2: "Texto provisional de marketing: tableros, reglas y alertas se documentarán aquí cuando el producto lo requiera.",
    },
    mesa: {
      title: "Panel de Underwriting",
      subtitle: "Una interfaz operativa para gestionar el ciclo completo de underwriting con contexto de portafolio.",
      p1: "El panel unifica solicitudes, extracción de datos y decisiones con trazabilidad. Diseñado para decisiones consistentes, menores tiempos y mejor control de capacidad.",
      p2: "En esta demo, la experiencia es 100% mock: al solicitar demo podrás explorar escenarios de distintas oportunidades.",
      primary: "Entrar al panel",
      secondary: "Volver al inicio",
      cards: [
        { title: "Bandeja unificada", description: "Solicitudes estructuradas con estado y contexto para cada oportunidad." },
        { title: "Reglas y configuración", description: "Ajustá estrategia, umbrales y buffers para ver el impacto estimado." },
        { title: "Trazabilidad de decisiones", description: "Historial claro de decisiones: qué se hizo, por qué y con qué riesgo." },
      ],
    },
    demo: {
      title: "Solicitar demo",
      subtitle: "Coordinemos una sesión con tu equipo de suscripción y tecnología.",
      intro: "Este formulario es una simulación: al enviarlo, se inicia una sesión mock y se redirige al Panel de Underwriting.",
    },
    login: {
      title: "Iniciar sesión",
      subtitle: "Entrá al dashboard de suscripción. (Simulación sin backend)",
    },
  },
} as const;
