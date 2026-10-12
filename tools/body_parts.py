"""Definição das peças do corpo (tronco e membros superiores) a partir de nomes de conceitos do BodyParts3D."""
import collections
import re

names = {}
m = collections.defaultdict(list)
for line in open("isa_element_parts.txt", encoding="utf-8").read().splitlines()[1:]:
    c, n, e = line.split("\t")
    m[c].append(e)
    names[c] = n

idx = {}
for line in open("zip_index.tsv"):
    f, fs, cs, off = line.strip().split("\t")
    idx[f.split("/")[-1][:-4]] = (int(fs), int(cs), int(off))


def elems(pattern):
    """União dos elementos de todos os conceitos cujo nome casa (fullmatch) com o padrão."""
    out = []
    for c, n in names.items():
        if re.fullmatch(pattern, n, re.I) and 1 <= len(m.get(c, [])) <= 8:
            for e in m[c]:
                if e not in out:
                    out.append(e)
    return out


LR = r"(?:left |right )?"
R = LR  # atalho

# id: (categoria, regex do nome do conceito, suavização, limite de triângulos por peça)
BODY = {}


def add(pid, cat, pattern, smooth=4, tris=9000, region="tronco", mirror=False, exclude=(), pack="body"):
    """mirror=True: o banco só tem um lado; o conversor acrescenta a cópia espelhada (x → −x).
    exclude: elementos a ignorar (o banco repete alguns como `…M`, cópia espelhada do outro lado que já existe).
    pack: pacote de dados em que a peça entra ('body' = dist/anatomy-body.js, 'leg' = dist/anatomy-leg.js, F4)."""
    BODY[pid] = dict(cat=cat, pattern=pattern, smooth=smooth, tris=tris, region=region, mirror=mirror, exclude=tuple(exclude), pack=pack)


# ───────── Ossos ─────────
for k, pat in [
    ("clavicula", r"clavicle"), ("escapula", r"scapula"), ("umero", r"humerus"), ("radio", r"radius"), ("ulna", r"ulna"),
    ("osso_quadril", r"hip bone"), ("sacro", r"sacrum"),
]:
    add(k, "osso", LR + pat, 4, 7000)
add("esterno_manubrio", "osso", r"manubrium", 3)
add("esterno_corpo", "osso", r"body of sternum", 3)
add("esterno_xifoide", "osso", r"xiphoid process", 3)
ORD = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"]
for i, o in enumerate(ORD):
    add(f"costela_{i + 1}", "osso", LR + o + " rib", 3, 2600)
for i, o in enumerate(ORD[:7]):
    add(f"cartilagem_costal_{i + 1}", "cartilagem", LR + o + " costal cartilage", 3, 1200)
for i, o in enumerate(ORD):
    add(f"vertebra_t{i + 1}", "osso", o + " thoracic vertebra", 3, 3000)
for i, o in enumerate(ORD[:5]):
    add(f"vertebra_l{i + 1}", "osso", o + " lumbar vertebra", 3, 3000)
for k, pat in [("escafoide", r"scaphoid"), ("semilunar", r"lunate"), ("piramidal", r"triquetral"), ("pisiforme", r"pisiform"),
               ("trapezio", r"trapezium"), ("trapezoide", r"trapezoid"), ("capitato", r"capitate"), ("hamato", r"hamate")]:
    add("carpo_" + k, "osso", LR + pat, 3, 1500)
for i, o in enumerate(ORD[:5]):
    add(f"metacarpal_{i + 1}", "osso", LR + o + " metacarpal bone", 3, 1500)
for kind, en in [("proximal", "proximal"), ("media", "middle"), ("distal", "distal")]:
    for fi, fn in [("polegar", "thumb"), ("indicador", "index finger"), ("medio", "middle finger"), ("anelar", "ring finger"), ("minimo", "little finger")]:
        if kind == "media" and fi == "polegar":
            continue
        add(f"falange_{kind}_{fi}", "osso", LR + en + " phalanx of " + LR + fn, 3, 900)
for i, o in enumerate(["second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"]):
    pass
