import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Trash2, X, Plus } from "lucide-react";
import api from "../services/api";

export default function Header() {
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "", message: "", type: "General", isRead: false
  });

  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const role = localStorage.getItem("role");
  const isAdmin = role?.toLowerCase() === "admin";
  const displayRole = role
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    : "User";

  const handleSearch = (e) => {
    e.preventDefault();
    const value = search.trim().toLowerCase();
    if (!value) return;

    if (value.includes("donor")) navigate("/donors");
    else if (value.includes("blood unit") || value.includes("blood stock"))
      navigate("/blood-units");
    else if (value.includes("inventory") || value.includes("stock"))
      navigate("/inventory");
    else if (value.includes("request")) navigate("/requests");
    else if (value.includes("camp")) navigate("/camps");
    else if (value.includes("report")) navigate("/reports");
    else if (value.includes("setting") || value.includes("profile"))
      navigate("/settings");
    else if (value.includes("dashboard") || value.includes("home"))
      navigate("/");

    setSearch("");
  };

  const fetchNotifications = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const response = await api.get("/api/notifications");
      setNotifications(response.data || []);
    } catch (err) {
      console.error("GET NOTIFICATIONS ERROR:", err);
      setMessage("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications && isAdmin) fetchNotifications();
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications((prev) =>
        prev.filter((n) => n.notificationId !== id)
      );
    } catch (err) {
      console.error("DELETE NOTIFICATION ERROR:", err);
      setMessage("Failed to delete notification.");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      setSending(true);
      setMessage("");
      await api.post("/api/notifications", form);

      setForm({
        title: "", message: "", type: "General", isRead: false
      });
      setMessage("Notification created successfully.");
    } catch (err) {
      console.error("POST NOTIFICATION ERROR:", err);
      setMessage(
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to create notification."
      );
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] flex items-center justify-between px-8 shadow-xs">
      <form onSubmit={handleSearch} className="relative w-80 lg:w-96">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pages (donors, units, inventory...)"
          className="w-full pl-10 pr-16 py-2.5 text-sm font-medium bg-[#F8FAFC] border
           border-[#E2E8F0] rounded-xl outline-none focus:border-[#C0182A] focus:bg-white focus:ring-4 
           focus:ring-[#C0182A]/10 placeholder:text-[#94A3B8] transition-all"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold 
          text-[#94A3B8] bg-white border border-[#CBD5E1] rounded shadow-2xs font-mono-code">
            ↵
          </kbd>
        </div>
      </form>

      <div className="flex items-center gap-4">
        <div className="relative" ref={notificationRef}>
          <button
            onClick={handleBellClick}
            className={`relative p-2.5 rounded-xl transition-all ${
              showNotifications
                ? "text-[#C0182A] bg-[#FEF2F2] ring-2 ring-[#C0182A]/20"
                : "text-[#64748B] hover:text-[#C0182A] hover:bg-[#F8FAFC]"
            }`}
            title="Notifications"
          >
            <Bell size={20} strokeWidth={1.8} />

            {isAdmin && notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-[#C0182A]
               text-white text-[9px] font-bold rounded-full border-2 border-white shadow-xs">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}

            {!isAdmin && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#C0182A] rounded-full border-2 border-white ring-2 ring-[#C0182A]/20" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-14 w-[410px] bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl
             z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9] bg-[#FAFCFD]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] flex items-center justify-center text-[#C0182A]">
                    <Bell size={16} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      Notifications
                    </h3>
                    <p className="text-[11px] text-[#64748B] font-medium">
                      {isAdmin
                        ? `${notifications.length} system notification${
                            notifications.length === 1 ? "" : "s"
                          }`
                        : "Send notice to administrators"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1.5 rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {isAdmin ? (
                <div className="max-h-[420px] overflow-y-auto divide-y divide-[#F1F5F9]">
                  {loading ? (
                    <div className="px-5 py-12 text-center">
                      <div className="w-6 h-6 border-2 border-[#C0182A] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs text-[#64748B] font-medium">
                        Loading notifications...
                      </p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-5 py-12 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FEF2F2] flex items-center justify-center mb-3 text-[#C0182A]">
                        <Bell size={22} />
                      </div>
                      <p className="text-sm font-bold text-[#0F172A]">
                        No new notifications
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        You're all caught up with system activities.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.notificationId}
                        className="p-4 hover:bg-[#F8FAFC] transition-colors group"
                      >
                        <div className="flex gap-3">
                          <div className="w-8 h-8 shrink-0 rounded-xl bg-[#FEF2F2] text-[#C0182A] flex items-center 
                          justify-center mt-0.5">
                            <Bell size={15} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-[#0F172A]">
                                {notification.title}
                              </h4>
                              <button
                                onClick={() =>
                                  handleDelete(notification.notificationId)
                                }
                                className="p-1 text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-md
                                 transition-colors"
                                title="Delete notification"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>

                            <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-2 mt-2.5">
                              <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#475569] text-[9px] font-bold
                               font-mono-code uppercase">
                                {notification.type || "General"}
                              </span>

                              {notification.createdAt && (
                                <span className="text-[10px] text-[#94A3B8] font-medium font-mono-code">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <form
                  onSubmit={handleCreateNotification}
                  className="p-5 space-y-4"
                >
                  {message && (
                    <div
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        message.includes("successfully")
                          ? "bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]"
                          : "bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C]"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <div>
                    <label className="field-label">Title</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g. Urgent Blood Need / Camp Request"
                      required
                      className="field-input"
                    />
                  </div>

                  <div>
                    <label className="field-label">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your message to administrators..."
                      rows="3"
                      required
                      className="field-input resize-none"
                    />
                  </div>

                  <div>
                    <label className="field-label">Type</label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      className="field-input bg-white cursor-pointer"
                    >
                      {["General", "Blood Stock", "Blood Request", "Camp", "Urgent"]
                        .map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#C0182A] text-white text-sm 
                    font-bold rounded-xl hover:bg-[#9B1421] transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                  >
                    <Plus size={16} />
                    {sending ? "Creating Notice..." : "Post Notification"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/settings")}
          className="flex items-center gap-3 pl-4 py-1.5 border-l border-[#E2E8F0] text-left hover:opacity-90 transition-opacity group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FEF2F2] to-[#FEE2E2] border 
          border-[#FEE2E2] flex items-center justify-center text-[#C0182A] font-bold text-sm 
          3shadow-2xs group-hover:scale-105 transition-transform">
            {displayRole.charAt(0).toUpperCase()}
          </div>

          <div className="hidden sm:block">
            <p className="text-xs font-bold text-[#0F172A] group-hover:text-[#C0182A]">
              {displayRole}
            </p>
            <p className="text-[10px] font-medium text-[#64748B]">
              {isAdmin ? "System Admin" : `${displayRole} Portal`}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}
