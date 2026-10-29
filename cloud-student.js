(() => {
 'use strict';const Cloud=window.CloudWorkshop,B=window.WorkshopPublishing,P=window.WorkshopPublication,$=id=>document.getElementById(id),KEY='food-cloud-student-v1',SAVED='food-cloud-submitted-v1';
 let busy=false,epoch=0,session=null,submitted=null;
 function read(key){try{return JSON.parse(localStorage.getItem(key));}catch{return null;}}
 function store(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
 function fingerprint(current){return P.hash(JSON.stringify({payload:current.payload,image:current.image?{dataURL:current.image.dataURL,model:current.image.model}:null}));}
 function status(message,kind=''){$('cloud-student-status').textContent=message;$('cloud-student-status').dataset.state=kind;}
 function inputs(){return {code:$('cloud-code').value.trim().toUpperCase(),number:Number($('cloud-number').value)};}
 async function update(){
  if(busy){$('cloud-submit').disabled=true;return;}
  const at=++epoch,available=B.status();$('cloud-submit').disabled=busy||!available.valid||available.busy||(!available.image&&!$('pub-text-fallback').checked);if(busy)return;
  if(!available.valid){$('cloud-qr').hidden=true;status('完成材料、菜名及步驟後，再提交作品。');return;}
  if(available.busy){$('cloud-qr').hidden=true;status('概念圖正在生成，完成後便可提交。');return;}
  if(submitted){try{const signature=await fingerprint(B.current()),entry=inputs();if(at!==epoch)return;if(signature===submitted.signature&&entry.code===submitted.code&&entry.number===submitted.number){await show(submitted.work,false,at);status('已成功儲存於雲端，老師已可看到此版本。','saved');return;}}catch{}}
  if(at!==epoch)return;$('cloud-qr').hidden=true;status(available.image?'食譜及概念圖已準備好，按一次即可交給老師。':'請先生成概念圖；文字後備需要老師在管理頁批准。');
 }
 async function show(raw,verify=true,at=epoch){
  const work=verify?await Cloud.verified(raw.id):Cloud.validateWork(raw),dataURL=await Cloud.qr(work);if(at!==epoch)return;
  const card=Cloud.magnet(work);card.image.src=dataURL;$('cloud-qr-card').replaceChildren(card.article);$('cloud-parent-link').href=work.url;$('cloud-parent-link').textContent='開啟已儲存的家長頁';$('cloud-work-id').textContent='作品代號：'+work.id;$('cloud-qr').hidden=false;
 }
 function device(){const bytes=crypto.getRandomValues(new Uint8Array(32));return [...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');}
 async function join(entry){
  if(!entry.code||!Number.isInteger(entry.number)||entry.number<1||entry.number>60)throw new Error('請填寫老師提供的工作坊代碼及學生編號。');
  if(session?.code===entry.code&&session.number===entry.number&&session.expires>Date.now()/1000+60)return session;
  const secret=session?.device||device(),result=await Cloud.request('/api/join',{method:'POST',data:{...entry,device:secret}});session={...result,...entry,device:secret};
  if(!store(KEY,session))status('裝置未能保存登入記錄；提交後請保留作品網址，並請老師確認已收到。');return session;
 }
 window.CloudStudentAuth=Object.freeze({async token(){return (await join(inputs())).token;},invalidate(){if(session){session={...session,expires:0};store(KEY,session);}}});
 $('cloud-submit').addEventListener('click',async()=>{
  if(busy)return;busy=true;++epoch;$('cloud-code').disabled=true;$('cloud-number').disabled=true;$('cloud-qr').hidden=true;$('cloud-submit').disabled=true;const at=epoch;
  try{
   const current=B.current();if(current.busy)throw new Error('請等概念圖完成後再提交。');const signature=await fingerprint(current),entry=inputs();status('正在連接工作坊…','saving');await join(entry);
   if(!current.image&&!$('pub-text-fallback').checked)throw new Error('請先生成概念圖。');
   status('正在儲存食譜及圖片，請保留本頁…','saving');const image=await Cloud.compress(current.image);
   let result;try{result=await Cloud.request('/api/works',{method:'POST',token:session.token,data:{payload:current.payload,image},timeout:60000});}catch(e){if(e.status===401){session={code:session.code,number:session.number,device:session.device,expires:0};store(KEY,session);}throw e;}
   status('已儲存，正在核對家長頁及圖片…','saving');const work=await Cloud.verified(result.work.id);submitted={signature,work:{...work,image:work.image?{...work.image,dataURL:undefined}:null},...entry};const kept=store(SAVED,submitted);
   const latest=await fingerprint(B.current());if(signature!==latest){status('上一版本已儲存，但食譜剛有修改。請完成修改後再提交新版本。');return;}
   await show(work,false,at);status('已成功儲存於雲端！老師已收到，可由老師批次列印磁貼。'+(kept?'':' 請保留作品網址並請老師確認。'),'saved');
  }catch(e){status(e.message+' 草稿仍在這部裝置，未顯示可派發的QR。','error');}finally{busy=false;$('cloud-code').disabled=false;$('cloud-number').disabled=false;const available=B.status();$('cloud-submit').disabled=!available.valid||available.busy||(!available.image&&!$('pub-text-fallback').checked);}
 });
 ['cloud-code','cloud-number'].forEach(id=>$(id).addEventListener('input',()=>{submitted=null;$('cloud-qr').hidden=true;update();}));
 $('pub-text-fallback').addEventListener('change',update);window.addEventListener('workshop-publication:changed',update);window.addEventListener('food-workshop:ready',update);
 session=read(KEY);submitted=read(SAVED);$('cloud-code').value=new URLSearchParams(location.search).get('class')||session?.code||'';$('cloud-number').value=session?.number||'';
 if(submitted){try{submitted.work=Cloud.validateWork(submitted.work);}catch{submitted=null;}}
 update();
})();
