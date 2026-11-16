#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Gera imagens de exemplo demonstrando todos os modelos do Gerador DG:
1. Story com Balão de Aviso Clean (Polimento Técnico)
2. Story com Balão de Aviso Clean (Descontaminação de Pintura)
3. Story com Moldura Oficial DG Futurista
4. Story com Balão Dark Carbono
5. Elemento Transparente Recortado
"""

import os
import subprocess
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX_URL = f"file:///{os.path.join(BASE_DIR, 'index.html').replace(os.sep, '/')}"
EXEMPLOS_DIR = os.path.join(BASE_DIR, 'exemplos')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

os.makedirs(EXEMPLOS_DIR, exist_ok=True)

# Script JS injetável para cada variação de teste
TESTS = [
    {
        "name": "exemplo-01-story-balao-polimento.png",
        "js": """
            applyPreset('polimento');
            setTimeout(() => {
                const a = document.createElement('a');
                a.download = 'DONE';
                window.__EXEMPLO_DATA = document.getElementById('mainCanvas').toDataURL('image/png');
            }, 600);
        """
    },
    {
        "name": "exemplo-02-story-balao-descontaminacao.png",
        "js": """
            applyPreset('descontaminacao');
            setTimeout(() => {
                window.__EXEMPLO_DATA = document.getElementById('mainCanvas').toDataURL('image/png');
            }, 600);
        """
    },
    {
        "name": "exemplo-03-story-moldura-futurista.png",
        "js": """
            document.querySelector('[data-mode="molduraStory"]').click();
            applyPreset('vitrificacao');
            setTimeout(() => {
                window.__EXEMPLO_DATA = document.getElementById('mainCanvas').toDataURL('image/png');
            }, 600);
        """
    }
]

def main():
    print(f"Diretório base: {BASE_DIR}")
    print("Gerador pronto!")

if __name__ == '__main__':
    main()
