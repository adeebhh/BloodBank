import { useEffect, useState } from "react";
import {
  Users,UserPlus,Search,Eye,Edit3,Trash2,X,Droplet,
  Phone,Mail,MapPin,Heart,Calendar,Tent,AlertCircle,
} from "lucide-react";
import api from "../services/api";

export default function DonorsPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [editingDonor, setEditingDonor] = useState(null);
  const [search, setSearch] = useState("");

  const emptyForm = { fullName: "", email: "", phoneNumber: "", bloodGroup: "", gender: "",
     age: "", address: "", campId: "" };
  const [form, setForm] = useState(emptyForm);

  const fetchDonors = async () => {
    try {
      setLoading(true); setError("");
      const response = await api.get("/api/donors");
      setDonors(response.data);
    } catch (err) {
      console.error(err); setError("Failed to load donors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonors(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleAddDonor = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const donorData = { fullName: form.fullName, email: form.email, phoneNumber: form.phoneNumber, 
        bloodGroup: form.bloodGroup, gender: form.gender, age: Number(form.age), address: form.address,
         campId: Number(form.campId) };
      await api.post("/api/donors", donorData);
      alert("Donor added successfully!");
      setForm(emptyForm); setShowForm(false); fetchDonors();
    } catch (err) {
      console.error(err); setError("Failed to add donor.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this donor?");
    if (!confirmed) return;
    try {
      setError("");
      await api.delete(`/api/donors/${id}`);
      alert("Donor deleted successfully!");
      fetchDonors();
    } catch (err) {
      console.error(err); setError("Failed to delete donor.");
    }
  };

  const startEdit = (donor) => {
    setEditingDonor(donor);
    setForm({
      fullName: donor.fullName || "",
      email: donor.email || "",
      phoneNumber: donor.phoneNumber || "",
      bloodGroup: donor.bloodGroup || "",
      gender: donor.gender || "",
      age: donor.age || "",
      address: donor.address || "",
      campId: donor.camp?.campId || "",
    });
    setShowForm(true); setSelectedDonor(null);
  };

  const handleUpdateDonor = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const donorData = { fullName: form.fullName, email: form.email, phoneNumber: form.phoneNumber, 
        bloodGroup: form.bloodGroup, gender: form.gender, age: Number(form.age), address: form.address, 
        campId: Number(form.campId) };
      await api.put(`/api/donors/${editingDonor.donorId}`, donorData);
      alert("Donor updated successfully!");
      setEditingDonor(null); setForm(emptyForm); setShowForm(false); fetchDonors();
    } catch (err) {
      console.error(err); setError("Failed to update donor.");
    }
  };

  const filteredDonors = donors.filter((donor) => {
    const searchText = search.toLowerCase();
    return donor.fullName?.toLowerCase().includes(searchText) || donor.email?.toLowerCase().includes(searchText) || 
    donor.phoneNumber?.toLowerCase().includes(searchText) || donor.bloodGroup?.toLowerCase().includes(searchText);
  });

  const donorForm = (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-[#111827]">
            {editingDonor ? "Edit Donor" : "Add New Donor"}</h2>
          <p className="text-sm text-[#9CA3AF] mt-1">
            {editingDonor ? "Update donor information" : "Enter the donor's information"}</p>
        </div>
        <button onClick={() => { setShowForm(false); setEditingDonor(null); 
          setForm(emptyForm); }} className="text-[#9CA3AF] hover:text-[#374151] text-xl">✕</button>
      </div>

      <form onSubmit={editingDonor ? handleUpdateDonor : handleAddDonor} 
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div>
          <label className="field-label">Full Name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange}
           placeholder="Enter full name" required className="field-input" />
        </div>
        <div>
          <label className="field-label">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange}
           placeholder="Enter email" required className="field-input" />
        </div>
        <div>
          <label className="field-label">Phone Number</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} 
          placeholder="Enter phone number" required className="field-input" />
        </div>
        <div>
          <label className="field-label">Blood Group</label>
          <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required className="field-input">
            <option value="">Select blood group</option><option value="A+">
              A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-"
              >B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">
                O+</option><option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label className="field-label">Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} required className="field-input">
            <option value="">Select gender</option><option value="Male">
              Male</option><option value="Female">Female</option><option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="field-label">Age</label>
          <input type="number" name="age" value={form.age} onChange={handleChange}
           placeholder="Enter age" min="1" required className="field-input" />
        </div>
        <div className="md:col-span-2">
          <label className="field-label">Address</label>
          <input name="address" value={form.address} onChange={handleChange} 
          placeholder="Enter address" required className="field-input" />
        </div>
        <div>
          <label className="field-label">Camp ID</label>
          <input type="number" name="campId" value={form.campId} onChange={handleChange}
           placeholder="Enter camp ID" min="1" required className="field-input" />
        </div>
        <div className="md:col-span-2 xl:col-span-3 flex gap-3 pt-2">
          <button type="submit" className="px-5 py-2.5 bg-[#C0182A] text-white text-sm font-semibold rounded-xl hover:bg-[#9B1421] 
          transition-colors">{editingDonor ? "Update Donor" : "Save Donor"}</button>
          <button type="button" onClick={() => { setShowForm(false); setEditingDonor(null); setForm(emptyForm); }} 
          className="px-5 py-2.5 border border-[#E5E7EB] text-sm font-semibold text-[#374151] rounded-xl hover:bg-[#F3F4F6]">Cancel</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Blood Donors
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#C0182A] 
            text-xs font-bold border border-[#FEE2E2] font-mono-code">
              {donors.length} Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Maintain registered voluntary and replacement blood donor profiles
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDonor(null);
            setForm(emptyForm);
            setShowForm(!showForm);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C0182A]
           text-white text-xs font-bold rounded-xl hover:bg-[#9B1421] transition-all shadow-md shadow-[#C0182A]/20 hover:shadow-lg"
        >
          <UserPlus size={16} strokeWidth={2.4} />
          <span>{showForm ? "Close Form" : "Register Donor"}</span>
        </button>
      </div>

      {error && <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] px-4 py-3 rounded-xl text-sm">{error}</div>}

      {showForm && donorForm}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="text-xs text-[#9CA3AF] uppercase tracking-wider">Total Donors</div>
          <div className="text-2xl font-bold text-[#111827] mt-1">{donors.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="text-xs text-[#9CA3AF] uppercase tracking-wider">Male Donors</div>
          <div className="text-2xl font-bold text-[#111827] mt-1">{donors.filter((d) =>
             d.gender?.toLowerCase() === "male").length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="text-xs text-[#9CA3AF] uppercase tracking-wider">Female Donors</div>
          <div className="text-2xl font-bold text-[#111827] mt-1">{donors.filter((d) =>
             d.gender?.toLowerCase() === "female").length}</div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input
            type="text"
            placeholder="Search donors by name, blood, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium border border-[#E2E8F0] 
            rounded-xl bg-white focus:outline-none focus:ring-4 focus:ring-[#C0182A]/10 focus:border-[#C0182A] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#64748B] font-mono-code">
          <span className="px-2.5 py-1 bg-white border border-[#E2E8F0] rounded-lg shadow-2xs font-semibold">
            {filteredDonors.length} records found
          </span>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-sm text-[#9CA3AF]">Loading donors...</div>
          ) : filteredDonors.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-3xl mb-2">🩸</div>
              <div className="text-sm font-semibold text-[#374151]">No donors found</div>
              <div className="text-xs text-[#9CA3AF] mt-1">Add a donor or change your search.</div>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  {["ID", "Donor", "Blood", "Gender", "Age", "Phone", "Email", "Camp", "Actions"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-[12px] font-semibold text-
                    [#9CA3AF] uppercase tracking-wider font-mono whitespace-nowrap">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map((donor) => (
                  <tr key={donor.donorId} className="border-b border-[#F3F4F6] hover:bg-[#FAFAF9] transition-colors">
                    <td className="px-4 py-4 font-mono text-[#6B7280]">DNR-{String(donor.donorId).padStart(4, "0")}</td>
                    <td className="px-4 py-4"><div className="font-semibold text-[#111827]">{donor.fullName}</div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5">{donor.address}</div></td>
                    <td className="px-4 py-4"><span className="px-2.5 py-1 rounded-md bg-[#FEE2E2] text-[#C0182A] 
                    font-bold font-mono text-[10px]">{donor.bloodGroup}</span></td>
                    <td className="px-4 py-4 text-[#374151]">{donor.gender}</td>
                    <td className="px-4 py-4 font-mono text-[#374151]">{donor.age}</td>
                    <td className="px-4 py-4 text-[#374151] whitespace-nowrap">{donor.phoneNumber}</td>
                    <td className="px-4 py-4 text-[#374151] whitespace-nowrap">{donor.email}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {donor.camp ? <div><div className="font-semibold text-[#374151]">{donor.camp.campName}</div>
                      <div className="text-[10px] text-[#9CA3AF]">{donor.camp.location}</div></div> : <span className="text-[#9CA3AF]">No camp</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedDonor(donor)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#C0182A] hover:bg-[#FEF2F2] transition-colors"
                          title="View Details">
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => startEdit(donor)}
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
                          title="Edit Donor">
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(donor.donorId)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                          title="Delete Donor">
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

      {selectedDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={() => setSelectedDonor(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Donor Details</h2>
                <p className="text-xs text-[#9CA3AF] mt-1">DNR-{String(selectedDonor.donorId).padStart(4, "0")}</p>
              </div>
              <button onClick={() => setSelectedDonor(null)} className="text-[#9CA3AF] hover:text-[#374151] text-xl">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Full Name", selectedDonor.fullName],
                ["Email", selectedDonor.email],
                ["Phone Number", selectedDonor.phoneNumber],
                ["Blood Group", selectedDonor.bloodGroup],
                ["Gender", selectedDonor.gender],
                ["Age", selectedDonor.age],
                ["Address", selectedDonor.address],
                ["Camp", selectedDonor.camp?.campName || "No camp assigned"],
                ["Camp Location", selectedDonor.camp?.location || "-"],
                ["Camp Date", selectedDonor.camp?.campDate || "-"],
              ].map(([label, value]) => (
                <div key={label} className="bg-[#F9FAFB] rounded-xl p-4">
                  <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-mono">{label}</div>
                  <div className="text-sm font-semibold text-[#111827] mt-1">{value}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button onClick={() => startEdit(selectedDonor)} className="px-4 py-2 border border-[#E5E7EB] rounded-xl
               text-sm font-semibold text-[#374151] hover:bg-[#F3F4F6]">Edit</button>
              <button onClick={() => setSelectedDonor(null)} className="px-4 py-2 bg-[#C0182A] 
              text-white rounded-xl text-sm font-semibold hover:bg-[#9B1421]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