# discos intervertebrais
add("discos_cervicais", "cartilagem", r"intervertebral disk of (?:third|fourth|fifth|sixth|seventh) cervical vertebra|intervertebral disk of axis", 3, 800)
add("discos_toracicos", "cartilagem", r"intervertebral disk of (?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh) thoracic vertebra", 3, 800)
add("discos_lombares", "cartilagem", r"intervertebral disk of (?:first|second|third|fourth|fifth) lumbar vertebra", 3, 800)

# ───────── Pele do corpo ─────────
add("pele_corpo", "pele", r"skin", 6, 70000)

# ───────── Músculos: cintura escapular e ombro ─────────
for k, pat in [
    ("delt_clav", r"clavicular part of deltoid"), ("delt_acro", r"acromial part of deltoid"), ("delt_esp", r"spinal part of deltoid"),
    ("supraespinal", r"supraspinatus"), ("infraespinal", r"infraspinatus(?: muscle)?"), ("redondo_menor", r"teres minor"),
    ("redondo_maior", r"teres major"), ("subescapular", r"subscapularis"), ("coracobraquial", r"coracobrachialis"),
    ("peitoral_clav", r"clavicular part of pectoralis major"), ("peitoral_esternocostal", r"sternocostal part of pectoralis major"),
    ("peitoral_abdominal", r"abdominal part of pectoralis major"), ("peitoral_menor", r"pectoralis minor"),
    ("subclavio", r"subclavius"), ("serratil_anterior", r"serratus anterior"),
    ("trapezio_desc", r"descending part of trapezius"), ("trapezio_transv", r"transverse part of trapezius"),
    ("trapezio_asc", r"ascending part of trapezius"), ("levantador_escapula", r"levator scapulae"),
    ("rombo_maior", r"rhomboid major"), ("rombo_menor", r"rhomboid minor"),
]:
    add(k, "musculo", R + pat, 5, 8000, "tronco" if k.startswith(("peitoral", "subclavio", "serratil", "trapezio", "levantador", "rombo")) else "membro_sup")

# ───────── Braço e antebraço ─────────
for k, pat in [
    ("biceps_longa", r"long head of biceps brachii"), ("biceps_curta", r"short head of biceps brachii"), ("braquial", r"brachialis"),
    ("triceps_longa", r"long head of triceps brachii"), ("triceps_lateral", r"lateral head of triceps brachii"),
    ("triceps_medial", r"medial head of triceps brachii"), ("anconeo", r"anconeus"),
    ("braquiorradial", r"brachioradialis"), ("pronador_redondo_h", r"humeral head of pronator teres"),
    ("pronador_redondo_u", r"ulnar head of pronator teres"), ("fcr", r"flexor carpi radialis"), ("palmar_longo", r"palmaris longus"),
    ("fcu_h", r"humeral head of flexor carpi ulnaris"), ("fcu_u", r"ulnar head of flexor carpi ulnaris"),
    ("fds", r"flexor digitorum superficialis"), ("fdp", r"flexor digitorum profundus"), ("fpl", r"flexor pollicis longus"),
    ("pronador_quadrado", r"pronator quadratus"), ("ecrl", r"extensor carpi radialis longus"), ("ecrb", r"extensor carpi radialis brevis"),
    ("ed", r"extensor digitorum"), ("edm", r"extensor digiti minimi"), ("ecu", r"extensor carpi ulnaris"), ("supinador", r"supinator"),
    ("apl", r"abductor pollicis longus"), ("epb", r"extensor pollicis brevis"), ("epl", r"extensor pollicis longus"),
    ("extensor_indicador", r"extensor indicis"),
]:
    add(k, "musculo", R + pat, 5, 7000, "membro_sup")

