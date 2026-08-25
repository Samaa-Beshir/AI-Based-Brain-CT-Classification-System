import type { Screen } from "./types";

export function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const common = { width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke:"currentColor", strokeWidth:1.8, strokeLinecap:"round" as const, strokeLinejoin:"round" as const, "aria-hidden":true };
  const paths: Record<string, React.ReactNode> = {
    home:<><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10"/><path d="M9 21v-6h6v6"/></>, upload:<><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M20 15.5A4.5 4.5 0 0 0 16 9h-1A7 7 0 1 0 5 19h14"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>, file:<><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/><path d="M9 12h6M9 16h6"/></>, info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></>,
    logout:<><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M14 3h6v18h-6"/></>, user:<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>, lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>, eye:<><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
    monitor:<><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></>, image:<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></>, layers:<><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
    folder:<><path d="M3 6h7l2 2h9v12H3z"/></>, trash:<><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/><path d="M10 11v6M14 11v6"/></>, spark:<><path d="M12 2 9.8 8.3 3.5 10.5l6.3 2.2L12 19l2.2-6.3 6.3-2.2-6.3-2.2L12 2Z"/><path d="m19 17-.8 2.2L16 20l2.2.8L19 23l.8-2.2L22 20l-2.2-.8L19 17Z"/></>,
    shield:<><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-5"/></>, bell:<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>, menu:<><path d="M4 6h16M4 12h16M4 18h16"/></>, x:<><path d="m5 5 14 14M19 5 5 19"/></>,
    brain:<><path d="M9.5 4.5A3 3 0 0 0 4 6v2a3 3 0 0 0-1 5.5A3.5 3.5 0 0 0 7 19h2.5V4.5Z"/><path d="M14.5 4.5A3 3 0 0 1 20 6v2a3 3 0 0 1 1 5.5A3.5 3.5 0 0 1 17 19h-2.5V4.5Z"/><path d="M7 8h2.5M5.5 14h4M17 8h-2.5M18.5 14h-4"/></>, check:<><path d="m5 12 4 4L19 6"/></>, plus:<><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></>, download:<><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 19v2h16v-2"/></>, print:<><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 15h12v6H6z"/></>,
    arrow:<><path d="M19 12H5m6-6-6 6 6 6"/></>, alert:<><path d="M10.3 3.2 2.3 18a2 2 0 0 0 1.8 3h15.8a2 2 0 0 0 1.8-3L13.7 3.2a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></>, refresh:<><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M6.1 7A7 7 0 0 1 18 5l2 2M4 17l2 2a7 7 0 0 0 11.9-2"/></>,
    chart:<><path d="M4 20V10M10 20V4M16 20v-7M22 20V7"/></>, settings:<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
  };
  return <svg {...common}>{paths[name] ?? paths.info}</svg>;
}

export function Brand({ compact=false }: { compact?: boolean }) {
  return <div className={`brand ${compact ? "brand--compact" : ""}`}><img src="https://clyra-brain-ct.samaareda-sr.chatgpt.site/assets/clyra-logo-light.png" alt="CLYRA — See it. Map it. Know it."/></div>;
}

const navItems: {screen:Screen; icon:string; label:string}[] = [
  {screen:"overview",icon:"home",label:"Overview"}, {screen:"upload",icon:"upload",label:"Upload CT"},
  {screen:"history",icon:"clock",label:"Analysis History"}, {screen:"report",icon:"file",label:"Reports"}, {screen:"system",icon:"info",label:"System Info"},
];

export function Sidebar({ current, open, onClose, onNavigate, onSignOut }: { current:Screen; open:boolean; onClose:()=>void; onNavigate:(screen:Screen)=>void; onSignOut:()=>void }) {
  return <><button className={`sidebar-scrim ${open?"is-open":""}`} onClick={onClose} aria-label="Close navigation"/><aside className={`sidebar ${open?"is-open":""}`}><button className="sidebar-close" onClick={onClose} aria-label="Close menu"><Icon name="x"/></button><Brand compact/><nav aria-label="Primary navigation">{navItems.map((item)=><button key={item.screen} className={current===item.screen||(current==="results"&&item.screen==="history")||(current==="analysis"&&item.screen==="upload")?"active":""} onClick={()=>{onNavigate(item.screen);onClose();}}><Icon name={item.icon}/><span>{item.label}</span></button>)}</nav><button className="sign-out" onClick={onSignOut}><Icon name="logout"/><span>Sign Out</span></button><small className="app-version">CLYRA v1.0.0</small></aside></>;
}

export function AppShell({ current, title, eyebrow, description, sidebarOpen, setSidebarOpen, onNavigate, onSignOut, children }: { current:Screen; title:string; eyebrow?:string; description?:string; sidebarOpen:boolean; setSidebarOpen:(v:boolean)=>void; onNavigate:(screen:Screen)=>void; onSignOut:()=>void; children:React.ReactNode }) {
  return <main className="app-shell"><Sidebar current={current} open={sidebarOpen} onClose={()=>setSidebarOpen(false)} onNavigate={onNavigate} onSignOut={onSignOut}/><section className="workspace"><header className="mobile-header"><button className="icon-button" onClick={()=>setSidebarOpen(true)} aria-label="Open navigation"><Icon name="menu"/></button><span>CLYRA</span><Icon name="shield"/></header>{title&&<div className="workspace-topline"><div>{eyebrow&&<p className="eyebrow eyebrow--blue">{eyebrow}</p>}<h1>{title}</h1>{description&&<p>{description}</p>}</div><div className="profile-tools"><button className="icon-button" aria-label="Notifications"><Icon name="bell"/></button><span className="avatar">DU</span></div></div>}{children}</section></main>;
}

export function ProgressSteps({ active, complete=false }: { active:1|2|3; complete?:boolean }) {
  return <div className="steps" aria-label="Analysis progress">{["Upload","AI Analysis","Results"].map((label,index)=>{const number=index+1;const done=complete||number<active;return <div key={label} className={`step ${number<=active||complete?"active":""} ${done?"done":""}`}><span>{done?<Icon name="check" size={20}/>:number}</span><strong>{label}</strong></div>})}</div>;
}

export function MedicalDisclaimer() { return <p className="medical-note medical-note--footer"><Icon name="shield" size={20}/> AI-assisted decision support. Results require review by a qualified physician.</p>; }

export function ScanImage({ src, overlay=false, mask=false, alt }: { src:string; overlay?:boolean; mask?:boolean; alt:string }) {
  return <div className={`scan-image ${mask?"scan-image--mask":""}`}><img src={src} alt={alt}/>{(overlay||mask)&&<svg className="lesion-overlay" viewBox="0 0 100 100" aria-hidden="true"><path d="M61 42c6-4 12 1 13 8 2 8-3 17-9 20-5 2-11-2-12-8-1-6 2-16 8-20Z" fill={mask?"#f2231d":"rgba(247,50,48,.62)"} stroke={mask?"#ff342e":"rgba(255,115,105,.9)"} strokeWidth="1.2"/></svg>}</div>;
}
