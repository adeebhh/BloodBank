import { useEffect, useState } from "react";
import api from "../services/api";
import { ClipboardList,Plus,Search,Eye,Trash2,
} from "lucide-react";
export default function InventoryPage() {
  const [inventory,setInventory]=useState([]);
  const [bloodUnits,setBloodUnits]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [showForm,setShowForm]=useState(false);
  const [selectedInventory,setSelectedInventory]=useState(null);
  const [search,setSearch]=useState("");
  const [bloodGroupFilter,setBloodGroupFilter]=useState("All");
  const emptyForm={availableUnits:"",storageLocation:"",bloodUnitId:""};
  const [form,setForm]=useState(emptyForm);

  const fetchInventory=async()=>{
    try{
      setLoading(true);
      setError("");
      const response=await api.get("/api/inventory");
      setInventory(Array.isArray(response.data)?response.data:[]);
    }catch (err) {
  console.error("GET INVENTORY ERROR:", err);

  if (err.response?.status === 403) {
    setError("Access restricted. Only administrators and staff can access inventory.");
  } else if (err.response?.status === 401) {
    setError("Please login to access inventory.");
  } else {
    setError("Failed to load inventory.");
  }
}finally{
      setLoading(false);
    }
  };

  const fetchBloodUnits=async()=>{
    try{
      const response=await api.get("/api/blood-units");
      setBloodUnits(Array.isArray(response.data)?response.data:[]);
    }catch(err){
      console.error(err);
    }
  };

  useEffect(()=>{
    fetchInventory();
    fetchBloodUnits();
  },[]);

  const handleChange=e=>{
    const {name,value}=e.target;
    setForm(previous=>({...previous,[name]:value}));
  };

  const handleAddInventory=async e=>{
    e.preventDefault();
    try{
      setError("");
      const inventoryData={
        availableUnits:Number(form.availableUnits),
        storageLocation:form.storageLocation,
        bloodUnitId:Number(form.bloodUnitId)
      };
      await api.post("/api/inventory",inventoryData);
      alert("Inventory added successfully!");
      setForm(emptyForm);
      setShowForm(false);
      fetchInventory();
    }catch(err){
      console.error(err);
      setError("Failed to add inventory.");
    }
  };

  const handleDelete=async id=>{
    if(!window.confirm("Are you sure you want to delete this inventory record?"))return;
    try{
      setError("");
      await api.delete(`/api/inventory/${id}`);
      alert("Inventory deleted successfully!");
      fetchInventory();
    }catch(err){
      console.error(err);
      setError("Failed to delete inventory.");
    }
  };

  const filteredInventory=inventory.filter(item=>{
    const searchText=search.toLowerCase();
    const matchesSearch=
      String(item.inventoryId).includes(searchText)||
      String(item.availableUnits).includes(searchText)||
      item.storageLocation?.toLowerCase().includes(searchText)||
      item.bloodUnit?.bloodGroup?.toLowerCase().includes(searchText)||
      String(item.bloodUnit?.bloodUnitId||"").includes(searchText);
    const matchesBloodGroup=bloodGroupFilter==="All"||item.bloodUnit?.bloodGroup===bloodGroupFilter;
    return matchesSearch&&matchesBloodGroup;
  });

  const totalAvailableUnits=inventory.reduce((total,item)=>total+Number(item.availableUnits||0),0);
  const totalInventoryRecords=inventory.length;
  const bloodUnitCount=new Set(inventory.map(item=>item.bloodUnit?.bloodUnitId).filter(Boolean)).size;

  const getStatusStyle=status=>{
    const value=status?.toLowerCase();
    if(value==="available"||value==="avail")return"bg-[#D1FAE5] text-[#065F46]";
    if(value==="expired")return"bg-[#FEE2E2] text-[#991B1B]";
    if(value==="used")return"bg-[#E5E7EB] text-[#374151]";
    return"bg-[#FEF3C7] text-[#92400E]";
  };

  return(
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Storage & Inventory
            </h1>
          <span className="px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#C0182A] 
          text-xs font-bold border border-[#FEE2E2] font-mono-code">
              {inventory.length} Records
            </span>
          </div>
          <p className="text-sm text-[#6B7280] mt-1">Manage blood storage and available inventory</p>
        </div>
        <button onClick={()=>{setForm(emptyForm);setError("");setShowForm(true)}}
         className="px-4 py-2.5 bg-[#C0182A] text-white text-sm font-semibold rounded-xl
          hover:bg-[#9B1421] transition-colors shadow-sm">+ Add Inventory</button>
      </div>

      {error&&<div className="bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] px-4 py-3 rounded-xl text-sm">{error}</div>}

      {showForm&&(
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">Add Inventory</h2>
              <p className="text-sm text-[#9CA3AF] mt-1">Add a blood unit to storage inventory</p>
            </div>
            <button onClick={()=>{setShowForm(false);setForm(emptyForm)}} 
            className="text-[#9CA3AF] hover:text-[#374151] text-xl">✕</button>
          </div>

          <form onSubmit={handleAddInventory} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Available Units</label>
              <input type="number" name="availableUnits" value={form.availableUnits} onChange={handleChange} 
              placeholder="Enter available units" min="0"
               required className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-xl bg-white 
               focus:outline-none focus:ring-2 focus:ring-[#C0182A]/20 focus:border-[#C0182A]"/>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Storage Location</label>
              <input type="text" name="storageLocation" value={form.storageLocation} 
              onChange={handleChange} placeholder="Example: Block 3 Refrigerator" 
              required className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-xl bg-white 
              focus:outline-none focus:ring-2 focus:ring-[#C0182A]/20 focus:border-[#C0182A]"/>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#374151] mb-1.5">Blood Unit</label>
              <select name="bloodUnitId" value={form.bloodUnitId}
               onChange={handleChange} required className="w-full px-3 py-2.5 text-sm border border-[#E5E7EB] 
               rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#C0182A]/20 focus:border-[#C0182A]">
                <option value="">Select blood unit</option>
                {bloodUnits.map(unit=><option key={unit.bloodUnitId} value={unit.bloodUnitId}>
                  BLU-{String(unit.bloodUnitId).padStart(4,"0")} - {unit.bloodGroup} - Quantity: {unit.quantity}</option>)}
              </select>
            </div>

            <div className="md:col-span-2 flex gap-3 pt-2">
              <button type="submit" className="px-5 py-2.5 bg-[#C0182A] text-white 
              text-sm font-semibold rounded-xl hover:bg-[#9B1421] transition-colors">Save Inventory</button>
              <button type="button" onClick={()=>{setShowForm(false);setForm(emptyForm)}}
               className="px-5 py-2.5 border border-[#E5E7EB] text-sm font-semibold text-[#374151] 
               rounded-xl hover:bg-[#F3F4F6]">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ["Inventory Records",totalInventoryRecords,"text-[#111827]"],
          ["Available Units",totalAvailableUnits,"text-[#059669]"],
          ["Blood Units",bloodUnitCount,"text-[#111827]"]
        ].map(([label,value,color])=>(
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
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]"
          />
          <input type="text" placeholder="Search inventory..." value={search} onChange={e=>setSearch(e.target.value)} 
          className="w-full px-4 py-2.5 pl-10 text-sm border border-[#E5E7EB] rounded-xl bg-white focus:outline-none 
          focus:ring-2 focus:ring-[#C0182A]/20 focus:border-[#C0182A]"/>
          
        </div>

        <select value={bloodGroupFilter} onChange={e=>setBloodGroupFilter(e.target.value)} 
        className="px-3 py-2.5 text-sm border border-[#E5E7EB] 
        rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#C0182A]/20">
          <option value="All">All Blood Groups</option>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(group=><option key={group} value={group}>{group}</option>)}
        </select>

        <span className="text-xs text-[#9CA3AF] font-mono lg:ml-auto">{filteredInventory.length} records</span>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          {loading?(
            <div className="p-10 text-center text-sm text-[#9CA3AF]">Loading inventory...</div>
          ):filteredInventory.length===0?(
            <div className="p-10 text-center">
              <div className="text-3xl mb-2">🩸</div>
              <div className="text-sm font-semibold text-[#374151]">No inventory found</div>
              <div className="text-xs text-[#9CA3AF] mt-1">Add inventory or change your search/filter.</div>
            </div>
          ):(
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  {["Inventory ID","Blood Unit","Blood","Available","Storage Location","Collection","Expiry","Status","Action"].map(heading=><th key={heading} 
                  className="px-4 py-3 text-left text-[12px] font-semibold text-
                    [#9CA3AF] uppercase tracking-wider font-mono whitespace-nowrap">{heading}</th>)}
                </tr>
              </thead>

              <tbody>
                {filteredInventory.map(item=>{
                  const unit=item.bloodUnit;
                  return(
                    <tr key={item.inventoryId} className="border-b border-[#F3F4F6] hover:bg-[#FAFAF9] transition-colors">
                      <td className="px-4 py-4 font-mono text-[#6B7280]">INV-{String(item.inventoryId).padStart(4,"0")}</td>
                      <td className="px-4 py-4 font-mono text-[#6B7280]">BLU-{String(unit?.bloodUnitId||"-").padStart(4,"0")}</td>
                      <td className="px-4 py-4"><span className="px-2.5 py-1 rounded-md bg-[#FEE2E2] text-[#C0182A] font-bold font-mono text-[10px]">
                        {unit?.bloodGroup||"-"}</span></td>
                      <td className="px-4 py-4 font-semibold text-[#374151]">{item.availableUnits}</td>
                      <td className="px-4 py-4 font-semibold text-[#111827]">{item.storageLocation}</td>
                      <td className="px-4 py-4 font-mono text-[#374151] whitespace-nowrap">{unit?.collectionDate||"-"}</td>
                      <td className="px-4 py-4 font-mono text-[#374151] whitespace-nowrap">{unit?.expiryDate||"-"}</td>
                      <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${getStatusStyle(unit?.status)}`}>
                        {unit?.status||"-"}</span></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedInventory(item)}
                            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#C0182A] hover:bg-[#FEF2F2] transition-colors"
                            title="View Details">
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.inventoryId)}
                            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                            title="Delete Inventory">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedInventory&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={()=>setSelectedInventory(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Inventory Details</h2>
                <p className="text-xs text-[#9CA3AF] mt-1 font-mono">INV-{String(selectedInventory.inventoryId).padStart(4,"0")}</p>
              </div>
              <button onClick={()=>setSelectedInventory(null)} className="text-[#9CA3AF] hover:text-[#374151] text-xl">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Inventory ID",`INV-${String(selectedInventory.inventoryId).padStart(4,"0")}`],
                ["Available Units",selectedInventory.availableUnits],
                ["Storage Location",selectedInventory.storageLocation],
                ["Blood Unit ID",selectedInventory.bloodUnit?.bloodUnitId?`
                  BLU-${String(selectedInventory.bloodUnit.bloodUnitId).padStart(4,"0")}`:"-"],
                ["Blood Group",selectedInventory.bloodUnit?.bloodGroup||"-"],
                ["Blood Quantity",selectedInventory.bloodUnit?.quantity??"-"],
                ["Collection Date",selectedInventory.bloodUnit?.collectionDate||"-"],
                ["Expiry Date",selectedInventory.bloodUnit?.expiryDate||"-"],
                ["Status",selectedInventory.bloodUnit?.status||"-"]
              ].map(([label,value])=>(
                <div key={label} className="bg-[#F9FAFB] rounded-xl p-4">
                  <div className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-mono">{label}</div>
                  <div className="text-sm font-semibold text-[#111827] mt-1">{value}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-5">
              <button onClick={()=>setSelectedInventory(null)}
               className="px-4 py-2 bg-[#C0182A] text-white rounded-xl text-sm font-semibold hover:bg-[#9B1421]">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}