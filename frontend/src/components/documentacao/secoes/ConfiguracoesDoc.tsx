import { DocSection, DocH2, DocP, DocList, DocCallout } from "@/components/documentacao/DocSection"

export function ConfiguracoesDoc() {
  return (
    <DocSection titulo="Configuración de API">
      <DocP>
        Toda la generación de mensajes con IA (textos de primer contacto y
        follow-up en los dos canales, clasificación de leads de Instagram)
        depende de que haya al menos un proveedor de IA configurado.
      </DocP>

      <DocH2>Proveedores compatibles</DocH2>
      <DocList>
        <li>
          <strong>Google Gemini</strong> (<code>gemini-flash-latest</code>)
        </li>
        <li>
          <strong>Groq</strong> (<code>llama-3.3-70b-versatile</code>)
        </li>
        <li>
          <strong>NVIDIA Build</strong> (<code>nemotron-super-49b</code>)
        </li>
      </DocList>
      <DocP>
        Todos tienen un plan gratuito. Configurar más de uno da más
        confiabilidad: si uno se queda sin cuota, el sistema intenta con el
        siguiente automáticamente.
      </DocP>

      <DocH2>Cómo funciona el respaldo entre proveedores</DocH2>
      <DocList>
        <li>Intenta con los proveedores en este orden: Gemini → Groq → NVIDIA.</li>
        <li>Se salta sin avisar cualquier proveedor que no tenga clave configurada.</li>
        <li>
          Si un proveedor llegó a su límite de cuota hace poco, queda en
          "pausa" 5 minutos antes de volver a intentarlo.
        </li>
        <li>
          Si todos fallan, muestra un error explicado en lenguaje sencillo
          (sin tecnicismos).
        </li>
      </DocList>

      <DocCallout>
        Las claves que guardas desde esta pantalla tienen prioridad sobre las
        que el administrador del servidor haya dejado en la configuración del
        servidor. Si ya están configuradas ahí, todo funciona igual sin que
        tengas que capturar nada en la pantalla.
      </DocCallout>
    </DocSection>
  )
}
