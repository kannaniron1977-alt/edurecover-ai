import 'dotenv/config'; import express from 'express'; import cors from 'cors'; import Database from 'better-sqlite3'; import crypto from 'crypto';
import {GRAPH,PREREQ,REVISE,Q,STYLES,NOTES,COURSES,SEED,MASTER_MODULES} from './ai/kb.js'; import {interviewQ,interviewFeedback,diagnose,coach} from './ai/engine.js';
import {LESSONS} from './lessons_i18n.js';
import {COMPANY_SETS} from './ai/aptitude.js';
const db=new Database('edurecover.db');
db.exec('create table if not exists users(id integer primary key,name text,email text unique,pw text,role text,coins integer default 0,state text)');
db.exec('create table if not exists notes(id integer primary key,text text)');NOTES.text=db.prepare('select text from notes where id=1').get()?.text||'';
const app=express(); app.use(cors(),express.json()); const sess=new Map();
const hash=p=>crypto.scryptSync(p,'edu',32).toString('hex');
const fresh=()=>({mastery:{basic:90,fractions:80,equiv:70,commonden:60,add:30,sub:0,adv:0},mis:{},done:[],tasks:0,unlocked:[1],history:[],seen:[],used:[],active:0,minutes:0});
const mk=r=>{const s=fresh();if(r==='employee'){s.track='employee';s.unlocked=[4]}return s};
const load=id=>db.prepare('select * from users where id=?').get(id);
const S=u=>{const s=JSON.parse(u.state);if(!s.unlocked.includes(4))s.unlocked.push(4);return s}; const save=(u,s,coins=u.coins)=>{db.prepare('update users set state=?,coins=? where id=?').run(JSON.stringify(s),coins,u.id);u.coins=coins;};
const M=(s,id)=>s.mastery[id]??(id.startsWith('apt')?40:0);
const overall=s=>{const v=GRAPH.filter(n=>s.unlocked.includes(n.course)&&(s.track==='employee'?n.course===4:n.course<4)&&M(s,n.id)>0).map(n=>M(s,n.id));return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):0};
const graph=s=>GRAPH.map(n=>{const m=M(s,n.id),x=s.mis[n.id]||0;return {...n,mastery:m,mis:x,status:x>=2?'repeated':x>=1?'weak':m>=80?'mastered':m>0?'learning':'locked'}});
const view=u=>{const s=S(u);return {user:{id:u.id,name:u.name,role:u.role,coins:u.coins},state:s,overall:overall(s),graph:graph(s)}};
const task=(s,u)=>{s.tasks++; return s.tasks%2===0?u.coins+100:u.coins}; // 2 meaningful tasks => +100 coins (no streaks)
const auth=(req,res,next)=>{const id=sess.get(req.headers.authorization);if(!id)return res.status(401).json({error:'login'});req.u=load(id);if(!req.u)return res.status(401).json({error:'login'});next()};
const only=(...roles)=>(req,res,next)=>roles.includes(req.u.role)?next():res.status(403).json({error:'Not allowed'});
const ok=(u)=>{const t=crypto.randomUUID();sess.set(t,u.id);return {token:t,...view(u)}};

// ---- Roles ----
const PUBLIC_ROLES=['student','employee','interviewer']; // admin can NOT be self-registered
const LOGIN_GROUPS={student:['student','employee'],interviewer:['interviewer'],admin:['admin','teacher']};
const seedUser=(name,email,pw,role)=>{if(!db.prepare('select 1 from users where email=?').get(email))db.prepare('insert into users(name,email,pw,role,coins,state) values(?,?,?,?,?,?)').run(name,email,hash(pw),role,0,JSON.stringify(mk(role)))};
seedUser('Admin',process.env.ADMIN_EMAIL||'admin@edurecover.ai',process.env.ADMIN_PASSWORD||'Admin@123','admin');
seedUser('Interviewer','interviewer@edurecover.ai','Interview@123','interviewer');
seedUser('Alex Student','student@edurecover.ai','Student@123','student');

app.post('/api/signup',(req,res)=>{const {name,email,password}=req.body;const role=PUBLIC_ROLES.includes(req.body.role)?req.body.role:'student';
 if(!name||!email||!password)return res.status(400).json({error:'Fill all fields'});
 try{const i=db.prepare('insert into users(name,email,pw,role,coins,state) values(?,?,?,?,?,?)').run(name,email,hash(password),role,0,JSON.stringify(mk(role)));res.json(ok(load(i.lastInsertRowid)))}catch{res.status(400).json({error:'Email already used'})}});
