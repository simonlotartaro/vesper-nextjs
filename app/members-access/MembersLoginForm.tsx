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

type Step = "login" | "create";

export default function MembersLoginForm() {
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const approvalRes = await fetch("/api/members/check-approval", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const { approved } = await approvalRes.json();

    if (!approved) {
      setError("Access reserved. Membership is by invitation only.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!signInError) {
      window.location.href = "/members";
      return;
    }

    if (
      signInError.message.toLowerCase().includes("invalid") ||
      signInError.message.toLowerCase().includes("credentials")
    ) {
      setStep("create");
      setPassword("");
      setLoading(false);
      return;
    }

    setError(signInError.message);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    const createRes = await fetch("/api/members/create-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!createRes.ok) {
      const { error: createErr } = await createRes.json();
      if (createErr === "already_exists") {
        setStep("login");
        setPassword("");
        setError("Incorrect password. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!signInError) {
      window.location.href = "/members";
      return;
    }

    setError(signInError.message);
    setLoading(false);
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

          {step === "login" && (
            <>
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
                Enter with your approved Vesper credentials.
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
            </>
          )}

          {step === "create" && (
            <>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "clamp(26px,3vw,36px)",
                  color: "#F4EFE4",
                  lineHeight: 1.1,
                  margin: "0 0 8px",
                }}
              >
                Create your password.
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
                Welcome,{" "}
                <strong style={{ color: "#F4EFE4" }}>{email}</strong>. Set a
                password to access your account.
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
                  }}
                >
                  {error}
                </div>
              )}

              <form
                onSubmit={handleCreate}
                style={{ display: "flex", flexDirection: "column", gap: 22 }}
              >
                <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  <span style={fieldLabel}>New Password</span>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="v-field"
                    style={fieldStyle}
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  <span style={fieldLabel}>Confirm Password</span>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="v-field"
                    style={fieldStyle}
                    minLength={8}
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
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
                  {loading ? "..." : "Set Password"}
                </button>
              </form>

              <button
                onClick={() => {
                  setStep("login");
                  setPassword("");
                  setError("");
                }}
                style={{
                  marginTop: 20,
                  background: "transparent",
                  border: "none",
                  color: "#56544c",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  padding: 0,
                  fontFamily: "'Hanken Grotesk', system-ui, sans-serif",
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                ← Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
