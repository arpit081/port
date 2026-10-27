# Builds the 12 project-card images as HTML compositions; render.py screenshots them.
# The card slots change shape with the viewport, so the cards show these whole
# (object-contain) on #07070a, and every background fades into #07070a at the
# edges: whatever space is left in a slot blends in instead of cropping content.
import os, math, random

OUT = os.path.dirname(os.path.abspath(__file__))
SIZES = {'s': (600, 280), 'm': (600, 400), 'l': (700, 550)}

THEMES = {
    'rag':   ('#7c5cff', '#2fd3ff', '#ff4fd8'),
    'nic':   ('#19d3a2', '#2f7bff', '#9bffcf'),
    'sheet': ('#22c55e', '#a3e635', '#14b8a6'),
    'hover': ('#ff8a3d', '#ffd166', '#ff3d7f'),
}

BASE_CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:%(w)dpx;height:%(h)dpx;overflow:hidden}
body{font-family:'Kanit',sans-serif;color:#fff;background:#07070a;position:relative;-webkit-font-smoothing:antialiased}
.bg{position:absolute;inset:0;overflow:hidden;-webkit-mask-image:radial-gradient(ellipse at center,#000 35%%,transparent 78%%)}
.blob{position:absolute;border-radius:50%%;filter:blur(60px);opacity:.7}
.gridbg{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:28px 28px;-webkit-mask-image:radial-gradient(ellipse at center,#000 25%%,transparent 75%%)}
.glass{background:linear-gradient(160deg,rgba(255,255,255,.14),rgba(255,255,255,.045));border:1px solid rgba(255,255,255,.17);backdrop-filter:blur(22px) saturate(150%%);-webkit-backdrop-filter:blur(22px) saturate(150%%);border-radius:20px;box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 18px 50px rgba(0,0,0,.45)}
.mono{font-family:'JetBrains Mono',ui-monospace,Consolas,monospace}
.stage{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.eyebrow{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:rgba(255,255,255,.55);font-weight:600}
.chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);font-size:11px;font-weight:500;color:rgba(255,255,255,.88);white-space:nowrap}
.accent{background:linear-gradient(90deg,var(--a),var(--b));-webkit-background-clip:text;background-clip:text;color:transparent}
.big{font-weight:800;line-height:.95;letter-spacing:-.02em}
.muted{color:rgba(255,255,255,.6)}
.dot{width:7px;height:7px;border-radius:50%%;display:inline-block}
.code{background:rgba(5,5,10,.6);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:10px 12px;font-size:10.5px;line-height:1.65;color:#e6e6f0;white-space:pre}
.k{color:var(--c)} .f{color:var(--b)} .s{color:#ffd28a} .n{color:#9aa0ff} .cm{color:rgba(255,255,255,.4)}
"""

def page(theme, size, body, blobs):
    w, h = SIZES[size]
    a, b, c = THEMES[theme]
    blob_html = ''.join(
        '<span class="blob" style="left:%dpx;top:%dpx;width:%dpx;height:%dpx;background:%s;opacity:%s"></span>' % bl
        for bl in blobs)
    return ("<!doctype html><html><head><meta charset='utf-8'>"
            "<link href='https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=block' rel='stylesheet'>"
            "<style>" + (BASE_CSS % {'w': w, 'h': h}) +
            ":root{--a:%s;--b:%s;--c:%s}</style></head><body>" % (a, b, c) +
            "<div class='bg'>" + blob_html + "<div class='gridbg'></div></div>" + body + "</body></html>")

# ---------- hand landmarks (MediaPipe's 21 points, in a 1000x1000 box) ----------
CONN = [(0,1),(1,2),(2,3),(3,4),(0,5),(5,6),(6,7),(7,8),(5,9),(9,10),(10,11),(11,12),
        (9,13),(13,14),(14,15),(15,16),(13,17),(17,18),(18,19),(19,20),(0,17)]

def curl(mx, my):
    # Folded toward the palm: knuckle up a little, tip tucked below the knuckle
    return [(mx, my), (mx + 2, my - 48), (mx - 2, my - 14), (mx - 6, my + 20)]

WRIST = (500, 900)
THUMB_OUT = [(420, 840), (355, 775), (305, 715), (262, 668)]
THUMB_IN = [(440, 845), (410, 780), (435, 730), (470, 708)]
IDX_UP = [(430, 620), (412, 500), (402, 420), (395, 345)]
MID_UP = [(510, 600), (512, 470), (514, 385), (515, 305)]
RING_UP = [(585, 615), (600, 500), (608, 425), (614, 362)]
PINK_UP = [(650, 650), (680, 565), (698, 510), (712, 458)]
POSES = {
    'open': [WRIST] + THUMB_OUT + IDX_UP + MID_UP + RING_UP + PINK_UP,
    'move': [WRIST] + THUMB_IN + IDX_UP + curl(510, 600) + curl(585, 615) + curl(650, 650),
    'click': [WRIST] + THUMB_IN + [(430, 620), (425, 500), (432, 420), (440, 345)] + [(510, 600), (500, 470), (492, 385), (486, 305)] + curl(585, 615) + curl(650, 650),
    'volume': [WRIST] + [(420, 840), (340, 790), (275, 750), (215, 720)] + [(430, 620), (375, 510), (340, 440), (310, 375)] + curl(510, 600) + curl(585, 615) + curl(650, 650),
}

def hand_svg(pose, x, y, scale, line='rgba(255,255,255,.75)', dot='var(--a)', lw=6, r=12, glow=True):
    pts = [(x + px * scale, y + py * scale) for px, py in POSES[pose]]
    s = ''
    for i, j in CONN:
        s += '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%.1f" stroke-linecap="round"/>' % (pts[i] + pts[j] + (line, lw * scale))
    for k, (px, py) in enumerate(pts):
        s += '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s" %s/>' % (px, py, r * scale, dot, 'filter="url(#glow)"' if glow else '')
    return s, pts

GLOW_DEF = '<defs><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="rgba(255,255,255,.75)"/></marker></defs>'

def network(w, h, n, seed, color1, color2, alpha=.35):
    rnd = random.Random(seed)
    pts = [(rnd.uniform(0, w), rnd.uniform(0, h)) for _ in range(n)]
    s = ''
    for i, p in enumerate(pts):
        near = sorted(range(n), key=lambda j: (pts[j][0] - p[0]) ** 2 + (pts[j][1] - p[1]) ** 2)[1:3]
        for j in near:
            s += '<line x1="%.0f" y1="%.0f" x2="%.0f" y2="%.0f" stroke="rgba(255,255,255,%.2f)" stroke-width="1"/>' % (p + pts[j] + (alpha * .5,))
    for i, p in enumerate(pts):
        s += '<circle cx="%.0f" cy="%.0f" r="%.1f" fill="%s" opacity="%.2f"/>' % (p + (rnd.uniform(2, 4.5), color1 if i % 3 else color2, alpha + .3))
    return '<svg style="position:absolute;inset:0" width="%d" height="%d">%s</svg>' % (w, h, s)

files = {}

# ===================== 01 · Graph-RAG =====================
A, B, C = THEMES['rag']
stat = lambda num, label, sub: ('<div class="glass" style="width:168px;padding:16px 16px 14px">'
                                '<div class="big accent" style="font-size:40px">%s</div>'
                                '<div style="font-size:12.5px;font-weight:500;margin-top:8px">%s</div>'
                                '<div class="muted" style="font-size:10.5px;margin-top:2px">%s</div></div>') % (num, label, sub)
files['rag-1'] = page('rag', 's', '<div class="stage" style="gap:12px">' +
    stat('100%', 'Exact match', 'across 36 benchmark suites') +
    stat('0.1<span style="font-size:22px">ms</span>', 'Repeat queries', 'Redis L1 cache, no LLM call') +
    stat('100%', 'Mutations blocked', 'CREATE · DELETE · DROP') + '</div>',
    [(-60, -80, 260, 260, A, .7), (420, 120, 260, 260, B, .45), (200, 160, 220, 180, C, .35)])

def pill(x, y, label, sub, hi=False):
    border = 'border-color:rgba(255,255,255,.35);' if hi else ''
    return ('<div class="glass" style="position:absolute;left:%dpx;top:%dpx;width:116px;height:38px;border-radius:12px;%s'
            'display:flex;flex-direction:column;justify-content:center;padding:0 10px">'
            '<div style="font-size:11.5px;font-weight:600;line-height:1.1">%s</div>'
            '<div class="mono muted" style="font-size:8px;margin-top:2px">%s</div></div>') % (x, y, border, label, sub)

edges = '<svg style="position:absolute;inset:0" width="600" height="400">' + GLOW_DEF + (
    '<g fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.4">'
    '<path d="M136 219L158 219" marker-end="url(#arr)"/>'
    '<path d="M276 212C288 212 288 144 298 144" marker-end="url(#arr)"/>'
    '<path d="M276 226C288 226 288 294 298 294" marker-end="url(#arr)"/>'
    '<path d="M416 144L438 144" marker-end="url(#arr)"/>'
    '<path d="M498 125C498 97 358 97 358 123" marker-end="url(#arr)" stroke="%s" stroke-dasharray="3 3"/>'
    '<path d="M498 163L498 273" marker-end="url(#arr)"/>'
    '<path d="M416 294L438 294" marker-end="url(#arr)"/>'
    '<path d="M78 200C78 120 140 74 158 74" marker-end="url(#arr)"/>'
    '<path d="M276 74L572 74Q584 74 584 86L584 282Q584 294 572 294L558 294" marker-end="url(#arr)" stroke="%s" stroke-dasharray="5 4"/>'
    '</g>'
    '<text x="428" y="92" text-anchor="middle" font-size="9" fill="%s" font-family="JetBrains Mono">regenerate</text>'
    '<text x="505" y="222" font-size="9" fill="rgba(255,255,255,.7)" font-family="JetBrains Mono">Neo4j · READ</text>'
    '<text x="430" y="67" text-anchor="middle" font-size="9" fill="%s" font-family="JetBrains Mono">cache hit · ~0.1 ms</text>'
    '</svg>') % (C, B, C, B)
files['rag-2'] = page('rag', 'm',
    '<div style="position:absolute;left:20px;top:18px"><div class="eyebrow">LangGraph state machine</div></div>' + edges +
    pill(20, 200, 'User query', 'natural language') + pill(160, 200, 'Router', 'pick a pathway', True) +
    pill(160, 55, 'Redis L1 cache', 'SHA-hashed, normalised') +
    pill(300, 125, 'Text → Cypher', 'few-shot, k = 8') + pill(440, 125, 'Validator', 'syntax + direction', True) +
    pill(300, 275, 'Doc retrieval', 'vector search') + pill(440, 275, 'Answer', 'SSE token stream') +
    '<div style="position:absolute;left:20px;bottom:18px;display:flex;gap:6px">'
    '<span class="chip">4 deterministic pathways</span><span class="chip">0 runtime graph errors</span></div>',
    [(-80, 220, 300, 260, A, .55), (380, -80, 280, 240, B, .35), (300, 260, 260, 200, C, .3)])

cypher_rag = ('<span class="k">MATCH</span> (v:<span class="f">Visit</span>)-[:<span class="n">AT</span>]->(d:<span class="f">Department</span>)\n'
              '<span class="k">WHERE</span> v.date >= <span class="f">date</span>(<span class="s">"2026-07-01"</span>)\n'
              '<span class="k">RETURN</span> d.name, <span class="f">count</span>(v) <span class="k">AS</span> visits\n'
              '<span class="k">ORDER BY</span> visits <span class="k">DESC LIMIT</span> <span class="n">3</span>')
files['rag-3'] = page('rag', 'l',
    '<div class="bg">' + network(700, 550, 46, 7, A, B, .3) + '</div>' +
    '<div class="stage"><div class="glass" style="width:540px;padding:16px 18px 14px;border-radius:24px">'
    '<div style="display:flex;align-items:center;gap:6px;margin-bottom:14px">'
    '<span class="dot" style="background:#ff5f57"></span><span class="dot" style="background:#febc2e"></span><span class="dot" style="background:#28c840"></span>'
    '<span style="font-size:12px;font-weight:600;margin-left:8px">Hybrid Graph RAG</span>'
    '<span class="chip" style="margin-left:auto;font-size:10px"><span class="dot" style="background:%s;width:6px;height:6px"></span>streaming</span></div>'
    '<div style="display:flex;justify-content:flex-end"><div style="max-width:330px;padding:9px 13px;border-radius:16px 16px 4px 16px;background:linear-gradient(135deg,%s,%s);font-size:12.5px;line-height:1.4">Which 3 departments had the most visits last quarter?</div></div>'
    '<div style="display:flex;gap:6px;margin:12px 0 8px"><span class="chip mono" style="font-size:9.5px">router → text_to_cypher</span><span class="chip mono" style="font-size:9.5px">few-shot k=8</span><span class="chip mono" style="font-size:9.5px">validator ✓</span></div>'
    '<div class="code mono">%s</div>'
    '<div style="display:flex;gap:6px;margin:8px 0 12px"><span class="chip" style="font-size:9.5px">🔒 read-only session</span><span class="chip" style="font-size:9.5px">LIMIT 200 ceiling</span><span class="chip" style="font-size:9.5px">0 mutations</span></div>'
    '<div style="max-width:400px;padding:10px 13px;border-radius:16px 16px 16px 4px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.12);font-size:12.5px;line-height:1.45">Cardiology leads with <b>1,284</b> visits, then Orthopedics (<b>1,107</b>) and Neurology (<b>962</b>).<span style="display:inline-block;width:7px;height:13px;background:%s;margin-left:3px;vertical-align:-2px;border-radius:1px"></span></div>'
    '<div style="margin-top:14px;display:flex;align-items:center;gap:8px;padding:8px 8px 8px 14px;border-radius:999px;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.12)">'
    '<span class="muted" style="font-size:11.5px">Ask the graph anything…</span>'
    '<span style="margin-left:auto;width:26px;height:26px;border-radius:50%%;background:linear-gradient(135deg,%s,%s);display:grid;place-items:center;font-size:13px">↑</span></div>'
    '</div></div>' % (B, A, C, cypher_rag, B, A, B),
    [(-100, -60, 360, 320, A, .6), (420, 300, 380, 320, B, .45), (380, -80, 260, 240, C, .35)])

# ===================== 02 · NIC chatbot =====================
A, B, C = THEMES['nic']
lines = ''.join('<div style="height:5px;border-radius:3px;background:rgba(255,255,255,%.2f);width:%d%%;margin-top:7px"></div>' % (.22 if i % 4 else .4, w)
                for i, w in enumerate([70, 92, 85, 60, 95, 88, 40, 82, 55]))
triple = lambda s, p, o: ('<div class="mono" style="font-size:10.5px;display:flex;align-items:center;gap:5px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.08)">'
                          '<span class="chip" style="font-size:10px;padding:3px 8px">%s</span><span style="color:%s">─[:%s]→</span>'
                          '<span class="chip" style="font-size:10px;padding:3px 8px">%s</span></div>') % (s, C, p, o)
files['nic-1'] = page('nic', 's',
    '<div class="stage" style="gap:16px">'
    '<div class="glass" style="width:120px;height:160px;padding:14px;border-radius:14px;position:relative">'
    '<span style="position:absolute;top:10px;right:10px;font-size:9px;font-weight:700;padding:2px 6px;border-radius:5px;background:#ff4d4f">PDF</span>'
    '<div style="height:8px;width:55%;border-radius:3px;background:rgba(255,255,255,.55);margin-top:12px"></div>' + lines + '</div>'
    '<div style="display:flex;flex-direction:column;align-items:center;gap:4px"><span class="mono muted" style="font-size:9px">extract</span><span style="font-size:20px;color:%s">→</span><span class="mono muted" style="font-size:9px">structure</span></div>' % C +
    '<div class="glass" style="width:330px;padding:12px 14px 8px">'
    '<div class="eyebrow" style="margin-bottom:4px">Subject · Predicate · Object</div>' +
    triple('Hut Bay', 'IN', 'Little Andaman') + triple('School', 'LOCATED_IN', 'Hut Bay') + triple('Police Station', 'SERVES', 'Netaji Nagar') +
    '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:8px"><span class="big accent" style="font-size:24px">5,000+</span><span class="muted" style="font-size:10.5px">triples from 40+ offline PDFs</span></div>'
    '</div></div>',
    [(-60, -60, 240, 240, A, .6), (420, 140, 260, 220, B, .5)])

cypher_nic = ('<span class="k">MATCH</span> (v:<span class="f">Village</span> {name:<span class="s">"Hut Bay"</span>})\n'
              '      <-[:<span class="n">SERVES</span>]-(p:<span class="f">PoliceStation</span>)\n'
              '<span class="k">RETURN</span> p.name, p.contact <span class="k">LIMIT</span> <span class="n">10</span>')
nstat = lambda n, l: '<div class="glass" style="flex:1;padding:10px 12px;border-radius:14px"><div class="big accent" style="font-size:24px">%s</div><div class="muted" style="font-size:10px;margin-top:4px">%s</div></div>' % (n, l)
files['nic-2'] = page('nic', 'm',
    '<div style="position:absolute;inset:0;padding:22px 30px;display:flex;flex-direction:column;gap:10px">'
    '<div class="eyebrow">Intent → dynamic Cypher</div>'
    '<div class="glass" style="padding:10px 14px;border-radius:14px;font-size:13px">“Show police stations near Hut Bay”</div>'
    '<div style="display:flex;gap:10px">'
    '<div class="glass" style="flex:1;padding:10px 12px;border-radius:14px"><div class="eyebrow" style="font-size:8.5px">Intent</div>'
    '<div class="chip mono" style="margin-top:7px;font-size:10px;border-color:%s">LOCATE_FACILITY</div>' % A +
    '<div style="display:flex;align-items:center;gap:6px;margin-top:8px"><div style="flex:1;height:5px;border-radius:3px;background:rgba(255,255,255,.12)"><div style="width:94%%;height:100%%;border-radius:3px;background:linear-gradient(90deg,%s,%s)"></div></div><span class="mono" style="font-size:9.5px">0.94</span></div></div>' % (A, B) +
    '<div class="glass" style="flex:1;padding:10px 12px;border-radius:14px"><div class="eyebrow" style="font-size:8.5px">Entities</div>'
    '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:7px"><span class="chip" style="font-size:10px">Hut Bay · Village</span><span class="chip" style="font-size:10px">police station · Facility</span></div></div>'
    '</div>'
    '<div class="code mono">%s</div>' % cypher_nic +
    '<div style="display:flex;gap:10px">' + nstat('+40%', 'query accuracy') + nstat('−30%', 'response latency') + nstat('90%+', 'query success') + '</div>'
    '</div>',
    [(-80, 160, 300, 280, A, .5), (380, -60, 300, 240, B, .4), (300, 260, 220, 200, C, .25)])

# knowledge graph of Little Andaman
cx, cy = 350, 262
# Nodes sit over the edges, so they're opaque (glass would show the lines through)
NODE_BG = 'background:linear-gradient(160deg,#1f2b2b,#121a1a)'
villages = ['Hut Bay', 'Netaji Nagar', 'Ramakrishnapur', 'Vivekanandpur', 'Harminder Bay']
sat_kinds = [['School', 'Police Stn'], ['School', 'Health Centre'], ['Farm', 'School', 'Police Stn'], ['School', 'Farm'], ['Police Stn', 'Jetty']]
svg = ''
nodes = ''
for i, v in enumerate(villages):
    ang = -math.pi / 2 + i * 2 * math.pi / len(villages)
    vx, vy = cx + 185 * math.cos(ang), cy + 140 * math.sin(ang)
    hi = i in (0, 2)
    svg += '<line x1="%d" y1="%d" x2="%.0f" y2="%.0f" stroke="%s" stroke-width="%s"/>' % (cx, cy, vx, vy, C if hi else 'rgba(255,255,255,.3)', 1.8 if hi else 1)
    kinds = sat_kinds[i]
    for k, kind in enumerate(kinds):
        a2 = ang + (k - (len(kinds) - 1) / 2) * 0.95
        sx, sy = vx + 100 * math.cos(a2), vy + 70 * math.sin(a2)
        lit = hi and kind in ('School', 'Police Stn')
        svg += '<line x1="%.0f" y1="%.0f" x2="%.0f" y2="%.0f" stroke="%s" stroke-width="1"/>' % (vx, vy, sx, sy, C if lit else 'rgba(255,255,255,.22)')
        nodes += ('<div style="position:absolute;left:%.0fpx;top:%.0fpx;transform:translate(-50%%,-50%%);padding:3px 8px;border-radius:999px;font-size:9.5px;'
                  'background:%s;border:1px solid %s;color:%s;white-space:nowrap">%s</div>') % (
            sx, sy, '#123a33' if lit else '#161a1c', C if lit else 'rgba(255,255,255,.18)',
            '#fff' if lit else 'rgba(255,255,255,.7)', kind)
    nodes += ('<div class="glass" style="position:absolute;left:%.0fpx;top:%.0fpx;transform:translate(-50%%,-50%%);padding:5px 11px;border-radius:999px;font-size:11px;font-weight:600;white-space:nowrap;%s;%s">%s</div>') % (
        vx, vy, NODE_BG,'border-color:%s;box-shadow:0 0 18px rgba(25,211,162,.45),inset 0 1px 0 rgba(255,255,255,.25)' % C if hi else '', v)
files['nic-3'] = page('nic', 'l',
    '<svg style="position:absolute;inset:0" width="700" height="550">%s</svg>' % svg + nodes +
    '<div style="position:absolute;left:%dpx;top:%dpx;transform:translate(-50%%,-50%%);width:104px;height:104px;border-radius:50%%;display:grid;place-items:center;text-align:center;'
    'background:radial-gradient(circle at 35%% 30%%,#5fa896,#1b6f5d 45%%,#0d2b27);border:1px solid rgba(255,255,255,.35);box-shadow:0 0 50px rgba(25,211,162,.5)">'
    '<span style="font-size:13px;font-weight:700;line-height:1.1">Little<br>Andaman</span></div>' % (cx, cy) +
    '<div style="position:absolute;left:22px;top:20px"><div class="eyebrow">Neo4j knowledge graph</div></div>'
    '<div class="glass" style="position:absolute;left:22px;right:22px;bottom:20px;padding:11px 14px;border-radius:18px;display:flex;align-items:center;gap:12px">'
    '<div style="flex:1"><div style="font-size:12.5px">Which villages have both a school and a police station?</div>'
    '<div class="muted" style="font-size:10.5px;margin-top:3px">2 villages found · Hut Bay, Ramakrishnapur</div></div>'
    '<span class="chip mono" style="font-size:9.5px">Gemini → Cypher → Neo4j</span></div>',
    [(-80, -80, 340, 300, A, .45), (420, 260, 360, 320, B, .4), (250, 120, 220, 200, C, .18)])

# ===================== 03 · SheetAI =====================
A, B, C = THEMES['sheet']
files['sheet-1'] = page('sheet', 's',
    '<div class="stage" style="flex-direction:column;gap:12px">'
    '<div style="display:flex;align-items:center;gap:8px;align-self:flex-start;margin-left:40px"><span style="width:20px;height:20px;border-radius:6px;background:linear-gradient(135deg,%s,%s);display:grid;place-items:center;font-size:11px;font-weight:800;color:#06240f">S</span><span style="font-size:14px;font-weight:700">SheetAI</span></div>' % (A, B) +
    '<div class="glass" style="width:520px;padding:10px 10px 10px 16px;border-radius:999px;display:flex;align-items:center;gap:10px">'
    '<span style="font-size:15px;color:%s">✦</span>' % B +
    '<span style="font-size:13px;flex:1">Monthly sales by region with target, actual and variance<span style="display:inline-block;width:1.5px;height:14px;background:#fff;margin-left:2px;vertical-align:-2px"></span></span>'
    '<span style="padding:7px 14px;border-radius:999px;background:linear-gradient(135deg,%s,%s);color:#052e12;font-size:12px;font-weight:700">Generate</span></div>' % (A, B) +
    '<div style="display:flex;gap:8px;align-items:center;align-self:flex-start;margin-left:40px"><span class="chip mono" style="font-size:10px;padding:2px 8px;border-radius:6px">Tab ↹</span><span class="muted" style="font-size:10.5px">cycle example prompts</span><span class="chip" style="font-size:10px;margin-left:6px">Gemini</span><span class="chip" style="font-size:10px">SheetJS</span></div>'
    '</div>',
    [(-40, 120, 260, 220, A, .55), (380, -80, 280, 220, B, .35), (420, 160, 200, 160, C, .35)])

hist = lambda name, meta: ('<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08)">'
                           '<span style="width:24px;height:24px;border-radius:6px;background:rgba(34,197,94,.2);border:1px solid rgba(34,197,94,.5);display:grid;place-items:center;font-size:9px;font-weight:700;color:%s">XLS</span>'
                           '<div style="flex:1"><div style="font-size:11.5px">%s</div><div class="muted" style="font-size:9.5px">%s</div></div><span class="muted" style="font-size:13px">↓</span></div>') % (B, name, meta)
files['sheet-2'] = page('sheet', 'm',
    '<div class="stage" style="gap:14px;align-items:stretch;padding:40px 34px">'
    '<div style="flex:1.1;display:flex;flex-direction:column;gap:14px">'
    '<div class="glass" style="padding:14px 16px">'
    '<div style="display:flex;align-items:center;gap:10px"><span style="width:38px;height:44px;border-radius:8px;background:linear-gradient(160deg,%s,#15803d);display:grid;place-items:center;font-size:11px;font-weight:800;color:#052e12">XLSX</span>' % A +
    '<div><div style="font-size:13px;font-weight:600">sales_by_region.xlsx</div><div class="muted" style="font-size:10px">12 rows · 6 columns · generated in 1.4s</div></div></div>'
    '<div style="margin-top:12px;padding:8px;border-radius:999px;text-align:center;background:linear-gradient(135deg,%s,%s);color:#052e12;font-size:12px;font-weight:700">↓ Download</div></div>' % (A, B) +
    '<div class="glass" style="flex:1;padding:14px 16px;display:flex;flex-direction:column;justify-content:center">'
    '<div class="big accent" style="font-size:44px">~70%</div><div style="font-size:12px;margin-top:6px">less time building reports</div>'
    '<div class="muted" style="font-size:10px;margin-top:2px">90%+ field-mapping accuracy</div></div></div>'
    '<div class="glass" style="flex:1;padding:14px 16px"><div class="eyebrow" style="margin-bottom:4px">History</div>' +
    hist('sales_by_region.xlsx', 'just now') + hist('employee_attendance_q3.xlsx', '2 h ago') + hist('inventory_reorder.xlsx', 'yesterday') + hist('student_marks_sem5.xlsx', '3 days ago') +
    '</div></div>',
    [(-80, 200, 300, 260, A, .5), (360, -60, 300, 240, B, .3), (300, 250, 240, 200, C, .3)])

rows = [('North', 'Jul', 420, 452), ('North', 'Aug', 440, 431), ('North', 'Sep', 460, 498), ('South', 'Jul', 380, 366),
        ('South', 'Aug', 390, 412), ('South', 'Sep', 400, 389), ('East', 'Jul', 310, 335), ('East', 'Aug', 320, 341),
        ('East', 'Sep', 330, 318), ('West', 'Jul', 500, 534), ('West', 'Aug', 520, 507), ('West', 'Sep', 540, 571)]
cell = 'padding:0 8px;height:28px;display:flex;align-items:center;border-right:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07);font-size:11px'
grid_cols = '28px 1fr 0.8fr 1fr 1fr 1fr 1.15fr'
g = ''.join('<div style="%s;justify-content:center;color:rgba(255,255,255,.4);font-size:9.5px;height:20px">%s</div>' % (cell, c) for c in ['', 'A', 'B', 'C', 'D', 'E', 'F'])
g += ''.join('<div style="%s;%s">%s</div>' % (cell, 'justify-content:center;color:rgba(255,255,255,.4);font-size:9.5px' if i == 0 else 'font-weight:600;background:rgba(34,197,94,.14)', c)
             for i, c in enumerate(['1', 'Region', 'Month', 'Target (₹k)', 'Actual (₹k)', 'Variance', 'Status']))
for r, (reg, mo, t, a) in enumerate(rows):
    v = a - t
    pct = v / t * 100
    ok = v >= 0
    g += '<div style="%s;justify-content:center;color:rgba(255,255,255,.4);font-size:9.5px">%d</div>' % (cell, r + 2)
    g += '<div style="%s">%s</div><div style="%s">%s</div>' % (cell, reg, cell, mo)
    g += '<div class="mono" style="%s;justify-content:flex-end;font-size:10.5px">%d</div><div class="mono" style="%s;justify-content:flex-end;font-size:10.5px">%d</div>' % (cell, t, cell, a)
    g += '<div class="mono" style="%s;justify-content:flex-end;font-size:10.5px;color:%s">%+.1f%%</div>' % (cell, B if ok else '#ff7a7a', pct)
    g += '<div style="%s"><span class="chip" style="font-size:9.5px;padding:1px 8px;%s">%s</span></div>' % (
        cell, 'border-color:rgba(163,230,53,.5);color:%s' % B if ok else 'border-color:rgba(255,122,122,.5);color:#ff9a9a', 'On track' if ok else 'Behind')
files['sheet-3'] = page('sheet', 'l',
    '<div class="stage"><div class="glass" style="width:610px;border-radius:22px;overflow:hidden">'
    '<div style="display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.1)">'
    '<span style="width:20px;height:20px;border-radius:6px;background:linear-gradient(135deg,%s,%s);display:grid;place-items:center;font-size:11px;font-weight:800;color:#06240f">S</span>' % (A, B) +
    '<span style="font-size:13px;font-weight:700">SheetAI</span>'
    '<span class="chip" style="margin-left:10px;font-size:10.5px;max-width:330px;overflow:hidden">✦ Monthly sales by region with target, actual and variance</span>'
    '<span style="margin-left:auto;padding:5px 12px;border-radius:999px;background:linear-gradient(135deg,%s,%s);color:#052e12;font-size:11px;font-weight:700">↓ .xlsx</span></div>' % (A, B) +
    '<div style="display:flex;gap:6px;padding:6px 14px;border-bottom:1px solid rgba(255,255,255,.08);align-items:center"><span class="mono muted" style="font-size:10px;padding:2px 6px;border:1px solid rgba(255,255,255,.12);border-radius:5px">E2</span><span class="mono" style="font-size:10.5px;color:rgba(255,255,255,.75)">=(D2-C2)/C2</span></div>'
    '<div style="display:grid;grid-template-columns:%s;background:rgba(0,0,0,.25)">%s</div>' % (grid_cols, g) +
    '<div style="display:flex;gap:14px;padding:8px 14px" class="muted"><span style="font-size:10px">Sheet1</span><span style="font-size:10px;margin-left:auto">12 rows · generated by Gemini</span></div>'
    '</div></div>',
    [(-100, 300, 380, 320, A, .5), (420, -80, 360, 300, B, .3), (380, 330, 280, 240, C, .35)])

# ===================== 04 · AI Hover Mouse =====================
A, B, C = THEMES['hover']
def gesture(pose, title, sub, extra=''):
    h, pts = hand_svg(pose, 0, 0, 0.11, lw=7, r=13)
    return ('<div class="glass" style="width:166px;padding:12px 12px 14px;text-align:center">'
            '<svg width="110" height="110" viewBox="12 24 78 78" style="display:block;margin:0 auto">%s%s%s</svg>'
            '<div style="font-size:13px;font-weight:600;margin-top:4px">%s</div><div class="muted" style="font-size:10px;margin-top:2px">%s</div></div>') % (GLOW_DEF, h, extra(pts) if extra else '', title, sub)
vol_line = lambda pts: '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="1.6" stroke-dasharray="3 2"/>' % (pts[4] + pts[8] + (B,))
pinch = lambda pts: '<circle cx="%.1f" cy="%.1f" r="6" fill="none" stroke="%s" stroke-width="1.4"/>' % ((pts[8][0] + pts[12][0]) / 2, (pts[8][1] + pts[12][1]) / 2 - 2, B)
files['hover-1'] = page('hover', 's',
    '<div class="stage" style="gap:12px">' +
    gesture('move', 'Move', 'index finger up') + gesture('click', 'Click', 'pinch index + middle', pinch) + gesture('volume', 'Volume', 'spread thumb + index', vol_line) +
    '</div>',
    [(-60, -60, 240, 240, A, .55), (420, 120, 260, 240, C, .4), (220, 180, 200, 160, B, .25)])

hstat = lambda n, l, s: '<div class="glass" style="padding:16px 18px"><div class="big accent" style="font-size:42px">%s</div><div style="font-size:12.5px;font-weight:500;margin-top:8px">%s</div><div class="muted" style="font-size:10px;margin-top:2px">%s</div></div>' % (n, l, s)
files['hover-2'] = page('hover', 'm',
    '<div style="position:absolute;inset:0;padding:34px 40px;display:grid;grid-template-columns:1fr 1fr;gap:14px">' +
    hstat('95%', 'Cursor accuracy', 'index-tip tracking, smoothed') + hstat('&lt;50<span style="font-size:24px">ms</span>', 'Response latency', 'webcam frame → cursor move') +
    hstat('−40%', 'False detections', 'noise reduction across lighting') + hstat('21', 'Hand landmarks', 'MediaPipe Hand Landmarker') +
    '</div>',
    [(-80, 200, 300, 260, A, .5), (380, -60, 300, 240, C, .35), (300, 260, 240, 200, B, .25)])

h, pts = hand_svg('move', 115, 10, 0.5, lw=5, r=9)
tip = pts[8]
trail = ''.join('<circle cx="%.0f" cy="%.0f" r="%.1f" fill="%s" opacity="%.2f"/>' % (tip[0] + 40 + k * 22, tip[1] - 30 - k * 9, 2 + k * .5, B, .15 + k * .12) for k in range(6))
cursor_x, cursor_y = tip[0] + 40 + 6 * 22, tip[1] - 30 - 6 * 9
cursor = '<path transform="translate(%.0f %.0f)" d="M0 0L0 22L6 16L10 26L14 24L10 15L18 15Z" fill="#fff" stroke="#111" stroke-width="1.2"/>' % (cursor_x, cursor_y)
corners = ''.join('<path d="%s" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>' % d for d in
                  ['M30 52V30H52', 'M648 30H670V52', 'M30 498V520H52', 'M648 520H670V498'])
files['hover-3'] = page('hover', 'l',
    '<div class="bg" style="background:radial-gradient(ellipse at 50% 55%,rgba(255,138,61,.16),transparent 60%),radial-gradient(ellipse at center,transparent 45%,rgba(0,0,0,.75))"></div>'
    '<svg style="position:absolute;inset:0" width="700" height="550">' + GLOW_DEF + corners +
    '<rect x="120" y="80" width="460" height="360" rx="18" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.4" stroke-dasharray="6 5"/>'
    '<text x="580" y="72" text-anchor="end" font-size="9.5" fill="rgba(255,255,255,.55)" font-family="JetBrains Mono">active region</text>' +
    h + '<circle cx="%.0f" cy="%.0f" r="15" fill="none" stroke="%s" stroke-width="1.6"/>' % (tip[0], tip[1], B) +
    '<circle cx="%.0f" cy="%.0f" r="24" fill="none" stroke="%s" stroke-width="1" opacity=".45"/>' % (tip[0], tip[1], B) + trail + cursor + '</svg>'
    '<div class="mono" style="position:absolute;left:44px;top:42px;font-size:11px;line-height:1.7"><div>FPS <span style="color:%s">30</span></div><div class="muted">MODE · MOVE</div></div>' % B +
    '<div class="chip mono" style="position:absolute;right:44px;top:40px;font-size:10px"><span class="dot" style="background:#ff4d4f;width:6px;height:6px"></span>CAM 0</div>'
    '<div class="glass" style="position:absolute;left:50%;bottom:36px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;padding:8px 16px;border-radius:999px">'
    '<span class="mono" style="font-size:10.5px">VOL</span><div style="width:150px;height:5px;border-radius:3px;background:rgba(255,255,255,.15)"><div style="width:62%;height:100%;border-radius:3px;background:linear-gradient(90deg,var(--a),var(--b))"></div></div><span class="mono" style="font-size:10.5px">62%</span>'
    '<span style="width:1px;height:14px;background:rgba(255,255,255,.2)"></span><span style="font-size:10.5px;white-space:nowrap" class="muted">OpenCV · MediaPipe</span></div>',
    [(-80, 300, 340, 300, A, .35), (440, -60, 320, 280, C, .3)])

for name, html in files.items():
    with open(os.path.join(OUT, name + '.html'), 'w', encoding='utf-8') as fh:
        fh.write(html)
print('wrote', len(files))
