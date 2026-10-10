/* Load after script.js and quiz-bank.js. Replaces only the quiz view and quiz handlers. */
(() => {
  'use strict';
  const root = document.getElementById('view-quiz');
  const bank = window.NutritionQuizBank;
  if (!root || !Array.isArray(bank) || !bank.length) return;
  const topics = {concept:'營養概念',label:'營養標示',plate:'餐盤配搭',daily:'日常飲食',waste:'惜食決策',recipe:'可行食譜'};
  const levels = {1:'理解',2:'應用',3:'推理'};
  const sources = {
    fibre:['衞生署：高纖飲食','https://www.chp.gov.hk/en/static/90018.html'],
    healthy:['衞生署：健康飲食','https://www.chp.gov.hk/en/healthtopics/content/25/8800.html'],
    sugar:['食物安全中心：糖的事實與誤解','https://www.cfs.gov.hk/english/programme/programme_rdss/Sugars_Facts_and_Myths_for_Consumers.html'],
    snack:['衞生署：健康小食','https://www.chp.gov.hk/en/resources/e_health_topics/12518.html'],
    label:['食物安全中心：營養標籤問答','https://www.cfs.gov.hk/english/faq/faq_14.html'],
    plate:['衞生署：健康午膳 321','https://www.chp.gov.hk/en/resources/e_health_topics/12513.html'],
    leftovers:['食物安全中心：處理剩食','https://www.cfs.gov.hk/english/consumer_zone/safefood_all/five_keys_apply_leftovers.html'],
    safety:['食物安全中心：食物安全五要點','https://www.cfs.gov.hk/english/consumer_zone/safefood_all/five_keys_reminder.html'],
    allergy:['食物安全中心：食物致敏物','https://www.cfs.gov.hk/english/faq/faq_12.html']
  };
  const storageKey='nutrition-quiz-v21-session';
  const seenKey='nutrition-quiz-v21-seen';
  const byId = new Map(bank.map(q => [q.id,q]));
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffled = array => {
    const copy=[...array];
    for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}
    return copy;
  };
  const read = key => {try{return JSON.parse(sessionStorage.getItem(key));}catch{return null;}};
  const write = (key,value) => {try{sessionStorage.setItem(key,JSON.stringify(value));}catch{/* Optional storage; quiz remains usable. */}};
  let state = read(storageKey);
  function valid(saved) {
    if(!saved || saved.version!==3 || !Array.isArray(saved.items) || !saved.items.length || saved.items.length>72 || !Array.isArray(saved.answers) || saved.answers.length!==saved.items.length || !Number.isInteger(saved.index) || saved.index<0 || saved.index>=saved.items.length || typeof saved.finished!=='boolean') return false;
    if(new Set(saved.items.map(x=>x.id)).size!==saved.items.length) return false;
    return saved.items.every((item,i)=>byId.has(item.id) && Array.isArray(item.order) && item.order.length===4 && [...item.order].sort().join(',')==='0,1,2,3' && typeof item.hinted==='boolean' && (item.selected===null || [0,1,2,3].includes(item.selected)) && (saved.answers[i]===null || ([0,1,2,3].includes(saved.answers[i].option) && typeof saved.answers[i].hinted==='boolean'))) && (!saved.finished || saved.answers.every(Boolean)) && saved.answers.slice(0,saved.index).every(Boolean);
  }
  if(!valid(state)) state=null;
  let rawSeen=read(seenKey);
  let seen=new Set(Array.isArray(rawSeen)?rawSeen.filter(id=>byId.has(id)):[]);
  function persist(){write(storageKey,state);}
  function selectQuestions(count,topic,difficulty) {
    const eligible=bank.filter(q=>(topic==='all'||q.topic===topic)&&(difficulty==='mixed'||q.level===Number(difficulty)));
    const topicKeys=topic==='all'?shuffled(Object.keys(topics)):[topic];
    const queues=new Map(topicKeys.map(t=>[t,eligible.filter(q=>q.topic===t)]));
    const selected=[];
    // Round-robin topics; prefer unseen questions. Mixed rounds sample each level.
    const levelOrder=shuffled([1,2,3]);
    while(selected.length<Math.min(count,eligible.length)) {
      let added=false;
      for(const t of topicKeys) {
        if(selected.length>=count) break;
        const pool=queues.get(t).filter(q=>!selected.includes(q));
        if(!pool.length) continue;
        const unseen=pool.filter(q=>!seen.has(q.id));
        const candidates=unseen.length?unseen:pool;
        const desired=levelOrder[(selected.length+Math.floor(selected.length/topicKeys.length))%3];
        const matching=candidates.filter(q=>q.level===desired);
        const chosen=shuffled(matching.length?matching:candidates)[0];
        selected.push(chosen);added=true;
      }
      if(!added) break;
    }
    return shuffled(selected);
  }
  function start(questions,settings={},originalScore=null) {
    if(!questions.length) return;
    state={version:3,index:0,finished:false,settings,originalScore,
      items:questions.map(q=>({id:q.id,order:shuffled([0,1,2,3]),selected:null,hinted:false})),
      answers:questions.map(()=>null)};
    questions.forEach(q=>seen.add(q.id));write(seenKey,[...seen]);persist();render();
  }
  function shell(body) {
    root.innerHTML=`<div class="card nq"><div class="nq-heading"><div><p class="nq-eyebrow">看資料 · 作選擇 · 說理由</p><h2>營養大挑戰</h2></div><span class="nq-badge">72 題生活題庫 · V2.1</span></div>${body}</div>`;
  }
  function setup() {
    shell(`<p class="nq-intro">用飲食、購物、食品標示和煮食情境，考考你的判斷。不限時，可以先用紙筆計算。</p>
      <form id="nq-settings"><div class="nq-settings-grid">
      <label>挑戰長度<select id="nq-count"><option value="6">6 題 · 工作坊短挑戰</option><option value="10">10 題 · 標準挑戰</option><option value="15">15 題 · 延伸練習</option></select></label>
      <label>難度<select id="nq-difficulty"><option value="mixed">混合：理解、應用、推理</option><option value="1">理解：分清概念</option><option value="2">應用：比較與計算</option><option value="3">推理：整合多個條件</option></select></label>
      <label>主題<select id="nq-topic"><option value="all">六個主題平均抽題</option>${Object.entries(topics).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label></div>
      <p id="nq-pool" class="nq-note" role="status"></p><button class="nq-primary" type="submit">開始挑戰</button></form>
      <div class="nq-topic-list">${Object.values(topics).map(t=>`<span>${t}</span>`).join('')}</div>
      <p class="nq-note">每題四選一，選好後再提交。可以看提示；答後會解釋各選項。切換頁面或重新整理，會保留本分頁進度。題目數據均為教學情境。</p>
      ${state?'<button class="nq-secondary" id="nq-resume">返回目前挑戰</button>':''}`);
    const updatePool=()=>{
      const t=document.getElementById('nq-topic').value,d=document.getElementById('nq-difficulty').value;
      const n=bank.filter(q=>(t==='all'||q.topic===t)&&(d==='mixed'||q.level===Number(d))).length;
      const requested=Number(document.getElementById('nq-count').value);
      document.getElementById('nq-pool').textContent=`此組合有 ${n} 題；本回合 ${Math.min(n,requested)} 題。${n<requested?'題庫不足所選長度，會使用全部符合題目，不重複湊題。':''}`;
    };
    ['nq-topic','nq-difficulty','nq-count'].forEach(id=>document.getElementById(id).addEventListener('change',updatePool));updatePool();
    document.getElementById('nq-settings').addEventListener('submit',event=>{
      event.preventDefault();
      if(state&&!state.finished&&!window.confirm('開始新挑戰會取代目前這回合的進度。確定開始？')) return;
      const count=Number(document.getElementById('nq-count').value),topic=document.getElementById('nq-topic').value,difficulty=document.getElementById('nq-difficulty').value;
      start(selectQuestions(count,topic,difficulty),{count,topic,difficulty});
    });
    document.getElementById('nq-resume')?.addEventListener('click',render);
  }
  function score() {return state.answers.reduce((n,a,i)=>n+(a&&byId.get(state.items[i].id).options[a.option].correct?1:0),0);}
  function submit() {
    if(!state||state.finished||state.answers[state.index])return;
    const item=state.items[state.index];
    if(item.selected===null)return;
    state.answers[state.index]={option:item.selected,hinted:item.hinted};persist();render();
    document.getElementById('nq-feedback-title')?.focus();
  }
  function next() {
    if(!state||state.finished||!state.answers[state.index])return;
    if(state.index===state.items.length-1) state.finished=true;
    else state.index++;
    persist();render();document.getElementById('nq-question-title')?.focus();
  }
  function feedback(q,answer,order) {
    const right=q.options.findIndex(o=>o.correct);
    const source=sources[q.source];
    return `<section class="nq-feedback" aria-labelledby="nq-feedback-title"><h3 id="nq-feedback-title" tabindex="-1">${answer.option===right?'✓ 答對了':'一起釐清這一題'}</h3>
      <p><strong>你的選擇：</strong>${esc(q.options[answer.option].text)}</p><p>${esc(q.options[answer.option].feedback)}</p>
      ${answer.option!==right?`<p><strong>正確答案：</strong>${esc(q.options[right].text)}</p>`:''}
      <p class="nq-takeaway">${esc(q.explanation)}</p><details><summary>為甚麼其他選項不合適？</summary><ul>${order.filter(i=>i!==right).map(i=>`<li><strong>${esc(q.options[i].text)}</strong><br>${esc(q.options[i].feedback)}</li>`).join('')}</ul></details>
      ${source?`<a class="nq-source" href="${source[1]}" target="_blank" rel="noopener noreferrer">${source[0]}</a>`:'<p class="nq-note">依生活情境提供的條件及份量推理。</p>'}</section>`;
  }
  function question() {
    const item=state.items[state.index],q=byId.get(item.id),answer=state.answers[state.index];
    shell(`<div class="nq-progress-label"><span>第 ${state.index+1} / ${state.items.length} 題${state.originalScore!==null?' · 訂正練習':''}</span><span>${topics[q.topic]} · ${levels[q.level]}</span></div>
      <progress class="nq-progress" value="${state.answers.filter(Boolean).length}" max="${state.items.length}" aria-label="已提交題數"></progress>
      <h3 id="nq-question-title" class="nq-question" tabindex="-1">${esc(q.prompt)}</h3>
      ${q.table?`<div class="nq-table-wrap"><table class="nq-data"><caption>教學用模擬營養資料</caption><thead><tr>${q.table.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${q.table.rows.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}
      <form id="nq-answer-form"><fieldset class="nq-options"><legend class="nq-sr-only">選擇一個答案，再提交</legend>${item.order.map((oi,position)=>{
        const option=q.options[oi];let status='';if(answer)status=option.correct?' ✓ 正確答案':answer.option===oi?' ✕ 你的選擇':'';
        return `<label class="nq-option ${answer&&option.correct?'is-correct':''} ${answer&&answer.option===oi&&!option.correct?'is-incorrect':''}"><input type="radio" name="nq-answer" value="${oi}" ${item.selected===oi?'checked':''} ${answer?'disabled':''}><span class="nq-letter">${'ABCD'[position]}</span><span>${esc(option.text)}${status?`<strong class="nq-answer-tag">${status}</strong>`:''}</span></label>`;
      }).join('')}</fieldset>${!answer?'<button id="nq-submit" class="nq-primary" type="submit" disabled>提交答案</button>':''}</form>
      ${!answer?`<button id="nq-hint-btn" class="nq-secondary" ${item.hinted?'disabled':''}>${item.hinted?'已查看提示':'💡 給我一個提示'}</button>`:''}
      ${item.hinted?`<p class="nq-hint" role="status">${esc(q.hint)}</p>`:''}
      ${answer?feedback(q,answer,item.order)+`<button id="nq-next" class="nq-primary">${state.index===state.items.length-1?'查看學習回顧':'下一題 →'}</button>`:''}
      <div class="nq-footer"><button id="nq-change" class="nq-link">挑戰設定</button><span>不計速度，想清楚再作答。</span></div>`);
    if(!answer) {
      document.getElementById('nq-submit').disabled=item.selected===null;
      root.querySelectorAll('input[name="nq-answer"]').forEach(input=>input.addEventListener('change',()=>{item.selected=Number(input.value);persist();document.getElementById('nq-submit').disabled=false;}));
      document.getElementById('nq-answer-form').addEventListener('submit',e=>{e.preventDefault();submit();});
      document.getElementById('nq-hint-btn').addEventListener('click',()=>{item.hinted=true;persist();render();});
    }
    document.getElementById('nq-next')?.addEventListener('click',next);
    document.getElementById('nq-change').addEventListener('click',setup);
  }
  function result() {
    const right=score(),total=state.items.length;
    const wrong=state.items.filter((item,i)=>!byId.get(item.id).options[state.answers[i].option].correct);
    const stats=Object.entries(topics).map(([id,name])=>{
      const indices=state.items.map((item,i)=>byId.get(item.id).topic===id?i:-1).filter(i=>i!==-1);
      const n=indices.filter(i=>byId.get(state.items[i].id).options[state.answers[i].option].correct).length;
      return indices.length?`<li><span>${name}</span><strong>${n} / ${indices.length}</strong></li>`:'';
    }).join('');
    shell(`<div class="nq-result"><p class="nq-eyebrow">${state.originalScore!==null?'訂正練習完成':'挑戰完成'}</p><h3>${right} / ${total} 題答對</h3><p>${state.originalScore!==null?`原挑戰成績：${esc(state.originalScore)}。訂正結果獨立計算。`:`本回合 ${Math.round(right/total*100)} 分；使用提示 ${state.answers.filter(a=>a.hinted).length} 題。`}</p><p>${wrong.length?'看看哪些判斷可以再練習，然後帶回餐盤設計。':'試把其中一個判斷方法，用在你自己的餐盤。'}</p></div>
      <ul class="nq-topic-scores">${stats}</ul>
      <div class="nq-result-actions">${wrong.length?'<button id="nq-retry" class="nq-primary">只重練錯題</button>':''}<button id="nq-new" class="nq-secondary">選擇下一回合</button><button id="nq-plate" class="nq-secondary">返回智能餐盤</button></div>
      <h3>逐題回顧</h3><div class="nq-review">${state.items.map((item,i)=>{
        const q=byId.get(item.id),answer=state.answers[i],right=q.options.find(o=>o.correct);
        return `<details><summary>${q.options[answer.option].correct?'✓':'↻'} ${i+1}. ${esc(q.prompt)}</summary>${q.table?`<p>${q.table.rows.map(row=>esc(row.join('：'))).join('<br>')}</p>`:''}<p>你的答案：${esc(q.options[answer.option].text)}</p><p>正確答案：${esc(right.text)}</p><p>${esc(q.options[answer.option].feedback)} ${esc(q.explanation)}</p></details>`;
      }).join('')}</div><p class="nq-note">本回合結果只反映抽到的題目，不是全面的營養能力評級。</p>`);
    document.getElementById('nq-new').addEventListener('click',setup);
    const plateButton=document.getElementById('nq-plate');
    if(typeof window.switchTab==='function') plateButton.addEventListener('click',()=>window.switchTab('app'));
    else plateButton.hidden=true;
    document.getElementById('nq-retry')?.addEventListener('click',()=>start(wrong.map(item=>byId.get(item.id)),{review:true},state.originalScore??`${right} / ${total} 題`));
  }
  function render(){if(!state)setup();else if(state.finished)result();else question();}
  // Existing tab switching and delayed initApp calls can safely call these repeatedly.
  window.initQuiz=render;
  window.renderQuizQuestion=render;
  window.showQuizResult=render;
  window.resetQuiz=setup;
  window.nextQuizQuestion=next;
  window.handleQuizAnswer=()=>{};
  render();
})();
