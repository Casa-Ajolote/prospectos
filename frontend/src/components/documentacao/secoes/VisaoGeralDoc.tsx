import {
  DocSection,
  DocH2,
  DocP,
  DocList,
} from "@/components/documentacao/DocSection"

export function VisaoGeralDoc() {
  return (
    <DocSection titulo="Resumen general">
      <DocP>
        Esta es una herramienta de prospección de leads con dos canales de
        captación independientes, <strong>Google Maps</strong> e{" "}
        <strong>Instagram</strong>, que comparten el mismo vocabulario de
        embudo, tags, notas y follow-up inteligente, pero con flujos de
        captación muy distintos entre sí.
      </DocP>

      <DocH2>Los dos canales</DocH2>
      <DocList>
        <li>
          <strong>Google Maps</strong>: busca negocios por nicho + ciudad
          (ej.: "agente inmobiliario en Monterrey") y filtra automáticamente
          solo los que tienen calificación alta y no tienen sitio web
          registrado: son los candidatos más obvios para contratar un sitio
          nuevo.
        </li>
        <li>
          <strong>Instagram</strong>: analiza los comentarios de un post
          específico, identifica a las personas que comentaron y clasifica
          automáticamente con IA quién parece ser dueño de un negocio dentro
          del nicho objetivo que tú eliges.
        </li>
      </DocList>

      <DocH2>Conceptos que aplican a los dos canales</DocH2>
      <DocList>
        <li>
          <strong>Estatus del embudo</strong>: todo lead avanza por{" "}
          <em>nuevo → contactado → respondió → cerrado</em>. También hay dos
          estados fuera del embudo: <em>rechazó</em> (dijo que no) e{" "}
          <em>ignorado</em> (tú ocultaste el lead, pero sigue en la base de
          datos y se puede recuperar).
        </li>
        <li>
          <strong>Nicho</strong>: en Maps, se toma automáticamente del texto de
          la búsqueda. En Instagram, lo identifica la IA al clasificar (y lo
          puedes editar después).
        </li>
        <li>
          <strong>Prioridad</strong>: solo existe en Instagram (alta / media /
          baja / descartado) e indica qué tan prometedor es ese perfil.
        </li>
        <li>
          <strong>Lead difícil</strong>: un aviso que aparece cuando un lead ya
          recibió al menos un follow-up y lleva más de 5 días detenido en{" "}
          <em>nuevo</em> o <em>contactado</em>. Es solo un aviso visual:
          archivarlo o no siempre es tu decisión.
        </li>
      </DocList>

      <DocH2>Dónde está cada cosa</DocH2>
      <DocList>
        <li>
          <strong>Dashboard</strong> (página de inicio): métricas combinadas de
          los dos canales, embudo y ranking de nichos sumados, y accesos
          directos a las demás áreas.
        </li>
        <li>
          <strong>Google Maps</strong>: lista/kanban de leads, nueva búsqueda,
          follow-up, plantillas.
        </li>
        <li>
          <strong>Instagram</strong>: análisis de posts, leads clasificados
          por prioridad, follow-up, posts archivados.
        </li>
        <li>
          <strong>Configuración</strong>: claves de API de los proveedores de
          IA, perfil de vendedor, fuente de Google Maps y cuenta de Instagram.
        </li>
      </DocList>
    </DocSection>
  )
}
