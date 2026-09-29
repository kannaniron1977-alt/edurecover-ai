import {useState} from 'react';import {api} from '../api';import Camera from '../components/Camera';
export default function Login({onIn}){
 const [mode,setMode]=useState('login');const [f,setF]=useState({name:'',email:'',password:'',role:'student'});const [err,setErr]=useState('');const [pending,setPending]=useState(null);const [present,setPresent]=useState(false);
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const go=async()=>{try{const r=await api(mode==='login'?'/login':'/signup',f);localStorage.token=r.token;!['teacher','admin'].includes(r.user.role)?setPending(r):onIn(r)}catch(e){setErr(e.message)}};
 if(pending)return <div className="main" style={{maxWidth:460,margin:'40px auto'}}><div className="card"><h2>Presence Verification</h2><Camera onChange={setPresent}/><button className="btn" disabled={!present} onClick={()=>onIn(pending)}>{present?'Presence detected - Enter Dashboard':'Waiting for presence...'}</button></div></div>;
 return <div className="main" style={{maxWidth:420,margin:'40px auto'}}><div className="card"><h2>EduRecover AI</h2><p>Learn. Understand. Improve. Unlock.</p>
  {mode==='signup'&&<input placeholder="Full name" value={f.name} onChange={set('name')}/>}
  <input placeholder="Email" value={f.email} onChange={set('email')}/><input type="password" placeholder="Password" value={f.password} onChange={set('password')}/>
  {mode==='signup'&&<select value={f.role} onChange={set('role')}><option>student</option><option value="employee">employee (job seeker)</option><option>teacher</option><option>admin</option></select>}
  <p className="warn">{err}</p><button className="btn" onClick={go}>{mode==='login'?'Login':'Create account'}</button>
  <p><a href="#" onClick={e=>{e.preventDefault();setMode(mode==='login'?'signup':'login')}}>{mode==='login'?'New here? Sign up':'Have an account? Login'}</a></p></div></div>}
