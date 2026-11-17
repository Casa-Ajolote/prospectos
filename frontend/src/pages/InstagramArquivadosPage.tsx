import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { PostList } from "@/components/instagram/PostList"

export function InstagramArquivadosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <Link
          to="/instagram"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver a los leads de Instagram
        </Link>

        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Publicaciones archivadas
          </h2>
          <p className="text-sm text-muted-foreground">
            Las publicaciones archivadas quedan fuera de la lista principal. Puedes
            restaurarlas o eliminarlas definitivamente (eso también borra
            todos los leads de esa publicación).
          </p>
        </div>

        <PostList
          postSelecionadoId={null}
          onSelecionarPost={() => {}}
          arquivados
        />
      </main>
    </div>
  )
}
