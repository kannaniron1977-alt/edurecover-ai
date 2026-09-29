import {useState} from 'react';import {api} from '../api';import Camera from '../components/Camera';
const ROLES=['Software Developer','Data Analyst','Customer Support','Sales Executive','Fresher (General HR)'],N=5;
export default function Interview(){
 const [role,setRole]=useState(ROLES[0]),[n,setN]=useState(-1),[q,setQ]=useState(''),[a,setA]=useState(''),[fb,setFb]=useState(null),[sc,setSc]=useState([]),[present,setPresent]=useState(true),[busy,setBusy]=useState(false);const lang=localStorage.lang||'en';
 const speak=t=>{try{speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(t))}catch{}};
 const ask=async i=>{setBusy(true);const r=await api('/interview/q',{role,n:i,lang});setQ(r.q);setN(i);setA('');setFb(null);setBusy(false);speak(r.q)};
 const mic=()=>{const R=window.webkitSpeechRecognition||window.SpeechRecognition;if(!R)return alert('Speech input works in Chrome');const r=new R();r.lang='en-IN';r.onresult=e=>setA(x=>x+' '+e.results[0][0].transcript);r.start()};
 const submit=async()=>{setBusy(true);const r=await api('/interview/fb',{role,q,answer:a,lang});setFb(r);setSc(s=>[...s,r.score]);setBusy(false)};
 return <div>{!present&&<div className="overlay"><h2>Presence Verification Required</h2><p>Please return to the interview.</p></div>}
 {n>=0&&n<N&&<Camera onChange={setPresent}/>}
 {n<0&&<div className="card"><h3> Mock Interview</h3><p>5 questions, AI feedback on structure, specifics and clarity. Camera is used only for presence.</p><select value={role} onChange={e=>{setRole(e.target.value);setSc([])}}>{ROLES.map(r=><option key={r}>{r}</option>)}</select><button className="btn" onClick={()=>{setSc([]);ask(0)}}>Start Interview</button></div>}
 {n>=0&&n<N&&<div className="card"><span className="tag">Question {n+1}/{N} · {role}</span><h3>{q}</h3><button className="btn" onClick={()=>speak(q)}>🔊 Read aloud</button> <button className="btn" onClick={mic}>🎤 Speak answer</button>
  <textarea rows="5" placeholder="Type or speak your answer (use STAR)..." value={a} onChange={e=>setA(e.target.value)}/>
  {!fb?<button className="btn" disabled={busy||a.length<10} onClick={submit}>{busy?'Evaluating...':'Submit answer'}</button>:<div><div className="msg"><b>Score {fb.score}/10</b><br/>✅ {fb.strengths}<br/>🔧 {fb.improve}<br/>💡 {fb.better}</div><button className="btn" onClick={()=>n+1<N?ask(n+1):setN(N)}>{n+1<N?'Next question →':'Finish'}</button></div>}</div>}
 {n>=N&&<div className="card"><h3>Interview complete</h3><div className="big">{(sc.reduce((x,y)=>x+y,0)/sc.length).toFixed(1)}/10</div><p>Scores: {sc.join(', ')}. Review weak answers in the Question Bank and retry.</p><button className="btn" onClick={()=>setN(-1)}>Try again</button></div>}</div>}
