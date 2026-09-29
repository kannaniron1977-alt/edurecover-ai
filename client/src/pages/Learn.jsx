import {useEffect,useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {api} from '../api';
import Camera from '../components/Camera';
import LessonPlayer from '../components/LessonPlayer';
import QuizVisual from '../components/QuizVisual';
import {useLang} from '../i18n.jsx';
export default function Learn({me,setMe}){
 const {lang}=useLang();const [sp]=useSearchParams();const master=sp.get('master')==='1';const course=+sp.get('course')||1;const [C,setC]=useState(null);
 useEffect(()=>{setC(null);setStep('intro');setWatched(false);setMi(0);api(master?'/master/summary?lang='+lang:'/course/'+course+'?lang='+lang).then(setC)},[course,master,lang]);
 const [step,setStep]=useState('intro');const [present,setPresent]=useState(true);
 const [q,setQ]=useState(null),[ch,setCh]=useState(''),[rs,setRs]=useState(''),[res,setRes]=useState(null),[stage,setStage]=useState(1),[msgs,setMsgs]=useState([]),[reply,setReply]=useState(''),[t,setT]=useState(120),[warn,setWarn]=useState(0),[rt,setRt]=useState(false),[level,setLevel]=useState(''),[busy,setBusy]=useState(false);
 const [seen,setSeen]=useState([]);const [watched,setWatched]=useState(false);const [mi,setMi]=useState(0);
 const [mq,setMq]=useState([]),[ans,setAns]=useState({}),[mr,setMr]=useState(null);
 const inQuiz=step==='quiz';
 useEffect(()=>{if(!['lesson','quiz','mquiz'].includes(step))return;const i=setInterval(()=>{if(present)api('/tick',{sec:30})},30000);return()=>clearInterval(i)},[step,present]);
 useEffect(()=>{if(!inQuiz)return;const i=setInterval(()=>setT(x=>present?Math.max(0,x-1):x),1000);const v=()=>document.hidden&&setWarn(w=>w+1);document.addEventListener('visibilitychange',v);return()=>{clearInterval(i);document.removeEventListener('visibilitychange',v)}},[inQuiz,q,present]);
 const start=async(retest)=>{const n=await api('/next',{course,avoid:seen});setSeen(s=>[...s,n.id]);setQ(n);setCh('');setRs('');setT(120);setRt(retest);setStep('quiz')};
 const onMulti=()=>{if(step==='mquiz'){setMq([]);setAns({});setStep('intro');alert('Another face detected. Master quiz stopped. Start again.');return}
  if(step!=='quiz')return;setQ(null);setCh('');setRs('');setStep('unlocked');alert('Another face detected. Quiz stopped. Start again for new questions.')};
 const done=async()=>{setMe(await api('/lesson/done',{course}));setStep('unlocked')};
 const startMaster=async()=>{setMq(await api('/master/quiz'));setAns({});setStep('mquiz')};
 const submitMaster=async()=>{setBusy(true);const r=await api('/master/submit',{answers:ans});setMe(r);setMr(r);setBusy(false);setStep('mresult')};
 const submit=async()=>{setBusy(true);const r=await api('/answer',{qid:q.id,choice:ch,reasoning:rs,lang,retest:rt});setMe(r);setRes(r);setBusy(false);
  if(r.recovered&&rt)setStep('recovered');else if(r.recovered)setStep('recoveredFirst');else{setStage(1);setMsgs([{a:'ai',t:r.probe}]);setStep('coach')}};
 const send=async()=>{setBusy(true);setMsgs(m=>[...m,{a:'me',t:reply}]);const r=await api('/coach',{qid:q.id,stage,reply,lang});setReply('');setBusy(false);setMsgs(m=>[...m,{a:'ai',t:r.message}]);if(r.done){setLevel(r.level);setStep('ready')}else setStage(stage+1)};
 if(!C)return null;if(!master&&!me.state.unlocked.includes(course))return <div className="card">This course is locked. Unlock it from the Dashboard (80% mastery or 1000 coins).</div>;
 const mods=C.modules&&C.modules.length?C.modules:[{title:C.lesson,sections:C.sections}];const M=mods[mi]||mods[0];const last=mi>=mods.length-1;
 const allAnswered=mq.length>0&&mq.every(x=>ans[x.id]);
 return <div>{!present&&<div className="overlay"><h2>Presence Verification Required</h2><p>Please return to the learning session.</p></div>}
 {(step==='intro'||step==='lesson'||step==='quiz'||step==='mquiz')&&<Camera onChange={setPresent} onMulti={onMulti}/>}
 {step==='intro'&&<div className="card"><h2>{C.title}</h2><p>{C.intro}</p><button className="btn" onClick={()=>setStep('lesson')}>{master?'Start Revision':'Start Learning'}</button></div>}
 {step==='lesson'&&<div className="card"><h3>{master?'Revision':'Module'} {mi+1}/{mods.length} - {M.title}</h3>
  <LessonPlayer key={mi} kind={!master&&course===1&&mi===0?'fraction':'generic'} title={M.title} sections={M.sections} present={present} onFinish={()=>setWatched(true)}/>
  <button className="btn" style={{marginTop:12}} disabled={!present||!watched} onClick={()=>{if(!last){setMi(mi+1);setWatched(false)}else if(master)startMaster();else done()}}>{!last?'Next Module':master?'Start Master Quiz':'Complete Lesson'}</button></div>}
 {step==='mquiz'&&<div className="card"><h3>Master Quiz <span className="tag">{Object.keys(ans).length}/{mq.length} answered</span></h3>
  <p className="warn">{warn>0&&`Controlled mode: you left the tab ${warn} time(s). This is logged.`}</p>
  {mq.map((x,i)=><div key={x.id} style={{marginBottom:18}}><p style={{fontSize:18}}>{i+1}. {x.text}</p><QuizVisual q={x}/>
   {x.options.map(o=><label key={o} className={'opt'+(ans[x.id]===o?' on':'')}><input type="radio" style={{width:'auto'}} checked={ans[x.id]===o} onChange={()=>setAns(a=>({...a,[x.id]:o}))}/> {o}</label>)}</div>)}
  <button className="btn" disabled={!allAnswered||!present||busy} onClick={submitMaster}>{busy?'Checking...':'Submit Master Quiz'}</button></div>}
 {step==='mresult'&&mr&&<div className="card"><h3>Master Quiz Result</h3>
  <p style={{fontSize:28}}>{mr.percent}% <span className="tag">Level: {mr.level}</span></p>
  <p>{mr.right} / {mr.total} correct</p>
  {mr.weakTopics?.length>0&&<div className="msg"><b>Revise these topics:</b> {mr.weakTopics.join(', ')}</div>}
  <button className="btn" onClick={()=>{setStep('intro');setWatched(false);setMi(0)}}>Retake (revise again)</button></div>}
 {step==='unlocked'&&<div className="card"><h3>Lesson Completed ✓ Quiz Unlocked</h3><button className="btn" onClick={()=>start(false)}>Start Quiz</button></div>}
 {inQuiz&&q&&<div className="card"><h3>{rt?'Retest (new question)':'Quiz'} <span className="tag">{t}s left</span></h3><p className="warn">{warn>0&&`Controlled mode: you left the quiz tab ${warn} time(s). This is logged for the teacher.`}</p>
  <p style={{fontSize:20}}>{q.text}</p><QuizVisual q={q}/>{q.options.map(o=><label key={o} className={'opt'+(ch===o?' on':'')}><input type="radio" style={{width:'auto'}} checked={ch===o} onChange={()=>setCh(o)}/> {o}</label>)}
  <input maxLength={140} placeholder="Explain WHY in one line (required)..." value={rs} onChange={e=>setRs(e.target.value)}/><button className="btn" disabled={!ch||rs.trim().split(/\s+/).length<4||!present||t===0||busy} onClick={submit}>{busy?'Analyzing...':'Submit'}</button>{t===0&&<p className="warn">Time is up.</p>}</div>}
 {step==='coach'&&res&&<div className="card"><h3>{res.correct?'Your answer is right, but your reasoning needs work':'Not quite'}</h3><p><span className="tag">{res.diagnosis.label}</span> {res.diagnosis.misconception} (confidence {Math.round(res.diagnosis.confidence*100)}%)</p>
  {res.prereq&&<div className="msg"><b>Repeated mistake - revise prerequisite: {res.prereq.name}</b><br/>{res.prereq.text}</div>}
  {msgs.map((m,i)=><div key={i} className={'msg '+(m.a==='me'?'me':'')}>{m.t}</div>)}
  <textarea rows="2" placeholder="Think and reply..." value={reply} onChange={e=>setReply(e.target.value)}/><button className="btn" disabled={busy||!reply} onClick={send}>{busy?'...':'Reply'}</button> <small>Coaching stage {stage}/3</small></div>}
 {step==='ready'&&<div className="card"><h3>Coaching finished - learning level: {level}</h3>{msgs.slice(-1).map((m,i)=><div className="msg" key={i}>{m.t}</div>)}<p>Now a fresh question to check independent understanding.</p><button className="btn" onClick={()=>start(true)}>Start Retest</button></div>}
 {(step==='recovered'||step==='recoveredFirst')&&<div className="card"><h3>{step==='recovered'?'Misconception recovered ✓':'Correct reasoning ✓'}</h3><p>Learner state updated. Check your Concept Map and coins.</p></div>}</div>}