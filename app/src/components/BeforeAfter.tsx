import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { COMPARE } from '../config/content';
import { color, font, radius, shadow } from '../styles/tokens';
import { haptic } from '../lib/telegram';

const MIN = 4;
const MAX = 96;
const INITIAL = 52;
const HEIGHT = 320;

/**
 * Draggable before/after grade comparison.
 *
 * The split is held in React state rather than mutated on the DOM: the
 * cost is trivial at this size and it keeps the handle, the clip and the
 * ARIA value in sync, which the keyboard affordance depends on.
 */
export function BeforeAfter() {
  const [split, setSplit] = useState(INITIAL);
  // Measured frame width: the revealed image must be sized to the frame,
  // not to its clip, or it would squash as the split narrows.
  const [frameWidth, setFrameWidth] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const measure = () => setFrameWidth(el.getBoundingClientRect().width);
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const applyFromEvent = useCallback((clientX: number) => {
    const box = frameRef.current?.getBoundingClientRect();
    if (!box) return;
    const pct = ((clientX - box.left) / box.width) * 100;
    setSplit(Math.max(MIN, Math.min(MAX, pct)));
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    applyFromEvent(e.clientX);
    haptic('light');
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current) applyFromEvent(e.clientX);
  };

  const endDrag = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setSplit((v) => Math.max(MIN, v - step));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setSplit((v) => Math.min(MAX, v + step));
    }
  };

  const chip = {
    position: 'absolute',
    bottom: 12,
    fontFamily: font.mono,
    fontSize: 9.5,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    padding: '6px 10px',
    borderRadius: radius.pill,
  } as const;

  return (
    <div
      ref={frameRef}
      role="slider"
      tabIndex={0}
      aria-label={COMPARE.title}
      aria-valuemin={MIN}
      aria-valuemax={MAX}
      aria-valuenow={Math.round(split)}
      aria-valuetext={`${Math.round(split)}% ${COMPARE.labelAfter}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      style={{
        position: 'relative',
        height: HEIGHT,
        borderRadius: radius['2xl'],
        overflow: 'hidden',
        background: color.surfaceAlt,
        touchAction: 'none',
        cursor: 'ew-resize',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        boxShadow: shadow.compare,
      }}
    >
      {/* Ungraded frame fills the full width; the graded one is clipped
          over it from the left. */}
      <img
        src="assets/grade-before.jpg"
        alt={COMPARE.altBefore}
        draggable={false}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 30%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: `${split}%`,
          overflow: 'hidden',
        }}
      >
        {/* Pinned to the frame width, not the clip width, so the image
            stays still while the reveal moves across it. */}
        <img
          src="assets/grade-after.jpg"
          alt={COMPARE.altAfter}
          draggable={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: frameWidth || '100%',
            height: HEIGHT,
            objectFit: 'cover',
            objectPosition: '50% 30%',
          }}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${split}%`,
          width: 2,
          background: 'rgba(255,255,255,0.9)',
          boxShadow: '0 0 14px rgba(0,0,0,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: shadow.handle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderLeft: `2px solid ${color.ink}`,
              borderBottom: `2px solid ${color.ink}`,
              transform: 'rotate(45deg)',
            }}
          />
          <span
            style={{
              width: 6,
              height: 6,
              borderRight: `2px solid ${color.ink}`,
              borderTop: `2px solid ${color.ink}`,
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      </div>

      <span
        style={{
          ...chip,
          left: 12,
          color: '#FFFFFF',
          background: 'rgba(12,11,13,0.45)',
          border: '1px solid rgba(255,255,255,0.18)',
        }}
      >
        {COMPARE.labelAfter}
      </span>
      <span
        style={{
          ...chip,
          right: 12,
          color: 'rgba(255,255,255,0.85)',
          background: 'rgba(12,11,13,0.35)',
          border: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        {COMPARE.labelBefore}
      </span>
    </div>
  );
}
