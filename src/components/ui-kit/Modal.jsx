import { X } from "lucide-react";

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/50 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold leading-snug text-navy">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}