app.post('/api/login',(req,res)=>{const u=db.prepare('select * from users where email=?').get(req.body.email);
 if(!u||u.pw!==hash(req.body.password||''))return res.status(400).json({error:'Invalid credentials'});
 const want=req.body.role; // 'student' | 'interviewer' | 'admin' (optional)
 if(want&&LOGIN_GROUPS[want]&&!LOGIN_GROUPS[want].includes(u.role))return res.status(403).json({error:`This account is not a ${want} account. Use the correct login tab.`});
 res.json(ok(u))});
app.get('/api/me',auth,(req,res)=>res.json(view(req.u)));
app.post('/api/lesson/done',auth,(req,res)=>{const s=S(req.u);const k='l'+(+req.body.course||1);if(!s.done.includes(k))s.done.push(k);const c=task(s,req.u);save(req.u,s,c);res.json(view(req.u))});
app.post('/api/next',auth,(req,res)=>{const s=S(req.u);const c=+req.body.course||1,pool=Q.filter(x=>x.course===c);let q=pool.find(x=>!s.seen.includes(x.id))||pool[s.seen.length%pool.length];s.seen.push(q.id);save(req.u,s);const {correct,probe,hint,explain,...pub}=q;res.json(pub)});
app.post('/api/answer',auth,async(req,res)=>{
 const {qid,choice,reasoning='',lang='en',retest}=req.body;const q=Q.find(x=>x.id===qid);if(!q||!choice)return res.status(400).json({error:'bad'});
 const s=S(req.u);const correct=choice===q.correct;const d=await diagnose({q,choice,reasoning:String(reasoning).slice(0,500),correct,lang});
 s.history.push({t:Date.now(),qid,choice,reasoning,diag:d,correct,retest:!!retest});
 const recovered=correct&&d.reasoningOk;let c=req.u.coins;
 if(recovered){s.mastery[q.concept]=Math.min(100,M(s,q.concept)+(retest?25:15));if(retest){s.mis[q.concept]=0;c=task(s,req.u)}}
 else {s.mis[q.concept]=(s.mis[q.concept]||0)+1;s.stage=1} // right answer + wrong reasoning is NOT mastery
 const pre=PREREQ[q.concept],rep=(s.mis[q.concept]||0)>=2;save(req.u,s,c);
 res.json({correct,diagnosis:d,recovered,probe:q.probe,repeated:rep,prereq:rep?{name:GRAPH.find(g=>g.id===pre)?.name,text:REVISE[pre]}:null,...view(req.u)})});
app.post('/api/coach',auth,async(req,res)=>{
 const {qid,stage=1,reply='',lang='en'}=req.body;const q=Q.find(x=>x.id===qid);const s=S(req.u);
 const last=[...s.history].reverse().find(h=>h.qid===qid);const style=STYLES[(s.mis[q.concept]||0)%STYLES.length]; // rotate intervention, never blind-repeat
 const r=await coach({q,stage:Math.min(3,stage),reply:String(reply).slice(0,400),style,lang,diag:last?.diag});
 const done=r.understood||stage>=3;const level=stage<=1?'High':stage===2?'Medium':'Low';
 if(done){s.used.push({concept:q.concept,style,level});save(req.u,s)}
 res.json({message:r.message,done,level,understood:r.understood})});
app.post('/api/unlock',auth,(req,res)=>{const s=S(req.u);const id=+req.body.id;const cost=1000;const o=overall(s);
 if(o>=80&&s.unlocked.includes(id-1)){s.unlocked.push(id);Object.assign(s.mastery,SEED[id]||{});save(req.u,s);return res.json(view(req.u))}
 if(req.u.coins>=cost){s.unlocked.push(id);Object.assign(s.mastery,SEED[id]||{});save(req.u,s,req.u.coins-cost);return res.json(view(req.u))}
 const weak=graph(s).filter(n=>n.status!=='mastered'&&n.status!=='locked').map(n=>n.name);res.status(400).json({error:`Need overall 80% (you: ${o}%) or ${cost} coins. Revisit: ${weak.join(', ')}`})});
app.get('/api/leaderboard',auth,(req,res)=>res.json(db.prepare("select name,coins,state from users where role in ('student','employee')").all().map(u=>({name:u.name,coins:u.coins,overall:overall(JSON.parse(u.state))})).sort((a,b)=>b.overall-a.overall).slice(0,10)));
app.get('/api/teacher',auth,only('teacher','admin'),(req,res)=>{const us=db.prepare("select * from users where role in ('student','employee')").all();
 res.json({analytics:{students:us.length,attempts:us.reduce((a,u)=>a+S(u).history.length,0),lessonsDone:us.reduce((a,u)=>a+S(u).done.length,0)},students:us.map(u=>{const s=S(u);return {name:u.name,overall:overall(s),graph:graph(s),history:s.history.slice(-5).reverse(),interventions:s.used}})})});
