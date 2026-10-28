import { LayoutDashboard, Users, Package, ClipboardList, Tent, BarChart3,
   Settings, LogOut,HeartPulse, ChevronRight, ShieldCheck,
} from "lucide-react";
import { useNavigate, NavLink } from "react-router-dom";
const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/",},
  {name: "Donors",icon: Users,path: "/donors",},
  {name: "Blood Units",icon: Package,path: "/blood-units",},
  {name: "Inventory",icon: ClipboardList,path: "/inventory",},
  {name: "Blood Requests",icon: ClipboardList,path: "/requests",},
  {name: "Camps",icon: Tent,path: "/camps",},
  {name: "Reports",icon: BarChart3,path: "/reports",},
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loginMessage");
    navigate("/login", { replace: true });
  };

  const role = localStorage.getItem("role") || "Staff";

  return (
    <aside className="fixed left-0 top-0 h-screen w-64
     bg-white border-r border-[#E2E8F0] flex flex-col z-40 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      <div className="h-20 flex items-center px-6 border-b border-[#F1F5F9] bg-gradient-to-b from-white to-[#FDFEFE]">
        <div className="flex items-center gap-3 w-full">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C0182A] to-[#9B1421] 
          flex items-center justify-center shadow-md shadow-[#C0182A]/25 ring-2 ring-[#C0182A]/10">
            <HeartPulse
              size={22}
              className="text-white animate-pulse"
              strokeWidth={2.2}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-[#0F172A] tracking-tight">
                Blood<span className="text-[#C0182A]">Bank</span>
              </h1>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#FEF2F2] text-[#C0182A] rounded border border-[#FEE2E2]">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] font-semibold tracking-wider uppercase">
              Healthcare System
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-6">
        <div>
          <p className="px-3 mb-2.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono-code">
            Core Operations
          </p>

          <div className="space-y-1.5">
            {menuItems.slice(0, 5).map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3.5 py-2.5
                   rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#FEF2F2] text-[#C0182A] shadow-xs shadow-[#C0182A]/5"
                        : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#C0182A]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#C0182A] rounded-r-full" />
                      )}

                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? "bg-white text-[#C0182A] shadow-xs"
                              : "bg-[#F8FAFC] text-[#64748B] group-hover:bg-[#FEF2F2] group-hover:text-[#C0182A]"
                          }`}
                        >
                          <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                        </div>
                        <span className="tracking-tight">{item.name}</span>
                      </div>

                      {isActive && (
                        <ChevronRight
                          size={15}
                          className="text-[#C0182A] opacity-70"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-3 mb-2.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono-code">
            Analytics & Events
          </p>

          <div className="space-y-1.5">
            {menuItems.slice(5).map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `group relative flex items-center justify-between px-3.5 py-2.5
                   rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#FEF2F2] text-[#C0182A] shadow-xs"
                        : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#C0182A]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#C0182A] rounded-r-full" />
                      )}

                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? "bg-white text-[#C0182A] shadow-xs"
                              : "bg-[#F8FAFC] text-[#64748B] group-hover:bg-[#FEF2F2] group-hover:text-[#C0182A]"
                          }`}
                        >
                          <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                        </div>
                        <span className="tracking-tight">{item.name}</span>
                      </div>

                      {isActive && (
                        <ChevronRight
                          size={15}
                          className="text-[#C0182A] opacity-70"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
      <div className="p-3 border-t border-[#F1F5F9] bg-[#FAFCFD]">
        <div className="px-3 py-2.5 mb-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#FEF2F2] text-[#C0182A] 
            font-bold text-xs flex items-center justify-center border border-[#FEE2E2]">
              {role.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0F172A] truncate capitalize">
                {role}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-[10px] text-[#64748B] font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
          <ShieldCheck size={16} className="text-[#94A3B8]" />
        </div>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-[#FEF2F2] text-[#C0182A] font-semibold"
                : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            }`
          }
        >
          <Settings size={18} strokeWidth={1.8} />
          <span>Settings</span>
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-[#64748B] 
          hover:bg-[#FEF2F2] hover:text-[#C0182A] transition-all"
        >
          <LogOut size={18} strokeWidth={1.8} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}