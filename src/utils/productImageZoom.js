export const MAX_LENS_SIZE = 120;
/** Zoom engages only after the pointer stays still on the image for this long. */
export const ZOOM_STATIONARY_MS = 50;

/** Visible image rect inside an object-fit: contain <img> box. */
export function getDisplayedImageBounds(rect, naturalWidth, naturalHeight) {
  if (!rect || !naturalWidth || !naturalHeight) {
    return null;
  }

  const scale = Math.min(rect.width / naturalWidth, rect.height / naturalHeight);
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;

  return {
    left: rect.left + (rect.width - width) / 2,
    top: rect.top + (rect.height - height) / 2,
    width,
    height,
  };
}

export function getLensSize(bounds) {
  if (!bounds || bounds.width < MAX_LENS_SIZE || bounds.height < MAX_LENS_SIZE) {
    return 0;
  }

  return MAX_LENS_SIZE;
}

export function clampToImage(clientX, clientY, bounds) {
  return {
    x: Math.min(bounds.left + bounds.width, Math.max(bounds.left, clientX)),
    y: Math.min(bounds.top + bounds.height, Math.max(bounds.top, clientY)),
  };
}

export function computeZoomState({ bounds, stageRect, panelSize, clientX, clientY }) {
  const activeLensSize = getLensSize(bounds);

  if (!activeLensSize || !panelSize || !bounds || !stageRect) {
    return null;
  }

  const { x, y } = clampToImage(clientX, clientY, bounds);
  const relativeX = x - bounds.left;
  const relativeY = y - bounds.top;
  const maxLensX = bounds.width - activeLensSize;
  const maxLensY = bounds.height - activeLensSize;
  let lensX = relativeX - activeLensSize / 2;
  let lensY = relativeY - activeLensSize / 2;
  lensX = Math.max(0, Math.min(lensX, maxLensX));
  lensY = Math.max(0, Math.min(lensY, maxLensY));

  const zoomScale = panelSize / activeLensSize;
  const zoomWidth = bounds.width * zoomScale;
  const zoomHeight = bounds.height * zoomScale;

  if (zoomWidth <= 0 || zoomHeight <= 0) {
    return null;
  }

  return {
    lensSize: activeLensSize,
    lensLeft: bounds.left - stageRect.left + lensX,
    lensTop: bounds.top - stageRect.top + lensY,
    zoomWidth,
    zoomHeight,
    zoomLeft: -lensX * zoomScale,
    zoomTop: -lensY * zoomScale,
  };
}
