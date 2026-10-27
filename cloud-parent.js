(() => {
 'use strict';const Cloud=window.CloudWorkshop,status=document.getElementById('parent-load-status'),button=document.getElementById('parent-retry');
 async function load(){button.hidden=true;status.textContent='正在讀取已保存的食譜及概念圖…';try{const id=new URLSearchParams(location.search).get('id'),work=await Cloud.getWork(id);document.open();document.write(Cloud.parentHTML(work));document.close();}catch(e){status.textContent=e.message;button.hidden=false;}}
 button.addEventListener('click',load);load();
})();
