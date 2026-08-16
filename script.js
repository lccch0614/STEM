const PRESET_OPENROUTER_KEY = "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";

const TARGETS = {
  calories: 650,
  carbs: 90,
  protein: 20,
  fat: 20,
  minerals: 2.5,
  fiber: 8.0
};

let foodDatabase = [];
let myPlate = [];
let currentGeneratedRecipe = null;
let currentLikesCount = 0;

// ==========================================
// 🌟 營養超能力圖鑑資料
// ==========================================
const nutritionDictData = [
  { id: 1, name: "蛋白質 (Protein)", icon: "💪", category: "growth", desc: "像建築工人一樣，幫助你的肌肉和骨骼快快長大！", foods: "雞蛋、牛肉、豆腐、牛奶" },
  { id: 2, name: "碳水化合物 (Carbs)", icon: "⚡", category: "energy", desc: "身體的超級電池，給你滿滿的能量去跑步和上課！", foods: "白飯、麵包、番薯、麵條" },
  { id: 3, name: "維他命C (Vitamin C)", icon: "🛡️", category: "immunity", desc: "身體裡的隱形防護罩，幫你打敗感冒病毒！", foods: "橙、奇異果、西蘭花、番茄" },
  { id: 4, name: "膳食纖維 (Fiber)", icon: "🧹", category: "digest", desc: "腸道裡的小掃把，幫你清理肚子，便便好順暢！", foods: "菜心、蘋果、燕麥、紅蘿蔔" },
  { id: 5, name: "鈣質 (Calcium)", icon: "🦴", category: "growth", desc: "骨骼的超級水泥，讓你的牙齒和骨頭堅固無比！", foods: "牛奶、芝士、豆腐、黑芝麻" }
];

let currentDictFilter = "all";

// ==========================================
// 🌟 Quiz 題庫（52 題）
// 每次挑戰會隨機抽 10 題
// ==========================================
const QUIZ_QUESTIONS_PER_ROUND = 10;

