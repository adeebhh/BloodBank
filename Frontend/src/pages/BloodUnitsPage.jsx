import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Package, Plus, Search, Eye, Trash2, X, Droplets,
} from "lucide-react";
export default function BloodUnitsPage() {
  const [bloodUnits, setBloodUnits] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [search, setSearch] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const emptyForm = { bloodGroup: "", quantity: "", collectionDate: "", expiryDate: "", status: "Available", donorId: "" };
  const [form, setForm] = useState(emptyForm);

  const fetchBloodUnits = async () => {
    try {
      setLoading(true); setError("");
      const response = await api.get("/api/blood-units");
      setBloodUnits(response.data);
    }catch (err) {
  console.error("GET BLOOD UNITS ERROR:", err);

  if (err.response?.status === 403) {
    setError("Access restricted. Only administrators and staff can access blood units.");
  } else if (err.response?.status === 401) {
    setError("Please login to access blood units.");
  } else {
    setError("Failed to load blood units.");
  }
} finally {
      setLoading(false);
    }
  };

  const fetchDonors = async () => {
    try {
      const response = await api.get("/api/donors");
      setDonors(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchBloodUnits(); fetchDonors(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleAddBloodUnit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const bloodUnitData = { bloodGroup: form.bloodGroup, quantity: Number(form.quantity),
         collectionDate: form.collectionDate, expiryDate: form.expiryDate, status: form.status, donorId: Number(form.donorId) };
      await api.post("/api/blood-units", bloodUnitData);
      alert("Blood unit added successfully!");
      setForm(emptyForm); setShowForm(false); fetchBloodUnits();
    } catch (err) {
      console.error(err); setError("Failed to add blood unit.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this blood unit?");
    if (!confirmed) return;
    try {
      setError("");
      await api.delete(`/api/blood-units/${id}`);
      alert("Blood unit deleted successfully!");
      fetchBloodUnits();
    } catch (err) {
      console.error(err); setError("Failed to delete blood unit.");
    }
  };

  const filteredUnits = bloodUnits.filter((unit) => {
    const searchText = search.toLowerCase();
    const matchesSearch = unit.bloodGroup?.toLowerCase().includes(searchText) || 
    unit.status?.toLowerCase().includes(searchText) || unit.donor?.fullName?.toLowerCase().includes(searchText)
     || String(unit.bloodUnitId).includes(searchText);
    const matchesBloodGroup = bloodGroupFilter === "All" || unit.bloodGroup === bloodGroupFilter;
    const matchesStatus = statusFilter === "All" || unit.status === statusFilter;
    return matchesSearch && matchesBloodGroup && matchesStatus;
  });

  const totalUnits = bloodUnits.reduce((total, unit) => total + Number(unit.quantity || 0), 0);
  const availableUnits = bloodUnits.filter((unit) => unit.status?.toLowerCase() === "available").reduce((total, unit) =>
     total + Number(unit.quantity || 0), 0);
  const expiredUnits = bloodUnits.filter((unit) => unit.status?.toLowerCase() === "expired").reduce((total, unit) => 
    total + Number(unit.quantity || 0), 0);

  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();
    if (value === "available") return "bg-[#D1FAE5] text-[#065F46]";
    if (value === "expired") return "bg-[#FEE2E2] text-[#991B1B]";
    if (value === "used") return "bg-[#E5E7EB] text-[#374151]";
    return "bg-[#FEF3C7] text-[#92400E]";
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Blood Units Inventory</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#C0182A] text-xs 
            font-bold border border-[#FEE2E2] font-mono-code">
              {bloodUnits.length} Batches
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Manage refrigerated blood inventory batches, collections, and expiration dates
          </p>
        </div>
        <button
          onClick={() => {
            setForm(emptyForm); setError(""); setShowForm(!showForm);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C0182A] text-white text-xs 
          font-bold rounded-xl hover:bg-[#9B1421] transition-all shadow-md shadow-[#C0182A]/20">
          <Plus size={16} />
          {showForm ? "Close Form" : "Add Blood Unit"}
        </button>
      </div>
      {error && <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] px-4 py-3 rounded-xl text-sm">{error}</div>}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Add Blood Unit</h2>
              <p className="text-sm text-[#9CA3AF] mt-1">Record a newly collected blood unit</p>
            </div>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }} 
            className="text-[#9CA3AF] hover:text-[#374151] text-xl">✕</button>
          </div>

          <form onSubmit={handleAddBloodUnit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div>
              <label className="field-label">Blood Group</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required className="field-input">
                <option value="">Select blood group</option><option value="A+">A+</option><option value="A-">
                  A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">
                    AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label className="field-label">Quantity</label>
              <input type="number" name="quantity" value={form.quantity} onChange={handleChange}
               placeholder="Enter quantity" min="1" required className="field-input" />
            </div>
            <div>
              <label className="field-label">Collection Date</label>
              <input type="date" name="collectionDate" value={form.collectionDate} onChange={handleChange} required className="field-input" />
            </div>
            <div>
              <label className="field-label">Expiry Date</label>
              <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} required className="field-input" />
            </div>
            <div>
              <label className="field-label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} required className="field-input">
                <option value="Available">Available</option><option value="Used">Used</option><option value="Expired">
                  Expired</option><option value="Reserved">Reserved</option>
              </select>
            </div>
            <div>
              <label className="field-label">Donor</label>
              <select name="donorId" value={form.donorId} onChange={handleChange} required className="field-input">
                <option value="">Select donor</option>
                {donors.map((donor) => <option key={donor.donorId} value={donor.donorId}>
                  DNR-{String(donor.donorId).padStart(4, "0")} - {donor.fullName} ({donor.bloodGroup})</option>)}
              </select>
            </div>
            <div className="md:col-span-2 xl:col-span-3 flex gap-3 pt-2">
              <button type="submit" className="px-5 py-2.5 bg-[#C0182A] text-white text-sm 
              font-semibold rounded-xl hover:bg-[#9B1421] transition-colors">Save Blood Unit</button>
              <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }} 
              className="px-5 py-2.5 border border-[#E5E7EB] text-sm font-semibold text-[#374151] rounded-xl hover:bg-[#F3F4F6]">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="text-xs text-[#9CA3AF] uppercase tracking-wider">Total Units</div>
          <div className="text-2xl font-bold text-[#111827] mt-1">{totalUnits}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="text-xs text-[#9CA3AF] uppercase tracking-wider">Available</div>
          <div className="text-2xl font-bold text-[#059669] mt-1">{availableUnits}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="text-xs text-[#9CA3AF] uppercase tracking-wider">Expired</div>
          <div className="text-2xl font-bold text-[#DC2626] mt-1">{expiredUnits}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 items-center">
        <div className="relative w-full lg:max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search units by ID, blood group, donor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium border border-[#E2E8F0] rounded-xl bg-white
             focus:outline-none focus:ring-4 focus:ring-[#C0182A]/10 focus:border-[#C0182A]"
          />
        </div>

        <select value={bloodGroupFilter} onChange={(e) => setBloodGroupFilter(e.target.value)} 
        className="px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#C0182A]/20">
          <option value="All">All Blood Groups</option><option value="A+">A+</option><option value="A-">
            A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">
              AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
         className="px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#C0182A]/20">
          <option value="All">All Status</option><option value="Available">Available</option><option value="Used">
            Used</option><option value="Expired">Expired</option><option value="Reserved">Reserved</option>
        </select>

        <span className="text-xs text-[#9CA3AF] font-mono lg:ml-auto">{filteredUnits.length} records</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-sm text-[#9CA3AF]">Loading blood units...</div>
          ) : filteredUnits.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-3xl mb-2">🩸</div>
              <div className="text-sm font-semibold text-[#374151]">No blood units found</div>
              <div className="text-xs text-[#9CA3AF] mt-1">Add a blood unit or change your filters.</div>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  {["Unit ID", "Blood", "Quantity", "Donor", "Collection", "Expiry", "Status", "Action"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-[12px] font-semibold text-
                    [#9CA3AF] uppercase tracking-wider font-mono whitespace-nowrap">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => (
                  <tr key={unit.bloodUnitId} className="border-b border-[#F3F4F6] hover:bg-[#FAFAF9] transition-colors">
                    <td className="px-4 py-4 font-mono text-[#6B7280]">BLU-{String(unit.bloodUnitId).padStart(4, "0")}</td>
                    <td className="px-4 py-4"><span className="px-2.5 py-1 rounded-md bg-[#FEE2E2] 
                    text-[#C0182A] font-bold font-mono text-[10px]">{unit.bloodGroup}</span></td>
                    <td className="px-4 py-4 font-semibold text-[#374151]">{unit.quantity}</td>
                    <td className="px-4 py-4">
                      {unit.donor ? <div><div className="font-semibold text-[#111827]">{unit.donor.fullName}</div>
                      <div className="text-[10px] text-[#9CA3AF] font-mono">DNR-{String(unit.donor.donorId).padStart(4, "0")}</div>
                      </div> : <span className="text-[#9CA3AF]">No donor</span>}
                    </td>
                    <td className="px-4 py-4 font-mono text-[#374151] whitespace-nowrap">{unit.collectionDate}</td>
                    <td className="px-4 py-4 font-mono text-[#374151] whitespace-nowrap">{unit.expiryDate}</td>
                    <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px]
                       font-semibold ${getStatusStyle(unit.status)}`}>{unit.status}</span></td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelectedUnit(unit)} className="p-1.5 rounded-lg text-[#64748B]
                         hover:text-[#C0182A] hover:bg-[#FEF2F2]" title="View Details">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => handleDelete(unit.bloodUnitId)} className="p-1.5 rounded-lg text-[#94A3B8] 
                        hover:text-[#DC2626] hover:bg-[#FEF2F2]" title="Delete Unit">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setSelectedUnit(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Blood Unit Details</h2>
                <p className="text-xs text-[#9CA3AF] mt-1 font-mono">BLU-{String(selectedUnit.bloodUnitId).padStart(4, "0")}</p>
              </div>
              <button onClick={() => setSelectedUnit(null)} className="text-[#9CA3AF] hover:text-[#374151] text-xl">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Blood Group", selectedUnit.bloodGroup],
                ["Quantity", selectedUnit.quantity],
                ["Collection Date", selectedUnit.collectionDate],
                ["Expiry Date", selectedUnit.expiryDate],
                ["Status", selectedUnit.status],
                ["Donor", selectedUnit.donor?.fullName || "No donor"],
                ["Donor ID", selectedUnit.donor?.donorId ? `DNR-${String(selectedUnit.donor.donorId).padStart(4, "0")}` : "-"],
                ["Donor Blood Group", selectedUnit.donor?.bloodGroup || "-"],
                ["Camp", selectedUnit.donor?.camp?.campName || "No camp"],
                ["Camp Location", selectedUnit.donor?.camp?.location || "-"],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#F9FAFB] rounded-xl p-4">
                  <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-mono">{label}</div>
                  <div className="text-sm font-semibold text-[#111827] mt-1">{value}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-5">
              <button onClick={() => setSelectedUnit(null)} className="px-4 py-2 bg-[#C0182A] text-white rounded-xl text-sm
               font-semibold hover:bg-[#9B1421]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
