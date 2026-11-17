"""Diagnóstico de presença digital em PDF - o material que o vendedor manda no
WhatsApp quando a copy promete "posso te enviar um diagnóstico?".

Design: placar visual no topo (reputação + desempenho Google + pontos a corrigir),
problemas em cards numerados com explicação leiga, raio-X em dois painéis
coloridos (tem/falta) e CTA. Determinístico (sem custo de IA). Fontes core do
fpdf2 cobrem latin-1 (acentos pt-BR ok) - nada de emoji/travessão no texto.
"""

import json
import re
from datetime import date

from fpdf import FPDF

import db

# Cores da marca (RGB)
VERDE_ESCURO = (16, 122, 74)
VERDE = (22, 163, 74)
VERDE_FUNDO = (232, 246, 238)
CINZA_TEXTO = (55, 65, 81)
CINZA_SUAVE = (107, 114, 128)
CINZA_CLARO = (243, 244, 246)
CINZA_CARD = (250, 250, 251)
LARANJA = (194, 120, 3)
LARANJA_FUNDO = (253, 243, 224)
VERMELHO = (185, 28, 28)

MARGEM = 12
LARGURA_CONTEUDO = 186

# problema detectado (substrings) → (título leigo, explicação do impacto).
# As chaves são trechos do texto que processar.avaliar_site_completo grava em
# site_problemas: ficam as em pt-BR (leads já salvos no banco) e as em espanhol
# (texto novo, depois da tradução de processar.py). Basta uma bater.
EXPLICACOES_PROBLEMAS = [
    (("fora do ar", "fuera de línea", "fuera del aire", "caído", "no abre"), (
        "El sitio no abre",
        "Quien le da clic al sitio hoy se encuentra con una página de error. Cada visita perdida es "
        "un cliente que buscó, no pudo ver nada y se fue con la competencia.",
    )),
    (("domínio não encontrado", "dominio no encontrado"), (
        "La dirección del sitio ya no existe",
        "Parece que el dominio venció o fue abandonado. Quien intenta entrar no encuentra "
        "nada: es como tener el letrero del local apuntando a un terreno baldío.",
    )),
    (("erro (HTTP", "error (HTTP"), (
        "El sitio responde con error",
        "La dirección existe, pero devuelve una página de error en lugar del contenido. En la "
        "práctica, para quien lo visita es lo mismo que si estuviera caído.",
    )),
    (("SSL",), (
        "Certificado de seguridad vencido o inválido",
        "El navegador muestra una alerta de seguridad antes de abrir el sitio. La mayoría de las "
        "personas se va en esa pantalla, y la imagen que queda es de descuido.",
    )),
    (("HTTPS",), (
        "Sitio marcado como 'no seguro'",
        "Sin el candado de seguridad, Chrome y Safari muestran el aviso 'no seguro' junto a la "
        "dirección. Eso ahuyenta clientes y baja la posición en Google.",
    )),
    (("lento",), (
        "Sitio muy lento para cargar",
        "El servidor tarda varios segundos solo en empezar a responder. En internet, cada segundo "
        "de espera tira visitas: buena parte de la gente se va antes de que la página abra.",
    )),
    (("misto", "mixto"), (
        "Página segura cargando elementos inseguros",
        "El sitio tiene candado, pero jala imágenes o archivos por una conexión insegura (contenido "
        "mixto). Los navegadores modernos lo bloquean o lo advierten: partes de la página pueden "
        "ni cargar.",
    )),
    (("celular",), (
        "No adaptado para celular",
        "La gran mayoría de las búsquedas de negocios locales se hace desde el celular, y el sitio "
        "actual no se ajusta a la pantalla. El cliente hace zoom, toca el botón equivocado y se va.",
    )),
    (("vazia", "vacía", "vacia"), (
        "Página prácticamente vacía",
        "El sitio existe, pero no presenta los servicios, fotos ni un botón de contacto. "
        "Hoy funciona como una tarjeta de presentación en blanco.",
    )),
    (("construtor", "constructor"), (
        "Hecho con un constructor de plantillas",
        "El sitio se armó en una plataforma de plantillas prediseñadas. Funciona, pero se ve igual "
        "que miles de otros y no transmite la credibilidad que la reputación del negocio merece.",
    )),
    (("atualização", "actualización"), (
        "Sitio detenido en el tiempo",
        "El pie de página todavía marca un año viejo: señal de que el sitio no recibe atención "
        "desde hace años. Para quien lo visita, parece que el negocio también se detuvo.",
    )),
]

