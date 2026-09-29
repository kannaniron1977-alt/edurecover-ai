import {useState} from 'react';
import {api} from '../api';
export default function Resume(){
 const [text,setText]=useState(''),[role,setRole]=useState('Software Engineer'),[r,setR]=useState(null),[busy,setBusy]=useState(false),[err,setErr]=useState('');
 const go=async()=>{setBusy(true);setErr('');setR(null);try{setR(await api('/resume/analyze',{text,role}))}catch(e){setErr(e.message||'Error')}setBusy(false)};
 const List=({t,a})=>a?.length>0&&<div className="msg"><b>{t}</b><ul>{a.map((x,i)=><li key={i}>{x}</li>)}</ul></div>;
 return <div className="card"><h3>Resume Analyzer</h3>
  <input placeholder="Target role (eg. Software Engineer)" value={role} onChange={e=>setRole(e.target.value)}/>
  <textarea rows="10" placeholder="Paste your resume text here..." value={text} onChange={e=>setText(e.target.value)}/>
  <button className="btn" disabled={busy||text.length<80} onClick={go}>{busy?'Analyzing...':'Analyze Resume'}</button>
  {err&&<p className="warn">{err}</p>}
  {r&&<div><p style={{fontSize:28}}>ATS score: {r.atsScore}%</p>
   {r.checks.map(c=><div key={c.name}>{c.pass?'✅':'❌'} {c.name}</div>)}
   {r.ai&&<div><div className="msg">{r.ai.summary}</div><List t="Strengths" a={r.ai.strengths}/><List t="Improve" a={r.ai.improvements}/><List t="Missing keywords" a={r.ai.missingKeywords}/></div>}</div>}</div>}
   