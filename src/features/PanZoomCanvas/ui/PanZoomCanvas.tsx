import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import styled from 'styled-components';

const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 1300;
const MIN_SCALE = 0.5;

interface ViewportSize {
  width: number;
  height: number;
}

const fitScale = ({ width, height }: ViewportSize) =>
  Math.max(MIN_SCALE, Math.min(1, width / CANVAS_WIDTH, height / CANVAS_HEIGHT));

const initialScale = ({ width, height }: ViewportSize) =>
  Math.min(3, fitScale({ width, height }) * 1.15);

const CanvasViewport = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;

  @media (max-width: 1199px) {
    height: auto;
    overflow: visible;
  }
`;

export function PanZoomCanvas({ children }: PropsWithChildren) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>({ width: 0, height: 0 });
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(max-width: 1199px)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1199px)');
    const updateLayout = (event: MediaQueryListEvent) => setIsCompact(event.matches);

    setIsCompact(mediaQuery.matches);
    mediaQuery.addEventListener('change', updateLayout);
    return () => mediaQuery.removeEventListener('change', updateLayout);
  }, []);

  useEffect(() => {
    if (isCompact || !viewportRef.current) return undefined;

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
  }, [isCompact]);

  useEffect(() => {
    if (isCompact || !transformRef.current || !viewportSize.width || !viewportSize.height) return;

    void transformRef.current.fitToView({
      mode: 'contain',
      minScale: MIN_SCALE,
      maxScale: 1,
      animationTime: 0,
    });
  }, [isCompact, viewportSize]);

  if (isCompact) {
    return (
      <CanvasViewport ref={viewportRef}>
        {children}
      </CanvasViewport>
    );
  }

  return (
    <CanvasViewport ref={viewportRef}>
      {viewportSize.width > 0 && viewportSize.height > 0 && (
        <TransformWrapper
          onInit={(instance) => {
            transformRef.current = instance;
          }}
          initialScale={initialScale(viewportSize)}
          minScale={MIN_SCALE}
          maxScale={3}
          centerOnInit
          limitToBounds
          panning={{ velocityDisabled: true }}
          wheel={{ step: 0.0008 }}
          pinch={{ disabled: true }}
          doubleClick={{ disabled: true }}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', height: '100%', overflow: 'hidden' }}
            contentStyle={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px` }}
          >
            {children}
          </TransformComponent>
        </TransformWrapper>
      )}
    </CanvasViewport>
  );
}
