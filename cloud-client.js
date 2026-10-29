(() => {
 'use strict';
 const config=window.CloudWorkshopConfig,C=window.FoodWorkshopCore,P=window.WorkshopPublication;
 function bytes64(bytes){let s='';for(let i=0;i<bytes.length;i+=16384)s+=String.fromCharCode(...bytes.subarray(i,i+16384));return btoa(s);}
 const publicURL=id=>config.site+'recipe.html?id='+id;
 async function request(path,{method='GET',token='',data,timeout=30000}={}){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  try{const response=await fetch(config.api+path,{method,cache:'no-store',headers:{...(data!==undefined?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(data!==undefined?{body:JSON.stringify(data)}:{}),signal:controller.signal});
   let body;try{body=await response.json();}catch{throw new Error('雲端服務回覆未能讀取，請稍候手動重試。');}
   if(!response.ok||body.error){const e=new Error(body.error||'雲端操作未完成。');e.status=response.status;throw e;}return body;
  }catch(e){if(e.name==='AbortError')throw new Error('儲存服務等候逾時，草稿仍保留；請手動重試，重複提交不會產生重複作品。');if(e instanceof TypeError)throw new Error('未能連接儲存服務，請檢查網絡；草稿仍在這部裝置。');throw e;}finally{clearTimeout(timer);}
 }
 function validateWork(raw){
  if(raw?.kind!=='food-workshop-cloud-work'||raw.version!==1||!/^c-[a-f0-9]{32}$/.test(raw.id)||!/^[a-f0-9]{64}$/.test(raw.digest)||!Number.isFinite(Date.parse(raw.createdAt)))throw new Error('雲端作品資料格式無效。');
  const work={...raw,payload:C.validatePayload(raw.payload),url:publicURL(raw.id),base:config.site};if(work.payload.v!==2)throw new Error('作品版本無效。');
  if(raw.image){if(!/^[a-f0-9]{64}$/.test(raw.image.sha256)||!Number.isInteger(raw.image.width)||!Number.isInteger(raw.image.height)||raw.image.width<1||raw.image.width>1024||raw.image.height<1||raw.image.height>1024||typeof raw.image.model!=='string'||raw.image.model.length>100)throw new Error('雲端圖片記錄無效。');work.image={...raw.image,url:config.api+'/api/works/'+raw.id+'/image'};}else work.image=null;
  work.cloudId=work.id;return work;
 }
 async function getWork(id){if(!/^c-[a-f0-9]{32}$/.test(id||''))throw new Error('作品代號無效，請核對QR code。');return validateWork(await request('/api/works/'+id));}
 async function getImage(work){
  if(!work.image)return null;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),30000);
  try{const response=await fetch(work.image.url,{cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error('作品圖片未能讀取，請稍候再試。');const bytes=new Uint8Array(await response.arrayBuffer());if(bytes.length>350000||await P.hash(bytes)!==work.image.sha256)throw new Error('圖片與已儲存作品不相符，暫時不能列印。');return {...work.image,dataURL:'data:image/jpeg;base64,'+bytes64(bytes)};}finally{clearTimeout(timer);}
 }
 async function verified(id){const work=await getWork(id);const image=work.image?{sha256:work.image.sha256,width:work.image.width,height:work.image.height,model:work.image.model}:null;if(await P.hash(JSON.stringify({payload:work.payload,image}))!==work.digest)throw new Error('食譜與作品記錄不相符，暫時不能列印。');if(work.image)work.image=await getImage(work);return work;}
 async function compress(asset){
  if(!asset)return null;P.jpegBytes(asset);const img=new Image();img.src=asset.dataURL;await img.decode();const canvas=document.createElement('canvas');
  for(const [max,quality] of [[1024,.78],[1024,.6],[768,.65],[640,.55],[512,.5]]){
   const ratio=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));canvas.width=Math.round(img.naturalWidth*ratio);canvas.height=Math.round(img.naturalHeight*ratio);const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
   const candidate={dataURL:canvas.toDataURL('image/jpeg',quality),width:canvas.width,height:canvas.height,model:asset.model||'unknown'};if(P.jpegBytes(candidate).length<=350000)return candidate;
  }throw new Error('概念圖仍太大，請老師協助下載備份及處理。');
 }
 function parentHTML(work){return P.pageHTML({...work,image:work.image?{...work.image,dataURL:work.image.dataURL||work.image.url}:null},true).replace('href="../"','href="'+config.site+'"');}
 function preview(work){const dialog=document.createElement('dialog');dialog.className='pub-preview';const close=document.createElement('button');close.type='button';close.className='ws-secondary';close.textContent='關閉預覽';close.addEventListener('click',()=>dialog.close());const note=document.createElement('p');note.textContent='已儲存作品預覽；QR會開啟此版本的食譜及圖片。';const frame=document.createElement('iframe');frame.title=work.payload.t+'家長頁';frame.setAttribute('sandbox','');frame.srcdoc=parentHTML(work);dialog.append(close,note,frame);dialog.addEventListener('close',()=>dialog.remove());document.body.append(dialog);dialog.showModal();}
 function magnet(work){const article=document.createElement('article');article.className='ws-magnet ws-magnet-card';const header=document.createElement('div');header.className='magnet-header';header.textContent='獅子會蔣翠琼中學';const subtitle=document.createElement('div');subtitle.className='magnet-subtitle';subtitle.textContent='小廚師：'+work.payload.c;subtitle.title=subtitle.textContent;const caption=document.createElement('div');caption.className='magnet-title';caption.textContent=work.payload.t;const image=document.createElement('img');image.alt=work.payload.t+'食譜QR code';const foot=document.createElement('div');foot.className='magnet-foot';foot.textContent='掃碼睇食譜及圖片';const deco=document.createElement('div');deco.className='magnet-deco';deco.textContent='🥦  🍅  🥕   惜食同行';article.append(header,subtitle,caption,image,foot,deco);return {article,image};}
 async function qr(work){const symbol=QRCode.create(work.url,{errorCorrectionLevel:'M'});if(40/(symbol.modules.size+8)<.32)throw new Error('作品網址過長，未能製作此尺寸QR。');return QRCode.toDataURL(work.url,{errorCorrectionLevel:'M',width:600,margin:4});}
 async function printWorks(works){
  if(!works.length)throw new Error('請先選擇作品。');let root=document.getElementById('print-root');if(!root){root=document.createElement('div');root.id='print-root';document.body.append(root);}root.replaceChildren();
  for(let offset=0;offset<works.length;offset+=6){const page=document.createElement('div');page.className='ws-print-page';page.style.setProperty('--print-columns','3');page.style.setProperty('--magnet-width','55mm');for(const work of works.slice(offset,offset+6)){const card=magnet(work);card.image.src=await qr(work);page.append(card.article);}root.append(page);}
  root.classList.add('ws-measuring');try{await Promise.all([...root.querySelectorAll('img')].map(img=>img.decode()));if([...root.querySelectorAll('.ws-magnet')].some(card=>card.scrollHeight>card.clientHeight+2))throw new Error('磁貼排版超出範圍，請先核對列印尺寸。');}finally{root.classList.remove('ws-measuring');}window.print();
 }
 function download(name,bytes){const url=URL.createObjectURL(new Blob([bytes],{type:'application/zip'})),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
 async function backup(works,room,roster=[]){
  const zip=new JSZip(),manifest={kind:'food-workshop-cloud-backup',version:1,room:{id:room.id,name:room.name,capacity:room.capacity},roster:roster.map(s=>({number:s.number,currentWork:s.current_work,printWork:s.print_work})),works:[]};
  for(const work of works){const metadata=JSON.parse(JSON.stringify(work));if(metadata.image)delete metadata.image.dataURL;manifest.works.push(metadata);zip.file('works/'+work.id+'.html',P.pageHTML(work),{createFolders:false});zip.file('works/'+work.id+'.json',JSON.stringify(metadata,null,2),{createFolders:false});if(work.image)zip.file('works/'+work.id+'.jpg',P.jpegBytes(work.image),{createFolders:false});}
  zip.file('manifest.json',JSON.stringify(manifest,null,2));zip.file('README.txt','這是雲端作品的離線備份，包含食譜頁、概念圖及原作品網址。請保留雲端服務及原作品資料，確保已派發QR持續可用。此備份不含老師管理碼或工作坊加入代碼。');download('全班作品備份-'+works.length+'份.zip',await zip.generateAsync({type:'uint8array',compression:'STORE'}));
 }
 window.CloudWorkshop=Object.freeze({config,request,publicURL,validateWork,getWork,getImage,verified,compress,parentHTML,preview,magnet,qr,printWorks,backup,download});
})();
