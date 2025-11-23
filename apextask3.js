/* ========== QUIZ ========== */
const quiz = [
  { q:"Which CSS property controls inside spacing?", a:["margin","padding","gap","border"], correct:1 },
  { q:"Which tag loads JavaScript?", a:["<style>","<script>","<meta>","<div>"], correct:1 },
  { q:"Which unit is relative to root font-size?", a:["em","px","rem","vh"], correct:2 }
];

let index=0, score=0;

function loadQuiz(){
  document.getElementById("question").textContent = (index+1)+". "+quiz[index].q;
  document.getElementById("answers").innerHTML="";

  quiz[index].a.forEach((opt,i)=>{
    const btn=document.createElement("button");
    btn.className="answer-btn";
    btn.textContent=opt;
    btn.onclick=()=>select(i,btn);
    document.getElementById("answers").appendChild(btn);
  });
}

function select(i,btn){
  const all=document.querySelectorAll(".answer-btn");
  all.forEach(x=>x.disabled=true);

  if(i===quiz[index].correct){
    btn.classList.add("correct");
    score++;
    document.getElementById("feedback").textContent="Correct ✔";
  } else {
    btn.classList.add("wrong");
    all[quiz[index].correct].classList.add("correct");
    document.getElementById("feedback").textContent="Wrong ✖";
  }
}

document.getElementById("next").onclick=()=>{
  index++;
  if(index>=quiz.length){
    document.getElementById("question").textContent="Quiz Finished! Score: "+score+"/"+quiz.length;
    document.getElementById("answers").innerHTML="";
    document.getElementById("next").disabled=true;
  } else {
    loadQuiz();
  }
};

loadQuiz();

/* ========== CAROUSEL ========== */
const track=document.getElementById("track");
let pos=0;

function updateCarousel(){
  track.style.transform=`translateX(-${pos*100}%)`;
}

document.getElementById("prev").onclick=()=>{
  pos=(pos-1+3)%3;
  updateCarousel();
};
document.getElementById("nextBtn").onclick=()=>{
  pos=(pos+1)%3;
  updateCarousel();
};

let auto=setInterval(()=>{pos=(pos+1)%3;updateCarousel();},4000);

/* Pause on hover */
document.getElementById("carousel").addEventListener("mouseenter",()=>clearInterval(auto));
document.getElementById("carousel").addEventListener("mouseleave",()=>auto=setInterval(()=>{pos=(pos+1)%3;updateCarousel();},4000));

/* ========== API ========== */
const out=document.getElementById("joke");

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g,c=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  })[c]);
}

async function fetchShow(url,multi=false){
  out.textContent="Fetching...";
  try{
    const r=await fetch(url);
    const data=await r.json();

    if(multi){
      out.innerHTML=data.map(j=>`<b>${escapeHtml(j.setup)}</b><br>${escapeHtml(j.punchline)}<br><br>`).join("");
    } else {
      const j=data[0] || data;
      out.innerHTML=`<b>${escapeHtml(j.setup)}</b><br>${escapeHtml(j.punchline)}`;
    }
  } catch(e){
    out.textContent="Error loading joke!";
  }
}

document.getElementById("fetchRandom").onclick=()=>fetchShow("https://official-joke-api.appspot.com/random_joke");
document.getElementById("fetchProgramming").onclick=()=>fetchShow("https://official-joke-api.appspot.com/jokes/programming/random");
document.getElementById("fetchTen").onclick=()=>fetchShow("https://official-joke-api.appspot.com/random_ten",true);
document.getElementById("clearJoke").onclick=()=>out.textContent="";

/* ========== TABS ========== */
const tabs=document.querySelectorAll(".tab-btn");
const panes={
  "card-media":document.getElementById("card-media"),
  "card-quiz":document.getElementById("card-quiz"),
  "card-carousel":document.getElementById("card-carousel"),
  "card-api":document.getElementById("card-api")
};

function showPane(id){
  Object.values(panes).forEach(x=>x.style.display="none");
  panes[id].style.display="block";

  tabs.forEach(b=>b.classList.toggle("active",b.dataset.target===id));
}

tabs.forEach(btn=>btn.addEventListener("click",()=>showPane(btn.dataset.target)));
showPane("card-media");
