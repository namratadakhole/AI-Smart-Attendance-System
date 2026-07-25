import { createFileRoute } from "@tanstack/react-router";
import { RegisterPageComponent } from "../register";

export const Route = createFileRoute("/faculty/register")({
  head: () => ({ meta: [{ title: "Faculty Registration · SmartAttend AI" }] }),
  component: () => <RegisterPageComponent initialRole="professor" />,
});
