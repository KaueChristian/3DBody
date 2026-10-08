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


def add(pid, cat, pattern, smooth=4, tris=9000, region="tronco", mirror=False):
    """mirror=True: o banco só tem um lado; o conversor acrescenta a cópia espelhada (x → −x)."""
    BODY[pid] = dict(cat=cat, pattern=pattern, smooth=smooth, tris=tris, region=region, mirror=mirror)


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
for k, pat in [("pubococcigeo", r"pubococcygeus"), ("iliococcigeo", r"iliococcygeus"), ("esfincter_anal_ext", r"external anal sphincter"),
               ("perineo_superficial", r"superficial perineal muscle")]:
    add(k, "musculo", LR + pat, 5, 5000, "tronco")


# F2.2 — tórax e pescoço, sem decimar (a decimação por agrupamento abre buracos em lâminas finas como estas). Levantadores
# das costelas: o banco tem os dois lados. Longo do pescoço: só as três partes do lado
# esquerdo (FJ1557, FJ1600, FJ1601), por isso o espelho.
add("levantadores_costelas_curtos", "musculo", r"set of " + LR + "levatores costarum breves", 5, 13000, "tronco")
add("levantadores_costelas_longos", "musculo", r"set of " + LR + "levatores costarum longi", 5, 25000, "tronco")
add("longo_pescoco", "musculo", r"(?:superior oblique|inferior oblique|vertical intermediate) part of " + LR + "longus colli", 5, 8000,
    "cabeca", mirror=True)


def resolve():
    out = {}
    for pid, d in BODY.items():
        es = elems(d["pattern"])
        out[pid] = es
    return out


if __name__ == "__main__":
    res = resolve()
    miss = [k for k, v in res.items() if not v]
    tot = 0
    for k, v in res.items():
        sz = sum(idx[e][1] for e in v if e in idx)
        tot += sz
    print("peças:", len(res), "sem elementos:", miss)
    print("compactado total:", tot // 1000, "KB")
    big = sorted(((sum(idx[e][1] for e in v if e in idx), k, len(v)) for k, v in res.items()), reverse=True)[:12]
    print(big)
    # contagem de elementos por peça incomum
    odd = [(k, len(v)) for k, v in res.items() if v and len(v) not in (1, 2)]
    print("elementos != 1/2:", odd)
