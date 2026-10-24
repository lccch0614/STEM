/* Six authored stories. Independent from recipes, legacy practice and AI services. */
(() => {
  'use strict';
  const root=document.getElementById('view-quiz'),C=window.ScenarioQuizCore,practice=window.NutritionQuizPractice;
  if(!root||!C||!practice)return;
  const $=id=>document.getElementById(id),esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key='nutrition-scenario-v1-session';let bank,notice='';
  try{bank=C.validateBank(window.NutritionScenarioBank);}catch{root.innerHTML='<div class="card nqs"><h1>情境任務暫未載入</h1><p>請重新整理；原有自由練習仍可使用。</p><button id="nqs-fallback" type="button">開啟72題自由練習</button></div>';$('nqs-fallback').onclick=()=>practice.render();return;}
  let stored;try{stored=JSON.parse(sessionStorage.getItem(key));}catch{/* Optional session storage. */}
  let state=C.validateSession(stored,bank);
  if(stored&&!state)notice='上次情境進度未能核對，請重新選人物；自由練習及食譜不受影響。';
  state=state||{version:1,contentVersion:bank.contentVersion,view:'home',active:null,progress:{}};
  const clone=x=>JSON.parse(JSON.stringify(x));
  const story=()=>bank.stories.find(s=>s.id===state.active),progress=()=>state.progress[state.active];
  const persist=()=>{try{sessionStorage.setItem(key,JSON.stringify(state));}catch{notice='此瀏覽器未能儲存情境進度；請在本頁完成本回合。';}};
  const button=(id,text,primary=false)=>`<button type="button" id="${id}" class="${primary?'nqs-primary':'nqs-secondary'}">${esc(text)}</button>`;
  function shell(body){
    root.innerHTML=`<div class="nqs"><header class="nqs-heading"><div><p class="nqs-eyebrow">讀情境 · 看資料 · 作選擇 · 說理由</p><h1>營養大挑戰</h1></div><div class="nqs-header-actions">${button('nqs-home','人物任務')}${button('nqs-practice','72題自由練習')}</div></header>${notice?`<p class="nqs-notice" role="status">${esc(notice)}</p>`:''}${body}</div>`;
    $('nqs-home').onclick=()=>{state.view='home';persist();render();};$('nqs-practice').onclick=()=>{state.view='practice';persist();render();};
  }
  function focusTitle(){$('nqs-title')?.focus({preventScroll:true});root.scrollIntoView({block:'start',behavior:'auto'});}
  function home(){
    shell(`<section class="nqs-welcome"><p class="nqs-eyebrow">6個人物故事 · 每個4關 · 約6–8分鐘</p><h2 id="nqs-title" tabindex="-1">今天，你想幫誰作飲食決定？</h2><p>跟著一位角色讀資料、比較選擇，再處理新情況。每個故事可獨立完成，不計速度。</p></section><div class="nqs-stories">${bank.stories.map(s=>{
      const p=state.progress[s.id],status=p?.index===4?'已完成，可看回顧':p?`繼續第${p.index+1}關`:'開始4關任務';
      return `<article class="nqs-story"><div class="nqs-story-top"><span aria-hidden="true">${esc(s.icon)}</span><span>${s.age}歲 · ${s.minutes}</span></div><h3>${esc(s.name)}｜${esc(s.title)}</h3><p>${esc(s.goal)}</p><button class="nqs-primary" type="button" data-story="${s.id}">${status}<span class="nqs-sr-only">：${esc(s.name)}</span></button></article>`;
    }).join('')}</div><p class="nqs-small">人物、餐牌及售價為虛構教學情境；模擬標籤會另行標明。健康知識附官方來源，食材份量引用現有來源記錄。活動不評比體型，也不訂個人減重餐單。</p>`);
    root.querySelectorAll('[data-story]').forEach(b=>b.onclick=()=>{state.active=b.dataset.story;state.progress[state.active]??=C.freshProgress(story());state.view=progress().index===4?'result':'task';persist();render();focusTitle();});
  }
  function sourceHTML(q){return `<details class="nqs-sources"><summary>資料來源與教學資料說明（選看）</summary><ul>${q.sourceIds.map(id=>{const s=bank.sources[id];return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></li>`;}).join('')}</ul><p>核對日期：${esc(bank.checked)}。人物、餐牌、價格及明示的標籤數字為教學模擬；不當作真實產品資料或個人營養處方。</p>${q.type==='portion'?`<p>份量換算：1${esc(q.measure.label)}約${Number(q.measure.gramsPerUnit.toFixed(1))}克。來源：<a href="${esc(q.measure.source.url)}" target="_blank" rel="noopener noreferrer">${esc(q.measure.source.provider)}</a>。大小及量具會影響實重。</p>`:''}</details>`;}
  function optionsHTML(q,st,part,disabled){
    const sourceList=part==='reason'?q.reasons:q.options,list=st.order[part].map(id=>sourceList.find(o=>o.id===id)),isMulti=q.type==='multi'&&part==='choice';
    return list.map((o,i)=>{const checked=isMulti?st.draft.selected.includes(o.id):st.draft[part]===o.id;
      return `<label class="nqs-option"><input type="${isMulti?'checkbox':'radio'}" name="nqs-${part}" value="${o.id}" ${checked?'checked':''} ${disabled?'disabled':''}><span><span class="nqs-letter">${'ABCD'[i]}</span>${esc(o.text)}</span></label>`;
    }).join('');
  }
  function feedback(q,st){
    const attempt=st.attempts.at(-1),g=C.grade(q,attempt.input);
    const accepted=q.type==='portion'?`${q.target}${q.unit}`:q.options.filter(o=>o.correct).map(o=>o.text).join('；');
    return `<section class="nqs-feedback" aria-labelledby="nqs-feedback-title"><h3 id="nqs-feedback-title" tabindex="-1">${g.correct?'這次選擇符合本關條件':'一起核對這次選擇'}</h3><p>本次符合 ${g.score} / ${g.max} 個判斷點${attempt.hintUsed?' · 已使用提示':''}。</p><ul>${g.checks.map(c=>`<li><strong>${c.right?'✓':'再想想'}</strong> ${esc(c.text)}</li>`).join('')}</ul><p>${esc(q.explanation)}</p><details><summary>查看可行答案與其他選項</summary><p>符合條件的答案：${esc(accepted)}</p>${q.type==='decision'?`<p>支持理由：${esc(q.reasons.filter(o=>o.correct).map(o=>o.text).join('；'))}</p>`:''}${q.type!=='portion'?`<ul>${q.options.map(o=>`<li>${esc(o.text)}：${esc(o.feedback)}</li>`).join('')}</ul>`:''}</details><div class="nqs-actions">${button('nqs-edit','修改再試')}${button('nqs-next',progress().index===3?'完成故事，看看回顧':'下一關 →',true)}</div></section>`;
  }
  function question(){
    const s=story(),p=progress(),q=s.tasks[p.index],st=p.stages[p.index],locked=!st.editing&&st.attempts.length;
    let recap='';
    if(Number.isInteger(q.recapFrom)){
      const earlier=s.tasks[q.recapFrom],old=p.stages[q.recapFrom].attempts.at(-1);
      if(old&&earlier.options?.length){const selected=earlier.options.find(o=>o.id===old.input.choice);if(selected)recap=`<details class="nqs-recap"><summary>看看上一個決定</summary><p>你剛才選了：${esc(selected.text)}</p><p>這一關有新的餐牌條件，請重新按資料判斷。</p></details>`;}
    }
    const table=q.table?`<div class="nqs-table-wrap"><table><caption>${esc(q.table.caption)}</caption><thead><tr>${q.table.headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${q.table.rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'';
    shell(`<div class="nqs-stage-line"><span>${esc(s.name)}的故事 · 第${p.index+1} / 4關</span><span>${esc(C.skills[q.skill])}</span></div><progress class="nqs-progress" value="${p.index}" max="4" aria-label="已完成核心關卡"></progress><details class="nqs-profile"><summary>${esc(s.icon)} ${esc(s.name)}，${s.age}歲｜${esc(s.title)}（人物資料）</summary><p><strong>任務：</strong>${esc(s.goal)}</p><ul>${s.profile.map(text=>`<li>${esc(text)}</li>`).join('')}</ul>${s.extra.length?`<details><summary>背景資料（選看）</summary>${s.extra.map(t=>`<p>${esc(t)}</p>`).join('')}</details>`:''}</details><section class="nqs-task"><p class="nqs-eyebrow">${q.newInformation?'新資訊 · 條件改變':'讀資料再決定'}</p><h2 id="nqs-title" tabindex="-1">${esc(q.title)}</h2><p class="nqs-context">${esc(q.context)}</p>${recap}${table}<h3>${esc(q.prompt)}</h3><form id="nqs-form" novalidate>
      ${q.type==='portion'?`<label class="nqs-quantity-label" for="nqs-quantity">全份數量（${esc(q.unit)}）</label><div class="nqs-quantity-row"><input type="number" id="nqs-quantity" min="0.001" max="1000" step="any" inputmode="decimal" value="${st.draft.quantity}" ${locked?'disabled':''}><span>${esc(q.unit)}</span></div>${locked?'':`<div class="nqs-shortcuts" aria-label="常用數量">${[.25,.5,1,2].map((n,i)=>`<button type="button" data-quantity="${n}">${['¼','½','1','2'][i]}</button>`).join('')}</div>`}<p id="nqs-approx" class="nqs-small" role="status"></p><p class="nqs-small">按原配方人數縮放；不是角色的個人建議食量。約克數只作材料量度參考。</p>`:`<fieldset class="nqs-options"><legend>${q.type==='multi'?`選出${q.choose}項`:q.type==='decision'?'先選一個方案':'選一個答案'}</legend>${optionsHTML(q,st,'choice',locked)}</fieldset>${q.type==='decision'?`<fieldset id="nqs-reasons" class="nqs-options nqs-reasons" ${st.draft.choice?'':'hidden'}><legend>再選一個支持理由</legend>${optionsHTML(q,st,'reason',locked)}</fieldset>`:''}`}
      <p id="nqs-selection-status" class="nqs-small" role="status"></p>${locked?'':`<button id="nqs-submit" class="nqs-primary" type="submit">提交本關答案</button>`}</form>
      <div class="nqs-actions">${!locked?button('nqs-hint',st.hinted?'提示已開啟':'給我一個提示'):''}${button('nqs-study','查閱相關營養圖鑑')}</div>${st.hinted?`<p class="nqs-hint" role="note">${esc(q.hint)}</p>`:''}<p id="nqs-action-status" role="status"></p>${locked?feedback(q,st):''}${sourceHTML(q)}</section>`);
    function refresh(){
      const complete=C.validInput(q,st.draft,true);if($('nqs-submit'))$('nqs-submit').disabled=!complete;
      if(q.type==='multi')$('nqs-selection-status').textContent=`已選${st.draft.selected.length} / ${q.choose}項${st.draft.selected.length>q.choose?'，請只保留指定數量。':'。'}`;
      if(q.type==='decision'){$('nqs-reasons').hidden=!st.draft.choice;$('nqs-selection-status').textContent=complete?'方案和理由已選好。':st.draft.choice?'請再選支持理由。':'請先選一個方案。';}
      if(q.type==='portion')$('nqs-approx').textContent=st.draft.quantity===''?'先選全份數量，再核對人數。':`材料約重：${Number((q.measure.gramsPerUnit*st.draft.quantity).toFixed(1))}克（全份）。`;
    }
    refresh();
    if(!locked){
      root.querySelectorAll('input[name="nqs-choice"],input[name="nqs-reason"]').forEach(input=>input.onchange=()=>{
        if(q.type==='multi')st.draft.selected=[...root.querySelectorAll('input[name="nqs-choice"]:checked')].map(x=>x.value);
        else st.draft[input.name==='nqs-reason'?'reason':'choice']=input.value;
        persist();refresh();
      });
      if(q.type==='portion'){
        const setAmount=()=>{const v=$('nqs-quantity').value,n=Number(v);st.draft.quantity=v!==''&&Number.isFinite(n)&&n>=.001&&n<=1000?n:'';persist();refresh();};
        $('nqs-quantity').oninput=setAmount;
        root.querySelectorAll('[data-quantity]').forEach(b=>b.onclick=()=>{$('nqs-quantity').value=b.dataset.quantity;setAmount();});
      }
      $('nqs-form').onsubmit=event=>{event.preventDefault();if(!C.validInput(q,st.draft,true))return;st.attempts.push({input:clone(st.draft),hintUsed:st.hinted});if(st.attempts.length>30)st.attempts.splice(1,1);st.editing=false;persist();render();$('nqs-feedback-title')?.focus();};
      $('nqs-hint').onclick=()=>{st.hinted=true;persist();render();$('nqs-hint')?.focus({preventScroll:true});};
    }else{
      $('nqs-edit').onclick=()=>{st.editing=true;persist();render();focusTitle();};
      $('nqs-next').onclick=()=>{p.index++;state.view=p.index===4?'result':'task';persist();render();focusTitle();};
    }
    $('nqs-study').onclick=()=>{
      if(!window.NutrientBook?.open(q.pedia)){$('nqs-action-status').textContent='圖鑑仍在載入，請稍後再試；本關答案已保留。';return;}
      $('nqs-book-return').hidden=false;$('nqs-book-label').textContent=`正在協助${s.name}完成第${p.index+1}關；選項及進度已保留。`;
    };
  }
  function result(){
    const s=story(),p=progress(),sum=C.summary(s,p),foods=new Map((window.FoodWorkshopPicker?.foods()||[]).map(f=>[f.code,f]));
    const needs=s.tasks.map((q,i)=>p.stages[i].attempts.length&&!C.grade(q,p.stages[i].attempts.at(-1).input).correct?i:-1).filter(i=>i!==-1);
    shell(`<section class="nqs-result"><p class="nqs-eyebrow">${esc(s.name)}的故事 · 4關已完成</p><h2 id="nqs-title" tabindex="-1">看看你怎樣作出決定</h2><p>首次作答符合 <strong>${sum.first} / ${sum.max}</strong> 個判斷點；目前作答符合 <strong>${sum.current} / ${sum.max}</strong> 個。</p><p>提示及修改次數不扣分。這是本故事的學習回顧，不是個人健康或全面營養能力評級。</p></section><ul class="nqs-skill-list">${Object.entries(sum.bySkill).map(([id,v])=>`<li><span>${esc(C.skills[id])}</span><strong>${v.score} / ${v.max}</strong></li>`).join('')}</ul><div class="nqs-actions">${needs.length?button('nqs-review','再想想未符合條件的關卡',true):''}${button('nqs-restart','重新挑戰這個故事')}${button('nqs-other','選另一位人物')}</div><h3>逐關回顧</h3><div class="nqs-review">${s.tasks.map((q,i)=>{const a=p.stages[i].attempts.at(-1),g=C.grade(q,a.input);return `<details><summary>第${i+1}關：${esc(q.title)} · ${g.score}/${g.max}</summary><p>${esc(q.context)}</p><ul>${g.checks.map(c=>`<li>${esc(c.text)}</li>`).join('')}</ul><p>${esc(q.explanation)}</p>${sourceHTML(q)}</details>`;}).join('')}</div><section class="nqs-transfer"><h3>把學過的配搭用在自己的食譜</h3><p>以下是你在符合條件的選擇中用過的食材。逐項選擇，確認份量後再加入餐盤。</p><div class="nqs-foods">${sum.foods.filter(code=>foods.has(code)).map(code=>`<button type="button" data-food="${code}" class="nqs-secondary">到餐盤選${esc(foods.get(code).name)} →</button>`).join('')||'<p>可以先修改未符合條件的選擇，再帶食材到餐盤。</p>'}</div>${s.id==='ching'?'<p class="nqs-small">故事內清單只適用該批產品。實際煮食前仍須由家長按過敏方案核對產品和處理方法。</p>':''}<p id="nqs-action-status" role="status"></p></section>`);
    $('nqs-other').onclick=()=>{state.view='home';persist();render();focusTitle();};
    $('nqs-restart').onclick=()=>{if(!confirm('重新開始會取代這個故事的進度；其他故事及自由練習會保留。繼續？'))return;state.progress[s.id]=C.freshProgress(s);state.view='task';persist();render();focusTitle();};
    if($('nqs-review'))$('nqs-review').onclick=()=>{p.index=needs[0];p.stages[p.index].editing=true;state.view='task';persist();render();focusTitle();};
    root.querySelectorAll('[data-food]').forEach(b=>b.onclick=()=>{
      if(!window.FoodWorkshopPicker?.selectFood(b.dataset.food)){$('nqs-action-status').textContent='食材資料仍在載入，請稍後再試。';return;}
      $('nqs-plate-return').hidden=false;$('nqs-plate-label').textContent=`你從${s.name}的故事選了食材。確認用量後，再按「加入餐盤」。`;$('pedia-return').hidden=true;
      window.switchTab('app');$('food-select').focus({preventScroll:true});$('ingredient-form').scrollIntoView({block:'start',behavior:'auto'});
    });
  }
  function practiceNav(){
    if(state.view!=='practice'||$('nqs-practice-nav'))return;
    const bar=document.createElement('div');bar.id='nqs-practice-nav';bar.className='nqs-practice-nav';
    const back=document.createElement('button');back.type='button';back.textContent='← 返回6個人物情境任務';back.onclick=()=>{state.view='home';persist();render();};bar.append(back);root.prepend(bar);
  }
  function render(){
    $('nqs-book-return').hidden=true;
    if(state.view==='practice'){practice.render();practiceNav();return;}
    if(state.view==='task')question();else if(state.view==='result')result();else home();
  }
  window.addEventListener('nutrition-practice:render',practiceNav);
  window.addEventListener('food-workshop:ready',()=>{if(state.view==='result')result();});
  $('nqs-book-back').onclick=()=>{window.switchTab('quiz');focusTitle();};
  $('nqs-plate-back').onclick=()=>{window.switchTab('quiz');focusTitle();};
  window.initQuiz=render;window.renderQuizQuestion=render;window.showQuizResult=render;
  window.resetQuiz=()=>{state.view='home';persist();render();};
  render();
})();
