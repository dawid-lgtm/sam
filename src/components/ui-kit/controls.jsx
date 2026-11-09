export const inputClass =
  "mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-3 text-[16px] text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/50";

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="text-[15px] font-medium text-foreground">{label}</span>
      {hint ? <span className="mt-0.5 block text-[15px] text-muted-foreground">{hint}</span> : null}
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
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gold px-5 text-[16px] font-semibold text-gold-foreground transition active:opacity-90 disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function GhostButton({ className = "", ...props }) {
  return (
    <button
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-[15px] font-semibold text-foreground transition active:opacity-90 disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}