const quizQuestionBank = [
  {
    question: "哪一種食物最有助肌肉生長？",
    options: ["汽水", "雞蛋", "糖果", "薯片"],
    answer: 1,
    explanation: "雞蛋含有豐富蛋白質，能幫助身體成長和修復肌肉。"
  },
  {
    question: "以下哪個做法最符合「惜食」精神？",
    options: ["把剩下的蔬菜直接丟掉", "一次買太多食材", "善用家中剩餘食材煮湯", "只吃一半就不要了"],
    answer: 2,
    explanation: "善用剩餘食材煮湯或做新菜式，可以減少浪費。"
  },
  {
    question: "哪一種營養素可以幫助腸道健康？",
    options: ["膳食纖維", "鹽", "糖", "色素"],
    answer: 0,
    explanation: "膳食纖維像小掃把一樣，可以幫助腸道蠕動。"
  },
  {
    question: "如果一餐有太多炸物，最可能會怎樣？",
    options: ["脂肪和熱量過高", "維他命增加很多", "水分增加很多", "纖維自動變多"],
    answer: 0,
    explanation: "炸物通常會吸收較多油脂，所以熱量和脂肪會上升。"
  },
  {
    question: "買餸前先列清單，有什麼好處？",
    options: ["更容易浪費食物", "可以亂買更多零食", "幫助按需要購買，減少浪費", "令食物變甜"],
    answer: 2,
    explanation: "先列清單可以避免買太多，按需要購買，更符合惜食原則。"
  },
  {
    question: "哪種飲品通常含較多糖分？",
    options: ["清水", "無糖豆漿", "汽水", "清湯"],
    answer: 2,
    explanation: "汽水通常含有較多添加糖，飲得太多對健康不好。"
  },
  {
    question: "下列哪種食物含豐富鈣質？",
    options: ["牛奶", "糖果", "薯條", "汽水"],
    answer: 0,
    explanation: "牛奶含有鈣質，能幫助牙齒和骨骼發展。"
  },
  {
    question: "如果香蕉皮還很漂亮，可以怎樣做較惜食？",
    options: ["馬上丟掉", "做成香蕉奶昔", "放進垃圾桶玩", "只吃一口就不要"],
    answer: 1,
    explanation: "成熟香蕉可以做奶昔、蛋糕或甜品，減少浪費。"
  },
  {
    question: "哪一類食物主要為身體提供能量？",
    options: ["碳水化合物", "清水", "空氣", "鹽"],
    answer: 0,
    explanation: "碳水化合物是身體主要能量來源，例如飯、麵、麵包。"
  },
  {
    question: "蔬菜水果通常提供什麼較多？",
    options: ["維他命和纖維", "機油", "色素", "塑膠"],
    answer: 0,
    explanation: "蔬果含維他命、礦物質和纖維，有助身體健康。"
  },
  {
    question: "剩飯最適合變成哪一道惜食料理？",
    options: ["炒飯", "直接扔掉", "只聞不吃", "變成玩具"],
    answer: 0,
    explanation: "剩飯可以加蛋和蔬菜做炒飯，是常見惜食方法。"
  },
  {
    question: "哪一種做法通常比香炸更健康？",
    options: ["清蒸", "加很多糖", "加很多油", "只吃醬汁"],
    answer: 0,
    explanation: "清蒸用油較少，可以保留食材原味。"
  },
  {
    question: "蛋白質常見於哪種食物？",
    options: ["豆腐", "汽水", "糖果", "冰塊"],
    answer: 0,
    explanation: "豆腐是優質蛋白質來源，適合成長中的小朋友。"
  },
  {
    question: "吃太鹹的食物可能代表什麼攝取太多？",
    options: ["鈉", "纖維", "維他命C", "水分"],
    answer: 0,
    explanation: "太鹹通常表示鈉含量較高，應注意不要過量。"
  },
  {
    question: "哪一種習慣較健康？",
    options: ["每日只喝汽水", "多喝清水", "只吃糖果", "常常不吃早餐"],
    answer: 1,
    explanation: "清水是最基本又健康的飲品。"
  },
  {
    question: "哪種食物屬於蔬菜類？",
    options: ["西蘭花", "餅乾", "汽水", "雪糕"],
    answer: 0,
    explanation: "西蘭花屬於蔬菜類，含有纖維和多種營養。"
  },
  {
    question: "食物過期了，最安全的做法是？",
    options: ["繼續吃", "先聞一聞再全部吃掉", "不要食用", "送給別人"],
    answer: 2,
    explanation: "過期食品可能不安全，應避免食用。"
  },
  {
    question: "以下哪項最能幫助預防浪費食物？",
    options: ["每次都煮超大份量", "先看看雪櫃裡有什麼再買", "食唔晒就扔", "只買包裝最漂亮的"],
    answer: 1,
    explanation: "先檢查雪櫃存貨，可以避免重複購買。"
  },
  {
    question: "水果通常什麼時候吃較合適？",
    options: ["任何適量時間都可以", "只可以半夜吃", "只可以考試前吃", "完全不能吃"],
    answer: 0,
    explanation: "水果可以作為日常健康小食，但要適量。"
  },
  {
    question: "哪種食物含較多膳食纖維？",
    options: ["蘋果", "汽水", "糖果", "炸雞皮"],
    answer: 0,
    explanation: "蘋果含有膳食纖維，有助消化。"
  },
  {
    question: "為什麼不應只吃肉、不吃菜？",
    options: ["因為會少了纖維和維他命", "因為菜會逃走", "因為肉會變甜", "因為老師會知道"],
    answer: 0,
    explanation: "均衡飲食要包括蔬菜，這樣才能攝取纖維和維他命。"
  },
  {
    question: "買一大袋菜回家後，應先做什麼？",
    options: ["放著不理", "計劃幾時煮和怎樣保存", "全部丟掉", "只拍照不吃"],
    answer: 1,
    explanation: "計劃烹調和保存方式，能幫助減少食材變壞。"
  },
  {
    question: "哪種食物通常含有較多健康脂肪？",
    options: ["牛油果", "糖果", "汽水", "白砂糖"],
    answer: 0,
    explanation: "牛油果含有較好的脂肪，但仍然要適量。"
  },
  {
    question: "早餐的重要性是什麼？",
    options: ["提供早上活動所需能量", "令午餐消失", "讓作業變少", "可以不飲水"],
    answer: 0,
    explanation: "早餐能幫助補充早上所需能量，讓精神更好。"
  },
  {
    question: "下列哪種做法較容易造成廚餘？",
    options: ["按食量盛飯", "明知吃不完仍盛很多", "把剩菜保存再吃", "先想好分量"],
    answer: 1,
    explanation: "盛太多又吃不完，很容易造成廚餘。"
  },
  {
    question: "番茄較常提供哪類營養？",
    options: ["維他命", "塑膠", "機油", "電力"],
    answer: 0,
    explanation: "番茄屬蔬果，含有維他命和其他營養。"
  },
  {
    question: "如果家中還有未用完的豆腐，可以怎樣做？",
    options: ["配蔬菜煮湯", "立即丟掉", "放在桌上幾天不理", "只拿來看"],
    answer: 0,
    explanation: "豆腐可以用來煮湯、蒸煮或快炒，是好用的惜食食材。"
  },
  {
    question: "「均衡飲食」的意思是什麼？",
    options: ["只吃自己最喜歡的食物", "每類食物都適量攝取", "只吃甜品", "完全不吃飯"],
    answer: 1,
    explanation: "均衡飲食就是不同食物類別都吃一些，而且不過量。"
  },
  {
    question: "哪一種是高糖零食？",
    options: ["糖果", "青瓜", "白開水", "番茄湯"],
    answer: 0,
    explanation: "糖果通常糖分很高，不宜吃太多。"
  },
  {
    question: "烹調時加太多油，最可能令什麼增加？",
    options: ["脂肪和熱量", "纖維", "鈣質", "水分"],
    answer: 0,
    explanation: "油提供不少熱量，所以加太多油會令脂肪和熱量上升。"
  },
  {
    question: "哪個習慣能幫助我們更珍惜食物？",
    options: ["吃多少盛多少", "常常剩很多", "買了不吃", "見到就丟"],
    answer: 0,
    explanation: "按需要取食物，是惜食的重要做法。"
  },
  {
    question: "哪一種屬於豆製品？",
    options: ["豆腐", "汽水", "糖霜", "薯片"],
    answer: 0,
    explanation: "豆腐是由黃豆製成，屬豆製品。"
  },
  {
    question: "水果和蔬菜顏色多樣，有什麼好處？",
    options: ["通常代表含不同營養素", "代表一定很貴", "代表不能吃", "代表一定是甜品"],
    answer: 0,
    explanation: "不同顏色的蔬果常有不同營養，吃多元顏色更理想。"
  },
  {
    question: "如果想減少食物浪費，以下哪項最好？",
    options: ["先用快過期食材", "永遠先吃新買的", "把舊的食材藏起來", "忘記雪櫃裡有什麼"],
    answer: 0,
    explanation: "先使用快過期食材，可以減少它壞掉被丟棄。"
  },
  {
    question: "下列哪個是較健康的小食？",
    options: ["蘋果片", "大包糖果", "超甜蛋糕", "炸薯片"],
    answer: 0,
    explanation: "蘋果片較天然，通常比高糖高油零食更健康。"
  },
  {
    question: "為什麼要注意食物份量？",
    options: ["避免吃太多或浪費", "因為碗會怕", "因為食物會消失", "因為桌子會變色"],
    answer: 0,
    explanation: "適量進食有助健康，也能減少剩食。"
  },
  {
    question: "哪種食物通常蛋白質較高？",
    options: ["雞胸肉", "棉花糖", "汽水", "糖水"],
    answer: 0,
    explanation: "雞胸肉是常見高蛋白食物。"
  },
  {
    question: "如果想補充維他命C，可以多吃什麼？",
    options: ["橙", "炸雞皮", "汽水糖", "奶油餅"],
    answer: 0,
    explanation: "橙含有維他命C，有助身體健康。"
  },
  {
    question: "下列哪項是良好的雪櫃整理習慣？",
    options: ["把食材分類擺放", "亂塞進去", "不看日期", "把熟食和生肉亂放"],
    answer: 0,
    explanation: "分類和整齊擺放，有助更易找到食材，也較安全。"
  },
  {
    question: "哪種方法可讓家人知道哪些食材要先吃？",
    options: ["貼上日期標籤", "全部藏起來", "不告訴任何人", "只記在心裡但忘記"],
    answer: 0,
    explanation: "貼上日期標籤能提醒大家先用哪些食材。"
  },
  {
    question: "什麼是較好的飲食搭配？",
    options: ["飯 + 菜 + 蛋白質食物", "只吃甜品", "只喝汽水", "只吃炸物"],
    answer: 0,
    explanation: "有主食、蔬菜和蛋白質食物的搭配較均衡。"
  },
  {
    question: "為什麼要少吃過多加工零食？",
    options: ["因為可能高糖、高鹽或高脂", "因為它們會飛", "因為它們會變透明", "因為老師不准看包裝"],
    answer: 0,
    explanation: "很多加工零食會有較多糖、鹽或脂肪。"
  },
  {
    question: "如果一條紅蘿蔔有點醜但未變壞，應怎樣？",
    options: ["切掉不好的部分再煮", "立刻整條丟掉", "拿來當玩具", "永遠不碰"],
    answer: 0,
    explanation: "外形不完美不代表不能吃，處理後仍可善用。"
  },
  {
    question: "以下哪個選擇較有助控制糖分攝取？",
    options: ["無糖清水", "加倍糖汽水", "多糖珍珠飲品", "超甜奶茶"],
    answer: 0,
    explanation: "清水不含添加糖，是較理想選擇。"
  },
  {
    question: "哪類食物最能提供建造身體的材料？",
    options: ["蛋白質食物", "糖果", "汽水", "糖漿"],
    answer: 0,
    explanation: "蛋白質對成長、修補組織很重要。"
  },
  {
    question: "什麼情況最容易造成買多了食材？",
    options: ["肚餓時胡亂購物", "先寫清單", "檢查雪櫃後再買", "按需要購買"],
    answer: 0,
    explanation: "肚餓時購物容易衝動，買多不需要的食物。"
  },
  {
    question: "哪個是較好的剩食保存方法？",
    options: ["放涼後盡快密封冷藏", "一直放在桌上", "不蓋好放兩天", "和垃圾放一起"],
    answer: 0,
    explanation: "熟食應適當保存，放涼後盡快密封冷藏較安全。"
  },
  {
    question: "如果今天已經吃了很多炸食，晚餐較適合選什麼？",
    options: ["清蒸魚和蔬菜", "再加大炸雞套餐", "只吃薯片", "再喝大杯汽水"],
    answer: 0,
    explanation: "下一餐可選較清淡和均衡的食物，幫助平衡。"
  },
  {
    question: "下列哪個食物組合較像健康早餐？",
    options: ["牛奶 + 麵包 + 水果", "汽水 + 糖果", "薯片 + 雪糕", "只吃朱古力"],
    answer: 0,
    explanation: "牛奶、麵包和水果是較均衡的早餐配搭。"
  },
  {
    question: "為什麼要幫忙分辨『想吃』和『需要吃』？",
    options: ["可以更健康，也減少浪費", "因為食物會生氣", "因為盤子會變大", "因為這樣會令飯變藍色"],
    answer: 0,
    explanation: "分清楚想吃和需要吃，有助作出更健康又惜食的選擇。"
  },
  {
    question: "哪種行為最有助建立惜食習慣？",
    options: ["和家人一起計劃一週餐單", "每天亂買食物", "食剩就算", "完全不看家中存貨"],
    answer: 0,
    explanation: "預先計劃餐單可幫助掌握需要，減少浪費。"
  },
  {
    question: "哪種食物較適合作為補充蛋白質的選擇？",
    options: ["豆腐", "棒棒糖", "汽水", "糖霜麵包"],
    answer: 0,
    explanation: "豆腐含蛋白質，是不錯的蛋白質來源。"
  },
  {
    question: "如果家裡有快熟透的水果，怎樣最惜食？",
    options: ["做成水果杯或果昔", "全部丟掉", "放到壞為止", "只拍照不處理"],
    answer: 0,
    explanation: "把快熟水果變成新食品，是很好的惜食做法。"
  },
  {
    question: "健康飲食和惜食有什麼共同點？",
    options: ["都要先思考需要，再作選擇", "都要每天吃很多糖", "都要把蔬菜丟掉", "都和生活完全無關"],
    answer: 0,
    explanation: "健康飲食和惜食都強調有計劃、適量和珍惜資源。"
  }
];

