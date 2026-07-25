import { createFileRoute } from "@tanstack/react-router";
import { RegisterPageComponent } from "../register";

export const Route = createFileRoute("/student/register")({
  head: () => ({ meta: [{ title: "Student Face Registration · SmartAttend AI" }] }),
  component: () => <RegisterPageComponent initialRole="student" />,
});
