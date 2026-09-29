import {useEffect,useRef,useState} from 'react';
import {useLang} from '../i18n.jsx';

const G='#d4af37';
const CODES={en:'en-IN',ta:'ta-IN',hi:'hi-IN',te:'te-IN',kn:'kn-IN',ml:'ml-IN',bn:'bn-IN'};

const LBL={
 en:{scene:'Scene',play:'▶ Play lesson',pause:'⏸ Pause',resume:'▶ Resume',replay:'↻ Replay',paused:'Paused',pausedMsg:'Face not verified. Come back and the video will continue.',whole:'1 whole = 4 equal parts',num:'3 = parts we have (numerator)',den:'4 = size of the parts (denominator)',same:'Same coloured length = same value'},
 ta:{scene:'காட்சி',play:'▶ பாடத்தை இயக்கு',pause:'⏸ இடைநிறுத்து',resume:'▶ தொடர்',replay:'↻ மீண்டும்',paused:'இடைநிறுத்தப்பட்டது',pausedMsg:'முகம் சரிபார்க்கப்படவில்லை. திரும்பி வாருங்கள், வீடியோ தொடரும்.',whole:'1 முழுமை = 4 சம பாகங்கள்',num:'3 = நம்மிடம் உள்ள பாகங்கள் (தொகுதி)',den:'4 = பாகங்களின் அளவு (பகுதி)',same:'ஒரே நிற நீளம் = ஒரே மதிப்பு'},
 hi:{scene:'दृश्य',play:'▶ पाठ चलाएँ',pause:'⏸ रोकें',resume:'▶ जारी रखें',replay:'↻ फिर चलाएँ',paused:'रुका हुआ',pausedMsg:'चेहरा सत्यापित नहीं हुआ। वापस आइए, वीडियो जारी रहेगा।',whole:'1 पूर्ण = 4 बराबर हिस्से',num:'3 = हमारे पास हिस्से (अंश)',den:'4 = हिस्सों का आकार (हर)',same:'समान रंग की लंबाई = समान मान'},
 te:{scene:'దృశ్యం',play:'▶ పాఠం ప్లే చేయండి',pause:'⏸ ఆపండి',resume:'▶ కొనసాగించండి',replay:'↻ మళ్లీ',paused:'ఆపబడింది',pausedMsg:'ముఖం ధృవీకరించబడలేదు. తిరిగి రండి, వీడియో కొనసాగుతుంది.',whole:'1 పూర్ణం = 4 సమాన భాగాలు',num:'3 = మన వద్ద ఉన్న భాగాలు (లవం)',den:'4 = భాగాల పరిమాణం (హారం)',same:'ఒకే రంగు పొడవు = ఒకే విలువ'},
 kn:{scene:'ದೃಶ್ಯ',play:'▶ ಪಾಠ ಪ್ಲೇ ಮಾಡಿ',pause:'⏸ ನಿಲ್ಲಿಸಿ',resume:'▶ ಮುಂದುವರಿಸಿ',replay:'↻ ಮತ್ತೆ',paused:'ನಿಲ್ಲಿಸಲಾಗಿದೆ',pausedMsg:'ಮುಖ ಪರಿಶೀಲನೆ ಆಗಿಲ್ಲ. ಹಿಂತಿರುಗಿ, ವೀಡಿಯೊ ಮುಂದುವರಿಯುತ್ತದೆ.',whole:'1 ಪೂರ್ಣ = 4 ಸಮಾನ ಭಾಗಗಳು',num:'3 = ನಮ್ಮ ಬಳಿ ಇರುವ ಭಾಗಗಳು (ಅಂಶ)',den:'4 = ಭಾಗಗಳ ಗಾತ್ರ (ಛೇದ)',same:'ಒಂದೇ ಬಣ್ಣದ ಉದ್ದ = ಒಂದೇ ಬೆಲೆ'},
 ml:{scene:'ദൃശ്യം',play:'▶ പാഠം പ്ലേ ചെയ്യുക',pause:'⏸ നിർത്തുക',resume:'▶ തുടരുക',replay:'↻ വീണ്ടും',paused:'നിർത്തി',pausedMsg:'മുഖം സ്ഥിരീകരിച്ചില്ല. തിരികെ വരൂ, വീഡിയോ തുടരും.',whole:'1 മുഴുവൻ = 4 തുല്യ ഭാഗങ്ങൾ',num:'3 = നമുക്കുള്ള ഭാഗങ്ങൾ (അംശം)',den:'4 = ഭാഗങ്ങളുടെ വലുപ്പം (ഛേദം)',same:'ഒരേ നിറത്തിന്റെ നീളം = ഒരേ വില'},
 bn:{scene:'দৃশ্য',play:'▶ পাঠ চালান',pause:'⏸ থামান',resume:'▶ চালিয়ে যান',replay:'↻ আবার',paused:'থামানো হয়েছে',pausedMsg:'মুখ যাচাই হয়নি। ফিরে আসুন, ভিডিও চলবে।',whole:'1 পূর্ণ = 4 সমান অংশ',num:'3 = আমাদের কাছে থাকা অংশ (লব)',den:'4 = অংশের আকার (হর)',same:'একই রঙের দৈর্ঘ্য = একই মান'}
};