# ───────── Mão ─────────
for k, pat in [
    ("abdutor_polegar_curto", r"abductor pollicis brevis"), ("flexor_polegar_curto", r"flexor pollicis brevis"),
    ("oponente_polegar", r"opponens pollicis"), ("adutor_polegar_obliquo", r"oblique head of adductor pollicis"),
    ("adutor_polegar_transverso", r"transverse head of adductor pollicis"),
    ("abdutor_minimo", r"abductor digiti minimi of " + LR + "hand"), ("flexor_minimo_curto", r"flexor digiti minimi brevis of " + LR + "hand"),
    ("oponente_minimo", r"opponens digiti minimi of " + LR + "hand"), ("interosseos_dorsais", r"set of dorsal interossei of " + LR + "hand"),
    ("interosseos_palmares", r"set of palmar interossei of " + LR + "hand"),
]:
    add(k, "musculo", R + pat if not pat.startswith(("abductor digiti", "flexor digiti", "opponens digiti", "set of")) else pat, 4, 4000, "membro_sup")

# ───────── Dorso profundo, pescoço, tórax, abdome ─────────
for k, pat in [
    ("serratil_post_sup", r"serratus posterior superior"), ("serratil_post_inf", r"serratus posterior inferior"),
    ("esplenio_cabeca", r"splenius capitis"), ("esplenio_pescoco", r"splenius cervicis"),
    ("iliocostal_lombar", r"iliocostalis lumborum"), ("iliocostal_toracico", r"iliocostalis thoracis"),
    ("iliocostal_cervical", r"iliocostalis cervicis"), ("longuissimo_toracico", r"longissimus thoracis"),
    ("longuissimo_cervical", r"longissimus cervicis"), ("longuissimo_cabeca", r"longissimus capitis"),
    ("espinal_toracico", r"spinalis thoracis"), ("semiespinal_toracico", r"semispinalis thoracis"),
    ("semiespinal_cervical", r"semispinalis cervicis"), ("semiespinal_cabeca", r"semispinalis capitis"),
    ("rotadores_cervicais", r"cervical rotator"), ("rotadores_toracicos", r"thoracic rotator"), ("rotadores_lombares", r"lumbar rotator"),
    ("interespinais_toracicos", r"interspinalis thoracis"), ("interespinais_lombares", r"set of interspinales lumborum"),
    ("intertransversarios_med", r"medial lumbar intertransversarius"), ("intertransversarios_lat", r"lateral lumbar intertransversarius"),
    ("reto_post_maior", r"rectus capitis posterior major"), ("reto_post_menor", r"rectus capitis posterior minor"),
    ("obliquo_cabeca_sup", r"obliquus capitis superior"), ("obliquo_cabeca_inf", r"obliquus capitis inferior"),
    ("longo_cabeca", r"longus capitis"), ("reto_ant_cabeca", r"rectus capitis anterior"), ("reto_lat_cabeca", r"rectus capitis lateralis"),
    ("escaleno_ant", r"scalenus anterior"), ("escaleno_med", r"scalenus medius"), ("escaleno_post", r"scalenus posterior"),
    ("esternohioideo", r"sternohyoid"), ("esternotireoideo", r"sternothyroid"), ("tireohioideo", r"thyrohyoid"), ("omohioideo", r"omohyoid"),
    ("intercostal_ext", r"external intercostal muscle"), ("intercostal_int", r"internal intercostal muscle"),
    ("intercostal_intimo", r"innermost intercostal muscle"), ("transverso_torax", r"transversus thoracis"), ("diafragma", r"diaphragm"),
    ("obliquo_externo", r"external oblique"), ("psoas_maior", r"psoas major"), ("iliaco", r"iliacus"), ("coccigeo", r"coccygeus"),
    ("linha_alba", r"linea alba"), ("retinaculo_flexores", r"flexor retinaculum of wrist"),
]:
    reg = "membro_sup" if k.startswith("retinaculo") else "tronco"
    if k in ("esplenio_cabeca", "esplenio_pescoco", "longuissimo_cabeca", "semiespinal_cabeca", "reto_post_maior", "reto_post_menor",
             "obliquo_cabeca_sup", "obliquo_cabeca_inf", "longo_cabeca", "reto_ant_cabeca", "reto_lat_cabeca", "escaleno_ant", "escaleno_med",
             "escaleno_post", "esternohioideo", "esternotireoideo", "tireohioideo", "omohioideo", "iliocostal_cervical", "longuissimo_cervical",
             "semiespinal_cervical", "rotadores_cervicais"):
        reg = "cabeca"
    tris = 14000 if k.startswith("intercostal") or k in ("diafragma",) else 7000
    add(k, "musculo" if k != "linha_alba" and k != "retinaculo_flexores" else "ligamento", r"(?:left |right )?" + pat, 5, tris, reg)


