import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Tent,
  Calendar,
  MapPin,
  Building,
  Plus,
  Search,
  X,
  AlertCircle,
  Users,
  Compass,
} from "lucide-react";
export default function CampsPage() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const emptyForm = { campName: "", location: "", campDate: "", organizer: "" };
  const [form, setForm] = useState(emptyForm);

  const fetchCamps = async () => {
    try {
      setLoading(true); setError("");
      const response = await api.get("/api/camps");
      setCamps(response.data);
    }catch (err) {
  console.error("GET CAMPS ERROR:", err);

  if (err.response?.status === 403) {
    setError("Access restricted. Only administrators and staff can access blood camps.");
  } else if (err.response?.status === 401) {
    setError("Please login to access blood camps.");
  } else {
    setError("Failed to load blood camps.");
  }
} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCamps(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleAddCamp = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const campData = { campName: form.campName, location: form.location, campDate: form.campDate, organizer: form.organizer };
      await api.post("/api/camps", campData);
      alert("Camp added successfully!");
      setForm(emptyForm); setShowForm(false); fetchCamps();
    } catch (err) {
      console.error(err); setError("Failed to add camp.");
    }
  };

  const filteredCamps = camps.filter((camp) => {
    const searchText = search.toLowerCase();
    return camp.campName?.toLowerCase().includes(searchText) || camp.location?.toLowerCase().includes(searchText) || camp.organizer?.toLowerCase().includes(searchText);
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Donation Camps
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#C0182A] text-xs font-bold border border-[#FEE2E2] font-mono-code">
              {camps.length} Drives
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Organize mobile blood donation camps, corporate drives, and campus initiatives
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setError("");
            setShowForm(!showForm);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C0182A] text-white text-xs 
          font-bold rounded-xl hover:bg-[#9B1421] transition-all shadow-md shadow-[#C0182A]/20 hover:shadow-lg"
        >
          <Plus size={16} strokeWidth={2.4} />
          <span>{showForm ? "Close Form" : "Schedule Camp"}</span>
        </button>
      </div>

      {error && <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] px-4 py-3 rounded-xl text-sm">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Add New Camp</h2>
              <p className="text-sm text-[#9CA3AF] mt-1">Enter the camp's information</p>
            </div>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }}
             className="text-[#9CA3AF] hover:text-[#374151] text-xl">✕</button>
          </div>

          <form onSubmit={handleAddCamp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Camp Name</label>
              <input name="campName" value={form.campName} onChange={handleChange} 
              placeholder="Enter camp name" required className="field-input" />
            </div>
            <div>
              <label className="field-label">Location</label>
              <input name="location" value={form.location} onChange={handleChange} 
              placeholder="Enter camp location" required className="field-input" />
            </div>
            <div>
              <label className="field-label">Camp Date</label>
              <input type="date" name="campDate" value={form.campDate} onChange={handleChange} required className="field-input" />
            </div>
            <div>
              <label className="field-label">Organizer</label>
              <input name="organizer" value={form.organizer} onChange={handleChange} placeholder="Enter organizer name" required className="field-input" />
            </div>
            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" className="px-5 py-2.5 bg-[#C0182A] text-white text-sm 
              font-semibold rounded-xl hover:bg-[#9B1421] transition-colors">Save Camp</button>
              <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }} 
              className="px-5 py-2.5 border border-[#E5E7EB] text-sm font-semibold text-[#374151] rounded-xl hover:bg-[#F3F4F6]">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex items-center justify-between">
          <div>
          <div className="text-xs text-[#9CA3AF] uppercase tracking-wider">Total Camps</div>
          <div className="text-2xl font-bold text-[#111827] mt-1">{camps.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#C0182A] flex items-center justify-center">
            <Tent size={20} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex items-center justify-between">
          <div>
          <div className="text-xs text-[#9CA3AF] uppercase tracking-wider">Records</div>
          <div className="text-2xl font-bold text-[#111827] mt-1">{filteredCamps.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] text-[#475569] flex items-center justify-center border border-[#E2E8F0]">
            <Calendar size={20} />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"/>
          <input type="text" placeholder="Search camps..." value={search} onChange={(e) => setSearch(e.target.value)}
           className="w-full px-4 py-2.5 pl-10 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:outline-none focus:ring-2
            focus:ring-[#C0182A]/20 focus:border-[#C0182A]" />
        </div>
        <span className="text-xs text-[#9CA3AF] font-mono sm:ml-auto">{filteredCamps.length} records</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-sm text-[#9CA3AF]">Loading camps...</div>
          ) : filteredCamps.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-3xl mb-2">🩸</div>
              <div className="text-sm font-semibold text-[#374151]">No camps found</div>
              <div className="text-xs text-[#9CA3AF] mt-1">Add a camp or change your search.</div>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  {["ID", "Camp Name", "Location", "Date", "Organizer"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-[12px] font-semibold text-
                    [#9CA3AF] uppercase tracking-wider font-mono whitespace-nowrap">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCamps.map((camp) => (
                  <tr key={camp.campId} className="border-b border-[#F3F4F6] hover:bg-[#FAFAF9] transition-colors">
                    <td className="px-4 py-4 font-mono text-[#6B7280]">CMP-{String(camp.campId).padStart(4, "0")}</td>
                    <td className="px-4 py-4"><div className="font-semibold text-[#111827]">{camp.campName}</div></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 font-medium text-[#475569]">
                        <MapPin size={13} className="text-[#C0182A] shrink-0" />
                        <span>{camp.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-[#374151]">{camp.campDate}</td>
                    <td className="px-4 py-4 text-[#374151]">{camp.organizer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}