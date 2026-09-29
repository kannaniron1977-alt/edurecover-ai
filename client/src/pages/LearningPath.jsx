import {Link} from 'react-router-dom';
const STEPS=[['Narrated lesson','Video maari lesson-a paarunga'],['Lesson quiz','Answer + one-line reason'],['AI coaching','Misconception-a fix pannunga'],['Retest','Pudhu question-la prove pannunga'],['Master Quiz','Course mudinjadhum final test']];
export default function LearningPath(){
 return <div><h2>Learning Path</h2><p>Ovvoru step-um mudinjaa dhaan adutha step.</p>
 {STEPS.map(([t,d],i)=><div key={i} className="card" style={{display:'flex',gap:16,alignItems:'center',marginBottom:12}}>
  <div style={{width:44,height:44,borderRadius:'50%',border:'2px solid #d4af37',display:'grid',placeItems:'center',color:'#d4af37',fontWeight:800}}>{i+1}</div>
  <div style={{flex:1}}><b>{t}</b><div style={{opacity:.7}}>{d}</div></div>
  <Link className="btn" to="/learn?course=1" style={{textDecoration:'none'}}>Open</Link></div>)}</div>}