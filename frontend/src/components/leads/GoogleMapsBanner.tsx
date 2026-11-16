import { BarChart3, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { CLASSE_ACAO_HERO, PageHero } from "@/components/shared/PageHero"

export function GoogleMapsBanner() {
  return (
    <PageHero
      icone={<MapPin className="size-6" />}
      titulo="Leads de Google Maps"
      descricao="Busca negocios sin sitio web o con un sitio deficiente, da seguimiento al embudo y gestiona follow-ups con sugerencias generadas por IA."
      gradiente="from-google-maps-start/85 via-google-maps-mid/85 to-google-maps-end/85"
      acoes={
        <Link to="/analytics" className={CLASSE_ACAO_HERO}>
          <BarChart3 className="size-4" />
          <span className="hidden sm:inline">Analytics</span>
        </Link>
      }
    />
  )
}
