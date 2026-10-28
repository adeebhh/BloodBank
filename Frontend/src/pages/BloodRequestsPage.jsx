import { useEffect, useState } from "react";
import api from "../services/api";
import {
  ClipboardList, Plus, Search, Eye, Trash2, X, AlertCircle,
  Building2, User, Droplets, CheckCircle2, Flame
} from "lucide-react";
export default function BloodRequestsPage() {
  const [requests, setRequests] = useState([]),
   [bloodUnits, setBloodUnits] = useState([]), [loading, setLoading] = useState(true), [error, setError] = useState(""), 
   [showForm, setShowForm] = useState(false), [selectedRequest, setSelectedRequest] = useState(null), 
   [search, setSearch] = useState(""), [bloodGroupFilter, setBloodGroupFilter] = useState("All"), 
   [statusFilter, setStatusFilter] = useState("All");

  const emptyForm = { patientName: "", hospitalName: "", bloodGroup: "", unitsRequired: "", 
    status: "Available", bloodUnitId: "" };
  const [form, setForm] = useState(emptyForm);
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const statuses = ["Available", "Pending", "Urgent", "Completed", "Cancelled"];

  const fetchRequests = async () => {
    try {
      setLoading(true); setError("");
      const response = await api.get("/api/blood-requests");
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("GET BLOOD REQUEST ERROR:", err);
      setError("Failed to load blood requests."); setRequests([]);
    } finally { setLoading(false); }
  };

  const fetchBloodUnits = async () => {
    try {
      const response = await api.get("/api/blood-units");
      setBloodUnits(Array.isArray(response.data) ? response.data : []);
    } catch (err) { console.error("GET BLOOD UNITS ERROR:", err); }
  };

  useEffect(() => { fetchRequests(); fetchBloodUnits(); }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRequest = async e => {
    e.preventDefault();
    try {
      setError("");
      await api.post("/api/blood-requests", { ...form, 
        unitsRequired: Number(form.unitsRequired), bloodUnitId: Number(form.bloodUnitId) });
      alert("Blood request added successfully!");
      setForm(emptyForm); setShowForm(false); await fetchRequests();
    } catch (err) {
      console.error("POST BLOOD REQUEST ERROR:", err);
      setError("Failed to add blood request.");
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("Are you sure you want to delete this blood request?")) return;
    try {
      setError(""); await api.delete(`/api/blood-requests/${id}`);
      alert("Blood request deleted successfully!"); await fetchRequests();
    } catch (err) {
      console.error("DELETE BLOOD REQUEST ERROR:", err);
      setError("Failed to delete blood request.");
    }
  };

  const filteredRequests = requests.filter(request => {
    const text = search.toLowerCase();
    const matchesSearch = request.patientName?.toLowerCase().includes(text) ||
     request.hospitalName?.toLowerCase().includes(text) || request.bloodGroup?.toLowerCase().includes(text) || 
     request.status?.toLowerCase().includes(text) || String(request.requestId).includes(text);
    return matchesSearch && (bloodGroupFilter === "All" || request.bloodGroup === bloodGroupFilter) &&
     (statusFilter === "All" || request.status === statusFilter);
  });

  const totalRequests = requests.length, urgentRequests = requests.filter(r => r.status?.toLowerCase() === "urgent").length, 
  completedRequests = requests.filter(r => r.status?.toLowerCase() === "completed").length;

  const getStatusStyle = status => ({
    available: "bg-[#D1FAE5] text-[#065F46]",
    urgent: "bg-[#FEE2E2] text-[#991B1B]",
    completed: "bg-[#DBEAFE] text-[#1D4ED8]",
    pending: "bg-[#FEF3C7] text-[#92400E]",
    cancelled: "bg-[#E5E7EB] text-[#374151]"
  }[status?.toLowerCase()] || "bg-[#FEF3C7] text-[#92400E]");

  return (
    <div className="space-y-5">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Hospital Blood Requisitions
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#C0182A] text-xs font-bold border border-[#FEE2E2]
             font-mono-code">
              {filteredRequests.length} requisitions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Dispatch blood reserves to requesting hospitals, ICUs, and emergency patients
          </p>
        </div>

        <button
          onClick={() => {
            setForm(emptyForm);
            setError("");
            setShowForm(!showForm);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C0182A] text-white text-xs font-bold rounded-xl
           hover:bg-[#9B1421] transition-all shadow-md"
        >
          <Plus size={16} />
          {showForm ? "Close Form" : "New Requisition"}
        </button>
      </div>

      {error && <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] px-4 py-3 rounded-xl text-sm">{error}</div>}

      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div><h2 className="text-lg font-bold text-[#111827]">Create Blood Request</h2>
            <p className="text-sm text-[#9CA3AF] mt-1">Enter the required blood request details</p></div>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }} 
            className="text-[#9CA3AF] hover:text-[#374151] text-xl">✕</button>
          </div>

          <form onSubmit={handleAddRequest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["patientName", "Patient Name", "text", "Enter patient name"],
              ["hospitalName", "Hospital Name", "text", "Enter hospital name"],
              ["unitsRequired", "Units Required", "number", "Enter units required"]
            ].map(([name, label, type, placeholder]) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">{label}</label>
                <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} 
                min={type === "number" ? 1 : undefined} required className="w-full px-4 py-3 text-sm border border-[#E5E7EB] 
                rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#C0182A]/20 focus:border-[#C0182A]" />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Blood Group</label>
              <select name="bloodGroup" value={form.bloodGroup}
               onChange={handleChange} required className="w-full px-4 py-3 text-sm border border-[#E5E7EB] rounded-xl
                bg-white focus:outline-none focus:ring-2 focus:ring-[#C0182A]/20 focus:border-[#C0182A]">
                <option value="">Select blood group</option>{bloodGroups.map(group => <option key={group}>{group}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
               required className="w-full px-4 py-3 text-sm border border-[#E5E7EB]
                rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#C0182A]/20 focus:border-[#C0182A]">
                {statuses.map(status => <option key={status}>{status}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">Blood Unit ID</label>
              <select name="bloodUnitId" value={form.bloodUnitId} onChange={handleChange} required className="w-full px-4 py-3 text-sm border border-[#E5E7EB]
               rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#C0182A]/20 focus:border-[#C0182A]">
                <option value="">Select blood unit</option>
                {bloodUnits.map(unit => <option key={unit.bloodUnitId} value={unit.bloodUnitId}>
                  BLU-{String(unit.bloodUnitId).padStart(4, "0")} - {unit.bloodGroup} - {unit.quantity} units</option>)}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" className="px-5 py-2.5 bg-[#C0182A] text-white text-sm font-semibold rounded-xl hover:bg-[#9B1421]">Save Request</button>
              <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }} className="px-5 py-2.5 border border-[#E5E7EB] text-sm 
              font-semibold text-[#374151] rounded-xl hover:bg-[#F3F4F6]">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["Total Requests", totalRequests, "text-[#111827]"],
          ["Urgent Requests", urgentRequests, "text-[#DC2626]"],
          ["Completed", completedRequests, "text-[#059669]"]
        ].map(([label, value, color]) => (
          <div key={label} className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
            <div className="text-xs text-[#9CA3AF] uppercase tracking-wider">{label}</div>
            <div className={`text-2xl font-bold mt-1 ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 items-center">
        <div className="relative w-full lg:max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input type="text" placeholder="Search patient, hospital or blood group..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-4 py-2.5 
          pl-10 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#C0182A]/20 focus:border-[#C0182A]" />
          
        </div>
        <select value={bloodGroupFilter} onChange={e => setBloodGroupFilter(e.target.value)} className="px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:outline-none">
          <option>All</option>{bloodGroups.map(group => <option key={group}>{group}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:outline-none">
          <option>All</option>{statuses.map(status => <option key={status}>{status}</option>)}
        </select>
        <span className="text-xs text-[#9CA3AF] font-mono lg:ml-auto">{filteredRequests.length} records</span>
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-sm text-[#9CA3AF]">Loading blood requests...</div>
          ) : !filteredRequests.length ? (
            <div className="p-10 text-center"><div className="text-3xl mb-2">🩸</div><div className="text-sm font-semibold text-[#374151]">No blood requests found</div><div className="text-xs text-[#9CA3AF] mt-1">Create a request or change your search.</div></div>
          ) : (
            <table className="w-full text-xs">
              <thead><tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                {["Request ID", "Patient", "Hospital", "Blood", "Units", "Blood Unit", "Status", "Action"].map(h => <th key={h} className="px-4 py-3 text-left text-[12px] font-semibold text-
                    [#9CA3AF] uppercase tracking-wider font-mono whitespace-nowrap">{h}</th>)}
              </tr></thead>
              <tbody>
                {filteredRequests.map(request => (
                  <tr key={request.requestId} className="border-b border-[#F3F4F6] hover:bg-[#FAFAF9]">
                    <td className="px-4 py-4 font-mono text-[#6B7280]">REQ-{String(request.requestId).padStart(4, "0")}</td>
                    <td className="px-4 py-4 font-semibold text-[#111827]">{request.patientName}</td>
                    <td className="px-4 py-4 font-semibold text-[#374151]">{request.hospitalName}</td>
                    <td className="px-4 py-4"><span className="px-2.5 py-1 rounded-md bg-[#FEE2E2] text-[#C0182A] font-bold font-mono text-[10px]">{request.bloodGroup}</span></td>
                    <td className="px-4 py-4 font-semibold text-[#374151]">{request.unitsRequired}</td>
                    <td className="px-4 py-4">
                      {request.bloodUnit ? <><div className="font-semibold text-[#111827]">BLU-{String(request.bloodUnit.bloodUnitId).padStart(4, "0")}</div><div className="text-[10px] text-[#9CA3AF]">{request.bloodUnit.bloodGroup} · {request.bloodUnit.quantity} units</div></> : <span className="text-[#9CA3AF]">No blood unit</span>}
                    </td>
                    <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${getStatusStyle(request.status)}`}>{request.status}</span></td>
                    <td className="px-4 py-4"><div className="flex gap-3">
                       <button
                            onClick={() => setSelectedRequest(r)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#C0182A] hover:bg-[#FEF2F2]"
                            title="View Details">
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(r.requestId)}
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                            title="Delete Request">
                            <Trash2 size={15} />
                          </button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setSelectedRequest(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div><h2 className="text-lg font-bold text-[#111827]">Blood Request Details</h2><p className="text-xs text-[#9CA3AF] mt-1 font-mono">REQ-{String(selectedRequest.requestId).padStart(4, "0")}</p></div>
              <button onClick={() => setSelectedRequest(null)} className="text-[#9CA3AF] hover:text-[#374151] text-xl">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Patient Name", selectedRequest.patientName],
                ["Hospital Name", selectedRequest.hospitalName],
                ["Blood Group", selectedRequest.bloodGroup],
                ["Units Required", selectedRequest.unitsRequired],
                ["Status", selectedRequest.status],
                ["Blood Unit ID", selectedRequest.bloodUnit?.bloodUnitId ? `BLU-${String(selectedRequest.bloodUnit.bloodUnitId).padStart(4, "0")}` : "-"],
                ["Blood Unit Group", selectedRequest.bloodUnit?.bloodGroup || "-"],
                ["Blood Unit Quantity", selectedRequest.bloodUnit?.quantity ?? "-"],
                ["Collection Date", selectedRequest.bloodUnit?.collectionDate || "-"],
                ["Expiry Date", selectedRequest.bloodUnit?.expiryDate || "-"],
                ["Blood Unit Status", selectedRequest.bloodUnit?.status || "-"]
              ].map(([label, value]) => (
                <div key={label} className="bg-[#F9FAFB] rounded-xl p-4">
                  <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-mono">{label}</div>
                  <div className="text-sm font-semibold text-[#111827] mt-1">{value}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-5">
              <button onClick={() => setSelectedRequest(null)} className="px-4 py-2 bg-[#C0182A] text-white rounded-xl text-sm font-semibold hover:bg-[#9B1421]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
