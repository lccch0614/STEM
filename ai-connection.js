/* Text model selection and safe diagnostics. No credentials or automatic retries. */
(() => {
  'use strict';
  const models=Object.freeze([
    {id:'deepseek/deepseek-v3.2',name:'DeepSeek V3.2',price:'參考每100萬輸入tokens US$0.2088、輸出tokens US$0.3096；設請求單價上限US$0.50／US$1.00',url:'https://openrouter.ai/deepseek/deepseek-v3.2'},
    {id:'google/gemini-2.5-flash-lite',name:'Gemini 2.5 Flash Lite',price:'參考每100萬輸入tokens US$0.10、輸出tokens US$0.40；部分帳戶可能被供應商拒絕',url:'https://openrouter.ai/google/gemini-2.5-flash-lite'},
    {id:'openrouter/free',name:'OpenRouter免費文字後備',price:'免費路由，由OpenRouter選模型；可用性及供應商限制未能保證',url:'https://openrouter.ai/openrouter/free'}
  ].map(Object.freeze));
  // Promoted only after a successful real recipe + schema validation test.
  const defaultModel='deepseek/deepseek-v3.2';
  const settingsVersion='text-model-fix-2026-10-27';
  const timeoutMs=model=>model==='deepseek/deepseek-v3.2'?120000:60000;
  function request(model,prompt){
    if(!models.some(m=>m.id===model))throw new Error('請選擇清單內的文字模型。');
    return {model,messages:[{role:'system',content:prompt},{role:'user',content:'請分析我的食材及每人份量，並用目前餐盤生成食譜。'}],temperature:.4,max_tokens:2600,provider:{allow_fallbacks:false,...(model==='deepseek/deepseek-v3.2'?{max_price:{prompt:.5,completion:1,request:0}}:{})},...(model==='deepseek/deepseek-v3.2'?{reasoning:{enabled:false},response_format:{type:'json_object'}}:{})};
  }
  function redact(value,secret='',limit=2000){
    let out=typeof value==='string'?value:JSON.stringify(value??'');
    if(secret)out=out.split(secret).join('[已隱去金鑰]');
    return out.replace(/sk-[A-Za-z0-9_-]{8,}/g,'[已隱去金鑰]').replace(/Bearer\s+[^\s"'<>\\]+/gi,'Bearer [已隱去]').replace(/((?:authorization|api[_-]?key|access[_-]?token)["']?\s*[:=]\s*["']?)[^\s,"'}]+/gi,'$1[已隱去]').slice(0,limit);
  }
  function rawDetail(raw,secret){
    if(raw==null)return '';
    let value=raw;
    if(typeof raw==='string'){try{value=JSON.parse(raw);}catch{return /prompt|messages|authorization|flagged_input/i.test(raw)?'[供應商原文含請求資料，已略去]':redact(raw,secret);}}
    function safe(v,depth=0){
      if(depth>5)return '[資料過長]';if(Array.isArray(v))return v.slice(0,8).map(x=>safe(x,depth+1));
      if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).slice(0,20).map(([k,val])=>[k,/authorization|cookie|api.?key|token|prompt|messages|flagged_input/i.test(k)?'[已隱去]':safe(val,depth+1)]));
      return typeof v==='string'?redact(v,secret,800):v;
    }
    return redact(safe(value),secret);
  }
  function diagnostic({model,status,body={},requestId='',secret='',kind=''}){
    body=body&&typeof body==='object'?body:{};
    const metadata=body.error?.metadata||{},code=Number(body.error?.code),effective=code>=400&&code<=599?code:status;
    return {version:1,time:new Date().toISOString(),stage:'文字食譜',model,httpStatus:Number(status)||0,errorCode:effective||0,provider:redact(metadata.provider_name||body.provider||'',secret,120),errorType:redact(metadata.error_type||kind,secret,120),providerCode:redact(metadata.provider_code||'',secret,120),requestId:redact(requestId||body.id||'',secret,160),message:redact(body.error?.message||'',secret,800),reasons:Array.isArray(metadata.reasons)?metadata.reasons.slice(0,6).map(r=>redact(r,secret,200)):[],limitSource:redact(metadata.limit_source||'',secret,120),raw:rawDetail(metadata.raw,secret)};
  }
  class RequestError extends Error{
    constructor(diag){super(diag.message||'AI請求未成功');this.name='AIRequestError';this.diagnostic=diag;}
  }
  function failureMessage(diag){
    const status=diag.errorCode;
    let message;
    if(status===401)message='AI金鑰或登入憑證未獲接受，請老師核對OpenRouter設定。';
    else if(status===402)message='OpenRouter可用額度不足，請老師核對帳戶及金鑰額度。';
    else if(status===403&&(/_budget$|key_limit$/.test(diag.limitSource)||/budget|spending|credit limit/i.test(diag.message)))message='OpenRouter帳戶、金鑰或工作區的用量上限已到，請老師核對限額。';
    else if(status===403)message='模型供應商拒絕此請求，可能涉及政策、權限或地區限制。這不代表食材選擇有錯；請老師查看診斷資料，或手動選擇另一文字模型。';
    else if(status===404)message='目前模型或服務入口未能使用，請老師手動選擇另一文字模型。';
    else if(status===429)message='AI請求過於頻密或服務繁忙，請稍候再手動重試。';
    else if(status>=500)message='AI供應商服務暫時未能完成請求，請稍候再手動重試或選擇另一文字模型。';
    else if(status>=400)message='AI未能接受此請求，請老師查看診斷資料及模型設定。';
    else if(diag.errorType==='timeout')message='等候AI回覆已超過此模型的時限，請稍候再手動重試。';
    else if(diag.errorType==='cancelled')message='已停止等待AI回覆。';
    else if(diag.errorType==='network')message='AI網絡連線未完成，請檢查網絡後再手動重試。';
    else if(diag.errorType==='format')message='AI回覆格式或材料份量未通過核對，這次回覆未套用；可手動重試或自行編輯。';
    else message=diag.message||'AI未能完成食譜，請老師查看診斷資料。';
    return message+' 目前草稿仍然保留，未自動重試或切換模型。';
  }
  function choose(settings){
    if(settings?.textSettingsVersion===settingsVersion&&models.some(m=>m.id===settings.textModel))return settings.textModel;
    return settings?.textModel==='openrouter/free'?'openrouter/free':defaultModel;
  }
  window.WorkshopAI=Object.freeze({models,defaultModel,settingsVersion,timeoutMs,request,redact,diagnostic,RequestError,failureMessage,choose});
})();
