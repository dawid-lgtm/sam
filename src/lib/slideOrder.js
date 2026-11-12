// A page that opens from inside another page carries the parent's number plus a letter:
// 4 is Home, 4A is the sheet that opens over it.
const ORDER = {
  vahid: [
    { title: "The welcome email he gets", num: "1" },
    { title: "He sets his password", num: "2" },
    { title: "He signs in", num: "3" },
    { title: "Where signing in lands him", num: "4" },
    { title: "Step 1 · he taps People and roles", num: "4A" },
    { title: "The org chart he has entered", num: "4B" },
    { title: "Step 2 · locked until Step 1 is done", num: "4C" },
    { title: "Step 1 · he dates the first workshop", num: "4D" },
    { title: "Ticked: he enters the finalised Goal and Objectives", num: "4E" },
    { title: "Save turns into the next question", num: "4F" },
    { title: "Deployment methodology, step by step", num: "4G" },
    { title: "The tools and artifacts page", num: "4H" },
    { title: "Set up, so the setup page is gone", num: "4I" },
    { title: "Which step is next", num: "5" },
    { title: "The gate before it goes to site", num: "5A" },
    { title: "Where each answer goes", num: "6" },
    { title: "Goal, written down in the room", num: "6A" },
    { title: "Objectives, one owner each", num: "6B" },
    { title: "Strategies, with an example on screen", num: "6C" },
    { title: "In the meeting, on the agenda", num: "7" },
  ],
  mike: [
    { title: "The welcome email he gets", num: "1" },
    { title: "He sets his password", num: "2" },
    { title: "He signs in", num: "3" },
    { title: "Where signing in lands him", num: "4" },
    { title: "The goal and objectives, in full", num: "4A" },
    { title: "Progress shows where he stands", num: "4B" },
    { title: "His site, and the gap", num: "5" },
    { title: "The instruction card, with an example", num: "5A" },
    { title: "The tool arrives pre-filled", num: "5B" },
    { title: "Plans: who, what, where, when", num: "5C" },
    { title: "Actions: a name and a date", num: "5D" },
    { title: "His meeting runs off his own data", num: "6" },
  ],
};

// Returns the screens in page order, each carrying its number.
export function orderSlides(personKey, screens) {
  const spec = ORDER[personKey] || [];
  const left = new Map(screens.map((s) => [s.title, s]));
  const ordered = [];
  spec.forEach(({ title, num }) => {
    const screen = left.get(title);
    if (!screen) return;
    ordered.push({ ...screen, num });
    left.delete(title);
  });
  left.forEach((screen) => ordered.push({ ...screen, num: "" }));
  return ordered;
}