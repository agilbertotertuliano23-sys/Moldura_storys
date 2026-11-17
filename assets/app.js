/* ==========================================================================
   DG Estética Automotiva — Interface do Gerador de Serviços e Preço
   Controlador da UI, Enquadramento de Fotos, Troca de Molduras e Exportação
   ========================================================================== */

(function () {
  'use strict';

  const { render, BRAND, MODELS, MOLDURAS, BALOES, PRESETS } = window.DG;

  // Elementos do DOM
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  const canvas = $('mainCanvas');
  const viewport = $('canvasViewport');
  const metaEl = $('canvasMeta');

  // Estado da aplicação
  const state = {
    exportMode: 'molduraStory', // 'molduraStory', 'story', 'feed', 'card'
    model: 'balaoClean',
    molduraKey: 'futurista',
    title: 'POLIMENTO',
    subtitle: 'TÉCNICO',
    desc: 'Realce o brilho da pintura e reduza marcas superficiais.',
    price: '',
    oldPrice: '',
    cta: 'AGENDE SEU SERVIÇO',
    contact: '',
    // Textos extras adicionados pela pessoa: { id, text, style, x, y }
    extras: [],
    icon: 'politriz',
    color: BRAND.laranja,
    scale: 1,
    showLogo: true,
    bgMode: 'photo', // 'photo', 'dark', 'light', 'transparent'
    // Foto de fundo
    bgImage: null,
    photoZoom: 1,
    photoPanX: 0,
    photoPanY: 0,
    photoVeu: 0.65,
    photoBlur: 0,
    // Imagens carregadas
    logoImage: null,
    molduraImages: {},
    balaoImages: {},
    plateBoxes: false, // quadrados escuros atrás do texto nas molduras premium
    hiddenByMode: {}, // itens excluídos da prévia, por formato/moldura
    // Elementos manipuláveis: { modo: { chave: {dx, dy, s} } } e a seleção atual
    layersByMode: {},
    sel: null,
    // Vídeo de fundo (substitui a foto quando carregado)
    bgVideo: null
  };

  // Carregar Logo Oficial
  const logoImg = new Image();
  logoImg.onload = () => {
    state.logoImage = logoImg;
    scheduleDraw();
  };
  logoImg.src = 'assets/logo-dg.png';

  // Molduras e balões em PNG: cada um só é baixado quando é escolhido
  const embedded = (key) => window.DGMoldurasData && window.DGMoldurasData[key];
  // Versão das imagens: a Hostinger manda o navegador guardar por 7 dias
  const ASSET_V = '?v=20261117c';
  function ensureMoldura(key) {
    const m = MOLDURAS[key];
    if (!m || state.molduraImages[key]) return;
    const img = new Image();
    state.molduraImages[key] = img;
    img.onload = () => {
      if (state.exportMode === 'molduraStory' && state.molduraKey === key) scheduleDraw();
    };
    img.src = embedded(key) || ('assets/molduras/' + encodeURI(m.file) + ASSET_V);
  }
  function ensureBalao(key) {
    const b = BALOES[key];
    if (!b || state.balaoImages[key]) return;
    const img = new Image();
    state.balaoImages[key] = img;
    img.onload = () => {
      if (state.model === key) scheduleDraw();
    };
    img.src = (window.DGBaloesData && window.DGBaloesData[key]) || ('assets/baloes/' + b.file);
  }
  ensureMoldura(state.molduraKey);

  // Carregar Foto de Exemplo Inicial
  const sampleInitial = new Image();
  sampleInitial.onload = () => {
    state.bgImage = sampleInitial;
    scheduleDraw();
  };
  sampleInitial.src = 'assets/fotos/d09.jpg';

  // ==========================================================================
  // INICIALIZAÇÃO DA INTERFACE
  // ==========================================================================
  function initUI() {
    renderPresetsBar();
    renderFormatOptions();
    renderModelOptions();
    renderBalaoOptions();
    renderMolduraOptions();
    renderIconsGrid();
    setupExtras();
    setupDropzone();
    setupSliders();
    setupInputBindings();
    setupActionButtons();
    setupBgSwitcher();
    setupLayers();
    setupVideoControls();
    setupMobileNav();
    updateControlsVisibility();
  }

  // 1. Barra de Presets Rápidos
  function renderPresetsBar() {
    const list = $('presetsList');
    list.innerHTML = '';
    Object.entries(PRESETS).forEach(([key, p]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-chip' + (key === 'polimento' ? ' active' : '');
      btn.textContent = p.title + (p.subtitle ? ' ' + p.subtitle : '');
      btn.onclick = () => applyPreset(key, btn);
      list.appendChild(btn);
    });
  }

  function applyPreset(key, chip) {
    $$('.preset-chip').forEach(c => c.classList.remove('active'));
    if (chip) chip.classList.add('active');

    const p = PRESETS[key];
    if (!p) return;

    $('inpTitle').value = p.title;
    $('inpSubtitle').value = p.subtitle;
    $('inpDesc').value = p.desc;
    $('inpPrice').value = p.price || '';
    $('inpOldPrice').value = p.oldPrice || '';
    const cta = String(p.cta || 'AGENDE SEU SERVIÇO').replace(/\s*(>>|»)+\s*$/, '');
    $('inpCta').value = cta;

    state.title = p.title;
    state.subtitle = p.subtitle;
    state.desc = p.desc;
    state.price = p.price || '';
    state.oldPrice = p.oldPrice || '';
    state.cta = cta;
    state.icon = p.icon || 'politriz';
    if (p.model) {
      state.model = p.model;
      syncModelCards();
    }

    syncIconButtons();
    scheduleDraw();
  }

  // 2. Seletores de Formato / Modo
  function renderFormatOptions() {
    $$('.format-card').forEach(card => {
      card.onclick = () => {
        $$('.format-card').forEach(c => { c.classList.remove('active'); c.setAttribute('aria-checked', 'false'); });
        card.classList.add('active');
        card.setAttribute('aria-checked', 'true');
        state.exportMode = card.dataset.mode;
        viewport.setAttribute('data-mode', state.exportMode === 'molduraStory' ? 'story' : state.exportMode);
        updateControlsVisibility();
        scheduleDraw();
      };
    });
  }

  // 3. Seletores de Modelo de Balão
  function renderModelOptions() {
    const container = $('modelOptions');
    container.innerHTML = '';
    Object.entries(MODELS).forEach(([key, m]) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'style-item model-card' + (key === state.model ? ' active' : '');
      card.dataset.model = key;
      card.innerHTML = `<strong>${m.label}</strong><small>${m.badge.toLowerCase()}</small>`;
      card.onclick = () => {
        state.model = key;
        syncModelCards();
        scheduleDraw();
      };
      container.appendChild(card);
    });
  }

  function syncModelCards() {
    $$('.model-card, .balao-card').forEach(c => {
      c.classList.toggle('active', c.dataset.model === state.model);
    });
  }

  // 3b. Balões prontos em PNG
  function renderBalaoOptions() {
    const container = $('balaoOptions');
    if (!container) return;
    container.innerHTML = '';
    Object.entries(BALOES).forEach(([key, b]) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'balao-card' + (key === state.model ? ' active' : '');
      card.dataset.model = key;
      card.setAttribute('aria-label', b.label);
      card.innerHTML = `<img src="${(window.DGBaloesData && window.DGBaloesData[key]) || ('assets/baloes/' + b.file)}" alt="" loading="lazy">`;
      card.onclick = () => {
        state.model = key;
        ensureBalao(key);
        syncModelCards();
        scheduleDraw();
      };
      container.appendChild(card);
    });
  }

  // 4. Seletores de Molduras Oficiais DG
  function renderMolduraOptions() {
    const container = $('molduraOptions');
    container.innerHTML = '';
    let lastGroup = null;
    Object.entries(MOLDURAS).forEach(([key, m]) => {
      const group = m.group === 'premium' ? 'Premium' : 'Oficiais DG';
      if (group !== lastGroup) {
        const h = document.createElement('p');
        h.className = 'frame-group';
        h.textContent = group;
        container.appendChild(h);
        lastGroup = group;
      }
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'frame-card moldura-card' + (key === state.molduraKey ? ' active' : '');
      card.dataset.moldura = key;
      card.setAttribute('aria-label', 'Moldura ' + m.label);
      card.innerHTML = `
        <span class="frame-thumb"><img src="${(window.DGMinisData && window.DGMinisData[key]) || ('assets/molduras/mini/' + key + '.webp' + ASSET_V)}" alt="" loading="lazy"></span>
        <span class="frame-name">${m.label}</span>
      `;
      card.onclick = () => {
        state.molduraKey = key;
        ensureMoldura(key);
        $$('.moldura-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        scheduleDraw();
      };
      container.appendChild(card);
    });
  }

  // 5. Grid de Ícones Vetoriais
  const ICONS_LIST = [
    { id: 'politriz', label: 'Politriz', iconChar: '🌀' },
    { id: 'camadas', label: 'Camadas', iconChar: '✨' },
    { id: 'lavagem', label: 'Lavagem', iconChar: '🚗' },
    { id: 'banco', label: 'Estofado', iconChar: '💺' },
    { id: 'escudo', label: 'Escudo', iconChar: '🛡️' },
    { id: 'spray', label: 'Spray', iconChar: '🧴' },
    { id: 'roda', label: 'Roda', iconChar: '⚙️' },
    { id: 'farol', label: 'Farol', iconChar: '💡' },
    { id: 'dica', label: 'Dica', iconChar: '💬' }
  ];

  function renderIconsGrid() {
    const grid = $('iconsGrid');
    grid.innerHTML = '';
    ICONS_LIST.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'icon-btn' + (item.id === state.icon ? ' active' : '');
      btn.dataset.icon = item.id;
      btn.innerHTML = `<span style="font-size:16px;">${item.iconChar}</span><span>${item.label}</span>`;
      btn.onclick = () => {
        state.icon = item.id;
        syncIconButtons();
        scheduleDraw();
      };
      grid.appendChild(btn);
    });
  }

  function syncIconButtons() {
    $$('.icon-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.icon === state.icon);
    });
  }

  // 6. Configuração da Área de Upload / Drag & Drop
  function setupDropzone() {
    const dropzone = $('dropzone');
    const fileInput = $('fileInput');
    const photoBar = $('photoPreviewBar');
    const photoThumb = $('photoThumb');
    const photoName = $('photoName');
    const btnRemove = $('btnRemovePhoto');

    dropzone.onclick = () => fileInput.click();
    dropzone.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    };

    fileInput.onchange = (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) handleImageFile(file);
    };

    dropzone.ondragover = (e) => {
      e.preventDefault();
      dropzone.classList.add('dragover');
    };

    dropzone.ondragleave = () => dropzone.classList.remove('dragover');

    dropzone.ondrop = (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      const file = e.dataTransfer.files && e.dataTransfer.files[0];
      if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
        handleImageFile(file);
      }
    };

    btnRemove.onclick = (e) => {
      e.stopPropagation();
      clearVideo();
      state.bgImage = null;
      photoBar.hidden = true;
      dropzone.hidden = false;
      fileInput.value = '';
      scheduleDraw();
    };

    // Galeria de Amostras de Fotos DG
    $$('.sample-thumb').forEach(thumb => {
      thumb.onclick = () => {
        clearVideo();
        $$('.sample-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const img = new Image();
        img.onload = () => {
          state.bgImage = img;
          photoThumb.src = img.src;
          photoName.textContent = 'Foto DG (' + thumb.dataset.sample + ')';
          photoBar.hidden = false;
          dropzone.hidden = true;
          scheduleDraw();
        };
        img.src = thumb.src;
      };
    });
  }

  function handleImageFile(file) {
    if (file.type && file.type.startsWith('video/')) {
      handleVideoFile(file);
      return;
    }
    clearVideo();
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        state.bgImage = img;
        $('photoThumb').src = img.src;
        $('photoName').textContent = file.name;
        $('photoPreviewBar').hidden = false;
        $('dropzone').hidden = true;
        // Reset pan ao carregar nova foto
        state.photoPanX = 0;
        state.photoPanY = 0;
        $('sliderPanX').value = 0;
        $('sliderPanY').value = 0;
        $('valPanX').textContent = '0px';
        $('valPanY').textContent = '0px';
        scheduleDraw();
      };
      img.src = evt.target.result;
    };
    reader.readAsDataURL(file);
  }

  // 7. Sliders de Enquadramento
  function setupSliders() {
    const bindSlider = (id, valId, key, formatFn) => {
      const slider = $(id);
      const valLabel = $(valId);
      slider.oninput = (e) => {
        const val = Number(e.target.value);
        state[key] = val;
        valLabel.textContent = formatFn(val);
        scheduleDraw();
      };
    };

    bindSlider('sliderZoom', 'valZoom', 'photoZoom', v => v.toFixed(2) + 'x');
    bindSlider('sliderPanX', 'valPanX', 'photoPanX', v => v + 'px');
    bindSlider('sliderPanY', 'valPanY', 'photoPanY', v => v + 'px');
    bindSlider('sliderVeu', 'valVeu', 'photoVeu', v => Math.round(v * 100) + '%');
    bindSlider('sliderBlur', 'valBlur', 'photoBlur', v => v + 'px');
  }

  // 8. Bind de Textos do Formulário
  function setupInputBindings() {
    const bindText = (id, key) => {
      const el = $(id);
      if (!el) return;
      el.oninput = () => {
        state[key] = el.value;
        scheduleDraw();
      };
    };

    bindText('inpTitle', 'title');
    bindText('inpSubtitle', 'subtitle');
    bindText('inpDesc', 'desc');
    bindText('inpPrice', 'price');
    bindText('inpOldPrice', 'oldPrice');
    bindText('inpCta', 'cta');
    bindText('inpContact', 'contact');

    // Contato fica guardado neste aparelho: não precisa digitar de novo a cada visita
    const CONTACT_KEY = 'dg-gerador-contato';
    try {
      const saved = localStorage.getItem(CONTACT_KEY);
      if (saved && !$('inpContact').value) {
        $('inpContact').value = saved;
        state.contact = saved;
      }
    } catch (err) {}
    $('inpContact').addEventListener('input', () => {
      try { localStorage.setItem(CONTACT_KEY, $('inpContact').value.trim()); } catch (err) {}
    });

    $('chkPlateBoxes').onchange = (e) => {
      state.plateBoxes = e.target.checked;
      scheduleDraw();
    };
    $('chkShowLogo').onchange = (e) => {
      state.showLogo = e.target.checked;
      scheduleDraw();
    };

    // Grupos de botões de escolha única (cor e qualidade)
    const bindSeg = (sel, attr, apply) => {
      const btns = $$(sel);
      btns.forEach((b) => {
        b.onclick = () => {
          btns.forEach((x) => x.classList.toggle('active', x === b));
          apply(b.dataset[attr]);
          scheduleDraw();
        };
      });
    };
    bindSeg('#colorSwatches .swatch', 'color', (v) => { state.color = v; });
    bindSeg('#resSeg button', 'res', (v) => { state.scale = Number(v) || 1; });
  }

  // ==========================================================================
  // TEXTOS EXTRAS — a pessoa adiciona quantos quiser, em qualquer formato
  // ==========================================================================
  const STYLE_LABELS = (window.DG.TEXT_STYLES) || {};
  let extraSeq = 0;

  function extraLabel(id) {
    const e = state.extras.find((x) => String(x.id) === String(id));
    const t = e ? String(e.text || '').replace(/\s+/g, ' ').trim() : '';
    return t ? (t.length > 16 ? t.slice(0, 15) + '…' : t) : 'Texto extra';
  }

  function renderExtras() {
    const list = $('extrasList');
    list.innerHTML = '';
    state.extras.forEach((e) => {
      const row = document.createElement('div');
      row.className = 'extra-row';

      const inp = document.createElement('input');
      inp.type = 'text';
      inp.value = e.text;
      inp.placeholder = 'Digite o texto';
      inp.setAttribute('aria-label', 'Texto extra');
      inp.autocomplete = 'off';
      inp.oninput = () => { e.text = inp.value; scheduleDraw(); };
      inp.onfocus = () => select('x:' + e.id);

      const styles = document.createElement('div');
      styles.className = 'seg seg-xs';
      styles.setAttribute('role', 'radiogroup');
      styles.setAttribute('aria-label', 'Estilo do texto');
      Object.keys(STYLE_LABELS).forEach((k) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = STYLE_LABELS[k].label;
        b.className = k === e.style ? 'active' : '';
        b.onclick = () => {
          e.style = k;
          styles.querySelectorAll('button').forEach((x) => x.classList.toggle('active', x === b));
          select('x:' + e.id);
          scheduleDraw();
        };
        styles.appendChild(b);
      });

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'extra-del';
      del.setAttribute('aria-label', 'Apagar este texto');
      del.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
      del.onclick = () => {
        pushHistory();
        state.extras = state.extras.filter((x) => x !== e);
        Object.values(state.layersByMode).forEach((m) => { delete m['x:' + e.id]; });
        if (state.sel === 'x:' + e.id) state.sel = null;
        renderExtras();
        scheduleDraw();
      };

      const top = document.createElement('div');
      top.className = 'extra-top';
      top.appendChild(inp);
      top.appendChild(del);
      row.appendChild(top);
      row.appendChild(styles);
      list.appendChild(row);
    });
  }

  function setupExtras() {
    $('btnAddText').onclick = () => {
      pushHistory();
      const n = state.extras.length;
      // Na moldura, a parte de cima é foto livre; nos balões, o meio da arte
      const baseY = state.exportMode === 'molduraStory' ? 0.2 : 0.36;
      const e = {
        id: ++extraSeq,
        text: n === 0 ? 'OFERTA DA SEMANA' : 'NOVO TEXTO',
        style: n === 0 ? 'etiqueta' : 'destaque',
        x: 0.5,
        y: Math.min(0.85, baseY + (n % 6) * 0.08)
      };
      state.extras.push(e);
      renderExtras();
      state.sel = 'x:' + e.id;
      scheduleDraw();
      const inputs = $('extrasList').querySelectorAll('input[type="text"]');
      const last = inputs[inputs.length - 1];
      if (last) { last.focus(); last.select(); }
    };
    renderExtras();
  }

  // 9. Alternância de Fundo da Prévia
  function setupBgSwitcher() {
    $$('.bg-switcher button').forEach(btn => {
      btn.onclick = () => {
        $$('.bg-switcher button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.bgMode = btn.dataset.bg;
        scheduleDraw();
      };
    });
  }

  // ==========================================================================
  // ELEMENTOS MANIPULÁVEIS — legendas, caixas e logo: mover e redimensionar
  // ==========================================================================
  const LAYER_LABELS = window.DG.LAYER_LABELS || {};
  const labelFor = (k) => (String(k).indexOf('x:') === 0 ? extraLabel(k.slice(2)) : (LAYER_LABELS[k] || k));
  const selBox = $('selBox');
  const selHandle = $('selHandle');
  const selLabel = $('selLabel');
  let drag = null;
  let pinch = null;
  let rafId = 0;
  let chipSig = '';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function modeKey() {
    return state.exportMode === 'molduraStory' ? 'moldura:' + state.molduraKey : state.exportMode;
  }
  function layersFor() {
    const k = modeKey();
    return state.layersByMode[k] || (state.layersByMode[k] = {});
  }
  function hiddenFor() {
    const k = modeKey();
    return state.hiddenByMode[k] || (state.hiddenByMode[k] = {});
  }

  // ---- Desfazer / refazer: posição, tamanho, itens excluídos e textos extras ----
  const undoStack = [];
  const redoStack = [];
  function snapshot() {
    return JSON.stringify({ l: state.layersByMode, h: state.hiddenByMode, x: state.extras });
  }
  function pushHistory() {
    const snap = snapshot();
    if (undoStack[undoStack.length - 1] === snap) return;
    undoStack.push(snap);
    if (undoStack.length > 60) undoStack.shift();
    redoStack.length = 0;
    syncHistoryButtons();
  }
  // Agrupa uma sequência rápida (roda do mouse, setas) num passo só
  let historyTimer = 0;
  function pushHistoryOnce() {
    if (!historyTimer) pushHistory();
    clearTimeout(historyTimer);
    historyTimer = setTimeout(() => { historyTimer = 0; }, 700);
  }
  function restoreSnap(snap) {
    const o = JSON.parse(snap);
    state.layersByMode = o.l;
    state.hiddenByMode = o.h;
    state.extras = o.x;
    if (state.sel && String(state.sel).indexOf('x:') === 0 && !state.extras.some((e) => 'x:' + e.id === state.sel)) state.sel = null;
    renderExtras();
    queueDraw();
    syncHistoryButtons();
  }
  function undo() {
    if (!undoStack.length) return;
    redoStack.push(snapshot());
    restoreSnap(undoStack.pop());
  }
  function redo() {
    if (!redoStack.length) return;
    undoStack.push(snapshot());
    restoreSnap(redoStack.pop());
  }
  function syncHistoryButtons() {
    $('btnUndo').disabled = !undoStack.length;
    $('btnRedo').disabled = !redoStack.length;
  }

  // ---- Excluir, duplicar e centralizar o item escolhido ----
  function deleteLayer(key) {
    if (!key) return;
    pushHistory();
    const name = labelFor(key);
    if (String(key).indexOf('x:') === 0) {
      const id = key.slice(2);
      state.extras = state.extras.filter((x) => String(x.id) !== id);
      Object.values(state.layersByMode).forEach((m) => { delete m[key]; });
      renderExtras();
    } else {
      hiddenFor()[key] = true;
    }
    state.sel = null;
    queueDraw();
    showToast(name + ' excluído. Ctrl+Z ou "Desfazer" traz de volta.');
  }
  function duplicateExtra(key) {
    if (!key || String(key).indexOf('x:') !== 0) return;
    const src = state.extras.find((x) => 'x:' + x.id === key);
    if (!src) return;
    pushHistory();
    const e = Object.assign({}, src, { id: ++extraSeq, y: Math.min(0.92, (Number(src.y) || 0.3) + 0.06) });
    state.extras.push(e);
    const l = layersFor()[key];
    if (l) layersFor()['x:' + e.id] = Object.assign({}, l);
    renderExtras();
    state.sel = 'x:' + e.id;
    queueDraw();
  }
  function centerLayer(key) {
    const h = key && findHit(key);
    const dg = canvas._dg;
    if (!h || !dg) return;
    pushHistory();
    nudge(key, dg.W / 2 - (h.x0 + h.x1) / 2, 0);
  }
  function hiddenCount() {
    const h = hiddenFor();
    return Object.keys(h).filter((k) => h[k]).length;
  }

  function layerOf(key) {
    const all = layersFor();
    return all[key] || (all[key] = { dx: 0, dy: 0, s: 1 });
  }
  function queueDraw() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => { rafId = 0; performDraw(); });
  }
  function currentHits() {
    return (canvas._dg && canvas._dg.hits) || [];
  }
  function findHit(key) {
    return currentHits().find((h) => h.key === key);
  }

  // O canvas é exibido com object-fit: contain — calcula onde a arte realmente está
  function viewMap() {
    const dg = canvas._dg;
    if (!dg) return null;
    const r = canvas.getBoundingClientRect();
    const k = Math.min(r.width / dg.W, r.height / dg.H);
    return {
      left: r.left + (r.width - dg.W * k) / 2,
      top: r.top + (r.height - dg.H * k) / 2,
      k: k
    };
  }
  function toLogical(e) {
    const v = viewMap();
    if (!v) return { x: 0, y: 0 };
    return { x: (e.clientX - v.left) / v.k, y: (e.clientY - v.top) / v.k };
  }

  // Elemento sob o ponto: o mais interno (filho) ganha do balão; empate = o menor
  function hitAt(p) {
    const tol = 6;
    let best = null;
    currentHits().forEach((h) => {
      if (p.x < h.x0 - tol || p.x > h.x1 + tol || p.y < h.y0 - tol || p.y > h.y1 + tol) return;
      const area = (h.x1 - h.x0) * (h.y1 - h.y0);
      if (!best || h.depth > best.depth || (h.depth === best.depth && area < best.area)) {
        best = Object.assign({ area: area }, h);
      }
    });
    return best;
  }

  // Desloca o elemento por (ax, ay) em pixels da arte (converte para o espaço do pai)
  function nudge(key, ax, ay) {
    const h = findHit(key);
    if (!h) return;
    const l = layerOf(key);
    l.dx += h.inv[0] * ax + h.inv[2] * ay;
    l.dy += h.inv[1] * ax + h.inv[3] * ay;
    queueDraw();
  }

  function select(key) {
    state.sel = key;
    refreshLayerUI();
  }

  function updateOverlay() {
    const h = state.sel && findHit(state.sel);
    const v = viewMap();
    if (!h || !v) { selBox.hidden = true; return; }
    const vr = viewport.getBoundingClientRect();
    const x = v.left - vr.left + h.x0 * v.k;
    const y = v.top - vr.top + h.y0 * v.k;
    selBox.style.left = x + 'px';
    selBox.style.top = y + 'px';
    selBox.style.width = (h.x1 - h.x0) * v.k + 'px';
    selBox.style.height = (h.y1 - h.y0) * v.k + 'px';
    selLabel.textContent = labelFor(h.key);
    selLabel.style.top = y < 26 ? '2px' : '-22px';
    selBox.hidden = false;
  }

  function refreshLayerUI() {
    const hits = currentHits();
    if (state.sel && !hits.some((h) => h.key === state.sel)) state.sel = null;

    // Chips de seleção (úteis para elementos pequenos e no celular)
    const keys = hits.slice().sort((a, b) => a.depth - b.depth).map((h) => h.key);
    const sig = keys.map(labelFor).join('|') + '#' + keys.join('|');
    const chips = $('layerChips');
    if (sig !== chipSig) {
      chipSig = sig;
      chips.innerHTML = '';
      keys.forEach((k) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'layer-chip';
        b.dataset.key = k;
        b.textContent = labelFor(k);
        b.onclick = () => select(state.sel === k ? null : k);
        chips.appendChild(b);
      });
    }
    chips.querySelectorAll('.layer-chip').forEach((b) => {
      b.classList.toggle('active', b.dataset.key === state.sel);
      b.classList.toggle('moved', !!(layersFor()[b.dataset.key] && (
        layersFor()[b.dataset.key].dx || layersFor()[b.dataset.key].dy || layersFor()[b.dataset.key].s !== 1)));
    });

    const has = !!state.sel;
    $('layerBar').classList.toggle('has-sel', has);
    const slider = $('layerScale');
    slider.disabled = !has;
    $('btnLayerReset').disabled = !has;
    $('btnLayerDelete').disabled = !has;
    $('btnLayerCenter').disabled = !has;
    $('btnLayerDup').hidden = !(has && String(state.sel).indexOf('x:') === 0);
    const nh = hiddenCount();
    $('btnRestoreHidden').hidden = !nh;
    $('btnRestoreHidden').textContent = 'Mostrar excluídos (' + nh + ')';
    document.querySelectorAll('.nudge-btn').forEach((b) => { b.disabled = !has; });
    if (has) {
      const s = layerOf(state.sel).s;
      slider.value = s;
      $('layerScaleVal').textContent = Math.round(s * 100) + '%';
      $('layerName').textContent = labelFor(state.sel);
    } else {
      $('layerScaleVal').textContent = '—';
      $('layerName').textContent = 'Nenhum item escolhido';
    }
    updateOverlay();
  }

  function onMove(e) {
    if (!drag) {
      if (e.currentTarget === canvas) {
        canvas.style.cursor = hitAt(toLogical(e)) ? 'move' : 'default';
      }
      return;
    }
    const p = toLogical(e);
    const l = layerOf(drag.key);
    if (drag.mode === 'move') {
      const ax = p.x - drag.start.x;
      const ay = p.y - drag.start.y;
      l.dx = drag.l0.dx + drag.inv[0] * ax + drag.inv[2] * ay;
      l.dy = drag.l0.dy + drag.inv[1] * ax + drag.inv[3] * ay;
    } else {
      const d = Math.hypot(p.x - drag.pivot.x, p.y - drag.pivot.y);
      l.s = clamp(drag.s0 * d / drag.d0, 0.25, 3);
    }
    queueDraw();
  }
  function onUp(e) {
    if (!drag) return;
    drag = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {}
  }

  function setupLayers() {
    canvas.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button > 0) return;
      if (e.pointerType === 'touch' && (!e.isPrimary || pinch)) return; // 2º dedo = pinça
      const p = toLogical(e);
      const h = hitAt(p);
      if (!h) { select(null); return; }
      select(h.key);
      pushHistory();
      const l = layerOf(h.key);
      drag = { mode: 'move', key: h.key, start: p, l0: { dx: l.dx, dy: l.dy }, inv: h.inv };
      canvas.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    // Toque: o canvas deixa a página rolar (touch-action: pan-y). Só quando o dedo
    // cai em cima de um elemento a rolagem é bloqueada e o arraste assume.
    // Dois dedos com um elemento selecionado = pinça para redimensionar.
    const touchDist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2 && state.sel) {
        e.preventDefault();
        drag = null;
        pushHistory();
        pinch = { d0: Math.max(20, touchDist(e.touches)), s0: layerOf(state.sel).s };
        return;
      }
      if (e.touches.length === 1 && hitAt(toLogical(e.touches[0]))) e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
      if (!pinch || e.touches.length !== 2 || !state.sel) return;
      e.preventDefault();
      layerOf(state.sel).s = clamp(pinch.s0 * touchDist(e.touches) / pinch.d0, 0.25, 3);
      queueDraw();
    }, { passive: false });
    const endPinch = (e) => { if (e.touches.length < 2) pinch = null; };
    canvas.addEventListener('touchend', endPinch);
    canvas.addEventListener('touchcancel', endPinch);

    // Alça do canto: redimensiona em torno do ponto de ancoragem do elemento
    selHandle.addEventListener('pointerdown', (e) => {
      const h = state.sel && findHit(state.sel);
      if (!h) return;
      const p = toLogical(e);
      const d0 = Math.max(24, Math.hypot(p.x - h.px, p.y - h.py));
      pushHistory();
      drag = { mode: 'scale', key: h.key, pivot: { x: h.px, y: h.py }, d0: d0, s0: layerOf(h.key).s };
      selHandle.setPointerCapture(e.pointerId);
      e.preventDefault();
      e.stopPropagation();
    });
    selHandle.addEventListener('pointermove', onMove);
    selHandle.addEventListener('pointerup', onUp);
    selHandle.addEventListener('pointercancel', onUp);

    // Roda do mouse sobre um elemento = aumenta / diminui
    canvas.addEventListener('wheel', (e) => {
      const h = hitAt(toLogical(e));
      if (!h) return;
      e.preventDefault();
      select(h.key);
      pushHistoryOnce();
      const l = layerOf(h.key);
      l.s = clamp(l.s * (e.deltaY < 0 ? 1.06 : 0.94), 0.25, 3);
      queueDraw();
    }, { passive: false });

    // Duplo clique = volta o elemento ao lugar original
    canvas.addEventListener('dblclick', (e) => {
      const h = hitAt(toLogical(e));
      if (!h) return;
      pushHistory();
      delete layersFor()[h.key];
      queueDraw();
    });

    // Painel de ajuste
    $('layerScale').oninput = (e) => {
      if (!state.sel) return;
      pushHistoryOnce();
      layerOf(state.sel).s = Number(e.target.value);
      queueDraw();
    };
    document.querySelectorAll('.nudge-btn').forEach((b) => {
      b.onclick = () => {
        if (!state.sel) return;
        pushHistoryOnce();
        nudge(state.sel, Number(b.dataset.nx) * 6, Number(b.dataset.ny) * 6);
      };
    });
    $('btnLayerReset').onclick = () => {
      if (!state.sel) return;
      pushHistory();
      delete layersFor()[state.sel];
      queueDraw();
    };
    $('btnLayerResetAll').onclick = () => {
      pushHistory();
      state.layersByMode[modeKey()] = {};
      state.hiddenByMode[modeKey()] = {};
      queueDraw();
    };
    $('btnLayerDelete').onclick = () => deleteLayer(state.sel);
    $('btnLayerDup').onclick = () => duplicateExtra(state.sel);
    $('btnLayerCenter').onclick = () => centerLayer(state.sel);
    $('btnUndo').onclick = undo;
    $('btnRedo').onclick = redo;
    $('btnRestoreHidden').onclick = () => {
      pushHistory();
      state.hiddenByMode[modeKey()] = {};
      queueDraw();
      showToast('Itens excluídos de volta na prévia.');
    };
    // X vermelho no canto da seleção
    const selDel = $('selDelete');
    selDel.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); });
    selDel.addEventListener('click', (e) => { e.stopPropagation(); deleteLayer(state.sel); });

    // Ctrl+Z / Ctrl+Y valem mesmo sem item escolhido (fora dos campos de texto)
    document.addEventListener('keydown', (e) => {
      const t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (!(e.ctrlKey || e.metaKey)) return;
      const k = e.key.toLowerCase();
      if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
      else if (k === 'd' && state.sel) { e.preventDefault(); duplicateExtra(state.sel); }
    });

    // Teclado: setas movem, + / − redimensionam, Esc solta
    document.addEventListener('keydown', (e) => {
      if (!state.sel) return;
      const t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const step = e.shiftKey ? 12 : 2;
      const arrows = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
      if (arrows[e.key]) {
        e.preventDefault();
        pushHistoryOnce();
        nudge(state.sel, arrows[e.key][0], arrows[e.key][1]);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteLayer(state.sel);
      } else if (e.key === '+' || e.key === '=' || e.key === '-' || e.key === '_') {
        e.preventDefault();
        pushHistoryOnce();
        const l = layerOf(state.sel);
        l.s = clamp(l.s * (e.key === '+' || e.key === '=' ? 1.05 : 0.95), 0.25, 3);
        queueDraw();
      } else if (e.key === 'Escape') {
        select(null);
      }
    });

    window.addEventListener('resize', updateOverlay);
  }

  // ==========================================================================
  // VÍDEO DE FUNDO — reprodução na prévia e gravação com os elementos por cima
  // ==========================================================================
  const fgCanvas = document.createElement('canvas'); // moldura + logo + balão (cache)
  let videoUrl = null;
  let videoRaf = 0;
  let recorder = null;
  let recChunks = [];
  let recTimer = 0;
  let audioCtx = null;
  let audioDest = null;

  // Fundo (frame atual do vídeo) + primeiro plano em cache
  function composeVideoFrame() {
    if (!state.bgVideo || !fgCanvas._dg) return;
    render(canvas, Object.assign({}, state, { layerPass: 'bg', bgImage: state.bgVideo }));
    canvas.getContext('2d').drawImage(fgCanvas, 0, 0);
    canvas._dg = fgCanvas._dg; // áreas clicáveis dos elementos
    mirrorMini();
  }

  function videoTick() {
    videoRaf = 0;
    const v = state.bgVideo;
    if (!v || state.exportMode === 'card') return;
    if (!v.paused || v.seeking || recorder) composeVideoFrame();
    videoRaf = requestAnimationFrame(videoTick);
  }
  function startVideoLoop() {
    if (!videoRaf) videoRaf = requestAnimationFrame(videoTick);
  }
  function stopVideoLoop() {
    if (videoRaf) cancelAnimationFrame(videoRaf);
    videoRaf = 0;
  }

  function clearVideo() {
    if (recorder) {
      recorder.onstop = null;
      try { recorder.stop(); } catch (err) {}
      recorder = null;
      clearInterval(recTimer);
    }
    stopVideoLoop();
    if (state.bgVideo) {
      state.bgVideo.pause();
      state.bgVideo.removeAttribute('src');
      state.bgVideo.load();
      state.bgVideo = null;
    }
    if (videoUrl) { URL.revokeObjectURL(videoUrl); videoUrl = null; }
    const vc = $('videoControls');
    if (vc) vc.hidden = true;
    setRecButton(false);
  }

  function handleVideoFile(file) {
    clearVideo();
    videoUrl = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.loop = true;
    v.muted = true; // prévia silenciosa; o áudio só entra na gravação
    v.playsInline = true;
    v.preload = 'auto';
    v.src = videoUrl;
    v.onloadeddata = () => {
      v.onloadeddata = null;
      state.bgVideo = v;
      state.photoPanX = 0;
      state.photoPanY = 0;
      $('sliderPanX').value = 0;
      $('sliderPanY').value = 0;
      $('valPanX').textContent = '0px';
      $('valPanY').textContent = '0px';
      // miniatura do primeiro quadro
      try {
        const c = document.createElement('canvas');
        c.width = 96; c.height = Math.round(96 * v.videoHeight / v.videoWidth) || 96;
        c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
        $('photoThumb').src = c.toDataURL('image/jpeg', 0.7);
      } catch (err) {}
      $('photoName').textContent = '🎬 ' + file.name + ' (' + Math.round(v.duration || 0) + ' s)';
      $('photoPreviewBar').hidden = false;
      $('dropzone').hidden = true;
      $('videoControls').hidden = false;
      v.play().catch(() => {});
      scheduleDraw();
    };
    v.onerror = () => {
      clearVideo();
      showToast('⚠️ Não consegui abrir esse vídeo. Tente MP4 (H.264) ou WebM.');
    };
  }

  function pickRecordMime() {
    if (!window.MediaRecorder) return '';
    const list = [
      'video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4;codecs=avc1', 'video/mp4',
      'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'
    ];
    return list.find((t) => MediaRecorder.isTypeSupported(t)) || '';
  }

  // Áudio do vídeo -> fluxo de gravação, sem sair nas caixas de som
  function ensureAudio(v) {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AC();
      audioDest = audioCtx.createMediaStreamDestination();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (!v._dgAudioSrc) {
      v._dgAudioSrc = audioCtx.createMediaElementSource(v);
      v._dgAudioSrc.connect(audioDest);
    }
    v.muted = false;
  }

  function setRecButton(recording, pct) {
    const b = $('btnVideoRec');
    if (!b) return;
    b.textContent = recording ? '⏹ Parar gravação (' + (pct || 0) + '%)' : '🎬 Gravar vídeo com os elementos';
    b.classList.toggle('recording', !!recording);
  }

  function toggleRecord() {
    if (recorder) { recorder.stop(); return; }
    const v = state.bgVideo;
    if (!v) return;
    if (!window.MediaRecorder || !canvas.captureStream) {
      showToast('⚠️ Este navegador não grava vídeo. Use o Chrome ou o Edge.');
      return;
    }
    const mime = pickRecordMime();
    const stream = canvas.captureStream(30);
    if ($('chkVideoAudio').checked) {
      try {
        ensureAudio(v);
        audioDest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
      } catch (err) {
        showToast('⚠️ Não consegui capturar o áudio; gravando sem som.');
      }
    }
    recChunks = [];
    try {
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 8000000 } : undefined);
    } catch (err) {
      recorder = null;
      showToast('⚠️ Erro ao iniciar a gravação: ' + err.message);
      return;
    }
    const rec = recorder;
    rec.ondataavailable = (e) => { if (e.data && e.data.size) recChunks.push(e.data); };
    rec.onstop = () => {
      clearInterval(recTimer);
      stream.getTracks().forEach((t) => t.stop());
      const type = rec.mimeType || mime || 'video/webm';
      const blob = new Blob(recChunks, { type: type });
      const ext = type.indexOf('mp4') >= 0 ? 'mp4' : 'webm';
      const slug = (state.title || 'servico').toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const link = document.createElement('a');
      link.download = 'dg-video-' + slug + '.' + ext;
      link.href = URL.createObjectURL(blob);
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 10000);
      showToast('🎬 Vídeo salvo: ' + link.download + (ext === 'webm' ? ' (WebM — converta p/ MP4 para o Instagram)' : ''));
      recorder = null;
      setRecButton(false);
      if (state.bgVideo) {
        state.bgVideo.onended = null;
        state.bgVideo.loop = true;
        state.bgVideo.play().catch(() => {});
      }
    };
    v.loop = false;
    v.onended = () => { if (recorder) recorder.stop(); };
    v.currentTime = 0;
    rec.start(250);
    v.play().catch(() => {});
    setRecButton(true, 0);
    recTimer = setInterval(() => {
      const pct = v.duration ? Math.min(100, Math.round(100 * v.currentTime / v.duration)) : 0;
      setRecButton(true, pct);
    }, 300);
  }

  function setupVideoControls() {
    $('btnVideoPlay').onclick = () => {
      const v = state.bgVideo;
      if (!v) return;
      if (v.paused) v.play().catch(() => {}); else v.pause();
    };
    $('btnVideoRec').onclick = toggleRecord;
  }

  // Controle de visibilidade das seções conforme o modo
  function updateControlsVisibility() {
    const isMoldura = state.exportMode === 'molduraStory';
    const isCardOnly = state.exportMode === 'card';

    $('sectionMoldura').hidden = !isMoldura;
    $('sectionModelos').hidden = isMoldura;
    $('groupLogo').hidden = isCardOnly || isMoldura;
    // Moldura: chamada vai ao lado das setas e tem contato; balão: descrição e botão
    $('groupDesc').hidden = isMoldura;
    $('groupContact').hidden = !isMoldura;
    $('lblCta').textContent = isMoldura ? 'Chamada ao lado das setas' : 'Texto do botão';
    // Só o balão não usa foto: fica só a escolha do fundo
    $('photoStuff').hidden = isCardOnly;

    const HINTS = {
      molduraStory: 'Story 1080 × 1920 com a moldura oficial da DG.',
      story: 'Story 1080 × 1920 com foto, logo e balão do serviço.',
      feed: 'Post de feed 1080 × 1350 com foto, logo e balão.',
      card: 'Só o balão, sem fundo, para colar no Canva ou no Story.'
    };
    $('formatHint').textContent = HINTS[state.exportMode] || '';
  }

  // ==========================================================================
  // RENDERIZAÇÃO NO CANVAS
  // ==========================================================================
  let drawTimer = 0;
  function scheduleDraw() {
    clearTimeout(drawTimer);
    drawTimer = setTimeout(performDraw, 30);
  }

  function performDraw() {
    const opts = Object.assign({}, state, {
      molduraImage: state.molduraImages[state.molduraKey],
      balaoImage: state.balaoImages[state.model],
      hiddenLayers: hiddenFor(),
      layers: layersFor()
    });

    if (state.bgVideo && state.exportMode !== 'card') {
      // Vídeo: o primeiro plano (moldura/logo/balão) é desenhado uma vez e
      // reaproveitado; só o fundo é redesenhado a cada quadro do vídeo.
      render(fgCanvas, Object.assign({}, opts, { layerPass: 'fg', bgImage: null }));
      composeVideoFrame();
      startVideoLoop();
    } else {
      stopVideoLoop();
      render(canvas, opts);
      mirrorMini();
    }
    refreshLayerUI();

    // Atualiza metadados informativos
    const s = state.scale || 1;
    let modeLabel = 'Story 9:16';
    if (state.exportMode === 'feed') modeLabel = 'Feed 4:5';
    if (state.exportMode === 'card') modeLabel = 'Elemento PNG Transparente';
    if (state.exportMode === 'molduraStory') modeLabel = 'Story Moldura DG';

    metaEl.textContent = `${modeLabel} · Resolução: ${canvas.width} × ${canvas.height} px · PNG Alta Qualidade`;
  }

  // ==========================================================================
  // AÇÕES: COPIAR, BAIXAR E WHATSAPP
  // ==========================================================================
  function setupActionButtons() {
    // 1. Copiar PNG para a Área de Transferência
    $('btnCopy').onclick = async () => {
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          if (navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            showToast('✅ Imagem copiada! Cole no WhatsApp ou Instagram.');
          } else {
            showToast('⚠️ Navegador sem suporte à cópia direta. Baixe o PNG.');
          }
        }, 'image/png');
      } catch (err) {
        showToast('⚠️ Erro ao copiar imagem: ' + err.message);
      }
    };

    // 2. Baixar PNG em Alta Resolução
    $('btnDownload').onclick = () => {
      const slug = (state.title || 'servico')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const filename = `dg-${state.exportMode}-${slug}.png`;
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('📥 Download iniciado: ' + filename);
    };

    // 3. Modal WhatsApp
    $('btnWhatsApp').onclick = () => {
      const modal = $('modalWhatsApp');
      const img = $('modalPreviewImg');
      img.src = canvas.toDataURL('image/png');
      modal.classList.add('open');
    };

    const closeModal = () => $('modalWhatsApp').classList.remove('open');
    $('modalClose').onclick = closeModal;
    // Toque fora da folha ou Esc também fecham
    $('modalWhatsApp').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && $('modalWhatsApp').classList.contains('open')) closeModal();
    });

    $('modalShare').onclick = async () => {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'dg-servico.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: state.title + ' - DG Estética Automotiva',
              text: state.desc || 'Agende seu serviço na DG Estética Automotiva!'
            });
          } catch (e) {}
        } else {
          // Fallback para download no celular
          const link = document.createElement('a');
          link.download = 'dg-servico.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          showToast('Toque e segure a imagem para salvar e enviar no WhatsApp!');
        }
      }, 'image/png');
    };

    // 4. Geração em Lote
    $('btnBatchGo').onclick = () => {
      const raw = $('batchInput').value.trim();
      if (!raw) return;
      const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
      if (!lines.length) return;

      let idx = 0;
      function next() {
        if (idx >= lines.length) {
          showToast(`✅ Lote concluído! ${lines.length} imagens geradas.`);
          return;
        }
        const parts = lines[idx].split(';').map(p => p.trim());
        state.title = parts[0] || 'SERVIÇO';
        state.subtitle = parts[1] || '';
        state.desc = parts[2] || '';
        state.price = parts[3] || '';
        state.cta = parts[4] || 'AGENDE SEU SERVIÇO >>';

        performDraw();

        const slug = state.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const link = document.createElement('a');
        link.download = `dg-lote-${idx + 1}-${slug}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        idx++;
        setTimeout(next, 350);
      }
      next();
    };
  }

  // ==========================================================================
  // CELULAR: barra de seções, miniatura ao vivo da prévia e teclado aberto
  // ==========================================================================
  const phoneMQ = window.matchMedia('(max-width: 760px)');
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mini = $('miniPreview');
  const miniCanvas = $('miniCanvas');
  let stageVisible = true;
  let miniRaf = 0;

  // Copia o quadro atual do canvas principal para a miniatura (no máximo 1x por quadro)
  function mirrorMini() {
    if (!miniCanvas || !mini.classList.contains('show') || miniRaf) return;
    miniRaf = requestAnimationFrame(() => {
      miniRaf = 0;
      if (!canvas.width || !canvas.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(76 * dpr);
      const h = Math.round(w * canvas.height / canvas.width);
      if (miniCanvas.width !== w) miniCanvas.width = w;
      if (miniCanvas.height !== h) miniCanvas.height = h;
      const ctx = miniCanvas.getContext('2d');
      ctx.fillStyle = '#0B0B0C';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(canvas, 0, 0, w, h);
    });
  }

  function updateMini() {
    const show = phoneMQ.matches && !stageVisible;
    mini.classList.toggle('show', show);
    if (show) mirrorMini();
  }

  function scrollToSection(id) {
    const el = $(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMQ.matches ? 'auto' : 'smooth', block: 'start' });
  }

  function setupMobileNav() {
    const links = Array.from(document.querySelectorAll('#mobileNav a'));
    const setActive = (id) => links.forEach((a) => a.classList.toggle('active', a.dataset.target === id));

    links.forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        setActive(a.dataset.target);
        scrollToSection(a.dataset.target);
      });
    });
    mini.addEventListener('click', () => { setActive('secPrevia'); scrollToSection('secPrevia'); });

    if (!('IntersectionObserver' in window)) return;

    // Aba ativa = seção que cruza a faixa central da tela
    const visible = new Map();
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) visible.set(en.target.id, en.boundingClientRect.top);
        else visible.delete(en.target.id);
      });
      let best = null;
      visible.forEach((top, id) => { if (best === null || top > visible.get(best)) best = id; });
      if (best) setActive(best);
    }, { rootMargin: '-35% 0px -55% 0px' });
    links.forEach((a) => { const el = $(a.dataset.target); if (el) secObs.observe(el); });

    // Miniatura aparece quando a prévia sai da tela
    new IntersectionObserver((entries) => {
      stageVisible = entries[0].isIntersecting;
      updateMini();
    }, { threshold: 0.12 }).observe(viewport);

    const onMQ = () => updateMini();
    if (phoneMQ.addEventListener) phoneMQ.addEventListener('change', onMQ);
    else if (phoneMQ.addListener) phoneMQ.addListener(onMQ);

    // Teclado virtual aberto: a barra de seções sai do caminho
    const isField = (t) => t && (/^(TEXTAREA|SELECT)$/.test(t.tagName) ||
      (t.tagName === 'INPUT' && /^(text|number|search|email|tel|url)$/.test(t.type)));
    document.addEventListener('focusin', (e) => { if (isField(e.target)) document.body.classList.add('kbd-open'); });
    document.addEventListener('focusout', (e) => { if (isField(e.target)) document.body.classList.remove('kbd-open'); });
  }

  // Notificações Toast
  function showToast(msg) {
    let toast = $('toastNotification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotification';
      toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #1F2026;
        color: #FFFFFF;
        border: 1px solid #FF6A00;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 700;
        box-shadow: 0 10px 30px rgba(0,0,0,0.7);
        z-index: 100000;
        transition: opacity 0.3s ease, transform 0.3s ease;
        transform: translateY(10px);
        opacity: 0;
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.transform = 'translateY(10px)';
      toast.style.opacity = '0';
    }, 3200);
  }

  // Iniciar após carregar o DOM
  window.addEventListener('DOMContentLoaded', initUI);

})();
