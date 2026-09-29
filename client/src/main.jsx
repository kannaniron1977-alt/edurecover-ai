import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';import App from './App.jsx';import {LangProvider} from './i18n.jsx';import './styles.css';
createRoot(document.getElementById('root')).render(<BrowserRouter><LangProvider><App/></LangProvider></BrowserRouter>);
function spark(x,y,n){for(let i=0;i<n;i++){const s=document.createElement('i');s.className='spark';const a=Math.random()*6.28,d=18+Math.random()*34;s.style.cssText=`left:${x}px;top:${y}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px`;document.body.appendChild(s);setTimeout(()=>s.remove(),700)}}
document.addEventListener('click',e=>spark(e.clientX,e.clientY,14));let last=0;
document.addEventListener('mousemove',e=>{if(!e.target.closest?.('.btn,.gold,.pill,.side a,.side button,.opt,.row,.card,.logo'))return;const n=Date.now();if(n-last<80)return;last=n;spark(e.clientX,e.clientY,2)});
