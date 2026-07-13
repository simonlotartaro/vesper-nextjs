"use client";

import React, { useState } from "react";

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

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: "0.22em",
  textTransform: "uppercase" as const,
  color: "#9b988e",
};

interface LoginStrings {
  eyebrow: string;
  loginTitle: string;
  loginDesc: string;
  emailLabel: string;
  pwInputLabel: string;
  continueBtn: string;
  inviteNote: string;
}

const defaultStrings: LoginStrings = {
  eyebrow: "Members",
  loginTitle: "Member access.",
  loginDesc: "Enter with your Vesper credentials.",
  emailLabel: "Email",
  pwInputLabel: "Password",
  continueBtn: "Continue",
  inviteNote: "Membership is by invitation only.",
};

interface Props {
  strings?: Partial<LoginStrings>;
}

export default function MembersLoginFields({ strings: overrides }: Props = {}) {
  const s = { ...defaultStrings, ...overrides };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    try {
      const res = await fetch("/api/members/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });
      clearTimeout(timeoutId);

      if (res.status === 401) {
        setError("Invalid email or password.");
        return;
      }
      if (res.status === 403) {
        setError("Access reserved. Membership is by invitation only.");
        return;
      }
      if (!res.ok) {
        setError("Unable to access the members area. Please try again.");
        return;
      }

      window.location.assign("/members");
    } catch (err) {
      clearTimeout(timeoutId);
      const isAbort = err instanceof Error && err.name === "AbortError";
      console.error(
        "[MembersLoginFields]",
        isAbort ? "Request timed out" : "Unexpected error:",
        err
      );
      setError("Unable to access the members area. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        style={{
          fontSize: 10,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: "#C6A258",
          marginBottom: 24,
        }}
      >
        {s.eyebrow}
      </div>

      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "clamp(28px,3vw,38px)",
          color: "#F4EFE4",
          lineHeight: 1.1,
          margin: "0 0 8px",
        }}
      >
        {s.loginTitle}
      </h2>
      <p
        style={{
          fontSize: 13,
          color: "#9b988e",
          fontWeight: 300,
          margin: "0 0 36px",
          lineHeight: 1.6,
        }}
      >
        {s.loginDesc}
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
          <span style={fieldLabelStyle}>{s.emailLabel}</span>
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
          <span style={fieldLabelStyle}>{s.pwInputLabel}</span>
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
          {loading ? "..." : s.continueBtn}
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
        {s.inviteNote}
      </div>
    </>
  );
}
