import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Skeleton } from "@/components/ui/skeleton"
import { FonteMapsCard } from "@/components/configuracoes/FonteMapsCard"
import { InstagramContaCard } from "@/components/configuracoes/InstagramContaCard"
import { PerfilVendedorCard } from "@/components/configuracoes/PerfilVendedorCard"
import { ProvedorApiCard } from "@/components/configuracoes/ProvedorApiCard"
import { ScraperProxyCard } from "@/components/configuracoes/ScraperProxyCard"
import { SomConfigCard } from "@/components/configuracoes/SomConfigCard"
import { useConfiguracoes } from "@/hooks/useConfiguracoes"

const TITULOS: Record<"gemini" | "groq" | "nvidia" | "pagespeed", string> = {
  gemini: "Google Gemini",
  groq: "Groq",
  nvidia: "NVIDIA",
  pagespeed: "Google PageSpeed (opcional)",
}

export function ConfiguracoesPage() {
  const { data, isLoading } = useConfiguracoes()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto w-full max-w-2xl space-y-6 px-4 py-6 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver al dashboard
        </Link>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">Tu perfil</h2>
          <p className="text-sm text-muted-foreground">
            Quién envía los mensajes de prospección: los textos generados por IA
            salen firmados y con tu voz.
          </p>
        </div>

        <PerfilVendedorCard />

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Configuración de API
          </h2>
          <p className="text-sm text-muted-foreground">
            Las claves de abajo se usan para generar mensajes con IA. El sistema
            prueba cada proveedor en el orden Gemini → Groq → NVIDIA y pasa al
            siguiente automáticamente si alguno falla o se queda sin cuota.
          </p>
        </div>

        {isLoading || !data ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[140px]" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(["gemini", "groq", "nvidia", "pagespeed"] as const).map((provedor) => (
              <ProvedorApiCard
                key={provedor}
                provedor={provedor}
                titulo={TITULOS[provedor]}
                config={data[provedor]}
              />
            ))}
            <p className="text-xs text-muted-foreground">
              La clave de PageSpeed es opcional: agrega la calificación oficial de
              rendimiento de Google al diagnóstico en PDF (funciona sin clave
              para uso ligero, pero con límites).
            </p>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Fuente de datos de Google Maps
          </h2>
          <p className="text-sm text-muted-foreground">
            Elige entre el recolector local y la integración oficial de Google
            Places.
          </p>
        </div>

        <FonteMapsCard />

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Cuenta de Instagram
          </h2>
          <p className="text-sm text-muted-foreground">
            Conecta tu cuenta para analizar publicaciones y enriquecer perfiles. El inicio de sesión
            reemplaza el antiguo script de línea de comandos.
          </p>
        </div>

        <InstagramContaCard />

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Búsqueda en Google Maps
          </h2>
          <p className="text-sm text-muted-foreground">
            Configuración avanzada del scraper de leads.
          </p>
        </div>

        <ScraperProxyCard />

        <div>
          <h2 className="text-xl font-semibold tracking-tight">Sonidos</h2>
          <p className="text-sm text-muted-foreground">
            Controla los sonidos de retroalimentación del sistema.
          </p>
        </div>

        <SomConfigCard />
      </main>
    </div>
  )
}
