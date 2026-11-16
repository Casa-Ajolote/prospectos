import { DocSection, DocH2, DocP, DocList } from "@/components/documentacao/DocSection"

export function DashboardDoc() {
  return (
    <DocSection titulo="Dashboard general">
      <DocP>
        La página de inicio del sistema es una vista ejecutiva que combina los
        dos canales: no muestra listas de leads, solo métricas y accesos
        directos.
      </DocP>

      <DocH2>Qué muestra cada bloque</DocH2>
      <DocList>
        <li>
          <strong>Métricas combinadas</strong>: total de leads activos
          (también separado por canal), contactados, cerrados, tasa de
          conversión y follow-ups para hoy, sumando Maps + Instagram.
        </li>
        <li>
          <strong>Follow-ups de hoy</strong>: lista de los leads con follow-up
          vencido o programado para hoy, de los dos canales juntos, con acceso
          directo a cada uno.
        </li>
        <li>
          <strong>Embudo de conversión combinado</strong>: cuántos leads
          llegaron a cada etapa (nuevo → contactado → respondió → cerrado),
          sumando los dos canales.
        </li>
        <li>
          <strong>Ranking de nichos combinado</strong>: total y tasa de
          conversión por nicho, sumando los dos canales cuando el nombre del
          nicho coincide.
        </li>
        <li>
          <strong>Accesos directos</strong>: tarjetas para ir rápido a Leads de
          Google Maps, Leads de Instagram y Analytics de Maps.
        </li>
      </DocList>
    </DocSection>
  )
}
