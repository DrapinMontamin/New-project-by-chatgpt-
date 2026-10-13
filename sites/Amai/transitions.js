/* =========================================
   TRANSITIONS DES PAGES D'AMAI
   Chaque lien a sa propre animation de sortie,
   et la page d'arrivée la termine (même couleur).
   Ne touche que les boutons .btn-amai et les liens des pages d'Amai.
   ========================================= */
(function () {
    'use strict';

    var KEY = 'amai-transition';
    var INK = '#1a1a1a';
    var root = document.documentElement;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var busy = false;

    var CSS = [
        '.amt-layer{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:2147483000;overflow:hidden;pointer-events:auto;font-family:Consolas,"Courier New",monospace;line-height:1.1;margin:0;padding:0;border:0}',
        '.amt-layer *{box-sizing:border-box;margin:0}',
        '.amt-abs{position:absolute}',
        '.amt-full{position:absolute;left:0;top:0;width:100%;height:100%}',
        '.amt-center{display:flex;align-items:center;justify-content:center;text-align:center}',
        'html.amt-cover{background:var(--amt-c,#000)!important}',
        'html.amt-cover body{visibility:hidden!important}',
        'html.amt-shake body{animation:amt-shake .09s steps(2) infinite}',
        '@keyframes amt-shake{0%{transform:translate(-6px,3px)}50%{transform:translate(5px,-4px)}100%{transform:translate(-3px,-2px)}}',
        '@keyframes amt-fadein{from{opacity:0}to{opacity:1}}',
        '@keyframes amt-fadeout{from{opacity:1}to{opacity:0}}',
        '@keyframes amt-show{from{visibility:hidden}to{visibility:visible}}',
        '@keyframes amt-pop{0%{transform:rotate(var(--rot,0deg)) scale(0)}70%{transform:rotate(var(--rot,0deg)) scale(1.15)}100%{transform:rotate(var(--rot,0deg)) scale(1)}}',
        '@keyframes amt-from-l{from{transform:translateX(-101%)}to{transform:none}}',
        '@keyframes amt-from-r{from{transform:translateX(101%)}to{transform:none}}',
        '@keyframes amt-to-l{to{transform:translateX(-101%)}}',
        '@keyframes amt-to-r{to{transform:translateX(101%)}}',
        '@keyframes amt-to-up{to{transform:translateY(-101%)}}',
        '@keyframes amt-to-down{to{transform:translateY(101%)}}',
        '@keyframes amt-from-down{from{transform:translateY(101%)}to{transform:none}}',
        '@keyframes amt-rise{to{height:calc(100% + 40px)}}',
        '@keyframes amt-wave{to{transform:translateX(-50%)}}',
        '@keyframes amt-swim-r{from{transform:translateX(-110%)}to{transform:translateX(105vw)}}',
        '@keyframes amt-swim-l{from{transform:translateX(105vw)}to{transform:translateX(-110%)}}',
        '@keyframes amt-iris-close{to{width:0;height:0}}',
        '@keyframes amt-iris-open{from{width:0;height:0}to{width:170vmax;height:170vmax}}',
        '@keyframes amt-focus-txt{from{opacity:0;letter-spacing:1.2em;filter:blur(10px)}to{opacity:1;letter-spacing:.3em;filter:none}}',
        '@keyframes amt-jit{from{transform:translateX(-4vw)}to{transform:translateX(4vw)}}',
        '@keyframes amt-flash{from{opacity:.9}to{opacity:0}}',
        '@keyframes amt-wobble{from{transform:rotate(var(--rot,0deg)) translateY(-4px)}to{transform:rotate(var(--rot,0deg)) translateY(4px)}}',
        '@keyframes amt-zoomspin{from{transform:translate(-50%,-50%) scale(1.6) rotate(0)}to{transform:translate(-50%,-50%) scale(1) rotate(25deg)}}',
        '@keyframes amt-drop{from{transform:translateY(-110vh)}to{transform:none}}',
        '@keyframes amt-fall{to{transform:translateY(110vh) rotate(var(--rot,0deg))}}',
        '@keyframes amt-laser{from{left:-2%}to{left:102%}}',
        '@keyframes amt-crt{0%{clip-path:inset(0 0 0 0)}60%{clip-path:inset(49.6% 0 49.6% 0)}100%{clip-path:inset(50% 50% 50% 50%)}}',
        '@keyframes amt-blink{50%{opacity:0}}'
    ].join('\n');

    function addStyle() {
        if (document.getElementById('amt-style')) return;
        var s = document.createElement('style');
        s.id = 'amt-style';
        s.textContent = CSS;
        (document.head || root).appendChild(s);
    }

    function el(tag, cls, parent, css, html) {
        var e = document.createElement(tag);
        if (cls) e.className = cls;
        if (css) e.style.cssText = css;
        if (html) e.innerHTML = html;
        if (parent) parent.appendChild(e);
        return e;
    }

    // Les calques vont sur <html> : un transform sur <body> (secousse) ne les décale pas.
    function layer(bg) {
        var L = el('div', 'amt-layer', root);
        if (bg) L.style.background = bg;
        return L;
    }

    function rand(a, b) { return a + Math.random() * (b - a); }
    function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

    /* ---------- Dessins réutilisés ---------- */

    var SHARK_SVG =
        '<svg viewBox="-40 -10 320 130" width="100%" style="display:block;overflow:visible">' +
        '<g fill="#8fa9bd" stroke="' + INK + '" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">' +
        '<path d="M8 60 L-30 18 L-15 60 L-30 102 Z"/>' +
        '<path d="M118 38 L148 -4 L166 40 Z"/>' +
        '<path d="M130 80 L108 114 L162 84 Z"/>' +
        '<path d="M5 60 C 50 30, 170 22, 255 52 C 266 56, 266 62, 255 66 C 200 88, 60 92, 5 60 Z"/>' +
        '</g>' +
        '<circle cx="224" cy="52" r="5" fill="' + INK + '"/>' +
        '<path d="M188 50 v20 M197 48 v23 M206 50 v20" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M212 72 L222 66 L230 72 L238 66 L246 70" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linejoin="round"/>' +
        '</svg>';

    // Même Blåhaj que sur l'accueil, en couleur.
    var BLAHAJ_SVG =
        '<svg viewBox="0 0 200 120" width="100%" style="display:block;overflow:visible" stroke="' + INK + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M 90 36 L 110 5 L 125 43" fill="#6f8fb0"/>' +
        '<path d="M 85 80 L 60 110 L 105 85" fill="#6f8fb0"/>' +
        '<path d="M 30 70 C 40 40, 100 30, 140 50 L 180 25 L 165 65 L 185 105 L 140 75 C 100 95, 50 90, 30 70 Z" fill="#6f8fb0"/>' +
        '<path d="M 35 75 Q 60 86 95 82" fill="none"/>' +
        '<circle cx="55" cy="55" r="4" fill="' + INK + '"/>' +
        '<line x1="75" y1="55" x2="75" y2="70"/><line x1="82" y1="53" x2="82" y2="72"/><line x1="89" y1="55" x2="89" y2="70"/>' +
        '</svg>';

    function blobSvg(color) {
        return '<svg viewBox="0 0 100 100" width="100%" height="100%" style="display:block;overflow:visible"><g fill="' + color + '">' +
            '<circle cx="50" cy="50" r="33"/><circle cx="86" cy="28" r="7"/><circle cx="18" cy="84" r="5"/>' +
            '<circle cx="80" cy="82" r="9"/><circle cx="10" cy="22" r="4"/><circle cx="52" cy="97" r="3"/>' +
            '<ellipse cx="70" cy="58" rx="22" ry="12"/><ellipse cx="32" cy="38" rx="14" ry="24"/></g></svg>';
    }

    function wavePath() {
        var d = 'M0 18';
        for (var x = 0; x < 1200; x += 100) d += ' Q' + (x + 25) + ' 0 ' + (x + 50) + ' 18 T' + (x + 100) + ' 18';
        return d + ' V36 H0 Z';
    }

    // Bandes horizontales (drapeau trans, tier list) : entrée ou sortie.
    function stripes(L, colors, labels, phase, alt) {
        var n = colors.length;
        colors.forEach(function (c, i) {
            var side = alt && i % 2 ? 'r' : 'l';
            var anim = phase === 'in'
                ? 'amt-from-' + side + ' .45s ' + (i * 85) + 'ms cubic-bezier(.7,0,.3,1) both'
                : 'amt-to-' + (side === 'l' ? 'r' : 'l') + ' .5s ' + (i * 70) + 'ms cubic-bezier(.7,0,.3,1) forwards';
            var s = el('div', 'amt-abs', L, 'left:0;width:100%;top:' + (i * 100 / n) + '%;height:calc(' + (100 / n) + '% + 1px);background:' + c + ';animation:' + anim);
            if (labels) {
                el('div', 'amt-abs amt-center', s, 'left:0;top:0;height:100%;width:min(22vw,160px);background:rgba(0,0,0,.08);border-right:4px solid ' + INK + ';border-bottom:4px solid ' + INK + ';color:' + INK + ';font:bold min(11vh,80px) Impact,"Arial Black",sans-serif', labels[i]);
            }
        });
    }

    // Mur de briques : tombe du ciel (in), apparaît au laser (laser) ou s'écroule (out).
    function wall(L, o, phase) {
        var W = window.innerWidth, H = window.innerHeight;
        var BW = Math.max(90, Math.ceil(W / 10)), BH = Math.round(BW * 0.4);
        var rows = Math.ceil(H / BH);
        var last = 0;
        for (var r = 0; r < rows; r++) {
            var off = r % 2 ? -BW / 2 : 0;
            var cols = Math.ceil((W - off) / BW) + 1;
            for (var c = 0; c < cols; c++) {
                var x = off + c * BW, anim;
                if (phase === 'in') {
                    var d = r * 60 + rand(0, 80);
                    last = Math.max(last, d);
                    anim = 'amt-drop .38s ' + d + 'ms cubic-bezier(.55,0,1,.45) both';
                } else if (phase === 'laser') {
                    anim = 'amt-pop .22s ' + Math.max(0, x / W * 800) + 'ms both';
                } else {
                    anim = 'amt-fall .65s ' + rand(0, 350) + 'ms cubic-bezier(.5,0,1,.6) forwards';
                }
                var b = el('div', 'amt-abs', L, 'left:' + x + 'px;bottom:' + (r * BH) + 'px;width:' + BW + 'px;height:' + BH + 'px;background:' + o.brick +
                    ';box-shadow:inset 0 0 0 3px ' + o.mortar + ',inset -8px -8px 0 rgba(0,0,0,.18),inset 8px 8px 0 rgba(255,255,255,.12);animation:' + anim);
                if (phase === 'out') b.style.setProperty('--rot', rand(-60, 60) + 'deg');
            }
        }
        return last;
    }

    /* ---------- Animations de sortie (une par lien) ---------- */
    // Chaque fonction remplit le calque et renvoie sa durée en ms.

    var EXITS = {
        requins: function (L) {
            var water = el('div', 'amt-abs', L, 'left:0;bottom:0;width:100%;height:0;background:#0a3d62;animation:amt-rise .8s .4s cubic-bezier(.55,0,.45,1) forwards');
            el('div', 'amt-abs', water, 'left:0;bottom:calc(100% - 1px);width:200%;height:36px;animation:amt-wave .6s linear infinite',
                '<svg viewBox="0 0 1200 36" preserveAspectRatio="none" width="100%" height="100%" style="display:block"><path d="' + wavePath() + '" fill="#0a3d62"/></svg>');
            el('div', 'amt-abs', L, 'top:34%;left:0;width:min(62vw,560px);animation:amt-swim-r 1s cubic-bezier(.45,0,.6,1) forwards', SHARK_SVG);
            return 1300;
        },

        blahaj: function (L) {
            stripes(L, ['#5BCEFA', '#F5A9B8', '#FFFFFF', '#F5A9B8', '#5BCEFA'], null, 'in');
            el('div', 'amt-abs', L, 'top:36%;left:0;width:min(45vw,380px);animation:amt-swim-l 1s .25s cubic-bezier(.45,0,.6,1) both', BLAHAJ_SVG);
            return 1350;
        },

        poulpe: function (L) {
            var ink = '#1d1029';
            for (var i = 0; i < 10; i++) {
                var s = rand(22, 46);
                var b = el('div', 'amt-abs', L, 'left:' + rand(-5, 100) + '%;top:' + rand(-5, 100) + '%;width:' + s + 'vmax;height:' + s + 'vmax;margin:' + (-s / 2) + 'vmax 0 0 ' + (-s / 2) + 'vmax;animation:amt-pop .35s ' + (i * 70) + 'ms cubic-bezier(.2,1.4,.4,1) both', blobSvg(ink));
                b.style.setProperty('--rot', rand(0, 360) + 'deg');
            }
            el('div', 'amt-full', L, 'background:' + ink + ';animation:amt-fadein .25s .8s both');
            el('div', 'amt-full amt-center', L, 'color:#c9b8ff;font:bold min(10vw,90px) Consolas,monospace;animation:amt-pop .3s .85s both', 'SPLOTCH');
            return 1300;
        },

        focus: function (L) {
            el('div', 'amt-abs', L, 'left:50%;top:50%;width:170vmax;height:170vmax;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 200vmax #000;animation:amt-iris-close .9s cubic-bezier(.7,0,.3,1) forwards');
            el('div', 'amt-full amt-center', L, 'color:#fff;font-weight:bold;font-size:min(13vw,130px);padding-left:.3em;animation:amt-focus-txt .6s .75s both', 'FOCUS');
            return 1550;
        },

        overload: function (L) {
            root.classList.add('amt-shake');
            var cols = ['#ff1a1a', '#0a0000', '#ffffff', '#00e5ff', '#ff1a1a'];
            for (var i = 0; i < 18; i++) {
                var d = Math.round(rand(0, 750));
                el('div', 'amt-abs', L, 'left:0;width:100%;top:' + rand(0, 96) + '%;height:' + rand(2, 14) + '%;background:' + pick(cols) +
                    ';animation:amt-show 0s ' + d + 'ms both,amt-jit ' + rand(.06, .14) + 's ' + d + 'ms steps(2) infinite alternate');
            }
            el('div', 'amt-full', L, 'background:#0a0000;animation:amt-show 0s 950ms both');
            el('div', 'amt-full amt-center', L, 'color:#fff;font:900 min(14vw,150px) Impact,"Arial Black",sans-serif;text-shadow:-7px 0 #ff1a1a,7px 0 #00e5ff;animation:amt-show 0s 250ms both,amt-jit .08s 250ms steps(2) infinite alternate', 'OVERLOAD');
            return 1300;
        },

        terminal: function (L) {
            L.style.cssText += ';background:#050505;animation:amt-fadein .15s both';
            var pre = el('pre', 'amt-abs', L, 'left:0;top:0;width:100%;padding:8vh 7vw;color:#e6e6e6;font:clamp(15px,2.3vw,28px)/1.6 Consolas,"Courier New",monospace;white-space:pre-wrap');
            el('div', 'amt-full', L, 'pointer-events:none;background:repeating-linear-gradient(transparent 0 3px,rgba(0,0,0,.35) 3px 5px)');
            var lines = [
                ['> CONNEXION AU TERMINAL...', '#e6e6e6'],
                ['> MANKIND IS DEAD.', '#e6e6e6'],
                ['> BLOOD IS FUEL.', '#e6e6e6'],
                ['> HELL IS FULL.', '#e6e6e6'],
                ['> ACCÈS AUTORISÉ', '#ff2a2a']
            ];
            var li = 0, ci = 0, cur = null;
            var caret = el('span', '', null, 'animation:amt-blink .4s steps(1) infinite', '█');
            var timer = setInterval(function () {
                if (li >= lines.length) { clearInterval(timer); return; }
                if (!cur) { cur = el('span', '', pre, 'color:' + lines[li][1]); }
                cur.textContent = lines[li][0].slice(0, ++ci);
                pre.appendChild(caret);
                if (ci >= lines[li][0].length) { pre.insertBefore(document.createTextNode('\n'), caret); li++; ci = 0; cur = null; }
            }, 13);
            return 1650;
        },

        ultrakill: function (L) {
            el('div', 'amt-full', L, 'background:#6b0000;animation:amt-fadein .9s .25s both');
            for (var i = 0; i < 7; i++) {
                var s = rand(18, 34);
                var b = el('div', 'amt-abs', L, 'left:' + rand(0, 100) + '%;top:' + rand(0, 100) + '%;width:' + s + 'vmax;height:' + s + 'vmax;margin:' + (-s / 2) + 'vmax 0 0 ' + (-s / 2) + 'vmax;animation:amt-pop .2s ' + (i * 110) + 'ms both', blobSvg('#b00000'));
                b.style.setProperty('--rot', rand(0, 360) + 'deg');
            }
            el('div', 'amt-full', L, 'background:#ff0000;animation:amt-flash .3s both');
            var ranks = [['D', '#1e90ff'], ['C', '#3ddc84'], ['B', '#ffd400'], ['A', '#ff8c00'], ['S', '#ff2020'], ['SS', '#ff2020'], ['SSS', '#ff2020'], ['ULTRAKILL', '#ffd400']];
            ranks.forEach(function (r, i) {
                setTimeout(function () {
                    var old = L.querySelector('.amt-rank');
                    if (old) old.remove();
                    var t = el('div', 'amt-full amt-center amt-rank', L, 'color:' + r[1] + ';font:italic 900 ' + (r[0].length > 3 ? 'min(13vw,150px)' : 'min(30vw,260px)') + ' Impact,"Arial Black",sans-serif;-webkit-text-stroke:4px #000;text-shadow:8px 8px 0 #000;animation:amt-pop .14s both', r[0]);
                    t.style.setProperty('--rot', '-8deg');
                }, i * 150);
            });
            return 1600;
        },

        jojo: function (L) {
            L.style.cssText += ';background:rgba(90,60,15,.25);-webkit-backdrop-filter:sepia(1) contrast(1.15);backdrop-filter:sepia(1) contrast(1.15);animation:amt-fadein .25s both';
            for (var i = 0; i < 12; i++) {
                var left = i % 2 ? rand(65, 92) : rand(2, 25);
                var g = el('div', 'amt-abs', L, 'left:' + left + '%;top:' + rand(4, 70) + '%;color:#7a2b8f;-webkit-text-stroke:2px #000;font:900 ' + rand(5, 9) + 'vw "Yu Gothic","Meiryo",sans-serif;animation:amt-pop .25s ' + (i * 45) + 'ms both,amt-wobble .3s ' + (i * 45 + 250) + 'ms ease-in-out infinite alternate', 'ゴ');
                g.style.setProperty('--rot', rand(-20, 20) + 'deg');
            }
            // La flèche du « To Be Continued », pointe à gauche comme dans l'anime.
            var arrow = el('div', 'amt-abs', L, 'left:3vw;bottom:7vh;width:min(70vw,620px);height:min(11vw,96px);animation:amt-from-l .45s .7s cubic-bezier(.2,.8,.3,1) both');
            el('div', 'amt-full', arrow, 'background:#585b48;clip-path:polygon(0 50%,14% 0,14% 22%,100% 22%,100% 78%,14% 78%,14% 100%)');
            el('div', 'amt-full amt-center', arrow, 'background:#bec2ad;clip-path:polygon(3% 50%,12.5% 8%,12.5% 30%,98.6% 30%,98.6% 70%,12.5% 70%,12.5% 92%);color:#585b48;font:bold min(3.4vw,30px) "Comic Sans MS","Segoe Print",cursive;padding-left:10%', 'To Be Continued');
            el('div', 'amt-full', L, 'background:#1e140a;animation:amt-fadein .35s 1.35s both');
            return 1750;
        },

        adhd: function (L) {
            var notes = ['attends quoi', 'un écureuil !', "j'étais où déjà", 'onglet n°47', 'faim', 'oh un requin', 'musique ?', "j'ai oublié le four",
                'nouveau hobby !!', '3h du mat', 'trop de bruit', 'ah oui !', 'non attends', 'BRIQUE', '🐿️', '🦈', '???', 'je reviens', 'mes clés ??', 'projet n°12'];
            var bgs = ['#ffd23f', '#ff6b6b', '#4ecdc4', '#a29bfe', '#ffffff', '#7bed9f'];
            for (var i = 0; i < 38; i++) {
                var n = el('div', 'amt-abs', L, 'left:' + rand(-4, 82) + '%;top:' + rand(-2, 90) + '%;background:' + pick(bgs) + ';color:' + INK + ';border:3px solid ' + INK +
                    ';box-shadow:5px 5px 0 ' + INK + ';padding:.45em .8em;font:bold ' + Math.round(rand(16, 34)) + 'px Consolas,monospace;white-space:nowrap;animation:amt-pop .22s ' + (i * 24) + 'ms both', pick(notes));
                n.style.setProperty('--rot', rand(-16, 16) + 'deg');
            }
            el('div', 'amt-full amt-center', L, 'background:#ffd23f;color:' + INK + ';font:bold min(8vw,70px) Consolas,monospace;animation:amt-show 0s 1000ms both', "...j'étais où ?");
            return 1400;
        },

        anime: function (L) {
            el('div', 'amt-full', L, 'background:#ffd1ec;animation:amt-fadein .2s both');
            el('div', 'amt-abs', L, 'left:50%;top:50%;width:250vmax;height:250vmax;background:repeating-conic-gradient(' + INK + ' 0deg 1.4deg,transparent 1.4deg 8deg);' +
                '-webkit-mask:radial-gradient(circle,transparent 14%,#000 40%);mask:radial-gradient(circle,transparent 14%,#000 40%);animation:amt-zoomspin 1s ease-out both');
            for (var i = 0; i < 16; i++) {
                var s = el('div', 'amt-abs', L, 'left:' + rand(5, 92) + '%;top:' + rand(5, 88) + '%;font-size:' + rand(28, 64) + 'px;animation:amt-pop .3s ' + rand(100, 800) + 'ms both', '✨');
                s.style.setProperty('--rot', rand(-30, 30) + 'deg');
            }
            var t = el('div', 'amt-full amt-center', L, 'color:#ff3ea5;font:900 min(16vw,170px) "Yu Gothic","Meiryo",sans-serif;-webkit-text-stroke:4px #fff;text-shadow:7px 7px 0 ' + INK + ';animation:amt-pop .3s .3s cubic-bezier(.2,1.6,.4,1) both', 'すごい!!');
            t.style.setProperty('--rot', '-6deg');
            el('div', 'amt-full', L, 'background:#fff;animation:amt-fadein .25s 1.05s both');
            return 1400;
        },

        tierlist: function (L) {
            stripes(L, TIER.colors, TIER.labels, 'in', true);
            return 1150;
        },

        brique: function (L) {
            var last = wall(L, { brick: '#b5452b', mortar: '#e3d5b8' }, 'in');
            return last + 550;
        },

        brique2: function (L) {
            wall(L, { brick: '#2a2d3e', mortar: '#ff9f1c' }, 'laser');
            el('div', 'amt-abs', L, 'top:0;height:100%;width:8px;margin-left:-4px;background:#ff9f1c;box-shadow:0 0 24px 6px rgba(255,159,28,.7);animation:amt-laser .85s linear both');
            return 1250;
        },

        evolution: function (L) {
            var eras = [
                ['1996', '#c0c0c0', '<div style="font-family:\'Times New Roman\',serif;color:#000;font-size:clamp(18px,3vw,36px);text-align:left;padding:6vh 6vw;width:100%;height:100%">' +
                    '<h1 style="font-size:1.6em;margin-bottom:.4em">Bienvenue sur ma page perso !!</h1>' +
                    '<p><u style="color:#0000ee">Cliquez ici</u> &nbsp; <u style="color:#551a8b">Mon livre d\'or</u></p><hr style="margin:.6em 0">' +
                    '<p style="color:#ff0000">🚧 EN CONSTRUCTION 🚧</p><p style="font-family:\'Comic Sans MS\',cursive;margin-top:.4em">Vous êtes le visiteur n° 000042</p></div>'],
                ['2006', 'linear-gradient(#f2f9ff,#9cc9f5)', '<div style="font:bold min(13vw,140px) \'Trebuchet MS\',sans-serif;color:#2f7bd1;text-shadow:0 2px 0 #fff,0 6px 12px rgba(0,60,140,.35)">Web 2.0' +
                    '<span style="display:inline-block;vertical-align:top;font-size:.22em;background:#ff6a00;color:#fff;padding:.2em .5em;transform:rotate(12deg);text-shadow:none">BETA</span></div>'],
                ['2014', '#1abc9c', '<div style="font:300 min(11vw,120px) \'Segoe UI\',sans-serif;color:#fff">Flat design<div style="display:flex;gap:2vw;justify-content:center;margin-top:4vh">' +
                    '<i style="width:14vw;height:9vw;background:#fff"></i><i style="width:14vw;height:9vw;background:#e74c3c"></i><i style="width:14vw;height:9vw;background:#f1c40f"></i></div></div>'],
                ['2026', '#fafafa', '<div style="font:600 min(9vw,96px) \'Segoe UI\',sans-serif;color:' + INK + '">et maintenant ?</div>']
            ];
            eras.forEach(function (e, i) {
                var p = el('div', 'amt-full amt-center', L, 'background:' + e[1] + ';animation:amt-show 0s ' + (i * 320) + 'ms both', e[2]);
                el('div', 'amt-abs', p, 'right:3vw;bottom:2vh;color:' + INK + ';opacity:.85;font:900 min(12vw,120px) Consolas,monospace', e[0]);
            });
            return 1600;
        },

        platformer: function (L) {
            var c = el('canvas', 'amt-full', L);
            var W = c.width = window.innerWidth, H = c.height = window.innerHeight;
            var ctx = c.getContext('2d'), S = 48, cells = [];
            for (var y = 0; y < H; y += S) for (var x = 0; x < W; x += S) cells.push([x, y]);
            for (var i = cells.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = cells[i]; cells[i] = cells[j]; cells[j] = t; }
            var glitch = ['#ff00ea', '#00f3ff', '#39ff14', '#fff600'], done = 0, start = performance.now();
            (function frame(now) {
                var target = Math.min(cells.length, Math.round(cells.length * (now - start) / 800));
                for (; done < target; done++) {
                    ctx.fillStyle = Math.random() < .12 ? pick(glitch) : '#000';
                    ctx.fillRect(cells[done][0], cells[done][1], S, S);
                }
                if (done < cells.length) requestAnimationFrame(frame);
                else { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); }
            })(start);
            el('div', 'amt-full amt-center', L, 'flex-direction:column;color:#fff;font:bold min(9vw,90px) Consolas,monospace;animation:amt-show 0s 900ms both',
                'LEVEL 1-1<div style="font-size:.35em;margin-top:1em;animation:amt-blink .5s steps(1) infinite">▶ START</div>');
            return 1450;
        },

        legal: function (L) {
            var sheet = el('div', 'amt-full', L, 'background:#f7f4ea repeating-linear-gradient(transparent 0 38px,rgba(26,26,26,.12) 38px 40px);border-top:4px solid ' + INK + ';animation:amt-from-down .55s cubic-bezier(.2,.8,.3,1) both');
            var st = el('div', 'amt-abs', sheet, 'left:50%;top:50%;transform:translate(-50%,-50%);', '');
            var stamp = el('div', '', st, 'border:6px solid #c0392b;color:#c0392b;padding:.3em .6em;font:900 min(8vw,72px) Consolas,monospace;white-space:nowrap;animation:amt-pop .2s .55s cubic-bezier(.2,1.6,.4,1) both', 'MENTIONS LÉGALES');
            stamp.style.setProperty('--rot', '-8deg');
            return 1050;
        }
    };

    var TIER = { colors: ['#ff7f7f', '#ffbf7f', '#ffdf7f', '#ffff7f', '#bfff7f'], labels: ['S', 'A', 'B', 'C', 'D'] };

    /* ---------- Fin de l'animation sur la page d'arrivée ---------- */

    var ARRIVALS = {
        requins: { type: 'down', color: '#0a3d62' },
        blahaj: { type: 'stripes', colors: ['#5BCEFA', '#F5A9B8', '#FFFFFF', '#F5A9B8', '#5BCEFA'] },
        poulpe: { type: 'iris', color: '#1d1029' },
        focus: { type: 'iris', color: '#000' },
        overload: { type: 'slices', color: '#0a0000', colors: ['#0a0000', '#ff1a1a', '#0a0000', '#00e5ff', '#0a0000'] },
        terminal: { type: 'crt', color: '#050505' },
        ultrakill: { type: 'slices', color: '#6b0000', colors: ['#6b0000', '#b00000', '#000', '#6b0000'] },
        jojo: { type: 'fade', color: '#1e140a' },
        adhd: { type: 'up', color: '#ffd23f' },
        anime: { type: 'iris', color: '#fff' },
        tierlist: { type: 'stripes', colors: TIER.colors, labels: TIER.labels, alt: true },
        brique: { type: 'bricks', color: '#b5452b', brick: '#b5452b', mortar: '#e3d5b8' },
        brique2: { type: 'bricks', color: '#2a2d3e', brick: '#2a2d3e', mortar: '#ff9f1c' },
        evolution: { type: 'fade', color: '#fafafa' },
        platformer: { type: 'pixels', color: '#000' },
        legal: { type: 'up', color: '#f7f4ea' },
        wiki: { type: 'wiki', color: '#ffffff' }
    };

    function arrive(o) {
        var L = layer(), dur = 900;
        switch (o.type) {
            case 'stripes':
                stripes(L, o.colors, o.labels, 'out', o.alt);
                break;
            case 'bricks':
                wall(L, o, 'out');
                dur = 1100;
                break;
            case 'iris':
                el('div', 'amt-abs', L, 'left:50%;top:50%;width:0;height:0;border-radius:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 200vmax ' + o.color + ';animation:amt-iris-open .75s .05s cubic-bezier(.6,0,.3,1) both');
                break;
            case 'slices':
                var n = 10;
                for (var i = 0; i < n; i++) {
                    el('div', 'amt-abs', L, 'left:0;width:100%;top:' + (i * 10) + '%;height:calc(10% + 1px);background:' + pick(o.colors) +
                        ';animation:amt-to-' + (Math.random() < .5 ? 'l' : 'r') + ' .35s ' + rand(0, 400) + 'ms cubic-bezier(.7,0,.3,1) forwards');
                }
                break;
            case 'pixels':
                var c = el('canvas', 'amt-full', L);
                var W = c.width = window.innerWidth, H = c.height = window.innerHeight;
                var ctx = c.getContext('2d'), S = 48, cells = [];
                ctx.fillStyle = o.color;
                ctx.fillRect(0, 0, W, H);
                for (var y = 0; y < H; y += S) for (var x = 0; x < W; x += S) cells.push([x, y]);
                for (var k = cells.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var t = cells[k]; cells[k] = cells[j]; cells[j] = t; }
                var done = 0, start = performance.now();
                (function frame(now) {
                    var target = Math.min(cells.length, Math.round(cells.length * (now - start) / 600));
                    for (; done < target; done++) ctx.clearRect(cells[done][0], cells[done][1], S, S);
                    if (done < cells.length) requestAnimationFrame(frame);
                })(start);
                break;
            case 'crt':
                L.style.cssText += ';background:' + o.color + ';animation:amt-crt .5s .1s cubic-bezier(.6,0,.4,1) forwards';
                el('div', 'amt-abs', L, 'left:0;top:50%;width:100%;height:4px;margin-top:-2px;background:#fff;box-shadow:0 0 18px 4px #fff');
                break;
            case 'wiki':
                L.style.cssText += ';background:#fff;animation:amt-to-up .5s .75s cubic-bezier(.7,0,.3,1) forwards';
                el('div', 'amt-full amt-center', L, 'flex-direction:column;color:#202122;font:min(7vw,56px) "Linux Libertine","Georgia","Times New Roman",serif',
                    'Wikipédia<div style="font:italic min(3.4vw,22px) Georgia,serif;margin-top:.8em;color:#54595d">Chargement de la preuve scientifique...</div>');
                dur = 1350;
                break;
            case 'up':
            case 'down':
                L.style.cssText += ';background:' + o.color + ';animation:amt-to-' + o.type + ' .6s .05s cubic-bezier(.7,0,.3,1) forwards';
                break;
            default:
                L.style.cssText += ';background:' + o.color + ';animation:amt-fadeout .55s .1s both';
        }
        setTimeout(function () { L.remove(); }, dur);
    }

    /* ---------- Branchements ---------- */

    var PAGES = {
        'requins.html': 'requins', 'blahaj.html': 'blahaj', 'poulpe.html': 'poulpe',
        'tamashikafocus.html': 'focus', 'tamashikaoverload.html': 'overload',
        'ultrakillterminalthing.html': 'terminal', 'ultrakilleffect.html': 'ultrakill',
        'jojo.html': 'jojo', 'bahahaadhd.html': 'adhd', 'animestyleclick.html': 'anime',
        'tierlist.html': 'tierlist', 'briqueclicker.html': 'brique', 'briqueclickeraucarré.html': 'brique2',
        'evolution.html': 'evolution', 'platformer.html': 'platformer',
        'fakewikipediaasscientificproof.html': 'wiki', 'mentions-legales.html': 'legal'
    };

    function kindOf(url) {
        var name = url.split('#')[0].split('?')[0].split('/').pop();
        try { name = decodeURIComponent(name); } catch (e) { }
        return PAGES[name.normalize ? name.normalize('NFC').toLowerCase() : name.toLowerCase()];
    }

    function save(kind) {
        try { sessionStorage.setItem(KEY, JSON.stringify({ k: kind, at: Date.now() })); } catch (e) { }
    }

    function go(url, kind) {
        if (busy) return;
        if (reduce || !EXITS[kind]) { window.location.href = url; return; }
        busy = true;
        addStyle();
        var L = layer();
        var t = EXITS[kind](L);
        save(kind);
        setTimeout(function () { window.location.href = url; }, t);
    }

    // Boutons de l'accueil : écoute en capture pour passer avant le script de la page.
    document.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.btn-amai[data-url]');
        if (!btn) return;
        var url = btn.getAttribute('data-url');
        var kind = kindOf(url);
        if (!kind) return;
        e.stopPropagation();
        e.preventDefault();
        go(url, kind);
    }, true);

    // Liens à l'intérieur des pages d'Amai.
    var onAmaiPage = /\/sites\/Amai\//i.test(decodeURIComponent(location.pathname));
    if (onAmaiPage) {
        document.addEventListener('click', function (e) {
            if (e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
            var a = e.target.closest && e.target.closest('a[href]');
            if (!a) return;
            var href = a.getAttribute('href');
            if (!href || href.charAt(0) === '#' || /^(javascript|mailto|tel):/i.test(href)) return;
            if (a.protocol !== location.protocol || a.host !== location.host) return;
            var kind = kindOf(a.pathname);
            if (!kind) return;
            if (a.target === '_blank') {
                // Nouvel onglet : on ne peut pas retarder l'ouverture, l'animation se joue à l'arrivée.
                if (!reduce) a.href = a.href.split('#')[0] + '#amt=' + kind;
                return;
            }
            e.preventDefault();
            go(a.href, kind);
        }, true);
    }

    /* ---------- Arrivée ---------- */

    function pending() {
        var m = /^#amt=([a-z0-9]+)$/.exec(location.hash);
        if (m) {
            try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { }
            return m[1];
        }
        try {
            var raw = sessionStorage.getItem(KEY);
            sessionStorage.removeItem(KEY);
            var data = raw && JSON.parse(raw);
            if (data && Date.now() - data.at < 10000) return data.k;
        } catch (e) { }
        return null;
    }

    var incoming = pending();
    if (incoming && ARRIVALS[incoming] && !reduce) {
        var o = ARRIVALS[incoming];
        addStyle();
        // Cache la page dès le <head> pour ne pas voir de flash avant l'animation.
        root.style.setProperty('--amt-c', o.color || '#000');
        root.classList.add('amt-cover');
        var start = function () {
            arrive(o);
            root.classList.remove('amt-cover');
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
        else start();
    }

    // Retour arrière (cache du navigateur) : on nettoie ce qui restait de la sortie.
    window.addEventListener('pageshow', function (e) {
        if (!e.persisted) return;
        busy = false;
        root.classList.remove('amt-shake', 'amt-cover');
        Array.prototype.forEach.call(document.querySelectorAll('.amt-layer'), function (l) { l.remove(); });
    });
})();
