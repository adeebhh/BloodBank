import { useEffect,useState } from "react";
import api from "../services/api";
import { BarChart3,Droplet,ClipboardList,Tent,Users,RefreshCw,TrendingUp,ShieldAlert,UserRound,Activity,
  Layers,Award,AlertTriangle,CheckCircle2,
  Printer,Sparkles,PieChart,Flame,Clock,Building,Heart,Calendar,SlidersHorizontal,ChevronDown } from "lucide-react";

export default function ReportsPage(){
  const [report,setReport]=useState({bloodStockReport:[],bloodRequestReport:[],campReport:[],
    donorGenderReport:[],donorBloodGroupReport:[]});
  const [loading,setLoading]=useState(true),[error,setError]=useState(""),
  [refreshing,setRefreshing]=useState(false),[activeTab,setActiveTab]=useState("overview"),
  [stockDisplayMode,setStockDisplayMode]=useState("grid"),[lastRefreshedTime,setLastRefreshedTime]=useState("");

  const fetchReport=async()=>{
    try{
      setRefreshing(true);setError("");
      const response=await api.get("/api/reports");
      setReport(response.data);
      const now=new Date();
      setLastRefreshedTime(now.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    }catch(err){
      console.error("GET REPORT ERROR:",err);
      setError(err.response?.status===403||
        err.response?.status===401?"Access denied. Only administrators can view analytical reports.":"Failed to load reports. Please try again.");
    }finally{setLoading(false);setRefreshing(false);}
  };

  useEffect(()=>{fetchReport()},[]);

  const getTotal=(data=[])=>data.reduce((total,item)=>total+Number(item?.[1]||0),0);
  const getMax=(data=[])=>data.length?Math.max(...data.map(item=>Number(item?.[1]||0))):0;
  const getBarWidth=(value,data)=>{const max=getMax(data);return max?`${Math.max(Number(value)/max*100,4)}%`:"0%"};

  const totalStock=getTotal(report.bloodStockReport),totalRequests=getTotal(report.bloodRequestReport),
  totalCampDonors=getTotal(report.campReport),totalDonors=getTotal(report.donorGenderReport);
  const urgentRequestsCount=Number(report.bloodRequestReport.find(r=>r[0]?.toLowerCase()==="urgent")?.[1]||0);
  const urgentRatio=totalRequests>0?Math.round(urgentRequestsCount/totalRequests*100):0;
  const sortedCamps=[...report.campReport].sort((a,b)=>Number(b[1]||0)-Number(a[1]||0));
  const topCamp=sortedCamps[0]||null;

  const getStockStatus=units=>{
    if(units<=3)return{label:"Critical Shortage",badgeBg:"bg-[#FEF2F2]",badgeText:"text-[#B91C1C]",
      borderColor:"border-[#FECACA]",ringColor:"ring-[#C0182A]/20",alert:true};
    if(units<=8)return{label:"Moderate Reserve",badgeBg:"bg-[#FFFBEB]",badgeText:"text-[#92400E]",
      borderColor:"border-[#FDE68A]",ringColor:"ring-[#D97706]/20",alert:false};
    return{label:"Optimal Reserve",badgeBg:"bg-[#F0FDF4]",badgeText:"text-[#166534]",
      borderColor:"border-[#BBF7D0]",ringColor:"ring-[#16A34A]/20",alert:false};
  };

  const handlePrint=()=>window.print();

  if(loading)return(
    <div className="space-y-6">
      <div><div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse"/>
      <div className="h-4 w-72 bg-slate-100 rounded-lg mt-2 animate-pulse"/></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i=><div key={i} className="h-36 bg-white rounded-3xl border border-[#E2E8F0] animate-pulse"/>)}</div>
      <div className="h-96 bg-white rounded-3xl border border-[#E2E8F0] animate-pulse"/>
    </div>
  );

  return(
    <div className="space-y-6 pb-12">

      <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#111827] 
      rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C0182A]/20 rounded-full 
        blur-3xl pointer-events-none -mr-20 -mt-20"/>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#C0182A]/10 rounded-full
         blur-3xl pointer-events-none -ml-20 -mb-20"/>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-[#C0182A] text-white text-[11px] 
              font-extrabold uppercase tracking-wider font-mono-code flex items-center gap-1.5 shadow-sm shadow-[#C0182A]/40">
                <Activity size={13} className="animate-pulse"/>Live Telemetry</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#CBD5E1] text-[11px]
               font-mono-code border border-white/10">DB Synchronized {lastRefreshedTime?`• ${lastRefreshedTime}`:""}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[#CBD5E1] text-[11px]
               font-mono-code border border-white/10">Tier 1 Administrator Access</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Clinical Intelligence & Operations Report</h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              Consolidated real-time aggregation of cold chain blood units, critical requisition triages, 
              mobile camp mobilisation yield, and donor demographics.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
            <button onClick={handlePrint} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 
            hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/15 transition-all shadow-sm" title="Print / Save Report"><Printer size={15}/><span>Export PDF / Print</span></button>
            <button onClick={fetchReport} disabled={refreshing} className="inline-flex 
            items-center gap-2 px-5 py-2.5 bg-[#C0182A] hover:bg-[#9B1421] text-white text-xs
             font-bold rounded-xl transition-all shadow-lg shadow-[#C0182A]/30 hover:shadow-xl disabled:opacity-60 cursor-pointer">
              <RefreshCw size={15} className={refreshing?"animate-spin":""} strokeWidth={2.4}/>
              <span>{refreshing?"Syncing...":"Sync Analytics"}</span></button>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono-code">Overall Stock Depth</div>
          <div className="text-xl font-black text-white font-mono-code mt-0.5">{totalStock} 
            <span className="text-xs font-normal text-[#94A3B8]">units</span></div></div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono-code">Urgent Demand Ratio</div>
          <div className="text-xl font-black text-[#EF4444] font-mono-code mt-0.5 flex items-center gap-1.5"><span>{urgentRatio}%</span>
          <span className="text-[10px] font-normal text-[#94A3B8]">({urgentRequestsCount} urgent)</span></div></div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono-code">Top Camp Mobilisation</div>
          <div className="text-sm font-bold text-white truncate mt-1" title={topCamp?topCamp[0]:"None"}>
            {topCamp?topCamp[0]:"No camps"}</div></div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono-code">Verified Donors</div>
          <div className="text-xl font-black text-white font-mono-code mt-0.5">{totalDonors} 
            <span className="text-xs font-normal text-[#94A3B8]">profiles</span></div></div>
        </div>
      </div>

      {error&&<div className="flex items-center gap-3 bg-[#FEF2F2] border border-[#FECACA] rounded-2xl px-5 py-4 shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-white border border-[#FECACA] flex items-center justify-center shrink-0">
          <ShieldAlert size={20} className="text-[#C0182A]"/></div><div><p className="text-sm font-bold text-[#991B1B]">
            Access Restricted</p><p className="text-xs text-[#B91C1C] mt-0.5">{error}</p></div></div>}

      {!error&&<>
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] pb-3">
          {[
            {id:"overview",label:"Executive Overview",icon:Activity},
            {id:"inventory",label:"Blood Reserve Matrix",icon:Droplet},
            {id:"requisitions",label:"Hospital Demands & Camps",icon:ClipboardList},
            {id:"donors",label:"Donor Demographics",icon:Users}
          ].map(tab=>{
            const Icon=tab.icon,isActive=activeTab===tab.id;
            return <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
             className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all ${isActive?"bg-[#C0182A] text-white shadow-sm shadow-[#C0182A]/20":
             "bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0]"}`}>
              <Icon size={14}/><span>{tab.label}</span></button>
          })}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {title:"Refrigerated Reserves",value:totalStock,icon:Droplet,desc:`Across ${report.bloodStockReport.length}
             blood groups`,bottom:"Reserve Capacity",bottomValue:totalStock>20?"Optimal":"Requires Restock"},
            {title:"Hospital Requests",value:totalRequests,icon:ClipboardList,desc:`${urgentRequestsCount}
             urgent requisitions`,bottom:"Urgent Share",bottomValue:`${urgentRatio}% of demand`},
            {title:"Camp Mobilisation",value:totalCampDonors,icon:Tent,desc:`Across ${report.campReport.length}
             mobile drives`,bottom:"Avg. Yield / Camp",bottomValue:`${report.campReport.length>0?Math.round(totalCampDonors/report.campReport.length):0} donors`},
            {title:"Donor Directory",value:totalDonors,icon:Users,desc:`${report.donorBloodGroupReport.length}
             blood types on file`,bottom:"Registry Health",bottomValue:"Active"}
          ].map((m,i)=>{
            const Icon=m.icon;
            return <div key={m.title} className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs hover:border-[#CBD5E1] transition-all relative overflow-hidden group">
              <div className="flex items-start justify-between"><div><span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] font-mono-code">{m.title}</span>
              <div className="text-3xl font-black text-[#0F172A] font-mono-code mt-1.5 tracking-tight">
                {m.value}</div><div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-1 font-medium">
                  <Icon size={13} className="text-[#C0182A]"/><span>{m.desc}</span></div></div><div className="w-11 h-11 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] 
                  flex items-center justify-center text-[#C0182A] shrink-0"><Icon size={22}/></div></div>
              <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] font-mono-code text-[#64748B]">
                <span>{m.bottom}</span><span className="font-bold text-[#0F172A]">{m.bottomValue}</span></div>
            </div>
          })}
        </div>

        {(activeTab==="overview"||activeTab==="inventory")&&<div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#C0182A] flex items-center justify-center border border-[#FEE2E2]">
              <Droplet size={20} className="fill-[#C0182A]"/></div><div><h2 className="text-base font-bold text-[#0F172A] tracking-tight">Blood Reserve Grid & Storage Matrix</h2>
              <p className="text-xs text-[#64748B]">Unit quantities, deficit thresholds, and proportional reserve shares</p></div></div>
            <div className="flex items-center gap-2 self-end sm:self-auto"><span className="text-[11px] text-[#64748B] font-mono-code mr-1">
              Display Style:</span><button onClick={()=>setStockDisplayMode("grid")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors 
                ${stockDisplayMode==="grid"?"bg-[#C0182A] text-white shadow-2xs":"bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"}`}>Vial Cards</button>
                \<button onClick={()=>setStockDisplayMode("list")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors 
                  ${stockDisplayMode==="list"?"bg-[#C0182A] text-white shadow-2xs":"bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"}`}>Progress List</button></div>
          </div>

          {stockDisplayMode==="grid"?<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
            {report.bloodStockReport.map(item=>{
              const group=item[0],count=Number(item[1]||0),status=getStockStatus(count),share=totalStock>0?Math.round(count/totalStock*100):0;
              return <div key={group} className={`bg-white rounded-2xl border p-4 text-center transition-all hover:shadow-md relative 
              overflow-hidden flex flex-col justify-between ${status.alert?"border-[#FECACA] bg-[#FFFBFB]":"border-[#E2E8F0] hover:border-[#CBD5E1]"}`}>
                {status.alert&&<span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#DC2626] animate-ping"/>}
                <div><div className="w-12 h-12 mx-auto rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center font-black font-mono-code text-base text-[#C0182A] shadow-xs">
                  {group}</div><div className="text-2xl font-black text-[#0F172A] font-mono-code mt-3">{count}</div><div className="text-[11px] text-[#64748B] font-medium -mt-0.5">{count===1?"unit":"units"} in vault</div></div>
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] space-y-1.5"><div className="w-full bg-[#F1F5F9] h-1.5 rounded-full overflow-hidden"><div className="bg-[#C0182A] h-full rounded-full" style={{width:`${Math.min(share*2,100)}%`}}/></div>
                <div className="flex items-center justify-between text-[10px] font-mono-code text-[#94A3B8]"><span>Share</span>
                <span className="font-bold text-[#0F172A]">{share}%</span></div></div>
              </div>
            })}
          </div>:<div className="space-y-4">
            {report.bloodStockReport.map(item=>{
              const group=item[0],count=Number(item[1]||0),status=getStockStatus(count),share=totalStock>0?Math.round(count/totalStock*100):0;
              return <div key={group} className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 w-32 shrink-0"><span className="w-12 text-center px-2 py-1.5 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2] text-[#C0182A] text-xs font-black font-mono-code">
                  {group}</span><div><div className="text-sm font-black text-[#0F172A] font-mono-code">{count} units</div><div className="text-[10px] text-[#94A3B8]">{share}% of stock</div></div></div>
                <div className="flex-1"><div className="h-3 bg-[#E2E8F0]/70 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#C0182A] to-[#DC2626] rounded-full transition-all duration-500" 
                style={{width:getBarWidth(count,report.bloodStockReport)}}/></div></div>
                <div className="shrink-0 sm:w-36 text-right"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono-code ${status.badgeBg} ${status.badgeText} 
                border ${status.borderColor}`}>{status.alert&&<span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-ping"/>}{status.label}</span></div>
              </div>
            })}
          </div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#FFF5F5]/60 border border-[#FEE2E2] rounded-2xl p-4 flex items-start gap-3.5"><div className="w-8 h-8 rounded-xl bg-[#C0182A] 
            text-white flex items-center justify-center font-mono-code font-bold text-xs shrink-0 mt-0.5">O-</div><div><div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              <span>Universal Red Cell Donor</span><span className="px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#C0182A] text-[9px] font-mono-code font-bold">CRITICAL</span></div>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">Type O-negative can be transfused to patients of all blood groups. 
                Prioritise emergency procurement when reserves drop below 5 units.</p></div></div>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-mono-code font-bold text-xs shrink-0 mt-0.5">AB+</div>
              <div><div className="text-xs font-bold text-[#0F172A]">Universal Plasma Donor / Recipient</div>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">Type AB-positive patients can safely receive red blood cells from any blood group, simplifying emergency triage management.</p></div></div>
          </div>
        </div>}
        {(activeTab==="overview"||activeTab==="requisitions")&&<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]"><div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] text-[#C0182A] flex items-center justify-center border border-[#FEE2E2]"><ClipboardList size={18}/></div><div>
                <h2 className="text-base font-bold text-[#0F172A]">Hospital Demand Triage</h2><p className="text-xs text-[#64748B]">Requisition volume segmented by operational priority</p></div></div>
                <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold font-mono-code text-[#0F172A]">{totalRequests} Total Requests</span></div>

            {!report.bloodRequestReport.length?<div className="py-10 text-center text-xs text-[#94A3B8]">No requisition data recorded.</div>:<div className="space-y-4">
              {report.bloodRequestReport.map(item=>{
                const status=item[0],count=Number(item[1]||0),isUrgent=status?.toLowerCase()==="urgent",percentage=totalRequests>0?Math.round(count/totalRequests*100):0;
                return <div key={status} className={`p-4 rounded-2xl border transition-all ${isUrgent?"bg-[#FFF5F5]/40 border-[#FECACA]":"bg-[#F8FAFC] border-[#E2E8F0]"}`}>
                  <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono-code
                     ${isUrgent?"bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]":"bg-white text-[#475569] border border-[#E2E8F0]"}`}>
                      {isUrgent&&<span className="inline-block w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-ping mr-1"/>}{status}</span><span className="text-xs text-[#64748B]">
                        {percentage}% of demand</span></div><span className="text-base font-black font-mono-code text-[#0F172A]">{count} <span className="text-xs font-normal text-[#94A3B8]">orders</span></span></div>
                  <div className="h-2.5 bg-white rounded-full overflow-hidden border border-[#E2E8F0]/50"><div className={`h-full rounded-full transition-all duration-500 $
                    {isUrgent?"bg-gradient-to-r from-[#DC2626] to-[#C0182A]":"bg-gradient-to-r from-[#64748B] to-[#334155]"}`} style={{width:`${percentage}%`}}/></div>
                </div>
              })}
            </div>}
          </div>

          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]"><div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] text-[#475569] flex items-center justify-center border border-[#E2E8F0]"><Tent size={18}/></div><div>
                <h2 className="text-base font-bold text-[#0F172A]">Camp Mobilisation Leaderboard</h2><p className="text-xs text-[#64748B]">Donor yield achieved per community drive</p></div></div>
                <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold font-mono-code text-[#0F172A]">{report.campReport.length} Drives Recorded</span></div>

            {!sortedCamps.length?<div className="py-10 text-center text-xs text-[#94A3B8]">No camp records available.</div>:<div className="space-y-3">
              {sortedCamps.map((item,index)=>{
                const name=item[0],donors=Number(item[1]||0),isFirst=index===0;
                return <div key={name} className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${isFirst?"bg-[#FFF9F9] border-[#FEE2E2]":"bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]"}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono-code font-black text-xs shrink-0 border 
                    ${isFirst?"bg-[#C0182A] text-white border-[#C0182A]":"bg-white text-[#475569] border-[#E2E8F0]"}`}>{isFirst?<Award size={16}/>:`#${index+1}`}</div>
                  <div className="flex-1 min-w-0"><div className="flex items-center justify-between"><p className="text-xs font-bold text-[#0F172A] truncate" title={name}>{name}</p>
                  <span className="text-xs font-black font-mono-code text-[#0F172A] shrink-0 ml-2">{donors} donors</span></div><div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-[#E2E8F0]">
                      <div className={`h-full rounded-full ${isFirst?"bg-gradient-to-r from-[#C0182A] to-[#DC2626]":"bg-[#64748B]"}`} style={{width:getBarWidth(donors,report.campReport)}}/></div></div></div>
                </div>
              })}
            </div>}
          </div>
        </div>}

        {(activeTab==="overview"||activeTab==="donors")&&<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]"><div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] text-[#475569] flex items-center justify-center border border-[#E2E8F0]"><UserRound size={18}/></div><div>
                <h2 className="text-base font-bold text-[#0F172A]">Donor Demographic Proportions</h2><p className="text-xs text-[#64748B]">Gender distribution across verified donor accounts</p></div></div>
                <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold font-mono-code text-[#0F172A]">{totalDonors} Total</span></div>

            {!report.donorGenderReport.length?<div className="py-10 text-center text-xs text-[#94A3B8]">No gender demographic data.</div>:<div className="space-y-4">
              {report.donorGenderReport.map(item=>{
                const gender=item[0],count=Number(item[1]||0),isMale=gender?.toLowerCase()==="male",percentage=totalDonors>0?Math.round(count/totalDonors*100):0;
                return <div key={gender} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4"><div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><span className="w-8 h-8 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#C0182A]"><Users size={14}/></span>
                  <span className="text-xs font-bold text-[#0F172A] capitalize">{gender} Donors</span></div><div className="text-right">
                    <span className="text-sm font-black font-mono-code text-[#0F172A]">{count}</span><span className="text-[11px] font-mono-code text-[#64748B] ml-1.5">({percentage}%)</span></div></div>
                    <div className="h-2.5 bg-white rounded-full overflow-hidden border border-[#E2E8F0]/60"><div className={`h-full rounded-full transition-all duration-500
                     ${isMale?"bg-gradient-to-r from-[#C0182A] to-[#DC2626]":"bg-gradient-to-r from-[#475569] to-[#0F172A]"}`} style={{width:`${percentage}%`}}/></div></div>
              })}
            </div>}
          </div>

          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]"><div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FEF2F2] text-[#C0182A] flex items-center justify-center border border-[#FEE2E2]"><Layers size={18}/></div><div>
                <h2 className="text-base font-bold text-[#0F172A]">Donor Blood Typology Breakdown</h2><p className="text-xs text-[#64748B]">Registered volunteer donors by blood category</p></div></div>
                <span className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-bold font-mono-code text-[#0F172A]">{report.donorBloodGroupReport.length} Blood Groups</span></div>

            {!report.donorBloodGroupReport.length?<div className="py-10 text-center text-xs text-[#94A3B8]">No blood type demographic records.</div>:<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.donorBloodGroupReport.map(item=>{
                const group=item[0],count=Number(item[1]||0),percentage=totalDonors>0?Math.round(count/totalDonors*100):0;
                return <div key={group} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between hover:border-[#CBD5E1] transition-all">
                  <div className="flex items-center gap-2.5"><span className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#C0182A] font-black
                   font-mono-code text-xs flex items-center justify-center shadow-2xs">{group}</span><div><div className="text-xs font-bold text-[#0F172A]">Type {group}</div>
                   <div className="text-[10px] text-[#64748B] font-mono-code">{percentage}% of registry</div></div></div><span className="text-sm font-black font-mono-code text-[#0F172A]">{count}</span></div>
              })}
            </div>}
          </div>
        </div>}

        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#F1F5F9]">
            -<div className="w-8 h-8 rounded-xl bg-[#FEF2F2] text-[#C0182A] flex items-center justify-center">
            <Sparkles size={16}/></div><h3 className="text-sm font-bold text-[#0F172A]">Automated Clinical Observations & Recommendations</h3></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C0182A]"/>Reserve Replenishment</div>
                <p className="text-[#64748B] leading-relaxed">{totalStock<15?"Immediate blood donation camp scheduling recommended due to overall reserve levels falling below 15 units."
                :"Current blood reserve volume is in an optimal operating range. Continue standard refrigeration rotation."}</p></div>
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="font-bold text-[#0F172A] flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#DC2626]"/>
              Urgent Triage Load</div><p className="text-[#64748B] leading-relaxed">{urgentRatio>30?`Urgent requisitions represent 
              ${urgentRatio}% of demand. Ensure ICU and trauma unit dispatches are prioritized.`:`Urgent demand represents 
              ${urgentRatio}% of requests, indicating stable general hospital allocation.`}</p></div>
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]"/>Mobilisation Efficiency</div>
                <p className="text-[#64748B] leading-relaxed">{topCamp?`Top mobile initiative "${topCamp[0]}" generated ${topCamp[1]} donors.
                 Consider modeling upcoming drives after this format.`:"Schedule proactive donor drives with community organizations to increase voluntary donations."}</p></div>
          </div>
        </div>
      </>}
    </div>
  );
}