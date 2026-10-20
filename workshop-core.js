/* Shared recipe model. No API keys, DOM access, or network requests. */
(() => {
  'use strict';
  const nutrients = {
    calories: {label: '熱量', unit: 'kcal', reference: 650},
    carbs: {label: '碳水化合物', unit: 'g', reference: 90},
    protein: {label: '蛋白質', unit: 'g', reference: 20},
    fat: {label: '脂肪', unit: 'g', reference: 20},
    fiber: {label: '膳食纖維', unit: 'g', reference: 8}
  };
  const methods = ['清蒸', '清炒', '焗／烘烤', '滾湯／燉煮', '香炸／酥炸', '涼拌／生食', '甜品製作'];
  const sizes = {
    compact: {label: '60 × 80 mm', width: 60, height: 80, qr: 34, columns: 3, perPage: 9},
    standard: {label: '80 × 100 mm', width: 80, height: 100, qr: 48, columns: 2, perPage: 4},
    large: {label: '100 × 130 mm', width: 100, height: 130, qr: 68, columns: 1, perPage: 2}
  };
  const safety = '刀具、明火、熱油及高溫器具由成人處理或協助。肉、蛋、海鮮須徹底煮熟；生熟食物及用具分開。剩食盡快分裝冷卻，兩小時內冷藏；不確定安全便請成人判斷，不能為惜食勉強食用。';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text = (value, limit, label, optional = false) => {
    if (typeof value !== 'string' || value.length > limit || (!optional && !value.trim())) throw new Error(`${label}需要填寫，並不可超過 ${limit} 字。`);
    return value.trim();
  };
  const number = (value, min, max, label, integer = false) => {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max || (integer && !Number.isInteger(value))) throw new Error(`${label}須介乎 ${min} 至 ${max}${integer ? '，並使用整數' : ''}。`);
    return value;
  };
  function list(value, min, max, length, label) {
    if (!Array.isArray(value) || value.length < min || value.length > max) throw new Error(`${label}須有 ${min} 至 ${max} 項。`);
    return value.map(x => text(x, length, label));
  }
  function makeItem(food, grams, method, id) {
    if (!food || typeof food.code !== 'string' || !methods.includes(method)) throw new Error('食材或烹調方法無效。');
    return {id: String(id), code: food.code, grams: number(grams, 0.1, 5000, '食材重量'), method};
  }
  function totals(items, database, servings = 1) {
    const byCode = new Map(database.map(f => [f.code, f]));
    return Object.fromEntries(Object.keys(nutrients).map(key => {
      let sum = 0;
      for (const item of items) {
        const food = byCode.get(item.code), value = food?.[key];
        if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return [key, null];
        sum += value * item.grams / 100;
      }
      return [key, sum / servings];
    }));
  }
  function stateLabel(food) {
    if (['白飯', '糙米飯'].includes(food.name) || /\(熟\)|（熟）/.test(food.name)) return '熟重';
    if (/浸發/.test(food.name)) return '浸發後重量';
    return '依資料庫食材狀態；未逐項核定';
  }
  function needsCooking(food) {
    return food.category === 'protein' && !/蜜汁叉燒|水浸吞拿魚|皮蛋/.test(food.name) && /豬|牛肉|雞|鯇|蝦|三文魚|鮭魚|鵪鶉|鴨蛋/.test(food.name);
  }
  function warnings(items, database) {
    const byCode = new Map(database.map(f => [f.code, f]));
    const messages = [];
    const names = items.map(i => byCode.get(i.code)?.name || '').join('、');
    for (const item of items) {
      const food = byCode.get(item.code);
      if (food && needsCooking(food) && item.method === '涼拌／生食') messages.push(`${food.name}不可在此工作坊選用生食做法，請改為徹底煮熟。`);
    }
    const allergens = [
      [/花生/, '花生'], [/牛奶|奶粉|芝士|乳酪/, '奶'], [/雞蛋|鵪鶉蛋|鴨蛋|皮蛋/, '蛋'],
      [/三文魚|鮭魚|鯇|吞拿魚/, '魚'], [/蝦|蠔油/, '甲殼或貝類'],
      [/豆腐|豆漿|腐皮|枝竹|生抽|豉油/, '大豆'], [/麥|方包|麵|通心粉|意大利粉|烏冬|饅頭|生抽|豉油/, '含麩質穀物（須查標籤）'], [/芝麻/, '芝麻']
    ].filter(([re]) => re.test(names)).map(([,label]) => label);
    return {blocking: messages, allergens};
  }
  function ingredients(items, database) {
    const byCode = new Map(database.map(f => [f.code, f]));
    return items.map(i => {
      const f = byCode.get(i.code);
      if (!f) throw new Error('部分材料已不在資料庫，請重新選擇。');
      return `${f.name} ${Number(i.grams.toFixed(1))}克（${stateLabel(f)}）`;
    });
  }
  function validateDraft(raw, database) {
    if (!raw || raw.version !== 1 || !Array.isArray(raw.items) || raw.items.length > 30) throw new Error('草稿格式無效。');
    const byCode = new Map(database.map(f => [f.code, f]));
    const items = raw.items.map((i, n) => makeItem(byCode.get(i.code), i.grams, i.method, `restored-${n}`));
    const fields = {};
    for (const [key, max] of Object.entries({chef:20,title:40,equipment:100,stock:160,waste:160,reason:200,allergy:120})) fields[key] = text(raw[key] ?? '', max, key, true);
    return {version:1, ...fields, items, servings:number(raw.servings,1,12,'人數',true), minutes:number(raw.minutes,1,240,'時間',true),
      steps: Array.isArray(raw.steps) && raw.steps.length <= 10 ? raw.steps.map(x => text(x, 180, '步驟', true)) : [''],
      size: Object.hasOwn(sizes, raw.size) ? raw.size : 'standard'};
  }
  function payload(draft, database) {
    if (!draft.items.length) throw new Error('請先加入材料。');
    const warning = warnings(draft.items, database);
    if (warning.blocking.length) throw new Error(warning.blocking.join(' '));
    return {
      v:2, c:text(draft.chef,20,'作品代號／暱稱'), t:text(draft.title,40,'菜名'),
      n:number(draft.servings,1,12,'人數',true), m:number(draft.minutes,1,240,'時間',true),
      e:text(draft.equipment,100,'器具'), i:ingredients(draft.items,database),
      s:list(draft.steps,1,10,180,'步驟'), w:text(draft.waste,160,'惜食方法'),
      r:text(draft.reason,200,'修改理由'), a:text(draft.allergy,120,'敏感食材核對備註',true),
      z:warning.allergens.join('、'), u:Object.fromEntries(Object.entries(totals(draft.items,database,draft.servings)).map(([key,n]) => [key,n===null?null:Number(n.toFixed(1))]))
    };
  }
  function validatePayload(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('食譜格式無效。');
    const result = {v:raw.v === 2 ? 2 : 1, c:text(raw.c ?? '小廚師',20,'作品代號'), t:text(raw.t,40,'菜名'),
      i:list(raw.i,1,30,120,'材料'), s:list(raw.s,1,10,180,'步驟')};
    if (result.v === 2) {
      Object.assign(result,{n:number(raw.n,1,12,'人數',true),m:number(raw.m,1,240,'時間',true),e:text(raw.e,100,'器具'),
        w:text(raw.w,160,'惜食方法'),r:text(raw.r,200,'修改理由'),a:text(raw.a ?? '',120,'備註',true),z:text(raw.z ?? '',200,'致敏物提醒',true)});
      result.u = Object.fromEntries(Object.keys(nutrients).map(key => [key, raw.u?.[key] === null ? null : number(raw.u?.[key],0,1000000,'營養數據')]));
    }
    return result;
  }
  function parseAI(raw, items) {
    const title = text(raw?.recipeTitle,40,'AI 菜名');
    const steps = list(raw?.recipeSteps,1,10,180,'AI 步驟');
    if (!Array.isArray(raw?.materials) || raw.materials.length !== items.length) throw new Error('AI 未有完整保留材料，請重試或手動編輯。');
    const expected = new Map(items.map(i => [i.id,i]));
    const seen = new Set();
    for (const material of raw.materials) {
      const item = expected.get(material.id);
      if (!item || seen.has(material.id) || typeof material.grams !== 'number' || Math.abs(material.grams-item.grams)>0.01) throw new Error('AI 更改或遺漏材料，未套用這次回覆。請重試或手動編輯。');
      seen.add(material.id);
    }
    return {title,steps};
  }
  function shareBase(value) {
    let url;
    try {url = new URL(value);} catch {throw new Error('請填寫家長能開啟的正式 HTTPS 網址。');}
    if (url.protocol !== 'https:' || url.username || url.password || !url.hostname.includes('.') || /^(localhost|127\.|0\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(url.hostname) || /\.(localhost|local)$/.test(url.hostname)) throw new Error('請使用家長能開啟的正式 HTTPS 網址；本機網址不能帶回家使用。');
    url.hash = ''; return url.href;
  }
  function decodeHash(hash, codec) {
    if (!hash.startsWith('#recipe=')) return null;
    const compressed = hash.slice(8);
    if (!compressed || compressed.length > 12000) throw new Error('食譜連結長度無效。');
    const json = codec.decompressFromEncodedURIComponent(compressed);
    if (!json || json.length > 20000) throw new Error('無法讀取食譜資料。');
    return validatePayload(JSON.parse(json));
  }
  window.FoodWorkshopCore = Object.freeze({nutrients, methods, sizes, safety, esc, makeItem, totals, stateLabel, warnings, ingredients, validateDraft, payload, validatePayload, parseAI, shareBase, decodeHash});
})();
