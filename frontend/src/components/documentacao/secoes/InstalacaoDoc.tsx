import {
  DocSection,
  DocH2,
  DocList,
  DocCallout,
} from "@/components/documentacao/DocSection"

export function InstalacaoDoc() {
  return (
    <DocSection titulo="Instalación y requisitos">
      <DocCallout variante="warning">
        Esta herramienta hace scraping de Google Maps y de Instagram, lo cual
        viola los Términos de Uso de las dos plataformas. Úsala bajo tu propio
        riesgo: la cuenta de Instagram que conectes puede ser bloqueada.
      </DocCallout>

      <DocH2>Qué necesitas</DocH2>
      <DocList>
        <li>
          La app corre en un servidor web de la agencia. No tienes que instalar
          nada en tu computadora: solo necesitas un navegador actualizado.
        </li>
        <li>
          La dirección de la app y tu acceso te los da el administrador del
          servidor.
        </li>
      </DocList>

      <DocH2>Lo que configura el administrador del servidor</DocH2>
      <DocList>
        <li>La instalación y las actualizaciones de la app.</li>
        <li>
          El scraper de Google Maps. Sin él, las búsquedas en Maps fallan (a
          menos que se use la Google Places API, que se elige en
          "Configuración").
        </li>
        <li>
          Opcionalmente, claves de IA a nivel servidor. También puedes
          capturarlas tú en "Configuración"; las de la pantalla tienen
          prioridad.
        </li>
      </DocList>

      <DocH2>Instagram (opcional, solo si vas a usar ese canal)</DocH2>
      <DocList>
        <li>
          Entra a "Configuración" → "Cuenta de Instagram" con tu usuario y
          contraseña (y el código de verificación 2FA, si te lo pide).
        </li>
        <li>
          La contraseña solo se usa para crear la sesión; no se guarda. Si la
          sesión caduca, solo vuelve a entrar desde ahí.
        </li>
      </DocList>
    </DocSection>
  )
}