const Bar=({n,fill,w=300,d=0})=>(
 <div style={{display:'flex',width:w,height:42,border:`2px solid ${G}`,borderRadius:8,overflow:'hidden'}}>
  {Array.from({length:n}).map((_,i)=>(
   <div key={i} style={{flex:1,borderRight:i<n-1?`2px solid ${G}`:0,background:i<fill?G:'transparent',opacity:0,animation:`lpPop .5s ${d+i*0.22}s forwards`}}/>
  ))}
 </div>
);

const Frac=({a,b,s=38})=>(
 <span style={{display:'inline-flex',flexDirection:'column',alignItems:'center',margin:'0 10px',fontSize:s,fontWeight:800,color:G,lineHeight:1.1}}>
  <span>{a}</span>
  <span style={{width:'100%',height:3,background:G}}/>
  <span>{b}</span>
 </span>
);

const T=({children})=><span style={{fontSize:30,color:'#fff',margin:'0 8px'}}>{children}</span>;

function Visual({kind,idx,L}){
 if(kind!=='fraction')return <div style={{width:120,height:120,borderRadius:'50%',border:`4px solid ${G}`,display:'grid',placeItems:'center',fontSize:48,color:G,animation:'lpPulse 2s infinite'}}>{idx+1}</div>;
 const col={display:'flex',flexDirection:'column',gap:14,alignItems:'center'};
 if(idx===0)return <div style={col}><Bar n={4} fill={4}/><span style={{color:'#ccc'}}>{L.whole}</span></div>;
 if(idx===1)return <div style={{display:'flex',gap:28,alignItems:'center'}}><Frac a={3} b={4} s={64}/><div style={col}><Bar n={4} fill={3} d={.4}/><span style={{color:'#ccc'}}>{L.num}</span><span style={{color:'#ccc'}}>{L.den}</span></div></div>;
 if(idx===2)return <div style={col}><div><Frac a={1} b={2}/><T>=</T><Frac a={2} b={4}/></div><div style={{display:'flex',gap:20}}><Bar n={2} fill={1} w={140}/><Bar n={4} fill={2} w={140} d={.5}/></div></div>;
 if(idx===3)return <div style={col}><Bar n={2} fill={1}/><Bar n={4} fill={2} d={.4}/><Bar n={8} fill={4} d={.8}/><span style={{color:'#ccc'}}>{L.same}</span></div>;
 return <div style={col}><div><Frac a={1} b={2}/><T>+</T><Frac a={1} b={3}/><T>→</T><Frac a={3} b={6}/><T>+</T><Frac a={2} b={6}/><T>=</T><Frac a={5} b={6}/></div><Bar n={6} fill={5} d={.3}/></div>;
}

