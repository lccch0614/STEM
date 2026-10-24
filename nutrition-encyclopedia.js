/* Sourced learning content; this module never changes a recipe or calls an AI. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const root = $('view-nutrition');
  if (!root) return;
  const filters = {all:'全部圖鑑',growth:'成長與修補',energy:'能量與活動',body:'身體運作',digest:'腸道與補水'};
  let content = null, entries = new Map(), filter = 'all', openId = '', anchorId = '', rendered = false, loading = false;
  let returnTarget = '', returnScroll = 0;
  const revealed = new Set(), foodOpen = new Set(), sourcesOpen = new Set();
  const node = (tag, text, cls) => { const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el; };
  const button = (text, cls, action) => {const el=node('button',text,cls);el.type='button';el.addEventListener('click',action);return el;};
  const normal = text => String(text).normalize('NFKC').toLowerCase().replace(/維生素/g,'維他命').replace(/\s+/g,'');
  const picker = () => window.FoodWorkshopPicker;
  function officialURL(value) {
    const url=new URL(value);
    if(url.protocol!=='https:'||!['www.chp.gov.hk','www.studenthealth.gov.hk','www.fhs.gov.hk','www.nei.nih.gov'].includes(url.hostname)||url.username||url.password)throw new Error('來源網址無效');
    return url.href;
  }
  function validate(raw) {
    if(raw?.version!==1||!Array.isArray(raw.entries)||raw.entries.length!==13||!raw.sources)throw new Error('圖鑑格式無效');
    const ids=new Set();
    for(const s of Object.values(raw.sources)){officialURL(s.url);if(!s.title||!s.checked)throw new Error('來源記錄不完整');}
    for(const e of raw.entries){
      if(!/^[a-z][a-z-]*$/.test(e.id)||ids.has(e.id))throw new Error('圖鑑編號無效');ids.add(e.id);
      if(['name','enName','power','icon','summary','myth','fact','recipeTip','question','answer'].some(k=>typeof e[k]!=='string'||!e[k].trim()))throw new Error('圖鑑內容不完整');
      if(!Array.isArray(e.roles)||!e.roles.length||e.roles.some(x=>typeof x!=='string')||!Array.isArray(e.aliases)||!Array.isArray(e.children)||!Array.isArray(e.tags)||e.tags.some(t=>!Object.hasOwn(filters,t)))throw new Error('圖鑑分類無效');
      if(!Array.isArray(e.foods)||e.foods.length<3||e.foods.some(f=>typeof f.label!=='string'||typeof f.note!=='string'||(f.code!==null&&!/^[a-z]+_\d{3}$/.test(f.code))))throw new Error('圖鑑食材無效');
      if(!Array.isArray(e.sourceIds)||!e.sourceIds.length||e.sourceIds.some(id=>!raw.sources[id]))throw new Error('缺少來源');
      if(e.analysisKey!==null&&!['carbs','protein','fat','fiber'].includes(e.analysisKey))throw new Error('分析項目無效');
    }
    if(raw.entries.filter(e=>!e.parent).length!==7||raw.entries.filter(e=>e.parent).length!==6)throw new Error('圖鑑數量不完整');
    const byId=new Map(raw.entries.map(e=>[e.id,e]));
    for(const e of raw.entries){if(e.parent&&(!byId.has(e.parent)||!byId.get(e.parent).children.includes(e.id)))throw new Error('專題分類無效');if(e.children.some(id=>!byId.has(id)||byId.get(id).parent!==e.id))throw new Error('專題連結無效');}
    return raw;
  }
  function section(title) {const el=node('section',undefined,'pedia-section');el.append(node('h4',title));return el;}
  function analysisNote(e) {
    const note=node('p',undefined,'pedia-analysis-note');
    note.textContent=e.analysisKey?'餐盤連結：可在餐盤查看這項營養的份量估算。':'知識介紹：未計入餐盤營養分析。';
    return note;
  }
  function foodChoices(e) {
    const wrap=node('div',undefined,'pedia-food-choices');
    const foods=picker()?.foods()||[], byCode=new Map(foods.map(f=>[f.code,f]));
    for(const food of e.foods){
      const item=node('div',undefined,'pedia-food-choice'),match=byCode.get(food.code);
      if(match){
        const choose=button(food.label+' →','pedia-food-button',()=>chooseFood(match.code,e));
        choose.setAttribute('aria-label',`到餐盤選擇${match.name}`);item.append(choose);
        item.append(node('small',match.name+'；'+match.state));
      }else{
        item.append(node('strong',food.label));
        item.append(node('small',food.code?'食材資料未就緒，暫時不能連動餐盤。':'知識例子；未提供餐盤選項。'));
      }
      if(food.note)item.append(node('small',food.note));wrap.append(item);
    }
    return wrap;
  }
  function chooseFood(code,e) {
    const result=picker()?.selectFood(code);
    if(!result){$('pedia-action-status').textContent='食材資料未就緒，請稍後再試。圖鑑仍可閱讀。';return;}
    returnTarget=anchorId;returnScroll=window.scrollY;
    $('pedia-return').hidden=false;
    $('pedia-return-label').textContent=`從「${e.name}」找到的食材已選好。揀份量後，再按「加入餐盤」。`;
    $('pedia-back').textContent=`返回「${e.name}」圖鑑`;
    window.switchTab('app');
    $('food-select').focus({preventScroll:true});
    $('ingredient-form').scrollIntoView({block:'start',behavior:'auto'});
  }
  function detail(e) {
    const panel=node('section',undefined,'pedia-detail');panel.id='pedia-open-detail';panel.setAttribute('aria-labelledby','pedia-detail-title');
    const header=node('div',undefined,'pedia-detail-head'),title=node('h3',e.name+' · '+e.power);title.id='pedia-detail-title';
    const close=button('收起圖鑑','pedia-link',()=>{const target=anchorId;openId='';render();$('pedia-toggle-'+target)?.focus({preventScroll:true});});
    header.append(title,close);panel.append(header,analysisNote(e));
    if(e.parent)panel.append(button('← 返回'+entries.get(e.parent).name+'家族','pedia-link',()=>openEntry(e.parent,anchorId)));
    const columns=node('div',undefined,'pedia-detail-columns');
    const work=section('我幫身體做甚麼？'),list=node('ul');e.roles.forEach(text=>list.append(node('li',text)));work.append(list);
    const myth=section('容易搞錯的事');myth.append(node('p',e.myth,'pedia-question-title'),node('p',e.fact));
    columns.append(work,myth);panel.append(columns);
    if(e.children.length){
      const family=section('認識家族成員'),links=node('div',undefined,'pedia-family-links');
      for(const id of e.children){const child=entries.get(id);links.append(button(child.name+' →','pedia-family-button',()=>openEntry(id,anchorId)));}
      family.append(links);panel.append(family);
    }
    const tip=section('設計食譜時可以怎樣用？');tip.append(node('p',e.recipeTip));panel.append(tip);
    const foods=section('可以在哪些食物找到我？');
    foods.append(node('p','以下是食物例子，並非營養含量排名。選擇後可自行決定份量。','pedia-secondary'));
    const reveal=button(foodOpen.has(e.id)?'收起食材':'查看相關食材','pedia-primary',()=>{foodOpen.has(e.id)?foodOpen.delete(e.id):foodOpen.add(e.id);render(true);});
    reveal.setAttribute('aria-expanded',String(foodOpen.has(e.id)));reveal.setAttribute('aria-controls','pedia-foods-'+e.id);foods.append(reveal);
    const choices=foodChoices(e);choices.id='pedia-foods-'+e.id;choices.hidden=!foodOpen.has(e.id);foods.append(choices);panel.append(foods);
    const think=node('details',undefined,'pedia-think');think.open=revealed.has(e.id);
    think.append(node('summary','想一想（選看）：'+e.question),node('p',e.answer));think.addEventListener('toggle',()=>{think.open?revealed.add(e.id):revealed.delete(e.id);});panel.append(think);
    const source=node('details',undefined,'pedia-sources');source.open=sourcesOpen.has(e.id);source.append(node('summary','資料來源與核對日期（選看）'));
    for(const id of e.sourceIds){const s=content.sources[id],p=node('p'),link=node('a',s.title);link.href=officialURL(s.url);link.target='_blank';link.rel='noopener noreferrer';p.append(link,node('small',s.scope+' · 核對日期：'+s.checked));source.append(p);}
    source.append(node('p','圖鑑文字按來源為學生改寫；食物例子不代表每款品牌均有相同含量。「超能力」是記憶比喻。','pedia-secondary'));
    source.addEventListener('toggle',()=>{source.open?sourcesOpen.add(e.id):sourcesOpen.delete(e.id);});panel.append(source);
    return panel;
  }
  function openEntry(id,anchor) {
    openId=id;anchorId=anchor;render();
    const panel=$('pedia-open-detail');panel?.scrollIntoView({block:'nearest',behavior:'auto'});
    const title=$('pedia-detail-title');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}
  }
  function matching() {
    const query=normal($('dict-search-input').value);
    return content.entries.filter(e=>{
      if(!query&&e.parent)return false;
      if(filter!=='all'&&!e.tags.includes(filter))return false;
      const text=[e.name,e.enName,e.power,e.summary,...e.aliases,...e.foods.flatMap(f=>[f.label,f.note,(picker()?.foods()||[]).find(x=>x.code===f.code)?.name||''])].join(' ');
      return !query||normal(text).includes(query);
    });
  }
  function render(keepFocus=false) {
    if(!content)return;
    const focused=keepFocus?document.activeElement?.getAttribute('data-pedia-focus'):null;
    const grid=$('dict-grid'),results=matching();grid.replaceChildren();rendered=true;
    $('pedia-result-count').textContent=$('dict-search-input').value.trim()||filter!=='all'?`找到 ${results.length} 張相關圖鑑`:'7 大營養類別 · 6 個延伸專題';
    if(!results.length){const empty=node('div',undefined,'pedia-empty');empty.append(node('p','暫時找不到相關圖鑑。可以試「蛋白質」「豆腐」或「維生素C」。'),button('清除搜尋及分類','pedia-primary',()=>{$('dict-search-input').value='';setFilter('all');$('dict-search-input').focus();}));grid.append(empty);return;}
    if(openId&&!results.some(e=>e.id===anchorId)){openId='';anchorId='';}
    const columns=window.matchMedia('(max-width: 640px)').matches?1:window.matchMedia('(max-width: 1024px)').matches?2:3;
    for(let i=0;i<results.length;i++){
      const e=results[i],tile=node('article',undefined,'pedia-card');tile.id='pedia-card-'+e.id;
      const icon=node('span',e.icon,'pedia-icon');icon.setAttribute('aria-hidden','true');
      tile.append(icon,node('p',e.parent?'延伸專題':'七大類別','pedia-eyebrow'),node('h2',e.name),node('p',e.enName,'pedia-english'),node('p',e.power,'pedia-power'),node('p',e.summary,'pedia-summary'));
      const examples=node('p',undefined,'pedia-food-examples');examples.append(node('span','食物例子：'),document.createTextNode(e.foods.slice(0,3).map(f=>f.label).join('、')));tile.append(examples);
      const active=openId&&anchorId===e.id,toggle=button(active?'收起圖鑑':'打開圖鑑 →','pedia-card-toggle',()=>{if(active){openId='';render();$('pedia-toggle-'+e.id)?.focus({preventScroll:true});}else openEntry(e.id,e.id);});
      toggle.id='pedia-toggle-'+e.id;toggle.setAttribute('aria-expanded',String(Boolean(active)));toggle.setAttribute('aria-label',(active?'收起':'打開')+e.name+'圖鑑');if(active)toggle.setAttribute('aria-controls','pedia-open-detail');
      if(active)tile.classList.add('is-selected');tile.append(toggle);grid.append(tile);
      if((i+1)%columns===0||i===results.length-1){const rowStart=Math.floor(i/columns)*columns;if(openId&&results.slice(rowStart,i+1).some(e=>e.id===anchorId))grid.append(detail(entries.get(openId)));}
    }
    for(const el of grid.querySelectorAll('.pedia-primary'))el.setAttribute('data-pedia-focus','foods-'+openId);
    if(focused)grid.querySelector(`[data-pedia-focus="${focused}"]`)?.focus({preventScroll:true});
  }
  function setFilter(value) {
    filter=Object.hasOwn(filters,value)?value:'all';openId='';
    for(const b of root.querySelectorAll('[data-pedia-filter]')){const active=b.dataset.pediaFilter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}
    render();
  }
  async function load() {
    if(loading)return;loading=true;
    $('pedia-load-status').hidden=false;$('pedia-load-status').textContent='正在載入營養圖鑑……';$('pedia-retry').hidden=true;
    try{
      const response=await fetch('./data/nutrition-encyclopedia.json?v=2026-10-24-1');if(!response.ok)throw new Error('未能載入');
      content=validate(await response.json());entries=new Map(content.entries.map(e=>[e.id,e]));$('pedia-load-status').hidden=true;render();
    }catch{$('pedia-load-status').textContent='圖鑑未能載入，請檢查網絡後重試。餐盤及其他活動仍可使用。';$('pedia-retry').hidden=false;}
    finally{loading=false;}
  }
  // The original tab controller calls this hook. Do not recreate cards on a return visit.
  window.renderNutritionCards=()=>{
    if(content&&!rendered)render();
    if(returnTarget){const target=returnTarget;returnTarget='';requestAnimationFrame(()=>{window.scrollTo({top:returnScroll,behavior:'auto'});$('pedia-toggle-'+target)?.focus({preventScroll:true});});}
  };
  window.filterNutritionCards=()=>{openId='';render();};
  window.setDictFilter=value=>setFilter(value);
  $('dict-search-input').addEventListener('input',window.filterNutritionCards);
  $('pedia-clear-search').addEventListener('click',()=>{$('dict-search-input').value='';openId='';render();$('dict-search-input').focus();});
  for(const b of root.querySelectorAll('[data-pedia-filter]'))b.addEventListener('click',()=>setFilter(b.dataset.pediaFilter));
  $('pedia-retry').addEventListener('click',load);
  $('pedia-back').addEventListener('click',()=>window.switchTab('nutrition'));
  window.addEventListener('food-workshop:ready',()=>{if(content)render();});
  // Only rebuild when the number of columns changes, preserving search and the open topic.
  for(const query of ['(max-width: 640px)','(max-width: 1024px)'])window.matchMedia(query).addEventListener?.('change',()=>render());
  load();
})();
