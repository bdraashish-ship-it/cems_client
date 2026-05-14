import React, { useState } from "react";
import { LogIn, Lock, Mail, Loader2, AlertCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { setToken, logout, setSessionExpired } from "../../services/features/authSlice";
import { useLoginMutation } from "../../services/authApi";
import { Modal } from "./Modal/Modal";
import { InputField } from "../widgets/InputField";
import { Button } from "../widgets/Button";

export const ReLoginModal: React.FC = () => {
  const dispatch = useDispatch();
  const sessionExpired = useSelector((state: RootState) => state.auth.sessionExpired);
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!sessionExpired) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setToken(response.access_token));
      dispatch(setSessionExpired(false));
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err?.data?.detail || "Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <Modal
      isOpen={sessionExpired}
      onClose={() => { }} // Cannot close without login
      title="Session Expired"
      size="sm"
    >
      <div style={{ padding: "8px 4px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "#fff7ed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            border: "1px solid #ffedd5"
          }}>
            <Lock size={32} color="#f97316" />
          </div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1e293b", margin: "0 0 8px" }}>Secure Re-Authentication</h3>
          <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.5 }}>
            Your security token has expired. Please enter your password to continue your current session.
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <InputField
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
          <InputField
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <div style={{
              padding: "12px",
              borderRadius: "10px",
              background: "#fef2f2",
              border: "1px solid #fee2e2",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              color: "#dc2626",
              fontSize: "0.85rem"
            }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              style={{ width: "100%", height: "46px", fontSize: "0.95rem" }}
            >
              {isLoading ? (
                <><Loader2 size={18} style={{ animation: "spin 1s linear infinite", marginRight: "8px" }} /> Re-Authenticating...</>
              ) : (
                <><LogIn size={18} style={{ marginRight: "8px" }} /> Restore Session</>
              )}
            </Button>

            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <XCircle size={14} />
              Log out and return to login screen
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Modal>
  );
};
