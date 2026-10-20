import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import styled from 'styled-components';
import { mediaBreakpointDown } from '../../../shared/styles/mixins';
import { useMediaQuery } from '../../../shared/hooks';

const DESKTOP_CANVAS_WIDTH = 1440;
const DESKTOP_CANVAS_HEIGHT = 935;
const MOBILE_CANVAS_WIDTH = 1040;
const MOBILE_CANVAS_HEIGHT = 800;
const MIN_SCALE = 0.8;
const MOBILE_MEDIA_QUERY = '(max-width: 767px)';

interface ViewportSize {
  width: number;
  height: number;
}

const fitScale = (
  { width, height }: ViewportSize,
  canvasWidth: number,
  canvasHeight: number,
) => Math.max(MIN_SCALE, Math.min(1, width / canvasWidth, height / canvasHeight));

const loadedScale = (
  size: ViewportSize,
  canvasWidth: number,
  canvasHeight: number,
) =>
  Math.min(
    3,
    Math.max(
      fitScale(size, canvasWidth, canvasHeight) * 2,
      size.width / canvasWidth,
      size.height / canvasHeight,
    ),
  );

const CanvasViewport = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
  touch-action: none;
  overscroll-behavior: contain;

  ${mediaBreakpointDown('compact')} {
    height: calc(100dvh - var(--header-height));
    flex: 0 0 auto;
  }
`;

interface PanZoomCanvasProps extends PropsWithChildren {
  zoomAfterLoad: boolean;
}

export function PanZoomCanvas({ children, zoomAfterLoad }: PanZoomCanvasProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>({ width: 0, height: 0 });

  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const canvasWidth = isMobile ? MOBILE_CANVAS_WIDTH : DESKTOP_CANVAS_WIDTH;
  const canvasHeight = isMobile ? MOBILE_CANVAS_HEIGHT : DESKTOP_CANVAS_HEIGHT;

  useEffect(() => {
    if (!viewportRef.current) return undefined;

    const viewport = viewportRef.current;
    const measureViewport = () => {
      const nextSize = { width: viewport.clientWidth, height: viewport.clientHeight };
      setViewportSize((currentSize) =>
        currentSize.width === nextSize.width && currentSize.height === nextSize.height
          ? currentSize
          : nextSize,
      );
    };

    measureViewport();
    const observer = new ResizeObserver(measureViewport);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!transformRef.current || !viewportSize.width || !viewportSize.height) return;

    if (zoomAfterLoad) {
      void transformRef.current.centerView(
        loadedScale(viewportSize, canvasWidth, canvasHeight),
        1200,
        'easeOut',
      );
      return;
    }

    void transformRef.current.fitToView({
      mode: 'contain',
      minScale: MIN_SCALE,
      maxScale: 1,
      animationTime: 0,
    });
  }, [viewportSize, zoomAfterLoad, canvasWidth, canvasHeight]);

  return (
    <CanvasViewport ref={viewportRef}>
      {viewportSize.width > 0 && viewportSize.height > 0 && (
        <TransformWrapper
          key={`${canvasWidth}x${canvasHeight}`}
          onInit={(instance) => {
            transformRef.current = instance;
          }}
          initialScale={fitScale(viewportSize, canvasWidth, canvasHeight)}
          minScale={MIN_SCALE}
          maxScale={3}
          centerOnInit
          limitToBounds
          panning={{ velocityDisabled: true }}
          wheel={{ step: 0.001 }}
          pinch={{ disabled: false }}
          doubleClick={{ disabled: true }}
        >
          <TransformComponent
            wrapperStyle={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              touchAction: 'none',
              overscrollBehavior: 'contain',
            }}
            contentStyle={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
          >
            {children}
          </TransformComponent>
        </TransformWrapper>
      )}
    </CanvasViewport>
  );
}