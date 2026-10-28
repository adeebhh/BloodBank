import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users,Droplets,AlertCircle,Tent,Activity,ArrowUpRight,
  ShieldCheck,UserCheck,Plus,RefreshCw,Package,ClipboardList,Building2,
  Calendar,MapPin,Clock,ArrowRight } from "lucide-react";
import api from "../services/api";

export default function DashboardPage(){
  const navigate=useNavigate();
  const [dashboard,setDashboard]=useState({totalDonors:0,totalBloodUnits:0,totalBloodRequests:0,totalCamps:0,totalUsers:0});
  const [recentRequests,setRecentRequests]=useState([]);
  const [upcomingCamps,setUpcomingCamps]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  const fetchDashboard=async()=>{
    try{
      setLoading(true);setError("");
      const [dashRes,reqRes,campsRes]=await Promise.allSettled([
        api.get("/api/dashboard"),api.get("/api/blood-requests"),api.get("/api/camps")
      ]);
      if(dashRes.status==="fulfilled"&&dashRes.value.data)setDashboard(dashRes.value.data);
      if(reqRes.status==="fulfilled"&&Array.isArray(reqRes.value.data))setRecentRequests(reqRes.value.data.slice(0,5));
      if(campsRes.status==="fulfilled"&&Array.isArray(campsRes.value.data))setUpcomingCamps(campsRes.value.data.slice(0,3));
    }catch(err){console.error("GET DASHBOARD ERROR:",err);setError("Failed to load dashboard telemetry.");}
    finally{setLoading(false);}
  };

  useEffect(()=>{fetchDashboard();},[]);

  const role=localStorage.getItem("role")||"Staff";
  const displayRole=role.charAt(0).toUpperCase()+role.slice(1).toLowerCase();

  if(loading)return <div className="space-y-6">
    <div className="h-32 bg-white rounded-3xl border border-[#E2E8F0] animate-pulse p-6"/>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1,2,3,4].map(i=><div key={i} className="h-36 bg-white rounded-2xl border border-[#E2E8F0] animate-pulse"/>)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 h-80 bg-white rounded-2xl border border-[#E2E8F0] animate-pulse"/>
      <div className="lg:col-span-4 h-80 bg-white rounded-2xl border border-[#E2E8F0] animate-pulse"/>
    </div>
  </div>;

  const statCards=[
    {title:"Total Donors",value:dashboard.totalDonors,desc:"Registered blood donors",Icon:Users,path:"/donors"},
    {title:"Blood Units",value:dashboard.totalBloodUnits,desc:"Units in cold storage",Icon:Droplets,path:"/blood-units"},
    {title:"Blood Requests",value:dashboard.totalBloodRequests,desc:"Emergency requisitions",Icon:AlertCircle,path:"/requests"},
    {title:"Donation Camps",value:dashboard.totalCamps,desc:"Scheduled mobile drives",Icon:Tent,path:"/camps"}
  ];

  return <div className="space-y-6">
    <div className="relative rounded-3xl bg-gradient-to-br from-white via-[#FDFEFE] to-[#FEF2F2] border border-[#E2E8F0] 
    p-6 lg:p-8 shadow-xs overflow-hidden">
      <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-[#FEF2F2] to-transparent pointer-events-none"/>
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] 
          text-xs font-bold text-[#C0182A]">
            <span className="w-2 h-2 rounded-full bg-[#C0182A] animate-ping"/>Live Operations Control
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Welcome back, <span className="text-[#C0182A]">{displayRole}</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-xl leading-relaxed">
            Real-time surveillance of clinical blood reserves, patient emergency requisitions, and regional 
            mobile collection drives.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={()=>navigate("/requests")} className="inline-flex items-center gap-2 px-4 py-2.5 
          bg-[#C0182A] text-white text-xs font-bold rounded-xl hover:bg-[#9B1421] transition-all shadow-md 
          shadow-[#C0182A]/20 cursor-pointer"><Plus size={14}/>New Requisition</button>
          <button onClick={()=>navigate("/donors")} className="inline-flex items-center gap-2 px-4 py-2.5 
          bg-white border border-[#E2E8F0] text-[#0F172A] text-xs font-bold rounded-xl hover:bg-[#F8FAFC] 
          transition-all cursor-pointer"><UserCheck size={14}/>Register Donor</button>
          <button onClick={fetchDashboard} className="p-2.5 bg-white border border-[#E2E8F0] text-[#64748B] 
          rounded-xl hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors cursor-pointer" title="Refresh Telemetry">
            <RefreshCw size={14}/></button>
        </div>
      </div>
    </div>

    {error&&<div className="flex items-center gap-3 bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] 
    px-5 py-4 rounded-2xl text-xs font-semibold"><AlertCircle size={18}/>{error}</div>}

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCards.map(({title,value,desc,Icon,path})=><div key={title} onClick={()=>navigate(path)} 
      className="group bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:shadow-md hover:border-[#CBD5E1] 
      transition-all cursor-pointer flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div><span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider font-mono-code">{title}</span>
          <div className="text-3xl font-black text-[#0F172A] mt-2 font-mono-code">{value}</div></div>
          <div className="w-11 h-11 shrink-0 rounded-xl bg-[#FEF2F2] text-[#C0182A] flex items-center justify-center
           group-hover:scale-110 group-hover:bg-[#C0182A] group-hover:text-white transition-all shadow-xs">
            <Icon size={20} strokeWidth={2.2}/></div>
        </div>
        <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
          <span className="text-[#64748B] font-medium truncate">{desc}</span>
          <ArrowUpRight size={14} className="shrink-0 text-[#94A3B8] group-hover:text-[#C0182A] 
          group-hover:translate-x-0.5 transition-transform"/>
        </div>
      </div>)}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] text-[#C0182A] flex items-center 
              justify-center border border-[#FEE2E2]"><Activity size={18} strokeWidth={2.4}/></div>
              <div><h2 className="text-base font-bold text-[#0F172A]">Live Hospital Requisitions & Triage</h2>
              <p className="text-xs text-[#64748B]">Recent patient blood requests needing allocation</p></div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF2F2] text-[#C0182A] 
            text-[10px] font-bold border border-[#FEE2E2]"><span className="w-1.5 h-1.5 rounded-full bg-[#C0182A] animate-pulse"/>
            Active Requisitions</span>
          </div>

          <div className="mt-4">
            {recentRequests.length>0?<div className="divide-y divide-[#F1F5F9]">
              {recentRequests.map((req,idx)=>{
                const isUrgent=req.status?.toLowerCase()==="urgent",isCompleted=req.status?.toLowerCase()==="completed";
                return <div key={req.id||idx} onClick={()=>navigate("/requests")} className="py-3 px-2 flex items-center 
                justify-between rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 shrink-0 rounded-lg bg-[#FEF2F2] text-[#C0182A] font-mono-code font-black text-xs 
                    flex items-center justify-center border border-[#FEE2E2]">{req.bloodGroup||"—"}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0F172A] truncate">{req.patientName||"Patient Request"}</p>
                      <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                        <span className="flex items-center gap-1"><Building2 size={11} className="text-[#94A3B8]"/>
                        {req.hospitalName||"General Hospital"}</span>
                        <span>•</span>
                        <span className="font-mono-code font-semibold text-[#0F172A]">{req.unitsRequired||1}
                           {Number(req.unitsRequired)===1?"unit":"units"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize 
                      ${isUrgent?"bg-red-100 text-red-700 border border-red-200 animate-pulse":isCompleted?"bg-emerald-50 text-emerald-700 border border-emerald-200":"bg-slate-100 text-slate-700 border border-slate-200"}`}>{req.status||"Pending"}</span>
                    <ArrowRight size={14} className="text-[#94A3B8] group-hover:text-[#C0182A] group-hover:translate-x-0.5 transition-all"/>
                  </div>
                </div>;
              })}
            </div>:<div className="py-10 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F8FAFC] text-[#94A3B8] flex items-center justify-center 
              mb-2 border border-[#E2E8F0]"><ClipboardList size={22}/></div>
              <p className="text-xs font-bold text-[#0F172A]">No Pending Requisitions</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">All emergency hospital dispatches have been fulfilled.</p>
              <button onClick={()=>navigate("/requests")} className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs 
              font-bold text-[#C0182A] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"><Plus size={13}/>
              Submit New Request</button>
            </div>}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
          <span className="text-[#64748B] flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"/>
          Connected to Hospital Dispatch Hub</span>
          <button onClick={()=>navigate("/requests")} className="font-bold text-[#C0182A] hover:text-[#9B1421] 
          flex items-center gap-1 cursor-pointer"><span>Manage Requisitions</span><ArrowRight size={13}/></button>
        </div>
      </div>

      <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] text-[#0F172A] flex items-center justify-center border border-[#E2E8F0]">
                <Package size={18} strokeWidth={2.2}/></div>
              <div><h2 className="text-base font-bold text-[#0F172A]">Storage & Operations Hub</h2><p className="text-xs text-[#64748B]">
                Cold-chain parameters & quick links</p></div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#475569] text-[10px] font-bold">TELEMETRY</span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[#64748B] text-[11px] mb-1"><span>Cold Chain</span>
              <Clock size={13} className="text-[#C0182A]"/></div>
              <div className="text-lg font-black text-[#0F172A] font-mono-code">4.0°C</div>
              <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                Optimal (2°- 6°C)</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <div className="flex items-center justify-between text-[#64748B] text-[11px] mb-1"><span>System Users</span>
              <Users size={13} className="text-[#C0182A]"/></div>
              <div className="text-lg font-black text-[#0F172A] font-mono-code">{dashboard.totalUsers}</div>
              <span className="inline-block mt-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                Staff & Donors</span>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono-code">Quick Navigation</span>
            <div onClick={()=>navigate("/inventory")} className="p-3 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] 
            hover:bg-[#F8FAFC] transition-all flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-lg bg-[#FEF2F2] text-[#C0182A] 
              flex items-center justify-center text-xs"><Package size={14}/></div><span className="text-xs font-bold text-[#0F172A]">
                Cold Storage Racks & Inventory</span></div>
              <ArrowRight size={13} className="text-[#94A3B8] group-hover:text-[#C0182A]"/>
            </div>
            <div onClick={()=>navigate("/reports")} className="p-3 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] 
            hover:bg-[#F8FAFC] transition-all flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5"><div className="w-7 h-7 rounded-lg bg-[#FEF2F2] text-[#C0182A] flex items-center 
              justify-center text-xs"><Activity size={14}/></div><span className="text-xs font-bold text-[#0F172A]">
                Blood Reserve Intelligence & Reports</span></div>
              <ArrowRight size={13} className="text-[#94A3B8] group-hover:text-[#C0182A]"/>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#10B981]"/>
          <span>Role: <strong className="text-[#0F172A]">{displayRole}</strong> (JWT Secure)</span></span>
          <button onClick={()=>navigate("/settings")} className="font-bold text-[#C0182A] hover:text-[#9B1421] cursor-pointer">
            Settings →</button>
        </div>
      </div>
    </div>

    {upcomingCamps.length>0&&<div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] text-[#C0182A] flex items-center justify-center border border-[#FEE2E2]">
            <Tent size={18} strokeWidth={2.4}/></div>
          <div><h2 className="text-base font-bold text-[#0F172A]">Scheduled Mobile Donation Drives</h2>
          <p className="text-xs text-[#64748B]">Upcoming voluntary community blood donation camps</p></div>
        </div>
        <button onClick={()=>navigate("/camps")} className="text-xs font-bold text-[#C0182A] hover:text-[#9B1421]
         flex items-center gap-1 cursor-pointer"><span>View All Camps</span><ArrowRight size={13}/></button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {upcomingCamps.map((camp,idx)=><div key={camp.id||idx} onClick={()=>navigate("/camps")} 
        className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#C0182A]/30 hover:bg-[#FEF2F2]/20 transition-all cursor-pointer group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-[#C0182A] uppercase tracking-wider font-mono-code">
              CAMP #{camp.id||idx+1}</span>
            <span className="flex items-center gap-1 text-[11px] text-[#64748B] font-medium">
              <Calendar size={12} className="text-[#94A3B8]"/>{camp.campDate||"Upcoming"}</span>
          </div>
          <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#C0182A] transition-colors truncate">
            {camp.campName||"Community Blood Drive"}</h3>
          <p className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1 truncate">
            <MapPin size={12} className="text-[#94A3B8] shrink-0"/><span>{camp.location||"City Venue"}</span></p>
          <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span>By: {camp.organizedBy||"Red Cross"}</span>
            <span className="font-bold text-[#C0182A] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Details →</span>
          </div>
        </div>)}
      </div>
    </div>}
  </div>;
}