export default function LessonPlayer({title='',sections=[],present=true,onFinish,kind:kindProp}){
 const {lang}=useLang();
 const L=LBL[lang]||LBL.en;
 const synth=typeof window!=='undefined'?window.speechSynthesis:null;
 const [idx,setIdx]=useState(0);
 const [playing,setPlaying]=useState(false);
 const [wi,setWi]=useState(0);
 const [done,setDone]=useState(false);
 const [noVoice,setNoVoice]=useState(false);
 const gen=useRef(0);
 const seen=useRef(false);
 const auto=useRef(false);
 const first=useRef(true);

 const clean=s=>(s||'').replace(/^\d+\.\s*/,'');
 const words=clean(sections[idx]).split(/\s+/).filter(Boolean);

 const say=(i)=>{
  if(!synth)return;
  synth.cancel();
  const my=++gen.current;
  setIdx(i);
  setWi(0);
  seen.current=false;
  const text=clean(sections[i]);
  const u=new SpeechSynthesisUtterance(text);
  const code=CODES[lang]||'en-IN';
  const vs=synth.getVoices();
  const v=vs.find(x=>x.lang.replace('_','-')===code)||vs.find(x=>x.lang.toLowerCase().startsWith(lang));
  setNoVoice(!v&&lang!=='en');
  u.lang=code;
  if(v)u.voice=v;
  u.rate=0.92;
  u.onboundary=e=>{
   if(e.name&&e.name!=='word')return;
   seen.current=true;
   setWi(text.slice(0,e.charIndex).split(/\s+/).filter(Boolean).length);
  };
  u.onend=()=>{
   if(gen.current!==my)return;
   setWi(9999);
   setTimeout(()=>{
    if(gen.current!==my)return;
    if(i<sections.length-1)say(i+1);
    else{setPlaying(false);setDone(true);onFinish&&onFinish();}
   },1200);
  };
  synth.speak(u);
 };

 const toggle=()=>{
  if(!synth)return;
  if(playing){synth.pause();setPlaying(false);}
  else if(synth.paused&&synth.speaking){synth.resume();setPlaying(true);}
  else{setDone(false);say(done?0:idx);setPlaying(true);}
 };

 const jump=i=>{setDone(false);say(i);setPlaying(true);};

 useEffect(()=>{
  if(!playing)return;
  const t=setInterval(()=>{if(!seen.current)setWi(w=>w+1);},380);
  return()=>clearInterval(t);
 },[playing,idx]);

 useEffect(()=>{
  if(!synth)return;
  if(!present&&playing){synth.pause();setPlaying(false);auto.current=true;}
  else if(present&&auto.current){auto.current=false;synth.resume();setPlaying(true);}
 },[present]);

 useEffect(()=>{
  if(first.current){first.current=false;return;}
  if(playing)say(idx);
 },[lang]);

 useEffect(()=>{
  if(synth)synth.getVoices();
  return()=>{gen.current++;synth&&synth.cancel();};
 },[]);

 // kind comes from Learn.jsx (title is translated, so a text match on "fraction" fails)
 const kind=kindProp||(/fraction/i.test(title)?'fraction':'generic');

 return (
  <div>
   <style>{`@keyframes lpPop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:scale(1)}}@keyframes lpPulse{50%{transform:scale(1.08);box-shadow:0 0 30px rgba(212,175,55,.5)}}@keyframes lpFade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`}</style>

   <div style={{position:'relative',aspectRatio:'16/9',borderRadius:16,overflow:'hidden',border:`1px solid ${G}`,background:'radial-gradient(circle at 50% 30%,#2a2210,#050505)',display:'flex',flexDirection:'column',justifyContent:'space-between',padding:20}}>
    <div style={{color:G,fontWeight:700,fontSize:14}}>▶ {title} · {L.scene} {idx+1}/{sections.length}</div>

    <div key={idx} style={{display:'grid',placeItems:'center',animation:'lpFade .6s'}}>
     <Visual kind={kind} idx={idx} L={L}/>
    </div>

    <div style={{textAlign:'center',fontSize:22,background:'rgba(0,0,0,.55)',borderRadius:10,padding:'10px 16px',minHeight:64}}>
     {words.map((w,i)=>(
      <span key={i} style={{color:i<wi?'#fff':i===wi?G:'#777',fontWeight:i===wi?700:400,transition:'color .2s'}}>{w} </span>
     ))}
    </div>

    {!present&&(
     <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.85)',display:'grid',placeItems:'center',textAlign:'center',color:G}}>
      <div>
       <h3>{L.paused}</h3>
       <p>{L.pausedMsg}</p>
      </div>
     </div>
    )}
   </div>

   <div style={{display:'flex',alignItems:'center',gap:10,marginTop:10}}>
    <button className="btn" disabled={!present||!synth} onClick={toggle}>
     {playing?L.pause:done?L.replay:idx>0?L.resume:L.play}
    </button>
    <div style={{display:'flex',gap:6,flex:1}}>
     {sections.map((_,i)=>(
      <div key={i} onClick={()=>present&&jump(i)} title={L.scene+' '+(i+1)} style={{flex:1,height:8,borderRadius:4,cursor:'pointer',background:i<idx||done?G:i===idx?'#8a6f1d':'#333'}}/>
     ))}
    </div>
   </div>

   {!synth&&<p className="warn">Indha browser-la voice illa. Chrome / Edge use pannunga.</p>}
   {noVoice&&<p className="warn">Indha language voice ungal device-la illa. Edge browser use pannunga (Tamil voice built-in), illana Windows Settings → Speech-la voice add pannunga.</p>}
  </div>
 );
}