"use client";

import MembersLoginFields from "@/components/MembersLoginFields";

export default function MembersLoginForm() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#06080F",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
        color: "#ECE7DB",
      }}
    >
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/vesper-logo.png"
            alt="Vesper"
            style={{ width: 80, height: "auto", opacity: 0.9 }}
          />
        </div>
        <div
          style={{
            background: "#0B0E16",
            border: "1px solid rgba(198,162,88,0.22)",
            boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
            padding: "clamp(36px,5vw,52px)",
          }}
        >
          <MembersLoginFields />
        </div>
      </div>
    </div>
  );
}