app.get('/api/notes',auth,(req,res)=>res.json({text:NOTES.text}));
app.post('/api/notes',auth,only('teacher','admin'),(req,res)=>{NOTES.text=String(req.body.text||'').slice(0,4000);db.prepare('insert or replace into notes(id,text) values(1,?)').run(NOTES.text);res.json({text:NOTES.text})});
app.get('/api/course/:id',auth,(req,res)=>{
 const id=COURSES[+req.params.id]?+req.params.id:1;
 const lang=String(req.query.lang||'en');
 const t=LESSONS[lang]?.[id];
 res.json(t?{...COURSES[id],...t}:COURSES[id]); // translation illana English
});
app.post('/api/interview/q',auth,async(req,res)=>res.json({q:await interviewQ(String(req.body.role).slice(0,60),+req.body.n||0,req.body.lang||'en')}));
app.post('/api/interview/fb',auth,async(req,res)=>{const {role,q,answer,lang}=req.body;const f=await interviewFeedback(String(role).slice(0,60),String(q).slice(0,300),String(answer).slice(0,1500),lang||'en');const s=S(req.u);(s.iv=s.iv||[]).push({role,q,score:f.score,t:Date.now()});save(req.u,s);res.json(f)});

// ---- Interviewer: candidates + their mock-interview results ----
app.get('/api/interviewer/candidates',auth,only('interviewer','admin'),(req,res)=>{
 const us=db.prepare("select * from users where role in ('student','employee')").all();
 res.json(us.map(u=>{const s=S(u);const iv=s.iv||[];const avg=iv.length?Math.round(iv.reduce((a,b)=>a+(+b.score||0),0)/iv.length*10)/10:null;
  return {id:u.id,name:u.name,email:u.email,overall:overall(s),interviews:iv.length,avgScore:avg,recent:iv.slice(-5).reverse()}}))});

// ---- Admin: manage users ----
app.get('/api/admin/users',auth,only('admin'),(req,res)=>res.json(db.prepare('select id,name,email,role,coins from users order by id').all()));
app.post('/api/admin/role',auth,only('admin'),(req,res)=>{const {id,role}=req.body;
 if(!['student','interviewer','teacher','admin'].includes(role))return res.status(400).json({error:'bad role'});
 if(+id===req.u.id)return res.status(400).json({error:"You can't change your own role"});
 db.prepare('update users set role=? where id=?').run(role,+id);res.json({ok:true})});
app.delete('/api/admin/users/:id',auth,only('admin'),(req,res)=>{
 if(+req.params.id===req.u.id)return res.status(400).json({error:"You can't delete yourself"});
 db.prepare('delete from users where id=?').run(+req.params.id);res.json({ok:true})});

app.post('/api/tick',auth,(req,res)=>{const s=S(req.u);s.minutes=(s.minutes||0)+Math.min(60,+req.body.sec||0)/60;save(req.u,s);res.json({})});
app.post('/api/chat',auth,async(req,res)=>{
 try{
  const message=String(req.body.message||'').slice(0,1000);
  if(!message)return res.status(400).json({reply:'Empty message'});
  const s=S(req.u);
  const weak=graph(s).filter(n=>n.status==='weak'||n.status==='repeated').map(n=>n.name).join(', ')||'none yet';
  const system=`You are EduRecover AI, a friendly study coach for ${req.u.name}. Weak topics: ${weak}. Overall mastery: ${overall(s)}%. Explain simply, keep answers short, reply in the language the student writes (Tanglish is fine), and end with one practice question.`;
  const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},body:JSON.stringify({system_instruction:{parts:[{text:system}]},contents:[{role:'user',parts:[{text:message}]}]})});
  const data=await r.json();
  const reply=data?.candidates?.[0]?.content?.parts?.[0]?.text;
  res.json({reply:reply||'AI error: '+JSON.stringify(data.error||data)});
 }catch(e){res.status(500).json({reply:'Server error, thirumba try pannunga.'})}
});
// ---- Master quiz: revision summary + final quiz with High/Medium/Low level ----
const trackCourses=s=>s.track==='employee'?[4]:[1,2,3];
const levelOf=p=>p>=80?'High':p>=50?'Medium':'Low';

// Revision summary video content (all modules in one lesson-shaped object)
app.get('/api/master/summary',auth,(req,res)=>{
 const s=S(req.u),lang=String(req.query.lang||'en'),ids=trackCourses(s);
 const parts=ids.map(id=>({...COURSES[id],...(LESSONS[lang]?.[id]||{})}));
 res.json({
  title:'Revision: All Modules',
  lesson:'Quick summary before your Master Quiz',
  intro:parts.map(p=>p.title).join(' | '),
  sections:parts.flatMap(p=>[`${p.lesson}`,...(p.sections||[])]),
  modules:s.track==='employee'?[MASTER_MODULES[3]]:MASTER_MODULES.filter((x,i)=>i<3||i===4)
 })});

