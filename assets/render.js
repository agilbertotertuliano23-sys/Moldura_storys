/* ==========================================================================
   DG Estética Automotiva — Motor Gráfico do Gerador de Serviços e Preço
   Renderizador em Canvas 2D de alta fidelidade
   Suporta:
   - Enquadramento de qualquer foto de Story/Feed (Zoom, Pan X/Y, Véu, Desfoque)
   - Molduras oficiais DG de Storys (assets/molduras/*.png)
   - Balão de Aviso Clean (Referência oficial dos Storys)
   - Balão Dark Carbono, Balão "Você Sabia?", Faixa Slant e Selo Medalhão
   - Logotipo oficial DG no topo
   ========================================================================== */

(function (root) {
  'use strict';

  const DG = {};

  // Paleta oficial DG
  const BRAND = {
    laranja: '#FF6A00',
    laranjaClaro: '#FF8A2A',
    laranjaEscuro: '#D44800',
    laranjaNeon: '#FF5500',
    preto: '#0B0B0C',
    grafite: '#151518',
    grafiteCard: '#1C1C20',
    branco: '#FFFFFF',
    cromo: '#E9EDF2',
    cinzaClaro: '#D8DDE4',
    cinzaTexto: '#4A4E57',
    cinzaEscuro: '#2A2D34'
  };

  DG.BRAND = BRAND;

  // Modelos visuais do card/balão
  DG.MODELS = {
    balaoClean: {
      id: 'balaoClean',
      label: 'Balão de Aviso Clean',
      badge: 'OFICIAL STORYS',
      description: 'Card branco arredondado, insígnia circular no topo, brilho neon laranja e botão CTA.'
    },
    balaoDark: {
      id: 'balaoDark',
      label: 'Balão Dark Carbono',
      badge: 'ESPORTIVO',
      description: 'Card escuro em fibra de carbono, malha hexagonal, contorno neon e tipografia cromo.'
    },
    balaoDica: {
      id: 'balaoDica',
      label: 'Balão "Você Sabia?"',
      badge: 'NOTÍCIA / DICA',
      description: 'Balão de fala com cauda e tag de destaque para curiosidades e orientações.'
    },
    faixaSlant: {
      id: 'faixaSlant',
      label: 'Faixa Inclinada DG',
      badge: 'PROMOÇÃO',
      description: 'Faixa angular (-14°) em fibra de carbono e neon para ofertas de alto impacto.'
    },
    seloMedalhao: {
      id: 'seloMedalhao',
      label: 'Selo Medalhão DG',
      badge: 'CARIMBO',
      description: 'Medalhão circular para aplicar no canto das fotos com preço ou desconto.'
    }
  };

  // Molduras PNG disponíveis
  DG.MOLDURAS = {
    futurista: {
      id: 'futurista',
      label: 'Moldura Futurista com Logo',
      file: 'Moldura Automotiva Futurista com Logo.png',
      plate: { x: 30, y: 940, w: 840, h: 220 }
    },
    neon: {
      id: 'neon',
      label: 'Moldura Neon DG',
      file: 'Moldura Neon Automotiva DG.png',
      plate: { x: 530, y: 1370, w: 420, h: 100 }
    },
    laranjaPreta: {
      id: 'laranjaPreta',
      label: 'Moldura Laranja e Preta',
      file: 'Moldura Automotiva Laranja e Preta.png',
      plate: { x: 35, y: 920, w: 830, h: 220 }
    },
    redesSociais: {
      id: 'redesSociais',
      label: 'Moldura Neon Redes Sociais',
      file: 'Moldura Neon Laranja para Redes Sociais.png',
      plate: { x: 50, y: 930, w: 890, h: 230 }
    }
  };

  // Presets oficiais de serviços
  DG.PRESETS = {
    polimento: {
      title: 'POLIMENTO',
      subtitle: 'TÉCNICO',
      desc: 'Realce o brilho da pintura e reduza marcas superficiais.',
      price: '',
      oldPrice: '',
      cta: 'AGENDE SEU SERVIÇO >>',
      icon: 'politriz',
      model: 'balaoClean'
    },
    descontaminacao: {
      title: 'DESCONTAMINAÇÃO',
      subtitle: 'DE PINTURA',
      desc: 'Remove partículas metálicas, resíduos incrustados e impurezas que prejudicam o brilho.',
      price: '',
      oldPrice: '',
      cta: 'AGENDE SEU SERVIÇO >>',
      icon: 'camadas',
      model: 'balaoClean'
    },
    vitrificacao: {
      title: 'VITRIFICAÇÃO',
      subtitle: 'DE PINTURA',
      desc: 'Proteção de alta performance, mais brilho, repelência e durabilidade para a sua pintura.',
      price: '',
      oldPrice: '',
      cta: 'AGENDE SEU SERVIÇO >>',
      icon: 'escudo',
      model: 'balaoClean'
    },
    lavagem: {
      title: 'LAVAGEM',
      subtitle: 'T É C N I C A',
      desc: 'Limpeza profunda, segura e com os produtos ideais para preservar a pintura.',
      price: '',
      oldPrice: '',
      cta: 'AGENDE SEU SERVIÇO >>',
      icon: 'lavagem',
      model: 'balaoClean'
    },
    higienizacao: {
      title: 'HIGIENIZAÇÃO',
      subtitle: 'I N T E R N A',
      desc: 'Limpeza profunda de bancos, carpetes e estofados, com eliminação de odores e impurezas.',
      price: '',
      oldPrice: '',
      cta: 'AGENDE SEU SERVIÇO >>',
      icon: 'banco',
      model: 'balaoClean'
    },
    limpezaDetalhada: {
      title: 'LIMPEZA',
      subtitle: 'DETALHADA',
      desc: 'Atenção minuciosa a cada canto, grelhas, emblemas, caixas de rodas e acabamentos.',
      price: '',
      oldPrice: '',
      cta: 'AGENDE SEU SERVIÇO >>',
      icon: 'spray',
      model: 'balaoClean'
    },
    couroPlasticos: {
      title: 'PROTEÇÃO DE COURO',
      subtitle: 'E PLÁSTICOS',
      desc: 'Limpeza especializada, hidratação profunda e proteção contra ressecamento e raios UV.',
      price: '',
      oldPrice: '',
      cta: 'AGENDE SEU SERVIÇO >>',
      icon: 'banco',
      model: 'balaoClean'
    },
    dicaVoceSabia: {
      title: 'VOCÊ SABIA?',
      subtitle: 'ANATOMIA DA PINTURA',
      desc: 'O polimento atua somente no verniz. Por isso, medir a espessura antes do processo é indispensável!',
      price: '',
      oldPrice: '',
      cta: 'TIRE DÚVIDAS NO DIRECT >>',
      icon: 'dica',
      model: 'balaoDica'
    }
  };

  // Helper de desenho de cantos arredondados
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
      radius = Object.assign({ tl: 0, tr: 0, br: 0, bl: 0 }, radius);
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
  }

  // Trama de Fibra de Carbono esportiva para o canvas
  function drawCarbonPattern(ctx, x, y, w, h) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    
    ctx.fillStyle = '#141417';
    ctx.fillRect(x, y, w, h);

    const step = 14;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
    for (let py = y; py < y + h + step; py += step) {
      for (let px = x; px < x + w + step; px += step * 2) {
        const offset = ((Math.floor((py - y) / step) % 2) === 0) ? 0 : step;
        ctx.fillRect(px + offset, py, step * 0.9, step * 0.9);
      }
    }
    ctx.restore();
  }

  // Textura Hexagonal
  function drawHexGrid(ctx, x, y, w, h, strokeColor) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.strokeStyle = strokeColor || 'rgba(255, 106, 0, 0.12)';
    ctx.lineWidth = 1.2;

    const r = 24;
    const hStep = Math.sqrt(3) * r;
    for (let py = y - r; py < y + h + r * 2; py += hStep * 1.5) {
      for (let px = x - r; px < x + w + r * 2; px += r * 3) {
        drawSingleHex(ctx, px, py, r);
        drawSingleHex(ctx, px + r * 1.5, py + hStep * 0.75, r);
      }
    }
    ctx.restore();
  }

  function drawSingleHex(ctx, cx, cy, r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * 60) * Math.PI / 180;
      const hx = cx + r * Math.cos(a);
      const hy = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Ícones vetoriais desenhados com precisão
  DG.drawIcon = function (ctx, name, cx, cy, size, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = color || '#FFFFFF';
    ctx.fillStyle = color || '#FFFFFF';
    ctx.lineWidth = size * 0.075;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const s = size / 100;
    ctx.scale(s, s);

    switch (name) {
      case 'politriz':
        // Máquina politriz com empunhadura e boina
        ctx.beginPath();
        ctx.ellipse(0, 24, 38, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-34, 24);
        ctx.lineTo(-30, 12);
        ctx.lineTo(30, 12);
        ctx.lineTo(34, 24);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-22, 12);
        ctx.quadraticCurveTo(-24, -6, -14, -14);
        ctx.lineTo(12, -14);
        ctx.quadraticCurveTo(22, -6, 20, 12);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(8, -14);
        ctx.lineTo(38, -26);
        ctx.lineTo(44, -16);
        ctx.lineTo(14, -4);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 24, 46, -Math.PI * 0.75, -Math.PI * 0.25);
        ctx.stroke();
        break;

      case 'camadas':
        // 3 camadas inclinadas em perspectiva com estrelas de brilho
        for (let i = 0; i < 3; i++) {
          const dy = (i - 1) * 16;
          ctx.beginPath();
          ctx.moveTo(0, dy - 12);
          ctx.lineTo(28, dy);
          ctx.lineTo(0, dy + 12);
          ctx.lineTo(-28, dy);
          ctx.closePath();
          ctx.stroke();
        }
        drawSparkle(ctx, 22, -26, 12);
        drawSparkle(ctx, -24, 22, 8);
        break;

      case 'lavagem':
        // Frente de carro com espuma
        ctx.beginPath();
        ctx.moveTo(-18, -16);
        ctx.quadraticCurveTo(0, -22, 18, -16);
        ctx.lineTo(30, 0);
        ctx.lineTo(-30, 0);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-32, 0);
        ctx.lineTo(32, 0);
        ctx.quadraticCurveTo(34, 16, 26, 22);
        ctx.lineTo(-26, 22);
        ctx.quadraticCurveTo(-34, 16, -32, 0);
        ctx.closePath();
        ctx.stroke();
        // Faróis dianteiros
        ctx.beginPath();
        ctx.moveTo(-24, 5);
        ctx.lineTo(-14, 7);
        ctx.lineTo(-20, 13);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(24, 5);
        ctx.lineTo(14, 7);
        ctx.lineTo(20, 13);
        ctx.closePath();
        ctx.fill();
        // Bolhas de sabão
        ctx.beginPath();
        ctx.arc(-14, -28, 6, 0, Math.PI * 2);
        ctx.arc(0, -32, 8, 0, Math.PI * 2);
        ctx.arc(16, -26, 5, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'banco':
        // Banco ergonômico esportivo com brilho
        ctx.beginPath();
        ctx.moveTo(-16, -32);
        ctx.quadraticCurveTo(0, -34, 16, -32);
        ctx.lineTo(18, 6);
        ctx.quadraticCurveTo(0, 8, -18, 6);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-10, -42);
        ctx.quadraticCurveTo(0, -44, 10, -42);
        ctx.lineTo(8, -35);
        ctx.lineTo(-8, -35);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-24, 12);
        ctx.quadraticCurveTo(0, 8, 24, 12);
        ctx.lineTo(26, 26);
        ctx.quadraticCurveTo(0, 32, -26, 26);
        ctx.closePath();
        ctx.stroke();
        drawSparkle(ctx, 28, -16, 11);
        break;

      case 'escudo':
        // Escudo de proteção com gota
        ctx.beginPath();
        ctx.moveTo(0, -36);
        ctx.lineTo(26, -24);
        ctx.lineTo(26, 6);
        ctx.quadraticCurveTo(24, 30, 0, 40);
        ctx.quadraticCurveTo(-24, 30, -26, 6);
        ctx.lineTo(-26, -24);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.quadraticCurveTo(12, 4, 12, 12);
        ctx.arc(0, 12, 12, 0, Math.PI);
        ctx.quadraticCurveTo(-12, 4, 0, -14);
        ctx.closePath();
        ctx.fill();
        break;

      case 'spray':
        // Frasco borrifador
        ctx.beginPath();
        ctx.moveTo(-16, 4);
        ctx.lineTo(-20, 36);
        ctx.quadraticCurveTo(0, 40, 20, 36);
        ctx.lineTo(16, 4);
        ctx.closePath();
        ctx.stroke();
        ctx.strokeRect(-8, -10, 16, 14);
        ctx.beginPath();
        ctx.moveTo(-8, -10);
        ctx.lineTo(-26, -14);
        ctx.lineTo(-26, -22);
        ctx.lineTo(10, -22);
        ctx.lineTo(18, -10);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-36, -18, 2, 0, Math.PI * 2);
        ctx.arc(-42, -24, 2, 0, Math.PI * 2);
        ctx.arc(-44, -12, 2.5, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'roda':
        // Roda esportiva
        ctx.beginPath();
        ctx.arc(0, 0, 36, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < 5; i++) {
          const a = (i * 72) * Math.PI / 180;
          ctx.beginPath();
          ctx.moveTo(Math.cos(a) * 12, Math.sin(a) * 12);
          ctx.lineTo(Math.cos(a) * 36, Math.sin(a) * 36);
          ctx.stroke();
        }
        break;

      case 'dica':
        // Lâmpada de dica
        ctx.beginPath();
        ctx.arc(0, -10, 20, Math.PI * 0.75, Math.PI * 0.25, true);
        ctx.lineTo(10, 16);
        ctx.lineTo(-10, 16);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-8, 22);
        ctx.lineTo(8, 22);
        ctx.moveTo(-5, 28);
        ctx.lineTo(5, 28);
        ctx.stroke();
        drawSparkle(ctx, -26, -26, 8);
        drawSparkle(ctx, 26, -26, 8);
        break;

      default:
        drawSparkle(ctx, 0, 0, 32);
        break;
    }

    ctx.restore();
  };

  function drawSparkle(ctx, x, y, r) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.quadraticCurveTo(0, 0, 0, r);
    ctx.quadraticCurveTo(0, 0, -r, 0);
    ctx.quadraticCurveTo(0, 0, 0, -r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function wrapText(ctx, text, maxWidth) {
    const words = String(text || '').trim().split(/\s+/);
    if (!words.length || !words[0]) return [];
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + ' ' + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  /* ========================================================================
     CAMADAS MANIPULÁVEIS
     L() aplica o deslocamento/escala guardado em opts.layers[key] ao bloco
     desenhado por fn e registra a área clicável (em coordenadas lógicas).
     fn deve devolver a caixa {x,y,w,h} do elemento no seu espaço local.
     ======================================================================== */
  function L(ctx, opts, key, pivot, fn) {
    const lay = (opts.layers && opts.layers[key]) || null;
    const dx = lay ? Number(lay.dx) || 0 : 0;
    const dy = lay ? Number(lay.dy) || 0 : 0;
    const s = lay && Number(lay.s) > 0 ? Number(lay.s) : 1;
    const sc = opts._scale || 1;
    ctx.save();
    ctx.translate(dx, dy);
    const p = ctx.getTransform();
    const det = (p.a * p.d - p.b * p.c) / (sc * sc) || 1;
    // inversa da parte linear do pai (lógico -> local do pai)
    const inv = [p.d / sc / det, -p.b / sc / det, -p.c / sc / det, p.a / sc / det];
    ctx.translate(pivot.x, pivot.y);
    ctx.scale(s, s);
    ctx.translate(-pivot.x, -pivot.y);
    const m = ctx.getTransform();
    opts._depth = (opts._depth || 0) + 1;
    const depth = opts._depth;
    let b;
    try {
      b = fn();
    } finally {
      opts._depth--;
      ctx.restore();
    }
    if (b && opts._hits) {
      const pts = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]].map((q) => ({
        x: (m.a * q[0] + m.c * q[1] + m.e) / sc,
        y: (m.b * q[0] + m.d * q[1] + m.f) / sc
      }));
      const xs = pts.map((q) => q.x), ys = pts.map((q) => q.y);
      opts._hits.push({
        key: key,
        depth: depth,
        x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys),
        x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys),
        px: (m.a * pivot.x + m.c * pivot.y + m.e) / sc,
        py: (m.b * pivot.x + m.d * pivot.y + m.f) / sc,
        inv: inv
      });
    }
    return b;
  }

  DG.LAYER_LABELS = {
    card: 'Balão / caixa',
    badge: 'Insígnia (ícone)',
    tag: 'Etiqueta',
    title: 'Título',
    subtitle: 'Subtítulo',
    desc: 'Descrição',
    price: 'Preço',
    cta: 'Botão (CTA)',
    logo: 'Logotipo'
  };


  /* ========================================================================
     RENDERIZADOR 1: Balão de Aviso Clean (Referência Oficial dos Stories)
     ======================================================================== */
  function renderBalaoClean(ctx, x, y, w, h, opts) {
    return L(ctx, opts, 'card', { x: x + w / 2, y: y + h / 2 }, () => {
      drawBalaoClean(ctx, x, y, w, h, opts);
      return { x: x - 8, y: y - 70, w: w + 16, h: h + 78 };
    });
  }

  function drawBalaoClean(ctx, x, y, w, h, opts) {
    const color = opts.color || BRAND.laranja;
    const cardRadius = 38;
    const badgeR = 68; // Insígnia no topo
    const badgeY = y; // Centro vertical da insígnia na borda superior

    ctx.save();

    // 1. AURA EXTERNA NEON LARANJA (Multi-camadas de glow de alta densidade)
    if (opts.glow !== false) {
      ctx.save();
      // Glow amplo
      ctx.shadowColor = color;
      ctx.shadowBlur = 54;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 12;
      ctx.fillStyle = 'rgba(255, 106, 0, 0.22)';
      drawRoundedRect(ctx, x - 5, y - 5, w + 10, h + 10, cardRadius + 5);
      ctx.fill();

      // Glow concentrado
      ctx.shadowBlur = 24;
      ctx.fillStyle = 'rgba(255, 106, 0, 0.45)';
      drawRoundedRect(ctx, x - 2, y - 2, w + 4, h + 4, cardRadius + 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. CORPO DO CARD BRANCO COM DEGRADÊ SUAVE ACETINADO
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 18;

    const bgGrad = ctx.createLinearGradient(x, y, x, y + h);
    bgGrad.addColorStop(0, '#FFFFFF');
    bgGrad.addColorStop(0.7, '#FCFCFD');
    bgGrad.addColorStop(1, '#F2F4F7');
    ctx.fillStyle = bgGrad;

    drawRoundedRect(ctx, x, y, w, h, cardRadius);
    ctx.fill();
    ctx.restore();

    // Borda neon externa em laranja DG
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, x, y, w, h, cardRadius);
    ctx.stroke();

    // Borda interna de reflexo fino
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 1.8;
    drawRoundedRect(ctx, x + 2, y + 2, w - 4, h - 4, cardRadius - 2);
    ctx.stroke();
    ctx.restore();

    // 3. INSÍGNIA CIRCULAR SUPERIOR FLUTUANTE
    const badgeX = x + w / 2;
    L(ctx, opts, 'badge', { x: badgeX, y: badgeY }, () => {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 34;
    ctx.shadowOffsetY = 4;

    const badgeGrad = ctx.createRadialGradient(badgeX - 16, badgeY - 16, 10, badgeX, badgeY, badgeR);
    badgeGrad.addColorStop(0, '#FF8E33');
    badgeGrad.addColorStop(0.55, color);
    badgeGrad.addColorStop(1, '#D83D00');
    ctx.fillStyle = badgeGrad;

    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.fill();

    // Borda dupla da insígnia (anel branco + anel laranja)
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 106, 0, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR - 5, 0, Math.PI * 2);
    ctx.stroke();

    // Ícone vetorizado branco dentro da insígnia
    DG.drawIcon(ctx, opts.icon || 'politriz', badgeX, badgeY, badgeR * 1.15, '#FFFFFF');
    ctx.restore();
    return { x: badgeX - badgeR, y: badgeY - badgeR, w: badgeR * 2, h: badgeR * 2 };
    });

    // 4. CONTEÚDO DO CARD
    const contentW = w - 70;
    const contentX = x + w / 2;
    let curY = y + badgeR + 24;

    // TÍTULO PRINCIPAL (Ex: "DESCONTAMINAÇÃO" / "POLIMENTO")
    let titleFs = 54;
    let tw = contentW;
    const titleTop = curY;
    L(ctx, opts, 'title', { x: contentX, y: titleTop + 30 }, () => {
    ctx.save();
    ctx.fillStyle = BRAND.preto;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '900 italic 54px "Poppins", "Exo 2", sans-serif';

    titleFs = 54;
    let titleMetrics = ctx.measureText(opts.title || 'SERVIÇO');
    while (titleMetrics.width > contentW && titleFs > 30) {
      titleFs -= 2;
      ctx.font = `900 italic ${titleFs}px "Poppins", "Exo 2", sans-serif`;
      titleMetrics = ctx.measureText(opts.title || 'SERVIÇO');
    }
    tw = ctx.measureText((opts.title || 'SERVIÇO').toUpperCase()).width;
    ctx.fillText((opts.title || 'SERVIÇO').toUpperCase(), contentX, curY);
    curY += titleFs + 12;
    ctx.restore();
    return { x: contentX - tw / 2, y: titleTop, w: tw, h: titleFs };
    });

    // SUBTÍTULO COM TRAÇOS FLANQUEADOS (Ex: "— DE PINTURA —")
    if (opts.subtitle) {
      const subTop = curY;
      let sbW = contentW;
      L(ctx, opts, 'subtitle', { x: contentX, y: subTop + 14 }, () => {
      ctx.save();
      const subText = opts.subtitle.trim().toUpperCase();
      const subFs = Math.max(22, Math.min(28, Math.round(titleFs * 0.48)));
      ctx.font = `800 italic ${subFs}px "Poppins", "Exo 2", sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const subW = ctx.measureText(subText).width;
      const lineWidth = Math.max(34, Math.min(90, (contentW - subW - 36) / 2));
      const lineY = curY + subFs / 2;
      sbW = subW + 2 * (18 + lineWidth);

      ctx.strokeStyle = color;
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(contentX - subW / 2 - 18 - lineWidth, lineY);
      ctx.lineTo(contentX - subW / 2 - 18, lineY);
      ctx.stroke();

      ctx.fillText(subText, contentX, lineY);

      ctx.beginPath();
      ctx.moveTo(contentX + subW / 2 + 18, lineY);
      ctx.lineTo(contentX + subW / 2 + 18 + lineWidth, lineY);
      ctx.stroke();

      curY += subFs + 20;
      ctx.restore();
      return { x: contentX - sbW / 2, y: subTop - 2, w: sbW, h: 34 };
      });
    } else {
      curY += 8;
    }

    // CORPO / DESCRIÇÃO (Itálico moderno)
    if (opts.desc) {
      const descTop = curY;
      let descW = contentW - 24, descH = 38;
      L(ctx, opts, 'desc', { x: contentX, y: descTop + 19 }, () => {
      ctx.save();
      ctx.font = '600 italic 28px "Poppins", "Exo 2", sans-serif';
      ctx.fillStyle = BRAND.cinzaTexto;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const descLines = wrapText(ctx, opts.desc, contentW - 24);
      descW = Math.max(60, ...descLines.map((l) => ctx.measureText(l).width)); descH = descLines.length * 38;
      const lineHeight = 38;
      for (let i = 0; i < descLines.length; i++) {
        ctx.fillText(descLines[i], contentX, curY + (i * lineHeight));
      }
      curY += (descLines.length * lineHeight) + 14;
      ctx.restore();
      return { x: contentX - descW / 2, y: descTop, w: descW, h: descH };
      });
    }

    // PREÇO OPCIONAL
    if (opts.price) {
      const priceTop = curY;
      let priceW = 300;
      L(ctx, opts, 'price', { x: contentX, y: priceTop + 22 }, () => {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      if (opts.oldPrice) {
        ctx.font = '600 italic 20px "Poppins", "Exo 2", sans-serif';
        ctx.fillStyle = '#8A8F99';
        const oldW = ctx.measureText('De ' + opts.oldPrice).width;
        ctx.fillText('De ' + opts.oldPrice, contentX, curY);
        ctx.strokeStyle = '#D44800';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(contentX - oldW / 2 - 4, curY + 11);
        ctx.lineTo(contentX + oldW / 2 + 4, curY + 11);
        ctx.stroke();
        curY += 24;
      }

      ctx.font = '900 italic 38px "Poppins", "Exo 2", sans-serif';
      ctx.fillStyle = color;
      priceW = Math.max(140, ctx.measureText(opts.price).width);
      ctx.fillText(opts.price, contentX, curY);
      curY += 46;
      ctx.restore();
      return { x: contentX - priceW / 2, y: priceTop, w: priceW, h: opts.oldPrice ? 70 : 46 };
      });
    }

    // BOTÃO CTA COM BRILHO NEON
    const btnW = w - 64;
    const btnH = 82;
    const btnX = x + 32;
    const btnY = y + h - btnH - 28;

    L(ctx, opts, 'cta', { x: btnX + btnW / 2, y: btnY + btnH / 2 }, () => {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 8;

    const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY);
    btnGrad.addColorStop(0, '#FF851B');
    btnGrad.addColorStop(0.35, color);
    btnGrad.addColorStop(1, '#E64700');
    ctx.fillStyle = btnGrad;

    drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 24);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(btnX + 24, btnY + 2);
    ctx.lineTo(btnX + btnW - 24, btnY + 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 italic 31px "Poppins", "Exo 2", sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillText(opts.cta || 'AGENDE SEU SERVIÇO >>', btnX + btnW / 2, btnY + btnH / 2);
    ctx.restore();
    return { x: btnX - 6, y: btnY - 6, w: btnW + 12, h: btnH + 12 };
    });

    ctx.restore();
  }

  /* ========================================================================
     RENDERIZADOR 2: Balão Dark Carbono (Identidade Esportiva DG)
     ======================================================================== */
  function renderBalaoDark(ctx, x, y, w, h, opts) {
    return L(ctx, opts, 'card', { x: x + w / 2, y: y + h / 2 }, () => {
      drawBalaoDark(ctx, x, y, w, h, opts);
      return { x: x - 8, y: y - 66, w: w + 16, h: h + 74 };
    });
  }

  function drawBalaoDark(ctx, x, y, w, h, opts) {
    const color = opts.color || BRAND.laranja;
    const cardRadius = 36;
    const badgeR = 64;
    const badgeX = x + w / 2;
    const badgeY = y;

    ctx.save();

    if (opts.glow !== false) {
      ctx.save();
      ctx.shadowColor = color;
      ctx.shadowBlur = 50;
      ctx.fillStyle = 'rgba(255, 106, 0, 0.2)';
      drawRoundedRect(ctx, x - 2, y - 2, w + 4, h + 4, cardRadius + 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 36;
    ctx.shadowOffsetY = 18;

    drawRoundedRect(ctx, x, y, w, h, cardRadius);
    ctx.fillStyle = '#111114';
    ctx.fill();
    ctx.clip();

    drawCarbonPattern(ctx, x, y, w, h);
    drawHexGrid(ctx, x, y, w, h, 'rgba(255, 106, 0, 0.08)');
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3.5;
    drawRoundedRect(ctx, x, y, w, h, cardRadius);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 106, 0, 0.3)';
    ctx.lineWidth = 1.5;
    drawRoundedRect(ctx, x + 5, y + 5, w - 10, h - 10, cardRadius - 5);
    ctx.stroke();
    ctx.restore();

    L(ctx, opts, 'badge', { x: badgeX, y: badgeY }, () => {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 32;
    const bGrad = ctx.createLinearGradient(badgeX - badgeR, badgeY - badgeR, badgeX + badgeR, badgeY + badgeR);
    bGrad.addColorStop(0, '#FF8A2A');
    bGrad.addColorStop(1, '#D84300');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    DG.drawIcon(ctx, opts.icon || 'politriz', badgeX, badgeY, badgeR * 1.15, '#FFFFFF');
    ctx.restore();
    return { x: badgeX - badgeR, y: badgeY - badgeR, w: badgeR * 2, h: badgeR * 2 };
    });

    const contentW = w - 70;
    const contentX = x + w / 2;
    let curY = y + badgeR + 32;

    let titleFs = 54;
    let tw = contentW;
    const titleTop = curY;
    L(ctx, opts, 'title', { x: contentX, y: titleTop + 30 }, () => {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '900 italic 54px "Poppins", "Exo 2", sans-serif';

    titleFs = 54;
    let tMet = ctx.measureText(opts.title || 'SERVIÇO');
    while (tMet.width > contentW && titleFs > 30) {
      titleFs -= 2;
      ctx.font = `900 italic ${titleFs}px "Poppins", "Exo 2", sans-serif`;
      tMet = ctx.measureText(opts.title || 'SERVIÇO');
    }
    tw = ctx.measureText((opts.title || 'SERVIÇO').toUpperCase()).width;

    const cromoGrad = ctx.createLinearGradient(contentX - 100, curY, contentX + 100, curY + titleFs);
    cromoGrad.addColorStop(0, '#FFFFFF');
    cromoGrad.addColorStop(0.5, '#E2E6EC');
    cromoGrad.addColorStop(1, '#B0B6C2');
    ctx.fillStyle = cromoGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 12;
    ctx.fillText((opts.title || 'SERVIÇO').toUpperCase(), contentX, curY);
    curY += titleFs + 16;
    ctx.restore();
    return { x: contentX - tw / 2, y: titleTop, w: tw, h: titleFs };
    });

    if (opts.subtitle) {
      const subTop = curY;
      let sbW = contentW;
      L(ctx, opts, 'subtitle', { x: contentX, y: subTop + 14 }, () => {
      ctx.save();
      const subText = opts.subtitle.trim().toUpperCase();
      const subFs = Math.max(22, Math.min(28, Math.round(titleFs * 0.48)));
      ctx.font = `800 italic ${subFs}px "Poppins", "Exo 2", sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const subW = ctx.measureText(subText).width;
      const lineWidth = Math.max(34, Math.min(80, (contentW - subW - 40) / 2));
      const lineY = curY + subFs / 2;
      sbW = subW + 2 * (20 + lineWidth);

      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(contentX - subW / 2 - 20 - lineWidth, lineY);
      ctx.lineTo(contentX - subW / 2 - 20, lineY);
      ctx.stroke();

      ctx.fillText(subText, contentX, lineY);

      ctx.beginPath();
      ctx.moveTo(contentX + subW / 2 + 20, lineY);
      ctx.lineTo(contentX + subW / 2 + 20 + lineWidth, lineY);
      ctx.stroke();

      curY += subFs + 26;
      ctx.restore();
      return { x: contentX - sbW / 2, y: subTop - 2, w: sbW, h: 34 };
      });
    } else {
      curY += 12;
    }

    if (opts.desc) {
      const descTop = curY;
      let descW = contentW - 20, descH = 38;
      L(ctx, opts, 'desc', { x: contentX, y: descTop + 19 }, () => {
      ctx.save();
      ctx.font = '600 italic 28px "Poppins", "Exo 2", sans-serif';
      ctx.fillStyle = '#D4D8E0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const descLines = wrapText(ctx, opts.desc, contentW - 20);
      descW = Math.max(60, ...descLines.map((l) => ctx.measureText(l).width)); descH = descLines.length * 38;
      const lineHeight = 38;
      for (let i = 0; i < descLines.length; i++) {
        ctx.fillText(descLines[i], contentX, curY + (i * lineHeight));
      }
      curY += (descLines.length * lineHeight) + 20;
      ctx.restore();
      return { x: contentX - descW / 2, y: descTop, w: descW, h: descH };
      });
    }

    if (opts.price) {
      const priceTop = curY;
      let priceW = 300;
      L(ctx, opts, 'price', { x: contentX, y: priceTop + 22 }, () => {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      if (opts.oldPrice) {
        ctx.font = '600 italic 20px "Poppins", "Exo 2", sans-serif';
        ctx.fillStyle = '#7E8592';
        ctx.fillText('De ' + opts.oldPrice, contentX, curY);
        curY += 24;
      }

      ctx.font = '900 italic 36px "Poppins", "Exo 2", sans-serif';
      ctx.fillStyle = color;
      priceW = Math.max(140, ctx.measureText(opts.price).width);
      ctx.fillText(opts.price, contentX, curY);
      curY += 44;
      ctx.restore();
      return { x: contentX - priceW / 2, y: priceTop, w: priceW, h: opts.oldPrice ? 70 : 46 };
      });
    }

    const btnW = w - 68;
    const btnH = 78;
    const btnX = x + 34;
    const btnY = y + h - btnH - 32;

    L(ctx, opts, 'cta', { x: btnX + btnW / 2, y: btnY + btnH / 2 }, () => {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 28;
    ctx.shadowOffsetY = 6;

    const btnGrad = ctx.createLinearGradient(btnX, btnY, btnX + btnW, btnY);
    btnGrad.addColorStop(0, '#FF851B');
    btnGrad.addColorStop(1, '#D83D00');
    ctx.fillStyle = btnGrad;

    drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 22);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 italic 30px "Poppins", "Exo 2", sans-serif';
    ctx.fillText(opts.cta || 'AGENDE SEU SERVIÇO >>', btnX + btnW / 2, btnY + btnH / 2);
    ctx.restore();
    return { x: btnX - 6, y: btnY - 6, w: btnW + 12, h: btnH + 12 };
    });

    ctx.restore();
  }

  /* ========================================================================
     RENDERIZADOR 3: Balão de Dica / Quadrinho ("Você Sabia?")
     ======================================================================== */
  function renderBalaoDica(ctx, x, y, w, h, opts) {
    return L(ctx, opts, 'card', { x: x + w / 2, y: y + h / 2 }, () => {
      drawBalaoDica(ctx, x, y, w, h, opts);
      return { x: x - 8, y: y - 28, w: w + 16, h: h + 34 };
    });
  }

  function drawBalaoDica(ctx, x, y, w, h, opts) {
    const color = opts.color || BRAND.laranja;
    const cardRadius = 32;
    const tailW = 38;
    const tailH = 28;

    ctx.save();

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 14;

    ctx.beginPath();
    drawRoundedRect(ctx, x, y, w, h - tailH, cardRadius);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 50, y + h - tailH - 2);
    ctx.lineTo(x + 50 + tailW, y + h - tailH - 2);
    ctx.lineTo(x + 36, y + h);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = color;
    ctx.lineWidth = 3.5;
    drawRoundedRect(ctx, x, y, w, h - tailH, cardRadius);
    ctx.stroke();

    const tagW = 220;
    const tagH = 44;
    const tagX = x + 34;
    const tagY = y - 22;

    L(ctx, opts, 'tag', { x: tagX + tagW / 2, y: tagY + tagH / 2 }, () => {
    ctx.save();
    ctx.fillStyle = color;
    drawRoundedRect(ctx, tagX, tagY, tagW, tagH, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 italic 20px "Poppins", "Exo 2", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('💡 ' + (opts.subtitle || 'VOCÊ SABIA?'), tagX + tagW / 2, tagY + tagH / 2);
    ctx.restore();
    return { x: tagX, y: tagY, w: tagW, h: tagH };
    });

    const contentX = x + w / 2;
    let curY = y + 46;

    let tw = 400;
    const titleTop = curY;
    L(ctx, opts, 'title', { x: contentX, y: titleTop + 24 }, () => {
    ctx.save();
    ctx.font = '900 italic 48px "Poppins", "Exo 2", sans-serif';
    tw = ctx.measureText((opts.title || 'DICA AUTOMOTIVA').toUpperCase()).width;
    ctx.fillStyle = BRAND.preto;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText((opts.title || 'DICA AUTOMOTIVA').toUpperCase(), contentX, curY);
    curY += 60;
    ctx.restore();
    return { x: contentX - tw / 2, y: titleTop, w: tw, h: 52 };
    });

    if (opts.desc) {
      const descTop = curY;
      let descW = w - 80, descH = 38;
      L(ctx, opts, 'desc', { x: contentX, y: descTop + 19 }, () => {
      ctx.save();
      ctx.font = '600 italic 26px "Poppins", "Exo 2", sans-serif';
      ctx.fillStyle = BRAND.cinzaTexto;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const lines = wrapText(ctx, opts.desc, w - 80);
      descW = Math.max(60, ...lines.map((l) => ctx.measureText(l).width)); descH = lines.length * 38;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], contentX, curY + (i * 38));
      }
      curY += lines.length * 38 + 20;
      ctx.restore();
      return { x: contentX - descW / 2, y: descTop, w: descW, h: descH };
      });
    }

    const btnW = w - 68;
    const btnH = 68;
    const btnX = x + 34;
    const btnY = y + h - tailH - btnH - 24;

    L(ctx, opts, 'cta', { x: btnX + btnW / 2, y: btnY + btnH / 2 }, () => {
    ctx.save();
    ctx.fillStyle = color;
    drawRoundedRect(ctx, btnX, btnY, btnW, btnH, 18);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 italic 26px "Poppins", "Exo 2", sans-serif';
    ctx.fillText(opts.cta || 'FALE COM UM ESPECIALISTA >>', btnX + btnW / 2, btnY + btnH / 2);
    ctx.restore();
    return { x: btnX - 6, y: btnY - 6, w: btnW + 12, h: btnH + 12 };
    });

    ctx.restore();
  }

  /* ========================================================================
     RENDERIZADOR 4: Faixa Inclinada DG (Slant -14°)
     ======================================================================== */
  function renderFaixaSlant(ctx, x, y, w, h, opts) {
    return L(ctx, opts, 'card', { x: x + w / 2, y: y + h / 2 }, () => {
      drawFaixaSlant(ctx, x, y, w, h, opts);
      const fh = Math.min(h - 40, 360);
      return { x: x + 20, y: y + h / 2 - fh / 2 - 10, w: w - 40, h: fh + 20 };
    });
  }

  function drawFaixaSlant(ctx, x, y, w, h, opts) {
    const color = opts.color || BRAND.laranja;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.transform(1, 0, Math.tan(-14 * Math.PI / 180), 1, 0, 0);

    const fw = w - 60;
    const fh = Math.min(h - 40, 360);
    const fx = -fw / 2;
    const fy = -fh / 2;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 16;

    ctx.fillStyle = '#141416';
    ctx.fillRect(fx, fy, fw, fh);
    drawCarbonPattern(ctx, fx, fy, fw, fh);

    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillStyle = color;
    ctx.fillRect(fx, fy, fw, 10);
    ctx.fillRect(fx, fy + fh - 10, fw, 10);

    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    L(ctx, opts, 'title', { x: 0, y: fy + 62 }, () => {
    ctx.font = '900 italic 48px "Poppins", "Exo 2", sans-serif';
    const tw = ctx.measureText((opts.title || 'OFERTA DG').toUpperCase()).width;
    ctx.fillText((opts.title || 'OFERTA DG').toUpperCase(), 0, fy + 38);
    return { x: -tw / 2, y: fy + 38, w: tw, h: 52 };
    });

    if (opts.subtitle) {
      L(ctx, opts, 'subtitle', { x: 0, y: fy + 112 }, () => {
      ctx.fillStyle = color;
      ctx.font = '800 italic 26px "Poppins", "Exo 2", sans-serif';
      ctx.fillText(opts.subtitle.toUpperCase(), 0, fy + 98);
      const sw = ctx.measureText(opts.subtitle.toUpperCase()).width;
      return { x: -sw / 2, y: fy + 98, w: sw, h: 30 };
      });
    }

    if (opts.price) {
      L(ctx, opts, 'price', { x: 0, y: fy + 176 }, () => {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 italic 56px "Poppins", "Exo 2", sans-serif';
      ctx.fillText(opts.price, 0, fy + 148);
      const pw = ctx.measureText(opts.price).width;
      return { x: -pw / 2, y: fy + 148, w: pw, h: 60 };
      });
    }

    if (opts.cta) {
      L(ctx, opts, 'cta', { x: 0, y: fy + fh - 45 }, () => {
      ctx.fillStyle = color;
      ctx.fillRect(-fw * 0.4, fy + fh - 70, fw * 0.8, 50);
      ctx.fillStyle = '#0B0B0C';
      ctx.font = '900 italic 24px "Poppins", "Exo 2", sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText(opts.cta, 0, fy + fh - 45);
      return { x: -fw * 0.4, y: fy + fh - 70, w: fw * 0.8, h: 50 };
      });
    }

    ctx.restore();
  }

  /* ========================================================================
     RENDERIZADOR 5: Selo Medalhão Redondo DG
     ======================================================================== */
  function renderSeloMedalhao(ctx, cx, cy, radius, opts) {
    return L(ctx, opts, 'card', { x: cx, y: cy }, () => {
      drawSeloMedalhao(ctx, cx, cy, radius, opts);
      return { x: cx - radius - 8, y: cy - radius - 8, w: radius * 2 + 16, h: radius * 2 + 16 };
    });
  }

  function drawSeloMedalhao(ctx, cx, cy, radius, opts) {
    const color = opts.color || BRAND.laranja;
    ctx.save();
    ctx.translate(cx, cy);

    ctx.shadowColor = color;
    ctx.shadowBlur = 36;

    const grad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, radius * 0.1, 0, 0, radius);
    grad.addColorStop(0, '#FF8A2A');
    grad.addColorStop(0.6, color);
    grad.addColorStop(1, '#D83D00');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    L(ctx, opts, 'title', { x: 0, y: -radius * 0.35 }, () => {
    ctx.font = '900 italic 28px "Poppins", "Exo 2", sans-serif';
    const tw = ctx.measureText((opts.title || 'ESPECIAL').toUpperCase()).width;
    ctx.fillText((opts.title || 'ESPECIAL').toUpperCase(), 0, -radius * 0.35);
    return { x: -tw / 2, y: -radius * 0.35 - 18, w: tw, h: 36 };
    });

    L(ctx, opts, 'price', { x: 0, y: 0 }, () => {
    if (opts.price) {
      ctx.font = '900 italic 46px "Poppins", "Exo 2", sans-serif';
      ctx.fillText(opts.price, 0, 0);
    } else {
      ctx.font = '800 italic 24px "Poppins", "Exo 2", sans-serif';
      ctx.fillText((opts.subtitle || 'DG ESTÉTICA').toUpperCase(), 0, 0);
    }
    return { x: -radius * 0.7, y: -28, w: radius * 1.4, h: 56 };
    });

    L(ctx, opts, 'cta', { x: 0, y: radius * 0.42 }, () => {
    ctx.font = '800 italic 20px "Poppins", "Exo 2", sans-serif';
    ctx.fillText(opts.cta || 'APROVEITE', 0, radius * 0.42);
    const cw = ctx.measureText(opts.cta || 'APROVEITE').width;
    return { x: -cw / 2, y: radius * 0.42 - 16, w: cw, h: 32 };
    });

    ctx.restore();
  }

  /* ========================================================================
     RENDERIZADOR 6: MOLDURA OFICIAL DG COM TEXTO
     Aplica as molduras de storys molduras/*.png com encaixe na placa!
     ======================================================================== */
  function renderMolduraComTexto(ctx, W, H, opts) {
    if (!opts.molduraImage || !opts.molduraImage.complete || !opts.molduraImage.naturalWidth) {
      return;
    }

    const mImg = opts.molduraImage;
    const molduraKey = opts.molduraKey || 'futurista';
    const molduraDef = DG.MOLDURAS[molduraKey] || DG.MOLDURAS.futurista;

    // 1. Desenha a moldura cobrindo o canvas
    ctx.save();
    ctx.drawImage(mImg, 0, 0, W, H);
    ctx.restore();

    // 2. Renderiza os textos na placa da moldura
    const scaleX = W / mImg.naturalWidth;
    const scaleY = H / mImg.naturalHeight;
    const plate = molduraDef.plate;

    const px = plate.x * scaleX;
    const py = plate.y * scaleY;
    const pw = plate.w * scaleX;
    const ph = plate.h * scaleY;

    const cx = px + pw / 2;
    const cy = py + ph / 2;

    ctx.save();
    // Título dentro da placa
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let curY = cy;
    if (opts.subtitle || opts.desc || opts.price) {
      curY = cy - 25;
    }

    ctx.font = '900 italic 44px "Poppins", "Exo 2", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;

    L(ctx, opts, 'title', { x: cx, y: curY }, () => {
    let titleFs = 44;
    while (ctx.measureText(opts.title || 'SERVIÇO').width > pw - 40 && titleFs > 24) {
      titleFs -= 2;
      ctx.font = `900 italic ${titleFs}px "Poppins", "Exo 2", sans-serif`;
    }
    const tw = ctx.measureText((opts.title || 'SERVIÇO').toUpperCase()).width;
    ctx.fillText((opts.title || 'SERVIÇO').toUpperCase(), cx, curY);
    return { x: cx - tw / 2, y: curY - titleFs / 2, w: tw, h: titleFs };
    });

    // Subtítulo ou Preço na linha de baixo
    if (opts.price) {
      L(ctx, opts, 'price', { x: cx, y: curY + 48 }, () => {
      ctx.font = '900 italic 36px "Poppins", "Exo 2", sans-serif';
      ctx.fillStyle = opts.color || BRAND.laranja;
      ctx.fillText(opts.price, cx, curY + 48);
      const pw = ctx.measureText(opts.price).width;
      return { x: cx - pw / 2, y: curY + 48 - 22, w: pw, h: 44 };
      });
    } else if (opts.subtitle) {
      L(ctx, opts, 'subtitle', { x: cx, y: curY + 44 }, () => {
      ctx.font = '800 italic 24px "Poppins", "Exo 2", sans-serif';
      ctx.fillStyle = opts.color || BRAND.laranja;
      ctx.fillText(opts.subtitle.toUpperCase(), cx, curY + 44);
      const sw = ctx.measureText(opts.subtitle.toUpperCase()).width;
      return { x: cx - sw / 2, y: curY + 44 - 16, w: sw, h: 32 };
      });
    }

    ctx.restore();
  }

  /* ========================================================================
     FUNÇÃO PRINCIPAL: DG.render()
     Renderiza em alta resolução com foto enquadrada e moldura/balão
     ======================================================================== */
  // Foto (<img>) ou vídeo (<video>) pronto para ser desenhado?
  function mediaReady(m) {
    return !!m && ((m.videoWidth > 0 && m.readyState >= 2) || (m.complete && m.naturalWidth > 0));
  }
  function mediaSize(m) {
    return m.videoWidth ? [m.videoWidth, m.videoHeight] : [m.naturalWidth, m.naturalHeight];
  }

  DG.render = function (canvas, opts) {
    opts = Object.assign({
      exportMode: 'story', // 'story' (1080x1920), 'feed' (1080x1350), 'molduraStory', 'card' (transparente)
      model: 'balaoClean',
      molduraKey: 'futurista',
      title: 'POLIMENTO',
      subtitle: 'TÉCNICO',
      desc: 'Realce o brilho da pintura e reduza marcas superficiais.',
      price: '',
      oldPrice: '',
      cta: 'AGENDE SEU SERVIÇO >>',
      icon: 'politriz',
      color: BRAND.laranja,
      scale: 1,
      showLogo: true,
      bgMode: 'photo', // 'photo', 'dark', 'light', 'transparent'
      bgImage: null,
      molduraImage: null,
      logoImage: null,
      // Controles de enquadramento da foto
      photoZoom: 1,      // 0.8 a 2.5
      photoPanX: 0,      // -500 a 500 px
      photoPanY: 0,      // -500 a 500 px
      photoVeu: 0.65,    // 0 a 1 (escurecimento)
      photoBlur: 0       // 0 a 20 px
    }, opts);

    const ctx = canvas.getContext('2d');
    let W, H;

    if (opts.exportMode === 'story' || opts.exportMode === 'molduraStory') {
      W = 1080;
      H = 1920;
    } else if (opts.exportMode === 'feed') {
      W = 1080;
      H = 1350;
    } else {
      // Elemento transparente recortado
      W = 860;
      H = 980;
    }

    const scale = Number(opts.scale) || 1;
    // 'all' = tudo; 'bg' = só o fundo (foto/vídeo); 'fg' = só moldura, logo e balão
    const pass = opts.layerPass || 'all';
    // Só redimensiona quando muda (redimensionar a cada quadro de vídeo é caro)
    if (canvas.width !== Math.round(W * scale)) canvas.width = Math.round(W * scale);
    if (canvas.height !== Math.round(H * scale)) canvas.height = Math.round(H * scale);

    ctx.save();
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, W, H);
    opts._hits = [];
    opts._depth = 0;
    opts._scale = scale;
    canvas._dg = { hits: opts._hits, W: W, H: H, scale: scale };

    // =====================================================================
    // 1. DESENHO E ENQUADRAMENTO DA FOTO DE FUNDO
    // =====================================================================
    if (pass === 'fg') {
      // primeiro plano apenas: o fundo (foto/vídeo) é desenhado por outro passe
    } else if (opts.exportMode !== 'card') {
      if (opts.bgMode === 'photo' && mediaReady(opts.bgImage)) {
        const img = opts.bgImage;
        ctx.save();

        // Aplicar desfoque se solicitado
        if (opts.photoBlur > 0) {
          ctx.filter = `blur(${opts.photoBlur}px)`;
        }

        // Cálculo inteligente de preenchimento ("cover") da foto no canvas
        const imgSize = mediaSize(img);
        const imgRatio = imgSize[0] / imgSize[1];
        const canvasRatio = W / H;
        let baseW, baseH;

        if (imgRatio > canvasRatio) {
          baseH = H;
          baseW = H * imgRatio;
        } else {
          baseW = W;
          baseH = W / imgRatio;
        }

        // Aplicar zoom e deslocamento manual (Pan)
        const zoom = Math.max(0.5, Number(opts.photoZoom) || 1);
        const drawW = baseW * zoom;
        const drawH = baseH * zoom;
        const panX = Number(opts.photoPanX) || 0;
        const panY = Number(opts.photoPanY) || 0;
        const drawX = (W - drawW) / 2 + panX;
        const drawY = (H - drawH) / 2 + panY;

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();

        // Véu escuro cinematográfico graduado para contraste impecável
        const veuAlpha = Math.max(0, Math.min(1, Number(opts.photoVeu) || 0.65));
        if (veuAlpha > 0) {
          const veuGrad = ctx.createLinearGradient(0, 0, 0, H);
          veuGrad.addColorStop(0, `rgba(8, 8, 10, ${veuAlpha * 0.85})`);
          veuGrad.addColorStop(0.35, `rgba(8, 8, 10, ${veuAlpha * 0.4})`);
          veuGrad.addColorStop(0.65, `rgba(8, 8, 10, ${veuAlpha * 0.55})`);
          veuGrad.addColorStop(1, `rgba(8, 8, 10, ${veuAlpha * 0.95})`);
          ctx.fillStyle = veuGrad;
          ctx.fillRect(0, 0, W, H);
        }

        // Luz de borda neon laranja sutil
        const lightGrad = ctx.createRadialGradient(W * 0.85, H * 0.9, 30, W * 0.85, H * 0.9, 500);
        lightGrad.addColorStop(0, 'rgba(255, 106, 0, 0.35)');
        lightGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, W, H);

      } else if (opts.bgMode === 'dark') {
        const darkGrad = ctx.createRadialGradient(W / 2, H * 0.55, 40, W / 2, H * 0.55, H * 0.8);
        darkGrad.addColorStop(0, '#261208');
        darkGrad.addColorStop(0.45, '#120906');
        darkGrad.addColorStop(1, '#070606');
        ctx.fillStyle = darkGrad;
        ctx.fillRect(0, 0, W, H);
        drawHexGrid(ctx, 0, 0, W, H, 'rgba(255, 106, 0, 0.08)');
      } else if (opts.bgMode === 'light') {
        ctx.fillStyle = '#F3F4F7';
        ctx.fillRect(0, 0, W, H);
      }
    } else {
      if (opts.bgMode === 'dark') {
        ctx.fillStyle = '#0B0B0E';
        ctx.fillRect(0, 0, W, H);
      } else if (opts.bgMode === 'light') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, W, H);
      }
    }

    if (pass === 'bg') {
      ctx.restore();
      return canvas;
    }

    // =====================================================================
    // 2. MODO MOLDURA OFICIAL DG (storys molduras)
    // =====================================================================
    if (opts.exportMode === 'molduraStory') {
      renderMolduraComTexto(ctx, W, H, opts);
      ctx.restore();
      return canvas;
    }

    // =====================================================================
    // 3. LOGOTIPO OFICIAL DG (No topo nos modos Story e Feed)
    // =====================================================================
    if (opts.showLogo && opts.exportMode !== 'card') {
      const logoTopY = opts.exportMode === 'story' ? 140 : 70;
      const li = opts.logoImage;
      const hasLogo = !!(li && li.complete && li.naturalWidth);
      const logoH = 145;
      const logoW = hasLogo ? li.naturalWidth * (logoH / li.naturalHeight) : 420;
      const logoBox = hasLogo
        ? { x: (W - logoW) / 2, y: logoTopY, w: logoW, h: logoH }
        : { x: (W - 420) / 2, y: logoTopY, w: 420, h: 80 };
      L(ctx, opts, 'logo', { x: W / 2, y: logoBox.y + logoBox.h / 2 }, () => {
        if (hasLogo) {
          ctx.save();
          ctx.shadowColor = 'rgba(255, 106, 0, 0.45)';
          ctx.shadowBlur = 28;
          ctx.drawImage(li, logoBox.x, logoBox.y, logoBox.w, logoBox.h);
          ctx.restore();
        } else {
          ctx.save();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '900 italic 44px "Poppins", "Exo 2", sans-serif';
          ctx.fillText('DG ESTÉTICA', W / 2, logoTopY);
          ctx.fillStyle = opts.color || BRAND.laranja;
          ctx.font = '800 italic 26px "Poppins", "Exo 2", sans-serif';
          ctx.fillText('AUTOMOTIVA', W / 2, logoTopY + 48);
          ctx.restore();
        }
        return logoBox;
      });
    }

    // =====================================================================
    // 4. BALÃO DE AVISO / CARD DE SERVIÇO (Proporções da referência)
    // =====================================================================
    let cardX, cardY, cardW, cardH;

    // Altura calculada para harmonizar com os Stories de referência
    let baseH = 680;
    if (opts.price) baseH += 60;
    if (opts.oldPrice) baseH += 30;

    if (opts.exportMode === 'story') {
      cardW = 780;
      cardH = baseH;
      cardX = (W - cardW) / 2;
      cardY = H - cardH - 200; // Posicionado na metade inferior, deixando o carro e a logo brilharem
    } else if (opts.exportMode === 'feed') {
      cardW = 780;
      cardH = baseH;
      cardX = (W - cardW) / 2;
      cardY = H - cardH - 80;
    } else {
      cardW = 780;
      cardH = baseH;
      cardX = (W - cardW) / 2;
      cardY = 90;
    }

    switch (opts.model) {
      case 'balaoClean':
        renderBalaoClean(ctx, cardX, cardY, cardW, cardH, opts);
        break;
      case 'balaoDark':
        renderBalaoDark(ctx, cardX, cardY, cardW, cardH, opts);
        break;
      case 'balaoDica':
        renderBalaoDica(ctx, cardX, cardY, cardW, cardH, opts);
        break;
      case 'faixaSlant':
        renderFaixaSlant(ctx, cardX, cardY, cardW, cardH, opts);
        break;
      case 'seloMedalhao':
        renderSeloMedalhao(ctx, W / 2, opts.exportMode === 'card' ? H / 2 : cardY + cardH / 2, 230, opts);
        break;
      default:
        renderBalaoClean(ctx, cardX, cardY, cardW, cardH, opts);
        break;
    }

    ctx.restore();
    return canvas;
  };

  root.DG = DG;

})(typeof window !== 'undefined' ? window : this);
