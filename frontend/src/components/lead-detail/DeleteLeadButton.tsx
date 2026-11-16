import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface DeleteLeadButtonProps {
  nomeLead: string
  onConfirmar: () => void
  definitivo?: boolean
}

export function DeleteLeadButton({
  nomeLead,
  onConfirmar,
  definitivo = false,
}: DeleteLeadButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
          <Trash2 className="size-4" />
          {definitivo ? "Eliminar definitivamente" : "Eliminar este lead"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {definitivo
              ? `¿Eliminar "${nomeLead}" definitivamente?`
              : `¿Eliminar "${nomeLead}"?`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {definitivo
              ? "Esto borra el lead de la base de datos para siempre. No se puede deshacer, y si la misma búsqueda se vuelve a ejecutar en el futuro, puede volver a aparecer como lead nuevo."
              : "Ya no aparecerá en tu lista ni en búsquedas futuras del mismo nicho/ciudad."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmar}>
            {definitivo ? "Eliminar definitivamente" : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