// Master quiz questions (answers stripped)
app.get('/api/master/quiz',auth,(req,res)=>{
 const s=S(req.u),ids=trackCourses(s);
 const pool=Q.filter(x=>ids.includes(x.course)).slice(0,10);
 res.json(pool.map(({correct,probe,hint,explain,...pub})=>pub))});

// Submit: body {answers:{[qid]:choice}}
app.post('/api/master/submit',auth,(req,res)=>{
 const s=S(req.u),ans=req.body.answers||{},ids=trackCourses(s);
 const pool=Q.filter(x=>ids.includes(x.course)).slice(0,10);
 let right=0;const wrong=new Set();
 pool.forEach(q=>{if(ans[q.id]===q.correct)right++;else wrong.add(q.concept)});
 const percent=pool.length?Math.round(right/pool.length*100):0,level=levelOf(percent);
 const weakTopics=[...wrong].map(id=>GRAPH.find(g=>g.id===id)?.name).filter(Boolean);
 s.master={percent,level,right,total:pool.length,weakTopics,t:Date.now()};
 (s.masterHistory=s.masterHistory||[]).push(s.master);
 save(req.u,s);
 res.json({percent,level,right,total:pool.length,weakTopics,...view(req.u)})});
// ---- Resume analyzer ----
app.post('/api/resume/analyze',auth,async(req,res)=>{
 const text=String(req.body.text||'').slice(0,6000),role=String(req.body.role||'Software Engineer').slice(0,80);
 if(text.length<80)return res.status(400).json({error:'Paste your full resume text first'});
 const words=text.split(/\s+/).length;
 const checks=[['Email',/[\w.+-]+@[\w-]+\.[\w.]+/.test(text)],['Phone number',/\d{10}/.test(text.replace(/[\s-]/g,''))],['Education',/education|b\.?tech|b\.?e\b|degree|university|college/i.test(text)],['Skills section',/skills/i.test(text)],['Projects',/projects?/i.test(text)],['Experience / Internship',/experience|intern/i.test(text)],['Numbers / impact',/\d+\s?%|\d+\+/.test(text)],['Enough detail (150+ words)',words>=150]];
 const atsScore=Math.round(checks.filter(c=>c[1]).length/checks.length*100);
 let ai=null;
 try{
  const prompt=`Review this resume for the role "${role}". Reply ONLY JSON: {"summary":"2 lines","strengths":["..."],"improvements":["..."],"missingKeywords":["..."]} with max 4 items per list.\n\nRESUME:\n${text}`;
  const r=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},body:JSON.stringify({contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json'}})});
  const d=await r.json();ai=JSON.parse(d?.candidates?.[0]?.content?.parts?.[0]?.text||'null');
 }catch(e){console.error('Resume AI error:',e)}
 res.json({atsScore,checks:checks.map(([name,pass])=>({name,pass})),ai})});

// ---- Timed mock test (company-wise) ----
app.get('/api/aptitude/companies',auth,(req,res)=>res.json(Object.entries(COMPANY_SETS).map(([id,c])=>({id,name:c.name,minutes:c.minutes,count:c.questions.length,negative:c.negative}))));
app.post('/api/aptitude/start',auth,(req,res)=>{const c=COMPANY_SETS[req.body.company];if(!c)return res.status(400).json({error:'Unknown test'});
 const s=S(req.u);s.mockActive={company:req.body.company,start:Date.now()};save(req.u,s);
 const questions=[...c.questions].sort(()=>Math.random()-.5).map(({correct,...pub})=>pub);
 res.json({name:c.name,minutes:c.minutes,negative:c.negative,questions})});
app.post('/api/aptitude/submit',auth,(req,res)=>{
 const s=S(req.u),a=s.mockActive;if(!a)return res.status(400).json({error:'No active test. Start again.'});
 const c=COMPANY_SETS[a.company];
 if(Date.now()-a.start>c.minutes*60000+30000){delete s.mockActive;save(req.u,s);return res.status(400).json({error:'Time over. Start a new test.'})}
 const ans=req.body.answers||{};let right=0,wrong=0,skipped=0;
 const review=c.questions.map(q=>{const y=ans[q.id];if(!y)skipped++;else if(y===q.correct)right++;else wrong++;return {id:q.id,text:q.text,yours:y||'-',correct:q.correct}});
 const total=c.questions.length,score=Math.round((right-wrong*c.negative)*100)/100,percent=Math.max(0,Math.round(score/total*100));
 (s.mocks=s.mocks||[]).push({company:a.company,score,total,percent,t:Date.now()});delete s.mockActive;save(req.u,s);
 res.json({name:c.name,right,wrong,skipped,score,total,percent,review})});

app.listen(process.env.PORT||3001,()=>console.log('API on :3001'));