CUSTOS_SEM_SITE = [
    ("Invisible fuera de Google Maps", (
        "Quien busca en Google el servicio (y no el nombre) encuentra a la competencia "
        "que sí tiene sitio web: el negocio solo aparece para quien ya lo conoce."
    )),
    ("La reputación no trabaja sola", (
        "La buena calificación y las reseñas se quedan atrapadas en Maps. Un sitio web convierte "
        "esa reputación en página de presentación, portafolio y canal de contacto."
    )),
    ("Sin una dirección profesional", (
        "A la hora de decidir, mucha gente revisa si el negocio 'existe de verdad' en internet. "
        "Sin sitio web, esa confirmación no llega y la venta se enfría."
    )),
]

PAGESPEED_TIMEOUT_SEGUNDOS = 60  # o PSI roda o Lighthouse de verdade: 15-40s é normal


def consultar_pagespeed(url):
    """Nota oficial de desempenho do Google (PageSpeed Insights, estratégia mobile).
    API gratuita (25k/dia com chave; funciona sem chave para uso leve). Best-effort:
    falha/timeout retorna None e o PDF sai sem a medição. Retorna dict com
    {"nota": 0-100, "tempo_carregamento": "2,5 s" ou None}."""
    import requests

    parametros = {
        "url": url if url.lower().startswith(("http://", "https://")) else f"https://{url}",
        "strategy": "mobile",
        "category": "performance",
    }
    chave = db.obter_config("pagespeed")
    if chave:
        parametros["key"] = chave

    try:
        resposta = requests.get(
            "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
            params=parametros,
            timeout=PAGESPEED_TIMEOUT_SEGUNDOS,
        )
        if resposta.status_code != 200:
            return None
        dados = resposta.json()
        lighthouse = dados.get("lighthouseResult", {})
        nota_bruta = lighthouse.get("categories", {}).get("performance", {}).get("score")
        if nota_bruta is None:
            return None
        lcp = lighthouse.get("audits", {}).get("largest-contentful-paint", {}).get("displayValue")
        return {"nota": round(nota_bruta * 100), "tempo_carregamento": lcp}
    except Exception:
        return None


def _limpar_latin1(texto):
    """Fontes core do fpdf2 são latin-1: remove o que não codifica (emoji etc.)."""
    return (texto or "").encode("latin-1", "replace").decode("latin-1")


def _cor_nota_pagespeed(nota):
    if nota < 50:
        return VERMELHO
    if nota < 90:
        return LARANJA
    return VERDE


class _PdfDiagnostico(FPDF):
    def header(self):  # noqa: N802 (API do fpdf2)
        self.set_fill_color(*VERDE_ESCURO)
        self.rect(0, 0, 210, 24, style="F")
        self.set_xy(MARGEM, 7)
        self.set_font("helvetica", "B", 16)
        self.set_text_color(255, 255, 255)
        self.cell(130, 10, "Diagnóstico de presencia digital")
        self.set_font("helvetica", "", 9)
        self.set_text_color(220, 240, 230)
        self.cell(0, 10, date.today().strftime("%d/%m/%Y"), align="R")


def _titulo_secao(pdf, texto):
    pdf.set_font("helvetica", "B", 12)
    pdf.set_text_color(*CINZA_TEXTO)
    pdf.cell(0, 7, _limpar_latin1(texto), new_x="LMARGIN", new_y="NEXT")
    pdf.set_fill_color(*VERDE)
    pdf.rect(MARGEM, pdf.get_y() + 0.5, 14, 1.1, style="F")
    pdf.ln(5)


