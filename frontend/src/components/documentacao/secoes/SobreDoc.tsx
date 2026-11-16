import { X } from "lucide-react"
import { InstagramIcon } from "@/components/icons/InstagramIcon"
import { GitHubIcon } from "@/components/icons/GitHubIcon"
import { DocSection, DocP } from "@/components/documentacao/DocSection"

const LINKS = [
  {
    label: "X (Twitter)",
    url: "https://x.com/nandoodev3",
    icone: X,
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/nandoodev/",
    icone: InstagramIcon,
  },
  {
    label: "GitHub",
    url: "https://github.com/nando0x",
    icone: GitHubIcon,
  },
]

export function SobreDoc() {
  return (
    <DocSection titulo="Acerca de / Contacto">
      <DocP>
        Esta herramienta se creó para automatizar la prospección de clientes
        para servicios de creación de sitios web, combinando Google Maps e
        Instagram en un solo flujo de trabajo.
      </DocP>

      <div className="flex flex-col gap-2 pt-2 sm:flex-row">
        {LINKS.map(({ label, url, icone: Icone }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent/40"
          >
            <Icone className="size-4" />
            {label}
          </a>
        ))}
      </div>
    </DocSection>
  )
}
