/** Injected once per /labs page (via layout.tsx) — every hero-mockup animation used across the 6 pages. */
export function LabsKeyframes() {
  return (
    <style>{`
      @keyframes labsFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes labsPulseRingTeal { 0%, 100% { box-shadow: 0 0 0 0 rgba(0,201,167,0.45); } 50% { box-shadow: 0 0 0 6px rgba(0,201,167,0); } }
      @keyframes labsPulseRingAmber { 0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); } 50% { box-shadow: 0 0 0 6px rgba(245,158,11,0); } }
      @keyframes labsPulseDot { 0%, 100% { box-shadow: 0 0 0 0 rgba(0,201,167,0.5); } 50% { box-shadow: 0 0 0 5px rgba(0,201,167,0); } }
      @keyframes labsBarGrow { from { width: var(--bar-from, 4%); } to { width: var(--bar-to, 92%); } }
      @keyframes labsBarShrink { from { width: 96%; } to { width: 8%; } }
      @keyframes labsSendBob { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(3px); } }
      @keyframes labsSpinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `}</style>
  );
}