def _tile(pdf, x, y, largura, rotulo, valor, cor_valor, subtitulo=None, fracao_barra=None):
    """Um bloco do placar: rótulo pequeno, valor grande colorido, barra opcional."""
    altura = 27
    pdf.set_fill_color(*CINZA_CLARO)
    pdf.rect(x, y, largura, altura, style="F", round_corners=True, corner_radius=2)

    pdf.set_xy(x + 4, y + 3.5)
    pdf.set_font("helvetica", "B", 6.8)
    pdf.set_text_color(*CINZA_SUAVE)
    pdf.cell(largura - 8, 3.4, _limpar_latin1(rotulo.upper()))

    pdf.set_xy(x + 4, y + 8)
    pdf.set_font("helvetica", "B", 15)
    pdf.set_text_color(*cor_valor)
    pdf.cell(largura - 8, 7, _limpar_latin1(valor))

    y_sub = y + 16.5
    if fracao_barra is not None:
        pdf.set_fill_color(224, 227, 231)
        pdf.rect(x + 4, y_sub, largura - 8, 1.8, style="F", round_corners=True, corner_radius=0.9)
        pdf.set_fill_color(*cor_valor)
        pdf.rect(
            x + 4, y_sub, max((largura - 8) * min(max(fracao_barra, 0), 1), 1.5), 1.8,
            style="F", round_corners=True, corner_radius=0.9,
        )
        y_sub += 3.4

    if subtitulo:
        pdf.set_xy(x + 4, y_sub)
        pdf.set_font("helvetica", "", 6.8)
        pdf.set_text_color(*CINZA_SUAVE)
        pdf.multi_cell(largura - 8, 3.1, _limpar_latin1(subtitulo))

    return altura


def _card_problema(pdf, numero, titulo, explicacao):
    """Card com fundo suave, faixa lateral laranja, número em círculo e texto."""
    x, largura = MARGEM, LARGURA_CONTEUDO
    largura_texto = largura - 14
    linhas = pdf.multi_cell(
        largura_texto, 4.3, _limpar_latin1(explicacao), dry_run=True, output="LINES"
    )
    altura = 8.5 + len(linhas) * 4.3 + 2.5
    y = pdf.get_y()

    pdf.set_fill_color(*CINZA_CARD)
    pdf.rect(x, y, largura, altura, style="F", round_corners=True, corner_radius=2)
    pdf.set_fill_color(*LARANJA)
    pdf.rect(x, y, 1.6, altura, style="F")

    # círculo com o número
    pdf.set_fill_color(*LARANJA)
    pdf.ellipse(x + 4.5, y + 2.6, 5.4, 5.4, style="F")
    pdf.set_xy(x + 4.5, y + 3.6)
    pdf.set_font("helvetica", "B", 8)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(5.4, 3.4, str(numero), align="C")

    pdf.set_xy(x + 12, y + 3)
    pdf.set_font("helvetica", "B", 10.5)
    pdf.set_text_color(*CINZA_TEXTO)
    pdf.cell(largura - 16, 5, _limpar_latin1(titulo))

    pdf.set_xy(x + 12, y + 8.5)
    pdf.set_font("helvetica", "", 9)
    pdf.set_text_color(*CINZA_SUAVE)
    pdf.multi_cell(largura_texto, 4.3, _limpar_latin1(explicacao))

    pdf.set_y(y + altura + 3)