let currentQuizSet = [];
let currentQuizIndex = 0;
let currentQuizCorrect = 0;
let quizAnswered = false;

// ==========================================
// 頁面切換邏輯
// ==========================================
function switchTab(tabName) {
  document.querySelectorAll(".page-view").forEach(view => view.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));

  const targetView = document.getElementById(`view-${tabName}`);
  if (targetView) {
    targetView.classList.add("active");
  }

  const navMap = {
    home: 0,
    app: 1,
    quiz: 2,
    nutrition: 3,
    "parent-recipe": -1
  };

  const activeNavIdx = navMap[tabName];
  if (activeNavIdx !== undefined && activeNavIdx >= 0) {
    const navItems = document.querySelectorAll(".nav-item");
    if (navItems[activeNavIdx]) {
      navItems[activeNavIdx].classList.add("active");
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (tabName === "nutrition") {
    renderNutritionCards();
  }

  if (tabName === "quiz") {
    renderQuizQuestion();
  }
}

function triggerConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.75 }
    });
  }
}

// ==========================================
// 智能餐盤初始化
// ==========================================
async function initApp() {
  try {
    const response = await fetch("./data/foods.json");
    if (!response.ok) {
      throw new Error("無法載入 JSON");
    }
    foodDatabase = await response.json();
    renderFoodOptions("all");
  } catch (error) {
    console.warn("⚠️ 載入食材資料庫失敗", error);
  }

  updateUI();
  initQuiz();
  checkParentRecipeURL();
}

