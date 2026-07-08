"use client";

import { createClient } from "@/lib/supabase/client";

export default function MembersSignOut() {
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <button
      onClick={handleSignOut}
      style={{
        background: "transparent",
        border: "1px solid rgba(198,162,88,0.3)",
        color: "#9b988e",
        fontSize: 10,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        padding: "10px 20px",
        cursor: "pointer",
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        transition: "border-color .3s, color .3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(198,162,88,0.7)";
        (e.currentTarget as HTMLButtonElement).style.color = "#C6A258";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor =
          "rgba(198,162,88,0.3)";
        (e.currentTarget as HTMLButtonElement).style.color = "#9b988e";
      }}
    >
      Sign out
    </button>
  );
}