def _painel_lista(pdf, x, y, largura, titulo, cor_titulo, cor_fundo, prefixo, itens):
    """Painel colorido do raio-X (uma coluna: 'já tem' ou 'faltando')."""
    linhas = max(len(itens), 1)
    altura = 9 + linhas * 4.6 + 2
    pdf.set_fill_color(*cor_fundo)
    pdf.rect(x, y, largura, altura, style="F", round_corners=True, corner_radius=2)

    pdf.set_xy(x + 4, y + 2.8)
    pdf.set_font("helvetica", "B", 7.5)
    pdf.set_text_color(*cor_titulo)
    pdf.cell(largura - 8, 4, _limpar_latin1(titulo.upper()))

    pdf.set_font("helvetica", "", 8.7)
    pdf.set_text_color(*CINZA_TEXTO)
    y_item = y + 8.2
    for item in itens or ["nada detectado"]:
        pdf.set_xy(x + 4, y_item)
        pdf.cell(largura - 8, 4.6, _limpar_latin1(f"{prefixo} {item}"))
        y_item += 4.6

    return altura


def _achados_do_site(problemas_texto):
    """Traduz o texto técnico de site_problemas em cards leigos (título, explicação).
    Sem nenhuma chave reconhecida, devolve um card genérico com o texto bruto."""
    texto = (problemas_texto or "").lower()
    return [
        (titulo, explicacao)
        for chaves, (titulo, explicacao) in EXPLICACOES_PROBLEMAS
        if any(chave.lower() in texto for chave in chaves)
    ] or [(
        "Sitio con problemas técnicos",
        problemas_texto or "Problemas técnicos detectados en el análisis automático.",
    )]


