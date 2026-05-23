import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ZOOM_STATIONARY_MS,
  computeZoomState,
  getDisplayedImageBounds,
} from '../utils/productImageZoom';

function boundsFromImage(image) {
  if (!image?.complete || !image.naturalWidth || !image.naturalHeight) {
    return null;
  }

  const rect = image.getBoundingClientRect();
  return getDisplayedImageBounds(rect, image.naturalWidth, image.naturalHeight);
}

function ProductImageZoom({ src, alt, stationaryMs = ZOOM_STATIONARY_MS }) {
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const resultRef = useRef(null);
  const lensRef = useRef(null);
  const zoomImgRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const isPointerInsideRef = useRef(false);
  const isZoomEngagedRef = useRef(false);
  const stationaryTimerRef = useRef(null);
  const [isZooming, setIsZooming] = useState(false);

  const setZooming = useCallback((value) => {
    setIsZooming(value);
    resultRef.current?.classList.toggle('is-active', value);
  }, []);

  const hideZoomElements = useCallback(() => {
    if (lensRef.current) {
      lensRef.current.style.display = 'none';
    }
    if (zoomImgRef.current) {
      zoomImgRef.current.style.display = 'none';
    }
  }, []);

  const clearStationaryTimer = useCallback(() => {
    if (stationaryTimerRef.current !== null) {
      window.clearTimeout(stationaryTimerRef.current);
      stationaryTimerRef.current = null;
    }
  }, []);

  const syncPanelSize = useCallback(() => {
    const stage = stageRef.current;
    const result = resultRef.current;
    const size = stage?.offsetHeight ?? 0;

    if (size > 0 && result) {
      result.style.width = `${size}px`;
      result.style.height = `${size}px`;
    }
  }, []);

  const applyZoomToDom = useCallback((clientX, clientY) => {
    const image = imageRef.current;
    const stage = stageRef.current;
    const lens = lensRef.current;
    const zoomImg = zoomImgRef.current;
    const size = stage?.offsetHeight ?? 0;

    if (!image || !stage || !lens || !zoomImg || !size) {
      return false;
    }

    const bounds = boundsFromImage(image);
    const stageRect = stage.getBoundingClientRect();
    const state = computeZoomState({
      bounds,
      stageRect,
      panelSize: size,
      clientX,
      clientY,
    });

    if (!state) {
      return false;
    }

    lens.style.display = 'block';
    lens.style.left = `${state.lensLeft}px`;
    lens.style.top = `${state.lensTop}px`;
    lens.style.width = `${state.lensSize}px`;
    lens.style.height = `${state.lensSize}px`;

    zoomImg.style.display = 'block';
    zoomImg.style.width = `${state.zoomWidth}px`;
    zoomImg.style.height = `${state.zoomHeight}px`;
    zoomImg.style.left = `${state.zoomLeft}px`;
    zoomImg.style.top = `${state.zoomTop}px`;

    return true;
  }, []);

  const deactivateZoom = useCallback(() => {
    clearStationaryTimer();
    isZoomEngagedRef.current = false;
    hideZoomElements();
    setZooming(false);
  }, [clearStationaryTimer, hideZoomElements, setZooming]);

  const updateZoom = useCallback(
    (clientX, clientY) => {
      if (applyZoomToDom(clientX, clientY)) {
        setZooming(true);
        return;
      }
      hideZoomElements();
      setZooming(false);
    },
    [applyZoomToDom, hideZoomElements, setZooming],
  );

  const isPointerOnImage = useCallback((clientX, clientY) => {
    const bounds = boundsFromImage(imageRef.current);
    if (!bounds) {
      return false;
    }

    return (
      clientX >= bounds.left &&
      clientX <= bounds.left + bounds.width &&
      clientY >= bounds.top &&
      clientY <= bounds.top + bounds.height
    );
  }, []);

  const engageZoom = useCallback(() => {
    const { x, y } = pointerRef.current;
    if (!isPointerOnImage(x, y)) {
      return;
    }

    isZoomEngagedRef.current = true;
    updateZoom(x, y);
  }, [isPointerOnImage, updateZoom]);

  const scheduleStationaryZoom = useCallback(() => {
    clearStationaryTimer();
    stationaryTimerRef.current = window.setTimeout(() => {
      stationaryTimerRef.current = null;
      if (!isZoomEngagedRef.current) {
        engageZoom();
      }
    }, stationaryMs);
  }, [clearStationaryTimer, engageZoom, stationaryMs]);

  const handlePointerMove = useCallback(
    (clientX, clientY) => {
      pointerRef.current = { x: clientX, y: clientY };

      if (isZoomEngagedRef.current) {
        if (isPointerOnImage(clientX, clientY)) {
          updateZoom(clientX, clientY);
        } else {
          deactivateZoom();
        }
        return;
      }

      if (!isPointerOnImage(clientX, clientY)) {
        clearStationaryTimer();
        return;
      }

      scheduleStationaryZoom();
    },
    [clearStationaryTimer, deactivateZoom, isPointerOnImage, scheduleStationaryZoom, updateZoom],
  );

  const handleMouseEnter = useCallback(
    (event) => {
      isPointerInsideRef.current = true;
      handlePointerMove(event.clientX, event.clientY);
    },
    [handlePointerMove],
  );

  const handleMouseMove = useCallback(
    (event) => {
      handlePointerMove(event.clientX, event.clientY);
    },
    [handlePointerMove],
  );

  const handleMouseLeave = useCallback(() => {
    isPointerInsideRef.current = false;
    deactivateZoom();
  }, [deactivateZoom]);

  const handleImageLoad = useCallback(() => {
    syncPanelSize();
    if (isPointerInsideRef.current) {
      handlePointerMove(pointerRef.current.x, pointerRef.current.y);
    }
  }, [handlePointerMove, syncPanelSize]);

  useEffect(() => {
    deactivateZoom();
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0 && isPointerInsideRef.current) {
      handlePointerMove(pointerRef.current.x, pointerRef.current.y);
    }
  }, [src, deactivateZoom, handlePointerMove]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return undefined;
    }

    syncPanelSize();
    const observer = new ResizeObserver(syncPanelSize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [src, syncPanelSize]);

  useEffect(() => () => clearStationaryTimer(), [clearStationaryTimer]);

  return (
    <div className="image-zoom-zone">
      <div className={`image-zoom${isZooming ? ' is-zooming' : ''}`}>
        <div
          ref={stageRef}
          className="image-zoom-stage"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <img ref={imageRef} src={src} alt={alt} draggable={false} onLoad={handleImageLoad} />
          <div ref={lensRef} className="image-zoom-lens" style={{ display: 'none' }} />
        </div>

        <div ref={resultRef} className="image-zoom-result" aria-hidden={!isZooming}>
          <div className="image-zoom-result-pane">
            <div className="image-zoom-result-viewport">
              <img
                ref={zoomImgRef}
                src={src}
                alt=""
                draggable={false}
                className="image-zoom-result-img"
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductImageZoom;
