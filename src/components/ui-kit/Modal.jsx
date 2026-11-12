import { X } from "lucide-react";

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/60 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="sam-glass max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl p-5 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-heading text-[21px] font-semibold leading-snug text-foreground">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}