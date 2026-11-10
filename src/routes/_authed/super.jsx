import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/super")({
  beforeLoad: () => {
    throw redirect({ to: "/master" });
  },
});