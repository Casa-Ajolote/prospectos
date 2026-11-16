"""Cria (ou atualiza) um lead de teste apontando para o SEU próprio número.

Serve pra experimentar o cockpit de conversa sem risco de mandar mensagem para
um cliente real: você conversa consigo mesmo e vê a captura e a análise da IA
funcionando de ponta a ponta.

Uso:
    py criar_lead_teste.py 65999998888        (DDD + número, com ou sem máscara)

Para remover depois:
    py criar_lead_teste.py --remover
"""

import os
import re
import sqlite3
import sys
from datetime import datetime
from pathlib import Path

from paths import DIR_DADOS

PLACE_ID = "TESTE-MEU-NUMERO"


def caminho_do_banco():
    """O banco do APP INSTALADO fica em %APPDATA%\\ProspectOS; o de quem roda do
    código-fonte fica na pasta do projeto. Este script existe pra testar o app,
    então prefere o instalado quando ele existe - e diz qual escolheu."""
    instalado = Path(os.environ.get("APPDATA", "")) / "ProspectOS" / "leads.db"
    if instalado.exists():
        return instalado
    return DIR_DADOS / "leads.db"


def conectar():
    caminho = caminho_do_banco()
    print(f"Base de datos: {caminho}")
    return sqlite3.connect(caminho)


def remover():
    conexao = conectar()
    try:
        apagados = conexao.execute("DELETE FROM leads WHERE place_id = ?", (PLACE_ID,)).rowcount
        conexao.execute("DELETE FROM mensagens_conversa WHERE lead_ref = ?", (PLACE_ID,))
        conexao.execute("DELETE FROM analises_conversa WHERE lead_ref = ?", (PLACE_ID,))
        conexao.commit()
    finally:
        conexao.close()
    print("Lead de prueba eliminado." if apagados else "No había lead de prueba.")


def criar(telefone_bruto):
    digitos = re.sub(r"\D", "", telefone_bruto)
    if digitos.startswith("55") and len(digitos) in (12, 13):
        digitos = digitos[2:]
    if len(digitos) not in (10, 11):
        print(f"Número inválido: {telefone_bruto!r}. Usa DDD + número, ej.: 65999998888")
        sys.exit(1)

    agora = datetime.now().isoformat(timespec="seconds")
    conexao = conectar()
    try:
        conexao.execute(
            """
            INSERT INTO leads (place_id, nome, categoria, endereco, nota, num_avaliacoes,
                               telefone, whatsapp_link, nicho, cidade, site_status,
                               site_problemas, status, visto_em, atualizado_em)
            VALUES (?, 'PRUEBA - Mi propio número', 'Prueba del cockpit', 'Sin dirección',
                    5.0, 100, ?, ?, 'teste', 'Cuiabá', 'sem_site', NULL, 'novo', ?, ?)
            ON CONFLICT(place_id) DO UPDATE SET
                telefone = excluded.telefone,
                whatsapp_link = excluded.whatsapp_link,
                atualizado_em = excluded.atualizado_em
            """,
            (PLACE_ID, digitos, f"https://wa.me/55{digitos}", agora, agora),
        )
        conexao.commit()
    finally:
        conexao.close()

    print(f"Lead de prueba listo con el número {digitos}.")
    print("Abre ProspectOS -> Google Maps -> busca 'PRUEBA - Mi propio número'.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    remover() if sys.argv[1] == "--remover" else criar(sys.argv[1])