// ==========================================
// 智能餐盤邏輯
// ==========================================
function renderFoodOptions(categoryFilter) {
  const selectEl = document.getElementById("food-select");
  if (!selectEl) return;

  selectEl.innerHTML = '<option value="">-- 請選擇食材 --</option>';

  const filteredFoods = categoryFilter === "all"
    ? foodDatabase
    : foodDatabase.filter(f => f.category === categoryFilter);

  filteredFoods.forEach(food => {
    const option = document.createElement("option");
    option.value = food.code;
    option.textContent = `${food.name} (${food.categoryName})`;
    selectEl.appendChild(option);
  });

  const unitLabel = document.getElementById("unit-label");
  if (unitLabel) {
    unitLabel.textContent = "份";
  }
}

document.getElementById("category-select").addEventListener("change", (e) => {
  renderFoodOptions(e.target.value);
});

document.getElementById("food-select").addEventListener("change", (e) => {
  const selectedCode = e.target.value;
  const unitLabel = document.getElementById("unit-label");

  if (!selectedCode) {
    unitLabel.textContent = "份";
    return;
  }

  const foodItem = foodDatabase.find(f => f.code === selectedCode);
  if (foodItem) {
    unitLabel.textContent = foodItem.unit;
  }
});

document.getElementById("add-btn").addEventListener("click", () => {
  const selectEl = document.getElementById("food-select");
  const qtyEl = document.getElementById("food-qty");
  const cookingEl = document.getElementById("cooking-select");

  const selectedCode = selectEl.value;
  const qty = parseFloat(qtyEl.value);
  const cookingMethod = cookingEl.value;

  if (!selectedCode || !qty || qty <= 0) {
    alert("請選擇食材與正確數量！");
    return;
  }

  const foodItem = foodDatabase.find(f => f.code === selectedCode);
  if (!foodItem) {
    alert("找不到這個食材資料。");
    return;
  }

  const totalWeight = qty * foodItem.unitWeight;
  const itemRatio = totalWeight / 100;

  let baseCalories = foodItem.calories * itemRatio;
  let baseProtein = foodItem.protein * itemRatio;
  let baseCarbs = (foodItem.carbs !== undefined ? foodItem.carbs : (foodItem.calories * 0.13)) * itemRatio;
  let baseFat = (foodItem.fat !== undefined ? foodItem.fat : (foodItem.calories * 0.03)) * itemRatio;
  let baseMinerals = (foodItem.minerals !== undefined ? foodItem.minerals : (foodItem.calories * 0.002)) * itemRatio;
  let baseFiber = (foodItem.fiber !== undefined ? foodItem.fiber : (foodItem.calories * 0.01)) * itemRatio;

  let extraFatPer100g = 0;
  let extraCarbsPer100g = 0;

  if (cookingMethod.includes("香炸")) {
    extraFatPer100g = 8.0;
  } else if (cookingMethod.includes("清炒")) {
    extraFatPer100g = 3.0;
  } else if (cookingMethod.includes("焗/烘烤")) {
    extraFatPer100g = 2.0;
  } else if (cookingMethod.includes("甜品")) {
    extraCarbsPer100g = 12.0;
    extraFatPer100g = 4.0;
  } else if (cookingMethod.includes("滾湯")) {
    extraFatPer100g = 1.0;
  }

  const addedFat = extraFatPer100g * itemRatio;
  const addedCarbs = extraCarbsPer100g * itemRatio;
  const addedCalories = (addedFat * 9) + (addedCarbs * 4);

  myPlate.push({
    id: Date.now(),
    name: foodItem.name,
    enName: foodItem.enName,
    cookingMethod: cookingMethod,
    displayQty: `${qty} ${foodItem.unit}`,
    weight: totalWeight,
    calories: Math.round(baseCalories + addedCalories),
    protein: parseFloat(baseProtein.toFixed(1)),
    carbs: parseFloat((baseCarbs + addedCarbs).toFixed(1)),
    fat: parseFloat((baseFat + addedFat).toFixed(1)),
    minerals: parseFloat(baseMinerals.toFixed(2)),
    fiber: parseFloat(baseFiber.toFixed(1))
  });

  triggerConfetti();
  updateUI();
});

