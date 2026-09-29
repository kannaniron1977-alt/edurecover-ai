const DEMO=[['Priya',1450],['Arjun',1220],['Meena',980],['Karthik',760],['Divya',540]];
export default function Leaderboard({me}){
 const rows=[...DEMO,[(me?.name||'You')+' (you)',me?.coins??0]].sort((a,b)=>b[1]-a[1]);
 return <div><h2>Leaderboard</h2>{rows.map(([n,c],i)=><div key={n} className="card" style={{display:'flex',gap:14,alignItems:'center',marginBottom:10,borderColor:n.includes('(you)')?'#d4af37':undefined}}>
  <b style={{width:40,color:'#d4af37',fontSize:20}}>{['🥇','🥈','🥉'][i]||i+1}</b><span style={{flex:1}}>{n}</span><span className="tag">{c} coins</span></div>)}</div>}