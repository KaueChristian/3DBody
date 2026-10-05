import numpy as np, json, os
def load(p):
    v=[];f=[]
    for l in open(p):
        if l.startswith('v '): v.append([float(x) for x in l.split()[1:4]])
        elif l.startswith('f '):
            idx=[int(t.split('/')[0])-1 for t in l.split()[1:]]
            for i in range(1,len(idx)-1): f.append([idx[0],idx[i],idx[i+1]])
    return np.array(v,dtype=np.float64),np.array(f,dtype=np.int64)
def to_site(v):
    # BP3D: x=esquerda, y=posterior, z=cima (mm)  ->  site: x=esquerda, y=cima, z=frente
    return np.stack([v[:,0], v[:,2], -v[:,1]],1)
want=json.load(open('want.json'))
