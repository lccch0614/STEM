(() => {
  'use strict';
  const C = window.FoodWorkshopCore, $ = id => document.getElementById(id);
  const DRAFT_KEY = 'food-workshop-draft-v1', SETTINGS_KEY = 'food-workshop-settings-v1', QUEUE_KEY = 'food-workshop-queue-v1';
  const fields = {chef:'chef-name-input',title:'recipe-title',equipment:'recipe-equipment',stock:'recipe-stock',waste:'recipe-waste',reason:'recipe-reason',allergy:'recipe-allergy'};
  const fresh = () => ({version:1,chef:'',title:'',equipment:'',stock:'',waste:'',reason:'',allergy:'',servings:1,minutes:25,items:[],steps:[''],size:'standard'});
  let draft = fresh(), database = [], comparison = null, basis = 'person', revision = 0, approved = '', qr = null, qrEpoch = 0;
  let queue = [], pendingAI = null, saveTimer, qrTimer, initialized = false;
  const references = Object.fromEntries(Object.entries(C.nutrients).map(([key,m]) => [key,m.reference]));
  const snapshot = value => JSON.parse(JSON.stringify(value));
  const format = (n,key) => n === null ? '資料不足' : n.toFixed(key === 'calories' ? 0 : 1);
  function error(id,message = '') {$(id).textContent=message;$(id).hidden=!message;}
  function readStorage(key) {try {const raw=localStorage.getItem(key);return raw ? JSON.parse(raw) : null;} catch {return null;}}
  function saveDraft() {
    clearTimeout(saveTimer);
    if (!initialized) return;
    try {localStorage.setItem(DRAFT_KEY,JSON.stringify(draft));$('draft-status').textContent='草稿已儲存在這個瀏覽器；共用裝置前可先下載備份。';}
    catch {$('draft-status').textContent='這個瀏覽器未能儲存草稿，請按「下載草稿」保留作品。';}
  }
  function invalidateQR() {
    qrEpoch++;qr=null;
    ['print-magnet','queue-magnet','export-approved'].forEach(id => $(id).disabled=true);
    $('magnet-preview').hidden=true;$('qr-status').textContent='';error('qr-error');
  }
  function touch(message = '') {
    revision++;approved='';invalidateQR();
    document.querySelectorAll('.review-check').forEach(input => input.checked=false);
    $('review-status').textContent=message || '內容已更新，完成後請老師重新審閱。';
    if (pendingAI) cancelAI('設計已更改，已停止套用舊的 AI 回覆。');
    $('draft-status').textContent='正在儲存草稿…';
    clearTimeout(saveTimer);saveTimer=setTimeout(saveDraft,250);
  }
  function syncFields() {
    for (const [key,id] of Object.entries(fields)) draft[key]=$(id).value;
    for (const [key,id] of [['servings','servings'],['minutes','recipe-minutes']]) {
      const n=Number($(id).value);
      if ($(id).value && $(id).checkValidity()) draft[key]=n;
    }
  }
  function fillFields() {
    for (const [key,id] of Object.entries(fields)) $(id).value=draft[key];
    $('servings').value=draft.servings;$('recipe-minutes').value=draft.minutes;$('magnet-size').value=draft.size;
    renderSteps();renderMaterials();renderNutrition();
  }
  function foodOptions() {
    const category=$('category-select').value, select=$('food-select');
    select.replaceChildren(new Option('請選擇食材',''));
    database.filter(f => category==='all'||f.category===category).forEach(f => select.add(new Option(`${f.name}（${f.categoryName}）`,f.code)));
    showFoodDetail();
  }
  function showFoodDetail() {
    const f=database.find(x => x.code===$('food-select').value);
    $('unit-label').textContent=f?.unit || '份';
    $('food-detail').textContent=f ? `每 ${f.unit} 約 ${f.unitWeight} 克；${C.stateLabel(f)}。營養按每 100 克的原網站課堂估算值計算。` : '';
  }
  function renderMaterials() {
    const tbody=$('plate-list');tbody.replaceChildren();
    if (!draft.items.length) tbody.innerHTML='<tr><td colspan="4">先選一種材料加入，逐步配好這一餐。</td></tr>';
    draft.items.forEach(item => {
      const food=database.find(f => f.code===item.code), row=document.createElement('tr');
      const name=document.createElement('td');
      const strong=document.createElement('strong');strong.textContent=food.name;
      const detail=document.createElement('small');detail.textContent=`約 ${Number((item.grams/food.unitWeight).toFixed(2))} ${food.unit}；${C.stateLabel(food)}`;
      name.append(strong,detail);
      const weightCell=document.createElement('td'), input=document.createElement('input');
      input.type='number';input.min='0.1';input.max='5000';input.step='0.1';input.required=true;input.value=Number(item.grams.toFixed(1));input.setAttribute('aria-label',`${food.name}整份克數`);
      input.addEventListener('input',() => {
        touch('材料份量已更新。請檢查步驟及重新審閱。');
        if (!input.value || !input.checkValidity()) return;
        item.grams=Number(input.value);
        detail.textContent=`約 ${Number((item.grams/food.unitWeight).toFixed(2))} ${food.unit}；${C.stateLabel(food)}`;
        renderNutrition();
      });weightCell.append(input);
      const methodCell=document.createElement('td'), select=document.createElement('select');select.setAttribute('aria-label',`${food.name}烹調方式`);
      C.methods.forEach(m => select.add(new Option(m,m)));select.value=item.method;
      select.addEventListener('change',() => {item.method=select.value;touch('烹調方式已更新，請檢查火力、時間及步驟。');renderMaterials();});methodCell.append(select);
      const action=document.createElement('td'), remove=document.createElement('button');remove.type='button';remove.className='ws-link';remove.textContent='移除';remove.setAttribute('aria-label',`移除${food.name}`);
      remove.addEventListener('click',() => {draft.items=draft.items.filter(i => i.id!==item.id);touch('材料已更新。請檢查步驟及重新審閱。');renderMaterials();renderNutrition();});action.append(remove);
      row.append(name,weightCell,methodCell,action);tbody.append(row);
    });
    const warning=C.warnings(draft.items,database), container=$('safety-warnings');container.replaceChildren();
    warning.blocking.forEach(message => {const p=document.createElement('p');p.className='ws-error';p.textContent=message;container.append(p);});
    if (draft.items.length) {
      const p=document.createElement('p');p.className='ws-note';p.textContent=`按食材名稱提示可能涉及：${warning.allergens.join('、') || '未識別到已列食物致敏物'}。提示不是完整致敏物清單；仍須由成人查看包裝、交叉接觸及個別飲食需要。`;container.append(p);
    }
    $('save-comparison-btn').disabled=!draft.items.length;
  }
  function renderNutrition() {
    const perPerson=basis==='person', current=C.totals(draft.items,database,perPerson?draft.servings:1);
    const before=comparison ? C.totals(comparison.items,database,perPerson?comparison.servings:1) : null;
    const weight=draft.items.reduce((n,i) => n+i.grams,0);
    $('plate-summary').textContent=`${draft.items.length} 項材料，整份共 ${Number(weight.toFixed(1))} 克，供 ${draft.servings} 人；現在顯示${perPerson?'每人':'整份'}營養估算。`;
    $('comparison-message').textContent=comparison ? `已記錄調整前（${comparison.servings} 人份）；${perPerson?'前後各按當時人數換算每人份量。':'正在比較整份總量，人數不同亦會影響結果。'}` : '配好材料後先記錄調整前，再改一項份量，觀察差異。';
    $('clear-comparison-btn').disabled=!comparison;
    const charts=$('nutrition-charts');charts.replaceChildren();
    for (const [key,meta] of Object.entries(C.nutrients)) {
      const section=document.createElement('section');section.className='chart-item';
      const heading=document.createElement('div');heading.className='chart-header';
      const label=document.createElement('strong');label.textContent=meta.label;
      const amount=document.createElement('span');amount.textContent=`${format(current[key],key)}${current[key]===null?'':` ${meta.unit}`}`;heading.append(label,amount);section.append(heading);
      const target=document.createElement('p');target.className='nutrition-target';target.textContent=`虛線：課堂比較示例 ${references[key]} ${meta.unit}，不是個人建議量。`;section.append(target);
      for (const [name,values,kind] of [...(before?[['調整前',before,'previous']]:[]),['現在',current,'current']]) {
        const row=document.createElement('div');row.className='nutrition-track-row';
        const text=document.createElement('span');text.textContent=name;
        const track=document.createElement('div');track.className='nutrition-track';track.setAttribute('role','img');track.setAttribute('aria-label',`${meta.label}，${name}：${format(values[key],key)} ${meta.unit}`);
        const fill=document.createElement('div');fill.className=`nutrition-fill ${kind}`;fill.style.width=`${values[key]===null?0:Math.min(values[key]/references[key]*50,100)}%`;
        const reference=document.createElement('span');reference.className='nutrition-reference';reference.setAttribute('aria-hidden','true');track.append(fill,reference);
        const value=document.createElement('span');value.className='nutrition-ratio';value.textContent=format(values[key],key);row.append(text,track,value);section.append(row);
      }
      const status=document.createElement('p');status.className='nutrition-status';
      status.textContent=before ? (current[key]===null||before[key]===null?'資料不足，無法計算差值。':`調整前 ${format(before[key],key)} → 現在 ${format(current[key],key)} ${meta.unit}；差值 ${current[key]-before[key]>0?'+':''}${format(current[key]-before[key],key)} ${meta.unit}。`) : '長條表示數量，並非健康評分。';
      if (current[key]!==null && current[key]>references[key]*2) status.textContent+=' 超出圖表刻度，請看實際數值。';
      section.append(status);charts.append(section);
    }
  }
  function renderSteps(focusLast=false) {
    const root=$('recipe-step-editors');root.replaceChildren();
    draft.steps.forEach((step,index) => {
      const row=document.createElement('div');row.className='ws-step';
      const label=document.createElement('label');label.textContent=`步驟 ${index+1}`;
      const area=document.createElement('textarea');area.rows=2;area.maxLength=180;area.value=step;area.placeholder='寫清楚做甚麼、火力、時間，以及誰需要成人協助。';area.id=`recipe-step-${index}`;
      area.addEventListener('input',() => {draft.steps[index]=area.value;touch();});label.append(area);
      const remove=document.createElement('button');remove.type='button';remove.className='ws-link';remove.textContent='刪除此步';remove.disabled=draft.steps.length===1;
      remove.addEventListener('click',() => {draft.steps.splice(index,1);touch();renderSteps();});row.append(label,remove);root.append(row);
    });
    $('add-step').disabled=draft.steps.length>=10;
    if (focusLast) $(`recipe-step-${draft.steps.length-1}`).focus();
  }
  function validPayload() {
    syncFields();
    for (const id of ['servings','recipe-minutes']) if (!$(id).value||!$(id).reportValidity()) throw new Error('請先填妥有效人數及時間。');
    for (const input of $('plate-list').querySelectorAll('input')) if (!input.value||!input.reportValidity()) throw new Error('請先填妥所有材料的有效克數。');
    return C.payload(draft,database);
  }
  function cancelAI(message='已停止等待；你可以繼續手動編輯。') {
    const controller=pendingAI;pendingAI=null;controller?.abort();
    $('ai-analyze-btn').disabled=false;$('cancel-ai').hidden=true;$('ai-status').textContent=message;
  }
  async function generateAI() {
    error('ai-error');syncFields();
    if (!draft.items.length) {error('ai-error','請先加入食材，再請 AI 提供初稿。');return;}
    const problems=C.warnings(draft.items,database).blocking;
    if (problems.length) {error('ai-error',problems.join(' '));return;}
    if (!PRESET_OPENROUTER_KEY?.trim()) {error('ai-error','尚未設定 AI 連線。你仍可直接編輯食譜。');return;}
    if ((draft.title.trim()||draft.steps.some(s => s.trim())) && !confirm('AI 初稿會取代目前菜名和步驟；其他設計內容會保留。繼續？')) return;
    const version=revision, materials=snapshot(draft.items), context=snapshot(draft);
    const controller=new AbortController();pendingAI=controller;
    $('ai-analyze-btn').disabled=true;$('cancel-ai').hidden=false;$('ai-status').textContent='AI 正在提供初稿；你可停止等待，改用手動編輯。';
    let timedOut=false;
    const timer=setTimeout(() => {timedOut=true;controller.abort();},60000);
    try {
      const itemDescriptions=materials.map(i => ({id:i.id,name:database.find(f => f.code===i.code).name,grams:i.grams,method:i.method}));
      const prompt=`你是香港高小親子煮食工作坊的食譜編寫助手。請使用繁體中文提供可供學生修改的初稿，不作健康評分或個人營養診斷。使用下列所有材料，完整保留 id 和克數，不可刪除材料、改份量或新增未列出的材料（包括油、糖、鹽、醬料及清水）。若材料不適合組合成安全可行食譜，回傳 {"error":"簡短說明需要先如何調整材料"}。步驟須包含適當火力、估計時間、熟透檢查及成人協助，不能為了縮短 QR code 省略安全資訊。提供 1 至 10 個步驟，每步最多180字，菜名最多40字。設計條件：${JSON.stringify({servings:context.servings,minutes:context.minutes,equipment:context.equipment,stock:context.stock,allergyNotes:context.allergy,materials:itemDescriptions})}。只輸出有效 JSON，格式：{"recipeTitle":"菜名","materials":[{"id":"原材料id","grams":原克數}],"recipeSteps":["步驟文字"]}。`;
      const response=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${PRESET_OPENROUTER_KEY.trim()}`},body:JSON.stringify({model:'openrouter/free',messages:[{role:'system',content:prompt},{role:'user',content:'請提供食譜初稿。'}],temperature:0.4}),signal:controller.signal});
      const body=await response.json();
      if (!response.ok||body.error) throw new Error(`OpenRouter ${response.status}: ${body.error?.message||'未能提供初稿'}`);
      const content=body.choices?.[0]?.message?.content;
      if (typeof content!=='string') throw new Error('AI 沒有回傳可讀取的食譜，請重試或手動編輯。');
      const raw=JSON.parse(content.replace(/<think>[\s\S]*?<\/think>/g,'').replace(/^\s*```(?:json)?\s*/,'').replace(/\s*```\s*$/,'').trim());
      if (raw.error) throw new Error(String(raw.error).slice(0,300));
      const result=C.parseAI(raw,materials);
      if (pendingAI!==controller||revision!==version) return;
      pendingAI=null;draft.title=result.title;draft.steps=result.steps;touch('AI 初稿已加入。請學生檢查、修改及說明理由，再請老師審閱。');
      $('recipe-title').value=draft.title;renderSteps();$('ai-status').textContent='初稿已加入；請核對每項材料是否在步驟中使用，並記下你的修改理由。';
    } catch (e) {
      if (pendingAI===controller) {
        if (e.name==='AbortError') error('ai-error',timedOut?'等待超過一分鐘。你可以重試，或直接手動完成食譜。':'已停止等待。');
        else error('ai-error',`${e.message}。目前草稿仍然保留，你可重試或手動編輯。`);
        $('ai-status').textContent='';
      }
    } finally {
      clearTimeout(timer);
      if (pendingAI===controller) pendingAI=null;
      if (!pendingAI) {$('ai-analyze-btn').disabled=false;$('cancel-ai').hidden=true;}
    }
  }
  function autoBase() {
    try {return C.shareBase(location.href);} catch {return '';}
  }
  function settingsSave() {
    try {localStorage.setItem(SETTINGS_KEY,JSON.stringify({base:$('share-base').value,size:draft.size}));} catch {/* Draft download remains available. */}
  }
  async function buildQR(payload,base,size) {
    if (!window.LZString||!window.QRCode) throw new Error('QR 程式尚未載入；請檢查網絡後重新整理。草稿仍可下載。');
    const validated=C.validatePayload(payload), url=`${C.shareBase(base)}#recipe=${LZString.compressToEncodedURIComponent(JSON.stringify(validated))}`;
    let symbol;
    try {symbol=QRCode.create(url,{errorCorrectionLevel:'M'});} catch {throw new Error('這份食譜超出 QR code 容量。請保留重要安全資訊，精簡重複文字後再審閱；不會自動刪除內容。');}
    const dimensions=C.sizes[size], moduleMM=dimensions.qr/(symbol.modules.size+8);
    if (moduleMM<0.32) throw new Error(`這份食譜的 QR code 在 ${dimensions.label} 磁貼太密。請選更大尺寸，或精簡重複文字；不會自動截短食譜。`);
    const dataURL=await QRCode.toDataURL(url,{errorCorrectionLevel:'M',width:Math.max(600,(symbol.modules.size+8)*6),margin:4});
    return {payload:validated,url,dataURL,size,version:symbol.version,moduleMM};
  }
  function magnetNode(entry) {
    const size=C.sizes[entry.size], card=document.createElement('article');card.className='ws-magnet';
    card.style.setProperty('--magnet-width',`${size.width}mm`);card.style.setProperty('--magnet-height',`${size.height}mm`);card.style.setProperty('--qr-width',`${size.qr}mm`);
    for (const [className,text] of [['ws-magnet-brand','創科「惜」食小廚師'],['ws-magnet-chef',entry.payload.c],['ws-magnet-title',entry.payload.t]]) {
      const div=document.createElement('div');div.className=className;div.textContent=text;card.append(div);
    }
    const img=document.createElement('img');img.src=entry.dataURL;img.alt=`${entry.payload.t}完整食譜 QR code`;card.append(img);
    const footer=document.createElement('div');footer.className='ws-magnet-footer';footer.textContent='掃碼看材料及做法\n和家人一起惜食';footer.style.whiteSpace='pre-line';card.append(footer);return card;
  }
  async function refreshQR() {
    invalidateQR();if (!approved) return;
    const epoch=qrEpoch;
    $('qr-status').textContent='正在準備 QR code…';
    try {
      const payload=validPayload(), fingerprint=JSON.stringify(payload);
      if (fingerprint!==approved) {approved='';throw new Error('內容有變更，請重新審閱。');}
      const entry=await buildQR(payload,$('share-base').value,draft.size);
      if (epoch!==qrEpoch||approved!==fingerprint) return;
      const card=magnetNode(entry);
      $('magnet-preview').replaceChildren(card);$('magnet-preview').hidden=false;
      await card.querySelector('img').decode();
      if (epoch!==qrEpoch||approved!==fingerprint) return;
      if (card.scrollHeight>card.clientHeight+2) throw new Error('菜名或代號超出磁貼高度，請選較大尺寸再打印。');
      qr={...entry,fingerprint,base:C.shareBase($('share-base').value)};
      $('qr-status').textContent=`QR code 已準備。尺寸 ${C.sizes[draft.size].label}；請先試印並用家長手機掃描。`;
      ['print-magnet','queue-magnet','export-approved'].forEach(id => $(id).disabled=false);
    } catch (e) {if (epoch===qrEpoch) {error('qr-error',e.message);$('qr-status').textContent='尚未準備好可列印的 QR code。';if(e.message.includes('網址'))$('share-base').closest('details').open=true;}}
  }
  function ensureQR() {if (!qr||!approved||qr.fingerprint!==JSON.stringify(validPayload())||qr.size!==draft.size||qr.base!==C.shareBase($('share-base').value)) throw new Error('QR code 尚未準備好，請完成審閱及確認網址。');return qr;}
  function download(filename,data) {
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(() => URL.revokeObjectURL(url),1000);
  }
  async function jsonFile(file) {
    if (!file||file.size>1000000) throw new Error('請選擇小於 1MB 的作品 JSON 檔案。');
    return JSON.parse(await file.text());
  }
  function queueSave() {
    try {localStorage.setItem(QUEUE_KEY,JSON.stringify(queue));return true;} catch {$('queue-status').textContent='佇列未能儲存在瀏覽器；請先打印，並保留作品檔案。';return false;}
  }
  function renderQueue() {
    const root=$('print-queue-list');root.replaceChildren();
    queue.forEach((entry,index) => {
      const li=document.createElement('li'), text=document.createElement('span');text.textContent=`${entry.payload.c}：${entry.payload.t}`;
      const actions=document.createElement('div');actions.className='ws-actions';
      const size=document.createElement('select');size.setAttribute('aria-label',`${entry.payload.c}磁貼尺寸`);
      Object.entries(C.sizes).forEach(([key,value]) => size.add(new Option(value.label,key)));size.value=entry.size;
      size.addEventListener('change',() => {entry.size=size.value;queueSave();});
      const remove=document.createElement('button');remove.className='ws-link';remove.type='button';remove.textContent='移除';remove.addEventListener('click',() => {queue.splice(index,1);queueSave();renderQueue();});
      actions.append(size,remove);li.append(text,actions);root.append(li);
    });
    $('print-queue').disabled=!queue.length;$('queue-status').textContent=`本機佇列有 ${queue.length} 份作品；不同磁貼尺寸會分頁打印。`;
  }
  async function printEntries(entries) {
    const root=$('print-root');root.replaceChildren();
    for (const sizeKey of Object.keys(C.sizes)) {
      const group=entries.filter(e => e.size===sizeKey), size=C.sizes[sizeKey];
      for (let start=0;start<group.length;start+=size.perPage) {
        const page=document.createElement('div');page.className='ws-print-page';page.style.setProperty('--print-columns',size.columns);page.style.setProperty('--magnet-width',`${size.width}mm`);
        group.slice(start,start+size.perPage).forEach(entry => page.append(magnetNode(entry)));root.append(page);
      }
    }
    root.classList.add('ws-measuring');
    try {
      await Promise.all([...root.querySelectorAll('img')].map(img => img.decode()));
      if ([...root.querySelectorAll('.ws-magnet')].some(card => card.scrollHeight>card.clientHeight+2)) throw new Error('菜名或代號超出磁貼高度，請選較大尺寸再打印。');
    } finally {root.classList.remove('ws-measuring');}
    window.print();
  }
  function renderParent(payload,preview=false) {
    const p=C.validatePayload(payload), root=$('view-parent-recipe');root.replaceChildren();
    const hero=document.createElement('header');hero.className='hero-banner';
    const title=document.createElement('h1');title.className='hero-title';title.textContent=p.t;
    const author=document.createElement('p');author.textContent=`${p.c} 的親子食譜`;
    hero.append(author,title);
    const meta=document.createElement('p');meta.className='ws-parent-meta';meta.textContent=p.v===2?`${p.n} 人份 · 預計 ${p.m} 分鐘 · 器具：${p.e}`:'這是舊版食譜，未記錄人數及器具，請與孩子確認。';hero.append(meta);root.append(hero);
    function section(heading) {const section=document.createElement('section');section.className='card';const h=document.createElement('h2');h.textContent=heading;section.append(h);root.append(section);return section;}
    const shop=section('完整材料與買餸清單'), list=document.createElement('div');list.className='ws-parent-list';
    p.i.forEach(ingredient => {const label=document.createElement('label'), input=document.createElement('input'), text=document.createElement('span');input.type='checkbox';text.textContent=ingredient;label.append(input,text);list.append(label);});shop.append(list);
    const steps=section('與孩子共同下廚'), ol=document.createElement('ol');ol.className='ws-parent-steps';p.s.forEach(step => {const li=document.createElement('li');li.textContent=step;ol.append(li);});steps.append(ol);
    if (p.v===2) {
      const learning=section('孩子的設計與惜食方法');
      for (const [label,value] of [['惜食方法',p.w],['設計修改理由',p.r],['敏感食材核對備註',p.a||'未填寫，請成人核對'],['按食材名稱提示',p.z||'未識別；仍須查看包裝及個別飲食需要']]) {const para=document.createElement('p'), strong=document.createElement('strong');strong.textContent=`${label}：`;para.append(strong,document.createTextNode(value));learning.append(para);}
      const nutrition=section('每人營養估算');
      const values=document.createElement('p');values.textContent=Object.entries(C.nutrients).map(([key,m]) => `${m.label} ${format(p.u[key],key)}${p.u[key]===null?'':m.unit}`).join(' · ');nutrition.append(values);
      const note=document.createElement('p');note.className='ws-note';note.textContent='原網站課堂估算資料，未逐項核定來源及生熟狀態；並非個人飲食建議，未包含獨立糖及鈉數據。';nutrition.append(note);
    }
    const safe=section('親子煮食提醒'), safeText=document.createElement('p');safeText.textContent=C.safety;safe.append(safeText);
    const feedback=section('家庭實踐小記');
    const note=document.createElement('p');note.textContent='這份小記只保存在這個瀏覽器；可把內容告訴老師，或另行拍照記錄。';feedback.append(note);
    const label=document.createElement('label');label.textContent='份量是否合適？下次想怎樣調整？';const area=document.createElement('textarea');area.rows=3;area.maxLength=400;label.append(area);feedback.append(label);
    // The compressed payload identifies this recipe without storing personal information in the key.
    const compressed=window.LZString?.compressToEncodedURIComponent(JSON.stringify(p));let hash=2166136261;for (const ch of compressed||JSON.stringify(p)) hash=Math.imul(hash^ch.charCodeAt(0),16777619);
    const key=`food-family-note-${(hash>>>0).toString(16)}`;
    try {area.value=localStorage.getItem(key)||'';} catch {/* Optional local note. */}
    const status=document.createElement('p');status.setAttribute('role','status');feedback.append(status);
    area.addEventListener('input',() => {try {localStorage.setItem(key,area.value);status.textContent='家庭小記已保存在這個瀏覽器。';} catch {status.textContent='未能儲存，請自行複製保留。';}});
    const back=document.createElement('button');back.className='ws-secondary';back.type='button';back.textContent=preview?'返回修改我的食譜':'設計另一份食譜';back.addEventListener('click',() => {if (!preview) history.replaceState(null,'',location.pathname+location.search);switchTab('app');});root.append(back);switchTab('parent-recipe');
  }
  function restoreQueue() {
    const saved=readStorage(QUEUE_KEY);
    if (!Array.isArray(saved)) return;
    queue=saved.slice(0,60).flatMap(entry => {try {return [{payload:C.validatePayload(entry.payload),size:Object.hasOwn(C.sizes,entry.size)?entry.size:'standard',base:C.shareBase(entry.base)}];} catch {return [];}});
  }
  async function loadFoods() {
    try {
      const response=await fetch('./data/foods.json');if (!response.ok) throw new Error('未能載入食材資料。');
      const data=await response.json();
      if (!Array.isArray(data)||!data.length||data.some(f => typeof f.code!=='string'||typeof f.name!=='string'||!Number.isFinite(f.unitWeight)||f.unitWeight<=0)) throw new Error('食材資料格式無效。');
      database=data;foodOptions();
      const saved=readStorage(DRAFT_KEY);
      if (saved) {try {draft=C.validateDraft(saved,database);$('draft-status').textContent='已恢復上次草稿。完成後請重新審閱。';} catch {$('draft-status').textContent='上次草稿無法恢復；可開啟下載過的草稿。';}}
      initialized=true;fillFields();
    } catch (e) {
      error('food-error',`${e.message} 請以網站網址開啟並檢查網絡；目前不會使用未載入的資料估算營養。`);
      $('food-select').replaceChildren(new Option('資料未載入，請重新整理',''));$('add-btn').disabled=true;$('ai-analyze-btn').disabled=true;
    }
  }
  function bind() {
    $('fixed-safety').textContent=C.safety;
    C.methods.forEach(method => $('cooking-select').add(new Option(method,method)));
    $('category-select').addEventListener('change',foodOptions);$('food-select').addEventListener('change',showFoodDetail);
    $('ingredient-form').addEventListener('submit',event => {
      event.preventDefault();error('food-error');
      try {
        const food=database.find(f => f.code===$('food-select').value), qty=Number($('food-qty').value);
        if (!food||!qty||!$('food-qty').reportValidity()) throw new Error('請選擇食材及有效數量。');
        if (draft.items.length>=30) throw new Error('每份作品最多30項材料，請先整理材料清單。');
        const grams=Number((qty*food.unitWeight).toFixed(1)), method=$('cooking-select').value;
        const existing=draft.items.find(i => i.code===food.code&&i.method===method);
        if (existing) existing.grams=C.makeItem(food,existing.grams+grams,method,existing.id).grams;
        else draft.items.push(C.makeItem(food,grams,method,crypto.randomUUID()));
        touch('材料已更新。請檢查步驟及重新審閱。');renderMaterials();renderNutrition();
      } catch (e) {error('food-error',e.message);}
    });
    $('reset-btn').addEventListener('click',() => {if (draft.items.length&&confirm('清空所有材料？食譜文字會保留供你修改。')) {draft.items=[];comparison=null;touch('材料已清空，請重新配好材料及修改步驟。');renderMaterials();renderNutrition();}});
    for (const id of [...Object.values(fields),'servings','recipe-minutes']) $(id).addEventListener('input',() => {syncFields();touch();if (id==='servings') renderNutrition();});
    $('add-step').addEventListener('click',() => {if (draft.steps.length<10) {draft.steps.push('');touch();renderSteps(true);}});
    $('nutrition-basis').addEventListener('change',() => {basis=$('nutrition-basis').value;renderNutrition();});
    $('save-comparison-btn').addEventListener('click',() => {comparison={items:snapshot(draft.items),servings:draft.servings};renderNutrition();});
    $('clear-comparison-btn').addEventListener('click',() => {comparison=null;renderNutrition();});
    $('reference-form').addEventListener('submit',event => {event.preventDefault();for (const key of Object.keys(references)) references[key]=Number($(`reference-${key}`).value);renderNutrition();});
    $('manual-help').addEventListener('click',() => {$('manual-tips').hidden=!$('manual-tips').hidden;$('recipe-title').focus();});
    $('ai-analyze-btn').addEventListener('click',generateAI);$('cancel-ai').addEventListener('click',() => cancelAI());
    $('approve-recipe').addEventListener('click',() => {
      error('qr-error');
      try {
        const payload=validPayload();
        if (![...document.querySelectorAll('.review-check')].every(input => input.checked)) throw new Error('請老師先核對全部四個項目。');
        approved=JSON.stringify(payload);$('review-status').textContent='此版本已完成課堂審閱。請確認家長網址及磁貼尺寸。';saveDraft();refreshQR();
      } catch (e) {$('review-status').textContent=e.message;}
    });
    document.querySelectorAll('.review-check').forEach(input => input.addEventListener('change',() => {approved='';invalidateQR();$('review-status').textContent='請完成核對後按「完成審閱」。';}));
    $('share-base').addEventListener('input',() => {settingsSave();invalidateQR();clearTimeout(qrTimer);if (approved) qrTimer=setTimeout(refreshQR,400);});
    $('magnet-size').addEventListener('change',() => {draft.size=$('magnet-size').value;settingsSave();saveDraft();refreshQR();});
    $('preview-parent').addEventListener('click',() => {try {renderParent(validPayload(),true);} catch (e) {$('review-status').textContent=e.message;$('review-status').scrollIntoView({block:'center'});}});
    $('print-magnet').addEventListener('click',async() => {try {await printEntries([ensureQR()]);} catch (e) {error('qr-error',e.message);}});
    $('queue-magnet').addEventListener('click',() => {
      try {const entry=ensureQR();if (queue.length>=60) throw new Error('佇列最多60份作品，請先打印或移除部分作品。');
        if (queue.some(x => JSON.stringify(x.payload)===entry.fingerprint&&x.base===entry.base)) throw new Error('這個版本已在佇列。');
        queue.push({payload:snapshot(entry.payload),size:entry.size,base:entry.base});renderQueue();queueSave();
      } catch (e) {error('qr-error',e.message);}
    });
    $('export-draft').addEventListener('click',() => {syncFields();saveDraft();download('我的惜食食譜-草稿.json',draft);});
    $('export-approved').addEventListener('click',() => {try {const entry=ensureQR();download('我的惜食食譜-已審閱.json',{kind:'food-workshop-approved',version:1,payload:entry.payload,size:entry.size});} catch (e) {error('qr-error',e.message);}});
    $('import-draft').addEventListener('change',async event => {
      try {if (!initialized) throw new Error('請先成功載入食材資料。');const incoming=C.validateDraft(await jsonFile(event.target.files[0]),database);
        if (!confirm('開啟草稿會取代目前作品；如要保留，請先取消並下載目前草稿。繼續？')) return;
        draft=incoming;comparison=null;touch('已開啟草稿，請檢查內容及重新審閱。');fillFields();saveDraft();
      } catch (e) {$('draft-status').textContent=e.message;} finally {event.target.value='';}
    });
    $('new-project').addEventListener('click',() => {if (!confirm('開始另一份作品會取代目前草稿；如要保留，請先下載。繼續？')) return;draft=fresh();comparison=null;touch('已開始新作品。');fillFields();saveDraft();});
    $('import-approved').addEventListener('change',async event => {
      try {
        const files=[...event.target.files];if (!files.length) return;if (files.length+queue.length>60) throw new Error('佇列最多60份作品。');
        const base=C.shareBase($('share-base').value), incoming=[];
        for (const file of files) {const raw=await jsonFile(file);if (raw.kind!=='food-workshop-approved'||raw.version!==1||raw.payload?.v!==2) throw new Error(`${file.name} 不是新版已審閱作品檔案。`);incoming.push({payload:C.validatePayload(raw.payload),size:Object.hasOwn(C.sizes,raw.size)?raw.size:'standard',base});}
        if (!confirm(`請老師先核對這 ${incoming.length} 份匯入作品的材料、做法、敏感食材及學生說明。確認已審閱並加入列印佇列？`)) return;
        let added=0;for (const entry of incoming) if (!queue.some(x => JSON.stringify(x.payload)===JSON.stringify(entry.payload)&&x.base===entry.base)) {queue.push(entry);added++;}
        renderQueue();queueSave();$('queue-status').textContent=`已匯入 ${added} 份作品，略過重複作品。`;
      } catch (e) {$('queue-status').textContent=e.message;} finally {event.target.value='';}
    });
    $('print-queue').addEventListener('click',async() => {
      const button=$('print-queue');button.disabled=true;
      try {const prepared=[];for (const entry of queue) {try {prepared.push(await buildQR(entry.payload,entry.base,entry.size));} catch (e) {throw new Error(`${entry.payload.c}「${entry.payload.t}」：${e.message}`);}}
        if (!prepared.length) throw new Error('佇列沒有作品。');await printEntries(prepared);$('queue-status').textContent='已開啟列印視窗，請用實際大小／100%及 A4 紙打印，再測試掃碼。';
      } catch (e) {$('queue-status').textContent=e.message;} finally {button.disabled=!queue.length;}
    });
    window.addEventListener('pagehide',saveDraft);
  }
  async function boot() {
    const root=document.createElement('div');root.id='print-root';document.body.append(root);
    bind();
    const settings=readStorage(SETTINGS_KEY);$('share-base').value=typeof settings?.base==='string'?settings.base:autoBase();
    restoreQueue();renderQueue();fillFields();
    if (location.hash.startsWith('#recipe=')) {
      try {if (!window.LZString) throw new Error('壓縮程式未載入，請檢查網絡並重新整理。');renderParent(C.decodeHash(location.hash,LZString));}
      catch (e) {error('food-error',`未能開啟這個食譜：${e.message}`);switchTab('app');}
    }
    await loadFoods();
  }
  boot();
})();
