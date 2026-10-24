/* Fictional characters, prices and product labels; knowledge and household measures have cited sources. */
window.NutritionScenarioBank = {
  "version": 1,
  "contentVersion": "2026-10-24-v1",
  "checked": "2026-10-24",
  "sources": {
    "healthy": {
      "title": "衞生署：健康飲食",
      "url": "https://www.chp.gov.hk/tc/healthtopics/content/25/8800.html"
    },
    "label": {
      "title": "食物安全中心：營養標籤問答",
      "url": "https://www.cfs.gov.hk/tc_chi/faq/faq_14.html"
    },
    "allergy": {
      "title": "食物安全中心：食物過敏",
      "url": "https://www.cfs.gov.hk/tc_chi/consumer_zone/safefood_all/food_allergy.html"
    },
    "allergens": {
      "title": "食物安全中心：食物致敏物",
      "url": "https://www.cfs.gov.hk/tc_chi/faq/faq_12.html"
    },
    "veg": {
      "title": "學生健康服務：素食與營養",
      "url": "https://www.studenthealth.gov.hk/tc_chi/health/health_dn/health_dn_vdn.html"
    },
    "snack": {
      "title": "學生健康服務：西式午餐及小食",
      "url": "https://www.studenthealth.gov.hk/tc_chi/health/health_dn/health_dn_wls.html"
    },
    "water": {
      "title": "衞生署：流質飲品",
      "url": "https://www.chp.gov.hk/tc/static/100015.html"
    },
    "leftovers": {
      "title": "食物安全中心：處理剩餘食物",
      "url": "https://www.cfs.gov.hk/tc_chi/consumer_zone/safefood_all/five_keys_apply_leftovers.html"
    },
    "safety": {
      "title": "食物安全中心：食物安全五要點",
      "url": "https://www.cfs.gov.hk/tc_chi/consumer_zone/safefood_all/five_keys_reminder.html"
    },
    "growth": {
      "title": "衞生署：兒童青少年須參考生長圖表",
      "url": "https://www.change4health.gov.hk/tc/weight_management/index.html"
    },
    "vitamins": {
      "title": "學生健康服務：維他命",
      "url": "https://www.studenthealth.gov.hk/tc_chi/health/health_dn/health_dn_vit.html"
    }
  },
  "stories": [
    {
      "id": "keung",
      "name": "小強",
      "age": 15,
      "title": "趕時間的上學日",
      "icon": "🎒",
      "goal": "在時間和餐牌限制下，安排方便的早餐及午餐。",
      "profile": [
        "常因趕時間而漏吃早餐",
        "午餐多在外購買，喜歡樽裝飲品",
        "今天以規律進餐、配搭及可行安排為目標"
      ],
      "tasks": [
        {
          "id": "keung-1",
          "title": "早餐只有十分鐘",
          "type": "decision",
          "skill": "planning",
          "context": "早上有10分鐘。家人已煮熟雞蛋；全麥麵包、香蕉及清水均可即時取用。目標：有穀物、有一項蛋／豆／奶類食物，並能準時出門。",
          "prompt": "選一份符合三個條件的早餐，再選支持理由。",
          "options": [
            {
              "id": "a",
              "text": "即煮燕麥＋雞蛋，需15分鐘",
              "correct": false,
              "feedback": "配搭有穀物和蛋，但超過可用時間。",
              "foods": []
            },
            {
              "id": "b",
              "text": "全麥麵包＋已煮熟雞蛋＋清水，需5分鐘",
              "correct": true,
              "feedback": "同時符合食物類別及時間條件。",
              "foods": [
                "carb_006",
                "egg_001",
                "liq_001"
              ]
            },
            {
              "id": "c",
              "text": "全麥麵包＋香蕉＋清水，需3分鐘",
              "correct": false,
              "feedback": "這個組合沒有題目指定的蛋／豆／奶類食物。",
              "foods": []
            },
            {
              "id": "d",
              "text": "雞蛋＋牛奶，需3分鐘",
              "correct": false,
              "feedback": "有蛋及奶，但缺少題目要求的穀物。",
              "foods": []
            }
          ],
          "reasons": [
            {
              "id": "r1",
              "text": "有穀物和蛋類，準備時間亦足夠",
              "correct": true,
              "feedback": "理由同時回應配搭和時間。",
              "foods": []
            },
            {
              "id": "r2",
              "text": "只要最快，不用看材料",
              "correct": false,
              "feedback": "速度是其中一個條件，並非全部。",
              "foods": []
            },
            {
              "id": "r3",
              "text": "身高和體重已能決定這餐吃甚麼",
              "correct": false,
              "feedback": "人物數字不足以訂個人餐單，要看生活條件及整體飲食。",
              "foods": []
            }
          ],
          "explanation": "先逐項核對條件，合適方案需要同時可行及回應配搭目標。",
          "hint": "圈出題目的三個條件，再逐項檢查。",
          "sourceIds": [
            "healthy",
            "growth"
          ],
          "pedia": "carbohydrate"
        },
        {
          "id": "keung-2",
          "title": "每100毫升與整樽",
          "type": "single",
          "skill": "label",
          "context": "兩款飲品均打算飲完整樽。下面是教學用模擬標籤，並非真實品牌。",
          "prompt": "只比較整樽總糖，哪個判斷正確？",
          "options": [
            {
              "id": "a",
              "text": "甲較少，因每100毫升只有4克糖",
              "correct": false,
              "feedback": "忽略了甲一樽有500毫升。",
              "foods": []
            },
            {
              "id": "b",
              "text": "乙較少：甲整樽20克，乙整樽15克",
              "correct": true,
              "feedback": "甲：4×5＝20；乙：6×2.5＝15。",
              "foods": []
            },
            {
              "id": "c",
              "text": "兩款相同，因為都是一樽",
              "correct": false,
              "feedback": "容量及濃度不同，不能把一樽當作相同份量。",
              "foods": []
            },
            {
              "id": "d",
              "text": "乙有30克，因250毫升等於5份100毫升",
              "correct": false,
              "feedback": "250毫升是2.5份100毫升，不是5份。",
              "foods": []
            }
          ],
          "reasons": [],
          "explanation": "每100毫升用來比較濃度；整樽攝取量要乘實際容量。總糖較少不等於整體營養一定較好。",
          "hint": "先把容量除以100，再乘每100毫升的糖。",
          "sourceIds": [
            "label"
          ],
          "pedia": "carbohydrate",
          "table": {
            "caption": "教學用模擬飲品標籤",
            "headers": [
              "飲品",
              "每100毫升糖",
              "一樽容量"
            ],
            "rows": [
              [
                "甲",
                "4克",
                "500毫升"
              ],
              [
                "乙",
                "6克",
                "250毫升"
              ]
            ]
          }
        },
        {
          "id": "keung-3",
          "title": "餐牌有新限制",
          "type": "decision",
          "skill": "planning",
          "context": "新資訊：午餐店只供應以下組合。今日目標是保留主食、有蛋／豆／魚／肉類、有蔬菜，飲品選清水。",
          "prompt": "有不止一個方案可行。選一個，再選完整理由。",
          "options": [
            {
              "id": "a",
              "text": "白飯＋去皮雞肉＋菜心＋清水",
              "correct": true,
              "feedback": "有主食、雞肉、蔬菜及清水。",
              "foods": [
                "carb_001",
                "meat_004",
                "veg_001",
                "liq_001"
              ]
            },
            {
              "id": "b",
              "text": "糙米飯＋板豆腐＋西蘭花＋清水",
              "correct": true,
              "feedback": "植物性方案也符合本關條件。",
              "foods": [
                "carb_002",
                "soy_002",
                "veg_002",
                "liq_001"
              ]
            },
            {
              "id": "c",
              "text": "雞肉＋菜心＋清水，不要主食",
              "correct": false,
              "feedback": "缺少本關明確要求保留的主食。",
              "foods": []
            },
            {
              "id": "d",
              "text": "白飯＋雞肉＋清水，不要蔬菜",
              "correct": false,
              "feedback": "缺少本關要求的蔬菜。",
              "foods": []
            }
          ],
          "reasons": [
            {
              "id": "r1",
              "text": "同時回應四項條件；份量仍按食量及需要決定",
              "correct": true,
              "feedback": "沒有把某一餐當作個人全日營養評估。",
              "foods": []
            },
            {
              "id": "r2",
              "text": "只要選糙米，就可以忽略其他配搭",
              "correct": false,
              "feedback": "穀物種類不能代替其他條件。",
              "foods": []
            },
            {
              "id": "r3",
              "text": "數字最低的方案一定最好",
              "correct": false,
              "feedback": "本關目標是配搭及可行性，不是比最低數字。",
              "foods": []
            }
          ],
          "explanation": "相同目標可以有不同合理方案，重點是用資料說明選擇。",
          "hint": "逐一找出主食、蛋白質食物、蔬菜及飲品。",
          "sourceIds": [
            "healthy"
          ],
          "pedia": "protein",
          "newInformation": true,
          "recapFrom": 1
        },
        {
          "id": "keung-4",
          "title": "把改變放入時間表",
          "type": "multi",
          "skill": "planning",
          "context": "小強想下星期減少因趕時間而漏吃早餐。每天早上仍只有10分鐘。",
          "prompt": "選出兩項具體且可持續的安排。",
          "options": [
            {
              "id": "a",
              "text": "前一晚與家人準備可安全保存的早餐材料",
              "correct": true,
              "feedback": "預先準備能減少早上處理時間。",
              "foods": []
            },
            {
              "id": "b",
              "text": "早上預留固定進餐時間，按食量取用",
              "correct": true,
              "feedback": "安排進餐時間比只定一個口號更可行。",
              "foods": []
            },
            {
              "id": "c",
              "text": "每朝改煮需30分鐘的早餐",
              "correct": false,
              "feedback": "沒有回應只有10分鐘的限制。",
              "foods": []
            },
            {
              "id": "d",
              "text": "用同學的體重決定自己早餐份量",
              "correct": false,
              "feedback": "別人的體重不是訂自己早餐份量的依據。",
              "foods": []
            }
          ],
          "reasons": [],
          "explanation": "計劃要回應真正障礙：材料準備、可用時間及進餐安排。",
          "hint": "選擇能直接減少早上趕時間問題的兩項。",
          "sourceIds": [
            "healthy",
            "growth"
          ],
          "pedia": "carbohydrate",
          "choose": 2
        }
      ],
      "extra": [
        "身高150厘米、體重70公斤（虛構背景資料）",
        "15歲仍在成長；本活動不以成人BMI分類、訂減重餐單或評比體型。"
      ],
      "minutes": "約6–8分鐘"
    },
    {
      "id": "long",
      "name": "阿朗",
      "age": 12,
      "title": "放學有球隊練習",
      "icon": "🏀",
      "goal": "看練習時間及現有食物，安排正餐、小食和補水。",
      "profile": [
        "今天正常上學，放學有一般球隊練習",
        "午餐後到晚餐相隔較長",
        "教練提供休息及飲水機會"
      ],
      "tasks": [
        {
          "id": "long-1",
          "title": "先問哪兩項資料",
          "type": "multi",
          "skill": "planning",
          "context": "阿朗說放學時會肚餓，想加小食。暫時只知道他今天有練習。",
          "prompt": "先了解哪兩項資料，最能幫助安排？",
          "options": [
            {
              "id": "a",
              "text": "午餐、練習及晚餐時間",
              "correct": true,
              "feedback": "需要知道進餐及活動之間的安排。",
              "foods": []
            },
            {
              "id": "b",
              "text": "今天已吃甚麼、當時是否肚餓及可用食物",
              "correct": true,
              "feedback": "要連同現有飲食和實際需要考慮。",
              "foods": []
            },
            {
              "id": "c",
              "text": "隊友全部吃哪個品牌",
              "correct": false,
              "feedback": "別人的品牌不能代替自己的時間及飲食資料。",
              "foods": []
            },
            {
              "id": "d",
              "text": "小食是否印有「運動專用」字樣",
              "correct": false,
              "feedback": "宣傳字眼不能取代實際進餐時間及飲食資料。",
              "foods": []
            }
          ],
          "reasons": [],
          "explanation": "有活動不代表一律加同樣份量，先掌握時間及實際飲食。",
          "hint": "資料要能直接影響進餐時間或食物選擇。",
          "sourceIds": [
            "snack"
          ],
          "pedia": "carbohydrate",
          "choose": 2
        },
        {
          "id": "long-2",
          "title": "水樽怎樣用",
          "type": "decision",
          "skill": "safety",
          "context": "阿朗已正常吃午餐，今天是一般校隊活動；教練安排適量休息及補水。",
          "prompt": "哪個補水安排可行？再選理由。",
          "options": [
            {
              "id": "a",
              "text": "帶清水，利用休息機會按需要飲用",
              "correct": true,
              "feedback": "有準備水源，也利用教練安排的機會補水。",
              "foods": [
                "liq_001"
              ]
            },
            {
              "id": "b",
              "text": "把同學的固定飲水量直接照抄",
              "correct": false,
              "feedback": "需要不能只照抄別人的數字。",
              "foods": []
            },
            {
              "id": "c",
              "text": "整段練習不帶水，完結後才找水",
              "correct": false,
              "feedback": "錯過練習期間補水的機會。",
              "foods": []
            },
            {
              "id": "d",
              "text": "認為小食有水果，就不用另備飲用水",
              "correct": false,
              "feedback": "食物可提供部分水分，但不能取代練習期間有可用水源的安排。",
              "foods": []
            }
          ],
          "reasons": [
            {
              "id": "r1",
              "text": "補水須配合活動及天氣，也要有可用水源",
              "correct": true,
              "feedback": "說明了本關重要條件。",
              "foods": []
            },
            {
              "id": "r2",
              "text": "所有活動的需要都完全相同",
              "correct": false,
              "feedback": "活動和環境會影響需要。",
              "foods": []
            },
            {
              "id": "r3",
              "text": "清水能代替午餐",
              "correct": false,
              "feedback": "補水與進餐是不同需要。",
              "foods": []
            }
          ],
          "explanation": "本故事不提供個人運動處方。一般活動也應有水源及適當休息，特殊訓練依教練及專業安排。",
          "hint": "選擇有水源、有休息機會，而非照抄別人的做法。",
          "sourceIds": [
            "water"
          ],
          "pedia": "water"
        },
        {
          "id": "long-3",
          "title": "練習延期了",
          "type": "decision",
          "skill": "planning",
          "context": "新資訊：練習延期，現在距離晚餐仍有兩小時。阿朗感到肚餓；家中可取用以下食物。目標是選少量小食，保留晚餐安排。",
          "prompt": "選一個符合條件的安排，再選理由。",
          "options": [
            {
              "id": "a",
              "text": "按食量取少量全麥麵包，配清水",
              "correct": true,
              "feedback": "是可控制份量的小食安排。",
              "foods": [
                "carb_006",
                "liq_001"
              ]
            },
            {
              "id": "b",
              "text": "按食量取一份合適大小的新鮮水果，配清水",
              "correct": true,
              "feedback": "也是可按需要安排的小食。",
              "foods": [
                "fruit_002",
                "liq_001"
              ]
            },
            {
              "id": "c",
              "text": "現在吃完整份晚餐，兩小時後再吃同樣一份",
              "correct": false,
              "feedback": "沒有回應保留晚餐胃口及安排的目標。",
              "foods": []
            },
            {
              "id": "d",
              "text": "只按包裝最大份量取用，不理會肚餓程度",
              "correct": false,
              "feedback": "包裝大小不等於需要吃下的份量。",
              "foods": []
            }
          ],
          "reasons": [
            {
              "id": "r1",
              "text": "留意肚餓、時間及份量，小食不取代正餐",
              "correct": true,
              "feedback": "理由涵蓋本關條件。",
              "foods": []
            },
            {
              "id": "r2",
              "text": "練習延期就代表今天不需再進餐",
              "correct": false,
              "feedback": "活動改變不等於取消正常進餐。",
              "foods": []
            },
            {
              "id": "r3",
              "text": "只要有水果，就不用考慮份量",
              "correct": false,
              "feedback": "水果也要按需要安排份量。",
              "foods": []
            }
          ],
          "explanation": "合理小食有不止一個選擇，要連同進餐時間和份量考慮。",
          "hint": "先排除沒有理會晚餐時間和食量的方案。",
          "sourceIds": [
            "snack"
          ],
          "pedia": "fiber",
          "newInformation": true
        },
        {
          "id": "long-4",
          "title": "兩人分麵包",
          "type": "portion",
          "skill": "portion",
          "context": "這是分食練習：原安排是4人合共4片同款全麥方包。現在只有2人，保持每人原本的麵包份量。",
          "prompt": "兩人合共需要多少片？",
          "options": [],
          "reasons": [],
          "explanation": "每人原本1片；2人合共2片。這是按人數縮放原配方，並非阿朗的個人建議食量。",
          "hint": "先算每人幾片，再乘新的人數。",
          "sourceIds": [
            "label"
          ],
          "pedia": "carbohydrate",
          "foodCode": "carb_006",
          "guideIndex": 0,
          "unit": "片",
          "target": 2,
          "defaultInput": 0.5,
          "fromPeople": 4,
          "toPeople": 2,
          "originalQuantity": 4,
          "measure": {
            "id": "usda-carb_006-0",
            "label": "片（來源參考厚度）",
            "gramsPerUnit": 32.0,
            "source": {
              "provider": "USDA FoodData Central",
              "foodRecordId": "172688",
              "foodDescription": "Bread, whole-wheat, commercially prepared",
              "release": "2018-04",
              "url": "https://fdc.nal.usda.gov/download-datasets/",
              "referenceAmount": "1",
              "referenceDescription": "slice",
              "referenceGrams": 32.0,
              "measureUnitId": "9999",
              "portionIndex": 0,
              "derivation": "referenceGrams / referenceAmount",
              "alternateRecord": false
            }
          }
        }
      ],
      "extra": [],
      "minutes": "約6–8分鐘"
    },
    {
      "id": "ching",
      "name": "小晴",
      "age": 11,
      "title": "購物時要核對奶類致敏物",
      "icon": "🛒",
      "goal": "按家長已確認的可食清單，核對產品及交叉接觸風險。",
      "profile": [
        "已確診牛奶蛋白過敏",
        "家長提供了本次可食產品清單，其他食品須先核對",
        "本故事的清單只適用於故事內的產品"
      ],
      "tasks": [
        {
          "id": "ching-1",
          "title": "正面寫無乳糖",
          "type": "single",
          "skill": "label",
          "context": "一款產品正面寫「無乳糖」，配料表仍列出牛奶及奶蛋白。小晴對牛奶蛋白過敏。",
          "prompt": "依目前資料，應怎樣做？",
          "options": [
            {
              "id": "a",
              "text": "直接選用，因無乳糖等於沒有奶蛋白",
              "correct": false,
              "feedback": "乳糖是糖，奶蛋白是蛋白質，不能混為一談。",
              "foods": []
            },
            {
              "id": "b",
              "text": "不自行選用，交家長按過敏方案核對",
              "correct": true,
              "feedback": "產品仍列明奶類配料，不能只看正面字眼。",
              "foods": []
            },
            {
              "id": "c",
              "text": "只喝半份就可確保安全",
              "correct": false,
              "feedback": "減少份量不能保證避免過敏反應。",
              "foods": []
            },
            {
              "id": "d",
              "text": "把產品換成羊奶就一定可行",
              "correct": false,
              "feedback": "不可自行假設另一種奶便安全，需按專業及家長方案。",
              "foods": []
            }
          ],
          "reasons": [],
          "explanation": "看完整配料及致敏物資料，並依已確認的過敏處理方案；不要自行試食。",
          "hint": "人物對哪一種物質過敏：乳糖，還是蛋白質？",
          "sourceIds": [
            "allergy",
            "allergens"
          ],
          "pedia": "protein",
          "table": {
            "caption": "教學用模擬產品資料",
            "headers": [
              "位置",
              "標示"
            ],
            "rows": [
              [
                "正面",
                "無乳糖"
              ],
              [
                "配料",
                "牛奶、奶蛋白、水"
              ],
              [
                "致敏物",
                "含奶類"
              ]
            ]
          }
        },
        {
          "id": "ching-2",
          "title": "再核對哪兩項",
          "type": "multi",
          "skill": "safety",
          "context": "家長清單內原有一款合適的麵包，但這次包裝換了新配方。",
          "prompt": "購買前應核對哪兩項？",
          "options": [
            {
              "id": "a",
              "text": "本次包裝的完整配料及致敏物／可能含有提示",
              "correct": true,
              "feedback": "配方和生產情況可能改變。",
              "foods": []
            },
            {
              "id": "b",
              "text": "請家長確認新配方是否仍符合可食清單及過敏方案",
              "correct": true,
              "feedback": "不能把舊清單當成新配方的保證。",
              "foods": []
            },
            {
              "id": "c",
              "text": "只核對外盒顏色是否相同",
              "correct": false,
              "feedback": "外觀不能保證配料相同。",
              "foods": []
            },
            {
              "id": "d",
              "text": "只看每份糖含量是否較少",
              "correct": false,
              "feedback": "糖含量不能判斷有沒有奶類致敏物。",
              "foods": []
            }
          ],
          "reasons": [],
          "explanation": "品牌或外觀相同，仍須核對本次配料和過敏相關資料。",
          "hint": "找出與奶蛋白及這次產品是否適合直接有關的資料。",
          "sourceIds": [
            "allergy",
            "allergens"
          ],
          "pedia": "protein",
          "choose": 2
        },
        {
          "id": "ching-3",
          "title": "公用夾有新情況",
          "type": "decision",
          "skill": "safety",
          "context": "新資訊：本來已確認可食的食品，現在被店員用夾過含奶食品的夾子接觸。家長尚未確認這次處理是否適合。",
          "prompt": "小晴應怎樣做？再選理由。",
          "options": [
            {
              "id": "a",
              "text": "暫停選用，請家長與店員核對並安排合適食品",
              "correct": true,
              "feedback": "出現新情況後，先核對，避免自行假設安全。",
              "foods": []
            },
            {
              "id": "b",
              "text": "把表面抹一抹就可保證安全",
              "correct": false,
              "feedback": "不能保證移除致敏物。",
              "foods": []
            },
            {
              "id": "c",
              "text": "只看食品原本配料，忽略公用夾",
              "correct": false,
              "feedback": "處理過程也可能造成致敏物交叉接觸。",
              "foods": []
            },
            {
              "id": "d",
              "text": "少吃一口便一定不會有反應",
              "correct": false,
              "feedback": "不能以少量作安全保證。",
              "foods": []
            }
          ],
          "reasons": [
            {
              "id": "r1",
              "text": "原配料合適仍要留意處理過程的交叉接觸",
              "correct": true,
              "feedback": "理由指出了新出現的風險。",
              "foods": []
            },
            {
              "id": "r2",
              "text": "加熱能保證所有致敏蛋白消失",
              "correct": false,
              "feedback": "不可把一般加熱當成避免過敏的保證。",
              "foods": []
            },
            {
              "id": "r3",
              "text": "食品沒有奶味就代表不含奶",
              "correct": false,
              "feedback": "味道不能可靠判斷致敏物。",
              "foods": []
            }
          ],
          "explanation": "出現未確認的新情況，按家長及醫護過敏方案處理，不以試食來判斷。",
          "hint": "原本配料和後來的處理過程，是兩組不同資料。",
          "sourceIds": [
            "allergy",
            "allergens"
          ],
          "pedia": "protein",
          "newInformation": true
        },
        {
          "id": "ching-4",
          "title": "安排帶回家的材料",
          "type": "decision",
          "skill": "planning",
          "context": "家長重新核對後，確認本故事中以下白米、雞蛋、紅蘿蔔、豆腐及西蘭花適合小晴，並會分開使用已清潔用具煮熟。目標：有穀物、有蛋或豆類、有蔬菜。",
          "prompt": "選一個可行配搭，再選理由。",
          "options": [
            {
              "id": "a",
              "text": "白飯＋熟雞蛋＋紅蘿蔔",
              "correct": true,
              "feedback": "三項類別均齊，亦依本故事已確認清單。",
              "foods": [
                "carb_001",
                "egg_001",
                "veg_004"
              ]
            },
            {
              "id": "b",
              "text": "白飯＋板豆腐＋西蘭花",
              "correct": true,
              "feedback": "是另一個符合本關條件的方案。",
              "foods": [
                "carb_001",
                "soy_002",
                "veg_002"
              ]
            },
            {
              "id": "c",
              "text": "只選白飯和紅蘿蔔",
              "correct": false,
              "feedback": "缺少指定的蛋或豆類食物。",
              "foods": []
            },
            {
              "id": "d",
              "text": "自行加入剛才未確認的新配方麵包",
              "correct": false,
              "feedback": "仍未按新配方完成確認。",
              "foods": []
            }
          ],
          "reasons": [
            {
              "id": "r1",
              "text": "符合配搭條件，且這批產品已由家長重新確認",
              "correct": true,
              "feedback": "同時回應營養配搭和過敏清單。",
              "foods": []
            },
            {
              "id": "r2",
              "text": "所有同名產品都可以套用這張清單",
              "correct": false,
              "feedback": "產品配方及處理情況可以不同。",
              "foods": []
            },
            {
              "id": "r3",
              "text": "沒有甜味就不會有致敏物",
              "correct": false,
              "feedback": "致敏物不能靠甜味判斷。",
              "foods": []
            }
          ],
          "explanation": "故事內可食清單不代表現實中同名產品均適合。製作自己的食譜前仍須由家長核對實際產品及過敏方案。",
          "hint": "先看已確認清單，再核對三類材料是否齊全。",
          "sourceIds": [
            "allergy",
            "healthy"
          ],
          "pedia": "protein"
        }
      ],
      "extra": [],
      "minutes": "約6–8分鐘"
    },
    {
      "id": "ching-veg",
      "name": "阿澄",
      "age": 12,
      "title": "今天設計素食午餐",
      "icon": "🥬",
      "goal": "用穀物、豆類及蔬菜配搭一餐，並留意不同營養來源。",
      "profile": [
        "今天的午餐不使用肉或魚",
        "可選豆類、豆製品及蔬菜",
        "以食物配搭學習營養，不計算個人營養是否足夠"
      ],
      "tasks": [
        {
          "id": "veg-1",
          "title": "午餐還缺哪一類",
          "type": "decision",
          "skill": "planning",
          "context": "午餐暫有白飯及紅蘿蔔。目標：保留穀物和蔬菜，再加入一項豆類或豆製品。",
          "prompt": "選一款材料，再選支持理由。",
          "options": [
            {
              "id": "a",
              "text": "加入熟鷹嘴豆",
              "correct": true,
              "feedback": "豆類可提供植物性蛋白質，亦符合本關類別要求。",
              "foods": [
                "bean_001"
              ]
            },
            {
              "id": "b",
              "text": "加入板豆腐",
              "correct": true,
              "feedback": "豆製品也是可行選擇。",
              "foods": [
                "soy_002"
              ]
            },
            {
              "id": "c",
              "text": "只再加一份白飯",
              "correct": false,
              "feedback": "增加同一類主食，未加入本關要求的豆類。",
              "foods": []
            },
            {
              "id": "d",
              "text": "只再加一份紅蘿蔔",
              "correct": false,
              "feedback": "增加蔬菜，未加入本關要求的豆類。",
              "foods": []
            }
          ],
          "reasons": [
            {
              "id": "r1",
              "text": "豆類及豆製品可以提供植物性蛋白質",
              "correct": true,
              "feedback": "與本關配搭目的相關。",
              "foods": []
            },
            {
              "id": "r2",
              "text": "所有植物性食物營養完全相同",
              "correct": false,
              "feedback": "不同植物性食物的成分亦有分別。",
              "foods": []
            },
            {
              "id": "r3",
              "text": "只要不含肉，就不需要再看配搭",
              "correct": false,
              "feedback": "素食也需要安排不同類別。",
              "foods": []
            }
          ],
          "explanation": "植物性餐單也可用不同食物提供營養，豆類是其中一個可選來源。",
          "hint": "找一項屬豆類或豆製品的材料。",
          "sourceIds": [
            "veg"
          ],
          "pedia": "protein"
        },
        {
          "id": "veg-2",
          "title": "植物性鐵的伙伴",
          "type": "multi",
          "skill": "planning",
          "context": "阿澄用豆類做菜，希望加入含維他命C的食物作配搭。",
          "prompt": "從以下選出兩項對應的食物。",
          "options": [
            {
              "id": "a",
              "text": "西蘭花",
              "correct": true,
              "feedback": "是維他命C的食物來源例子。",
              "foods": [
                "veg_002"
              ]
            },
            {
              "id": "b",
              "text": "橙",
              "correct": true,
              "feedback": "可作餐後水果配搭。",
              "foods": [
                "fruit_003"
              ]
            },
            {
              "id": "c",
              "text": "純橄欖油",
              "correct": false,
              "feedback": "不能把油當成此題的維他命C來源。",
              "foods": []
            },
            {
              "id": "d",
              "text": "幼鹽",
              "correct": false,
              "feedback": "不是此題所需的維他命C食物來源。",
              "foods": []
            }
          ],
          "reasons": [],
          "explanation": "維他命C有助吸收植物性食物中的非血紅素鐵；本站沒有據此計算鐵是否足夠。",
          "hint": "想一想圖鑑中維他命C的食物例子。",
          "sourceIds": [
            "veg",
            "vitamins"
          ],
          "pedia": "vitamin-c",
          "choose": 2
        },
        {
          "id": "veg-3",
          "title": "無糖與加鈣是兩回事",
          "type": "single",
          "skill": "label",
          "context": "新資訊：阿澄看見一款「無糖豆漿」。包裝未提供這道題所需的鈣含量或加鈣資料。",
          "prompt": "單靠「無糖」兩字，可以得出哪項結論？",
          "options": [
            {
              "id": "a",
              "text": "一定和牛奶有相同鈣含量",
              "correct": false,
              "feedback": "無糖沒有說明鈣含量。",
              "foods": []
            },
            {
              "id": "b",
              "text": "不能判斷鈣含量，須查看相應標籤資料",
              "correct": true,
              "feedback": "需要與鈣相關的資料才能比較。",
              "foods": []
            },
            {
              "id": "c",
              "text": "一定沒有蛋白質",
              "correct": false,
              "feedback": "糖與蛋白質是不同營養項目。",
              "foods": []
            },
            {
              "id": "d",
              "text": "一定已符合所有營養需要",
              "correct": false,
              "feedback": "單一聲稱不能代表整體飲食。",
              "foods": []
            }
          ],
          "reasons": [],
          "explanation": "不同產品的配方及強化情況有別。無糖與加鈣描述不同事項。",
          "hint": "題目提供的是糖資料，還是鈣資料？",
          "sourceIds": [
            "label",
            "veg"
          ],
          "pedia": "calcium",
          "newInformation": true
        },
        {
          "id": "veg-4",
          "title": "完成一份可行午餐",
          "type": "decision",
          "skill": "planning",
          "context": "已確認材料有白飯、熟紅腰豆、板豆腐、西蘭花、紅蘿蔔及橙。目標：有穀物、有豆類、有蔬菜，並有一款維他命C食物配搭。",
          "prompt": "有多個方案符合條件，選一個並選理由。",
          "options": [
            {
              "id": "a",
              "text": "白飯＋熟紅腰豆＋紅蘿蔔，另外配橙",
              "correct": true,
              "feedback": "穀物、豆類、蔬菜及維他命C配搭均有。",
              "foods": [
                "carb_001",
                "bean_003",
                "veg_004",
                "fruit_003"
              ]
            },
            {
              "id": "b",
              "text": "白飯＋板豆腐＋西蘭花",
              "correct": true,
              "feedback": "西蘭花同時是蔬菜及維他命C食物例子。",
              "foods": [
                "carb_001",
                "soy_002",
                "veg_002"
              ]
            },
            {
              "id": "c",
              "text": "白飯＋紅蘿蔔＋橙，不加豆類",
              "correct": false,
              "feedback": "欠缺本關明確要求的豆類或豆製品。",
              "foods": []
            },
            {
              "id": "d",
              "text": "只吃雙份豆腐",
              "correct": false,
              "feedback": "欠缺穀物、蔬菜及本關配搭。",
              "foods": []
            }
          ],
          "reasons": [
            {
              "id": "r1",
              "text": "不同食物可分工配搭，同一食物亦可提供多種營養",
              "correct": true,
              "feedback": "解釋了兩個方案為何皆可行。",
              "foods": []
            },
            {
              "id": "r2",
              "text": "只要有豆，就能推斷今天所有營養足夠",
              "correct": false,
              "feedback": "不能以一種材料判斷全日營養。",
              "foods": []
            },
            {
              "id": "r3",
              "text": "顏色相同的食物一定營養相同",
              "correct": false,
              "feedback": "不能用顏色替代成分資料。",
              "foods": []
            }
          ],
          "explanation": "本關只判斷題目列出的配搭條件；全日飲食及個人需要不能由這一題判定。",
          "hint": "把四個條件逐一配對到材料。",
          "sourceIds": [
            "veg",
            "vitamins"
          ],
          "pedia": "protein"
        }
      ],
      "extra": [],
      "minutes": "約6–8分鐘"
    },
    {
      "id": "chun",
      "name": "家俊",
      "age": 11,
      "title": "預算有限的家庭晚餐",
      "icon": "🧺",
      "goal": "先用現有材料，按預算、食用人數及可食份量採購。",
      "profile": [
        "與家人設計今晚晚餐",
        "先檢查家中材料，再列購物清單",
        "價格均為教學模擬，不代表實際市價"
      ],
      "tasks": [
        {
          "id": "chun-1",
          "title": "先打開哪兩項資料",
          "type": "multi",
          "skill": "waste",
          "context": "家中已有乾米、紅蘿蔔及雞蛋，需由成人處理煮熟。家俊打算去買餸。",
          "prompt": "先做哪兩件事，最能減少重複購買？",
          "options": [
            {
              "id": "a",
              "text": "核對現有食材的數量、狀態及是否仍可安全使用",
              "correct": true,
              "feedback": "先知道有甚麼和是否可用。",
              "foods": []
            },
            {
              "id": "b",
              "text": "確認吃飯人數，再列欠缺材料清單",
              "correct": true,
              "feedback": "人數及配搭影響採購量。",
              "foods": []
            },
            {
              "id": "c",
              "text": "只看最大包裝，不查家中存貨",
              "correct": false,
              "feedback": "可能重複購買或買過量。",
              "foods": []
            },
            {
              "id": "d",
              "text": "只按折扣百分比決定全部材料",
              "correct": false,
              "feedback": "折扣不能代替需要及保存條件。",
              "foods": []
            }
          ],
          "reasons": [],
          "explanation": "先盤點、確認人數及所需材料，再採購，能減少買多。",
          "hint": "先問「已有甚麼」及「需要多少」。",
          "sourceIds": [
            "healthy",
            "leftovers"
          ],
          "pedia": "protein",
          "choose": 2
        },
        {
          "id": "chun-2",
          "title": "兩包菜的取捨",
          "type": "decision",
          "skill": "waste",
          "context": "教學模擬售價：小包西蘭花200克售$8；大包500克售$15。今晚只欠約200克蔬菜；預算$10，家中沒有合適空間存放多出的部分。",
          "prompt": "選一個做法，再選完整理由。",
          "options": [
            {
              "id": "a",
              "text": "買小包200克，花$8",
              "correct": true,
              "feedback": "所需份量、預算及保存空間都符合。",
              "foods": [
                "veg_002"
              ]
            },
            {
              "id": "b",
              "text": "買大包500克，因每克較便宜",
              "correct": false,
              "feedback": "超出預算，也沒有安排多出部分。",
              "foods": []
            },
            {
              "id": "c",
              "text": "買兩個小包，共400克花$16",
              "correct": false,
              "feedback": "同樣超出預算及所需份量。",
              "foods": []
            },
            {
              "id": "d",
              "text": "只要便宜就不需要核對保存方法",
              "correct": false,
              "feedback": "食物仍須有安全使用或保存安排。",
              "foods": []
            }
          ],
          "reasons": [
            {
              "id": "r1",
              "text": "同時比較總價、今晚需要及多出部分如何保存",
              "correct": true,
              "feedback": "單價只是其中一項資料。",
              "foods": []
            },
            {
              "id": "r2",
              "text": "每克價錢最低就一定最合適",
              "correct": false,
              "feedback": "忽略了預算和實際需要。",
              "foods": []
            },
            {
              "id": "r3",
              "text": "包裝較小就代表營養一定較好",
              "correct": false,
              "feedback": "包裝大小不代表營養品質。",
              "foods": []
            }
          ],
          "explanation": "小包每100克$4，大包每100克$3；大包單價雖低，卻不符合本次預算和保存條件。",
          "hint": "除了單價，再檢查總價和多出的食物。",
          "sourceIds": [
            "label",
            "leftovers"
          ],
          "pedia": "fiber",
          "table": {
            "caption": "教學用模擬售價；不是實際市價",
            "headers": [
              "包裝",
              "份量",
              "總價"
            ],
            "rows": [
              [
                "小包",
                "200克",
                "$8"
              ],
              [
                "大包",
                "500克",
                "$15"
              ]
            ]
          }
        },
        {
          "id": "chun-3",
          "title": "臨時少了兩位客人",
          "type": "portion",
          "skill": "portion",
          "context": "新資訊：原本4人合共需要2個同款中型蒸薯仔，現在只有2人。保持原配方每人的薯仔份量；其他材料另外按配方調整。",
          "prompt": "兩人合共需要多少個？",
          "options": [],
          "reasons": [],
          "explanation": "原本每人半個，兩人合共1個。按人數縮放配方，不代表任何人的個人建議食量。",
          "hint": "2÷4＝每人原份量，再乘2人。",
          "sourceIds": [
            "label"
          ],
          "pedia": "carbohydrate",
          "foodCode": "carb_008",
          "guideIndex": 0,
          "unit": "個中型蒸薯仔",
          "target": 1,
          "defaultInput": 2,
          "fromPeople": 4,
          "toPeople": 2,
          "originalQuantity": 2,
          "newInformation": true,
          "measure": {
            "id": "portion-carb_008-0",
            "label": "個（中型蒸薯仔，來源大小）",
            "gramsPerUnit": 95.0,
            "source": {
              "provider": "日本厚生勞動科學研究班營養指導手冊",
              "foodRecordId": "2022-guide-v1.4",
              "foodDescription": "Steamed potatoes: 2 medium potatoes = 190 g",
              "url": "https://www.foodallergy.jp/wp-content/uploads/2026/04/nutritionalmanual2022-20260406.pdf",
              "release": "來源頁面／原始記錄",
              "accessed": "2026-10-23",
              "referenceAmount": "2",
              "referenceDescription": "Steamed potatoes: 2 medium potatoes = 190 g",
              "referenceGrams": 190.0,
              "derivation": "referenceGrams / referenceAmount",
              "factor": 1,
              "alternateRecord": true,
              "snapshotSha256": "74868cf7442b4fec26228021e2df1b86febc4b9e29b83cafe0bd9677957f593f"
            }
          }
        },
        {
          "id": "chun-4",
          "title": "把現有材料配成一餐",
          "type": "decision",
          "skill": "planning",
          "context": "回到原本的米飯晚餐計劃：已有米、雞蛋、紅蘿蔔及剛買的西蘭花。成人負責煮食。目標是使用現有材料，有穀物、蛋類及蔬菜。",
          "prompt": "選一個可行方案，再選理由。",
          "options": [
            {
              "id": "a",
              "text": "白飯＋蒸蛋＋西蘭花",
              "correct": true,
              "feedback": "使用現有材料並符合類別條件。",
              "foods": [
                "carb_001",
                "egg_001",
                "veg_002"
              ]
            },
            {
              "id": "b",
              "text": "白飯＋熟雞蛋＋紅蘿蔔",
              "correct": true,
              "feedback": "也是可用現有材料完成的方案。",
              "foods": [
                "carb_001",
                "egg_001",
                "veg_004"
              ]
            },
            {
              "id": "c",
              "text": "再買大包主食，只因正在打折",
              "correct": false,
              "feedback": "沒有先使用現有米，也未回應欠缺材料。",
              "foods": []
            },
            {
              "id": "d",
              "text": "只煮雞蛋和蔬菜，不安排穀物",
              "correct": false,
              "feedback": "欠缺本關要求的穀物。",
              "foods": []
            }
          ],
          "reasons": [
            {
              "id": "r1",
              "text": "先用現有材料，配搭齊全，按人數及食量取用",
              "correct": true,
              "feedback": "回應預算、惜食及配搭。",
              "foods": []
            },
            {
              "id": "r2",
              "text": "現有材料不論狀態都要吃完",
              "correct": false,
              "feedback": "惜食仍須以食品安全為前提。",
              "foods": []
            },
            {
              "id": "r3",
              "text": "買得愈多就代表準備得愈好",
              "correct": false,
              "feedback": "需要按實際用量和保存安排。",
              "foods": []
            }
          ],
          "explanation": "菜式可不同，合理使用現有食材並安排份量，才是本關重點。",
          "hint": "找出可用材料，再核對三類配搭。",
          "sourceIds": [
            "healthy",
            "leftovers"
          ],
          "pedia": "protein"
        }
      ],
      "extra": [],
      "minutes": "約6–8分鐘"
    },
    {
      "id": "lok",
      "name": "樂樂",
      "age": 10,
      "title": "和家人準備明天的便當",
      "icon": "🍱",
      "goal": "讀取時間及保存條件，安排可安全處理的材料。",
      "profile": [
        "由家長負責煮食、冷卻、冷藏及翻熱",
        "不靠外觀或氣味判斷剩食是否安全",
        "學習保存決策與份量縮放"
      ],
      "tasks": [
        {
          "id": "lok-1",
          "title": "先問哪兩項保存資料",
          "type": "multi",
          "skill": "safety",
          "context": "一盒熟飯看起來正常，但樂樂不知道是否可以用作明天便當。",
          "prompt": "先核對哪兩項資料？",
          "options": [
            {
              "id": "a",
              "text": "煮好後在室溫放了多久、何時冷藏",
              "correct": true,
              "feedback": "時間及溫度直接影響處理判斷。",
              "foods": []
            },
            {
              "id": "b",
              "text": "冷藏多久、期間有沒有妥善保存及已翻熱幾次",
              "correct": true,
              "feedback": "不能只看盒子外觀。",
              "foods": []
            },
            {
              "id": "c",
              "text": "飯盒標示的份量及每份熱量",
              "correct": false,
              "feedback": "這些資料有助份量比較，不能回答本題的保存安全問題。",
              "foods": []
            },
            {
              "id": "d",
              "text": "只聞一下是否有怪味",
              "correct": false,
              "feedback": "沒有異味不代表保存安全。",
              "foods": []
            }
          ],
          "reasons": [],
          "explanation": "資料不足時請成人核對，不能把「看起來正常」當作安全證明。",
          "hint": "食物安全要看時間、溫度及處理過程。",
          "sourceIds": [
            "leftovers",
            "safety"
          ],
          "pedia": "carbohydrate",
          "choose": 2
        },
        {
          "id": "lok-2",
          "title": "五小時的新資料",
          "type": "decision",
          "skill": "safety",
          "context": "已確認：熟飯煮好後，在約25°C室溫放了5小時，期間沒有冷藏或保溫。",
          "prompt": "應怎樣處理？再選理由。",
          "options": [
            {
              "id": "a",
              "text": "棄掉這盒飯，改用可安全處理的材料",
              "correct": true,
              "feedback": "在室溫多於4小時，不能留作便當。",
              "foods": []
            },
            {
              "id": "b",
              "text": "現在放進雪櫃，明天就一定安全",
              "correct": false,
              "feedback": "之後冷藏不能消除之前不當保存的問題。",
              "foods": []
            },
            {
              "id": "c",
              "text": "只要翻熱一次便保證安全",
              "correct": false,
              "feedback": "不能把翻熱當作挽救不當保存食物的保證。",
              "foods": []
            },
            {
              "id": "d",
              "text": "只挑看起來正常的部分",
              "correct": false,
              "feedback": "不能靠外觀挑出安全部分。",
              "foods": []
            }
          ],
          "reasons": [
            {
              "id": "r1",
              "text": "熟飯在危險溫度範圍逗留多於4小時",
              "correct": true,
              "feedback": "根據題目已提供的時間及溫度作判斷。",
              "foods": []
            },
            {
              "id": "r2",
              "text": "所有隔餐食物都必須棄掉",
              "correct": false,
              "feedback": "要按實際保存情況判斷，不能一概而論。",
              "foods": []
            },
            {
              "id": "r3",
              "text": "因為飯不甜，所以容易變壞",
              "correct": false,
              "feedback": "這不是本題的判斷依據。",
              "foods": []
            }
          ],
          "explanation": "食安中心的2小時／4小時法則指出：食物在4–60°C多於4小時應棄掉。本題是5小時、25°C。",
          "hint": "核對時間是否超過4小時，以及是否一直妥善保溫或冷藏。",
          "sourceIds": [
            "leftovers"
          ],
          "pedia": "carbohydrate"
        },
        {
          "id": "lok-3",
          "title": "改煮新食物",
          "type": "multi",
          "skill": "safety",
          "context": "新資訊：家長改為煮新食物作明天便當，並已安排全程合適的冷藏及運送條件。",
          "prompt": "準備時，選出兩項正確安排。",
          "options": [
            {
              "id": "a",
              "text": "先取明天所需部分，用清潔淺容器分裝並盡快冷卻",
              "correct": true,
              "feedback": "分小份及清潔容器有助安排迅速冷卻。",
              "foods": []
            },
            {
              "id": "b",
              "text": "煮好後2小時內放入雪櫃；進食前由成人徹底翻熱",
              "correct": true,
              "feedback": "按安全溫度及翻熱安排處理。",
              "foods": []
            },
            {
              "id": "c",
              "text": "放到翌朝才冷藏，較能避免雪櫃受熱",
              "correct": false,
              "feedback": "不應為等待完全放涼而長時間放室溫。",
              "foods": []
            },
            {
              "id": "d",
              "text": "每日反覆翻熱同一盒多次，直到吃完",
              "correct": false,
              "feedback": "剩食不應翻熱超過一次。",
              "foods": []
            }
          ],
          "reasons": [],
          "explanation": "冷卻、冷藏、運送及翻熱都須妥善安排；缺少其中資料便要先請成人確認。",
          "hint": "選能盡快冷卻及控制時間溫度的做法。",
          "sourceIds": [
            "leftovers",
            "safety"
          ],
          "pedia": "water",
          "choose": 2,
          "newInformation": true
        },
        {
          "id": "lok-4",
          "title": "兩個便當怎樣分",
          "type": "portion",
          "skill": "portion",
          "context": "份量練習：原配方是4個便當合共4隻同款大型去殼雞蛋，另有飯和蔬菜。現在做2個便當，保持原配方每盒相同蛋量。",
          "prompt": "合共需要多少隻雞蛋？",
          "options": [],
          "reasons": [],
          "explanation": "每盒原本1隻；兩盒合共2隻。所有蛋及其他材料由成人煮熟，並按已確認的保存和運送安排處理。",
          "hint": "先算每盒用量，再乘2盒。",
          "sourceIds": [
            "label",
            "safety"
          ],
          "pedia": "protein",
          "foodCode": "egg_001",
          "guideIndex": 0,
          "unit": "隻大型去殼雞蛋",
          "target": 2,
          "defaultInput": 4,
          "fromPeople": 4,
          "toPeople": 2,
          "originalQuantity": 4,
          "measure": {
            "id": "usda-egg_001-0",
            "label": "隻（大型，去殼）",
            "gramsPerUnit": 50.0,
            "source": {
              "provider": "USDA FoodData Central",
              "foodRecordId": "171287",
              "foodDescription": "Egg, whole, raw, fresh",
              "release": "2018-04",
              "url": "https://fdc.nal.usda.gov/download-datasets/",
              "referenceAmount": "1",
              "referenceDescription": "large",
              "referenceGrams": 50.0,
              "measureUnitId": "9999",
              "portionIndex": 0,
              "derivation": "referenceGrams / referenceAmount",
              "alternateRecord": false
            }
          }
        }
      ],
      "extra": [],
      "minutes": "約6–8分鐘"
    }
  ]
};
