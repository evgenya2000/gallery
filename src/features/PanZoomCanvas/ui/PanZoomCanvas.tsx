import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import styled from 'styled-components';
import { mediaBreakpointDown } from '../../../shared/styles/mixins';

const CANVAS_WIDTH = 1440;
const CANVAS_HEIGHT = 935;
const MIN_SCALE = 0.1;

interface ViewportSize {
  width: number;
  height: number;
}

const fitScale = ({ width, height }: ViewportSize) =>
  Math.max(MIN_SCALE, Math.min(1, width / CANVAS_WIDTH, height / CANVAS_HEIGHT));

const loadedScale = (size: ViewportSize) =>
  Math.min(
    3,
    Math.max(
      fitScale(size) * 1.2,
      size.width / CANVAS_WIDTH,
      size.height / CANVAS_HEIGHT,
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
      void transformRef.current.centerView(loadedScale(viewportSize), 1200, 'easeOut');
      return;
    }

    void transformRef.current.fitToView({
      mode: 'contain',
      minScale: MIN_SCALE,
      maxScale: 1,
      animationTime: 0,
    });
  }, [viewportSize, zoomAfterLoad]);

  return (
    <CanvasViewport ref={viewportRef}>
      {viewportSize.width > 0 && viewportSize.height > 0 && (
        <TransformWrapper
          onInit={(instance) => {
            transformRef.current = instance;
          }}
          initialScale={fitScale(viewportSize)}
          minScale={MIN_SCALE}
          maxScale={3}
          centerOnInit
          limitToBounds
          panning={{ velocityDisabled: true }}
          wheel={{ step: 0.1 }}
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
            contentStyle={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
          >
            {children}
          </TransformComponent>
        </TransformWrapper>
      )}
    </CanvasViewport>
  );
}