function removeItem(id) {
  myPlate = myPlate.filter(item => item.id !== id);
  updateUI();
}

document.getElementById("reset-btn").addEventListener("click", () => {
  if (myPlate.length === 0) return;

  if (confirm("🧹 確定要清空餐盤嗎？")) {
    myPlate = [];
    updateUI();
    document.getElementById("ai-card").style.display = "none";
  }
});

function updateUI() {
  const tbody = document.getElementById("plate-list");

  if (myPlate.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="color: #94a3b8; padding: 24px;">🛒 購物籃空空如也，請先加入食材...</td></tr>';
  } else {
    tbody.innerHTML = myPlate.map(item => `
      <tr class="animated-row">
        <td>
          <strong style="font-size: 15px;">${item.name}</strong><br>
          <span class="cooking-tag tag-default">${item.cookingMethod.split(" ")[0]}</span>
        </td>
        <td>${item.displayQty}</td>
        <td>${item.weight}g</td>
        <td><strong>${item.calories}</strong> kcal</td>
        <td>${item.fat} g</td>
        <td><button class="btn-delete" onclick="removeItem(${item.id})">❌ 移除</button></td>
      </tr>
    `).join("");
  }

  const totalWeight = myPlate.reduce((sum, item) => sum + item.weight, 0);

  const totals = {
    calories: myPlate.reduce((sum, item) => sum + item.calories, 0),
    carbs: parseFloat(myPlate.reduce((sum, item) => sum + item.carbs, 0).toFixed(1)),
    protein: parseFloat(myPlate.reduce((sum, item) => sum + item.protein, 0).toFixed(1)),
    fat: parseFloat(myPlate.reduce((sum, item) => sum + item.fat, 0).toFixed(1)),
    minerals: parseFloat(myPlate.reduce((sum, item) => sum + item.minerals, 0).toFixed(2)),
    fiber: parseFloat(myPlate.reduce((sum, item) => sum + item.fiber, 0).toFixed(1))
  };

  document.getElementById("pill-items-count").textContent = myPlate.length;
  document.getElementById("pill-total-weight").textContent = totalWeight;
  document.getElementById("pill-minerals-count").textContent = totals.minerals.toFixed(2);

  updateBar("calories", totals.calories, TARGETS.calories);
  updateBar("carbs", totals.carbs, TARGETS.carbs);
  updateBar("protein", totals.protein, TARGETS.protein);
  updateBar("fat", totals.fat, TARGETS.fat);
  updateBar("minerals", totals.minerals, TARGETS.minerals);
  updateBar("fiber", totals.fiber, TARGETS.fiber);
}

function updateBar(key, currentVal, targetVal) {
  document.getElementById(`val-${key}`).textContent = currentVal;
  const percent = Math.min((currentVal / targetVal) * 100, 100);
  const barEl = document.getElementById(`bar-${key}`);

  barEl.style.width = `${percent}%`;

  if (currentVal > targetVal * 1.3) {
    barEl.style.backgroundColor = "#ef4444";
  } else if (currentVal > targetVal * 1.1) {
    barEl.style.backgroundColor = "#f59e0b";
  } else {
    barEl.style.backgroundColor = "#10b981";
  }
}

