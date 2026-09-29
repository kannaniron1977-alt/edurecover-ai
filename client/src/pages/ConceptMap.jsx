const C={mastered:'#22c55e',learning:'#3b82f6',weak:'#f59e0b',repeated:'#ef4444',locked:'#9ca3af'};
export default function ConceptMap({graph}){return <div className="card"><h2>Concept Map</h2>
 <svg width="360" height={graph.length*80}>{graph.map((n,i)=><g key={n.id}>{i>0&&<line x1="180" y1={i*80-20} x2="180" y2={i*80+10} stroke="#999" strokeWidth="2"/>}
  <rect x="50" y={i*80+10} width="260" height="46" rx="12" fill="#141414" stroke={C[n.status]} strokeWidth={n.status==='repeated'?5:2}/>
  <text x="180" y={i*80+32} textAnchor="middle" fill="#f5f0e1" fontSize="13" fontWeight="600">{n.name}</text><text x="180" y={i*80+48} textAnchor="middle" fontSize="11" fill={C[n.status]}>{n.status} {n.mastery}%{n.mis?` - ${n.mis} misconception(s)`:''}</text></g>)}</svg></div>}
