(() => {
 'use strict';const Cloud=window.CloudWorkshop,$=id=>document.getElementById(id),KEY='food-cloud-teacher-v1';let login=null,current=null,busy=false,timer=null,rooms=[],loading=false;
 const chosen=new Map(),checked=new Set();let versions=new Map();
 function status(message,kind=''){$('teacher-status').textContent=message;$('teacher-status').dataset.state=kind;}
 function loggedIn(value){$('teacher-login').hidden=value;$('teacher-content').hidden=!value;}
 function headers(path,options={}){return Cloud.request(path,{...options,token:login?.token||''});}
 function logout(){login=null;try{sessionStorage.removeItem(KEY);}catch{}clearInterval(timer);current=null;checked.clear();chosen.clear();$('teacher-roster').replaceChildren();$('teacher-room-card').hidden=true;loggedIn(false);status('已登出。');}
 function failure(e){if(e.status===401){logout();status('登入已到期，請重新輸入老師管理碼。','error');}else status(e.message,'error');}
 function controls(){$('teacher-room').disabled=busy;const any=checked.size>0;$('teacher-print').disabled=busy||!any;$('teacher-backup').disabled=busy||!current?.versions.length;$('teacher-refresh').disabled=busy;$('teacher-close').disabled=busy||!current||current.room.open_until<=Date.now()/1000;$('teacher-select-all').disabled=busy||!current?.versions.length;}
 function render(){
  if(!current)return;const {room,students,versions:all}=current,records=new Map(students.map(s=>[s.number,s]));versions=new Map(all.map(v=>[v.id,v]));$('teacher-room-title').textContent=room.name;$('teacher-code').textContent=room.join_code;$('teacher-join-link').href=Cloud.config.site+'?class='+encodeURIComponent(room.join_code);$('teacher-deadline').textContent=(room.open_until>Date.now()/1000?'收件截止：':'已停止收件：')+new Date(room.open_until*1000).toLocaleString('zh-HK');
  const submitted=students.filter(s=>s.current_work).length;$('teacher-summary').textContent=`已提交 ${submitted}／${room.capacity} 人 · 已加入 ${students.filter(s=>s.joined).length} 人 · ${new Date().toLocaleTimeString('zh-HK')} 更新`;
  const root=$('teacher-roster');root.replaceChildren();for(let number=1;number<=room.capacity;number++){
   const s=records.get(number)||{},list=all.filter(w=>w.student_number===number),row=document.createElement('tr'),selectCell=document.createElement('td'),check=document.createElement('input');check.type='checkbox';check.setAttribute('aria-label','選印'+number+'號');check.disabled=busy||!s.current_work;check.checked=checked.has(number)&&Boolean(s.current_work);check.addEventListener('change',()=>{if(check.checked)checked.add(number);else checked.delete(number);controls();});selectCell.append(check);
   const numberCell=document.createElement('td');numberCell.textContent=String(number).padStart(2,'0');const info=document.createElement('td'),name=document.createElement('strong'),note=document.createElement('small');const selected=versions.get(chosen.get(number))||versions.get(s.print_work)||versions.get(s.current_work);if(selected)chosen.set(number,selected.id);else{chosen.delete(number);checked.delete(number);}name.textContent=selected?selected.chef+'：'+selected.title:s.joined?'已加入，未提交':'未加入';note.textContent=selected?(selected.has_image?'含概念圖':'老師批准的文字後備')+(s.current_work&&s.print_work&&s.current_work!==s.print_work?' · 有新版本，請核對':'')+(s.allow_text?' · 可交文字後備':''):s.allow_text?'已批准文字後備':'';info.append(name,note);
   const versionCell=document.createElement('td'),select=document.createElement('select');select.setAttribute('aria-label',number+'號採用版本');select.disabled=busy||!list.length;for(const work of list)select.add(new Option((work.id===s.current_work?'最新 · ':'')+new Date(work.created_at*1000).toLocaleTimeString('zh-HK')+(work.id===s.print_work?' · 上次選印':''),work.id));if(selected)select.value=selected.id;select.addEventListener('change',()=>{chosen.set(number,select.value);render();});versionCell.append(select);
   const actions=document.createElement('td');actions.className='cloud-row-actions';const preview=document.createElement('button');preview.className='ws-link';preview.type='button';preview.textContent='預覽';preview.disabled=busy||!selected;preview.addEventListener('click',()=>task(async()=>{const work=await Cloud.verified(chosen.get(number));Cloud.preview(work);}));actions.append(preview);
   const settings=document.createElement('details'),summary=document.createElement('summary');summary.textContent='老師協助';settings.append(summary);for(const [action,label] of [['reset','重設裝置'],[s.allow_text?'image':'text',s.allow_text?'恢復需要圖片':'批准文字後備']]){const b=document.createElement('button');b.className='ws-link';b.type='button';b.textContent=label;b.disabled=busy;b.addEventListener('click',()=>task(async()=>{if(!confirm(`為${number}號${label}？已保存作品會保留。`))return;await headers('/api/teacher/rooms/'+room.id+'/student',{method:'POST',data:{number,action}});await refresh();status(number+'號已'+label+'。');}));settings.append(b);}actions.append(settings);row.append(selectCell,numberCell,info,versionCell,actions);root.append(row);
  }
  $('teacher-select-all').checked=submitted>0&&students.filter(s=>s.current_work).every(s=>checked.has(s.number));$('teacher-room-card').hidden=false;controls();
 }
 async function refresh(){
  if(loading||!login)return;const id=$('teacher-room').value;if(!id)return;loading=true;
  try{const incoming=await headers('/api/teacher/rooms/'+id);if($('teacher-room').value!==id)return;current=incoming;render();const dataURL=await QRCode.toDataURL($('teacher-join-link').href,{width:300,margin:4,errorCorrectionLevel:'M'});if($('teacher-room').value===id)$('teacher-join-qr').src=dataURL;}finally{loading=false;}
 }
 async function loadRooms(id=''){
  const result=await headers('/api/teacher/rooms');rooms=result.rooms;$('teacher-room').replaceChildren();for(const room of rooms)$('teacher-room').add(new Option(room.name+' · '+new Date(room.created_at*1000).toLocaleDateString('zh-HK'),room.id));if(id&&rooms.some(r=>r.id===id))$('teacher-room').value=id;
  if(!rooms.length){$('teacher-room-card').hidden=true;status('未有工作坊，請先展開「建立新工作坊」。');}else await refresh();
 }
 async function task(fn){if(busy)return;busy=true;if(current)render();else controls();try{await fn();}catch(e){failure(e);}finally{busy=false;if(current)render();else controls();}}
 function polling(){clearInterval(timer);timer=setInterval(()=>{if(!document.hidden&&!busy&&login)refresh().catch(failure);},Cloud.config.pollMs);}
 $('teacher-login-form').addEventListener('submit',async event=>{event.preventDefault();const button=$('teacher-login-button');button.disabled=true;try{login=await Cloud.request('/api/teacher/login',{method:'POST',data:{password:$('teacher-password').value}});$('teacher-password').value='';try{sessionStorage.setItem(KEY,JSON.stringify(login));}catch{}loggedIn(true);await loadRooms();polling();}catch(e){failure(e);}finally{button.disabled=false;}});
 $('teacher-logout').addEventListener('click',logout);$('teacher-refresh').addEventListener('click',()=>task(refresh));$('teacher-room').addEventListener('change',()=>{checked.clear();chosen.clear();current=null;task(refresh);});
 $('teacher-create-form').addEventListener('submit',event=>{event.preventDefault();task(async()=>{const result=await headers('/api/teacher/rooms',{method:'POST',data:{name:$('room-name').value,capacity:Number($('room-capacity').value),openUntil:Math.floor(new Date($('room-until').value).getTime()/1000)}});checked.clear();chosen.clear();await loadRooms(result.id);status('工作坊已建立，請把加入網址或QR code提供給學生。');});});
 $('teacher-select-all').addEventListener('change',()=>{checked.clear();if($('teacher-select-all').checked)for(const s of current.students.filter(s=>s.current_work))checked.add(s.number);render();});
 $('copy-join-link').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('teacher-join-link').href);status('已複製學生加入網址。');}catch{status('請長按或右鍵複製學生加入網址。');}});
 $('teacher-close').addEventListener('click',()=>task(async()=>{if(!confirm('停止這個工作坊收件？學生將不能再提交，家長仍可開啟已保存作品。'))return;await headers('/api/teacher/rooms/'+current.room.id+'/close',{method:'POST',data:{}});await refresh();status('已停止收件，家長作品頁繼續提供。');}));
 $('teacher-print').addEventListener('click',()=>task(async()=>{
  const roomId=current.room.id,selected=[...checked].sort((a,b)=>a-b).map(number=>({number,id:chosen.get(number)}));if(!selected.length)throw new Error('請先選擇作品。');const works=[];
  for(let i=0;i<selected.length;i++){status(`正在核對食譜及圖片 ${i+1}／${selected.length}…`);works.push(await Cloud.verified(selected[i].id));}
  await headers('/api/teacher/rooms/'+roomId+'/pin',{method:'POST',data:{works:selected}});await Cloud.printWorks(works);status(`已準備${works.length}張48×48mm貼片，共${Math.ceil(works.length/15)}頁A4。請選實際大小100%、關閉頁首頁尾，先試印及掃碼。`);await refresh();
 }));
 $('teacher-backup').addEventListener('click',()=>task(async()=>{
  const ids=[...current.versions].sort((a,b)=>a.student_number-b.student_number||a.created_at-b.created_at).map(v=>v.id);if(!ids.length)throw new Error('未有已提交作品。');const works=[];for(let i=0;i<ids.length;i++){status(`正在備份 ${i+1}／${ids.length}…`);const work=await Cloud.verified(ids[i]);work.studentNumber=versions.get(ids[i]).student_number;works.push(work);}await Cloud.backup(works,current.room,current.students);status('已下載全班及所有已提交版本備份，包含食譜、圖片、學生編號及原作品網址。');
 }));
 const deadline=new Date(Date.now()+7*86400000);deadline.setMinutes(deadline.getMinutes()-deadline.getTimezoneOffset());$('room-until').value=deadline.toISOString().slice(0,16);
 try{login=JSON.parse(sessionStorage.getItem(KEY));}catch{}if(login?.expires>Date.now()/1000){loggedIn(true);loadRooms().then(polling).catch(failure);}else loggedIn(false);
 window.addEventListener('pagehide',()=>clearInterval(timer));
})();
