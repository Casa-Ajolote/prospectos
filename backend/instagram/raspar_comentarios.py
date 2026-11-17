"""
Extrai os comentários de um post do Instagram e salva em JSON.

Uso:
    py raspar_comentarios.py <url_do_post>

Requer sessão salva previamente com:
    py login.py <seu_usuario>
"""

import json
import sys
from datetime import datetime
from pathlib import Path

from instagrapi import Client
from instagrapi.exceptions import (
    ChallengeRequired,
    ClientError,
    LoginRequired,
    PleaseWaitFewMinutes,
)

# permite achar o paths.py do backend também quando rodado standalone
# (py raspar_comentarios.py) - importado pelo jobs.py, o backend já está no path
sys.path.insert(0, str(Path(__file__).parent.parent))
from paths import DIR_DADOS  # noqa: E402

# sessão e comentários são ESCRITOS pelo app - ficam na área de dados
PASTA_SESSAO = DIR_DADOS / "instagram" / "sessao"
PASTA_COMENTARIOS = DIR_DADOS / "instagram" / "comentarios"


def carregar_sessao() -> Client:
    arquivos_sessao = list(PASTA_SESSAO.glob("session-*.json"))
    if not arquivos_sessao:
        raise RuntimeError(
            "No se encontró ninguna sesión de Instagram. "
            "Inicia sesión en Configuración → Cuenta de Instagram."
        )
    cliente = Client()
    cliente.load_settings(arquivos_sessao[0])
    return cliente


def raspar_comentarios(url: str) -> Path:
    cliente = carregar_sessao()

    # traduz os erros de conta/sessão do instagrapi em mensagens claras ANTES
    # de qualquer retry - insistir com checkpoint/sessão inválida só aumenta o
    # risco de bloqueio da conta.
    try:
        media_pk = cliente.media_pk_from_url(url)
        comentarios_brutos = cliente.media_comments(media_pk, amount=0)
    except ChallengeRequired:
        raise RuntimeError(
            "Instagram pidió una verificación de seguridad (checkpoint) en tu cuenta. "
            "Abre Instagram en el celular, resuelve la verificación y vuelve a iniciar sesión en Configuración → Cuenta de Instagram."
        )
    except LoginRequired:
        raise RuntimeError(
            "La sesión de Instagram expiró o se invalidó. "
            "Vuelve a iniciar sesión en Configuración → Cuenta de Instagram."
        )
    except PleaseWaitFewMinutes:
        raise RuntimeError(
            "Instagram está limitando las solicitudes de tu cuenta en este momento (rate limit). "
            "Espera unos minutos (de preferencia 1 hora) e inténtalo de nuevo."
        )

    comentarios = [
        {"username": c.user.username, "texto": c.text}
        for c in comentarios_brutos
    ]

    resultado = {
        "post_url": url,
        "capturado_em": datetime.now().isoformat(timespec="seconds"),
        "total_comentarios": len(comentarios),
        "comentarios": comentarios,
    }

    PASTA_COMENTARIOS.mkdir(parents=True, exist_ok=True)
    nome_arquivo = f"post_{media_pk}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    caminho_saida = PASTA_COMENTARIOS / nome_arquivo
    caminho_saida.write_text(
        json.dumps(resultado, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return caminho_saida


def main() -> None:
    if len(sys.argv) != 2:
        print("Uso: py raspar_comentarios.py <url_del_post>")
        sys.exit(1)

    url = sys.argv[1]

    try:
        caminho_saida = raspar_comentarios(url)
    except RuntimeError as erro:
        print(f"Error: {erro}")
        sys.exit(1)
    except LoginRequired:
        print(
            "Error: la sesión expiró o se invalidó. Vuelve a ejecutar: "
            "py login.py <tu_usuario>"
        )
        sys.exit(1)
    except ClientError as erro:
        print(
            f"Error al acceder al post (puede ser privado, haber sido eliminado "
            f"o por límite de solicitudes de Instagram): {erro}"
        )
        sys.exit(1)

    print(f"Comentarios guardados en: {caminho_saida}")


if __name__ == "__main__":
    main()
