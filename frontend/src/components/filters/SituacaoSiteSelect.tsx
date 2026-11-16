import { SelectComVazio } from "@/components/filters/SelectComVazio"
import type { FiltrosLeads } from "@/types/lead"

interface SituacaoSiteSelectProps {
  valor: FiltrosLeads["site_status"]
  onChange: (valor: FiltrosLeads["site_status"]) => void
}

export function SituacaoSiteSelect({ valor, onChange }: SituacaoSiteSelectProps) {
  return (
    <SelectComVazio
      valor={valor}
      onChange={(v) => onChange(v as FiltrosLeads["site_status"])}
      opcoes={[
        { valor: "sem_site", label: "Sin sitio web" },
        { valor: "site_ruim", label: "Sitio deficiente" },
        { valor: "site_ok", label: "Sitio aceptable" },
      ]}
      labelVazio="Cualquier situación"
      placeholder="Situación del sitio"
      className="w-[170px]"
    />
  )
}
