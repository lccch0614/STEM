(() => {
  'use strict';
  const C = window.FoodWorkshopCore, P = window.PortionTools, Pub=window.WorkshopPublication, A=window.WorkshopAI, $ = id => document.getElementById(id);
  const DRAFT_KEY = 'food-workshop-draft-v1', SETTINGS_KEY = 'food-workshop-settings-v1', QUEUE_KEY = 'food-workshop-queue-v1';
  const PORTION_SETTINGS_KEY='food-workshop-portions-v1';
  let portionCatalog={},retiredFoods={},workshopMeasures={},teacherPhoto='',teacherPhotoEpoch=0;
  const foodEmoji = {"carb_001":"🍚","carb_002":"🍚","grain_016":"🍚","carb_003":"🍝","carb_005":"🍝","carb_004":"🍜","grain_014":"🍜","grain_015":"🍜","carb_006":"🍞","carb_008":"🥔","grain_017":"🥔","dairy_001":"🥛","dairy_002":"🥛","dairy_005":"🥛","dairy_006":"🥛","soy_003":"🥛","veg_002":"🥦","veg_003":"🥬","veg_005":"🥬","veg_011":"🥬","veg_012":"🥬","veg_013":"🥬","veg_014":"🥬","veg_015":"🥬","veg_004":"🥕","veg_006":"🍅","veg_008":"🍄","veg_029":"🍄","veg_030":"🍄","veg_031":"🍄","veg_032":"🍄","veg_009":"🥒","veg_016":"🥒","veg_010":"🎃","fruit_001":"🍎","fruit_002":"🍌","fruit_003":"🍊","fruit_015":"🍊","fruit_004":"🥝","fruit_005":"🍇","fruit_006":"🍉","fruit_007":"🥭","fruit_012":"🥭","seas_009":"🧂","seas_010":"🧂","meat_001":"🥩","meat_002":"🥩","meat_003":"🍗","meat_004":"🍗","meat_010":"🍗","meat_005":"🐟","meat_009":"🐟","fish_001":"🐟","fish_002":"🐟","meat_007":"🦐","egg_001":"🥚","egg_002":"🥚","egg_004":"🥚","egg_005":"🥚","liq_001":"💧","grain_011":"🍠","grain_012":"🌽","veg_017":"🍆","veg_018":"🫑","veg_019":"🫑","veg_020":"🫑","veg_021":"🧅","veg_022":"🧅","veg_023":"🧄","veg_024":"🫚","bean_001":"🫘","bean_002":"🫘","bean_003":"🫘","bean_004":"🫘","bean_005":"🫘","nut_004":"🥜","sea_001":"🦑","fruit_008":"🍓","fruit_009":"🫐","fruit_011":"🍍","fruit_013":"🍐","fruit_014":"🍋","fruit_016":"🍑","fruit_019":"🥑","dairy_008":"🧈","dairy_009":"🧀"};
  const foodLabel = food => `${foodEmoji[food.code] ? foodEmoji[food.code] + " " : ""}${food.name}`;
  const fields = {chef:'chef-name-input',title:'recipe-title',stock:'recipe-stock',allergy:'recipe-allergy'};
  const equipmentOptions=['煮食爐','鑊／平底鑊','湯鍋','電飯煲','蒸鍋','焗爐','微波爐','不用加熱'];
  const fresh = () => ({version:1,dataVersion:'2026-10-27-portions-v3',chef:'小廚師',title:'',equipment:'',stock:'',waste:'',reason:'',allergy:'',servings:1,minutes:0,items:[],steps:[''],size:'acrylic'});
  let draft = fresh(), database = [], comparison = null, basis = 'total', revision = 0, approved = '', qr = null, qrEpoch = 0;
  let lastTextDiagnostic=null;
  let queue = [], pendingAI = null, pendingImage = null, currentAnalysis = null, conceptImage = null, saveTimer, qrTimer, initialized = false;
  const references = Object.fromEntries(Object.entries(C.nutrients).map(([key,m]) => [key,m.reference]));
  const snapshot = value => JSON.parse(JSON.stringify(value));
  const format = (n,key) => n === null ? '資料不足' : n.toFixed(key === 'calories' ? 0 : 1);
  function error(id,message = '') {$(id).textContent=message;$(id).hidden=!message;}
  function readStorage(key) {try {const raw=localStorage.getItem(key);return raw ? JSON.parse(raw) : null;} catch {return null;}}
  function reviewedDraft(raw) {
    if(!raw||!Array.isArray(raw.items))throw new Error('草稿格式無效。');
    const removed=raw.items.filter(item=>Object.hasOwn(retiredFoods,item.code));
    const value=C.validateDraft({...raw,items:raw.items.filter(item=>!Object.hasOwn(retiredFoods,item.code))},database,portionCatalog);
    // Removing an ingredient invalidates its old instructions, while the original stays downloadable.
    if(removed.length){value.steps=[''];value.minutes=0;}
    return {value,removed};
  }
  function draftReviewNotice(raw,removed=[],failure='') {
    const node=$('food-data-notice');node.hidden=false;
    const archived=readStorage('food-workshop-draft-before-food-review-v1');
    const alreadyCurrent=!failure&&!removed.length&&raw.dataVersion===database[0]?.dataVersion;
    if(alreadyCurrent&&!archived){node.hidden=true;return;}
    const names=[...new Set(removed.map(item=>retiredFoods[item.code]))];
    node.textContent=alreadyCurrent?'已保留上次食材資料更新前的原稿備份，可隨時下載。':failure?'原草稿未套用：'+failure+' 原稿仍可在此下載。':names.length?`本版已抽起：${names.join('、')}。已保留其餘材料克數、菜名及原稿備份；舊步驟已清空，請重新生成或填寫做法。`:'食材資料庫已核對更新；原有克數保留，營養按本版來源重新計算。請核對食材名稱、生熟狀態及份量單位。';
    if(removed.length||failure){try{localStorage.setItem('food-workshop-draft-before-food-review-v1',JSON.stringify(raw));}catch{}
    }
    const backup=removed.length||failure?raw:archived;
    if(backup){const button=document.createElement('button');button.type='button';button.className='ws-link';button.textContent='下載更新前原稿';button.addEventListener('click',()=>download('食材更新前-原稿備份.json',backup));node.append(document.createTextNode(' '),button);}
  }
  function saveDraft() {
    clearTimeout(saveTimer);
    if (!initialized) return;
    try {draft.dataVersion=database[0]?.dataVersion||draft.dataVersion||'';localStorage.setItem(DRAFT_KEY,JSON.stringify(draft));$('draft-status').textContent='已自動儲存。';}
    catch {$('draft-status').textContent='這個瀏覽器未能儲存草稿，請按「下載草稿」保留作品。';}
    if(conceptImage?.key===conceptKey())persistConcept();
    Pub.notify();
  }
  function invalidateQR() {
    qrEpoch++;qr=null;
    ['print-magnet','queue-magnet','export-approved'].forEach(id => $(id).disabled=true);
    $('magnet-preview').hidden=true;$('qr-status').textContent='';error('qr-error');
  }
  function touch(message = '') {
    revision++;approved='';invalidateQR();
    renderAdvice();
    if ((pendingImage&&pendingImage.key!==conceptKey())||(conceptImage&&conceptImage.key!==conceptKey())) resetConcept('食譜已更新，可重新生成概念圖。');
    $('review-status').textContent=(draft.title.trim()&&draft.steps.some(s=>s.trim())) ? (message || '食譜已更新。') : '';
    if (pendingAI) cancelAI('設計已更改，已停止套用舊的 AI 回覆。');
    $('draft-status').textContent='正在儲存草稿…';
    clearTimeout(saveTimer);saveTimer=setTimeout(saveDraft,250);renderRecipePreview();Pub.notify();
  }
  function syncFields() {
    for (const [key,id] of Object.entries(fields)) draft[key]=$(id).value;
    draft.equipment=[...$('equipment-choices').querySelectorAll('input:checked')].map(input=>input.value).join('、');
    if (!$('recipe-minutes').value) draft.minutes=0;
    for (const [key,id] of [['servings','servings'],['minutes','recipe-minutes']]) {
      const n=Number($(id).value);
      if ($(id).value && $(id).checkValidity()) draft[key]=n;
    }
  }
  function fillFields() {
    for (const [key,id] of Object.entries(fields)) $(id).value=draft[key];
    $('servings').value=draft.servings;$('recipe-minutes').value=draft.minutes||'';$('magnet-size').value=draft.size;
    renderEquipment();renderSteps();renderMaterials();renderNutrition();renderRecipePreview();
  }
  function renderEquipment() {
    const selected=draft.equipment.split('、').map(x=>x.trim()).filter(Boolean),root=$('equipment-choices');root.replaceChildren();
    for (const name of [...equipmentOptions,...selected.filter(x=>!equipmentOptions.includes(x))]) {
      const label=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');
      input.type='checkbox';input.value=name;input.checked=selected.includes(name);span.textContent=name;label.append(input,span);root.append(label);
    }
  }
  function renderRecipePreview() {
    const available=Boolean(draft.title.trim()&&draft.steps.some(step=>step.trim()));
    $('recipe-result').hidden=!available;$('magnet-section').hidden=!available;$('concept-section').hidden=!available;
    if(available)$('recipe-edit-details').hidden=false;
    const root=$('recipe-preview');root.replaceChildren();if(!available)return;
    const title=document.createElement('h3');title.className='recipe-title';title.textContent=draft.title;root.append(title);
    for (const [heading,lines,tag] of [['材料',C.ingredients(draft.items,database),'ul'],['做法',draft.steps.filter(step=>step.trim()),'ol']]) {
      const h=document.createElement('h4');h.className='recipe-section-title';h.textContent=heading;
      const list=document.createElement(tag);list.className='ws-preview-list';for(const text of lines){const li=document.createElement('li');li.textContent=text;list.append(li);}root.append(h,list);
    }
  }
  function measuresFor(food){return food?[...(workshopMeasures[food.code]?.foodState===food.state?[workshopMeasures[food.code]]:[]),...(portionCatalog[food.code]||[])]:[];}
  function renderMeasureChoices(food){
    const list=measuresFor(food),select=$('portion-select');select.replaceChildren();list.forEach(g=>select.add(new Option(`${g.label} · 約${Number(g.gramsPerUnit.toFixed(1))}克`,g.id)));select.add(new Option('自行輸入克數','grams'));
    $('use-grams').checked=!list.length;
    $('food-qty').value=list[0]?.defaultQuantity||1;$('food-grams').value='';
    applyInputMode();renderTeacherFields(food);
  }
  function applyInputMode(){
    const f=database.find(x=>x.code===$('food-select').value),list=measuresFor(f),manual=$('use-grams').checked||!list.length;
    $('use-grams').checked=manual;$('portion-controls').hidden=manual;$('portion-select').disabled=!f;if(manual)$('portion-select').value='grams';else if($('portion-select').value==='grams')$('portion-select').value=list[0]?.id||'grams';$('food-qty').disabled=manual;$('food-qty').required=!manual;
    $('food-grams').disabled=!manual;$('food-grams').required=manual&&Boolean(f);
    $('portion-no-guide').hidden=!f||list.length>0;
    $('grams-entry').hidden=!manual||!f;
    updatePortionEstimate();
  }
  function selectedMeasure(){const f=database.find(x=>x.code===$('food-select').value);return measuresFor(f).find(g=>g.id===$('portion-select').value);}
  function currentAmount(food){
    if($('use-grams').checked){const n=Number($('food-grams').value);if(!$('food-grams').value||!$('food-grams').reportValidity())throw new Error('請填妥可食部分克數。');return {grams:n,portion:null};}
    const guide=selectedMeasure(),quantity=Number($('food-qty').value);if(!guide||!$('food-qty').value||!$('food-qty').reportValidity())throw new Error('請選擇份量單位及有效數量。');
    return {grams:P.grams(guide.gramsPerUnit,quantity),portion:P.snapshot(guide,quantity,food)};
  }
  function updatePortionEstimate(){
    const food=database.find(f=>f.code===$('food-select').value),guide=selectedMeasure(),manual=$('use-grams').checked;
    $('unit-label').textContent=manual?'克':guide?.label.split('（')[0]||'份';
    $('portion-photo').hidden=true;$('portion-photo').removeAttribute('src');$('portion-reference').textContent='';$('portion-source-record').textContent='';
    if(!food){$('portion-estimate').textContent='';return;}
    if(!manual&&guide){
      const source=guide.source;
      $('portion-source-record').textContent=source?`份量來源：${source.provider}；記錄 ${source.foodRecordId}「${source.foodDescription}」。原記錄 ${source.referenceAmount} ${source.referenceDescription}＝${source.referenceGrams}克。${source.factor?`換算倍率：${source.factor}。`:''}${source.alternateRecord?'份量與營養分析分別引用來源；營養數據不會因選擇單位而改換。':''}`:'份量來源：老師按目前食材狀態實測；屬工作坊參考，不是官方固定份量。';
      $('portion-reference').textContent=`${guide.kind==='workshop'?'工作坊實測':guide.kind==='reference'?'常用份量參考':'來源份量參考'}：${guide.note}`;
      if(guide.photo){$('portion-photo').src=guide.photo;$('portion-photo').hidden=false;}
    }
    try{const n=manual?Number($('food-grams').value):P.grams(guide?.gramsPerUnit,Number($('food-qty').value));if(!(n>=0.1&&n<=5000))throw new Error('');const people=draft.servings||1;$('portion-estimate').textContent=`${!manual&&guide?P.quantityText(Number($('food-qty').value))+guide.label+'，':''}全份約 ${Number(n.toFixed(1))} 克${people>1?`；供${people}人時，每人約 ${Number((n/people).toFixed(1))} 克`:''}。`;}catch{$('portion-estimate').textContent=manual?'請填寫可食部分的重量（克）。':'請選擇有效數量（整份材料0.1至5000克）。';}
  }
  function renderTeacherFields(food){
    const saved=food&&workshopMeasures[food.code];teacherPhoto=saved?.photo||'';teacherPhotoEpoch++;
    $('teacher-food-name').textContent=food?`${food.name}：${C.stateLabel(food)}`:'請先在上方選擇食材。';
    $('measure-label').value=saved?.inputLabel||'';$('measure-grams').value=saved?.gramsPerUnit||'';$('measure-notes').value=saved?.notes||'';$('measure-state-confirm').checked=false;$('measure-photo').value='';
    $('teacher-photo-preview').hidden=!teacherPhoto;if(teacherPhoto)$('teacher-photo-preview').src=teacherPhoto;else $('teacher-photo-preview').removeAttribute('src');
    $('delete-measure').disabled=!saved;$('save-measure').disabled=!food||food.status!=='verified';
  }
  function storeMeasures(message){try{localStorage.setItem(PORTION_SETTINGS_KEY,JSON.stringify(P.serialize(workshopMeasures)));$('teacher-portion-status').textContent=message;}catch{$('teacher-portion-status').textContent='這個瀏覽器未能儲存實測設定；目前分頁仍可使用，請下載份量設定保留。';}}
  async function measurePhoto(file){
    if(!file)return '';if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8000000)throw new Error('請選擇8MB以下的PNG、JPEG或WebP參考照片。');
    const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('未能讀取照片。'));reader.readAsDataURL(file);});
    const img=new Image();img.src=data;await img.decode();if(!img.naturalWidth||!img.naturalHeight)throw new Error('照片無法讀取。');
    const scale=Math.min(1,900/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));const ctx=canvas.getContext('2d');if(!ctx)throw new Error('未能準備照片。');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);const result=canvas.toDataURL('image/jpeg',0.7);if(result.length>650000)throw new Error('照片仍然太大，請選擇較簡單的參考照片。');return result;
  }
  function bindPortions(){
    $('portion-select').addEventListener('change',()=>{$('use-grams').checked=$('portion-select').value==='grams';$('food-qty').value=selectedMeasure()?.defaultQuantity||1;applyInputMode();});
    $('food-qty').addEventListener('input',updatePortionEstimate);$('food-grams').addEventListener('input',updatePortionEstimate);
    $('use-grams').addEventListener('change',()=>{if($('use-grams').checked&&!$('food-grams').value)$('food-grams').value=database.find(f=>f.code===$('food-select').value)?.defaultQuantity||100;applyInputMode();});
    for(const value of [0.25,0.5,1,2]){const b=document.createElement('button');b.type='button';b.className='ws-portion-chip';b.textContent=P.quantityText(value);b.setAttribute('aria-label',`用量設為${P.quantityText(value)}`);b.addEventListener('click',()=>{$('food-qty').value=value;updatePortionEstimate();});$('portion-shortcuts').append(b);}
    $('teacher-portion-form').addEventListener('submit',event=>{event.preventDefault();try{if(!$('measure-state-confirm').checked)throw new Error('請先確認已按所列食材狀態量度。');const f=database.find(x=>x.code===$('food-select').value),guide=P.teacherGuide({code:f?.code,label:$('measure-label').value,gramsPerUnit:Number($('measure-grams').value),notes:$('measure-notes').value,photo:teacherPhoto,foodState:f?.state},database);const next={...workshopMeasures,[guide.code]:guide};if(new Blob([JSON.stringify(P.serialize(next))]).size>2900000)throw new Error('實測設定的照片總量太大，請先移除部分照片。');workshopMeasures=next;storeMeasures('已儲存工作坊實測份量。已加入餐盤的用量保持原有記錄。');renderMeasureChoices(f);renderMaterials();}catch(e){$('teacher-portion-status').textContent=e.message;}});
    $('delete-measure').addEventListener('click',()=>{const f=database.find(x=>x.code===$('food-select').value);if(!f||!confirm('清除此食材的實測設定？已加入餐盤的用量會保留。'))return;delete workshopMeasures[f.code];storeMeasures('已清除此食材的實測設定。');renderMeasureChoices(f);});
    $('remove-measure-photo').addEventListener('click',()=>{teacherPhotoEpoch++;teacherPhoto='';$('save-measure').disabled=!database.some(f=>f.code===$('food-select').value&&f.status==='verified');$('teacher-photo-preview').hidden=true;$('teacher-photo-preview').removeAttribute('src');$('measure-photo').value='';$('teacher-portion-status').textContent='已移除待儲存的照片；按「儲存實測份量」才會更新設定。';});
    $('measure-photo').addEventListener('change',async event=>{const epoch=++teacherPhotoEpoch;$('save-measure').disabled=true;try{const photo=await measurePhoto(event.target.files[0]);if(epoch!==teacherPhotoEpoch)return;teacherPhoto=photo;$('teacher-photo-preview').src=photo;$('teacher-photo-preview').hidden=!photo;$('teacher-portion-status').textContent='照片已準備；按「儲存實測份量」保留。';}catch(e){if(epoch===teacherPhotoEpoch)$('teacher-portion-status').textContent=e.message;}finally{if(epoch===teacherPhotoEpoch)$('save-measure').disabled=false;}});
    $('export-measures').addEventListener('click',()=>download('工作坊實測份量.json',P.serialize(workshopMeasures)));
    $('import-measures').addEventListener('change',async event=>{try{const file=event.target.files[0];if(!file||file.size>3000000)throw new Error('請選擇3MB以下的工作坊份量設定JSON。');const incoming=P.settings(JSON.parse(await file.text()),database);if(!confirm('匯入會取代本機的工作坊實測設定；已加入餐盤的份量會保留。繼續？'))return;workshopMeasures=incoming;storeMeasures('已匯入實測份量設定。');renderMeasureChoices(database.find(f=>f.code===$('food-select').value));renderMaterials();}catch(e){$('teacher-portion-status').textContent=e.message;}finally{event.target.value='';}});
  }

  function foodOptions() {
    const category=$('category-select').value, select=$('food-select');
    select.replaceChildren(new Option('請選擇食材',''));
    database.filter(f => category==='all'||f.category===category).forEach(f => {const option=new Option(`${foodLabel(f)}（${f.categoryName}）${f.status==='pending_label'?'〔營養待核對，供舊草稿〕':''}`,f.code);option.disabled=f.status==='pending_label';select.add(option);});
    showFoodDetail();
  }
  function showFoodDetail() {
    const f=database.find(x=>x.code===$('food-select').value),root=$('food-source-content');root.replaceChildren();
    $('unit-label').textContent='份';$('food-source-detail').hidden=!f;renderMeasureChoices(f);
    if(!f){$('food-detail').textContent='先選食材，再揀常見單位及數量；約克數會自動顯示。';return;}
    $('food-detail').textContent=`${C.stateLabel(f)}。常見用量只作近似量度，並非建議食量。`;
    function note(text){const p=document.createElement('p');p.textContent=text;root.append(p);}
    note('營養以可食部分克數計算；家用單位為參考換算，工作坊實測單位另外標示。');
    note(`每100克：${Object.entries(C.nutrients).map(([key,m])=>`${m.label} ${format(f[key],key)}${f[key]===null?'':m.unit}`).join('；')}。`);
    if(!f.source){note(f.auditNote);return;}
    note(`${f.source.provider}；記錄 ${f.source.recordId}；資料版本 ${f.source.release}；查閱日期 ${f.source.accessed}。`);
    note(`原始名稱：${f.source.description}`);
    if(f.nutritionNote)note(f.nutritionNote);
    if(Object.values(f.nutrientMeta||{}).some(m=>m.status==='source_estimated'))note('部分數值為官方來源的推估值（原值附括號），已按來源標示保留。');
    if(f.carbsBasis==='available')note('此來源的碳水化合物為可獲得碳水，未換作總碳水；總碳水圖表因此顯示資料不足。');
    if(f.fiberBasis==='insoluble')note('此來源的纖維為不溶性纖維，未換作總膳食纖維。');
    if(Object.values(f.nutrientMeta||{}).some(m=>m.status==='trace'))note('來源標示 Trace（微量）的項目保留為資料不足，並非零。');
    if(f.source.lookupMethod==='POST') {
      const form=document.createElement('form');form.method='POST';form.action=f.source.recordUrl;form.target='_blank';form.rel='noopener noreferrer';
      for(const [name,value] of Object.entries(f.source.lookupFields)){const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.append(input);}
      const button=document.createElement('button');button.type='submit';button.className='ws-link';button.textContent='查看食安中心原始食物記錄';form.append(button);root.append(form);
    } else {const a=document.createElement('a');a.href=f.source.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='查看官方原始資料來源';const local=document.createElement('a');local.href=f.source.snapshotUrl;local.target='_blank';local.rel='noopener noreferrer';local.textContent='查看本次引用記錄';root.append(local,document.createTextNode(' · '),a);}
    note('數據為指定樣本或食物記錄的參考值；品種、品牌及實際處理方法會影響營養值。');
    note(`保存：${f.storage.note}`);
    const a=document.createElement('a');a.href=f.storage.sourceUrl;a.target='_blank';a.rel='noopener noreferrer';a.textContent='食安中心保存指引';root.append(a);
  }
  function renderMaterials() {
    const tbody=$('plate-list');tbody.replaceChildren();
    if (!draft.items.length) tbody.innerHTML='<tr><td colspan="4">先選一種材料加入，逐步配好這一餐。</td></tr>';
    draft.items.forEach(item => {
      const food=database.find(f => f.code===item.code), row=document.createElement('tr');
      const name=document.createElement('td');
      const strong=document.createElement('strong');strong.textContent=foodLabel(food);
      const portion=()=>`${C.stateLabel(food)}${food.status==='pending_label'?'；營養待核對':''}`;
      const detail=document.createElement('small');detail.textContent=portion();
      name.append(strong,detail);
      const weightCell=document.createElement('td'),measureSelect=document.createElement('select'),guideList=measuresFor(food);
      if(item.portion&&!guideList.some(g=>g.id===item.portion.id&&P.signature(g)===P.signature(item.portion)))guideList.unshift({...item.portion,saved:true,note:'已儲存在作品的份量參考。'});
      measureSelect.setAttribute('aria-label',`${food.name}份量單位`);measureSelect.add(new Option('自行輸入克數','grams'));guideList.forEach(g=>measureSelect.add(new Option(`${g.label} · 約${Number(g.gramsPerUnit.toFixed(1))}克${g.saved?'（原記錄）':''}`,g.id)));measureSelect.value=item.portion?.id||'grams';
      const qtyBox=document.createElement('div'),quantity=document.createElement('input'),estimate=document.createElement('small'),advanced=document.createElement('details'),summary=document.createElement('summary'),input=document.createElement('input');
      qtyBox.className='ws-row-quantity';quantity.type='number';quantity.min='0.001';quantity.max='10000';quantity.step='any';quantity.required=true;quantity.setAttribute('aria-label',`${food.name}整份數量`);quantity.value=item.portion?.quantity||1;qtyBox.append(quantity);
      summary.textContent='自行輸入克數';advanced.className='ws-row-grams';advanced.append(summary,input);input.type='number';input.min='0.1';input.max='5000';input.step='0.1';input.required=true;input.value=Number(item.grams.toFixed(1));input.setAttribute('aria-label',`${food.name}整份克數`);
      function displayAmount(){const has=Boolean(item.portion);quantity.disabled=!has;quantity.required=has;qtyBox.hidden=!has;input.disabled=has;advanced.hidden=has;advanced.open=!has;estimate.textContent=`${has?'約 ':''}${Number(item.grams.toFixed(1))} 克（全份）${has&&item.portion.kind==='workshop'?' · 工作坊參考':''}`;detail.textContent=portion();}
      function commitAmount(guide,count){try{const weight=P.grams(guide.gramsPerUnit,count),updated=C.makeItem(food,weight,item.method,item.id,P.snapshot(guide,count,food));Object.assign(item,updated);input.value=weight;displayAmount();error('food-error');touch('材料份量已更新，可重新生成食譜。');renderNutrition();}catch(e){currentAnalysis=null;resetConcept('請先填妥材料份量。');touch();error('food-error',e.message);}}
      quantity.addEventListener('input',()=>{const guide=guideList.find(g=>g.id===measureSelect.value);if(guide)commitAmount(guide,Number(quantity.value));});
      measureSelect.addEventListener('change',()=>{if(measureSelect.value==='grams'){delete item.portion;displayAmount();touch('已改用克數；原有重量保留。');}else{const guide=guideList.find(g=>g.id===measureSelect.value);quantity.value=guide.defaultQuantity||1;commitAmount(guide,Number(quantity.value));}});
      input.addEventListener('input',()=>{if(!input.value||!input.checkValidity()){currentAnalysis=null;resetConcept('請先填妥材料份量。');touch();return;}delete item.portion;item.grams=Number(input.value);displayAmount();touch('材料份量已更新，可重新生成食譜。');renderNutrition();});
      displayAmount();weightCell.append(measureSelect,qtyBox,estimate,advanced);
      const methodCell=document.createElement('td'), select=document.createElement('select');select.setAttribute('aria-label',`${food.name}烹調方式`);
      C.methods.forEach(m => select.add(new Option(m,m)));select.value=item.method;
      select.addEventListener('change',() => {item.method=select.value;touch('烹調方式已更新，請檢查火力、時間及步驟。');renderMaterials();});methodCell.append(select);
      const action=document.createElement('td'), remove=document.createElement('button');remove.type='button';remove.className='ws-link';remove.textContent='移除';remove.setAttribute('aria-label',`移除${food.name}`);
      remove.addEventListener('click',() => {draft.items=draft.items.filter(i => i.id!==item.id);touch('材料已更新，可重新生成食譜。');renderMaterials();renderNutrition();});action.append(remove);
      row.append(name,weightCell,methodCell,action);tbody.append(row);
    });
    const warning=C.warnings(draft.items,database), container=$('safety-warnings');container.replaceChildren();
    warning.blocking.forEach(message => {const p=document.createElement('p');p.className='ws-error';p.textContent=message;container.append(p);});
    if (warning.allergens.length) {
      const p=document.createElement('p');p.className='ws-note';p.textContent=`可能涉及：${warning.allergens.join('、')}。請成人按包裝及個別飲食需要核對。`;container.append(p);
    }
    $('save-comparison-btn').disabled=!draft.items.length;
  }
  function renderNutrition() {
    const missing=draft.items.map(item=>database.find(food=>food.code===item.code)).filter(food=>food&&Object.keys(C.nutrients).some(key=>food[key]===null));
    $('nutrition-data-note').textContent=missing.length?`以下食材有缺項、微量或不同營養定義：${missing.map(food=>food.name).join('、')}。相關營養總量顯示「資料不足」，不以0或其他食物數值補填。`:'';
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
      const target=document.createElement('p');target.className='nutrition-target';target.textContent=`比較示例：${references[key]} ${meta.unit}`;section.append(target);
      for (const [name,values,kind] of [...(before?[['調整前',before,'previous']]:[]),['現在',current,'current']]) {
        const row=document.createElement('div');row.className='nutrition-track-row';
        const text=document.createElement('span');text.textContent=name;
        const track=document.createElement('div');track.className='nutrition-track';track.setAttribute('role','img');track.setAttribute('aria-label',`${meta.label}，${name}：${format(values[key],key)} ${meta.unit}`);
        const fill=document.createElement('div');fill.className=`nutrition-fill ${kind}`;fill.style.width=`${values[key]===null?0:Math.min(values[key]/references[key]*50,100)}%`;
        const reference=document.createElement('span');reference.className='nutrition-reference';reference.setAttribute('aria-hidden','true');track.append(fill,reference);
        const value=document.createElement('span');value.className='nutrition-ratio';value.textContent=format(values[key],key);row.append(text,track,value);section.append(row);
      }
      const status=document.createElement('p');status.className='nutrition-status';
      status.textContent=before ? (current[key]===null||before[key]===null?'資料不足，無法計算差值。':`調整前 ${format(before[key],key)} → 現在 ${format(current[key],key)} ${meta.unit}；差值 ${current[key]-before[key]>0?'+':''}${format(current[key]-before[key],key)} ${meta.unit}。`) : '';
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
    if (!$('servings').value||!$('servings').reportValidity()) throw new Error('請先填妥有效人數。');
    if ($('recipe-minutes').value&&!$('recipe-minutes').reportValidity()) throw new Error('請填寫有效時間，或留空表示不限制。');
    for (const input of $('plate-list').querySelectorAll('input:not(:disabled)')) if (!input.value||!input.reportValidity()) throw new Error('請先填妥所有材料的有效克數。');
    return C.payload(draft,database);
  }
  function cancelAI(message='已停止等待；你可以繼續手動編輯。') {
    const controller=pendingAI;pendingAI=null;controller?.abort();
    $('ai-analyze-btn').disabled=false;$('cancel-ai').hidden=true;$('ai-status').textContent=message;
  }
  function analysisKey() {
    return JSON.stringify([draft.items,draft.servings,draft.minutes,draft.equipment,draft.stock,draft.allergy]);
  }
  function conceptKey() {
    return JSON.stringify([draft.items.map(i=>[i.code,i.grams,i.method]),draft.servings,draft.title.trim(),draft.steps.map(s=>s.trim()),draft.equipment.trim(),database[0]?.dataVersion||'']);
  }
  function renderAdvice() {
    if(currentAnalysis?.key!==analysisKey()) currentAnalysis=null;
    $('ai-advice').hidden=!currentAnalysis;
    $('ai-observation').textContent=currentAnalysis?.data.summary||'';
    for(const [id,key] of [['ai-food-suggestions','foodSuggestions'],['ai-portion-suggestions','portionSuggestions']]) {
      const list=$(id);list.replaceChildren();
      for(const entry of currentAnalysis?.data[key]||[]) {
        const li=document.createElement('li'),suggestion=document.createElement('strong'),reason=document.createElement('span');
        suggestion.textContent=entry.suggestion;reason.textContent=entry.reason;li.append(suggestion,reason);list.append(li);
      }
    }
  }
  function renderImageChoice() {
    const model=C.imageModels.find(m=>m.id===$('image-model').value);
    $('image-model-info').textContent=model?`${model.name}：參考收費 ${model.price}（美元，查閱 ${C.imagePricingDate}）；每次一張。以供應商實際計費及帳戶額度為準。須按「生成概念圖（付費）」才發出請求，失敗不會自動換模型。`:`免費模式：截至 ${C.imagePricingDate}，OpenRouter 未有可用的免費繪圖模型，因此不會發出畫圖請求。文字食譜及 QR code 照常使用；老師可在這裏自行選擇付費模型。`;
    $('generate-image').textContent=model?'生成概念圖（付費）':'查看圖片模型';
    $('image-model-source').href=model?`https://openrouter.ai/api/v1/images/models/${model.id}/endpoints`:'https://openrouter.ai/blog/tutorials/image-generation-models/';
  }
  function showConcept(asset,model,key=conceptKey()) {
    conceptImage={key,model,asset:{...asset,model}};
    $('concept-image').src=asset.dataURL;$('concept-image').hidden=false;
    $('concept-image').alt=`「${draft.title}」的 AI 菜式概念圖；實際材料及份量以食譜為準`;
    $('download-image').href=asset.dataURL;$('download-image').download='菜式概念圖.jpg';$('download-image').hidden=false;
    Pub.notify();
  }
  async function persistConcept() {
    if(conceptImage?.key!==conceptKey())return false;
    const record={key:conceptImage.key,model:conceptImage.model,asset:snapshot(conceptImage.asset),draft:snapshot(draft),savedAt:new Date().toISOString()};
    try {await Pub.store.saveActive(record);return true;}
    catch(e){if(conceptImage?.key===record.key)error('image-error',e.message+' 圖片仍在本頁，請按「完成作品及製作QR code」儲存至雲端。');return false;}
  }
  function stopImage(message='') {
    const active=pendingImage;pendingImage=null;active?.controller.abort();
    $('generate-image').disabled=false;renderImageChoice();$('cancel-image').hidden=true;
    $('image-status').textContent=message;error('image-error');
  }
  function resetConcept(message='') {
    stopImage(message);conceptImage=null;
    $('concept-image').hidden=true;$('concept-image').removeAttribute('src');
    $('download-image').hidden=true;$('download-image').removeAttribute('href');
    Pub.store.clearActive().catch(()=>{});Pub.notify();
  }
  async function restoreConcept(savedDraft) {
    const atRevision=revision;
    try {
      const saved=await Pub.store.active();if(!saved||atRevision!==revision)return;
      if(!savedDraft&&saved.draft){const restored=reviewedDraft(saved.draft);draft=restored.value;draftReviewNotice(saved.draft,restored.removed);fillFields();}
      const key=conceptKey();
      if(saved.key!==key){
        // A database-version change alone does not alter the depicted ingredients or recipe.
        const before=JSON.parse(saved.key),after=JSON.parse(key);
        if(!Array.isArray(before)||!Array.isArray(after)||before.length!==after.length||JSON.stringify(before.slice(0,-1))!==JSON.stringify(after.slice(0,-1)))return;
      }
      Pub.jpegBytes(saved.asset);showConcept(saved.asset,saved.model,key);
      if(saved.key!==key)await persistConcept();
      $('image-status').textContent='已恢復自動儲存的概念圖；沒有再次呼叫AI。';
    }catch(e){error('image-error',e.message);}
  }
  async function generateConceptImage({automatic=false}={}) {
    error('image-error');
    const selected=C.imageModels.find(m=>m.id===$('image-model').value);
    if(automatic) {
      if(!conceptImage)$('image-status').textContent='食譜已完成；請按「生成概念圖（付費）」才會使用圖片額度。';
      return;
    }
    if(!selected) {
      $('image-status').textContent='目前沒有免費繪圖模型，未發出畫圖請求。可保留已有圖片，或由老師選擇付費模型。';
      $('image-settings').open=true;$('image-model').focus();return;
    }
    try {validPayload();} catch(e) {error('image-error',e.message);return;}
    if(conceptImage?.key===conceptKey()&&!confirm('已有保存的概念圖。再次生成會另行收費，成功後取代本機圖片。繼續？'))return;
    stopImage();
    const model=$('image-model').value,key=conceptKey(),controller=new AbortController();
    pendingImage={controller,key,model};Pub.notify();
    $('concept-section').hidden=false;$('generate-image').disabled=true;$('cancel-image').hidden=false;
    $('image-status').textContent='AI 正在畫菜式概念圖…成功後會自動儲存在這部裝置。';
    let timedOut=false;
    const timer=setTimeout(()=>{timedOut=true;controller.abort();},120000);
    const active=()=>pendingImage?.controller===controller&&conceptKey()===key&&$('image-model').value===model;
    try {
      const token=await window.CloudStudentAuth.token();if(!active())return;
      const response=await fetch(window.CloudWorkshopConfig.api+'/api/ai/image',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(C.imageRequest(draft,database,model)),signal:controller.signal});
      if(response.status===401)window.CloudStudentAuth.invalidate();
      const body=await response.json();
      if(!response.ok||body.error)throw new Error(response.status===402?'OpenRouter 402：繪圖額度不足，請老師核對帳戶額度。':(typeof body.error==='string'?body.error:`AI 服務 ${response.status}: ${body.error?.message||'未能生成圖片'}`));
      const asset=await Pub.normalizeImage(C.imageDataURL(body));
      if(!active())return;
      showConcept(asset,model,key);saveDraft();
      const saved=await persistConcept();if(!active())return;
      $('image-status').textContent=saved?'概念圖已自動儲存在這部裝置；請按「完成作品及製作QR code」，把食譜及圖片一齊交到雲端。':'概念圖已生成，但本機儲存未成功；請先完成雲端提交，或使用老師後備下載。';
      await prepareShare(true);
    } catch(e) {
      if(active()) {
        error('image-error',`${e.name==='AbortError'?(timedOut?'畫圖等候超過兩分鐘。':'已停止畫圖。'):e.message} 未自動重試或轉模型；如已有圖片會保留。請老師協助後才重試。`);
        $('image-status').textContent='';
      }
    } finally {
      clearTimeout(timer);window.CloudStudentAuth.refreshQuota();
      if(pendingImage?.controller===controller) {pendingImage=null;$('generate-image').disabled=false;renderImageChoice();$('cancel-image').hidden=true;Pub.notify();}
    }
  }
  function renderTextChoice(){
    const model=A.models.find(m=>m.id===$('text-model').value);
    $('text-model-info').textContent=model?model.price+'（2026-10-27查閱，以實際供應商計費為準）。':'';
    $('text-model-source').href=model?.url||'https://openrouter.ai/models';
  }
  function showTextDiagnostic(diag){
    lastTextDiagnostic=diag;$('ai-diagnostics').hidden=!diag;
    $('ai-diagnostic-content').textContent=diag?JSON.stringify(diag,null,2):'';
  }
  async function generateAI() {
    if(pendingAI)return;
    error('ai-error');showTextDiagnostic(null);syncFields();
    if (!draft.items.length) {error('ai-error','請先加入食材，再請 AI 提供建議。');return;}
    for(const input of [$('servings'),...$('plate-list').querySelectorAll('input:not(:disabled)')])if(!input.value||!input.reportValidity()){error('ai-error','請先填妥人數及所有材料的有效份量。');return;}
    if($('recipe-minutes').value&&!$('recipe-minutes').reportValidity()){error('ai-error','請填寫有效時間，或留空表示不限制。');return;}
    const problems=C.warnings(draft.items,database).blocking;
    if (problems.length) {error('ai-error',problems.join(' '));return;}
    if ((draft.title.trim()||draft.steps.some(s => s.trim())) && !confirm('AI 會重新分析餐盤，並取代目前菜名和步驟；你所選材料及份量會保留。繼續？')) return;
    if(pendingImage)resetConcept('正在更新食譜；完成後可按需要生成新概念圖。');
    const version=revision, materials=snapshot(draft.items), context=snapshot(draft),model=$('text-model').value;
    const controller=new AbortController();pendingAI=controller;
    $('ai-analyze-btn').disabled=true;$('cancel-ai').hidden=false;$('ai-status').textContent=`AI 正在分析食材配搭、每人份量及編寫食譜…最多等候${A.timeoutMs(model)/60000}分鐘。`;
    let timedOut=false;
    const timer=setTimeout(() => {timedOut=true;controller.abort();},A.timeoutMs(model));
    try {
      const itemDescriptions=materials.map(i => {const food=database.find(f=>f.code===i.code);return {id:i.id,name:food.name,category:food.categoryName,state:C.stateLabel(food),dataStatus:food.status,nutrientDefinitions:{carbs:food.carbsBasis,fiber:food.fiberBasis},grams:i.grams,gramsPerPerson:i.grams/context.servings,unit:food.unit,unitWeight:food.unitWeight,householdPortion:i.portion?{description:P.describe(i.portion),gramsPerUnit:i.portion.gramsPerUnit,kind:i.portion.kind}:null,availablePortions:measuresFor(food).map(g=>({label:g.label,gramsPerUnit:g.gramsPerUnit,kind:g.kind})),method:i.method};});
      const prompt=`你是香港高小營養與惜食工作坊的食譜助手，使用繁體中文、簡單友善的語句。先按實際選材、整份和每人份量分析餐盤，提供食材配搭及份量建議，各1至2項；每項寫具體建議和原因。合適的安排亦可建議保留，不必強行改動。份量建議優先使用提供的家用單位（例如半個、一片），可附約克數；只用已提供的gramsPerUnit換算，不可假定一碗或一件的重量。未提供換算時才用克數。份量建議須引用所選材料的克數及家用單位，清楚區分整份與每人份量。這是課堂參考，不是個人營養診斷；每人食量不同，不能提供減肥指示、健康評分或聲稱符合個人一日需要。營養數值是按資料來源指定狀態估算，烹調方式不會自動換算營養；null代表缺項、微量或營養定義不相符，不能填0或猜測。dataStatus為pending_label的食材未核實營養；缺值為null，沒有鈉、糖及完整過敏原數據，不可捏造。不能把材料克數比例當作體積比例。建議的增減或替代材料只寫在analysis，不可擅自套用於食譜，學生會自行決定。食譜必須使用目前所有材料，完整保留id及克數，不可刪除、改份量或加入未列出的油、糖、鹽、醬料、清水或配料。若目前材料無法組合成安全可行食譜，仍須回傳analysis，另加error說明先如何調整，不要編造食譜。器具留空及時間0代表未限制。步驟包含適當火力、估計時間、熟透檢查及成人協助；提供1至10步，每步最多180字，菜名最多40字。summary最多180字，suggestion最多160字，reason最多180字。設計條件：${JSON.stringify({servings:context.servings,minutes:context.minutes,equipment:context.equipment,stock:context.stock,allergyNotes:context.allergy,materials:itemDescriptions,nutritionTotal:C.totals(materials,database),nutritionPerPerson:C.totals(materials,database,context.servings)})}。只輸出有效 JSON，格式：{"analysis":{"summary":"餐盤觀察","foodSuggestions":[{"suggestion":"食材建議","reason":"原因"}],"portionSuggestions":[{"suggestion":"每人份量建議","reason":"原因"}]},"recipeTitle":"菜名","minutes":25,"materials":[{"id":"原材料id","grams":原克數}],"recipeSteps":["步驟文字"]}。`;
      let token;try{token=await window.CloudStudentAuth.token();}catch(e){e.workshopAuth=true;throw e;}
      if(pendingAI!==controller||revision!==version)return;
      const response=await fetch(window.CloudWorkshopConfig.api+'/api/ai/text',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(A.request(model,prompt)),signal:controller.signal});
      if(response.status===401)window.CloudStudentAuth.invalidate();
      let body;
      try{body=await response.json();}catch(e){if(e.name==='AbortError')throw e;throw new A.RequestError(A.diagnostic({model,status:response.ok?0:response.status,body:{error:{message:'AI服務沒有回傳可讀取的JSON資料。'}},kind:response.ok?'format':'',requestId:response.headers?.get('x-request-id')||''}));}
      if(typeof body?.error==='string'){const e=new Error(body.error);e.workshopAuth=true;throw e;}
      if (!response.ok||body?.error) throw new A.RequestError(A.diagnostic({model,status:response.status,body,requestId:response.headers?.get('x-request-id')||response.headers?.get('x-openrouter-request-id')||''}));
      const content=body?.choices?.[0]?.message?.content;
      if (typeof content!=='string') throw new Error('AI 沒有回傳可讀取的建議及食譜，請重試或手動編輯。');
      const raw=JSON.parse(content.replace(/<think>[\s\S]*?<\/think>/g,'').replace(/^\s*```(?:json)?\s*/,'').replace(/\s*```\s*$/,'').trim());
      const analysis=C.parseAnalysis(raw.analysis);
      if (pendingAI!==controller||revision!==version) return;
      currentAnalysis={key:analysisKey(),data:analysis};renderAdvice();
      if (raw.error) {const e=new Error(String(raw.error).slice(0,300));e.recipeConstraint=true;throw e;}
      const result=C.parseAI(raw,materials);
      pendingAI=null;draft.title=result.title;draft.steps=result.steps;if(result.minutes)draft.minutes=result.minutes;
      touch();currentAnalysis={key:analysisKey(),data:analysis};renderAdvice();
      $('recipe-title').value=draft.title;$('recipe-minutes').value=draft.minutes||'';renderSteps();renderRecipePreview();
      $('ai-status').textContent='建議及食譜已生成！材料份量保持你的選擇。你可再按下方按鈕生成概念圖，完成後一鍵提交作品到雲端。';
      prepareShare(true);
      generateConceptImage({automatic:true});
    } catch (e) {
      if (pendingAI===controller) {
        if(e.workshopAuth){error('ai-error',e.message);$('ai-status').textContent='';saveDraft();return;}
        const diag=e.diagnostic||A.diagnostic({model,status:0,body:{error:{message:e.message}},kind:e.name==='AbortError'?(timedOut?'timeout':'cancelled'):e instanceof TypeError?'network':e.recipeConstraint?'recipe':'format'});
        showTextDiagnostic(diag);error('ai-error',A.failureMessage(diag));saveDraft();
        $('ai-status').textContent='';
      }
    } finally {
      clearTimeout(timer);window.CloudStudentAuth.refreshQuota();
      if (pendingAI===controller) pendingAI=null;
      if (!pendingAI) {$('ai-analyze-btn').disabled=false;$('cancel-ai').hidden=true;}
    }
  }
  function autoBase() {
    try {return C.shareBase(location.href);} catch {return '';}
  }
  function settingsSave() {
    try {localStorage.setItem(SETTINGS_KEY,JSON.stringify({base:$('share-base').value,size:draft.size,imageModel:$('image-model').value,textModel:$('text-model').value,textSettingsVersion:A.settingsVersion}));} catch {/* Draft download remains available. */}
  }
  async function buildQR(payload,base,size,publication=null) {
    if (!window.LZString||!window.QRCode) throw new Error('QR 程式尚未載入；請檢查網絡後重新整理。草稿仍可下載。');
    const validated=C.validatePayload(payload), url=publication?Pub.url(publication):`${C.shareBase(base)}#recipe=${LZString.compressToEncodedURIComponent(JSON.stringify(validated))}`;
    let symbol;
    try {symbol=QRCode.create(url,{errorCorrectionLevel:'M'});} catch {throw new Error('這份食譜超出 QR code 容量。請保留重要安全資訊，精簡重複文字後再更新；不會自動刪除內容。');}
    const dimensions=C.sizes[size], moduleMM=dimensions.qr/(symbol.modules.size+8);
    if (moduleMM<0.32) throw new Error(`這份食譜的 QR code 在 ${dimensions.label} 磁貼太密。請選更大尺寸，或精簡重複文字；不會自動截短食譜。`);
    const dataURL=await QRCode.toDataURL(url,{errorCorrectionLevel:'M',width:Math.max(600,(symbol.modules.size+8)*6),margin:4});
    return {payload:validated,url,dataURL,size,version:symbol.version,moduleMM,publication};
  }
  function magnetNode(entry) {
    const size=C.sizes[entry.size], card=document.createElement('article');card.className='ws-magnet'+(entry.size==='acrylic'?' ws-magnet-acrylic':'');
    card.style.setProperty('--magnet-width',`${size.width}mm`);card.style.setProperty('--magnet-height',`${size.height}mm`);card.style.setProperty('--qr-width',`${size.qr}mm`);
    if(entry.size==='acrylic'){const caption=document.createElement('div');caption.className='ws-acrylic-caption';caption.textContent=entry.payload.c+' · '+entry.payload.t;caption.title=caption.textContent;card.append(caption);const image=document.createElement('img');image.src=entry.dataURL;image.alt=entry.payload.t+'完整食譜 QR code';card.append(image);return card;}
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
      if (fingerprint!==approved) {approved='';throw new Error('食譜有更新，請按「更新雪櫃貼」。');}
      const publication=await Pub.makeWork(payload,conceptImage?.key===conceptKey()?conceptImage.asset:null,$('share-base').value);
      const entry=await buildQR(payload,$('share-base').value,draft.size,publication);
      if (epoch!==qrEpoch||approved!==fingerprint) return;
      const card=magnetNode(entry);
      $('magnet-preview').replaceChildren(card);$('magnet-preview').hidden=false;
      await card.querySelector('img').decode();
      if (epoch!==qrEpoch||approved!==fingerprint) return;
      if (card.scrollHeight>card.clientHeight+2) throw new Error('菜名或代號超出磁貼高度，請選較大尺寸再打印。');
      qr={...entry,fingerprint,base:C.shareBase($('share-base').value)};
      $('qr-status').textContent=`作品網址已準備（尚未上傳）。尺寸 ${C.sizes[draft.size].label}。請下載作品包交老師，待上線核對後才列印。`;
      $('export-approved').disabled=false;Pub.notify();
    } catch (e) {if (epoch===qrEpoch) {error('qr-error',e.message);$('qr-status').textContent='尚未準備好可列印的 QR code。';if(e.message.includes('網址'))$('share-base').closest('details').open=true;}}
  }
  async function prepareShare(quiet=false) {
    try {approved=JSON.stringify(validPayload());$('review-status').textContent='';saveDraft();await refreshQR();}
    catch(e){if(!quiet)$('review-status').textContent=e.message;}
  }
  function ensureQR() {if (!qr||!approved||qr.fingerprint!==JSON.stringify(validPayload())||qr.size!==draft.size||qr.base!==C.shareBase($('share-base').value)) throw new Error('食譜有更新，請按「更新雪櫃貼」後再打印。');return qr;}
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
    const meta=document.createElement('p');meta.className='ws-parent-meta';meta.textContent=p.v===2?[`${p.n} 人份`,p.m?`預計 ${p.m} 分鐘`:'',p.e?`器具：${p.e}`:''].filter(Boolean).join(' · '):'親子一起煮，按需要準備份量。';hero.append(meta);root.append(hero);
    function section(heading) {const section=document.createElement('section');section.className='card';const h=document.createElement('h2');h.textContent=heading;section.append(h);root.append(section);return section;}
    const shop=section('完整材料與買餸清單'), list=document.createElement('div');list.className='ws-parent-list';
    p.i.forEach(ingredient => {const label=document.createElement('label'), input=document.createElement('input'), text=document.createElement('span');input.type='checkbox';text.textContent=ingredient;label.append(input,text);list.append(label);});shop.append(list);
    const steps=section('與孩子共同下廚'), ol=document.createElement('ol');ol.className='ws-parent-steps';p.s.forEach(step => {const li=document.createElement('li');li.textContent=step;ol.append(li);});steps.append(ol);
    if (p.v===2) {
      const notes=[['惜食方法',p.w],['設計修改理由',p.r],['敏感食材備註',p.a],['可能涉及的致敏物',p.z]].filter(([,value])=>value);
      if(notes.length){const learning=section('食譜備註');for(const [label,value] of notes){const para=document.createElement('p'),strong=document.createElement('strong');strong.textContent=`${label}：`;para.append(strong,document.createTextNode(value));learning.append(para);}}
      const nutrition=section('每人營養估算');
      const values=document.createElement('p');values.textContent=Object.entries(C.nutrients).map(([key,m]) => `${m.label} ${format(p.u[key],key)}${p.u[key]===null?'':m.unit}`).join(' · ');nutrition.append(values);
      const note=document.createElement('p');note.className='ws-note';note.textContent=p.d?`食材資料版本：${p.d}。按食譜所列狀態及來源數據估算；未另列糖及鈉，並非個人飲食建議。`:'此為舊版食譜所儲存的營養估算，未附本次資料版本；數字保持原作品內容，並非個人飲食建議。';nutrition.append(note);
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
      const response=await fetch('./data/foods.json?v=2026-10-27-portions-3');if (!response.ok) throw new Error('未能載入食材資料。');
      const data=await response.json();
      if (!Array.isArray(data)||!data.length||new Set(data.map(f=>f.code)).size!==data.length||data.some(f => typeof f.code!=='string'||typeof f.name!=='string'||!Number.isFinite(f.unitWeight)||f.unitWeight<=0||f.status!=='verified'||!f.source||Object.keys(C.nutrients).some(key=>typeof f[key]!=='number'||!Number.isFinite(f[key])||f[key]<0))) throw new Error('食材資料版本未能完整核對，請重新載入定稿檔案。');
      database=data;
      try{const response=await fetch('./data/portion-guides.json?v=2026-10-27-portions-3');if(!response.ok)throw new Error('未能載入份量');const raw=await response.json();portionCatalog=P.catalog(raw,database);retiredFoods=raw.retiredFoods||{};}catch{$('portion-load-status').textContent='家用份量對照未能載入；你仍可用老師實測設定或自行輸入克數。';portionCatalog={};}
      try{const saved=readStorage(PORTION_SETTINGS_KEY);if(saved)workshopMeasures=P.settings(saved,database);}catch{$('teacher-portion-status').textContent='上次實測設定未能核對，請重新匯入或量度。';}
      foodOptions();document.querySelectorAll('[data-food-count]').forEach(node=>node.textContent=`提供 ${data.filter(food=>food.status==='verified').length} 款附官方來源的可選食材`);
      const saved=readStorage(DRAFT_KEY);
      if (saved) {try {const restored=reviewedDraft(saved);draft=restored.value;$('draft-status').textContent='已恢復上次食譜。';draftReviewNotice(saved,restored.removed);} catch(e) {$('draft-status').textContent='上次草稿未套用；可下載原稿保留。';draftReviewNotice(saved,[],e.message);}}
      initialized=true;fillFields();await restoreConcept(saved);
      window.dispatchEvent(new CustomEvent('food-workshop:ready'));
      if(draft.title.trim()&&draft.steps.some(step=>step.trim()))prepareShare(true);
    } catch (e) {
      error('food-error',`${e.message} 請以網站網址開啟並檢查網絡；目前不會使用未載入的資料估算營養。`);
      $('food-select').replaceChildren(new Option('資料未載入，請重新整理',''));$('add-btn').disabled=true;$('ai-analyze-btn').disabled=true;
    }
  }
  function bind() {
    bindPortions();
    A.models.forEach(model=>$('text-model').add(new Option(model.name+(model.id==='openrouter/free'?'':'（付費）'),model.id)));
    $('download-ai-diagnostic').addEventListener('click',()=>{if(lastTextDiagnostic)download('AI連線診斷.json',lastTextDiagnostic);});
    $('fixed-safety').textContent=C.safety;
    C.methods.forEach(method => $('cooking-select').add(new Option(method,method)));
    $('category-select').addEventListener('change',foodOptions);$('food-select').addEventListener('change',showFoodDetail);
    $('ingredient-form').addEventListener('submit',event => {
      event.preventDefault();error('food-error');
      try {
        const food=database.find(f=>f.code===$('food-select').value);if(!food)throw new Error('請先選擇食材。');
        if(food.status==='pending_label')throw new Error('這項舊食材的營養仍待核對，請選擇附有官方來源的食材。');
        const amount=currentAmount(food),method=$('cooking-select').value;
        const existing=draft.items.find(i=>i.code===food.code&&i.method===method&&P.signature(i.portion)===P.signature(amount.portion));
        if(existing){const portion=amount.portion?{...existing.portion,quantity:existing.portion.quantity+amount.portion.quantity}:null;const weight=portion?P.grams(portion.gramsPerUnit,portion.quantity):Math.round((existing.grams+amount.grams)*10)/10;Object.assign(existing,C.makeItem(food,weight,method,existing.id,portion));}
        else{if(draft.items.length>=30)throw new Error('每份作品最多30項材料，請先整理材料清單。');draft.items.push(C.makeItem(food,amount.grams,method,crypto.randomUUID(),amount.portion));}
        touch('材料已更新，可重新生成食譜。');renderMaterials();renderNutrition();
      } catch (e) {error('food-error',e.message);}
    });
    $('reset-btn').addEventListener('click',() => {if (draft.items.length&&confirm('清空所有材料？食譜文字會保留供你修改。')) {draft.items=[];comparison=null;touch('材料已清空，請重新配好材料及修改步驟。');renderMaterials();renderNutrition();}});
    for (const id of [...Object.values(fields),'servings','recipe-minutes']) $(id).addEventListener('input',() => {syncFields();if((id==='servings'||id==='recipe-minutes')&&(!$(id).value||!$(id).checkValidity())){currentAnalysis=null;if(id==='servings')resetConcept('請先填妥食用人數。');}touch();if (id==='servings'){renderNutrition();updatePortionEstimate();}});
    $('add-step').addEventListener('click',() => {if (draft.steps.length<10) {draft.steps.push('');touch();renderSteps(true);}});
    $('nutrition-basis').addEventListener('change',() => {basis=$('nutrition-basis').value;renderNutrition();});
    $('save-comparison-btn').addEventListener('click',() => {comparison={items:snapshot(draft.items),servings:draft.servings};renderNutrition();});
    $('clear-comparison-btn').addEventListener('click',() => {comparison=null;renderNutrition();});
    $('reference-form').addEventListener('submit',event => {event.preventDefault();for (const key of Object.keys(references)) references[key]=Number($(`reference-${key}`).value);renderNutrition();});
    $('manual-help').addEventListener('click',() => {$('recipe-edit-details').hidden=false;$('recipe-edit-details').open=true;$('recipe-title').focus();});
    $('image-model').add(new Option('只用免費模型（目前未有可用繪圖模型）','free-only'));
    C.imageModels.forEach(model=>$('image-model').add(new Option(`${model.name} · ${model.price}（付費）`,model.id)));
    renderImageChoice();
    $('generate-image').addEventListener('click',()=>generateConceptImage());
    $('cancel-image').addEventListener('click',()=>stopImage('已停止等待；已有圖片會保留。沒有自動重試。'));
    $('image-model').addEventListener('change',()=>{stopImage(C.imageModels.some(m=>m.id===$('image-model').value)?'已選擇付費模型；按「生成概念圖（付費）」才會使用額度。':'已切換免費模式；目前沒有免費繪圖模型，不會發出畫圖請求。');settingsSave();});
    $('ai-analyze-btn').addEventListener('click',generateAI);$('cancel-ai').addEventListener('click',() => cancelAI());
    $('approve-recipe').addEventListener('click',() => prepareShare());
    $('equipment-choices').addEventListener('change',() => {syncFields();touch('器具已更新，可重新生成食譜。');});
    $('chef-name-input').addEventListener('change',() => prepareShare(true));
    $('share-base').addEventListener('input',() => {settingsSave();invalidateQR();clearTimeout(qrTimer);if (approved) qrTimer=setTimeout(refreshQR,400);});
    $('magnet-size').addEventListener('change',() => {draft.size=$('magnet-size').value;settingsSave();saveDraft();refreshQR();});
    $('preview-parent').addEventListener('click',async() => {try {const work=await Pub.makeWork(validPayload(),conceptImage?.key===conceptKey()?conceptImage.asset:null,$('share-base').value);window.WorkshopPublisherUI.preview(work);} catch (e) {$('review-status').textContent=e.message;$('review-status').scrollIntoView({block:'center'});}});
    $('print-magnet').addEventListener('click',async() => {try {await printEntries([ensureQR()]);} catch (e) {error('qr-error',e.message);}});
    $('queue-magnet').addEventListener('click',() => {
      try {const entry=ensureQR();if (queue.length>=60) throw new Error('佇列最多60份作品，請先打印或移除部分作品。');
        if (queue.some(x => JSON.stringify(x.payload)===entry.fingerprint&&x.base===entry.base)) throw new Error('這個版本已在佇列。');
        queue.push({payload:snapshot(entry.payload),size:entry.size,base:entry.base});renderQueue();queueSave();
      } catch (e) {error('qr-error',e.message);}
    });
    $('export-draft').addEventListener('click',() => {syncFields();saveDraft();download('我的惜食食譜-草稿.json',draft);});
    $('export-approved').addEventListener('click',() => {try {const entry=ensureQR();download('我的惜食食譜-文字版.json',{kind:'food-workshop-approved',version:1,payload:entry.payload,size:entry.size==='acrylic'?'standard':entry.size});} catch (e) {error('qr-error',e.message);}});
    $('import-draft').addEventListener('change',async event => {
      try {if (!initialized) throw new Error('請先成功載入食材資料。');const raw=await jsonFile(event.target.files[0]),restored=reviewedDraft(raw),incoming=restored.value;
        if (!confirm('開啟草稿會取代目前作品；如要保留，請先取消並下載目前草稿。繼續？')) return;
        resetConcept();draft=incoming;comparison=null;touch('已開啟草稿。');fillFields();draftReviewNotice(raw,restored.removed);saveDraft();prepareShare(true);
      } catch (e) {$('draft-status').textContent=e.message;} finally {event.target.value='';}
    });
    $('new-project').addEventListener('click',() => {if (!confirm('開始另一份作品會取代目前草稿；如要保留，請先下載。繼續？')) return;resetConcept();draft=fresh();comparison=null;touch('已開始新作品。');fillFields();saveDraft();});
    $('import-approved').addEventListener('change',async event => {
      try {
        const files=[...event.target.files];if (!files.length) return;if (files.length+queue.length>60) throw new Error('佇列最多60份作品。');
        const base=C.shareBase($('share-base').value), incoming=[];
        for (const file of files) {const raw=await jsonFile(file);if (raw.kind!=='food-workshop-approved'||raw.version!==1||raw.payload?.v!==2) throw new Error(`${file.name} 不是食譜作品檔案。`);incoming.push({payload:C.validatePayload(raw.payload),size:Object.hasOwn(C.sizes,raw.size)?raw.size:'standard',base});}
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
  // Read-only food list and an explicit picker action for the learning encyclopedia.
  // Selecting prepares the form only: the student still decides the amount and adds it.
  window.FoodWorkshopPicker=Object.freeze({
    foods:()=>initialized?database.filter(f=>f.status==='verified').map(f=>({code:f.code,name:f.name,state:f.state})):[],
    selectFood(code){
      const food=database.find(f=>f.code===code&&f.status==='verified');
      if(!initialized||!food)return false;
      $('category-select').value=food.category;foodOptions();
      $('food-select').value=food.code;showFoodDetail();
      return true;
    }
  });
  window.WorkshopPublishing=Object.freeze({
    current(){const payload=validPayload();return {payload,image:conceptImage?.key===conceptKey()?snapshot(conceptImage.asset):null,base:$('share-base').value,busy:Boolean(pendingImage),size:draft.size};},
    status(){let valid=false;try{valid=initialized&&Boolean(C.payload(draft,database))&&$('servings').checkValidity()&&Boolean($('servings').value)&&[...$('plate-list').querySelectorAll('input:not(:disabled)')].every(el=>el.value&&el.checkValidity());}catch{}return {valid,image:conceptImage?.key===conceptKey(),busy:Boolean(pendingImage)};},
    buildQR,printEntries
  });
  async function boot() {
    const root=document.createElement('div');root.id='print-root';document.body.append(root);
    bind();
    const settings=readStorage(SETTINGS_KEY);$('share-base').value=typeof settings?.base==='string'?settings.base:autoBase();
    // Paid calls remain manual. A saved explicit choice is respected.
    $('image-model').value=C.imageModels.some(m=>m.id===settings?.imageModel)||settings?.imageModel==='free-only'?settings.imageModel:'bytedance-seed/seedream-5-0-flash';renderImageChoice();
    $('text-model').value=A.choose(settings);renderTextChoice();
    $('text-model').addEventListener('change',()=>{if(pendingAI)cancelAI('已停止套用舊模型的回覆；按生成才會呼叫新模型。');renderTextChoice();settingsSave();});
    restoreQueue();renderQueue();fillFields();
    if (location.hash.startsWith('#recipe=')) {
      try {if (!window.LZString) throw new Error('壓縮程式未載入，請檢查網絡並重新整理。');renderParent(C.decodeHash(location.hash,LZString));}
      catch (e) {error('food-error',`未能開啟這個食譜：${e.message}`);switchTab('app');}
    }
    await loadFoods();
  }
  boot();
})();
