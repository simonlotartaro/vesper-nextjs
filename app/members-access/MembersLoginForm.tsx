"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const fieldStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(236,231,219,0.16)",
  color: "#F4EFE4",
  fontSize: 15,
  padding: "9px 0",
  outline: "none",
  width: "100%",
  fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
};

const fieldLabel: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
  color: "#9b988e",
};

export default function MembersLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Invalid email or password.");
        return;
      }

      // Email is read from the active session server-side — not sent in body
      const approvalRes = await fetch("/api/members/check-approval", {
        method: "POST",
      });

      if (approvalRes.status === 500) {
        await supabase.auth.signOut();
        setError("Unable to verify membership. Please try again.");
        return;
      }

      const { approved } = await approvalRes.json();

      if (!approved) {
        await supabase.auth.signOut();
        setError("Access reserved. Membership is by invitation only.");
        return;
      }

      window.location.assign("/members");
    } catch (err) {
      console.error("[MembersLoginForm] Unexpected error:", err);
      await supabase.auth.signOut();
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
              fontSize: "clamp(28px,3vw,38px)",
              color: "#F4EFE4",
              lineHeight: 1.1,
              margin: "0 0 8px",
            }}
          >
            Member access.
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "#9b988e",
              fontWeight: 300,
              margin: "0 0 36px",
              lineHeight: 1.6,
            }}
          >
            Enter with your Vesper credentials.
          </p>

          {error && (
            <div
              style={{
                fontSize: 12,
                color: "#C6A258",
                border: "1px solid rgba(198,162,88,0.25)",
                padding: "12px 16px",
                marginBottom: 24,
                lineHeight: 1.5,
                letterSpacing: "0.02em",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: 22 }}
          >
            <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={fieldLabel}>Email</span>
              <input
                required
                type="email"
                placeholder="you@email.com"
                className="v-field"
                style={fieldStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <span style={fieldLabel}>Password</span>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="v-field"
                style={fieldStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="v-submit"
              style={{
                marginTop: 4,
                color: "#06080F",
                background: loading ? "rgba(208,171,96,0.5)" : "#D0AB60",
                border: "none",
                fontSize: 12,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                padding: "16px 30px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
              }}
            >
              {loading ? "..." : "Continue"}
            </button>
          </form>

          <div
            style={{
              marginTop: 28,
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#3a3830",
              textAlign: "center",
            }}
          >
            Membership is by invitation only.
          </div>
        </div>
      </div>
    </div>
  );
}
