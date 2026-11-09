import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "sam-theme";

export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    let saved = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      saved = null;
    }
    const on = saved === "light";
    document.documentElement.classList.toggle("light", on);
    setLight(on);
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("light");
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem(KEY, next ? "light" : "dark");
    } catch {
      // storage unavailable: the choice still applies to this screen
    }
    setLight(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={light}
      aria-label={light ? "Switch to the navy screen" : "Switch to the light screen"}
      className="grid h-12 w-12 place-items-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-foreground"
    >
      {light ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </button>
  );
}