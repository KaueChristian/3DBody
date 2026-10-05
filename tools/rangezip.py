"""Leitura de arquivos individuais de um ZIP remoto via HTTP Range (sem baixar o zip inteiro)."""
import io
import sys
import time
import urllib.request
import zipfile

URL = "https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip"


class RangeFile(io.RawIOBase):
    def __init__(self, url):
        self.url = url
        req = urllib.request.Request(url, method="HEAD")
        with urllib.request.urlopen(req, timeout=60) as r:
            self.size = int(r.headers["Content-Length"])
        self.pos = 0
        self.bytes_read = 0

    def readable(self):
        return True

    def seekable(self):
        return True

    def tell(self):
        return self.pos

    def seek(self, off, whence=io.SEEK_SET):
        if whence == io.SEEK_SET:
            self.pos = off
        elif whence == io.SEEK_CUR:
            self.pos += off
        else:
            self.pos = self.size + off
        return self.pos

    def read(self, n=-1):
        if n < 0 or self.pos + n > self.size:
            n = self.size - self.pos
        if n <= 0:
            return b""
        end = self.pos + n - 1
        for attempt in range(5):
            try:
                req = urllib.request.Request(self.url, headers={"Range": f"bytes={self.pos}-{end}"})
                with urllib.request.urlopen(req, timeout=120) as r:
                    data = r.read()
                break
            except Exception as e:  # noqa: BLE001
                print("retry", attempt, e, file=sys.stderr)
                time.sleep(2)
        else:
            raise IOError("falha no download")
        self.pos += len(data)
        self.bytes_read += len(data)
        return data

    def readinto(self, b):
        d = self.read(len(b))
        b[: len(d)] = d
        return len(d)


def open_zip():
    rf = RangeFile(URL)
    return zipfile.ZipFile(rf), rf


if __name__ == "__main__":
    t = time.time()
    z, rf = open_zip()
    infos = z.infolist()
    print("entradas:", len(infos), "bytes lidos:", rf.bytes_read, "tempo:", round(time.time() - t, 1), "s")
    with open("zip_index.tsv", "w", encoding="utf-8") as f:
        for i in infos:
            f.write(f"{i.filename}\t{i.file_size}\t{i.compress_size}\t{i.header_offset}\n")
    print(infos[:5])
