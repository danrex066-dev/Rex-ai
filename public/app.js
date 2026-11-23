const chat = document.querySelector("#chat");
const form = document.querySelector("#composer");
const input = document.querySelector("#message");
const voiceSelect = document.querySelector("#voice");
const mic = document.querySelector("#mic");
let messages = [];
let voices = [];

function loadVoices(){
  voices = speechSynthesis.getVoices();
  const previous = voiceSelect.value;
  voiceSelect.innerHTML = "";
  const auto = new Option("Default phone voice", "");
  voiceSelect.add(auto);
  voices.forEach((v,i)=>voiceSelect.add(new Option(`${v.name} · ${v.lang}`, String(i))));
  if ([...voiceSelect.options].some(o=>o.value===previous)) voiceSelect.value=previous;
}
if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged=loadVoices; }

function addMessage(role,text){
  document.querySelector("#welcome")?.remove();
  const row=document.createElement("div"); row.className=`message ${role}`;
  const avatar=document.createElement("div"); avatar.className="avatar"; avatar.textContent=role==="user"?"Y":"R";
  const bubble=document.createElement("div"); bubble.className="bubble"; bubble.textContent=text;
  row.append(avatar,bubble); chat.append(row); chat.scrollTop=chat.scrollHeight;
  return bubble;
}
function speak(text){
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);
  const selected=voiceSelect.value;
  if(selected!=="" && voices[Number(selected)]) utterance.voice=voices[Number(selected)];
  const style=document.querySelector("#voiceStyle").value;
  utterance.rate=style==="slow"?.86:style==="dramatic"?.94:1;
  speechSynthesis.speak(utterance);
}
async function send(text){
  text=text.trim(); if(!text) return;
  messages.push({role:"user",content:text}); addMessage("user",text); input.value="";
  const pending=addMessage("assistant","REX AI is thinking…");
  try{
    const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages,personality:document.querySelector("#personality").value})});
    const data=await r.json();
    if(!r.ok) throw new Error(data.error||"Request failed");
    pending.textContent=data.reply; messages.push({role:"assistant",content:data.reply}); speak(data.reply);
  }catch(e){pending.textContent=e.message; messages.pop();}
  chat.scrollTop=chat.scrollHeight;
}
form.addEventListener("submit",e=>{e.preventDefault();send(input.value)});
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();form.requestSubmit()}});
document.querySelector("#newChat").onclick=()=>{messages=[];chat.innerHTML='<div class="welcome" id="welcome"><div class="orb">R</div><h1>What are we exploring today?</h1><p>Ask a question, build an idea, or start a story.</p></div>';document.querySelector(".sidebar").classList.remove("open")};
document.querySelectorAll(".suggestions button").forEach(b=>b.onclick=()=>send(b.textContent));
document.querySelector("#menu").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SpeechRecognition){
  const recognition=new SpeechRecognition(); recognition.lang=navigator.language||"en-US"; recognition.interimResults=false;
  mic.onclick=()=>{try{recognition.start();mic.classList.add("listening")}catch{}};
  recognition.onresult=e=>{input.value=e.results[0][0].transcript;form.requestSubmit()};
  recognition.onend=()=>mic.classList.remove("listening");
  recognition.onerror=()=>mic.classList.remove("listening");
}else{mic.onclick=()=>alert("Speech input is not supported by this browser. Try Chrome on Android.");}
