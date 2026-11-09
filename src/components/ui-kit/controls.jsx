export const inputClass =
  "mt-1.5 w-full rounded-xl border border-input bg-white px-3.5 py-3 text-[15px] text-navy placeholder:text-muted-foreground/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/40";

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-navy">{label}</span>
      {hint ? <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span> : null}
      {children}
    </label>
  );
}

export function TextField({ label, hint, ...props }) {
  return (
    <Field label={label} hint={hint}>
      <input className={inputClass} {...props} />
    </Field>
  );
}

export function TextAreaField({ label, hint, rows = 3, ...props }) {
  return (
    <Field label={label} hint={hint}>
      <textarea rows={rows} className={inputClass} {...props} />
    </Field>
  );
}

export function SelectField({ label, hint, options, placeholder, ...props }) {
  return (
    <Field label={label} hint={hint}>
      <select className={inputClass} {...props}>
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function PrimaryButton({ className = "", ...props }) {
  return (
    <button
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-navy px-5 text-[15px] font-semibold text-white transition hover:bg-navy/90 disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function GhostButton({ className = "", ...props }) {
  return (
    <button
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-border px-4 text-[14px] font-medium text-navy transition hover:bg-secondary disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}