const G='#d4af37';
const Pie=({n,fill,size=110})=>{
 n=Math.max(2,n);const r=size/2-4,c=size/2;
 const pt=a=>[c+r*Math.cos(a),c+r*Math.sin(a)];
 return <svg width={size} height={size}>{Array.from({length:n}).map((_,i)=>{
  const a0=-Math.PI/2+i*2*Math.PI/n,a1=a0+2*Math.PI/n;const [x0,y0]=pt(a0),[x1,y1]=pt(a1);
  return <path key={i} d={`M${c},${c}L${x0},${y0}A${r},${r} 0 0,1 ${x1},${y1}Z`} fill={i<fill?G:'#1a1608'} stroke={G} strokeWidth="2"/>})}</svg>};
const Bar=({n,fill,w=150})=><div style={{display:'flex',width:w,height:26,border:`2px solid ${G}`,borderRadius:6,overflow:'hidden'}}>{Array.from({length:Math.max(2,n)}).map((_,i)=><div key={i} style={{flex:1,borderRight:i<n-1?`2px solid ${G}`:0,background:i<fill?G:'transparent'}}/>)}</div>;

export default function QuizVisual({q}){
 let list=[];
 if(Array.isArray(q.visual))list=q.visual.map(v=>Array.isArray(v)?{fill:v[0],n:v[1]}:v);
 else{const seen=new Set();
  for(const m of (q.text||'').matchAll(/(\d+)\s*\/\s*(\d+)/g)){const a=+m[1],b=+m[2];const k=a+'/'+b;
   if(b>=2&&b<=12&&a<=b&&!seen.has(k)){seen.add(k);list.push({fill:a,n:b})}}}
 list=list.slice(0,3);
 if(!list.length)return null;
 return <div style={{margin:'12px 0',padding:14,border:`1px dashed ${G}`,borderRadius:14,background:'#0f0c04'}}>
  <div style={{color:G,fontSize:13,marginBottom:8}}>🖼 Picture clue: shaded parts-a count pannunga</div>
  <div style={{display:'flex',gap:28,flexWrap:'wrap',justifyContent:'center'}}>
   {list.map((v,i)=><div key={i} style={{textAlign:'center'}}>
    <Pie n={v.n} fill={v.fill}/>
    <div style={{marginTop:6}}><Bar n={v.n} fill={v.fill}/></div>
    <div style={{color:'#fff',marginTop:4,fontWeight:700}}>{v.label||`${v.fill}/${v.n}`}</div>
   </div>)}
  </div></div>}