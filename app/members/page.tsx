import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import MembersSignOut from "./MembersSignOut";

export const metadata = {
  title: "Members — Vesper",
};

export default async function MembersPage() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/members-access");

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("members")
    .select("status, name")
    .eq("email", session.user.email!)
    .single();

  if (member?.status !== "approved") {
    await supabase.auth.signOut();
    redirect("/members-access");
  }

  const memberName = member?.name || session.user.email;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06080F",
        color: "#ECE7DB",
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "28px clamp(28px,5vw,72px)",
          background:
            "linear-gradient(to bottom, rgba(6,8,15,0.95), rgba(6,8,15,0))",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/vesper-logo.png"
          alt="Vesper"
          style={{ width: 52, height: "auto", opacity: 0.9 }}
        />
        <MembersSignOut />
      </header>

      {/* Hero */}
      <div
        style={{
          paddingTop: "clamp(120px,18vh,180px)",
          paddingBottom: "clamp(60px,8vh,100px)",
          paddingLeft: "clamp(28px,5vw,72px)",
          paddingRight: "clamp(28px,5vw,72px)",
          borderBottom: "1px solid rgba(198,162,88,0.12)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "#C6A258",
            marginBottom: 24,
          }}
        >
          Members
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: "clamp(40px,6vw,76px)",
            color: "#F4EFE4",
            lineHeight: 1.05,
            margin: "0 0 16px",
            letterSpacing: "-0.01em",
          }}
        >
          Private access.
        </h1>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(17px,1.8vw,24px)",
            color: "#9b988e",
            margin: 0,
          }}
        >
          Welcome, {memberName}.
        </p>
      </div>

      <main
        style={{ padding: "clamp(52px,8vh,100px) clamp(28px,5vw,72px)" }}
      >
        {/* Upcoming Events */}
        <section style={{ marginBottom: "clamp(60px,9vh,100px)" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#C6A258",
              marginBottom: 36,
            }}
          >
            Upcoming Events
          </div>
          <div
            style={{
              background: "#0B0E16",
              border: "1px solid rgba(198,162,88,0.18)",
              padding: "clamp(28px,4vw,44px)",
              maxWidth: 560,
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                fontSize: "clamp(22px,2.6vw,32px)",
                color: "#F4EFE4",
                marginBottom: 8,
                lineHeight: 1.15,
              }}
            >
              Gran Premio Madrid 2026
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "clamp(14px,1.3vw,17px)",
                color: "#C6A258",
                marginBottom: 20,
              }}
            >
              Noche de cierre · IFEMA
            </div>
            <span
              style={{
                display: "block",
                width: 32,
                height: 1,
                background: "rgba(198,162,88,0.3)",
                marginBottom: 20,
              }}
            />
            <p
              style={{
                fontSize: 13,
                color: "#56544c",
                fontWeight: 300,
                margin: 0,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Details available soon.
            </p>
          </div>
        </section>

        {/* Member Benefits */}
        <section style={{ marginBottom: "clamp(60px,9vh,100px)" }}>
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#C6A258",
              marginBottom: 36,
            }}
          >
            Member Benefits
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
              maxWidth: 860,
            }}
          >
            {[
              {
                title: "Private invitations",
                desc: "Exclusive access to Vesper events before public announcement.",
              },
              {
                title: "Priority access",
                desc: "First selection of tables, seats and experiences within each event.",
              },
              {
                title: "Curated experiences",
                desc: "Access to curated moments around elite sport, culture and the circle.",
              },
            ].map((b) => (
              <div
                key={b.title}
                style={{
                  background: "#0B0E16",
                  border: "1px solid rgba(198,162,88,0.13)",
                  padding: "clamp(24px,3vw,36px)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(18px,1.8vw,22px)",
                    color: "#F4EFE4",
                    marginBottom: 12,
                    fontWeight: 400,
                    lineHeight: 1.2,
                  }}
                >
                  {b.title}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "#9b988e",
                    margin: 0,
                    lineHeight: 1.65,
                    fontWeight: 300,
                  }}
                >
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Vesper Circle */}
        <section
          style={{
            borderTop: "1px solid rgba(198,162,88,0.12)",
            paddingTop: "clamp(52px,7vh,80px)",
            maxWidth: 560,
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "#C6A258",
              marginBottom: 28,
            }}
          >
            Vesper Circle
          </div>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: "clamp(18px,1.8vw,22px)",
              color: "#d6d2c8",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            A private environment built around elite sport, culture and the
            people who belong inside the circle.
          </p>
        </section>
      </main>

      <footer
        style={{
          borderTop: "1px solid rgba(198,162,88,0.1)",
          padding: "28px clamp(28px,5vw,72px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#3a3830",
          }}
        >
          © Vesper — Private & Confidential
        </div>
        <a
          href="mailto:info@vesperevent.com"
          className="v-link"
          style={{
            fontSize: 11,
            letterSpacing: "0.1em",
            color: "#56544c",
            textDecoration: "none",
          }}
        >
          info@vesperevent.com
        </a>
      </footer>
    </div>
  );
}