# assoalho pélvico e períneo
# o conceito "superficial perineal muscle" do banco tem as MESMAS peças do esfíncter externo do ânus (FJ1450, FJ1450M, FJ2543,
# FJ2548): não é um músculo perineal à parte. A peça `perineo_superficial` foi retirada do atlas (F2.8); a que ficou no pacote
# de dados ainda existe, sem uso, porque o pacote não é regenerado por inteiro.
for k, pat in [("pubococcigeo", r"pubococcygeus"), ("iliococcigeo", r"iliococcygeus"), ("esfincter_anal_ext", r"external anal sphincter")]:
    add(k, "musculo", LR + pat, 5, 5000, "tronco")


# F2.2 — tórax e pescoço, sem decimar (a decimação por agrupamento abre buracos em lâminas finas como estas). Levantadores
# das costelas: o banco tem os dois lados. Longo do pescoço: só as três partes do lado
# esquerdo (FJ1557, FJ1600, FJ1601), por isso o espelho.
add("levantadores_costelas_curtos", "musculo", r"set of " + LR + "levatores costarum breves", 5, 13000, "tronco")
add("levantadores_costelas_longos", "musculo", r"set of " + LR + "levatores costarum longi", 5, 25000, "tronco")
add("longo_pescoco", "musculo", r"(?:superior oblique|inferior oblique|vertical intermediate) part of " + LR + "longus colli", 5, 8000,
    "cabeca", mirror=True)


# F2.3 a F2.8 — músculos da língua, do palato, da faringe, da laringe e da pelve que o banco tem como malha. Sem decimar
# demais: são peças pequenas e finas. Pares (o banco traz os dois lados); `uvular muscle` é uma peça só.
for k, pat, tris in [
    ("genioglosso", r"genioglossus", 6000), ("hioglosso", r"hyoglossus", 5000),
    ("levantador_veu", r"levator veli palatini", 4000), ("tensor_veu", r"tensor veli palatini", 4000),
    ("musculo_uvula", r"uvular muscle", 2500), ("palatofaringeo", r"palatopharyngeus", 5000),
    ("constritor_faringe_sup", r"superior pharyngeal constrictor", 7000), ("constritor_faringe_med", r"middle pharyngeal constrictor", 7000),
    ("constritor_faringe_inf", r"inferior pharyngeal constrictor", 7000), ("estilofaringeo", r"stylopharyngeus", 4000),
    ("salpingofaringeo", r"salpingopharyngeus", 3000),
    ("cricotireoideo", r"(?:straight|oblique) part of (?:left |right )?cricothyroid", 4000),
    ("cricoaritenoideo_post", r"posterior crico-arytenoid", 3000), ("cricoaritenoideo_lat", r"lateral crico-arytenoid", 3000),
    ("aritenoideo_obliquo", r"oblique arytenoid", 2500), ("aritenoideo_transverso", r"transverse arytenoid", 2500),
    ("tireoaritenoideo", r"thyro-arytenoid", 4000), ("vocal", r"vocalis", 2500),
]:
    add(k, "musculo", (r"(?:left |right )?" + pat) if pat != r"uvular muscle" else pat, 3, tris, "cabeca")
add("puborretal", "musculo", LR + r"puborectalis", 5, 5000, "tronco", exclude=("FJ1458M",))  # FJ1458M duplica o lado esquerdo (FJ2546)
add("obturador_interno", "musculo", LR + r"obturator internus", 5, 8000, "tronco")

# F2 (cobertura) — músculos profundos da coluna cervical que o banco tem: intertransversários anteriores e posteriores e
# interespinais cervicais (ambos os lados no banco).
for k, pat in [("intertransversarios_cerv_ant", r"set of anterior cervical intertransversarii"),
               ("intertransversarios_cerv_post", r"set of posterior cervical intertransversarii"),
               ("interespinais_cervicais", r"set of interspinales cervicis")]:
    add(k, "musculo", pat, 4, 4000, "cabeca")


