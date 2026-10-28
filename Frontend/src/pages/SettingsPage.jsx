import { useState } from "react";
import {
  Settings, Shield, Bell, Sliders, Globe, Lock, Cpu, Server, User, Mail,
  ShieldCheck, AlertTriangle, Flame, Tent
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true, stockAlerts: true, requestAlerts: true,
    campReminders: true, lowStockThreshold: 5
  });

  const handleToggle = name => setSettings(p => ({ ...p, [name]: !p[name] }));

  const Toggle = ({ name }) => (
    <button type="button" onClick={() => handleToggle(name)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2
       border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-[#C0182A]/10 
       ${settings[name] ? "bg-[#C0182A]" : "bg-[#CBD5E1]"}`}>
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white 
        shadow-md transition duration-200 ease-in-out ${settings[name] ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );

  const sections = [
    {
      icon: User, title: "Account Profile",
      desc: "Active session credential and assigned role permissions",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Active Email Account</label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] 
            rounded-xl text-xs font-semibold text-[#0F172A]">
              <Mail size={15} className="text-[#94A3B8]" />
              <span>{localStorage.getItem("email") || "admin@gmail.com"}</span>
            </div>
          </div>
          <div>
            <label className="field-label">Assigned Authorization Tier</label>
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] 
            rounded-xl text-xs font-bold font-mono-code">
              <span className="text-[#C0182A] uppercase">{localStorage.getItem("role") || "admin"}</span>
              <span className="px-2 py-0.5 rounded-md bg-[#FEF2F2] text-[#C0182A] text-[10px] font-bold 
              border border-[#FEE2E2]">Verified Token</span>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Bell, title: "Automated Alert Notifications",
      desc: "Dispatch alerts for critical inventory levels, requisitions, and camp drives",
      content: (
        <div className="divide-y divide-[#F1F5F9]">
          {[
            ["emailNotifications", "Transactional Email Dispatches", "Send security alerts, donor registration receipts, and dispatch emails"],
            ["stockAlerts", "Reserve Depletion Alerts", "Trigger banner and badge warnings when units fall below safety limits"],
            ["requestAlerts", "Emergency Requisition Alerts", "High-priority notification banner upon arrival of urgent hospital requests"],
            ["campReminders", "Donation Drive Reminders", "Automated reminders sent 48 hours prior to scheduled donation camps"]
          ].map(([name, title, desc]) => (
            <div key={name} className="flex items-center justify-between py-3.5">
              <div>
                <div className="text-xs font-bold text-[#0F172A]">{title}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{desc}</div>
              </div>
              <Toggle name={name} />
            </div>
          ))}
        </div>
      )
    },
    {
      icon: Sliders, title: "Reserve Depletion Threshold",
      desc: "Configure the minimum unit quantity before triggering low-stock indicators",
      content: (
        <div className="max-w-md">
          <label className="field-label">Safety Buffer (Units)</label>
          <div className="flex items-center gap-3 mt-1.5">
            <input type="number" min="1" value={settings.lowStockThreshold}
              onChange={e => setSettings({ ...settings, lowStockThreshold: e.target.value })}
              className="w-36 field-input font-mono-code font-bold text-center" />
            <span className="text-xs font-semibold text-[#64748B]">Units minimum threshold</span>
          </div>
          <p className="text-[11px] text-[#94A3B8] mt-2">
            Blood categories with available inventory equal to or less than this value will display prominent red warnings across all dashboards.
          </p>
        </div>
      )
    },
    {
      icon: Globe, title: "Platform Formatting Preferences",
      desc: "Standardized formatting across logs, records, and tables",
      content: (
        <div className="divide-y divide-[#F1F5F9]">
          {[
            ["Console Layout Model", "Responsive high-density dashboard cards", "Executive Grid"],
            ["ISO Date Stamp", "Standard format for collection and expiration tracking", "YYYY-MM-DD"],
            ["System Locale", "Interface terminology and medical reporting language", "English (International)"]
          ].map(([title, desc, value]) => (
            <div key={title} className="flex items-center justify-between py-3.5">
              <div>
                <div className="text-xs font-bold text-[#0F172A]">{title}</div>
                <div className="text-xs text-[#64748B] mt-0.5">{desc}</div>
              </div>
              <span className="px-3 py-1 bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-lg text-xs font-semibold">{value}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      icon: Server, title: "System Architecture & Telemetry",
      desc: "Integrated stack information and active environment runtime",
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            ["Platform", "BloodBank Enterprise Suite"],
            ["Frontend Client", "React 19 • Vite 8 • Tailwind v4"],
            ["Backend Gateway", "Spring Boot API :8080"]
          ].map(([title, value], i) => (
            <div key={title} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
              <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono-code">{title}</div>
              <div className={`text-xs font-bold mt-1 font-mono-code ${i === 2 ? "text-[#C0182A] flex items-center gap-1.5" : "text-[#0F172A]"}`}>
                {i === 2 && <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />}
                {value}
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">System Preferences</h1>
          <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#C0182A] text-xs font-bold border border-[#FEE2E2] font-mono-code">v1.0.0</span>
        </div>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1">
          Configure security thresholds, notification triggers, and platform parameters
        </p>
      </div>

      {sections.map(({ icon: Icon, title, desc, content }) => (
        <div key={title} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#F1F5F9]">
            <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] text-[#C0182A] flex items-center justify-center">
              <Icon size={18} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">{title}</h2>
              <p className="text-xs text-[#64748B]">{desc}</p>
            </div>
          </div>
          {content}
        </div>
      ))}
    </div>
  );
}