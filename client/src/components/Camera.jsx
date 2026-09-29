import {useEffect} from 'react';
import useFaceGuard from '../useFaceGuard';
// Presence only. Frames are processed in the browser; nothing is stored or transmitted.
export default function Camera({onChange,onMulti}){
  const {videoRef,camOn,faces}=useFaceGuard(true);
  useEffect(()=>{onChange&&onChange(camOn&&faces===1)},[camOn,faces]);
  useEffect(()=>()=>{onChange&&onChange(true)},[]);
  useEffect(()=>{
    if(faces<=1)return;
    const id=setTimeout(()=>onMulti&&onMulti(),1500);
    return()=>clearTimeout(id);
  },[faces]);
  const msg=!camOn?'Camera off - allow camera to continue':faces===0?'Face not visible':faces>1?'Multiple faces detected!':'Verified ✓';
  return <div className="card" style={{position:'fixed',right:16,bottom:16,zIndex:10000,textAlign:'center',padding:10}}>
    <video ref={videoRef} muted playsInline style={{width:140,borderRadius:10,border:'1px solid #d4af37'}}/>
    <div style={{color:'#d4af37',fontSize:12,marginTop:4}}>{msg}</div>
    <div className="priv" style={{fontSize:10}}>Used only for session presence. No image is stored.</div>
  </div>
}