# ───────── F4 — membro inferior (pacote `leg`, dist/anatomy-leg.js) ─────────
# Definidas todas de uma vez para o inventário (`python body_parts.py`) mostrar o que o banco tem e o que não tem; cada lote
# só baixa e converte as suas peças (`fetch_body.py <ids>` e `convert_body.py --pack leg [--append] <ids>`).
# O banco tem os dois lados em cada conceito (e também conceitos “left …/right …”); a união já dá o par.
def addl(pid, cat, pattern, smooth=4, tris=7000, mirror=False, exclude=()):
    add(pid, cat, pattern, smooth, tris, "membro_inf", mirror, exclude, "leg")


# ossos (lote 0 = F4.1: o suficiente para provar o pacote, a região e a pele)
for k, pat, tris in [("femur", r"femur", 7000), ("patela", r"patella", 1500), ("tibia", r"tibia", 7000), ("fibula", r"fibula", 5000)]:
    addl(k, "osso", LR + pat, 4 if tris > 2000 else 3, tris)
for k, pat in [("calcaneo", r"calcaneus"), ("talo", r"talus"), ("navicular", r"navicular bone of (?:left |right )?foot"),
               ("cuboide", r"cuboid bone"), ("cuneiforme_medial", r"medial cuneiform bone"),
               ("cuneiforme_intermedio", r"intermediate cuneiform bone"), ("cuneiforme_lateral", r"lateral cuneiform bone")]:
    addl("tarso_" + k, "osso", LR + pat, 3, 2500 if k in ("calcaneo", "talo") else 1500)
for i, o in enumerate(ORD[:5]):
    addl(f"metatarsal_{i + 1}", "osso", LR + o + " metatarsal bone", 3, 1500)
TOES = [("halux", "big toe"), ("segundo", "second toe"), ("terceiro", "third toe"), ("quarto", "fourth toe"), ("minimo", "little toe")]
for kind, en in [("proximal", "proximal"), ("media", "middle"), ("distal", "distal")]:
    for fi, fn in TOES:
        if kind == "media" and fi == "halux":
            continue
        addl(f"falange_pe_{kind}_{fi}", "osso", en + " phalanx of " + LR + fn, 3, 900)
addl("sesamoides_pe", "osso", r"sesamoid bone of foot", 3, 600)

# pele inteira (com as pernas): o banco só tem a pele do corpo todo numa peça (FJ2810). O pacote `body` ficou com a parte de cima
# (cintura para cima, com os braços); recortar as pernas e emendar deixaria frestas na cintura. Esta peça a substitui no
# navegador quando o pacote do membro inferior carrega (`pele_corpo` fica sem uso no pacote body até ele ser regenerado)
add("pele_inteira", "pele", r"skin", 6, 155000, "todos", pack="leg")

# membrana interóssea da perna: o banco a tem como malha (a do antebraço foi gerada por código)
addl("membrana_interossea_perna", "ligamento", LR + r"interosseous membrane of " + LR + "leg", 5, 6000)

# quadril e coxa (lote A, F4.2)
for k, pat, tris in [
    ("gluteo_maximo", r"gluteus maximus", 9000), ("gluteo_medio", r"gluteus medius", 8000), ("gluteo_minimo", r"gluteus minimus", 7000),
    ("tensor_fascia_lata", r"tensor fasciae latae", 5000), ("piriforme", r"piriformis", 4500),
    ("gemeo_superior", r"gemellus superior", 3000), ("gemeo_inferior", r"gemellus inferior", 3000),
    ("obturador_externo", r"obturator externus", 4500), ("quadrado_femoral", r"quadratus femoris", 4500),
    ("sartorio", r"sartorius", 6000), ("reto_femoral", r"rectus femoris", 8000),
    ("vasto_lateral", r"vastus lateralis", 9000), ("vasto_medial", r"vastus medialis", 8000), ("vasto_intermedio", r"vastus intermedius", 8000),
    ("pectineo", r"pectineus", 4500), ("adutor_longo", r"adductor longus", 6000), ("adutor_curto", r"adductor brevis", 5000),
    ("adutor_magno", r"adductor magnus", 11000), ("adutor_minimo", r"adductor minimus", 5000), ("gracil", r"gracilis", 5000),
    ("biceps_femoral_longa", r"long head of biceps femoris", 7000), ("biceps_femoral_curta", r"short head of biceps femoris", 5000),
    ("semitendineo", r"semitendinosus", 6000), ("semimembranaceo", r"semimembranosus", 7000),
]:
    addl(k, "musculo", LR + pat, 5, tris)

