/**
 * CRT / Scanline overlay — sits on top of everything, pointer-events: none.
 * Also renders a subtle animated noise layer.
 */
export default function CRTOverlay() {
  return (
    <>
      <div className="crt-overlay" aria-hidden="true" />
      <div className="crt-noise" aria-hidden="true" />
    </>
  );
}
