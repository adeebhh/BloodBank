import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HeartPulse, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight,
  ShieldCheck, Droplets, Activity, Building2, Lock
} from "lucide-react";
import api from "../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", role: "user"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const switchMode = () => {
    setIsRegister(!isRegister);
    setError("");
    setSuccess("");
    setForm({ fullName: "", email: "", password: "", role: "user" });
  };
  const handleLogin = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email: form.email, password: form.password
      });
      console.log("LOGIN RESPONSE:", response.data);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loginMessage", response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("email", form.email);
      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/register", form);
      console.log("REGISTER RESPONSE:", response.data);
      setSuccess(response.data || "Registration successful! Please sign in.");
      setForm({ fullName: "", email: "", password: "", role: "user" });
      setIsRegister(false);
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-[#F8FAFC] flex flex-col 
    justify-between items-center p-6 sm:p-10 overflow-hidden select-none">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `radial-gradient(#CBD5E1 1.2px, transparent 1.2px)`,
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#C0182A]/[0.05] 
      rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#C0182A]/[0.04]
       rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-1/4 -left-12 pointer-events-none select-none hidden lg:block opacity-35">
        <span className="text-8xl xl:text-9xl font-black text-slate-200 tracking-tighter leading-none block">
          DONATE
        </span>
        <p className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase font-mono-code mt-1 pl-4">
          Universal Blood Reserve Network
        </p>
      </div>

      <div className="absolute bottom-1/4 -right-12 pointer-events-none select-none hidden lg:block text-right opacity-35">
        <p className="text-xs font-bold tracking-[0.3em] text-slate-400 uppercase font-mono-code mb-1 pr-4">
          Safe Clinical Transfusion System
        </p>
        <span className="text-8xl xl:text-9xl font-black text-slate-200 tracking-tighter leading-none block">
          LIVES
        </span>
      </div>

      <header className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center 
      justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#C0182A] text-white flex items-center 
          justify-center shadow-md shadow-[#C0182A]/25">
            <HeartPulse size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                Blood<span className="text-[#C0182A]">Bank</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#C0182A]
               text-[9px] font-bold border border-[#FEE2E2] font-mono-code">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Medical Transfusion & Logistics Portal
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            24/7 Live Blood Stock
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-slate-600">
            <Droplets size={13} className="text-[#C0182A]" />
            All Blood Types Supported
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1 text-slate-600">
            <Building2 size={13} className="text-slate-400" />
            Hospital Network
          </span>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-md my-auto py-8 select-text">
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isRegister ? "Create Your Account" : "Sign In to Portal"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            {isRegister
              ? "Register to coordinate blood units, donor drives, and hospital dispatches"
              : "Enter your registered credentials to access clinical management"}
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-[#FEF2F2] border border-[#FECACA] 
          text-[#B91C1C] px-4 py-3 rounded-xl text-xs mb-5 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#C0182A]" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2.5 bg-[#F0FDF4] border border-[#BBF7D0] 
          text-[#166534] px-4 py-3 rounded-xl text-xs mb-5 animate-in fade-in">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-[#16A34A]" />
            <span className="font-semibold">{success}</span>
          </div>
        )}

        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          className="space-y-4"
        >
          {isRegister && (
            <div>
              <label className="field-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="e.g. Dr. Sarah Connor"
                required
                className="field-input"
              />
            </div>
          )}

          <div>
            <label className="field-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="doctor@hospital.org"
              required
              className="field-input"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="field-label !mb-0">Password</label>
              {!isRegister && (
                <span className="text-[11px] text-slate-400 font-medium cursor-default">
                  Clinical credentials
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                required
                className="field-input"
                style={{ paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400
                 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="field-label">Account Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="field-input bg-white cursor-pointer"
              >
                <option value="user">User / Voluntary Donor</option>
                <option value="staff">Hospital / Blood Bank Staff</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-[#C0182A] text-white text-sm font-bold rounded-xl 
            hover:bg-[#9B1421] transition-all shadow-md shadow-[#C0182A]/25 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 group cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {isRegister
                    ? "Create Staff / Donor Account"
                    : "Sign In to Portal"}
                </span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200/80 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-bold text-[#C0182A] hover:text-[#9B1421] hover:underline transition-colors ml-1 cursor-pointer"
            >
              {isRegister ? "Sign In" : "Register here"}
            </button>
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#C0182A]" />
            SSL Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Activity size={13} className="text-slate-400" />
            Real-time Crossmatch
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Lock size={13} className="text-slate-400" />
            Protected Medical Data
          </span>
        </div>
      </main>

      <footer className="relative z-10 w-full max-w-5xl text-center py-2 text-[11px] text-slate-400 
      font-medium flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          BloodBank PRO © {new Date().getFullYear()} — Clinical Blood Donation & Management System
        </p>
        <p className="flex items-center gap-1 text-slate-500">
          <ShieldCheck size={13} className="text-[#C0182A]" />
          Authorized Healthcare Personnel Only
        </p>
      </footer>
    </div>
  );
}