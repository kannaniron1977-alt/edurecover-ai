import {useState} from 'react';
export default function Settings(){
 const [cam,setCam]=useState('');
 const test=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:true});s.getTracks().forEach(t=>t.stop());setCam('Camera OK ✓')}catch{setCam('Camera blocked ✗ Browser-la Allow pannunga')}};
 return <div className="card"><h2>Settings</h2>
 <p>Language: sidebar-la irukkura dropdown-la maathalaam.</p>
 <p><button className="btn" onClick={test}>Test camera</button> {cam}</p>
 <div className="priv">Camera session presence-kku mattum use aagum. Image store aagaadhu.</div></div>}