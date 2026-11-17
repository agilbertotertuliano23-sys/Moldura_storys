#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Compila o Gerador DG em um arquivo único HTML auto-suficiente
(com imagens, logo, molduras e scripts embutidos em base64).
Pode ser aberto offline em qualquer navegador ou celular e enviado pelo WhatsApp!
"""

import os
import base64
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_PATH = os.path.join(BASE_DIR, 'index.html')
CSS_PATH = os.path.join(BASE_DIR, 'assets', 'style.css')
RENDER_PATH = os.path.join(BASE_DIR, 'assets', 'render.js')
APP_PATH = os.path.join(BASE_DIR, 'assets', 'app.js')
OUTPUT_PATH = os.path.join(BASE_DIR, 'DG Estetica - Gerador de Servicos e Preco.html')

def to_base64_data_uri(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    mime = {'.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp'}.get(ext, 'application/octet-stream')
    with open(file_path, 'rb') as f:
        data = base64.b64encode(f.read()).decode('utf-8')
    return f"data:{mime};base64,{data}"

def main():
    print("Iniciando compilação do arquivo único...")
    
    with open(INDEX_PATH, 'r', encoding='utf-8') as f:
        html = f.read()

    with open(CSS_PATH, 'r', encoding='utf-8') as f:
        css = f.read()

    with open(RENDER_PATH, 'r', encoding='utf-8') as f:
        render_js = f.read()

    with open(APP_PATH, 'r', encoding='utf-8') as f:
        app_js = f.read()

    # 1. Embutir CSS
    html = re.sub(
        r'<link rel="stylesheet" href="assets/style\.css(?:\?v=[^"]*)?">',
        f'<style>\n{css}\n</style>',
        html
    )

    # 2. Embutir Logo DG
    logo_path = os.path.join(BASE_DIR, 'assets', 'logo-dg.png')
    if os.path.exists(logo_path):
        logo_uri = to_base64_data_uri(logo_path)
        html = html.replace('src="assets/logo-dg.png"', f'src="{logo_uri}"')
        app_js = app_js.replace("'assets/logo-dg.png'", f"'{logo_uri}'")
        print("  - Logo embutida.")

    # 3. Embutir Fotos de Exemplo
    fotos_dir = os.path.join(BASE_DIR, 'assets', 'fotos')
    if os.path.exists(fotos_dir):
        for fname in os.listdir(fotos_dir):
            if fname.endswith(('.jpg', '.jpeg', '.png')):
                fpath = os.path.join(fotos_dir, fname)
                f_uri = to_base64_data_uri(fpath)
                rel_src = f'assets/fotos/{fname}'
                html = html.replace(f'src="{rel_src}"', f'src="{f_uri}"')
                app_js = app_js.replace(f"'assets/fotos/{fname}'", f"'{f_uri}'")
        print("  - Fotos de exemplo embutidas.")

    # 4. Molduras (embutidas no mapa abaixo; o app usa o mapa antes do caminho do arquivo)
    molduras_dir = os.path.join(BASE_DIR, 'assets', 'molduras')

    # Preparar mapa de molduras, miniaturas e balões para injeção no JS
    molduras_dict = {}
    for key, m_info in [
        ('futurista', 'Moldura Automotiva Futurista com Logo.png'),
        ('neon', 'Moldura Neon Automotiva DG.png'),
        ('laranjaPreta', 'Moldura Automotiva Laranja e Preta.png'),
        ('redesSociais', 'Moldura Neon Laranja para Redes Sociais.png'),
        ('localizacao', 'localizacao.jpg')
    ]:
        m_file = os.path.join(molduras_dir, m_info)
        if os.path.exists(m_file):
            molduras_dict[key] = to_base64_data_uri(m_file)
    premium_dir = os.path.join(molduras_dir, 'premium')
    if os.path.isdir(premium_dir):
        for fname in sorted(os.listdir(premium_dir)):
            if fname.endswith('.webp'):
                molduras_dict[fname[:-5]] = to_base64_data_uri(os.path.join(premium_dir, fname))
    minis_dict = {}
    mini_dir = os.path.join(molduras_dir, 'mini')
    if os.path.isdir(mini_dir):
        for fname in sorted(os.listdir(mini_dir)):
            if fname.endswith('.webp'):
                minis_dict[fname[:-5]] = to_base64_data_uri(os.path.join(mini_dir, fname))
    baloes_dict = {}
    baloes_dir = os.path.join(BASE_DIR, 'assets', 'baloes')
    if os.path.isdir(baloes_dir):
        for fname in sorted(os.listdir(baloes_dir)):
            if fname.startswith('balao_') and fname.endswith('.png'):
                baloes_dict['b' + fname[6:8]] = to_base64_data_uri(os.path.join(baloes_dir, fname))
    print(f"  - {len(molduras_dict)} molduras, {len(minis_dict)} miniaturas e {len(baloes_dict)} balões embutidos.")

    import json
    inject_js = f"""
    <script>
    window.DGMoldurasData = {json.dumps(molduras_dict)};
    window.DGMinisData = {json.dumps(minis_dict)};
    window.DGBaloesData = {json.dumps(baloes_dict)};
    </script>
    """

    # 5. Embutir Scripts
    bundle_js = f"""
    {inject_js}
    <script>
    {render_js}
    </script>
    <script>
    // Ajuste de carregamento para versão embutida
    {app_js}
    </script>
    """

    html = re.sub(
        r'<script src="assets/render\.js(?:\?v=[^"]*)?"></script>\s*<script src="assets/app\.js(?:\?v=[^"]*)?"></script>',
        lambda m: bundle_js,
        html
    )

    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Sucesso! Gerado arquivo único em:\n{OUTPUT_PATH}")

if __name__ == '__main__':
    main()
