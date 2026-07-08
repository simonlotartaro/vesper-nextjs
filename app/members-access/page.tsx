import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MembersLoginForm from "./MembersLoginForm";

export const metadata = {
  title: "Member Access — Vesper",
};

export default async function MembersAccessPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) redirect("/members");

  return <MembersLoginForm />;
}
