import { redirect } from "next/navigation";

export default function Home() {
  // Middleware handles checking session tokens.
  // Unauthenticated users -> redirected to /login
  // Authenticated users -> land on /dashboard
  redirect("/dashboard");
}