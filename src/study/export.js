/**
 * Exportação de imagem PNG do modelo 3D e impressão de fichas (F1.9).
 */

export function exportSnapshotPng(renderer, scene, camera, filename = 'anatomia3d-captura.png') {
  try {
    renderer.render(scene, camera);
    const dataUrl = renderer.domElement.toDataURL('image/png');

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (err) {
    console.error('[Export] Erro ao exportar imagem:', err);
    return false;
  }
}

export function printCurrentCard() {
  window.print();
}
