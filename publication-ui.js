/* Collection is local to each teacher. GitHub publishing remains a manual step. */
(() => {
  'use strict';
  const P=window.WorkshopPublication,B=window.WorkshopPublishing,$=id=>document.getElementById(id);
  let works=[],verified=new Set(),busy=false,studentBusy=false,storageOK=false;
  const message=text=>{if(window.document)$('pub-desk-status').textContent=text;};
  function download(name,bytes){const blob=new Blob([bytes],{type:'application/zip'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
  function preview(work){
    const dialog=document.createElement('dialog');dialog.className='pub-preview';
    const close=document.createElement('button');close.type='button';close.className='ws-secondary';close.textContent='關閉預覽';close.addEventListener('click',()=>dialog.close());
    const note=document.createElement('p');note.textContent='本機預覽（未代表已上線）。正式家長頁會顯示以下食譜和已保存圖片。';
    const frame=document.createElement('iframe');frame.title=work.payload.t+'家長頁預覽';frame.setAttribute('sandbox','');frame.srcdoc=P.pageHTML(work,true);
    dialog.append(close,note,frame);dialog.addEventListener('close',()=>dialog.remove());document.body.append(dialog);dialog.showModal();
  }
  function studentState(){
    if(!window.document)return;
    const state=B.status(),fallback=$('pub-text-fallback').checked;
    $('pub-export-student').disabled=studentBusy||!state.valid||state.busy||(!state.image&&!fallback);
    if(studentBusy)return;
    $('pub-student-status').textContent=state.busy?'正在生成圖片，完成後便可下載作品包。':!state.valid?'請先完成材料、菜名和步驟。':state.image?'作品包會同時包含食譜和已保存的概念圖。':fallback?'老師已選擇文字版後備；此包不會附概念圖。':'請先生成概念圖，再下載作品包交給老師。';
  }
  function render(){
    if(!window.document)return;
    works.sort((a,b)=>a.payload.c.localeCompare(b.payload.c,'zh-Hant',{numeric:true})||a.id.localeCompare(b.id));
    const root=$('pub-work-list');root.replaceChildren();
    for(const work of works){
      const row=document.createElement('li'),info=document.createElement('div'),title=document.createElement('strong'),detail=document.createElement('small'),actions=document.createElement('div');
      title.textContent=work.payload.c+'：'+work.payload.t;
      detail.textContent=work.id+' · '+(work.image?'含概念圖':'文字後備')+' · '+(verified.has(work.id)?'已核對上線':'待上傳／核對');
      info.append(title,detail);actions.className='ws-actions';
      const view=document.createElement('button');view.type='button';view.className='ws-link';view.textContent='預覽';view.addEventListener('click',()=>preview(work));
      const remove=document.createElement('button');remove.type='button';remove.className='ws-link';remove.textContent='移除';remove.disabled=busy;remove.addEventListener('click',async()=>{
        if(!confirm('從這部裝置的收集台移除此作品？已上傳的家長頁及已下載作品包會保留。'))return;
        busy=true;render();try{await P.store.removeWork(work.id);works=works.filter(w=>w.id!==work.id);verified.delete(work.id);message('已從本機收集台移除。');}catch(e){message(e.message);}finally{busy=false;render();}
      });
      actions.append(view,remove);row.append(info,actions);root.append(row);
    }
    for(const id of ['pub-backup','pub-upload','pub-verify'])$(id).disabled=busy||!works.length;
    $('pub-import').disabled=busy||!storageOK;
    $('pub-print').disabled=busy||!works.length||!works.every(w=>verified.has(w.id));
  }
  async function task(action){if(busy)return;busy=true;render();try{await action();}catch(e){message(e.message);}finally{busy=false;render();}}
  $('pub-text-fallback').addEventListener('change',studentState);
  window.addEventListener('workshop-publication:changed',studentState);
  window.addEventListener('food-workshop:ready',studentState);
  $('pub-export-student').addEventListener('click',async()=>{
    if(studentBusy)return;studentBusy=true;studentState();
    try{
      const current=B.current();if(current.busy)throw new Error('請等圖片完成後再下載。');
      if(!current.image&&!$('pub-text-fallback').checked)throw new Error('請先生成圖片，或由老師確認文字版後備。');
      const work=await P.makeWork(current.payload,current.image,current.base),bytes=await P.transferZip([work]);
      download(work.id+'.foodwork.zip',bytes);
      $('pub-student-status').textContent='已交給瀏覽器下載：'+work.id+'.foodwork.zip。請在「下載項目」找檔案，交給老師。';
    }catch(e){$('pub-student-status').textContent=e.message;}finally{studentBusy=false;const state=B.status();$('pub-export-student').disabled=!state.valid||state.busy||(!state.image&&!$('pub-text-fallback').checked);}
  });
  $('pub-import').addEventListener('change',event=>{
    const files=[...event.target.files];event.target.value='';if(!files.length)return;
    task(async()=>{
      if(files.length>60)throw new Error('一次最多選擇60個作品包。');
      const base=P.rootURL($('share-base').value);let mergedWorks=works,duplicates=0,received=0;
      for(let i=0;i<files.length;i++){
        const file=files[i];message(`正在核對作品包 ${i+1}/${files.length}：${file.name}`);
        if(file.size>64000000)throw new Error(file.name+'超出64MB，請分批收集。');
        let records;try{records=await P.importZip(new Uint8Array(await file.arrayBuffer()));}catch(e){throw new Error(file.name+'：'+e.message);}
        if(records.some(w=>w.base!==base))throw new Error(file.name+'的正式網站網址與本頁設定不同。請先核對老師列印設定，避免印錯網址。');
        const next=P.mergeWorks(mergedWorks,records);mergedWorks=next.works;duplicates+=next.duplicates;received+=records.length;
      }
      await P.store.saveWorks(mergedWorks);works=mergedWorks;
      message(`已匯入${received-duplicates}份，略過${duplicates}份重複；本機共${works.length}份。請下載老師收集包備份。`);
    });
  });
  $('pub-backup').addEventListener('click',()=>task(async()=>{download('老師收集包-'+works.length+'份.zip',await P.transferZip(works));message('已下載老師收集包。可交給統籌老師匯入合併；請保留原檔備份。');}));
  $('pub-upload').addEventListener('click',()=>task(async()=>{download('GitHub上傳包-'+works.length+'份.zip',await P.uploadZip(works));message('已下載上傳包。解壓後將r資料夾上傳GitHub的STEM根目錄，保留舊作品；等Pages更新後按「核對上線作品及圖片」。');}));
  $('pub-verify').addEventListener('click',()=>task(async()=>{
    verified.clear();let failed=0;const issues=[];
    for(let i=0;i<works.length;i++){
      const work=works[i];message(`正在核對 ${i+1}/${works.length}：${work.payload.c}`);
      try{await P.verifyOnline(work);verified.add(work.id);}catch(e){failed++;issues.push(work.payload.c+'：'+e.message);}
      render();
    }
    message(failed?`已核對${works.length-failed}/${works.length}份。${issues.join('；')}。請檢查上傳及等待Pages更新，再核對。`:`全部${works.length}份食譜及所附圖片已上線，可列印磁貼。請仍用手機試掃一張。`);
  }));
  $('pub-print').addEventListener('click',()=>task(async()=>{
    if(!works.length||!works.every(w=>verified.has(w.id)))throw new Error('請先核對全部作品及圖片已上線。');
    const entries=[];for(const work of works)entries.push(await B.buildQR(work.payload,work.base,'acrylic',work));
    await B.printEntries(entries);message(`已準備${works.length}張43×43mm貼片，共${Math.ceil(works.length/15)}頁A4。請選實際大小100%，關閉頁首頁尾，先試印及掃碼。`);
  }));
  window.WorkshopPublisherUI=Object.freeze({preview});
  (async()=>{
    try{const stored=await P.store.works();if(!window.document)return;for(const work of stored)works.push(await P.validateWork(work));storageOK=true;message(`本機已有${works.length}份作品。先匯入作品包；列印前須重新核對上線。`);}
    catch(e){message(e.message+' 原有下載包仍可保留。請使用支援IndexedDB的正常瀏覽模式。');}
    render();studentState();
  })();
})();
