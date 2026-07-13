import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MembersLoginForm from "./MembersLoginForm";

export const metadata = {
  title: "Member Access — Vesper",
};

export default async function MembersAccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/members");

  return <MembersLoginForm />;
}
