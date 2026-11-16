import type { Lead } from "@/types/lead"

export interface ObjecaoResposta {
  objecao: string
  resposta: string
}

/** Playbook de abordagem montado a partir dos dados do lead - determinístico e
 * instantâneo (sem custo de IA). A IA gera a COPY; isto aqui é o plano de venda
 * que orienta você antes de apertar o botão. */
export interface EstrategiaLead {
  cenario: string
  angulo: string
  ganchos: string[]
  objecoes: ObjecaoResposta[]
  proximoPasso: string
}

const OBJECOES_SEM_SITE: ObjecaoResposta[] = [
  {
    objecao: '"Ya tengo Instagram/WhatsApp, no necesito sitio web"',
    resposta:
      "Instagram llega a quien ya te sigue; el sitio web atrapa a quien busca en Google sin conocerte. Uno complementa al otro, y el sitio te da una dirección profesional que genera confianza a la hora de cerrar.",
  },
  {
    objecao: '"Un sitio web es caro / no es prioridad ahorita"',
    resposta:
      "Compáralo con lo que te cuesta UN cliente que te buscó, no te encontró y se fue con la competencia. El sitio se paga con el primer cliente que te traiga, y se puede empezar con algo sencillo e irlo creciendo.",
  },
  {
    objecao: '"No tengo tiempo para encargarme de eso"',
    resposta:
      "No tienes que encargarte de nada: yo me ocupo de todo, textos, fotos, publicación y mantenimiento. Solo necesito una plática de 20 minutos para entender tu negocio.",
  },
]

const OBJECOES_SITE_RUIM: ObjecaoResposta[] = [
  {
    objecao: '"Ya tengo sitio web"',
    resposta:
      "La cuestión no es tener sitio, sino que el sitio trabaje a tu favor. Hoy está alejando clientes en lugar de atraerlos, y quien busca desde el celular se va en segundos si la página no carga bien.",
  },
  {
    objecao: '"Me lo hizo un conocido"',
    resposta:
      "Sin demeritar su trabajo: la tecnología de los sitios web envejece rápido. Lo que funcionaba hace 5 años hoy Google lo penaliza. Se puede aprovechar el contenido y modernizar la base.",
  },
  {
    objecao: '"Lo voy a ver con quien me hizo el sitio"',
    resposta:
      "Perfecto. Y si quieres una segunda opinión sin compromiso, te mando un diagnóstico gratuito de lo que está fallando. Así comparas las propuestas.",
  },
]

function ganchoDeReputacao(lead: Lead): string | null {
  const nota = lead.nota ?? 0
  const avaliacoes = lead.num_avaliacoes ?? 0
  if (nota >= 4.8 && avaliacoes >= 50) {
    return `Calificación de ${nota} con ${avaliacoes} reseñas: reputación de sobra y un negocio claramente establecido. Es el cliente ideal, que ve resultados rápidos con un sitio web.`
  }
  if (nota >= 4.5 && avaliacoes >= 10) {
    return `Calificación de ${nota} con ${avaliacoes} reseñas: la reputación ya existe, solo que no se está aprovechando fuera de Maps.`
  }
  return `Calificación de ${nota} en Google: úsala como halago para abrir la conversación, nunca como crítica.`
}

