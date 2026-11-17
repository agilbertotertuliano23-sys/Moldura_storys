# DG Estética Automotiva · Gerador de Serviços e Preço

Ferramenta visual interativa para criação rápida de **Storys (9:16)**, **Posts de Feed (4:5)** e **Balões de Aviso em PNG Transparente** com os referenciais oficiais da marca **DG Estética Automotiva**.

Inspirado na arquitetura do gerador da Adega Sousa, o sistema permite carregar **qualquer foto de story**, enquadrá-la com precisão (zoom, posição, véu escuro e desfoque) e renderizar tanto os **Balões de Aviso oficiais dos Stories** quanto as **Molduras Oficiais DG** com texto na placa.

---

## 🚀 Como Abrir e Usar

1. **Uso Completo (com pasta de assets):**
   - Dê um duplo clique em `index.html` para abrir em qualquer navegador (Chrome, Edge, Safari, Firefox). Funciona 100% offline.

2. **Versão Arquivo Único (Ideal para Celular e WhatsApp):**
   - Abra o arquivo **`DG Estetica - Gerador de Servicos e Preco.html`**. Ele tem todas as fontes, a logo oficial de alta resolução, molduras e scripts embutidos em base64 em um único arquivo, dispensando pastas externas.

---

## 🎨 Formatos e Modelos Disponíveis

### 1. Formatos de Enquadramento
- **Story com Balão de Aviso (9:16 · 1080 × 1920):**
  A foto do carro fica no fundo com iluminação cinematográfica, a logo oficial da DG fica no topo com brilho neon e o balão de aviso do serviço fica na metade inferior.
- **Story com Moldura Oficial DG (9:16 · 1080 × 1920):**
  Enquadra a foto por baixo das molduras vazadas originais da DG (`storys molduras/`), escrevendo o serviço e valor diretamente na placa da moldura.
- **Post de Feed (4:5 · 1080 × 1350):**
  Proporção clássica do feed do Instagram com composição balanceada.
- **Elemento PNG Transparente (Recortado):**
  Exporta apenas o balão ou selo com fundo 100% transparente para colar sobre qualquer foto ou vídeo no Canva, Instagram Stories, CapCut ou Photoshop.

### 2. Estilos de Balão de Aviso
- **Balão Clean (Referência Oficial dos Stories):**
  Card branco com cantos arredondados, borda e aura neon laranja, insígnia circular no topo com ícone vetorial da estética automotiva, título em itálico de alto impacto, subtítulo com traços flanqueados (`— TÉCNICO —`), descrição e botão CTA com degradê brilhante.
- **Balão Dark Carbono (Esportivo):**
  Card escuro com textura de fibra de carbono, malha hexagonal suave, contorno duplo em neon laranja e tipografia em cromo metálico.
- **Balão "Você Sabia?" (Notícia / Dica):**
  Balão de fala com cauda indicativa e tag superior (`💡 VOCÊ SABIA?`), ideal para postar curiosidades técnicas da anatomia da pintura e dicas de conservação.
- **Faixa Inclinada DG (Slant -14°):**
  Faixa esportiva com ângulo de -14° inspirada na identidade visual dos carrosséis da DG para combos e promoções.
- **Selo Medalhão DG:**
  Medalhão circular compacto com logo ou valor em destaque para aplicar no canto das imagens.


### 3. Molduras e balões prontos (17/11/2026)
- **25 molduras de Story:** as 4 oficiais, o modelo **Localização** (já vem com foto própria, a foto escolhida não aparece) e **20 molduras premium** (`assets/molduras/premium/`, WebP 1080 × 1920). Nas premium, quando o texto cai sobre a foto, ele ganha uma placa escura translúcida.
- **20 balões prontos** (`assets/baloes/`) em "Story", "Feed" e "Só o balão": serviço, complemento e preço dentro do balão; a chamada vai embaixo.
- As miniaturas ficam em `assets/molduras/mini/`; cada moldura só é baixada quando é escolhida.

---

## 📸 Enquadramento de Qualquer Foto de Story

Você pode colocar **qualquer foto tirada no celular ou câmera**:
- **Arrastar e Soltar (Drag & Drop):** Solte a foto direto na caixa da ferramenta.
- **Zoom / Escala:** Aumente ou diminua de `0.6x` até `2.5x`.
- **Posição (Pan X e Y):** Mova a foto para os lados ou para cima/baixo para enquadrar a melhor parte do carro.
- **Escurecimento (Véu):** Regula a opacidade da vinheta escura para garantir leitura perfeita do texto.
- **Desfoque de Fundo:** Aplique desfoque óptico suave para destacar ainda mais o balão de aviso.
- **Galeria Rápida:** 6 fotos reais da DG já vêm pré-carregadas para conferência instantânea.

---

## 🛠️ Presets com 1 Clique

Clique nos botões do topo para preencher instantaneamente todos os campos e ícones:
- 🌀 **Polimento Técnico**
- ✨ **Descontaminação de Pintura**
- 🛡️ **Vitrificação de Pintura**
- 🚗 **Lavagem Técnica**
- 💺 **Higienização Interna**
- 🧴 **Limpeza Detalhada**
- 💺 **Proteção de Couro e Plásticos**
- 💡 **Dica: Você Sabia?**

---

## 📋 Ações e Exportação

- **📥 Baixar Imagem (PNG):** Salva o arquivo em alta definição com nome organizado (ex: `dg-story-polimento-tecnico.png`).
- **📋 Copiar Imagem:** Copia o PNG direto para a área de transferência do Windows/Mac para colar no WhatsApp Web ou editor de imagem.
- **💬 Compartilhar no WhatsApp:** Abre janela com prévia e compartilhamento direto.
- **⚡ Geração em Lote:** Permite colar uma lista de serviços (um por linha no formato `Título ; Subtítulo ; Descrição ; Preço ; CTA`) e baixar todos de uma só vez.

---

## 🔄 Recompilar o Arquivo Standalone

Se fizer qualquer alteração no código (`index.html`, `style.css` ou `render.js`), execute o script de compilação:

```bash
python tools/montar-arquivo-unico.py
```

O arquivo `DG Estetica - Gerador de Servicos e Preco.html` será atualizado automaticamente com tudo embutido.