// ==========================================
// 營養超能力圖鑑
// ==========================================
function renderNutritionCards(searchQuery = "") {
  const grid = document.getElementById("dict-grid");
  if (!grid) return;

  grid.innerHTML = "";
  let filtered = nutritionDictData;

  if (currentDictFilter !== "all") {
    filtered = filtered.filter(item => item.category === currentDictFilter);
  }

  if (searchQuery) {
    filtered = filtered.filter(item =>
      item.name.includes(searchQuery) || item.foods.includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: #64748b; font-size: 16px;">找不到相關營養素喔！試試其他關鍵字🔍</p>';
    return;
  }

  filtered.forEach(item => {
    grid.innerHTML += `
      <div class="dict-card">
        <div>
          <div class="dict-card-title">${item.icon} ${item.name}</div>
          <p style="font-size: 14px; color: var(--text-muted);">${item.desc}</p>
          <div class="dict-stem-box">
            <strong>💡 常見好朋友食材：</strong><br>${item.foods}
          </div>
        </div>
        <button class="dict-action-btn" onclick="switchTab('app')">去餐盤加入這些食材 🍽️</button>
      </div>
    `;
  });
}

function setDictFilter(category, btnEl) {
  currentDictFilter = category;
  document.querySelectorAll(".dict-filter-btn").forEach(btn => btn.classList.remove("active"));
  btnEl.classList.add("active");
  renderNutritionCards(document.getElementById("dict-search-input").value);
}

function filterNutritionCards() {
  const query = document.getElementById("dict-search-input").value.trim();
  renderNutritionCards(query);
}

// ==========================================
// 🌟 Quiz 遊戲邏輯（隨機抽題）
// ==========================================
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getRandomQuizQuestions(count) {
  const shuffled = shuffleArray(quizQuestionBank);
  return shuffled.slice(0, count);
}

function initQuiz() {
  currentQuizIndex = 0;
  currentQuizCorrect = 0;
  quizAnswered = false;
  currentQuizSet = getRandomQuizQuestions(QUIZ_QUESTIONS_PER_ROUND);

  const quizResult = document.getElementById("quiz-result");
  const quizBox = document.getElementById("quiz-box");
  const explanationBox = document.getElementById("quiz-explanation");
  const nextBtn = document.getElementById("quiz-next-btn");

  quizResult.style.display = "none";
  quizBox.style.display = "block";
  explanationBox.style.display = "none";
  explanationBox.innerHTML = "";
  nextBtn.style.display = "none";

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const questionEl = document.getElementById("quiz-question");
  const optionsEl = document.getElementById("quiz-options");
  const explanationBox = document.getElementById("quiz-explanation");
  const nextBtn = document.getElementById("quiz-next-btn");
  const progressBadge = document.getElementById("quiz-progress-badge");

  if (currentQuizIndex >= currentQuizSet.length) {
    showQuizResult();
    return;
  }

  const currentQuestion = currentQuizSet[currentQuizIndex];
  quizAnswered = false;

  progressBadge.textContent = `題目 ${currentQuizIndex + 1} / ${currentQuizSet.length}`;
  questionEl.textContent = currentQuestion.question;
  explanationBox.style.display = "none";
  explanationBox.innerHTML = "";
  nextBtn.style.display = "none";

  optionsEl.innerHTML = currentQuestion.options.map((option, index) => `
    <button class="quiz-opt-btn" onclick="handleQuizAnswer(${index})">
      <span>${option}</span>
      <span>👉</span>
    </button>
  `).join("");
}

function handleQuizAnswer(selectedIndex) {
  if (quizAnswered) return;

  quizAnswered = true;

  const currentQuestion = currentQuizSet[currentQuizIndex];
  const optionButtons = document.querySelectorAll(".quiz-opt-btn");
  const explanationBox = document.getElementById("quiz-explanation");
  const nextBtn = document.getElementById("quiz-next-btn");

  optionButtons.forEach((btn, index) => {
    btn.disabled = true;

    if (index === currentQuestion.answer) {
      btn.classList.add("correct");
      btn.innerHTML = `<span>${currentQuestion.options[index]}</span><span>✅</span>`;
    } else if (index === selectedIndex) {
      btn.classList.add("incorrect");
      btn.innerHTML = `<span>${currentQuestion.options[index]}</span><span>❌</span>`;
    }
  });

  if (selectedIndex === currentQuestion.answer) {
    currentQuizCorrect++;
    triggerConfetti();
  }

  explanationBox.style.display = "block";
  explanationBox.innerHTML = `
    <strong>${selectedIndex === currentQuestion.answer ? "答對了！🎉" : "再接再厲！💪"}</strong><br>
    ${currentQuestion.explanation}
  `;

  if (currentQuizIndex < currentQuizSet.length - 1) {
    nextBtn.textContent = "➡️ 下一題";
  } else {
    nextBtn.textContent = "🏁 查看結果";
  }

  nextBtn.style.display = "inline-flex";
}

function nextQuizQuestion() {
  currentQuizIndex++;
  renderQuizQuestion();
}

function showQuizResult() {
  const quizBox = document.getElementById("quiz-box");
  const quizResult = document.getElementById("quiz-result");
  const finalScoreEl = document.getElementById("quiz-final-score");
  const commentEl = document.getElementById("quiz-comment");
  const progressBadge = document.getElementById("quiz-progress-badge");

  const finalScore = Math.round((currentQuizCorrect / currentQuizSet.length) * 100);

  quizBox.style.display = "none";
  quizResult.style.display = "block";
  finalScoreEl.textContent = finalScore;
  progressBadge.textContent = "完成！🎓";

  let comment = "";
  if (finalScore === 100) {
    comment = "你真係超級營養小博士！🌟";
  } else if (finalScore >= 80) {
    comment = "你好叻呀！已經好有健康飲食知識！👏";
  } else if (finalScore >= 60) {
    comment = "做得唔錯！再努力就可以成為惜食達人！💚";
  } else {
    comment = "唔緊要，再玩一次，你一定會進步！🚀";
  }

  commentEl.textContent = `你答對了 ${currentQuizCorrect} / ${currentQuizSet.length} 題。${comment}`;
  triggerConfetti();
}

function resetQuiz() {
  initQuiz();
}

// ==========================================
// AI 相關邏輯
// ==========================================
document.getElementById("ai-analyze-btn").addEventListener("click", async () => {
  if (myPlate.length === 0) {
    alert("餐盤是空的！請先加入至少一種食材。");
    return;
  }

  if (!PRESET_OPENROUTER_KEY || PRESET_OPENROUTER_KEY.trim() === "") {
    alert("請先在 script.js 填入 OpenRouter API Key，之後再使用 AI 生成功能。");
    return;
  }

  const loadingEl = document.getElementById("loading-spinner");
  const aiCard = document.getElementById("ai-card");

  loadingEl.style.display = "block";
  aiCard.style.display = "none";

  try {
    const aiResponse = await callOpenRouterAPI(PRESET_OPENROUTER_KEY, myPlate);
    currentGeneratedRecipe = aiResponse;

    document.getElementById("ai-score").textContent = aiResponse.score;
    document.getElementById("ai-waste-risk").textContent = aiResponse.wasteAnalysis;

    const sugList = document.getElementById("ai-suggestions");
    sugList.innerHTML = aiResponse.suggestions.map(s => `<li>${s}</li>`).join("");

    document.getElementById("ai-recipe-title").textContent = `👨‍🍳 菜式：${aiResponse.recipeTitle || "特色營養料理"}`;

    const ingList = document.getElementById("ai-recipe-ingredients");
    ingList.innerHTML = (aiResponse.recipeIngredients || []).map(ing => `<li>${ing}</li>`).join("");

    const stepsList = document.getElementById("ai-recipe-steps");
    stepsList.innerHTML = (aiResponse.recipeSteps || []).map((step, idx) => `
      <li class="recipe-step-item">
        <span class="step-num-badge">步驟 ${idx + 1}</span>
        <div>${step}</div>
      </li>
    `).join("");

    loadingEl.style.display = "none";
    aiCard.style.display = "block";

    triggerConfetti();
    generateAIImage(aiResponse.enRecipePrompt);
    updateMagnetQRCode();

  } catch (error) {
    alert("❌ AI 分析失敗： " + error.message);
    loadingEl.style.display = "none";
    console.error(error);
  }
});

function updateMagnetQRCode() {
  if (!currentGeneratedRecipe) return;

  const chefName = document.getElementById("chef-name-input").value.trim() || "小博士";
  document.getElementById("magnet-chef-display").textContent = `👨‍🍳 廚師：${chefName}`;
  document.getElementById("magnet-title-display").textContent = `菜式：${currentGeneratedRecipe.recipeTitle}`;

  const miniPayload = {
    c: chefName,
    t: currentGeneratedRecipe.recipeTitle,
    i: (currentGeneratedRecipe.recipeIngredients || []).map(ing => ing.split("：")[0].split("(")[0]).slice(0, 5),
    s: (currentGeneratedRecipe.recipeSteps || []).map(step => step.length > 30 ? step.substring(0, 30) + "..." : step).slice(0, 4)
  };

  const jsonStr = JSON.stringify(miniPayload);
  const encodedData = encodeURIComponent(jsonStr);
  const baseUrl = window.location.href.split("#")[0];
  const parentShareURL = `${baseUrl}#recipe=${encodedData}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&ecc=L&margin=10&data=${encodeURIComponent(parentShareURL)}`;

  const qrImgEl = document.getElementById("magnet-qr-img");
  qrImgEl.src = qrApiUrl;
}

function checkParentRecipeURL() {
  const hash = window.location.hash;

  if (hash && hash.includes("#recipe=")) {
    try {
      const encodedData = hash.replace("#recipe=", "");
      const decodedJson = decodeURIComponent(encodedData);
      const rawData = JSON.parse(decodedJson);

      const recipeData = {
        chef: rawData.c || rawData.chef || "小廚師",
        title: rawData.t || rawData.title || "健康菜式",
        ing: rawData.i || rawData.ing || [],
        steps: rawData.s || rawData.steps || []
      };

      renderParentView(recipeData);
      switchTab("parent-recipe");
    } catch (e) {
      console.error("解析家長食譜失敗:", e);
    }
  }
}

function renderParentView(data) {
  document.getElementById("parent-chef-title").textContent = `👨‍🍳 ${data.chef} 的愛心餐盤`;
  document.getElementById("parent-dish-title").textContent = `菜式：${data.title}`;

  const shopContainer = document.getElementById("parent-shopping-list");
  shopContainer.innerHTML = (data.ing || []).map((itemText) => `
    <div class="shopping-item" onclick="toggleShoppingItem(this)">
      <div class="shopping-checkbox">✓</div>
      <div>${itemText}</div>
    </div>
  `).join("");

  const parentSteps = document.getElementById("parent-recipe-steps");
  parentSteps.innerHTML = (data.steps || []).map((stepText, idx) => `
    <li class="recipe-step-item">
      <span class="step-num-badge">步驟 ${idx + 1}</span>
      <div>${stepText}</div>
    </li>
  `).join("");
}

function toggleShoppingItem(el) {
  el.classList.toggle("checked");
  triggerConfetti();
}

function rateChef(stars) {
  const feedbackEl = document.getElementById("rating-feedback");
  const comments = [
    "繼續加油喔！❤️",
    "做得很棒，有進步！👍",
    "哇！非常營養健康的搭配！🌟",
    "太厲害了！簡直是星級小廚師！🎉",
    "💯 滿分！今晚就和你一起做這道菜！樂不可支！🥰"
  ];

  feedbackEl.textContent = `${"⭐".repeat(stars)} ${comments[stars - 1]}`;
  triggerConfetti();
}

function addChefLike() {
  currentLikesCount++;
  document.getElementById("like-count").textContent = currentLikesCount;
  triggerConfetti();
}

async function callOpenRouterAPI(apiKey, plate) {
  const endpoint = "https://openrouter.ai/api/v1/chat/completions";
  const totalCal = plate.reduce((sum, item) => sum + item.calories, 0);
  const totalFat = plate.reduce((sum, item) => sum + item.fat, 0);
  const itemsText = plate.map(i => `${i.name} (${i.weight}g, 預計烹調: ${i.cookingMethod})`).join("、");

  const systemPrompt = `
你是一位專門指導香港小學生與家長料理的「星級大廚兼營養師」。
請根據學生提供的餐盤食材與對應烹調方式，設計一份現實中 100% 可行、請將每個烹飪步驟精簡扼要，每個步驟控制在 25 字以內，但確保語意完整且易懂。、新手與小學生都能完全照著做的美味食譜。

學生選定的餐盤內容：
- 食材列表：${itemsText}
- 實時計算總熱量：${totalCal} kcal
- 實時計算總脂肪：${totalFat} g

請嚴格遵守以下 JSON 輸出格式，不要加任何 Markdown 標籤：
{
  "score": 88,
  "wasteAnalysis": "繁體中文廚餘與一人一餐份量風險分析",
  "suggestions": ["營養建議1", "惜食建議2"],
  "recipeTitle": "讓人食指大動的菜式名稱",
  "recipeIngredients": [
    "菜心：150克（洗淨切段）"
  ],
  "recipeSteps": [
    "【清洗預備】將菜心浸泡5分鐘，切成5公分段狀。"
  ],
  "enRecipePrompt": "Masterpiece delicious cuisine photo, 4k resolution, ultra-detailed food photography"
}
`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "google/gemma-4-26b-a4b-it:free",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "請為我生成星級詳細大廚食譜與分析。" }
      ],
      temperature: 0.6
    })
  });

  if (!response.ok) {
    throw new Error("OpenRouter API 請求失敗");
  }

  const data = await response.json();
  let rawText = data.choices[0].message.content;

  rawText = rawText
    .replace(/<think>[\s\S]*?<\/think>/g, "")
    .trim()
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(rawText);
}

function generateAIImage(customPrompt) {
  const imgEl = document.getElementById("ai-food-img");
  const imgStatus = document.getElementById("image-status");
  const ingredientNames = myPlate.map(item => item.enName).join(", ");
  const promptText = (customPrompt || `delicious dish with ${ingredientNames}`) + ", 4k resolution, food photography";

  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?seed=${Math.floor(Math.random() * 10000)}&width=800&height=500&nologo=true`;

  imgStatus.textContent = "🎨 AI 概念圖生成中...";
  imgEl.style.display = "none";

  imgEl.onload = () => {
    imgStatus.textContent = "✨ AI 美食概念圖已生成！";
    imgEl.style.display = "block";
  };

  imgEl.onerror = () => {
    imgStatus.textContent = "⚠️ 圖片載入失敗，但食譜已生成。";
  };

  imgEl.src = imageUrl;
}

initApp();