/* Deterministic classroom grading; no medical assessment or network calls. */
(() => {
  'use strict';
  const skills={label:'閱讀標籤',planning:'食物配搭與安排',portion:'份量推理',waste:'惜食決策',safety:'食物安全'};
  const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
  const validURL=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&['www.chp.gov.hk','www.cfs.gov.hk','www.studenthealth.gov.hk','www.change4health.gov.hk'].includes(u.hostname);}catch{return false;}};
  function validateBank(raw){
    if(raw?.version!==1||typeof raw.contentVersion!=='string'||!object(raw.sources)||!Array.isArray(raw.stories)||raw.stories.length!==6)throw new Error('情境資料版本無效。');
    for(const s of Object.values(raw.sources))if(!s.title||!validURL(s.url))throw new Error('情境來源無效。');
    const ids=new Set();
    for(const s of raw.stories){
      if(!/^[a-z][a-z-]+$/.test(s.id)||ids.has(s.id)||!s.name||!s.goal||!Array.isArray(s.profile)||!Array.isArray(s.extra)||!Array.isArray(s.tasks)||s.tasks.length!==4)throw new Error('人物資料不完整。');ids.add(s.id);
      for(const q of s.tasks){
        if(ids.has(q.id)||!q.id.startsWith(s.id==='ching-veg'?'veg-':s.id+'-')||!['decision','single','multi','portion'].includes(q.type)||!Object.hasOwn(skills,q.skill)||!q.prompt||!q.context||!q.explanation||!q.hint||!Array.isArray(q.sourceIds)||!q.sourceIds.length||q.sourceIds.some(id=>!raw.sources[id]))throw new Error('關卡資料不完整。');ids.add(q.id);
        if(q.type==='portion'){
          if(!Number.isFinite(q.target)||q.target<=0||!q.measure?.label||!q.measure.source||!/^https:\/\//.test(q.measure.source.url)||!Number.isFinite(q.measure.gramsPerUnit)||q.measure.gramsPerUnit<=0||Math.abs(q.originalQuantity/q.fromPeople*q.toPeople-q.target)>1e-8)throw new Error('份量換算未能核對。');
        }else{
          if(!Array.isArray(q.options)||q.options.length!==4||new Set(q.options.map(o=>o.id)).size!==4||q.options.some(o=>!o.text||!o.feedback||typeof o.correct!=='boolean'||!Array.isArray(o.foods))||!q.options.some(o=>o.correct))throw new Error('選項格式無效。');
          if(q.type==='single'&&q.options.filter(o=>o.correct).length!==1)throw new Error('單選題答案無效。');
          if(q.type==='multi'&&(!Number.isInteger(q.choose)||q.choose<2||q.choose>3||q.options.filter(o=>o.correct).length!==q.choose))throw new Error('多選題答案無效。');
          if(q.type==='decision'&&(!Array.isArray(q.reasons)||q.reasons.length<2||new Set(q.reasons.map(o=>o.id)).size!==q.reasons.length||q.reasons.some(o=>!o.text||!o.feedback||typeof o.correct!=='boolean')||!q.reasons.some(o=>o.correct)))throw new Error('理由選項無效。');
        }
      }
    }
    return raw;
  }
  function blank(q){return q.type==='multi'?{selected:[]}:q.type==='portion'?{quantity:''}:q.type==='decision'?{choice:null,reason:null}:{choice:null};}
  function validInput(q,input,complete=false){
    if(!object(input))return false;
    const choiceOK=(list,id)=>id===null?!complete:list.some(o=>o.id===id);
    if(q.type==='multi')return Array.isArray(input.selected)&&input.selected.length<=4&&new Set(input.selected).size===input.selected.length&&input.selected.every(id=>q.options.some(o=>o.id===id))&&(!complete||input.selected.length===q.choose);
    if(q.type==='portion')return input.quantity===''?!complete:typeof input.quantity==='number'&&Number.isFinite(input.quantity)&&input.quantity>=.001&&input.quantity<=1000;
    return choiceOK(q.options,input.choice)&&(q.type!=='decision'||choiceOK(q.reasons,input.reason));
  }
  function grade(q,input){
    if(!validInput(q,input,true))throw new Error(q.type==='multi'?`請選擇${q.choose}項。`:'請填妥本關答案。');
    let score=0,max=1,checks=[];
    if(q.type==='portion'){
      const right=Math.abs(input.quantity-q.target)<.0001;score=Number(right);
      checks=[{right,text:right?`份量正確：${q.target}${q.unit}。`:`你選了${input.quantity}${q.unit}；按原配方縮放後應為${q.target}${q.unit}。`}];
    }else if(q.type==='multi'){
      max=q.choose;checks=input.selected.map(id=>{const o=q.options.find(x=>x.id===id);return{right:o.correct,text:o.text+'：'+o.feedback};});score=checks.filter(c=>c.right).length;
    }else{
      const option=q.options.find(o=>o.id===input.choice);score=Number(option.correct);checks.push({right:option.correct,text:option.feedback});
      if(q.type==='decision'){const reason=q.reasons.find(o=>o.id===input.reason);max=2;score+=Number(reason.correct);checks.push({right:reason.correct,text:reason.feedback});}
    }
    return {score,max,correct:score===max,checks};
  }
  function shuffledIds(list){const out=list.map(o=>o.id);for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out;}
  function freshProgress(story){return {index:0,stages:story.tasks.map(q=>({draft:blank(q),attempts:[],hinted:false,editing:true,order:{choice:shuffledIds(q.options),reason:shuffledIds(q.reasons)}}))};}
  function validOrder(q,order){return object(order)&&['choice','reason'].every(part=>{const ids=(part==='choice'?q.options:q.reasons).map(o=>o.id);return Array.isArray(order[part])&&order[part].length===ids.length&&new Set(order[part]).size===ids.length&&order[part].every(id=>ids.includes(id));});}
  function validateSession(raw,bank){
    if(!object(raw)||raw.version!==1||raw.contentVersion!==bank.contentVersion||!['home','task','result','practice'].includes(raw.view)||!object(raw.progress)||(raw.active!==null&&!bank.stories.some(s=>s.id===raw.active)))return null;
    for(const [id,p] of Object.entries(raw.progress)){
      const s=bank.stories.find(s=>s.id===id);
      if(!s||!object(p)||!Number.isInteger(p.index)||p.index<0||p.index>4||!Array.isArray(p.stages)||p.stages.length!==4)return null;
      for(let i=0;i<4;i++){
        const st=p.stages[i],q=s.tasks[i];
        if(!object(st)||!validOrder(q,st.order)||typeof st.hinted!=='boolean'||typeof st.editing!=='boolean'||!validInput(q,st.draft)||!Array.isArray(st.attempts)||st.attempts.length>30||st.attempts.some(a=>!object(a)||typeof a.hintUsed!=='boolean'||!validInput(q,a.input,true)))return null;
        if(i<p.index&&!st.attempts.length)return null;
        if(!st.editing&&!st.attempts.length)return null;
      }
    }
    if(['task','result'].includes(raw.view)&&(!raw.active||!raw.progress[raw.active]||(raw.view==='task'&&raw.progress[raw.active].index>=4)||(raw.view==='result'&&raw.progress[raw.active].index!==4)))return null;
    return raw;
  }
  function summary(story,progress){
    const bySkill={},foods=new Set();let first=0,current=0,max=0;
    story.tasks.forEach((q,i)=>{
      const a=progress.stages[i].attempts;if(!a.length)return;
      const initial=grade(q,a[0].input),last=grade(q,a[a.length-1].input);first+=initial.score;current+=last.score;max+=last.max;
      const row=bySkill[q.skill]||{score:0,max:0};row.score+=last.score;row.max+=last.max;bySkill[q.skill]=row;
      if(last.correct){if(q.type==='portion')foods.add(q.foodCode);else q.options.filter(o=>o.correct&&(q.type==='multi'?a[a.length-1].input.selected.includes(o.id):o.id===a[a.length-1].input.choice)).forEach(o=>o.foods.forEach(code=>foods.add(code)));}
    });
    return{first,current,max,bySkill,foods:[...foods]};
  }
  window.ScenarioQuizCore=Object.freeze({skills,validateBank,validURL,blank,validInput,grade,freshProgress,validateSession,summary});
})();
