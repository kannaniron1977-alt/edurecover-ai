import Badges from '../components/Badges';

export default function Profile({ me, full }) {
  return (
    <div>
      <div className="card">
        <h2>Profile</h2>
        <div style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#d4af37,#f6e27a)',color:'#000',display:'grid',placeItems:'center',fontSize:34,fontWeight:800}}>
          {(me?.name||'?')[0].toUpperCase()}
        </div>
        <p><b>Name:</b> {me?.name}</p>
        <p><b>Email:</b> {me?.email}</p>
        <p><b>Role:</b> {me?.role}</p>
        <p><b>Coins:</b> {me?.coins}</p>
      </div>
      <Badges me={full} />
    </div>
  );
}