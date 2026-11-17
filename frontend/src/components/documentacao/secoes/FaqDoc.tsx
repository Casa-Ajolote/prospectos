import { DocSection, DocH2, DocP } from "@/components/documentacao/DocSection"

export function FaqDoc() {
  return (
    <DocSection titulo="Preguntas frecuentes">
      <DocH2>Volví a correr la misma búsqueda, ¿se van a duplicar los leads anteriores?</DocH2>
      <DocP>
        No. Cada negocio se identifica con el <code>place_id</code> de Google,
        así que repetir la misma búsqueda solo actualiza los datos "vivos"
        (nombre, calificación, teléfono) sin tocar el estatus, las tags, las
        notas ni el follow-up que ya habías capturado.
      </DocP>

      <DocH2>La búsqueda en Maps no regresó ningún resultado, ¿qué pasó?</DocH2>
      <DocP>
        Revisa que el nicho y la ciudad estén bien escritos. Nichos muy
        específicos o ciudades pequeñas pueden de verdad no tener resultados
        que califiquen (calificación alta + sin sitio web). Si ninguna
        búsqueda regresa resultados, avísale al administrador del servidor
        para que revise el scraper de Google Maps.
      </DocP>

      <DocH2>¿Puedo usarlo sin una clave de IA configurada?</DocH2>
      <DocP>
        Sí, para buscar y organizar leads. Solo la generación de mensajes con
        IA (textos de primer contacto y follow-up) y la clasificación
        automática de Instagram necesitan al menos una clave configurada en
        "Configuración".
      </DocP>

      <DocH2>Borré un lead por error, ¿se puede recuperar?</DocH2>
      <DocP>
        Si fue "ignorar", sí: solo queda oculto; búscalo con el filtro de
        estatus "Ignorado". Si fue "eliminar definitivamente", no: esa acción
        lo borra de la base de datos para siempre, por eso solo se permite en
        leads que ya están ignorados (una protección extra contra clics por
        error).
      </DocP>

      <DocH2>Instagram me vuelve a pedir que inicie sesión, ¿es normal?</DocH2>
      <DocP>
        Sí, las sesiones caducan de vez en cuando. Solo vuelve a entrar desde
        "Configuración" → "Cuenta de Instagram".
      </DocP>
    </DocSection>
  )
}
