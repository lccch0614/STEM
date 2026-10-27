/* Versioned offline transfer, local image persistence and static parent pages. */
(() => {
  'use strict';
  const C=window.FoodWorkshopCore, MAX_IMAGE=1600000, MAX_WORKS=60;
  const utf8=new TextEncoder(),esc=C.esc;
  const copy=x=>JSON.parse(JSON.stringify(x));
  const notify=()=>window.dispatchEvent(new CustomEvent('workshop-publication:changed'));
  const bytes64=text=>Uint8Array.from(atob(text),c=>c.charCodeAt(0));
  function base64(bytes){let out='';for(let i=0;i<bytes.length;i+=16384)out+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(out);}
  async function hash(data){if(!window.crypto?.subtle)throw new Error('此瀏覽器未能建立作品代號，請使用HTTPS網站及較新的瀏覽器。');return [...new Uint8Array(await crypto.subtle.digest('SHA-256',typeof data==='string'?utf8.encode(data):data))].map(x=>x.toString(16).padStart(2,'0')).join('');}
  function rootURL(value){const u=new URL(C.shareBase(value));u.search='';u.hash='';if(!u.pathname.endsWith('/'))u.pathname=/\.[a-z0-9]+$/i.test(u.pathname)?u.pathname.slice(0,u.pathname.lastIndexOf('/')+1):u.pathname+'/';return u.href;}
  function jpegBytes(asset){
    if(!asset||typeof asset.dataURL!=='string'||asset.dataURL.length>MAX_IMAGE||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(asset.dataURL)||!Number.isInteger(asset.width)||!Number.isInteger(asset.height)||asset.width<1||asset.height<1||asset.width>1024||asset.height>1024)throw new Error('作品圖片格式或大小無效。');
    const bytes=bytes64(asset.dataURL.split(',')[1]);if(bytes.length<4||bytes[0]!==255||bytes[1]!==216||bytes[2]!==255||bytes.at(-2)!==255||bytes.at(-1)!==217)throw new Error('作品圖片不是有效JPEG。');let at=2,dimensions=null;
    while(at+4<bytes.length){if(bytes[at]!==255)break;const marker=bytes[at+1];if(marker===218||marker===217)break;const length=(bytes[at+2]<<8)|bytes[at+3];if(length<2||at+2+length>bytes.length)throw new Error('JPEG圖片結構損壞。');if([192,193,194].includes(marker)){dimensions={height:(bytes[at+5]<<8)|bytes[at+6],width:(bytes[at+7]<<8)|bytes[at+8]};break;}at+=length+2;}
    if(!dimensions||dimensions.width!==asset.width||dimensions.height!==asset.height)throw new Error('JPEG圖片尺寸與作品記錄不相符。');return bytes;
  }
  async function normalizeImage(dataURL){
    if(typeof dataURL!=='string'||dataURL.length>28000000||!/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(dataURL))throw new Error('生成圖片格式無效。');
    const img=new Image();img.src=dataURL;await img.decode();
    if(!img.naturalWidth||!img.naturalHeight||img.naturalWidth>8192||img.naturalHeight>8192)throw new Error('生成圖片尺寸無效。');
    const ratio=Math.min(1,1024/Math.max(img.naturalWidth,img.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(img.naturalHeight*ratio));
    const ctx=canvas.getContext('2d');if(!ctx)throw new Error('瀏覽器無法保存圖片。');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
    let result=canvas.toDataURL('image/jpeg',.82);if(result.length>MAX_IMAGE)result=canvas.toDataURL('image/jpeg',.6);
    const asset={dataURL:result,width:canvas.width,height:canvas.height};jpegBytes(asset);return asset;
  }
  let database;
  function openDB(){
    if(database)return database;
    database=new Promise((resolve,reject)=>{
      if(!window.indexedDB){reject(new Error('瀏覽器不支援本機圖片自動儲存，請下載作品包備份。'));return;}
      const r=indexedDB.open('food-workshop-publication-v1',1);
      r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains('active'))db.createObjectStore('active');if(!db.objectStoreNames.contains('works'))db.createObjectStore('works',{keyPath:'id'});};
      r.onerror=()=>reject(new Error('未能開啟本機作品儲存，請保留下載的作品包。'));r.onblocked=()=>reject(new Error('作品儲存被其他分頁阻擋，請關閉舊分頁後重試。'));
      r.onsuccess=()=>{const db=r.result;db.onversionchange=()=>db.close();resolve(db);};
    });return database;
  }
  async function storage(store,mode,action){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(store,mode);let result;try{result=action(tx.objectStore(store));}catch(e){reject(e);return;}tx.oncomplete=()=>resolve(result?.result);tx.onerror=()=>reject(new Error('本機儲存未成功，請即下載作品包備份。'));tx.onabort=tx.onerror;});}
  const store={
    active:()=>storage('active','readonly',s=>s.get('current')),
    saveActive:record=>storage('active','readwrite',s=>s.put(copy(record),'current')),
    clearActive:()=>storage('active','readwrite',s=>s.delete('current')),
    works:()=>storage('works','readonly',s=>s.getAll()),
    saveWorks:works=>storage('works','readwrite',s=>{works.forEach(w=>s.put(copy(w)));}),
    removeWork:id=>storage('works','readwrite',s=>s.delete(id))
  };
  function imageMeta(image,sha){return image?{sha256:sha,width:image.width,height:image.height,model:image.model||'unknown'}:null;}
  async function makeWork(payload,image,base){
    const clean=C.validatePayload(payload);if(clean.v!==2)throw new Error('請先把舊作品開啟及更新為新版食譜。');const imageHash=image?await hash(jpegBytes(image)):null;
    const meta=imageMeta(image,imageHash),digest=await hash(JSON.stringify({payload:clean,image:meta}));
    return {kind:'food-workshop-work',version:1,id:'w-'+digest.slice(0,24),digest,base:rootURL(base),createdAt:new Date().toISOString(),payload:clean,image:image?{...meta,dataURL:image.dataURL}:null};
  }
  async function validateWork(raw){
    if(raw?.kind!=='food-workshop-work'||raw.version!==1||!/^w-[a-f0-9]{24}$/.test(raw.id)||!/^[a-f0-9]{64}$/.test(raw.digest)||typeof raw.createdAt!=='string'||raw.createdAt.length>40||!Number.isFinite(Date.parse(raw.createdAt)))throw new Error('這不是有效的食譜圖片作品。');
    if(raw.image&&(!/^[a-f0-9]{64}$/.test(raw.image.sha256)||typeof raw.image.model!=='string'||raw.image.model.length>100))throw new Error('圖片記錄無效。');
    const rebuilt=await makeWork(raw.payload,raw.image,raw.base);
    if(rebuilt.id!==raw.id||rebuilt.digest!==raw.digest||(raw.image&&rebuilt.image.sha256!==raw.image.sha256))throw new Error('作品內容與代號不相符，請重新下載原作品包。');
    rebuilt.createdAt=raw.createdAt;return rebuilt;
  }
  const url=work=>work.cloudId&&/^c-[a-f0-9]{32}$/.test(work.cloudId)?new URL('recipe.html?id='+work.cloudId,work.base).href:new URL('r/'+work.id+'.html',work.base).href;
  function pageHTML(work,preview=false){
    const p=work.payload,values=Object.entries(C.nutrients).map(([key,m])=>`${m.label}：${p.u[key]===null?'資料不足':p.u[key]+' '+m.unit}`).join(' · ');
    const noteFields=[['惜食方法',p.w],['設計說明',p.r],['敏感食材備註',p.a],['可能涉及的致敏物',p.z]].filter(([,v])=>v);
    return '<!doctype html>\n'+`<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="food-work-id" content="${work.id}"><meta name="food-work-digest" content="${work.digest}"><title>${esc(p.t)}｜親子惜食食譜</title><style>body{margin:0;background:#f1f7f3;color:#173e34;font:17px/1.85 system-ui,-apple-system,sans-serif}main{max-width:820px;margin:auto;padding:24px 16px}header,section{background:white;border:1px solid #d4e4da;border-radius:16px;padding:22px;margin:0 0 18px}h1{font-size:30px;line-height:1.4}h2{font-size:21px;margin:0 0 12px}p{margin:10px 0}img{display:block;width:100%;height:auto;border-radius:12px}li{margin:12px 0}label{display:flex;gap:12px}input{width:20px;height:20px;flex-shrink:0;margin-top:6px}small{display:block;color:#52695e;font-size:14px}a{color:#155f41;overflow-wrap:anywhere}.meta{color:#52695e}ol,ul{padding-left:25px}@media print{body{background:white}header,section{border:0;padding:8px 0;break-inside:avoid}img{max-height:80mm;object-fit:contain}main{padding:0}}</style></head><body><main><header><p>${esc(p.c)}的親子惜食食譜</p><h1>${esc(p.t)}</h1><p class="meta">${p.n}人份${p.m?' · 預計'+p.m+'分鐘':''}${p.e?' · 器具：'+esc(p.e):''}</p><small>作品代號：${work.id}</small></header>${work.image?`<section><h2>我的菜式概念圖</h2><img src="${preview?work.image.dataURL:work.id+'.jpg'}" alt="${esc(p.t)}的AI菜式概念圖"><small>圖片只供構思；實際材料及份量以以下食譜為準。</small></section>`:'<section><p>此作品使用老師確認的文字食譜後備版本。</p></section>'}<section><h2>材料與買餸清單</h2>${p.i.map(i=>`<label><input type="checkbox"><span>${esc(i)}</span></label>`).join('')}</section><section><h2>親子煮食步驟</h2><ol>${p.s.map(s=>'<li>'+esc(s)+'</li>').join('')}</ol></section>${noteFields.length?`<section><h2>食譜備註</h2>${noteFields.map(([label,value])=>`<p><strong>${label}：</strong>${esc(value)}</p>`).join('')}</section>`:''}<section><h2>每人營養估算</h2><p>${esc(values)}</p><small>資料版本：${esc(p.d)}。按材料所列狀態估算；缺項顯示資料不足，並非個人飲食建議。</small></section><section><h2>親子煮食提醒</h2><p>${esc(C.safety)}</p></section><p><a href="../">返回創科惜食小助手</a></p><small>這是已保存的作品頁，開啟不會再次呼叫AI。請與家長一起核對材料、過敏需要及煮食方法。</small></main></body></html>`;
  }
  function metadata(work){const out=copy(work);if(out.image){delete out.image.dataURL;out.image.file=work.id+'.jpg';}return out;}
  function addFiles(zip,work){zip.file('works/'+work.id+'.json',JSON.stringify(metadata(work)),{createFolders:false});if(work.image)zip.file('works/'+work.id+'.jpg',jpegBytes(work.image),{createFolders:false});}
  async function transferZip(works){
    if(!window.JSZip)throw new Error('作品打包程式未載入，請重新整理。');if(!works.length||works.length>MAX_WORKS)throw new Error('每個收集包可有1至60份作品。');
    const zip=new JSZip();zip.file('collection.json',JSON.stringify({kind:'food-workshop-collection',version:1,ids:works.map(w=>w.id)}));works.forEach(w=>addFiles(zip,w));
    const bytes=await zip.generateAsync({type:'uint8array',compression:'STORE'});if(bytes.length>64000000)throw new Error('收集包超出64MB，請先分批收集及備份。');return bytes;
  }
  // Our packages use STORE: photographs are already compressed. Reject compressed or
  // encrypted imports before decompression and bound every entry and archive size.
  function checkZip(bytes){
    if(!(bytes instanceof Uint8Array)||bytes.length<22||bytes.length>64000000)throw new Error('請選擇64MB以下的原裝作品包。');
    const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),end=bytes.length-22;
    if(v.getUint32(end,true)!==0x06054b50||v.getUint16(end+20,true)!==0||v.getUint16(end+4,true)!==0||v.getUint16(end+6,true)!==0)throw new Error('不是支援的原裝作品包。請勿重新壓縮。');
    const count=v.getUint16(end+10,true),offset=v.getUint32(end+16,true),size=v.getUint32(end+12,true);
    if(count<2||count>130||v.getUint16(end+8,true)!==count||offset+size!==end)throw new Error('作品包目錄無效。');
    let pos=offset,total=0;const names=new Set(),decoder=new TextDecoder();
    for(let i=0;i<count;i++){
      if(pos+46>end||v.getUint32(pos,true)!==0x02014b50)throw new Error('作品包目錄損壞。');
      const flags=v.getUint16(pos+8,true),method=v.getUint16(pos+10,true),packed=v.getUint32(pos+20,true),unpacked=v.getUint32(pos+24,true),n=v.getUint16(pos+28,true),extra=v.getUint16(pos+30,true),comment=v.getUint16(pos+32,true);
      if(pos+46+n+extra+comment>end)throw new Error('作品包目錄超出範圍。');
      const name=decoder.decode(bytes.subarray(pos+46,pos+46+n));
      if(flags&1||method!==0||packed!==unpacked||unpacked>2200000||!name||name.includes('..')||name.includes('\\')||name.startsWith('/')||names.has(name)||!(/^(collection\.json|works\/w-[a-f0-9]{24}\.(json|jpg))$/.test(name)))throw new Error('請匯入系統原裝作品包，不接受重壓或其他檔案。');
      names.add(name);total+=unpacked;if(total>64000000)throw new Error('收集包太大，請分批匯入。');pos+=46+n+extra+comment;
    }
    if(pos!==end)throw new Error('作品包目錄長度無效。');return names;
  }
  async function importZip(data){
    checkZip(data);const zip=await JSZip.loadAsync(data,{checkCRC32:true,createFolders:false});
    const manifestFile=zip.file('collection.json');if(!manifestFile)throw new Error('缺少收集包資料。');
    const manifest=JSON.parse(await manifestFile.async('string'));
    if(manifest.kind!=='food-workshop-collection'||manifest.version!==1||!Array.isArray(manifest.ids)||!manifest.ids.length||manifest.ids.length>MAX_WORKS||new Set(manifest.ids).size!==manifest.ids.length||manifest.ids.some(id=>!/^w-[a-f0-9]{24}$/.test(id)))throw new Error('收集包格式無效。');
    const allowed=new Set(['collection.json']),out=[];
    for(const id of manifest.ids){
      const name='works/'+id+'.json',file=zip.file(name);allowed.add(name);if(!file)throw new Error('作品包缺少食譜。');
      const raw=JSON.parse(await file.async('string'));if(raw.id!==id)throw new Error('作品代號不一致。');
      if(raw.image){const imageName='works/'+id+'.jpg';allowed.add(imageName);const image=zip.file(imageName);if(!image||raw.image.file!==id+'.jpg')throw new Error('作品包缺少對應概念圖。');raw.image.dataURL='data:image/jpeg;base64,'+base64(await image.async('uint8array'));delete raw.image.file;}
      out.push(await validateWork(raw));
    }
    if(Object.keys(zip.files).some(name=>!allowed.has(name)))throw new Error('作品包含有不屬於作品的額外檔案。');return out;
  }
  function mergeWorks(current,incoming){const map=new Map(current.map(w=>[w.id,w]));let duplicates=0;for(const w of incoming){const old=map.get(w.id);if(old){if(old.digest!==w.digest)throw new Error('作品代號重複但內容不同，未匯入。');duplicates++;}else map.set(w.id,w);}if(map.size>MAX_WORKS)throw new Error('本次最多收集60份作品，請先備份及分批。');return{works:[...map.values()],duplicates};}
  async function uploadZip(works){
    if(!works.length)throw new Error('請先匯入作品。');const zip=new JSZip();
    for(const w of works){zip.file('r/'+w.id+'.html',pageHTML(w),{createFolders:false});if(w.image)zip.file('r/'+w.id+'.jpg',jpegBytes(w.image),{createFolders:false});}
    zip.file('README-上傳說明.txt','把r資料夾完整上傳至STEM專案根目錄，與index.html並列。不要刪除原有r資料夾內的舊作品。待GitHub Pages更新後，回到老師收集台核對連結再打印。\n作品網址：\n'+works.map(w=>url(w)).join('\n'));
    return zip.generateAsync({type:'uint8array',compression:'STORE'});
  }
  async function verifyOnline(work){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
    try{
      const page=await fetch(url(work),{cache:'no-store',signal:controller.signal});if(!page.ok)throw new Error('作品頁未上線（'+page.status+'）');const html=await page.text();
      if(!html.includes('name="food-work-id" content="'+work.id+'"')||!html.includes('name="food-work-digest" content="'+work.digest+'"'))throw new Error('作品頁不是這份定稿版本');
      if(work.image){const image=await fetch(new URL('r/'+work.id+'.jpg',work.base).href,{cache:'no-store',signal:controller.signal});if(!image.ok)throw new Error('概念圖未上線（'+image.status+'）');if(await hash(new Uint8Array(await image.arrayBuffer()))!==work.image.sha256)throw new Error('上線圖片與作品包不一致');}
      return true;
    }catch(e){if(e.name==='AbortError')throw new Error('核對等候逾時，請檢查網絡後重試');throw e;}finally{clearTimeout(timer);}
  }
  window.WorkshopPublication=Object.freeze({MAX_WORKS,hash,rootURL,normalizeImage,jpegBytes,makeWork,validateWork,url,pageHTML,transferZip,importZip,mergeWorks,uploadZip,verifyOnline,store,notify});
})();