# perna (lote B, F4.3)
for k, pat, tris in [
    ("tibial_anterior", r"tibialis anterior", 6000), ("extensor_longo_dedos", r"extensor digitorum longus", 7000),
    ("extensor_longo_halux", r"extensor hallucis longus", 4500), ("fibular_terceiro", r"fibularis tertius", 3500),
    ("fibular_longo", r"fibularis longus", 7000), ("fibular_curto", r"fibularis brevis", 4500),
    ("gastrocnemio_medial", r"medial head of gastrocnemius", 6500), ("gastrocnemio_lateral", r"lateral head of gastrocnemius", 5500),
    ("soleo", r"soleus", 8000), ("plantar", r"plantaris", 3500), ("popliteo", r"popliteus", 4000),
    ("tibial_posterior", r"tibialis posterior", 8000), ("flexor_longo_dedos", r"flexor digitorum longus", 7000),
    ("flexor_longo_halux", r"flexor hallucis longus", 6000),
]:
    addl(k, "musculo", LR + pat, 5, tris)

# pé (lote C, F4.4): intrínsecos que o banco tem. Sem malha no banco: extensor curto dos dedos (só o do hálux existe) e os
# interósseos dorsais (só os plantares) → M14 em docs/pontos-de-melhoria.md
for k, pat, tris in [
    ("extensor_curto_halux", r"extensor hallucis brevis", 3000), ("abdutor_halux", r"abductor hallucis", 4500),
    ("flexor_curto_halux_medial", r"medial head of (?:left |right )?flexor hallucis brevis", 2500),
    ("flexor_curto_halux_lateral", r"lateral head of (?:left |right )?flexor hallucis brevis", 2500),
    ("adutor_halux_obliquo", r"oblique head of adductor hallucis", 3000), ("adutor_halux_transverso", r"transverse head of adductor hallucis", 3000),
    ("abdutor_minimo_pe", r"abductor digiti minimi of (?:left |right )?foot", 4000),
    ("flexor_curto_minimo_pe", r"flexor digiti minimi brevis of (?:left |right )?foot", 2500),
    ("oponente_minimo_pe", r"opponens digiti minimi of (?:left |right )?foot", 1500),
    ("flexor_curto_dedos", r"flexor digitorum brevis", 5000), ("quadrado_plantar", r"flexor accessorius", 3000),
    ("lumbricais_pe", r"(?:first|second|third|fourth) lumbrical of (?:left |right )?foot", 3500),
    ("interosseos_plantares", r"(?:first|second|third) plantar interosseous of (?:left |right )?foot", 4500),
]:
    addl(k, "musculo", LR + pat, 4, tris)


def resolve():
    out = {}
    for pid, d in BODY.items():
        es = [e for e in elems(d["pattern"]) if e not in d["exclude"]]
        out[pid] = es
    return out


if __name__ == "__main__":
    import sys

    pack = sys.argv[1] if len(sys.argv) > 1 else "body"
    res = {k: v for k, v in resolve().items() if BODY[k]["pack"] == pack}
    miss = [k for k, v in res.items() if not v]
    tot = 0
    for k, v in res.items():
        sz = sum(idx[e][1] for e in v if e in idx)
        tot += sz
    print("pacote:", pack, "· peças:", len(res), "· sem elementos:", miss)
    print("compactado total:", tot // 1000, "KB")
    big = sorted(((sum(idx[e][1] for e in v if e in idx), k, len(v)) for k, v in res.items()), reverse=True)[:12]
    print(big)
    # contagem de elementos por peça incomum
    odd = [(k, len(v)) for k, v in res.items() if v and len(v) not in (1, 2)]
    print("elementos != 1/2:", odd)
