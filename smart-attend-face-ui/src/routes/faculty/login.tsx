import { createFileRoute } from "@tanstack/react-router";
import { LoginPageComponent } from "../login";

export const Route = createFileRoute("/faculty/login")({
  head: () => ({ meta: [{ title: "Faculty Login · SmartAttend AI" }] }),
  component: () => <LoginPageComponent initialRole="professor" initialAction="login" />,
});
