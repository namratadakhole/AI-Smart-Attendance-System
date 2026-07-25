import { createFileRoute } from "@tanstack/react-router";
import { LoginPageComponent } from "../login";

export const Route = createFileRoute("/student/login")({
  head: () => ({ meta: [{ title: "Student Login · SmartAttend AI" }] }),
  component: () => <LoginPageComponent initialRole="student" initialAction="login" />,
});