export function montarEstrategia(lead: Lead): EstrategiaLead {
  const problemas = (lead.site_problemas ?? "").toLowerCase()
  const siteRuim = lead.site_status === "site_ruim"

  const ganchos: string[] = []
  const reputacao = ganchoDeReputacao(lead)
  if (reputacao) ganchos.push(reputacao)

  let cenario: string
  let angulo: string
  let objecoes: ObjecaoResposta[]

  if (lead.site_status === "site_ok") {
    return {
      cenario: "Sitio web bien",
      angulo:
        "El nuevo análisis mostró que el sitio actual está técnicamente bien: no hay un problema obvio sobre el cual vender. Si aun así quieres contactarlo, el ángulo cambia: mejorar resultados (más contactos, mejor posición en Google), no arreglar algo roto. Si no, considera ignorar el lead y enfocarte en los más calientes.",
      ganchos: [reputacao ?? "Si lo contactas, usa la reputación para abrir."].filter(Boolean) as string[],
      objecoes: [],
      proximoPasso:
        "Prioridad baja: este lead compite en tu fila con leads sin sitio web o con un sitio deficiente. Contáctalo solo si la zona o el nicho son estratégicos.",
    }
  }

  if (!siteRuim) {
    cenario = "Sin sitio web"
    angulo =
      "Negocio bien calificado pero invisible para quien busca en Google fuera de Maps. El argumento: cada búsqueda sin resultado es un cliente que se va con la competencia que sí aparece. Vende su PRIMER sitio web como la pieza que falta para que la reputación se convierta en clientes nuevos."
    objecoes = OBJECOES_SEM_SITE
    if (lead.instagram_url) {
      ganchos.push(
        "Ya tiene Instagram activo: señal de que invierte en presencia digital. El sitio web es el paso natural: da resultados en Google y una credibilidad que las redes sociales solas no dan."
      )
    } else {
      ganchos.push(
        "Presencia digital prácticamente nula: quien llega, llega por recomendación. Un sitio web abre el canal de clientes que buscan por su cuenta."
      )
    }
  } else if ((problemas.includes("fora do ar") || problemas.includes("caído") || problemas.includes("no abre"))) {
    cenario = "Sitio web caído"
    angulo =
      "Su sitio NO ABRE: quien hoy le da clic se encuentra con un error. Abre la conversación como un AVISO de cortesía (genera agradecimiento, no parece venta) y ofrece reconstruirlo rápido. Es el escenario de mayor urgencia y mejor tasa de respuesta."
    objecoes = OBJECOES_SITE_RUIM
    ganchos.push(
      "Dile que intentaste entrar a su sitio y está caído: estás avisando, no vendiendo. La oferta va después de su reacción."
    )
  } else if (problemas.includes("ssl") || problemas.includes("https") || problemas.includes("misto") || problemas.includes("mixto")) {
    cenario = "Sitio web inseguro"
    angulo =
      'El navegador marca su sitio como "no seguro": eso espanta clientes al instante y lo hunde en Google. Argumento: la reputación que construyeron se está desgastando por un candado rojo.'
    objecoes = OBJECOES_SITE_RUIM
    ganchos.push(
      'Mándale una captura del aviso de "no seguro" del navegador: es visual, indiscutible y nadie quiere eso asociado a su marca.'
    )
  } else if (problemas.includes("celular")) {
    cenario = "Sitio web no apto para celular"
    angulo =
      "Su sitio se ve mal en el celular, y la inmensa mayoría de las búsquedas locales se hacen desde el celular. Argumento: el sitio actual funciona bien justo para el público que casi no existe (computadora) y falla donde está el cliente."
    objecoes = OBJECOES_SITE_RUIM
    ganchos.push(
      "Sugiérele que abra su propio sitio en el celular en ese momento: la mala experiencia se vende sola como argumento."
    )
  } else if (problemas.includes("lento")) {
    cenario = "Sitio web lento"
    angulo =
      "El sitio funciona, pero tarda tanto en cargar que buena parte de los visitantes se va antes de ver algo. Argumento: no es cambiarlo por vanidad, es dejar de perder a quien ya le dio clic. Un sitio rápido convierte esa misma visita que hoy se va."
    objecoes = OBJECOES_SITE_RUIM
    ganchos.push(
      "Sugiérele que abra su propio sitio con datos móviles, sin wifi: la espera se vende sola como argumento. Si tienes el diagnóstico en PDF, la calificación oficial de Google cierra el tema."
    )
  } else if ((problemas.includes("construtor") || problemas.includes("constructor"))) {
    cenario = "Sitio web de plantilla"
    angulo =
      "El sitio está hecho con una plantilla (Wix, Canva y similares): funciona, pero se ve igual a miles de otros y no transmite la credibilidad que su reputación merece. Argumento: un negocio con calificación alta merece un sitio propio, con identidad propia, que aparezca en Google por su nombre, no una plantilla genérica."
    objecoes = [
      {
        objecao: '"Con Wix/Canva me basta"',
        resposta:
          "Te basta como basta una tarjeta improvisada: existe, pero no te distingue. Un sitio propio tiene dominio profesional, carga más rápido, se posiciona mejor en Google y da la impresión de negocio establecido, que es justo lo que ya dice tu calificación.",
      },
      {
        objecao: '"Yo mismo lo actualizo, es práctico"',
        resposta:
          "Eso sigue igual: te lo entrego con un panel sencillo para que edites lo que quieras. La diferencia está en la base: diseño exclusivo, dominio propio y una estructura que Google toma en serio.",
      },
      {
        objecao: '"No quiero volver a pagar una mensualidad"',
        resposta:
          "La plataforma también te cobra mensualidad para quitar su marca y usar tu dominio. Muchas veces el sitio propio cuesta parecido, solo que el resultado es de otro nivel.",
      },
    ]
    ganchos.push(
      "Menciona que se nota que el sitio se hizo con una plantilla y remata con la reputación: \"un negocio con esa calificación merece un sitio a la altura\"."
    )
  } else if ((problemas.includes("vazia") || problemas.includes("vacía"))) {
    cenario = "Sitio web vacío"
    angulo =
      "El sitio existe pero está prácticamente vacío: no cuenta qué hacen, no muestra su trabajo, no convence a nadie. Argumento: hoy es una tarjeta de presentación en blanco; la propuesta es convertirlo en una página que venda."
    objecoes = OBJECOES_SITE_RUIM
    ganchos.push(
      "Menciona algo específico que falte (servicios, fotos, botón de WhatsApp) para demostrar que de verdad revisaste su sitio."
    )
  } else {
    cenario = "Sitio web con problemas"
    angulo =
      "El sitio existe pero tiene problemas técnicos que le cuestan clientes. Plantéalo como diagnóstico: señala el problema en lenguaje sencillo y ofrece rehacerlo como solución directa."
    objecoes = OBJECOES_SITE_RUIM
    if (lead.site_problemas) {
      ganchos.push(`Problemas detectados: ${lead.site_problemas}.`)
    }
  }

  if (siteRuim && lead.instagram_url) {
    ganchos.push(
      "Su Instagram puede estar más actualizado que su sitio; úsalo: \"tu Instagram está muy bien, pero el sitio no está a la par\"."
    )
  }

  // ganchos concretos do raio-X: o que o site deles NÃO tem (dado real, não chute)
  const faltas = lead.site_checklist?.falta ?? []
  if (siteRuim && faltas.length > 0) {
    ganchos.push(
      `Faltantes concretos detectados en el sitio: ${faltas.slice(0, 3).join(", ")}${faltas.length > 3 ? "..." : ""}. Menciona uno como ejemplo específico.`
    )
  }

  const proximoPasso =
    lead.status === "novo"
      ? "Genera el mensaje de contacto (ya usa esta estrategia), ajústalo a tu tono y mándalo por WhatsApp; cuando el lead responda, adjunta el diagnóstico en PDF. Después márcalo como contactado."
      : (lead.follow_ups_enviados ?? 0) > 0
        ? `Ya van ${lead.follow_ups_enviados} follow-up(s). Genera el mensaje de follow-up con un elemento NUEVO (fecha límite, ejemplo listo, diagnóstico): repetir el mismo argumento quema el lead.`
        : "Lead ya contactado sin respuesta: genera el mensaje de follow-up con un tono ligero de recordatorio y una petición de acción concreta."

  return { cenario, angulo, ganchos, objecoes, proximoPasso }
}
