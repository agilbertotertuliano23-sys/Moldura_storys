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
    mime = 'image/png' if ext == '.png' else ('image/jpeg' if ext in ('.jpg', '.jpeg') else 'application/octet-stream')
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

    # 4. Embutir Molduras
    molduras_dir = os.path.join(BASE_DIR, 'assets', 'molduras')
    if os.path.exists(molduras_dir):
        for fname in os.listdir(molduras_dir):
            if fname.endswith('.png'):
                mpath = os.path.join(molduras_dir, fname)
                m_uri = to_base64_data_uri(mpath)
                # No app_js, substituir a rota da moldura
                app_js = app_js.replace(f"'assets/molduras/' + m.file", f"window.DGMoldurasData[key]")
        print("  - Molduras embutidas.")

    # Preparar mapa de molduras para injeção no JS
    molduras_dict = {}
    if os.path.exists(molduras_dir):
        from PIL import Image
        for key, m_info in [
            ('futurista', 'Moldura Automotiva Futurista com Logo.png'),
            ('neon', 'Moldura Neon Automotiva DG.png'),
            ('laranjaPreta', 'Moldura Automotiva Laranja e Preta.png'),
            ('redesSociais', 'Moldura Neon Laranja para Redes Sociais.png')
        ]:
            m_file = os.path.join(molduras_dir, m_info)
            if os.path.exists(m_file):
                molduras_dict[key] = to_base64_data_uri(m_file)

    inject_js = f"""
    <script>
    window.DGMoldurasData = {str(molduras_dict).replace("'", '"')};
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
    {app_js.replace("img.src = 'assets/molduras/' + m.file;", "img.src = (window.DGMoldurasData && window.DGMoldurasData[key]) || ('assets/molduras/' + m.file);")}
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
