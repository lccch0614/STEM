/* Household measures are approximate; grams remain the canonical calculation basis. */
(() => {
  'use strict';
  const finite=(n,min,max)=>typeof n==='number'&&Number.isFinite(n)&&n>=min&&n<=max;
  const cleanText=(value,max,label)=>{if(typeof value!=='string'||!value.trim()||value.length>max)throw new Error(`${label}格式無效。`);return value.trim();};
  function grams(perUnit,quantity){if(!finite(perUnit,0.001,5000)||!finite(quantity,0.001,10000))throw new Error('請填寫有效份量。');const n=Math.round((perUnit*quantity+Number.EPSILON)*10)/10;if(!finite(n,0.1,5000))throw new Error('這項材料的總重量須介乎0.1至5000克。');return n;}
  function quantityText(n){const whole=Math.floor(n),fraction=Math.round((n-whole)*10000)/10000,symbol={0.25:'¼',0.5:'½',0.75:'¾'}[fraction];return symbol?`${whole||''}${symbol}`:String(Number(n.toFixed(3)));}
  function snapshot(guide,quantity,food){return {id:guide.id,label:guide.label,gramsPerUnit:guide.gramsPerUnit,quantity,kind:guide.kind,foodState:food.state};}
  function validateSnapshot(raw,weight,food,catalog){
    if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('份量記錄格式無效。');
    const p={id:cleanText(raw.id,80,'份量編號'),label:cleanText(raw.label,36,'份量單位'),gramsPerUnit:raw.gramsPerUnit,quantity:raw.quantity,kind:raw.kind,foodState:cleanText(raw.foodState,100,'食材狀態')};
    if(!['official','workshop'].includes(p.kind)||Math.abs(grams(p.gramsPerUnit,p.quantity)-weight)>0.05)throw new Error('份量與克數不一致，請核對草稿。');
    if(p.foodState!==food.state)return null;
    if(catalog&&p.kind==='official'&&!(catalog[food.code]||[]).some(g=>g.id===p.id&&g.label===p.label&&Math.abs(g.gramsPerUnit-p.gramsPerUnit)<1e-8))return null;
    return p;
  }
  function catalog(raw,database){
    if(raw?.version!==1||!raw.guides||typeof raw.guides!=='object'||raw.dataVersion!==database[0]?.dataVersion)throw new Error('家用份量資料版本不相符。');
    const byCode=new Map(database.map(f=>[f.code,f])),out={};
    for(const [code,list] of Object.entries(raw.guides)){
      const f=byCode.get(code);if(!f||f.status!=='verified'||!Array.isArray(list)||list.length>3)throw new Error('家用份量資料格式無效。');
      out[code]=list.map(g=>{const p=validateSnapshot({...g,quantity:1},grams(g.gramsPerUnit,1),f);if(!p||g.kind!=='official')throw new Error('家用份量食材狀態不符。');const source=g.source,divisor=source?.derivation==='referenceGrams / 14 halves'?14:Number(source?.referenceAmount);if(!finite(divisor,0.001,10000)||!finite(source?.referenceGrams,0.001,5000)||Math.abs(g.gramsPerUnit-source.referenceGrams/divisor)>1e-8)throw new Error('家用份量換算未能核對。');return {...p,quantity:undefined,note:cleanText(g.note,250,'份量說明'),defaultQuantity:finite(g.defaultQuantity,0.001,100)?g.defaultQuantity:1,source};});
    }return out;
  }
  function teacherGuide(raw,database){
    const f=database.find(x=>x.code===raw?.code);if(!f||f.status!=='verified')throw new Error('請先選擇可用食材。');
    if(raw.foodState!==f.state)throw new Error('實測份量的食材狀態與資料庫不符，請按目前狀態重新量度。');
    const label=cleanText(raw.label,24,'實測單位'),notes=cleanText(raw.notes,140,'量度說明');if(!finite(raw.gramsPerUnit,0.1,5000))throw new Error('實測重量須介乎0.1至5000克。');
    const photo=raw.photo||'';if(typeof photo!=='string'||photo.length>650000||(photo&&!/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(photo)))throw new Error('參考照片格式或大小無效。');
    const basis=JSON.stringify([f.code,label,raw.gramsPerUnit,f.state,notes]);let hash=2166136261;for(const c of basis)hash=Math.imul(hash^c.charCodeAt(0),16777619);
    return {code:f.code,id:`workshop-${f.code}-${(hash>>>0).toString(16)}`,label:label+'（工作坊）',inputLabel:label,gramsPerUnit:raw.gramsPerUnit,kind:'workshop',foodState:f.state,note:'工作坊實測參考；'+notes,notes,photo,defaultQuantity:1};
  }
  function settings(raw,database){if(raw?.kind!=='food-workshop-portions'||raw.version!==1||!Array.isArray(raw.guides)||raw.guides.length>database.length)throw new Error('這不是有效的工作坊份量設定檔。');const out={};for(const entry of raw.guides){const guide=teacherGuide(entry,database);if(out[guide.code])throw new Error('設定檔有重複食材。');out[guide.code]=guide;}return out;}
  function serialize(guides){return {kind:'food-workshop-portions',version:1,guides:Object.values(guides).map(g=>({code:g.code,label:g.inputLabel,gramsPerUnit:g.gramsPerUnit,notes:g.notes,photo:g.photo,foodState:g.foodState}))};}
  function signature(p){return p?JSON.stringify([p.id,p.label,p.gramsPerUnit,p.kind,p.foodState]):'';}
  const describe=p=>`${quantityText(p.quantity)}${p.label}`;
  window.PortionTools=Object.freeze({grams,quantityText,snapshot,validateSnapshot,catalog,teacherGuide,settings,serialize,signature,describe});
})();
