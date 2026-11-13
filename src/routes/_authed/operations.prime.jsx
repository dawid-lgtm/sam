import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useOps } from "@/lib/useOps";
import { PRIME_TASKS } from "@/lib/opsContent";
import { uploadEvidence, saveStep } from "@/lib/opsStore";
import { inputClass } from "@/components/ui-kit/controls";

export const Route = createFileRoute("/_authed/operations/prime")({
  ssr: false,
  component: PrimePage,
  head: () => ({ meta: [{ title: "Sam — Prime" }] }),
});

function PrimePage() {
  const { user, data, refresh } = useOps();
  const enrolment = data?.enrolment;
  const [openTask, setOpenTask] = useState(null);

  const responses = useQuery({
    queryKey: ["prime-responses", enrolment?.id],
    enabled: !!enrolment?.id,
    queryFn: () => base44.entities.PrimeResponse.filter({ enrolment_id: enrolment.id }),
  });

  if (!data) return <div className="h-56 animate-pulse rounded-2xl bg-card" />;
  if (!enrolment) {
    return (
      <p className="sam-glass p-4 text-[16px] text-foreground">
        You are not enrolled yet. A facilitator or your client admin puts you in a cohort.
      </p>
    );
  }

  const done = (responses.data || []).filter((r) => r.submitted_at).map((r) => Number(r.task_no));

  return (
    <div className="space-y-3">
      <div>
        <Link to="/operations" className="text-[15px] text-muted-foreground">
          ← Operations
        </Link>
        <h1 className="font-heading text-[26px] font-semibold leading-tight text-foreground">Prime</h1>
        <p className="text-[15px] text-muted-foreground">
          Over one roster, on shift · {done.length} of 10 tasks done
        </p>
        <p className="mt-1 rounded-xl bg-background/40 p-3 text-[15px] leading-snug text-muted-foreground">
          About 15 minutes on a shift. It is not homework for the end of a 12-hour day. If a figure, a meeting or a
          person is not available, write that down. It is a finding, not a failure.
        </p>
      </div>

      <div className="space-y-1.5">
        {PRIME_TASKS.map((task) => {
          const response = (responses.data || []).find((r) => Number(r.task_no) === task.no);
          const isDone = !!response?.submitted_at;
          return (
            <div key={task.no} className="rounded-xl bg-card p-3">
              <button
                type="button"
                onClick={() => setOpenTask(openTask === task.no ? null : task.no)}
                className="flex w-full items-start gap-3 text-left"
              >
                <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md ${isDone ? "bg-gold text-gold-foreground" : "bg-background/50 text-gold"}`}>
                  {isDone ? <Check className="h-4 w-4" strokeWidth={3} /> : task.no}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-semibold leading-snug text-foreground">
                    Task {task.no} · {task.title}
                  </span>
                  <span className="block text-[14px] text-muted-foreground">{task.timing}</span>
                </span>
              </button>
              {openTask === task.no ? (
                <TaskForm
                  task={task}
                  response={response}
                  enrolment={enrolment}
                  user={user}
                  onSaved={async () => {
                    await responses.refetch();
                    await refresh();
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskForm({ task, response, enrolment, user, onSaved }) {
  const [answer, setAnswer] = useState(response?.answers?.answer || "");
  const [photos, setPhotos] = useState(response?.photos || []);
  const [busy, setBusy] = useState(false);

  const addPhoto = async (file) => {
    try {
      setPhotos([...photos, await uploadEvidence(file)]);
    } catch {
      toast.error("Could not add the photo. Try again when you have signal.");
    }
  };

  const save = async () => {
    if (!answer.trim()) {
      toast.error("Write something first. If it is not available, write that down.");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        answers: { answer },
        photos,
        submitted_at: new Date().toISOString(),
      };
      if (response?.id) {
        await base44.entities.PrimeResponse.update(response.id, payload);
      } else {
        await base44.entities.PrimeResponse.create({
          enrolment_id: enrolment.id,
          user_id: user.id,
          task_no: task.no,
          ...payload,
        });
      }
      toast.success("Saved.");
      await onSaved();
    } catch {
      toast.error("Could not save. Try again when you have signal.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-2 space-y-2 border-t border-foreground/10 pt-2">
      <p className="text-[15px] leading-snug text-foreground">{task.prompt}</p>
      <textarea rows={4} className={inputClass + " mt-0"} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Your answer" />
      <div className="flex flex-wrap items-center gap-2">
        <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-1.5 rounded-xl bg-secondary px-3 text-[14px] font-medium text-foreground">
          <Camera className="h-4 w-4" />
          Photo{photos.length ? ` (${photos.length})` : ""}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) addPhoto(file);
            }}
          />
        </label>
        <button type="button" onClick={save} disabled={busy} className="min-h-[44px] rounded-xl bg-gold px-4 text-[15px] font-semibold text-gold-foreground disabled:opacity-50">
          {busy ? "Saving…" : response?.submitted_at ? "Save changes" : "Submit task"}
        </button>
      </div>
    </div>
  );
}