def gerar_diagnostico_pdf(lead):
    """Gera o PDF de diagnóstico de um lead (dict/Row com os campos de leads).
    Retorna os bytes do arquivo."""
    tem_site = lead["site_status"] == "site_ruim"
    problemas_texto = (lead["site_problemas"] or "") if tem_site else ""

    # ---- coleta de dados antes de desenhar ----
    checklist = None
    if tem_site:
        try:
            checklist = json.loads(lead["site_checklist"]) if lead["site_checklist"] else None
        except (TypeError, ValueError, KeyError, IndexError):
            checklist = None

    pagespeed = consultar_pagespeed(lead["site_url"]) if (tem_site and lead["site_url"]) else None

    achados = _achados_do_site(problemas_texto) if tem_site else CUSTOS_SEM_SITE

    # ---- desenho ----
    pdf = _PdfDiagnostico(format="A4")
    pdf.set_auto_page_break(auto=True, margin=14)
    pdf.add_page()

    # Identificação do negócio
    pdf.set_y(31)
    pdf.set_text_color(*CINZA_TEXTO)
    pdf.set_font("helvetica", "B", 15)
    pdf.cell(0, 8, _limpar_latin1(lead["nome"] or ""), new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("helvetica", "", 9.5)
    pdf.set_text_color(*CINZA_SUAVE)
    subtitulo = " - ".join(p for p in [lead["categoria"], lead["cidade"]] if p)
    pdf.cell(0, 5.5, _limpar_latin1(subtitulo), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # Placar: 3 tiles lado a lado
    nota = lead["nota"] or 0
    avaliacoes = lead["num_avaliacoes"] or 0
    y_placar = pdf.get_y()
    largura_tile = (LARGURA_CONTEUDO - 8) / 3

    _tile(
        pdf, MARGEM, y_placar, largura_tile,
        "Reputación en Google", f"{nota}", VERDE_ESCURO,
        subtitulo=f"{avaliacoes} reseñas de clientes",
        fracao_barra=(nota / 5) if nota else 0,
    )

    x2 = MARGEM + largura_tile + 4
    if not tem_site:
        _tile(pdf, x2, y_placar, largura_tile, "Sitio web propio", "No tiene", VERMELHO,
              subtitulo="no se encontró ningún sitio en Google")
    elif pagespeed:
        detalhe = (
            f"el contenido aparece en {pagespeed['tempo_carregamento']} en el celular"
            if pagespeed["tempo_carregamento"] else "medición oficial de Google (PageSpeed)"
        )
        _tile(
            pdf, x2, y_placar, largura_tile,
            "Rendimiento (Google PageSpeed)", f"{pagespeed['nota']}/100",
            _cor_nota_pagespeed(pagespeed["nota"]),
            subtitulo=detalhe, fracao_barra=pagespeed["nota"] / 100,
        )
    else:
        _tile(pdf, x2, y_placar, largura_tile, "Rendimiento (Google PageSpeed)", "-",
              CINZA_SUAVE, subtitulo="medición no disponible por ahora")

    x3 = MARGEM + (largura_tile + 4) * 2
    rotulo3 = "Puntos a corregir" if tem_site else "Oportunidades perdidas"
    _tile(pdf, x3, y_placar, largura_tile, rotulo3, str(len(achados)), LARANJA,
          subtitulo="detallados abajo")

    pdf.set_y(y_placar + 27 + 7)

    # Achados em cards numerados
    _titulo_secao(
        pdf, "Lo que encontramos en el sitio actual" if tem_site else "Lo que te está costando no tener sitio web"
    )
    for numero, (titulo, explicacao) in enumerate(achados, start=1):
        _card_problema(pdf, numero, titulo, explicacao)

    # Raio-X em dois painéis coloridos
    if checklist and (checklist.get("tem") or checklist.get("falta")):
        pdf.ln(2)
        _titulo_secao(pdf, "Radiografía del sitio actual")
        largura_painel = (LARGURA_CONTEUDO - 4) / 2
        y_paineis = pdf.get_y()
        altura_esq = _painel_lista(
            pdf, MARGEM, y_paineis, largura_painel,
            "Lo que el sitio ya tiene", VERDE_ESCURO, VERDE_FUNDO, "+", (checklist.get("tem") or [])[:9],
        )
        altura_dir = _painel_lista(
            pdf, MARGEM + largura_painel + 4, y_paineis, largura_painel,
            "Lo que le falta", LARANJA, LARANJA_FUNDO, "-",
            (checklist.get("falta") or ["nada, estructura completa"])[:9],
        )
        pdf.set_y(y_paineis + max(altura_esq, altura_dir) + 4)

    if tem_site and lead["site_url"]:
        pdf.set_font("helvetica", "I", 8)
        pdf.set_text_color(150, 150, 150)
        pdf.cell(0, 5, _limpar_latin1(f"Análisis automático de {lead['site_url']}"),
                 new_x="LMARGIN", new_y="NEXT")

    # Proposta / CTA - assinada pelo vendedor, como uma mensagem pessoal
    nome_vendedor = db.obter_config("vendedor_nome")

    pdf.ln(3)
    y_cta = pdf.get_y()
    altura_cta = 24 if nome_vendedor else 21
    pdf.set_fill_color(*VERDE_ESCURO)
    pdf.rect(MARGEM, y_cta, LARGURA_CONTEUDO, altura_cta, style="F", round_corners=True, corner_radius=2)
    pdf.set_xy(MARGEM + 6, y_cta + 4)
    pdf.set_font("helvetica", "B", 11)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 6, "El siguiente paso es sencillo", new_x="LMARGIN", new_y="NEXT")
    pdf.set_x(MARGEM + 6)
    pdf.set_font("helvetica", "", 9.5)
    pdf.cell(0, 5, "Puedo prepararte una vista previa de cómo quedaría tu sitio, sin compromiso. Solo responde este mensaje.",
             new_x="LMARGIN", new_y="NEXT")
    if nome_vendedor:
        pdf.set_xy(MARGEM + 6, y_cta + altura_cta - 8)
        pdf.set_font("helvetica", "I", 9.5)
        pdf.set_text_color(220, 240, 230)
        pdf.cell(LARGURA_CONTEUDO - 12, 5, _limpar_latin1(f"- {nome_vendedor}"), align="R")
    pdf.set_y(y_cta + altura_cta)

    return bytes(pdf.output())


def nome_arquivo_diagnostico(nome_lead):
    base = re.sub(r"[^A-Za-z0-9]+", "-", nome_lead or "lead").strip("-").lower() or "lead"
    return f"diagnostico-{base}.pdf"
