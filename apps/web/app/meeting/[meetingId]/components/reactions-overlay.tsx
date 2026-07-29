export default function ReactionsOverlay({ reactions }: any) {
  return (
    <div
      data-testid="reactions-overlay"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      {reactions.map((r: any) => (
        <span
          key={r.id}
          className="reaction-float absolute bottom-4 text-4xl md:text-5xl select-none drop-shadow-lg"
          style={{ left: `${r.left}%` }}
          aria-hidden
        >
          {r.emoji}
        </span>
      ))}
    </div>
  );
}
