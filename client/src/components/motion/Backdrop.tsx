export function AmbientBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-mesh opacity-80" />
      <div className="absolute -left-1/4 top-0 h-[50vh] w-[50vw] rounded-full bg-royal-500/10 blur-[120px] animate-aurora" />
      <div className="absolute -right-1/4 top-1/3 h-[40vh] w-[40vw] rounded-full bg-volt-500/10 blur-[100px] animate-aurora [animation-delay:-4s]" />
      <div className="noise-overlay absolute inset-0 opacity-30" />
    </div>
  );
}
