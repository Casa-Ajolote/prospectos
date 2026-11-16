import {
  DocSection,
  DocH2,
  DocP,
  DocList,
  DocCallout,
  DocCode,
} from "@/components/documentacao/DocSection"

export function GoogleMapsDoc() {
  return (
    <DocSection titulo="Google Maps">
      <DocP>
        El canal de Google Maps busca negocios por nicho + ciudad y filtra
        automáticamente los que vale la pena contactar: calificación alta
        (≥ 4.0) y sin sitio web registrado en ninguna parte de internet.
      </DocP>

      <DocH2>Cómo buscar leads</DocH2>
      <DocP>
        En el botón "Nueva búsqueda" escribes una o varias líneas con el
        formato <DocCode>nicho en ciudad</DocCode> (ej.: "clínica de estética
        en Guadalajara"). Cada línea se vuelve una búsqueda distinta. El
        sistema trabaja en segundo plano y muestra el avance en vivo.
      </DocP>
      <DocCallout variante="warning">
        La búsqueda depende de un scraper externo de Google Maps (o de la
        Google Places API, si así lo eliges en "Configuración"). El scraper lo
        instala y mantiene el administrador del servidor; si las búsquedas
        fallan, avísale a él.
      </DocCallout>

      <DocH2>Doble verificación de "sin sitio web"</DocH2>
      <DocP>
        Después de listar los negocios de Maps, el sistema hace una segunda
        búsqueda en internet (DuckDuckGo/Bing/Yahoo) con el nombre de cada
        negocio, para confirmar que de verdad no tiene sitio web en ningún
        lado, no solo en su ficha de Maps. Así evitas quedarte con leads que
        ya tienen sitio en otra parte.
      </DocP>

      <DocH2>Lista y Kanban</DocH2>
      <DocP>
        Puedes cambiar entre la vista de <strong>Lista</strong> (tarjetas con
        todos los detalles) y la de <strong>Kanban</strong> (columnas por etapa
        del embudo; arrastra la tarjeta entre columnas para cambiar el
        estatus).
      </DocP>

      <DocH2>Follow-up inteligente</DocH2>
      <DocList>
        <li>
          <strong>Generar mensaje con IA</strong>: dos tipos, "contacto"
          (primer acercamiento) y "follow-up" (retomar la conversación), con
          tono y argumentos que se adaptan automáticamente.
        </li>
        <li>
          <strong>Marcar follow-up enviado</strong>: registra que mandaste el
          mensaje y sugiere la siguiente fecha (cadencia creciente: 3, luego
          5, luego 7 días, para no parecer insistente).
        </li>
        <li>
          <strong>Lead difícil</strong>: aparece un aviso cuando el lead ya
          recibió un follow-up y lleva más de 5 días sin avanzar, con un acceso
          directo para archivarlo.
        </li>
      </DocList>

      <DocH2>Otras acciones</DocH2>
      <DocList>
        <li>
          <strong>Tags y notas</strong>: texto libre para organizarte como
          quieras.
        </li>
        <li>
          <strong>Plantillas de mensaje</strong>: guarda los mensajes que te
          funcionan y reutilízalos después con otros leads.
        </li>
        <li>
          <strong>Exportar CSV</strong>: descarga todos los leads filtrados en
          una hoja de cálculo.
        </li>
        <li>
          <strong>Ignorar</strong>: lo quita de la lista principal (se puede
          revertir). <strong>Eliminar definitivamente</strong>: lo borra de la
          base de datos para siempre; solo se permite en leads que ya están
          ignorados.
        </li>
      </DocList>
    </DocSection>
  )
}
