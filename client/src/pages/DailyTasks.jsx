import {useState} from 'react';
const TASKS=[['Complete 1 lesson',20],['Answer 3 quiz questions with reasons',30],['Fix 1 misconception with AI coaching',50]];
export default function DailyTasks(){
 const key='tasks_'+new Date().toDateString();
 const [done,setDone]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))||[]}catch{return []}});
 const toggle=i=>{const n=done.includes(i)?done.filter(x=>x!==i):[...done,i];setDone(n);try{localStorage.setItem(key,JSON.stringify(n))}catch{}};
 const coins=done.reduce((s,i)=>s+TASKS[i][1],0);
 return <div><h2>Daily Tasks</h2><p>Innaikku {done.length}/{TASKS.length} done <span className="tag">+{coins} coins</span></p>
 <div style={{height:10,borderRadius:6,background:'#2a2210',overflow:'hidden',marginBottom:16}}><div style={{height:'100%',width:(done.length/TASKS.length*100)+'%',background:'#d4af37',transition:'width .4s'}}/></div>
 {TASKS.map(([t,c],i)=><label key={i} className={'opt'+(done.includes(i)?' on':'')}><input type="checkbox" style={{width:'auto'}} checked={done.includes(i)} onChange={()=>toggle(i)}/> {t} <span className="tag">+{c}</span></label>)}</div>}