import { useState } from "react";
import { toast } from "sonner";
import { blockTargets, numberSentence, workoutNumber } from "@/lib/opsShift";
import { saveNumber } from "@/lib/opsStore";
import { inputClass } from "@/components/ui-kit/controls";

/** Tool 1 · Work out your number. The app does the arithmetic and writes the sentence. */
export function NumberPanel({ user, shift, record, onSaved }) {
  const [form, setForm] = useState({
    volume: record?.volume ?? "",
    unit: record?.unit || "bcm",
    payload: record?.payload ?? "",
    digging_hours: record?.digging_hours ?? "",
    trucks: record?.trucks ?? "",
    buckets_load: record?.buckets_load ?? "",
    first_bucket: record?.first_bucket || "",
    last_bucket: record?.last_bucket || "",
  });
  const [busy, setBusy] = useState(false);

  const numbers = workoutNumber({
    volume: Number(form.volume),
    payload: Number(form.payload),
    diggingHours: Number(form.digging_hours),
    trucks: Number(form.trucks),
    bucketsLoad: Number(form.buckets_load),
  });
  const targets = blockTargets(numbers.loads);
  const sentence = numberSentence(numbers, form.unit);
  const set = (patch) => setForm({ ...form, ...patch });

  const save = async () => {
    setBusy(true);
    try {
      await saveNumber(user, record, shift, {
        ...form,
        volume: Number(form.volume),
        payload: Number(form.payload),
        digging_hours: Number(form.digging_hours),
        trucks: Number(form.trucks),
        buckets_load: Number(form.buckets_load),
        loads: numbers.loads,
        loads_hr: numbers.loadsHr,
        loads_truck_hr: numbers.loadsTruckHr,
        buckets_min: numbers.bucketsMin,
        secs_bucket: numbers.secsBucket,
        block_targets: targets,
        sentence,
        status: "Done",
        submitted_at: new Date().toISOString(),
      });
      toast.success("Your number is saved on this shift.");
      onSaved?.();
    } catch {
      toast.error("Could not save your number. It is kept on the phone.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-1.5">
        <label className="block">
          <span className="text-[13px] text-muted-foreground">Shift volume</span>
          <input type="number" inputMode="decimal" className={inputClass + " mt-0"} value={form.volume} onChange={(e) => set({ volume: e.target.value })} />
        </label>
        <label className="block">
          <span className="text-[13px] text-muted-foreground">Unit</span>
          <select className={inputClass + " mt-0"} value={form.unit} onChange={(e) => set({ unit: e.target.value })}>
            <option value="bcm">bcm</option>
            <option value="t">t</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[13px] text-muted-foreground">Payload per load</span>
          <input type="number" inputMode="decimal" className={inputClass + " mt-0"} value={form.payload} onChange={(e) => set({ payload: e.target.value })} />
        </label>
        <label className="block">
          <span className="text-[13px] text-muted-foreground">Digging hours</span>
          <input type="number" inputMode="decimal" className={inputClass + " mt-0"} value={form.digging_hours} onChange={(e) => set({ digging_hours: e.target.value })} />
        </label>
        <label className="block">
          <span className="text-[13px] text-muted-foreground">Trucks on the circuit</span>
          <input type="number" inputMode="decimal" className={inputClass + " mt-0"} value={form.trucks} onChange={(e) => set({ trucks: e.target.value })} />
        </label>
        <label className="block">
          <span className="text-[13px] text-muted-foreground">Buckets a load</span>
          <input type="number" inputMode="decimal" className={inputClass + " mt-0"} value={form.buckets_load} onChange={(e) => set({ buckets_load: e.target.value })} />
        </label>
        <label className="block">
          <span className="text-[13px] text-muted-foreground">First bucket</span>
          <input type="time" className={inputClass + " mt-0"} value={form.first_bucket} onChange={(e) => set({ first_bucket: e.target.value })} />
        </label>
        <label className="block">
          <span className="text-[13px] text-muted-foreground">Last bucket</span>
          <input type="time" className={inputClass + " mt-0"} value={form.last_bucket} onChange={(e) => set({ last_bucket: e.target.value })} />
        </label>
      </div>

      <div className="rounded-xl bg-gold/15 p-3">
        <p className="text-[15px] leading-snug text-foreground">
          {sentence || "Put in the volume, the payload and the digging hours, and the app writes your number."}
        </p>
        {numbers.loads ? (
          <p className="mt-1 text-[14px] text-muted-foreground">
            Blocks: {targets.join(" · ")} loads · buckets a minute {numbers.bucketsMin} · {numbers.secsBucket}s a bucket
          </p>
        ) : null}
      </div>

      <button type="button" onClick={save} disabled={busy || !numbers.loads} className="min-h-[48px] w-full rounded-xl bg-gold px-4 text-[16px] font-semibold text-gold-foreground disabled:opacity-50">
        {busy ? "Saving…" : "Save my number"}
      </button>
    </div>
  );
}