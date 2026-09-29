import {useEffect,useState} from 'react';
import {api} from '../api';
export default function AptitudeTest(){
 const [list,setList]=useState([]),[test,setTest]=useState(null),[ans,setAns]=useState({}),[left,setLeft]=useState(0),[res,setRes]=useState(null),[busy,setBusy]=useState(false),[err,setErr]=useState('');
 useEffect(()=>{api('/aptitude/companies').then(setList).catch(()=>{})},[]);
 const start=async id=>{setErr('');try{const t=await api('/aptitude/start',{company:id});setTest(t);setAns({});setRes(null);setLeft(t.minutes*60)}catch(e){setErr(e.message||'Error')}};
 const submit=async()=>{if(busy||!test)return;setBusy(true);try{const r=await api('/aptitude/submit',{answers:ans});setRes(r)}catch(e){setErr(e.message||'Error')}setBusy(false);setTest(null)};
 useEffect(()=>{if(!test)return;const i=setInterval(()=>setLeft(x=>x-1),1000);return()=>clearInterval(i)},[test]);
 useEffect(()=>{if(test&&left<=0)submit()},[left,test]);
 const L=Math.max(0,left),clock=Math.floor(L/60)+':'+String(L%60).padStart(2,'0');
 if(test)return <div className="card"><h3>{test.name} <span className="tag">{clock} left</span></h3>
  <p><small>+1 correct, -{test.negative} wrong, 0 skipped. Auto-submits when time ends.</small></p>
  {test.questions.map((x,i)=><div key={x.id} style={{marginBottom:18}}><p style={{fontSize:18}}>{i+1}. {x.text}</p>
   {x.options.map(o=><label key={o} className={'opt'+(ans[x.id]===o?' on':'')}><input type="radio" style={{width:'auto'}} checked={ans[x.id]===o} onChange={()=>setAns(a=>({...a,[x.id]:o}))}/> {o}</label>)}</div>)}
  <button className="btn" disabled={busy} onClick={submit}>{busy?'Checking...':'Submit Test'}</button></div>;
 if(res)return <div className="card"><h3>{res.name} - Result</h3>
  <p style={{fontSize:28}}>{res.score} / {res.total} <span className="tag">{res.percent}%</span></p>
  <p>Right {res.right} | Wrong {res.wrong} | Skipped {res.skipped}</p>
  {res.review.map((r,i)=><div className="msg" key={r.id}>{i+1}. {r.text}<br/><b>Your answer:</b> {r.yours} | <b>Correct:</b> {r.correct}</div>)}
  <button className="btn" onClick={()=>setRes(null)}>Back to tests</button></div>;
 return <div className="card"><h3>Company-wise Timed Mock Tests</h3>{err&&<p className="warn">{err}</p>}
  {list.map(c=><div className="msg" key={c.id}><b>{c.name}</b> - {c.count} questions, {c.minutes} min, negative marking -{c.negative}<br/><button className="btn" onClick={()=>start(c.id)}>Start Test</button></div>)}</div>}