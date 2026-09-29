import {useEffect,useState} from 'react';import {Routes,Route,NavLink,Navigate} from 'react-router-dom';import {api} from './api';import {useLang,LangSelect} from './i18n.jsx';
import Login from './pages/Login';import Dashboard from './pages/Dashboard';import Learn from './pages/Learn';import ConceptMap from './pages/ConceptMap';import Teacher from './pages/Teacher';import Coaching from './pages/Coaching';import Bank from './pages/InterviewBank';import Mock from './pages/Interview';import Coins from './pages/Coins';import Analytics from './pages/Analytics';import LearningPath from './pages/LearningPath';
import DailyTasks from './pages/DailyTasks';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AIChat from './pages/AIChat';
import Resume from './pages/Resume';
import AptitudeTest from './pages/AptitudeTest';
export default function App(){
 const {t}=useLang();
 const [me,setMe]=useState(null);const [ready,setReady]=useState(false);
 useEffect(()=>{localStorage.token?api('/me').then(setMe).catch(()=>{delete localStorage.token}).finally(()=>setReady(true)):setReady(true)},[]);
 if(!ready)return null;if(!me)return <Login onIn={setMe}/>;
 const teach=['teacher','admin'].includes(me.user.role);
 return <div><nav className="side"><div className="logo"><i>E</i>EduRecover AI</div>
  {!teach&&<><NavLink to="/" end>{t('dash')}</NavLink><NavLink to="/learn">{t('courses')}</NavLink><NavLink to="/map">{t('map')}</NavLink><NavLink to="/analytics">{t('ana')}</NavLink><NavLink to="/coins">{t('rewards')}</NavLink><div style={{color:'#d4af37',fontSize:11,margin:'10px 14px 2px'}}>{t('career')}</div><NavLink to="/learn?course=4">{t('aptitude')}</NavLink><NavLink to="/aptitude-test">Aptitude Test</NavLink><NavLink to="/bank">{t('ivq')}</NavLink><NavLink to="/mock">{t('mock')}</NavLink><NavLink to="/coaching">{t('coaching')}</NavLink><NavLink to="/resume">Resume</NavLink><NavLink to="/chat">{t('chat')}</NavLink></>}
  {teach&&<NavLink to="/teacher">{t('teach')}</NavLink>}
  {!teach&&<><NavLink to="/path">{t('path')}</NavLink><NavLink to="/daily">{t('daily')}</NavLink><NavLink to="/leaderboard">{t('board')}</NavLink><NavLink to="/profile">{t('profile')}</NavLink><NavLink to="/settings">{t('settings')}</NavLink></>}
  <LangSelect/>
  <button onClick={()=>{delete localStorage.token;setMe(null)}}>{t('out')}</button><div className="foot">{me.user.coins} {t('coins')}</div></nav>
  <div className="main"><div className="top"><div><h2 style={{margin:0}}>{t('hi')}, {me.user.name}</h2><small>{t('tagline')}</small></div><span className="pill">{me.user.coins}</span></div>
  <Routes><Route path="/path" element={<LearningPath/>}/><Route path="/daily" element={<DailyTasks/>}/><Route path="/leaderboard" element={<Leaderboard me={me.user}/>}/><Route path="/profile" element={<Profile me={me.user} full={me}/>}/><Route path="/settings" element={<Settings/>}/><Route path="/" element={teach?<Navigate to="/teacher"/>:<Dashboard me={me} setMe={setMe}/>}/>
   <Route path="/learn" element={<Learn me={me} setMe={setMe}/>}/><Route path="/map" element={<ConceptMap graph={me.state.track==='employee'?me.graph.filter(n=>n.course===4):me.graph}/>}/><Route path="/analytics" element={<Analytics me={me}/>}/><Route path="/coins" element={<Coins me={me}/>}/><Route path="/bank" element={<Bank/>}/><Route path="/mock" element={<Mock/>}/><Route path="/aptitude-test" element={<AptitudeTest/>}/><Route path="/coaching" element={<Coaching me={me}/>}/><Route path="/chat" element={<AIChat/>}/><Route path="/resume" element={<Resume/>}/><Route path="/teacher" element={<Teacher/>}/></Routes></div></div>}