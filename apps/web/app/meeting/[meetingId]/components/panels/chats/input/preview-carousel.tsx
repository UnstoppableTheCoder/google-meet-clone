import * as React from "react";
import { X } from "lucide-react";
import { File } from "@repo/types";
import PreviewItem from "./preview-item";
import { cn } from "@repo/ui/lib/utils";

export function PreviewCarousel({
  files,
  onRemoveAll,
}: {
  files: File[];
  onRemoveAll?: () => void;
}) {
  const [selected, setSelected] = React.useState<File | undefined>(files[0]);
  const stripRef = React.useRef<HTMLDivElement>(null);

  // Drag-scroll state (kept in refs to avoid re-renders on every move)
  const dragState = React.useRef({
    isDown: false,
    didDrag: false,
    startX: 0,
    startScrollLeft: 0,
    pointerId: 0 as number,
  });

  React.useEffect(() => {
    setSelected(files[0]);
  }, [files]);

  // Vertical wheel → horizontal scroll (non-passive so preventDefault works)
  React.useEffect(() => {
    const el = stripRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stripRef.current;
    if (!el) return;
    // Only handle primary button / touch / pen
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragState.current = {
      isDown: true,
      didDrag: false,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      pointerId: e.pointerId,
    };
    // DO NOT capture yet — let the click fire normally if user doesn't drag
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stripRef.current;
    const s = dragState.current;
    if (!el || !s.isDown) return;

    const dx = e.clientX - s.startX;

    // Cross threshold → now it's a drag. Capture pointer so we keep receiving events.
    if (!s.didDrag && Math.abs(dx) > 5) {
      s.didDrag = true;
      try {
        el.setPointerCapture(s.pointerId);
      } catch {}
    }

    if (s.didDrag) {
      el.scrollLeft = s.startScrollLeft - dx;
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stripRef.current;
    const s = dragState.current;
    if (el && s.pointerId != null && el.hasPointerCapture(s.pointerId)) {
      el.releasePointerCapture(s.pointerId);
    }
    s.isDown = false;
    // didDrag stays true briefly so onClickCapture can suppress the click, then resets there
  };

  // Suppress child button click if we actually dragged
  const onClickCapture: React.MouseEventHandler = (e) => {
    if (dragState.current.didDrag) {
      e.stopPropagation();
      e.preventDefault();
      dragState.current.didDrag = false;
    }
  };

  if (!selected) return null;

  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/5 p-2">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] uppercase tracking-wider text-white/50 font-medium">
          Attachments · {files.length}
        </span>
        {onRemoveAll && (
          <button
            onClick={onRemoveAll}
            className="text-[11px] text-white/60 hover:text-white flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div className="h-40 w-full rounded-lg overflow-hidden bg-black/30 flex items-center justify-center">
        <PreviewItem
          fileName={selected.fileName}
          fileType={selected.fileType}
          fileUrl={selected.fileUrl}
        />
      </div>

      <div
        ref={stripRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className={cn(
          "flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-1 overscroll-x-contain",
          "select-none touch-pan-x cursor-grab active:cursor-grabbing",
        )}
      >
        {files.map((file, index) => (
          <button
            key={`${file.fileName}-${index}`}
            onClick={() => setSelected(file)}
            // Prevent the browser's native image/element drag from stealing our pointer
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className={cn(
              "h-14 w-14 shrink-0 rounded-lg border text-[10px] font-semibold uppercase tracking-wide flex items-center justify-center transition-colors",
              selected === file
                ? "border-blue-400 bg-blue-500/15 text-blue-200"
                : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10",
            )}
          >
            {file.fileType.split("/")[1]?.slice(0, 4)}
          </button>
        ))}
      </div>
    </div>
  );
}
