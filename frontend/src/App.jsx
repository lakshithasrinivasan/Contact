import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const BLUE = "#2196F3";
const BLUE_DARK = "#1565C0";
const RED = "#F44336";
const BG = "#f5f0e8";

// --- API Helper ---
const fetchApi = async (path, options = {}) => {
  try {
    const config = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    };
    
    if (options.body) {
      config.body = options.body;
    }

    const res = await fetch(`${API_BASE}${path}`, config);
    
    let data = null;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    }

    if (!res.ok) {
      throw new Error(data?.message || `HTTP ${res.status}: ${res.statusText}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// --- Icons ---
const EmailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.13 12.7 19.79 19.79 0 0 1 1.06 4.11 2 2 0 0 1 3 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LoginIcon = () => (
  <div style={{ position: "relative", width: 72, height: 58, marginBottom: 4 }}>
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ position: "absolute", left: 0, bottom: 0 }}>
      <rect x="8" y="18" width="32" height="24" rx="5" fill="#29B6F6" />
      <rect x="14" y="22" width="20" height="14" rx="3" fill="#0288D1" />
      <circle cx="24" cy="29" r="3" fill="#fff" />
      <rect x="22.5" y="29" width="3" height="5" rx="1.5" fill="#fff" />
      <path d="M16 18V14C16 9.58 19.58 6 24 6C28.42 6 32 9.58 32 14V18" stroke="#FFC107" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ position: "absolute", right: -4, bottom: 0 }}>
      <circle cx="14" cy="14" r="13" fill="#FFC107" stroke="#fff" strokeWidth="2" />
      <circle cx="14" cy="11" r="4" fill="#fff" />
      <path d="M6 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
);

// --- Shared Components ---
const InputField = ({ icon, type = "text", placeholder, value, onChange, autoComplete = "off" }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8,
    background: "#f7f8fa", borderRadius: 10, padding: "10px 14px",
    border: "1px solid #e8eaf0", width: "100%"
  }}>
    {icon}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      style={{
        border: "none", background: "transparent", fontSize: "clamp(12px, 2.5vw, 14px)",
        color: "#444", outline: "none", width: "100%",
        fontFamily: "Nunito, sans-serif"
      }}
    />
  </div>
);

const PrimaryBtn = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: disabled ? "#ccc" : BLUE, color: "#fff", border: "none", borderRadius: 10,
      padding: "clamp(10px, 2vw, 14px)", fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      width: "100%", fontFamily: "Nunito, sans-serif", letterSpacing: 0.3,
      transition: "background 0.15s", opacity: disabled ? 0.6 : 1
    }}
    onMouseEnter={e => !disabled && (e.target.style.background = BLUE_DARK)}
    onMouseLeave={e => !disabled && (e.target.style.background = BLUE)}
  >
    {children}
  </button>
);

const BottomPanel = ({ orLabel, linkText, onLinkClick }) => (
  <div style={{
    background: BLUE, borderRadius: "28px 28px 0 0",
    marginTop: "auto", padding: "clamp(18px, 4vw, 24px) clamp(18px, 5vw, 24px) clamp(26px, 6vw, 32px)",
    display: "flex", flexDirection: "column", gap: "clamp(10px, 2vh, 14px)"
  }}>
    <p style={{ fontSize: "clamp(13px, 2.8vw, 16px)", color: "rgba(255,255,255,0.75)", textAlign: "center", margin: 0 }}>{orLabel}</p>
    <p style={{ fontSize: "clamp(13px, 2.8vw, 16px)", color: "rgba(255,255,255,0.85)", textAlign: "center", margin: 0 }}>
      {linkText.prefix}{" "}
      <span
        onClick={onLinkClick}
        style={{ fontWeight: 800, cursor: "pointer", textDecoration: "underline" }}
      >
        {linkText.action}
      </span>
    </p>
  </div>
);

const PhoneFrame = ({ children, isMobile }) => {
  const baseStyle = {
    background: "#fff",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
  };

  if (isMobile) {
    return (
      <div style={{
        ...baseStyle,
        width: "min(90vw, 480px)",
        minHeight: "min(90vh, 700px)",
        borderRadius: "40px",
        border: "3px solid #222"
      }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{
      ...baseStyle,
      width: "100%",
      maxWidth: "1200px",
      minHeight: "auto",
      borderRadius: "8px",
      border: "1px solid #e5e7eb"
    }}>
      {children}
    </div>
  );
};

// --- Desktop Screens ---
const DesktopLoginScreen = ({ onSwitch, loading, error, email, setEmail, password, setPassword, onLogin, screenSize }) => (
  <div style={{ 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    minHeight: "100vh", 
    padding: screenSize >= 1920 ? "3rem" : screenSize >= 1366 ? "2.5rem" : "2rem" 
  }}>
    <div style={{
      background: "white", 
      borderRadius: 16, 
      padding: screenSize >= 1920 ? "3.5rem" : screenSize >= 1366 ? "3rem" : "3rem", 
      maxWidth: screenSize >= 1920 ? 580 : 520, 
      width: "100%",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)", 
      borderLeft: "6px solid " + BLUE
    }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: screenSize >= 1920 ? "3rem" : "2.5rem" }}>
        <LoginIcon />
      </div>
      <h2 style={{ 
        fontSize: screenSize >= 1920 ? 40 : screenSize >= 1366 ? 32 : 32, 
        fontWeight: 800, 
        color: "#1a1a2e", 
        margin: "0 0 0.75rem 0", 
        textAlign: "center" 
      }}>Welcome Back!</h2>
      <p style={{ 
        fontSize: screenSize >= 1920 ? 17 : screenSize >= 1366 ? 15 : 15, 
        fontWeight: 600, 
        color: "#666", 
        textAlign: "center", 
        marginBottom: screenSize >= 1920 ? "2.5rem" : "2rem" 
      }}>Sign in to manage your contacts</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: screenSize >= 1920 ? "1.75rem" : "1.25rem" }}>
        <div>
          <label style={{ 
            fontSize: screenSize >= 1920 ? 15 : 14, 
            fontWeight: 700, 
            marginBottom: "0.6rem", 
            display: "block", 
            color: "#444" 
          }}>Email Address</label>
          <InputField icon={<EmailIcon />} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" />
        </div>
        <div>
          <label style={{ 
            fontSize: screenSize >= 1920 ? 15 : 14, 
            fontWeight: 700, 
            marginBottom: "0.6rem", 
            display: "block", 
            color: "#444" 
          }}>Password</label>
          <InputField icon={<LockIcon />} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
        </div>
        {error && <p style={{ 
          fontSize: screenSize >= 1920 ? 14 : 13, 
          color: RED, 
          textAlign: "center", 
          margin: "0.5rem 0", 
          padding: "0.75rem", 
          background: "#fee2e2", 
          borderRadius: 6 
        }}>{error}</p>}
        <PrimaryBtn onClick={onLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login Account"}
        </PrimaryBtn>
      </div>
      
      <hr style={{ margin: screenSize >= 1920 ? "2.5rem 0" : "2rem 0", border: "none", borderTop: "1px solid #e5e7eb" }} />
      <p style={{ textAlign: "center", fontSize: screenSize >= 1920 ? 16 : 15, color: "#666" }}>
        Don't have an account?{" "}
        <span onClick={() => onSwitch("register")} style={{ color: BLUE, fontWeight: 800, cursor: "pointer", textDecoration: "underline" }}>
          Create Account
        </span>
      </p>
    </div>
  </div>
);

const DesktopRegisterScreen = ({ onSwitch, loading, error, form, setForm, onRegister, screenSize }) => {
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "100vh", 
      padding: screenSize >= 1920 ? "3rem" : screenSize >= 1366 ? "2.5rem" : "2rem" 
    }}>
      <div style={{
        background: "white", 
        borderRadius: 16, 
        padding: screenSize >= 1920 ? "3.5rem" : screenSize >= 1366 ? "3rem" : "3rem", 
        maxWidth: screenSize >= 1920 ? 580 : 520, 
        width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)", 
        borderLeft: "6px solid " + BLUE
      }}>
        <h2 style={{ 
          fontSize: screenSize >= 1920 ? 40 : screenSize >= 1366 ? 32 : 32, 
          fontWeight: 800, 
          color: "#1a1a2e", 
          margin: "0 0 0.75rem 0", 
          textAlign: "center" 
        }}>Join Us</h2>
        <p style={{ 
          fontSize: screenSize >= 1920 ? 17 : screenSize >= 1366 ? 15 : 15, 
          fontWeight: 600, 
          color: "#666", 
          textAlign: "center", 
          marginBottom: screenSize >= 1920 ? "2.5rem" : "2rem" 
        }}>Create your account today</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: screenSize >= 1920 ? "1.75rem" : "1.25rem" }}>
          <div>
            <label style={{ 
              fontSize: screenSize >= 1920 ? 15 : 14, 
              fontWeight: 700, 
              marginBottom: "0.6rem", 
              display: "block", 
              color: "#444" 
            }}>Full Name</label>
            <InputField icon={<UserIcon />} placeholder="John Doe" value={form.name} onChange={set("name")} autoComplete="off" />
          </div>
          <div>
            <label style={{ 
              fontSize: screenSize >= 1920 ? 15 : 14, 
              fontWeight: 700, 
              marginBottom: "0.6rem", 
              display: "block", 
              color: "#444" 
            }}>Email Address</label>
            <InputField icon={<EmailIcon />} type="email" placeholder="your@email.com" value={form.email} onChange={set("email")} autoComplete="off" />
          </div>
          <div>
            <label style={{ 
              fontSize: screenSize >= 1920 ? 15 : 14, 
              fontWeight: 700, 
              marginBottom: "0.6rem", 
              display: "block", 
              color: "#444" 
            }}>Password</label>
            <InputField icon={<LockIcon />} type="password" placeholder="••••••••" value={form.password} onChange={set("password")} autoComplete="new-password" />
          </div>
          {error && <p style={{ 
            fontSize: screenSize >= 1920 ? 14 : 13, 
            color: RED, 
            textAlign: "center", 
            margin: "0.5rem 0", 
            padding: "0.75rem", 
            background: "#fee2e2", 
            borderRadius: 6 
          }}>{error}</p>}
          <PrimaryBtn onClick={onRegister} disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </PrimaryBtn>
        </div>
        
        <hr style={{ margin: screenSize >= 1920 ? "2.5rem 0" : "2rem 0", border: "none", borderTop: "1px solid #e5e7eb" }} />
        <p style={{ textAlign: "center", fontSize: screenSize >= 1920 ? 16 : 15, color: "#666" }}>
          Already have an account?{" "}
          <span onClick={() => onSwitch("login")} style={{ color: BLUE, fontWeight: 800, cursor: "pointer", textDecoration: "underline" }}>
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

const DesktopContactsScreen = ({ contacts, loading, error, onLogout, form, setForm, onAddContact, onEditContact, onDeleteContact, editingId, screenSize, isMobile }) => {
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const isEditing = !!editingId;
  
  // Responsive layout: on tablets (769-1024px), stack vertically; on larger screens use sidebar
  const shouldStackVertically = screenSize < 1024;
  const sidebarWidth = screenSize >= 1920 ? 420 : screenSize >= 1366 ? 380 : screenSize >= 1024 ? 320 : 300;
  const gridColumns = screenSize >= 1920 ? 4 : screenSize >= 1366 ? 3 : screenSize >= 1024 ? 2 : 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f9fafb" }}>
      {/* Header */}
      <div style={{ 
        padding: screenSize >= 1920 ? "2rem 2.5rem" : screenSize >= 1366 ? "1.75rem 2rem" : screenSize >= 1024 ? "1.25rem 1.5rem" : "1rem 1.25rem", 
        borderBottom: "1px solid #e5e7eb", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h2 style={{ 
            fontSize: screenSize >= 1920 ? 36 : screenSize >= 1366 ? 32 : screenSize >= 1024 ? 24 : 22, 
            fontWeight: 800, 
            color: "#1a1a2e", 
            margin: 0 
          }}>Contacts</h2>
          <p style={{ 
            fontSize: screenSize >= 1366 ? 15 : screenSize >= 1024 ? 14 : 13, 
            color: "#666", 
            margin: "0.5rem 0 0 0" 
          }}>Total: {contacts.length} contacts</p>
        </div>
        <button
          onClick={onLogout}
          style={{
            background: RED, color: "#fff", border: "none", borderRadius: 8,
            padding: screenSize >= 1920 ? "12px 28px" : screenSize >= 1366 ? "10px 20px" : screenSize >= 1024 ? "8px 16px" : "8px 14px", 
            fontSize: screenSize >= 1920 ? 16 : screenSize >= 1366 ? 15 : screenSize >= 1024 ? 14 : 13, 
            fontWeight: 700, 
            cursor: "pointer",
            transition: "all 0.2s",
            minHeight: screenSize >= 1024 ? 44 : 40,
            whiteSpace: "nowrap"
          }}
          onMouseEnter={e => e.target.style.background = "#d32f2f"}
          onMouseLeave={e => e.target.style.background = RED}
        >
          Logout
        </button>
      </div>

      {/* Main Content - Responsive Layout: Two Column on desktop, Single Column on tablets */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", flexDirection: shouldStackVertically ? "column" : "row" }}>
        {/* Left Sidebar - Form */}
        <div style={{
          width: shouldStackVertically ? "100%" : sidebarWidth,
          minWidth: shouldStackVertically ? "100%" : sidebarWidth,
          maxHeight: shouldStackVertically ? "auto" : "100%",
          borderRight: shouldStackVertically ? "none" : "1px solid #e5e7eb",
          borderBottom: shouldStackVertically ? "1px solid #e5e7eb" : "none",
          background: "white",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto"
        }}>
          <div style={{ padding: screenSize >= 1920 ? "2.5rem" : screenSize >= 1366 ? "2rem" : screenSize >= 1024 ? "1.5rem" : "1.25rem" }}>
            <div style={{ 
              background: isEditing ? "#dbeafe" : "#eff6ff", 
              borderRadius: 8, 
              padding: screenSize >= 1920 ? "1.75rem" : screenSize >= 1366 ? "1.5rem" : screenSize >= 1024 ? "1.25rem" : "1rem",
              marginBottom: "1.5rem"
            }}>
              <p style={{ 
                fontSize: screenSize >= 1920 ? 20 : screenSize >= 1366 ? 18 : screenSize >= 1024 ? 16 : 15, 
                fontWeight: 800, 
                color: "#1a1a2e", 
                margin: "0 0 1rem 0" 
              }}>
                {isEditing ? "✏️ Edit Contact" : "➕ Add Contact"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{ fontSize: screenSize >= 1024 ? 13 : 12, fontWeight: 700, marginBottom: "0.5rem", display: "block", color: "#444" }}>Full Name</label>
                  <InputField icon={<UserIcon />} placeholder="John Doe" value={form.name} onChange={set("name")} />
                </div>
                <div>
                  <label style={{ fontSize: screenSize >= 1024 ? 13 : 12, fontWeight: 700, marginBottom: "0.5rem", display: "block", color: "#444" }}>Email</label>
                  <InputField icon={<EmailIcon />} type="email" placeholder="john@example.com" value={form.email} onChange={set("email")} />
                </div>
                <div>
                  <label style={{ fontSize: screenSize >= 1024 ? 13 : 12, fontWeight: 700, marginBottom: "0.5rem", display: "block", color: "#444" }}>Phone</label>
                  <InputField icon={<PhoneIcon />} type="tel" placeholder="123-456-7890" value={form.phone} onChange={set("phone")} />
                </div>
                <div>
                  <label style={{ fontSize: screenSize >= 1024 ? 13 : 12, fontWeight: 700, marginBottom: "0.5rem", display: "block", color: "#444" }}>Address</label>
                  <InputField icon={<PinIcon />} placeholder="123 Main St" value={form.address} onChange={set("address")} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <PrimaryBtn onClick={onAddContact} disabled={loading}>
                    {isEditing ? "Update" : "Add"}
                  </PrimaryBtn>
                  {isEditing && (
                    <button onClick={() => setForm({ name: "", email: "", phone: "", address: "" })} 
                      style={{ flex: 1, background: "#e5e7eb", border: "none", borderRadius: 6, padding: screenSize >= 1024 ? "10px" : "8px", fontSize: screenSize >= 1024 ? 13 : 12, fontWeight: 700, cursor: "pointer", transition: "background 0.2s", minHeight: screenSize >= 1024 ? 40 : 36 }}
                      onMouseEnter={e => e.target.style.background = "#d1d5db"}
                      onMouseLeave={e => e.target.style.background = "#e5e7eb"}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ 
                padding: "1rem", 
                background: "#fee2e2", 
                border: "1px solid #fecaca",
                borderRadius: 6, 
                color: "#991b1b",
                fontSize: 13
              }}>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area - Contacts List */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ 
            padding: screenSize >= 1920 ? "2.5rem" : screenSize >= 1366 ? "2rem" : screenSize >= 1024 ? "1.5rem" : "1.25rem" 
          }}>
            {loading && (
              <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
                <p style={{ fontSize: screenSize >= 1024 ? 16 : 14, color: "#999" }}>Loading contacts...</p>
              </div>
            )}
            
            {!loading && contacts.length === 0 && (
              <div style={{ 
                textAlign: "center", 
                padding: "2rem 1rem",
                background: "white",
                borderRadius: 8
              }}>
                <p style={{ fontSize: screenSize >= 1024 ? 18 : 16, color: "#999", margin: 0 }}>No contacts yet</p>
                <p style={{ fontSize: screenSize >= 1024 ? 14 : 13, color: "#bbb", margin: "0.5rem 0 0 0" }}>Add your first contact using the form {shouldStackVertically ? "above" : "on the left"}</p>
              </div>
            )}

            {!loading && contacts.length > 0 && (
              <>
                <h3 style={{ 
                  fontSize: screenSize >= 1920 ? 24 : screenSize >= 1366 ? 20 : screenSize >= 1024 ? 18 : 16, 
                  fontWeight: 700, 
                  color: "#1a1a2e", 
                  margin: "0 0 2rem 0" 
                }}>
                  All Contacts ({contacts.length})
                </h3>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: shouldStackVertically ? "1fr" : `repeat(auto-fill, minmax(${screenSize >= 1920 ? 340 : screenSize >= 1366 ? 300 : screenSize >= 1024 ? 250 : 280}px, 1fr))`,
                  gap: screenSize >= 1920 ? "2rem" : screenSize >= 1366 ? "1.75rem" : screenSize >= 1024 ? "1.25rem" : "1rem"
                }}>
                  {contacts.map(c => (
                    <div key={c._id} style={{ 
                      background: "white", 
                      border: "1px solid #e5e7eb", 
                      borderRadius: 10, 
                      padding: screenSize >= 1920 ? "1.75rem" : screenSize >= 1366 ? "1.5rem" : screenSize >= 1024 ? "1.25rem" : "1rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%"
                    }}
                    onMouseEnter={e => {
                      if (!('ontouchstart' in window)) { // Only on desktop
                        e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.borderColor = BLUE;
                      }
                    }}
                    onMouseLeave={e => {
                      if (!('ontouchstart' in window)) { // Only on desktop
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }
                    }}>
                      <div style={{ marginBottom: "1rem", flex: 1 }}>
                        <p style={{ 
                          fontSize: screenSize >= 1920 ? 20 : screenSize >= 1366 ? 18 : screenSize >= 1024 ? 16 : 15, 
                          fontWeight: 800, 
                          color: "#1a1a2e", 
                          margin: 0,
                          wordBreak: "break-word"
                        }}>{c.name}</p>
                        <p style={{ fontSize: screenSize >= 1024 ? 13 : 12, color: "#999", margin: "0.5rem 0 0 0" }}>Contact</p>
                      </div>

                      <div style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "0.75rem", 
                        marginBottom: "1.25rem", 
                        fontSize: screenSize >= 1366 ? 14 : screenSize >= 1024 ? 13 : 12 
                      }}>
                        <p style={{ color: "#666", margin: 0, display: "flex", alignItems: "flex-start", gap: "0.5rem", overflowWrap: "break-word" }}>
                          <span style={{ color: "#2196F3", fontWeight: 700, flexShrink: 0 }}>📧</span>
                          <span style={{ wordBreak: "break-word" }}>{c.email}</span>
                        </p>
                        {c.phone && (
                          <p style={{ color: "#666", margin: 0, display: "flex", alignItems: "flex-start", gap: "0.5rem", overflowWrap: "break-word" }}>
                            <span style={{ color: "#2196F3", fontWeight: 700, flexShrink: 0 }}>📱</span>
                            <span style={{ wordBreak: "break-word" }}>{c.phone}</span>
                          </p>
                        )}
                        {c.address && (
                          <p style={{ color: "#666", margin: 0, display: "flex", alignItems: "flex-start", gap: "0.5rem", overflowWrap: "break-word" }}>
                            <span style={{ color: "#2196F3", fontWeight: 700, flexShrink: 0 }}>📍</span>
                            <span style={{ wordBreak: "break-word" }}>{c.address}</span>
                          </p>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                        <button 
                          onClick={() => onEditContact(c)} 
                          style={{ 
                            flex: 1, 
                            background: BLUE, 
                            color: "#fff", 
                            border: "none", 
                            borderRadius: 6, 
                            padding: screenSize >= 1366 ? "12px" : screenSize >= 1024 ? "10px" : "8px", 
                            fontSize: screenSize >= 1366 ? 14 : screenSize >= 1024 ? 13 : 12, 
                            fontWeight: 600, 
                            cursor: "pointer",
                            transition: "all 0.2s",
                            minHeight: screenSize >= 1024 ? 40 : 36,
                            touchAction: "manipulation"
                          }}
                          onMouseEnter={e => {
                            if (!('ontouchstart' in window)) {
                              e.target.style.background = BLUE_DARK;
                              e.target.style.transform = "scale(1.02)";
                            }
                          }}
                          onMouseLeave={e => {
                            if (!('ontouchstart' in window)) {
                              e.target.style.background = BLUE;
                              e.target.style.transform = "scale(1)";
                            }
                          }}>
                          Edit
                        </button>
                        <button 
                          onClick={() => onDeleteContact(c._id)} 
                          style={{ 
                            flex: 1, 
                            background: RED, 
                            color: "#fff", 
                            border: "none", 
                            borderRadius: 6, 
                            padding: screenSize >= 1366 ? "12px" : screenSize >= 1024 ? "10px" : "8px", 
                            fontSize: screenSize >= 1366 ? 14 : screenSize >= 1024 ? 13 : 12, 
                            fontWeight: 600, 
                            cursor: "pointer",
                            transition: "all 0.2s",
                            minHeight: screenSize >= 1024 ? 40 : 36,
                            touchAction: "manipulation"
                          }}
                          onMouseEnter={e => {
                            if (!('ontouchstart' in window)) {
                              e.target.style.background = "#d32f2f";
                              e.target.style.transform = "scale(1.02)";
                            }
                          }}
                          onMouseLeave={e => {
                            if (!('ontouchstart' in window)) {
                              e.target.style.background = RED;
                              e.target.style.transform = "scale(1)";
                            }
                          }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Screens ---
const LoginScreen = ({ onSwitch, loading, error, email, setEmail, password, setPassword, onLogin }) => (
  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <div style={{ padding: "clamp(30px, 8vw, 40px) clamp(20px, 6vw, 28px) 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(8px, 2vh, 10px)", flex: 1, overflowY: "auto" }}>
      <LoginIcon />
      <h2 style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 800, color: "#1a1a2e", margin: 0 }}>Welcome Back!</h2>
      <p style={{ fontSize: "clamp(12px, 3vw, 14px)", fontWeight: 700, color: "#555", alignSelf: "flex-start", marginTop: 12 }}>Login Account</p>
      <InputField icon={<EmailIcon />} type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" />
      <InputField icon={<LockIcon />} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
      {error && <p style={{ fontSize: "clamp(11px, 2.5vw, 13px)", color: RED, textAlign: "center" }}>{error}</p>}
      <PrimaryBtn onClick={onLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login Account"}
      </PrimaryBtn>
    </div>
    <BottomPanel
      orLabel="New User"
      linkText={{ prefix: "Don't Have an Account?", action: "Create Account" }}
      onLinkClick={() => onSwitch("register")}
    />
  </div>
);

const RegisterScreen = ({ onSwitch, loading, error, form, setForm, onRegister }) => {
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "clamp(32px, 8vw, 36px) clamp(22px, 6vw, 28px) 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "clamp(8px, 2vh, 10px)", flex: 1, overflowY: "auto" }}>
        <h2 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 800, color: "#1a1a2e", margin: 0 }}>Join Us</h2>
        <p style={{ fontSize: "clamp(12px, 2.5vw, 16px)", fontWeight: 700, color: "#555", alignSelf: "flex-start" }}>Create Account</p>
        <InputField icon={<UserIcon />} placeholder="Full Name" value={form.name} onChange={set("name")} autoComplete="off" />
        <InputField icon={<EmailIcon />} type="email" placeholder="Email Address" value={form.email} onChange={set("email")} autoComplete="off" />
        <InputField icon={<LockIcon />} type="password" placeholder="Password" value={form.password} onChange={set("password")} autoComplete="new-password" />
        {error && <p style={{ fontSize: "clamp(11px, 2.5vw, 13px)", color: RED, textAlign: "center" }}>{error}</p>}
        <PrimaryBtn onClick={onRegister} disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </PrimaryBtn>
      </div>
      <BottomPanel
        orLabel="Existing User"
        linkText={{ prefix: "Already Have an Account?", action: "Back to Login" }}
        onLinkClick={() => onSwitch("login")}
      />
    </div>
  );
};

const ContactsScreen = ({ contacts, loading, error, onLogout, form, setForm, onAddContact, onEditContact, onDeleteContact, editingId }) => {
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const isEditing = !!editingId;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      {/* Header */}
      <div style={{ padding: "clamp(14px, 3vw, 18px) clamp(22px, 6vw, 28px)", borderBottom: "1px solid #e8eaf0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 800, color: "#1a1a2e", margin: 0 }}>Contacts</h2>
        <button
          onClick={onLogout}
          style={{
            background: RED, color: "#fff", border: "none", borderRadius: 6,
            padding: "clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 14px)", fontSize: "clamp(11px, 2.5vw, 13px)", fontWeight: 700, cursor: "pointer",
            transition: "background 0.15s"
          }}
          onMouseEnter={e => e.target.style.background = "#d32f2f"}
          onMouseLeave={e => e.target.style.background = RED}
        >
          Logout
        </button>
      </div>

      {/* Add Form */}
      <div style={{ padding: "clamp(12px, 2.5vw, 14px) clamp(22px, 6vw, 28px)", borderBottom: "1px solid #e8eaf0", display: "flex", flexDirection: "column", gap: "clamp(8px, 2vh, 10px)" }}>
        <p style={{ fontSize: "clamp(11px, 2.5vw, 13px)", fontWeight: 700, color: "#555", margin: 0 }}>{isEditing ? "Edit Contact" : "Add Contact"}</p>
        <InputField icon={<UserIcon />} placeholder="Name" value={form.name} onChange={set("name")} />
        <InputField icon={<EmailIcon />} type="email" placeholder="Email" value={form.email} onChange={set("email")} />
        <InputField icon={<PhoneIcon />} type="tel" placeholder="Phone" value={form.phone} onChange={set("phone")} />
        <InputField icon={<PinIcon />} placeholder="Address" value={form.address} onChange={set("address")} />
        <div style={{ display: "flex", gap: 8 }}>
          <PrimaryBtn onClick={onAddContact} disabled={loading}>
            {isEditing ? "Update" : "Add"}
          </PrimaryBtn>
          {isEditing && <button onClick={() => setForm({ name: "", email: "", phone: "", address: "" })} style={{ flex: 1, background: "#e8eaf0", border: "none", borderRadius: 6, padding: "clamp(8px, 2vw, 10px)", fontSize: "clamp(11px, 2.5vw, 13px)", fontWeight: 700, cursor: "pointer" }}>
            Cancel
          </button>}
        </div>
        {error && <p style={{ fontSize: "clamp(10px, 2.5vw, 12px)", color: RED, margin: 0 }}>{error}</p>}
      </div>

      {/* Contacts List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "clamp(12px, 2.5vw, 14px) clamp(22px, 6vw, 28px)", display: "flex", flexDirection: "column", gap: "clamp(8px, 2vh, 10px)" }}>
        {loading && <p style={{ fontSize: "clamp(12px, 2.5vw, 14px)", color: "#999", textAlign: "center" }}>Loading...</p>}
        {!loading && contacts.length === 0 && <p style={{ fontSize: "clamp(12px, 2.5vw, 14px)", color: "#999", textAlign: "center" }}>No contacts yet</p>}
        {contacts.map(c => (
          <div key={c._id} style={{ background: "#f9fafb", border: "1px solid #e8eaf0", borderRadius: 8, padding: "clamp(10px, 2vw, 12px)" }}>
            <p style={{ fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 700, color: "#1a1a2e", margin: "0 0 4px" }}>{c.name}</p>
            <p style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: "#999", margin: "0 0 6px" }}>{c.email}</p>
            {c.phone && <p style={{ fontSize: "clamp(10px, 2.5vw, 11px)", color: "#999", margin: "0 0 6px" }}>{c.phone}</p>}
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => onEditContact(c)} style={{ flex: 1, background: BLUE, color: "#fff", border: "none", borderRadius: 4, padding: "clamp(5px, 1.5vw, 8px)", fontSize: "clamp(10px, 2.5vw, 12px)", fontWeight: 600, cursor: "pointer" }}>
                Edit
              </button>
              <button onClick={() => onDeleteContact(c._id)} style={{ flex: 1, background: RED, color: "#fff", border: "none", borderRadius: 4, padding: "clamp(5px, 1.5vw, 8px)", fontSize: "clamp(10px, 2.5vw, 12px)", fontWeight: 600, cursor: "pointer" }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [screen, setScreen] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regForm, setRegForm] = useState({ name: "", email: "", password: "" });

  // Contacts state
  const [contacts, setContacts] = useState([]);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [editingId, setEditingId] = useState(null);

  // Handle window resize with better breakpoints
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize(width);
      setIsMobile(width <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  // Fetch contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await fetchApi("/contacts", { headers: authHeaders });
      setContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      setScreen("contacts");
      fetchContacts();
    }
  }, [token]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regForm.name || !regForm.email || !regForm.password) {
      setError("All fields required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await fetchApi("/auth/register", {
        method: "POST",
        body: JSON.stringify(regForm),
      });
      setScreen("login");
      setRegForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async () => {
    if (!contactForm.name || !contactForm.email) {
      setError("Name and email required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await fetchApi(`/contacts/${editingId}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(contactForm),
        });
      } else {
        await fetchApi("/contacts", {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(contactForm),
        });
      }
      setContactForm({ name: "", email: "", phone: "", address: "" });
      setEditingId(null);
      await fetchContacts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditContact = c => {
    setEditingId(c._id);
    setContactForm({ name: c.name, email: c.email, phone: c.phone || "", address: c.address || "" });
  };

  const handleDeleteContact = async id => {
    if (!window.confirm("Delete contact?")) return;
    setLoading(true);
    try {
      await fetchApi(`/contacts/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      await fetchContacts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setScreen("login");
    setContacts([]);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: BG,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "1rem" : "2rem",
      fontFamily: "'Nunito', sans-serif",
      width: "100%"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        @media (max-width: 480px) {
          body { padding: 0; margin: 0; }
        }
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-frame { display: none !important; }
        }
      `}</style>

      <div className="mobile-frame">
        <PhoneFrame isMobile={isMobile}>
          {!token && screen === "login" && (
            <LoginScreen
              onSwitch={setScreen}
              loading={loading}
              error={error}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              onLogin={handleLogin}
            />
          )}
          {!token && screen === "register" && (
            <RegisterScreen
              onSwitch={setScreen}
              loading={loading}
              error={error}
              form={regForm}
              setForm={setRegForm}
              onRegister={handleRegister}
            />
          )}
          {token && (
            <ContactsScreen
              contacts={contacts}
              loading={loading}
              error={error}
              onLogout={handleLogout}
              form={contactForm}
              setForm={setContactForm}
              onAddContact={handleAddContact}
              onEditContact={handleEditContact}
              onDeleteContact={handleDeleteContact}
              editingId={editingId}
            />
          )}
        </PhoneFrame>
      </div>

      <div className="desktop-only" style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "white"
      }}>
        {!token && screen === "login" && (
          <DesktopLoginScreen
            onSwitch={setScreen}
            loading={loading}
            error={error}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            onLogin={handleLogin}
            screenSize={screenSize}
          />
        )}
        {!token && screen === "register" && (
          <DesktopRegisterScreen
            onSwitch={setScreen}
            loading={loading}
            error={error}
            form={regForm}
            setForm={setRegForm}
            onRegister={handleRegister}
            screenSize={screenSize}
          />
        )}
        {token && (
          <DesktopContactsScreen
            contacts={contacts}
            loading={loading}
            error={error}
            onLogout={handleLogout}
            form={contactForm}
            setForm={setContactForm}
            onAddContact={handleAddContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            editingId={editingId}
            screenSize={screenSize}
            isMobile={isMobile}
          />
        )}
      </div>
    </div>
  );
}
