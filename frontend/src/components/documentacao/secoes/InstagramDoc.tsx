import {
  DocSection,
  DocH2,
  DocP,
  DocList,
  DocCallout,
} from "@/components/documentacao/DocSection"

export function InstagramDoc() {
  return (
    <DocSection titulo="Instagram">
      <DocP>
        El canal de Instagram analiza los comentarios de un post específico
        para encontrar personas que mostraron interés o que se identifican como
        dueñas de un negocio dentro del nicho que tú eliges.
      </DocP>

      <DocH2>Cómo analizar un post</DocH2>
      <DocP>
        Pega la URL de un post (<code>/p/</code>, <code>/reel/</code> o{" "}
        <code>/tv/</code>) y, si quieres, un <strong>nicho objetivo</strong>{" "}
        (ej.: "abogados"). El nicho objetivo orienta la clasificación con IA;
        sin él, el análisis es más genérico.
      </DocP>

      <DocH2>Qué pasa por detrás (3 etapas)</DocH2>
      <DocList>
        <li>
          <strong>Extracción</strong>: saca todos los comentarios del post
          (usuario + texto).
        </li>
        <li>
          <strong>Enriquecimiento</strong>: consulta cada perfil único: si es
          público o privado, bio, seguidores, si es cuenta de empresa.
        </li>
        <li>
          <strong>Clasificación con IA</strong>: para cada perfil público,
          evalúa bio, seguidores y comentarios, y regresa la prioridad, el
          nicho identificado, la justificación y un DM sugerido listo para
          usar.
        </li>
      </DocList>
      <DocCallout variante="warning">
        Los perfiles privados se descartan automáticamente antes de la
        clasificación, sin gastar llamadas de IA. La etapa de enriquecimiento
        usa la cuenta de Instagram que conectaste en "Configuración": úsala con
        moderación para reducir el riesgo de que Instagram la bloquee.
      </DocCallout>

      <DocH2>Prioridad</DocH2>
      <DocP>
        Cada lead recibe una prioridad: <strong>alta</strong>,{" "}
        <strong>media</strong>, <strong>baja</strong> o{" "}
        <strong>descartado</strong>. Puedes cambiarla a mano en cualquier
        momento.
      </DocP>

      <DocH2>DM sugerido y follow-up</DocH2>
      <DocP>
        El DM sugerido viene listo desde la clasificación, pero puedes volver
        a generarlo (primer contacto o follow-up), editarlo a mano o usarlo
        como base para una plantilla. El follow-up inteligente funciona igual
        que en Google Maps: marcar como enviado, sugerencia de la siguiente
        fecha y aviso de lead difícil.
      </DocP>

      <DocH2>Archivar y eliminar posts</DocH2>
      <DocP>
        Un post analizado se puede <strong>archivar</strong> (desaparece de la
        lista principal, pero se puede recuperar) y después, en la pestaña
        "Archivados", <strong>restaurar</strong> o{" "}
        <strong>eliminar definitivamente</strong>, lo que borra el post y todos
        sus leads de la base de datos para siempre.
      </DocP>
    </DocSection>
  )
}
