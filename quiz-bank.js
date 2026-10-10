/* V2.1：營養、惜食及生活應用；教學數據均為自擬。 */
window.NutritionQuizBank = [
  {
    "id": "concept-01",
    "topic": "concept",
    "level": 1,
    "prompt": "小晴說：「飯有碳水化合物，所以飯的碳水化合物全部都是糖。」哪個修正最準確？",
    "options": [
      {
        "text": "碳水化合物包括糖和澱粉等",
        "feedback": "糖只屬於碳水化合物的一部分。",
        "correct": true
      },
      {
        "text": "碳水化合物只包括澱粉",
        "feedback": "糖也屬於碳水化合物。",
        "correct": false
      },
      {
        "text": "只有甜味食物才有碳水化合物",
        "feedback": "不甜的飯也含有澱粉。",
        "correct": false
      },
      {
        "text": "飯的碳水化合物就是膳食纖維",
        "feedback": "白飯的碳水化合物並非全部是纖維。",
        "correct": false
      }
    ],
    "explanation": "不能把碳水化合物數字直接當作糖的數字。",
    "hint": "想想白飯不甜，卻含有哪一種營養成分。",
    "source": "label",
    "table": null
  },
  {
    "id": "concept-02",
    "topic": "concept",
    "level": 1,
    "prompt": "一盒食品列出蛋白質、脂肪和碳水化合物。這表示甚麼？",
    "options": [
      {
        "text": "同一種食品可含多種營養素",
        "feedback": "食物分類不表示只含一種營養素。",
        "correct": true
      },
      {
        "text": "食品一定由三種食材混合而成",
        "feedback": "單一食材也能含多種營養素。",
        "correct": false
      },
      {
        "text": "三項數字應該完全相同",
        "feedback": "不同營養素的含量不必相等。",
        "correct": false
      },
      {
        "text": "只能選最多的一項計入餐盤",
        "feedback": "應按實際含量計算每一項。",
        "correct": false
      }
    ],
    "explanation": "同一食物可同時提供不同營養素。",
    "hint": "食物類別與營養素不是一對一的關係。",
    "source": "label",
    "table": null
  },
  {
    "id": "concept-03",
    "topic": "concept",
    "level": 1,
    "prompt": "同學把熱量、蛋白質和脂肪都寫成「克」。哪項需要修改？",
    "options": [
      {
        "text": "熱量改用千卡，另外兩項可用克",
        "feedback": "千卡表示能量，克表示質量。",
        "correct": true
      },
      {
        "text": "蛋白質改用千卡，其餘用克",
        "feedback": "蛋白質含量以質量表示。",
        "correct": false
      },
      {
        "text": "脂肪改用千卡，其餘用克",
        "feedback": "脂肪含量與它提供的能量是不同數字。",
        "correct": false
      },
      {
        "text": "三項一起改用毫升",
        "feedback": "毫升量度體積，不能直接代替這些單位。",
        "correct": false
      }
    ],
    "explanation": "比較數字前先核對單位：能量與營養素質量不同。",
    "hint": "哪一項表示能量，而不是物質的質量？",
    "source": "label",
    "table": null
  },
  {
    "id": "concept-04",
    "topic": "concept",
    "level": 1,
    "prompt": "營養標示只列「鈉 200 毫克」。可以直接寫成「鹽 200 毫克」嗎？",
    "options": [
      {
        "text": "不可以，鈉與食鹽不是同一項",
        "feedback": "鈉是食鹽的成分之一，也可能來自其他成分。",
        "correct": true
      },
      {
        "text": "可以，只要保留毫克單位",
        "feedback": "相同單位不代表相同物質。",
        "correct": false
      },
      {
        "text": "可以，但必須改寫成糖分",
        "feedback": "糖和鈉也不是同一項。",
        "correct": false
      },
      {
        "text": "可以，只要這食品吃起來鹹",
        "feedback": "味覺不能把鈉含量直接變成鹽含量。",
        "correct": false
      }
    ],
    "explanation": "鈉與食鹽不同；讀營養標示時要按正確名稱比較，不能直接把兩個數字當成相同。",
    "hint": "食鹽除了鈉，還包含其他成分。",
    "source": "label",
    "table": null
  },
  {
    "id": "concept-05",
    "topic": "concept",
    "level": 2,
    "prompt": "比較兩款餅乾時，小朗只看脂肪較低，就說它整體一定較適合自己。還需要做甚麼？",
    "options": [
      {
        "text": "核對相同份量，再看糖、鈉及實際食量",
        "feedback": "一項營養較低不足以作整體判斷。",
        "correct": true
      },
      {
        "text": "改為只比較包裝上的熱量",
        "feedback": "只看另一個單項仍然不足。",
        "correct": false
      },
      {
        "text": "改為只比較餅乾的大小",
        "feedback": "大小不能代替營養資料和食量。",
        "correct": false
      },
      {
        "text": "選較低脂的一款後增加一倍份量",
        "feedback": "吃得更多會改變實際攝取量。",
        "correct": false
      }
    ],
    "explanation": "比較食品要結合多項資料與實際份量。",
    "hint": "先想「每多少克」，再想「自己吃多少」。",
    "source": "label",
    "table": null
  },
  {
    "id": "concept-06",
    "topic": "concept",
    "level": 2,
    "prompt": "一款穀物食品每 100 克有 60 克碳水化合物，其中糖 8 克。計算碳水化合物時應用哪個數字？",
    "options": [
      {
        "text": "60 克",
        "feedback": "糖已包含在這個碳水化合物數字內。",
        "correct": true
      },
      {
        "text": "68 克",
        "feedback": "再加糖會重複計算。",
        "correct": false
      },
      {
        "text": "52 克",
        "feedback": "扣糖得到的不是總碳水化合物數字。",
        "correct": false
      },
      {
        "text": "8 克",
        "feedback": "這只表示糖，不是所有碳水化合物。",
        "correct": false
      }
    ],
    "explanation": "同一標示中的糖是碳水化合物的一部分，不應再加一次。",
    "hint": "題目中的「其中」表示包含關係。",
    "source": "label",
    "table": null
  },
  {
    "id": "concept-07",
    "topic": "concept",
    "level": 2,
    "prompt": "食品標示「總脂肪 10 克、飽和脂肪 3 克」。小組應把脂肪總量記成多少？",
    "options": [
      {
        "text": "10 克",
        "feedback": "飽和脂肪已包含在總脂肪內。",
        "correct": true
      },
      {
        "text": "13 克",
        "feedback": "把部分再加到總量會重複計算。",
        "correct": false
      },
      {
        "text": "7 克",
        "feedback": "扣除飽和脂肪後不再是總脂肪。",
        "correct": false
      },
      {
        "text": "3 克",
        "feedback": "這只是一類脂肪的含量。",
        "correct": false
      }
    ],
    "explanation": "總量與其中一部分不能相加作新總量。",
    "hint": "先找標示中寫着「總」的數字。",
    "source": "label",
    "table": null
  },
  {
    "id": "concept-08",
    "topic": "concept",
    "level": 2,
    "prompt": "早餐常吃白麵包，小欣想增加膳食纖維。哪項改動最直接？",
    "options": [
      {
        "text": "改選纖維含量較高的全麥麵包",
        "feedback": "以標示確認纖維較高，可以直接作替換。",
        "correct": true
      },
      {
        "text": "在原有麵包多塗牛油",
        "feedback": "增加牛油不能達到增加纖維的目的。",
        "correct": false
      },
      {
        "text": "在原有麵包多塗蜜糖",
        "feedback": "蜜糖並非增加膳食纖維的合適方法。",
        "correct": false
      },
      {
        "text": "把同一片麵包切成更多小塊",
        "feedback": "切法不會增加原本的纖維總量。",
        "correct": false
      }
    ],
    "explanation": "增加纖維可由全穀物、蔬菜、水果及豆類着手。",
    "hint": "想想哪個選擇改變了食物本身的纖維含量。",
    "source": "fibre",
    "table": null
  },
  {
    "id": "concept-09",
    "topic": "concept",
    "level": 3,
    "prompt": "小朗想午餐吃得均衡，打算把飯和菜都換成雞胸肉。哪個建議較合適？",
    "options": [
      {
        "text": "保留適量飯菜，與雞肉一起配搭",
        "feedback": "均衡飲食需要不同食物類別。",
        "correct": true
      },
      {
        "text": "保留雞肉和飯，蔬菜留待有空才吃",
        "feedback": "仍然忽略了蔬菜在這餐的角色。",
        "correct": false
      },
      {
        "text": "把雞肉換成魚，飯菜仍全部省去",
        "feedback": "只換蛋白質食物沒有改善類別不足。",
        "correct": false
      },
      {
        "text": "只吃雞肉，但分成三碟上桌",
        "feedback": "改變擺盤不會增加食物種類。",
        "correct": false
      }
    ],
    "explanation": "蛋白質重要，但不能取代其他食物提供的不同營養。",
    "hint": "不要只看某一項營養，看看餐中有哪些食物類別。",
    "source": "healthy",
    "table": null
  },
  {
    "id": "concept-10",
    "topic": "concept",
    "level": 3,
    "prompt": "兩份餐的熱量相同。哪個推論最可靠？",
    "options": [
      {
        "text": "熱量相同，其他營養仍可能不同",
        "feedback": "相同能量可以由不同食材配搭提供。",
        "correct": true
      },
      {
        "text": "蛋白質和纖維必定一樣",
        "feedback": "相同熱量沒有保證每項營養相同。",
        "correct": false
      },
      {
        "text": "兩份餐的食材重量必定一樣",
        "feedback": "食材的每克能量可能不同。",
        "correct": false
      },
      {
        "text": "兩份餐必定同樣適合每個人",
        "feedback": "還需考慮配搭、份量和個人情況。",
        "correct": false
      }
    ],
    "explanation": "不能由一項相同，推論全部相同。",
    "hint": "有哪些資料是題目沒有提供的？",
    "source": "logic",
    "table": null
  },
  {
    "id": "concept-11",
    "topic": "concept",
    "level": 3,
    "prompt": "兩款飲品同樣是 200 毫升：甲含鈣 240 毫克，乙含鈣 40 毫克。若只比較這一杯提供的鈣，哪個判斷正確？",
    "options": [
      {
        "text": "甲較多，但不能單憑鈣判斷全部營養",
        "feedback": "鈣是其中一項營養，還可比較其他項目。",
        "correct": true
      },
      {
        "text": "乙較多，因為數字較小較容易吸收",
        "feedback": "題目沒有提供吸收率，而且乙的鈣較少。",
        "correct": false
      },
      {
        "text": "兩款相同，因為容量相同",
        "feedback": "容量相同不代表營養含量相同。",
        "correct": false
      },
      {
        "text": "甲較多，所以可以完全代替正餐",
        "feedback": "鈣較多不代表能提供一餐所有需要。",
        "correct": false
      }
    ],
    "explanation": "選擇飲品時可以比較鈣含量，同時留意整體營養及份量。",
    "hint": "題目只要求比較哪一項營養？",
    "source": "label",
    "table": null
  },
  {
    "id": "concept-12",
    "topic": "concept",
    "level": 3,
    "prompt": "小晴午餐每天只吃同一種食物，認為「吃夠分量就有齊營養」。哪個回應最合理？",
    "options": [
      {
        "text": "應配搭不同類別食物，補充不同營養",
        "feedback": "單靠加大同一食物的份量，未必能兼顧營養。",
        "correct": true
      },
      {
        "text": "只要份量更大，就不必增加種類",
        "feedback": "總量增加沒有解決種類單一。",
        "correct": false
      },
      {
        "text": "把同一食物用不同碟盛，就算多樣化",
        "feedback": "器皿不同不代表食物不同。",
        "correct": false
      },
      {
        "text": "只要選自己最喜歡的食物就足夠",
        "feedback": "喜好可以考慮，但不能代替營養配搭。",
        "correct": false
      }
    ],
    "explanation": "均衡飲食同時考慮種類與份量。",
    "hint": "不同食物的營養是否完全相同？",
    "source": "healthy",
    "table": null
  },
  {
    "id": "label-01",
    "topic": "label",
    "level": 1,
    "prompt": "兩款飲品的包裝大小不同。要比較哪款每相同體積含糖較少，先看哪欄？",
    "options": [
      {
        "text": "每 100 毫升糖含量",
        "feedback": "共同基準可以公平比較。",
        "correct": true
      },
      {
        "text": "整瓶糖含量，不理容量",
        "feedback": "瓶子大小不同會影響總量。",
        "correct": false
      },
      {
        "text": "每瓶售價",
        "feedback": "價錢不是糖含量。",
        "correct": false
      },
      {
        "text": "營養表中最大的數字",
        "feedback": "不同項目和單位不能直接比較。",
        "correct": false
      }
    ],
    "explanation": "比較濃度用相同體積；計算喝下多少則看實際飲用量。",
    "hint": "題目要比較的是「相同體積」。",
    "source": "label",
    "table": null
  },
  {
    "id": "label-02",
    "topic": "label",
    "level": 1,
    "prompt": "一包餅乾有 2 份，每份熱量 120 千卡。吃完整包是多少？",
    "options": [
      {
        "text": "240 千卡",
        "feedback": "120 × 2 = 240。",
        "correct": true
      },
      {
        "text": "120 千卡",
        "feedback": "這只是一份的熱量。",
        "correct": false
      },
      {
        "text": "60 千卡",
        "feedback": "整包有兩份，應乘而不是除。",
        "correct": false
      },
      {
        "text": "122 千卡",
        "feedback": "份數是倍數，不是額外千卡。",
        "correct": false
      }
    ],
    "explanation": "每份數字要乘實際吃下的份數。",
    "hint": "整包相當於多少個「每份」？",
    "source": "label",
    "table": null
  },
  {
    "id": "label-03",
    "topic": "label",
    "level": 1,
    "prompt": "每 100 克含蛋白質 8 克，吃 50 克同款食品可得多少蛋白質？",
    "options": [
      {
        "text": "4 克",
        "feedback": "50 克是 100 克的一半，8 ÷ 2 = 4。",
        "correct": true
      },
      {
        "text": "8 克",
        "feedback": "這是吃 100 克的份量。",
        "correct": false
      },
      {
        "text": "16 克",
        "feedback": "食量減半，不能把營養翻倍。",
        "correct": false
      },
      {
        "text": "50 克",
        "feedback": "50 克是食品重量，不是蛋白質重量。",
        "correct": false
      }
    ],
    "explanation": "同一食品的營養量隨食用份量按比例改變。",
    "hint": "50 克是標示基準的幾分之一？",
    "source": "label",
    "table": null
  },
  {
    "id": "label-04",
    "topic": "label",
    "level": 1,
    "prompt": "標示寫「每份 30 克」，包裝淨重 90 克。整包有幾份？",
    "options": [
      {
        "text": "3 份",
        "feedback": "90 ÷ 30 = 3。",
        "correct": true
      },
      {
        "text": "1 份",
        "feedback": "一包不一定等於一份。",
        "correct": false
      },
      {
        "text": "30 份",
        "feedback": "30 是每份克數。",
        "correct": false
      },
      {
        "text": "60 份",
        "feedback": "份數要用總重除每份重量。",
        "correct": false
      }
    ],
    "explanation": "先分清一包、每份和每 100 克。",
    "hint": "總重量中有多少個 30 克？",
    "source": "label",
    "table": null
  },
  {
    "id": "label-05",
    "topic": "label",
    "level": 2,
    "prompt": "飲品每 100 毫升含糖 6 克，飲了 250 毫升。攝取糖多少克？",
    "options": [
      {
        "text": "15 克",
        "feedback": "6 × 2.5 = 15。",
        "correct": true
      },
      {
        "text": "6 克",
        "feedback": "只計了一個 100 毫升。",
        "correct": false
      },
      {
        "text": "12 克",
        "feedback": "只計了 200 毫升，漏了 50 毫升。",
        "correct": false
      },
      {
        "text": "24 克",
        "feedback": "250 毫升不是四個 100 毫升。",
        "correct": false
      }
    ],
    "explanation": "先把實際容量除以 100，再乘標示數字。",
    "hint": "250 毫升是 100 毫升的 2.5 倍。",
    "source": "label",
    "table": null
  },
  {
    "id": "label-06",
    "topic": "label",
    "level": 2,
    "prompt": "根據下表，按相同重量比較，哪款食品的鈉較少？",
    "options": [
      {
        "text": "甲，乙換算後是每 100 克 480 毫克",
        "feedback": "120 × 4 = 480，甲的 400 較低。",
        "correct": true
      },
      {
        "text": "乙，因為 120 小於 400",
        "feedback": "兩個數字原本的食物重量不同。",
        "correct": false
      },
      {
        "text": "相同，因為都是用毫克表示",
        "feedback": "單位相同還要核對食物基準。",
        "correct": false
      },
      {
        "text": "不能比較，因為一款用每份",
        "feedback": "已知每份重量，就可以換算。",
        "correct": false
      }
    ],
    "explanation": "把每份轉成共同重量，再比較鈉。",
    "hint": "100 克含有幾份 25 克？",
    "source": "label",
    "table": {
      "headers": [
        "食品",
        "標示基準",
        "鈉"
      ],
      "rows": [
        [
          "甲",
          "每 100 克",
          "400 毫克"
        ],
        [
          "乙",
          "每份 25 克",
          "120 毫克"
        ]
      ]
    }
  },
  {
    "id": "label-07",
    "topic": "label",
    "level": 2,
    "prompt": "甲每 100 克含脂肪 10 克，吃 20 克；乙每 100 克含脂肪 6 克，吃 50 克。哪次吃到較少脂肪？",
    "options": [
      {
        "text": "吃甲：2 克，乙是 3 克",
        "feedback": "10 × 0.2 = 2；6 × 0.5 = 3。",
        "correct": true
      },
      {
        "text": "吃乙：因為每 100 克數字較低",
        "feedback": "實際攝取量也受食用重量影響。",
        "correct": false
      },
      {
        "text": "兩次一樣，因為都是小食",
        "feedback": "食品類別不能代替計算。",
        "correct": false
      },
      {
        "text": "吃甲：10 克，乙是 6 克",
        "feedback": "這些是每 100 克，並非實際食量。",
        "correct": false
      }
    ],
    "explanation": "食品濃度較低，不代表吃下的總量一定較低。",
    "hint": "兩款實際吃了不同重量。",
    "source": "label",
    "table": null
  },
  {
    "id": "label-08",
    "topic": "label",
    "level": 2,
    "prompt": "一碗湯含鈉 300 毫克。用了半份含鈉 400 毫克的調味包，總共多少？",
    "options": [
      {
        "text": "500 毫克",
        "feedback": "300 + 400 ÷ 2 = 500。",
        "correct": true
      },
      {
        "text": "700 毫克",
        "feedback": "這是加了整份調味包。",
        "correct": false
      },
      {
        "text": "350 毫克",
        "feedback": "不應把整碗湯的鈉也減半。",
        "correct": false
      },
      {
        "text": "200 毫克",
        "feedback": "漏計了原本湯中的鈉。",
        "correct": false
      }
    ],
    "explanation": "分開計算原本材料和實際加入的調味料。",
    "hint": "只有調味包用了一半。",
    "source": "label",
    "table": null
  },
  {
    "id": "label-09",
    "topic": "label",
    "level": 3,
    "prompt": "根據下表，比較相同重量，哪款食品的纖維較多？",
    "options": [
      {
        "text": "乙：每 100 克 8 克；甲是 7.5 克",
        "feedback": "3 ÷ 40 × 100 = 7.5；2 ÷ 25 × 100 = 8。",
        "correct": true
      },
      {
        "text": "甲：每份 3 克大於 2 克",
        "feedback": "兩款每份重量不同。",
        "correct": false
      },
      {
        "text": "兩款相同：都有列纖維",
        "feedback": "有列出不代表含量相同。",
        "correct": false
      },
      {
        "text": "甲：40 克大於 25 克",
        "feedback": "每份較重不是纖維濃度較高的證據。",
        "correct": false
      }
    ],
    "explanation": "比較每份之前，要核對一份有多大。",
    "hint": "可先換成每 100 克再比較。",
    "source": "label",
    "table": {
      "headers": [
        "食品",
        "每份重量",
        "每份纖維"
      ],
      "rows": [
        [
          "甲",
          "40 克",
          "3 克"
        ],
        [
          "乙",
          "25 克",
          "2 克"
        ]
      ]
    }
  },
  {
    "id": "label-10",
    "topic": "label",
    "level": 3,
    "prompt": "一包零食有 3 份，每份糖 4 克。兩人平均分完整包，每人攝取多少糖？",
    "options": [
      {
        "text": "6 克",
        "feedback": "全包 3 × 4 = 12 克；每人 12 ÷ 2 = 6 克。",
        "correct": true
      },
      {
        "text": "2 克",
        "feedback": "只把一份分給兩人，漏計另外兩份。",
        "correct": false
      },
      {
        "text": "4 克",
        "feedback": "每人吃了 1.5 份，不是一份。",
        "correct": false
      },
      {
        "text": "12 克",
        "feedback": "這是全包，未平均分給兩人。",
        "correct": false
      }
    ],
    "explanation": "先算全包，再按人數分配。",
    "hint": "每人吃了全包的一半，不是每份的一半。",
    "source": "label",
    "table": null
  },
  {
    "id": "label-11",
    "topic": "label",
    "level": 3,
    "prompt": "根據下表，哪個說法同時正確？",
    "options": [
      {
        "text": "喝完整瓶甲糖較少；每 100 毫升乙糖較少",
        "feedback": "總量是 8 與 9；濃度是 4 與 3。",
        "correct": true
      },
      {
        "text": "喝完整瓶乙糖較少；每 100 毫升甲糖較少",
        "feedback": "兩個比較方向都相反。",
        "correct": false
      },
      {
        "text": "兩種比較都是甲糖較少",
        "feedback": "甲全瓶較少，但每 100 毫升較多。",
        "correct": false
      },
      {
        "text": "兩種比較都是乙糖較少",
        "feedback": "乙濃度較低，但全瓶總糖較多。",
        "correct": false
      }
    ],
    "explanation": "「整瓶總量」與「相同容量」可以得出不同排序。",
    "hint": "分別算 8 ÷ 2 和 9 ÷ 3。",
    "source": "label",
    "table": {
      "headers": [
        "飲品",
        "整瓶容量",
        "整瓶糖"
      ],
      "rows": [
        [
          "甲",
          "200 毫升",
          "8 克"
        ],
        [
          "乙",
          "300 毫升",
          "9 克"
        ]
      ]
    }
  },
  {
    "id": "label-12",
    "topic": "label",
    "level": 3,
    "prompt": "根據下表，哪個結論有數據支持？",
    "options": [
      {
        "text": "甲糖較少，乙鈉較少，要按比較目的判斷",
        "feedback": "兩項數據各有不同排序。",
        "correct": true
      },
      {
        "text": "甲兩項都較少，所以一定選甲",
        "feedback": "甲的鈉較多。",
        "correct": false
      },
      {
        "text": "乙兩項都較少，所以一定選乙",
        "feedback": "乙的糖較多。",
        "correct": false
      },
      {
        "text": "把糖和鈉數字相加，較小的一款較好",
        "feedback": "不同物質及單位不能如此相加評分。",
        "correct": false
      }
    ],
    "explanation": "多項營養資料不一定指向同一款食品。",
    "hint": "先逐項比較，不要合併不同單位。",
    "source": "label",
    "table": {
      "headers": [
        "食品（每 100 克）",
        "糖",
        "鈉"
      ],
      "rows": [
        [
          "甲",
          "4 克",
          "500 毫克"
        ],
        [
          "乙",
          "8 克",
          "200 毫克"
        ]
      ]
    }
  },
  {
    "id": "plate-01",
    "topic": "plate",
    "level": 1,
    "prompt": "午餐已有飯和雞肉。想先補齊「穀物、蔬菜、肉及代替品」三類，應加甚麼？",
    "options": [
      {
        "text": "一份蔬菜",
        "feedback": "目前欠缺蔬菜類。",
        "correct": true
      },
      {
        "text": "一份麵條",
        "feedback": "麵條仍屬穀物類。",
        "correct": false
      },
      {
        "text": "一份豆腐",
        "feedback": "豆腐屬肉及代替品一類。",
        "correct": false
      },
      {
        "text": "一隻雞蛋",
        "feedback": "雞蛋也屬肉及代替品一類。",
        "correct": false
      }
    ],
    "explanation": "先檢查餐盤已有甚麼類別，再補缺少的一類。",
    "hint": "飯和雞肉分別屬於哪一類？",
    "source": "plate",
    "table": null
  },
  {
    "id": "plate-02",
    "topic": "plate",
    "level": 1,
    "prompt": "老師示範「午膳 321」：穀物、蔬菜、肉及代替品的 3：2：1 指甚麼？",
    "options": [
      {
        "text": "三類食物在餐盤的大約體積比例",
        "feedback": "321 是餐盤配搭的體積概念。",
        "correct": true
      },
      {
        "text": "三類食物必須相同重量",
        "feedback": "體積比例不是相同重量。",
        "correct": false
      },
      {
        "text": "碳水、蛋白質、脂肪的克數比例",
        "feedback": "食物類別與營養素不是同一組比例。",
        "correct": false
      },
      {
        "text": "每餐固定吃三碗飯兩碗菜一碗肉",
        "feedback": "比例不是固定碗數。",
        "correct": false
      }
    ],
    "explanation": "321 用於食物體積配搭，不能直接轉成營養克數。",
    "hint": "留意「食物類別」和「營養素」的分別。",
    "source": "plate",
    "table": null
  },
  {
    "id": "plate-03",
    "topic": "plate",
    "level": 1,
    "prompt": "素食餐已有飯和蔬菜，想補上肉類代替品。哪個選擇最符合這個目的？",
    "options": [
      {
        "text": "豆腐",
        "feedback": "豆腐屬肉及代替品類。",
        "correct": true
      },
      {
        "text": "薯仔",
        "feedback": "薯仔主要作穀物類選擇。",
        "correct": false
      },
      {
        "text": "冬瓜",
        "feedback": "冬瓜屬蔬菜類。",
        "correct": false
      },
      {
        "text": "蘋果",
        "feedback": "蘋果屬水果類。",
        "correct": false
      }
    ],
    "explanation": "以豆製品作肉類代替品，可以讓配搭更多元。",
    "hint": "找出豆製品，而不是再增加飯菜同類。",
    "source": "plate",
    "table": null
  },
  {
    "id": "plate-04",
    "topic": "plate",
    "level": 1,
    "prompt": "一家四口準備晚餐，不清楚大家會吃多少。哪個做法較能兼顧食量和惜食？",
    "options": [
      {
        "text": "先問各人食量，適量準備，盛飯時可少量添取",
        "feedback": "事前了解需要及彈性添取可減少吃不完。",
        "correct": true
      },
      {
        "text": "每人固定盛滿最大的一碗",
        "feedback": "不一定配合不同人的食量。",
        "correct": false
      },
      {
        "text": "按食量最大的人乘四準備",
        "feedback": "可能高估其他人的需要。",
        "correct": false
      },
      {
        "text": "先煮雙倍，剩多少再決定",
        "feedback": "容易在未有安排下煮多。",
        "correct": false
      }
    ],
    "explanation": "人數相同，實際食量仍可能不同；先了解需要。",
    "hint": "想想能否在開始煮之前減少煮多的機會。",
    "source": "logic",
    "table": null
  },
  {
    "id": "plate-05",
    "topic": "plate",
    "level": 2,
    "prompt": "餐盤分六個相同體積格，已有三格飯、一格菜、兩格肉。按 321 示範，應怎樣調整？",
    "options": [
      {
        "text": "把一格肉換成一格菜",
        "feedback": "變成三格飯、兩格菜、一格肉。",
        "correct": true
      },
      {
        "text": "把一格飯換成一格肉",
        "feedback": "會變成兩格飯、一格菜、三格肉。",
        "correct": false
      },
      {
        "text": "把一格菜換成一格飯",
        "feedback": "會沒有蔬菜。",
        "correct": false
      },
      {
        "text": "把一格飯換成一格菜",
        "feedback": "會變成兩格飯、兩格菜、兩格肉。",
        "correct": false
      }
    ],
    "explanation": "對照每一類目標比例，找最直接的一步。",
    "hint": "目前哪類多一格，哪類少一格？",
    "source": "plate",
    "table": null
  },
  {
    "id": "plate-06",
    "topic": "plate",
    "level": 2,
    "prompt": "同樣重的飯、菜、肉各放 100 克，是否已證明符合體積 321？",
    "options": [
      {
        "text": "未能證明，重量相同不表示體積符合比例",
        "feedback": "不同食物的相同重量可佔不同體積。",
        "correct": true
      },
      {
        "text": "已符合，因為一共三種食物",
        "feedback": "三種類別齊全不等於比例符合。",
        "correct": false
      },
      {
        "text": "已符合，因為各有一百克",
        "feedback": "重量相同不能證明體積是 321。",
        "correct": false
      },
      {
        "text": "未符合，因為所有餐盤都必須重 600 克",
        "feedback": "沒有這個固定總重條件。",
        "correct": false
      }
    ],
    "explanation": "用重量計營養，與用體積觀察配搭，是兩種不同用途。",
    "hint": "題目的比例量度哪一種量？",
    "source": "plate",
    "table": null
  },
  {
    "id": "plate-07",
    "topic": "plate",
    "level": 2,
    "prompt": "小欣不太喜歡蔬菜，但願意試新做法。哪個午餐安排最能逐步增加蔬菜？",
    "options": [
      {
        "text": "先加入少量她願意試的菜，再逐步增加種類",
        "feedback": "從可接受的份量與做法開始較容易實行。",
        "correct": true
      },
      {
        "text": "把菜減成零，改用果汁代替",
        "feedback": "果汁不能直接取代餐中的蔬菜。",
        "correct": false
      },
      {
        "text": "只多加飯，維持完全沒有菜",
        "feedback": "沒有改善缺少蔬菜的配搭。",
        "correct": false
      },
      {
        "text": "每次盛很多不喜歡的菜，吃剩便丟掉",
        "feedback": "未配合接受程度，亦容易浪費。",
        "correct": false
      }
    ],
    "explanation": "改善飲食可以逐步嘗試，同時留意能吃完的份量。",
    "hint": "選一個既有蔬菜、又能逐步做到的方法。",
    "source": "plate",
    "table": null
  },
  {
    "id": "plate-08",
    "topic": "plate",
    "level": 2,
    "prompt": "小組準備豆腐蔬菜飯，想保留調味又減少額外用油。哪個做法最直接？",
    "options": [
      {
        "text": "量好適量油再煮，避免一邊煮一邊隨意加",
        "feedback": "量度可以知道實際用量並避免不知不覺加多。",
        "correct": true
      },
      {
        "text": "換成另一款油，但用量加倍",
        "feedback": "油的名稱改變不代表可以多用。",
        "correct": false
      },
      {
        "text": "油先加足，再靠多放菜抵消",
        "feedback": "蔬菜不會抵消已加入的油。",
        "correct": false
      },
      {
        "text": "油不量度，只看成品有沒有光澤",
        "feedback": "外觀不能準確反映用油量。",
        "correct": false
      }
    ],
    "explanation": "控制調味料可從量度實際份量開始。",
    "hint": "哪個做法直接控制了加入多少？",
    "source": "plate",
    "table": null
  },
  {
    "id": "plate-09",
    "topic": "plate",
    "level": 3,
    "prompt": "三人平均分一道菜：全份有蛋白質 36 克、纖維 9 克。每人是多少？",
    "options": [
      {
        "text": "蛋白質 12 克、纖維 3 克",
        "feedback": "兩項各自除以三。",
        "correct": true
      },
      {
        "text": "蛋白質 36 克、纖維 9 克",
        "feedback": "這是整道菜的總量。",
        "correct": false
      },
      {
        "text": "蛋白質 12 克、纖維 9 克",
        "feedback": "只把蛋白質分了三份。",
        "correct": false
      },
      {
        "text": "蛋白質 108 克、纖維 27 克",
        "feedback": "應除以人數，不是乘。",
        "correct": false
      }
    ],
    "explanation": "每一項營養都需按同一人份換算。",
    "hint": "不要只處理其中一個數字。",
    "source": "logic",
    "table": null
  },
  {
    "id": "plate-10",
    "topic": "plate",
    "level": 3,
    "prompt": "學生說：「我加多了菜，纖維上升，所以整餐熱量一定下降。」哪個回應最準確？",
    "options": [
      {
        "text": "要看有沒有換走其他材料，單純加菜未必降熱量",
        "feedback": "增加一種材料不等於減少整餐能量。",
        "correct": true
      },
      {
        "text": "一定下降，因為纖維和熱量互相抵消",
        "feedback": "兩者不能互相抵消。",
        "correct": false
      },
      {
        "text": "一定不變，因為蔬菜沒有熱量",
        "feedback": "蔬菜並非一律零熱量。",
        "correct": false
      },
      {
        "text": "一定翻倍，因為食材種類增加",
        "feedback": "種類數目不能決定熱量倍數。",
        "correct": false
      }
    ],
    "explanation": "「加入」和「替換」會產生不同結果，要看實際份量。",
    "hint": "原本食物有沒有減少？",
    "source": "logic",
    "table": null
  },
  {
    "id": "plate-11",
    "topic": "plate",
    "level": 3,
    "prompt": "午餐想減少醬汁帶來的鈉，但仍保留飯、菜和肉。哪個點餐方式較合適？",
    "options": [
      {
        "text": "請店員醬汁另上，需要時少量添加",
        "feedback": "可以控制實際吃下的醬汁份量。",
        "correct": true
      },
      {
        "text": "把醬汁全倒進飯，再多加一碗飯",
        "feedback": "沒有減少吃下的醬汁。",
        "correct": false
      },
      {
        "text": "把醬汁換個小碗，但仍全部喝完",
        "feedback": "容器變小沒有改變攝取量。",
        "correct": false
      },
      {
        "text": "不吃蔬菜，只保留原有醬汁和肉",
        "feedback": "減少蔬菜沒有達到少吃醬汁的目的。",
        "correct": false
      }
    ],
    "explanation": "留意調味料的用量，也保留完整的食物配搭。",
    "hint": "題目要減少的是哪一部分？",
    "source": "plate",
    "table": null
  },
  {
    "id": "plate-12",
    "topic": "plate",
    "level": 3,
    "prompt": "甲加 50 克菜；乙把 50 克肉換成 50 克菜。兩人纖維都增加，能否說熱量變化必定一樣？",
    "options": [
      {
        "text": "不能，乙同時減少了肉，甲沒有",
        "feedback": "兩個操作改變的材料不同。",
        "correct": true
      },
      {
        "text": "可以，因為兩人加菜重量相同",
        "feedback": "沒有計及乙移除的肉。",
        "correct": false
      },
      {
        "text": "可以，因為餐盤都有菜",
        "feedback": "類別相同不能證明變化相同。",
        "correct": false
      },
      {
        "text": "不能，因為蔬菜不能計算營養",
        "feedback": "蔬菜可以按資料與份量估算營養。",
        "correct": false
      }
    ],
    "explanation": "描述改餐盤的方法時，要同時記錄加入和移除的材料。",
    "hint": "比較兩個操作中「被移除」的部分。",
    "source": "logic",
    "table": null
  },
  {
    "id": "daily-01",
    "topic": "daily",
    "level": 1,
    "prompt": "課間口渴，想補水而不增加糖。哪個選擇最直接？",
    "options": [
      {
        "text": "清水",
        "feedback": "清水不含糖，適合作日常補水選擇。",
        "correct": true
      },
      {
        "text": "加蜜糖的溫水",
        "feedback": "蜜糖會帶來糖。",
        "correct": false
      },
      {
        "text": "普通含糖檸檬茶",
        "feedback": "含糖飲品會增加糖攝取。",
        "correct": false
      },
      {
        "text": "加糖的果味飲品",
        "feedback": "果味並不表示沒有糖。",
        "correct": false
      }
    ],
    "explanation": "飲品名稱或香味不能代替糖含量；日常補水可選清水。",
    "hint": "先想哪款沒有加入糖或含糖材料。",
    "source": "sugar",
    "table": null
  },
  {
    "id": "daily-02",
    "topic": "daily",
    "level": 1,
    "prompt": "媽媽準備早餐，想有穀物、水果及奶類。哪份配搭符合這三類？",
    "options": [
      {
        "text": "麥片、香蕉和原味奶",
        "feedback": "包含題目指定的三類食物。",
        "correct": true
      },
      {
        "text": "麵包、麥片和原味奶",
        "feedback": "兩項是穀物，欠水果。",
        "correct": false
      },
      {
        "text": "麵包、香蕉和蘋果",
        "feedback": "有穀物及水果，欠奶類。",
        "correct": false
      },
      {
        "text": "原味奶、香蕉和蘋果",
        "feedback": "有奶類及水果，欠穀物。",
        "correct": false
      }
    ],
    "explanation": "看配搭時應分清食物類別，不只數有多少樣。",
    "hint": "三樣食物不一定代表三個不同類別。",
    "source": "healthy",
    "table": null
  },
  {
    "id": "daily-03",
    "topic": "daily",
    "level": 1,
    "prompt": "外出前想帶一份水果小食，也避免吃不完。哪個安排較合適？",
    "options": [
      {
        "text": "帶一份自己能吃完、妥善保存的水果",
        "feedback": "兼顧水果選擇、份量與保存。",
        "correct": true
      },
      {
        "text": "帶一大盒，多帶的到時再丟掉",
        "feedback": "預先帶過量容易造成浪費。",
        "correct": false
      },
      {
        "text": "只帶水果味糖果，當作水果",
        "feedback": "水果味不等於一份水果。",
        "correct": false
      },
      {
        "text": "只帶果醬，當作完整水果",
        "feedback": "果醬不能直接當作完整水果小食。",
        "correct": false
      }
    ],
    "explanation": "小食也可以按需要準備，避免將水果味食品當作水果。",
    "hint": "同時考慮「是甚麼」與「帶多少」。",
    "source": "snack",
    "table": null
  },
  {
    "id": "daily-04",
    "topic": "daily",
    "level": 1,
    "prompt": "吃自助餐時，看到很多想試的菜。哪個做法最有助減少浪費？",
    "options": [
      {
        "text": "先少量取想試的菜，吃完有需要再添",
        "feedback": "可以按實際食量調整。",
        "correct": true
      },
      {
        "text": "每道菜先取一大份，免得再排隊",
        "feedback": "容易取多過能吃完的量。",
        "correct": false
      },
      {
        "text": "先取滿一碟，不喜歡再換另一碟",
        "feedback": "會造成取走卻不吃的食物浪費。",
        "correct": false
      },
      {
        "text": "只看碟有沒有裝滿來決定取多少",
        "feedback": "碟大小不能代表食量。",
        "correct": false
      }
    ],
    "explanation": "先試小份，喜歡而且仍有需要才添取。",
    "hint": "是否一定要一次取足所有食物？",
    "source": "logic",
    "table": null
  },
  {
    "id": "daily-05",
    "topic": "daily",
    "level": 2,
    "prompt": "一款果汁寫「不添加糖」。小朗認為可以不看糖含量。哪個回應較準確？",
    "options": [
      {
        "text": "仍要看標示，果汁本身也可能含糖",
        "feedback": "沒有額外添加不代表沒有天然存在的糖。",
        "correct": true
      },
      {
        "text": "不用看，這等於每瓶零糖",
        "feedback": "把不添加糖誤當無糖。",
        "correct": false
      },
      {
        "text": "只要加冰，就不用看糖含量",
        "feedback": "加冰不會移除原有糖。",
        "correct": false
      },
      {
        "text": "只要是水果製成，喝多少都一樣",
        "feedback": "份量仍影響攝取量。",
        "correct": false
      }
    ],
    "explanation": "「不添加糖」與「沒有糖」不同，還要留意飲用份量。",
    "hint": "想想材料本身是否可能有糖。",
    "source": "sugar",
    "table": null
  },
  {
    "id": "daily-06",
    "topic": "daily",
    "level": 2,
    "prompt": "煮即食麵時想少用調味粉，哪個做法最直接減少加入的調味粉總量？",
    "options": [
      {
        "text": "少放部分調味粉，其餘不加入",
        "feedback": "真正減少了加入的調味粉。",
        "correct": true
      },
      {
        "text": "全包放入，再加一倍清水",
        "feedback": "只稀釋濃度，調味粉總量沒有減少。",
        "correct": false
      },
      {
        "text": "全包放入，把湯分成兩個碗喝完",
        "feedback": "全部喝完仍攝取原本總量。",
        "correct": false
      },
      {
        "text": "全包放入，改用更大的湯碗",
        "feedback": "容器大小不會減少總量。",
        "correct": false
      }
    ],
    "explanation": "減少用量與加水稀釋是兩回事。",
    "hint": "題目問總量，不是味道濃淡。",
    "source": "logic",
    "table": null
  },
  {
    "id": "daily-07",
    "topic": "daily",
    "level": 2,
    "prompt": "想在同樣大小的三文治加入更多蔬菜，哪個替換最符合目的？",
    "options": [
      {
        "text": "把部分午餐肉換成番茄和生菜",
        "feedback": "增加蔬菜，同時取代部分原有餡料。",
        "correct": true
      },
      {
        "text": "把原有午餐肉切薄，但全部仍放入",
        "feedback": "切薄沒有增加蔬菜。",
        "correct": false
      },
      {
        "text": "把番茄醬加厚，其他餡料不變",
        "feedback": "多加醬料不等於加入一份蔬菜。",
        "correct": false
      },
      {
        "text": "把麵包烘脆，餡料保持不變",
        "feedback": "烘脆不會增加蔬菜。",
        "correct": false
      }
    ],
    "explanation": "改善配搭可用蔬菜替換部分餡料。",
    "hint": "哪個方案真正加入了蔬菜食材？",
    "source": "plate",
    "table": null
  },
  {
    "id": "daily-08",
    "topic": "daily",
    "level": 2,
    "prompt": "一壺飲品加入 20 克糖，加水後分成四杯並全部喝完。小組合共喝了多少糖？",
    "options": [
      {
        "text": "20 克",
        "feedback": "只加水而沒有移走糖，總糖仍是 20 克。",
        "correct": true
      },
      {
        "text": "5 克",
        "feedback": "5 克是每杯平均量，不是四杯合共量。",
        "correct": false
      },
      {
        "text": "10 克",
        "feedback": "加水沒有把糖總量減半。",
        "correct": false
      },
      {
        "text": "80 克",
        "feedback": "分成四杯不會把原本的糖變成四倍。",
        "correct": false
      }
    ],
    "explanation": "稀釋會令每口較淡，但整壺糖總量不變。",
    "hint": "題目問整組喝完的總量。",
    "source": "logic",
    "table": null
  },
  {
    "id": "daily-09",
    "topic": "daily",
    "level": 3,
    "prompt": "同款餅乾小包 40 克售 8 元，大包 120 克售 18 元。今天只需要 40 克，也無法妥善保存餘下部分。哪個決定較合適？",
    "options": [
      {
        "text": "買小包，雖然單價較高，但符合用量",
        "feedback": "大包多出的部分未有保存或食用安排。",
        "correct": true
      },
      {
        "text": "買大包，只因每克較便宜就一定划算",
        "feedback": "單價較低不代表沒有浪費。",
        "correct": false
      },
      {
        "text": "買大包，再把吃不完的 80 克丟掉",
        "feedback": "浪費多出的食品，也沒有節省所需開支。",
        "correct": false
      },
      {
        "text": "買大包，為免浪費而勉強吃完",
        "feedback": "不應為清貨而忽略實際食量。",
        "correct": false
      }
    ],
    "explanation": "購物同時看價格、用量與保存安排。",
    "hint": "題目限制了剩餘部分能否保存。",
    "source": "logic",
    "table": null
  },
  {
    "id": "daily-10",
    "topic": "daily",
    "level": 3,
    "prompt": "小欣想減少午餐的含糖飲品，但仍想吃水果。哪個替換較配合目的？",
    "options": [
      {
        "text": "把果味汽水換成清水，另吃適量完整水果",
        "feedback": "既減少含糖飲品，又保留完整水果。",
        "correct": true
      },
      {
        "text": "把果味汽水換成同容量含糖果味茶",
        "feedback": "未必減少糖，要看兩款含量。",
        "correct": false
      },
      {
        "text": "保留汽水，只把水果取消",
        "feedback": "沒有減少含糖飲品。",
        "correct": false
      },
      {
        "text": "汽水加水稀釋後全部喝完，再取消水果",
        "feedback": "原有糖仍喝下，而且少了水果。",
        "correct": false
      }
    ],
    "explanation": "完整水果與果味飲品不同；可分開安排飲水和吃水果。",
    "hint": "哪個做法同時做到題目兩個目標？",
    "source": "sugar",
    "table": null
  },
  {
    "id": "daily-11",
    "topic": "daily",
    "level": 3,
    "prompt": "一家三口本來預計吃四份飯，臨時只有兩人留家吃，另一天的飯量未確定。下鍋前最合理怎樣做？",
    "options": [
      {
        "text": "重新問兩人的食量，減少準備量",
        "feedback": "在烹調前按新需要調整，可減少煮多。",
        "correct": true
      },
      {
        "text": "照煮四份，因為原計劃已定",
        "feedback": "忽略人數和實際需要已改變。",
        "correct": false
      },
      {
        "text": "加煮成六份，方便之後再決定",
        "feedback": "在沒有安排下增加煮多風險。",
        "correct": false
      },
      {
        "text": "按飯煲容量盡量煮滿",
        "feedback": "器具容量不是實際需要。",
        "correct": false
      }
    ],
    "explanation": "人數或計劃改變時，份量也可以跟着調整。",
    "hint": "現在仍未下鍋，哪一步最容易改？",
    "source": "logic",
    "table": null
  },
  {
    "id": "daily-12",
    "topic": "daily",
    "level": 3,
    "prompt": "野餐後想把剩下的三文治帶回家。哪項資料最值得先確認？",
    "options": [
      {
        "text": "餡料、保存溫度，以及離開冷藏的累積時間",
        "feedback": "這些資料有助成人判斷能否安全保留。",
        "correct": true
      },
      {
        "text": "包裝是否漂亮，以及買入價錢",
        "feedback": "外觀與價格不能判定食物安全。",
        "correct": false
      },
      {
        "text": "同學是否喜歡，以及還剩多少個",
        "feedback": "喜好與數量不能代替保存資料。",
        "correct": false
      },
      {
        "text": "只聞有沒有異味，其他不用知道",
        "feedback": "沒有異味也不能證明安全。",
        "correct": false
      }
    ],
    "explanation": "打包前先考慮安全；不清楚保存情況時請成人協助判斷。",
    "hint": "哪組資料直接描述食物的保存條件？",
    "source": "leftovers",
    "table": null
  },
  {
    "id": "waste-01",
    "topic": "waste",
    "level": 1,
    "prompt": "雪櫃有兩盒同款食物，均安全及按標示保存，一盒較早到食用期限。一般先用哪盒？",
    "options": [
      {
        "text": "較早到期的一盒",
        "feedback": "先安排較早到期者，可減少放到過期。",
        "correct": true
      },
      {
        "text": "剛買回來的一盒",
        "feedback": "可能令較早到期者繼續被擱置。",
        "correct": false
      },
      {
        "text": "包裝較漂亮的一盒",
        "feedback": "外觀包裝與使用先後無直接關係。",
        "correct": false
      },
      {
        "text": "容量較大的一盒",
        "feedback": "容量不是題目中的優先條件。",
        "correct": false
      }
    ],
    "explanation": "先查看保存情況及日期，再安排使用次序。",
    "hint": "哪盒更需要及早安排？",
    "source": "logic",
    "table": null
  },
  {
    "id": "waste-02",
    "topic": "waste",
    "level": 1,
    "prompt": "買餸前想減少重複購買，哪一步最直接？",
    "options": [
      {
        "text": "先查家中存貨，再列所需份量",
        "feedback": "知道已有甚麼，才能決定要買多少。",
        "correct": true
      },
      {
        "text": "先列喜歡的菜名，到店才看存貨",
        "feedback": "仍未核對家中材料。",
        "correct": false
      },
      {
        "text": "把每種材料都多買一份",
        "feedback": "容易買超過實際需要。",
        "correct": false
      },
      {
        "text": "只選最便宜的包裝",
        "feedback": "價錢不能告訴你是否已經有同款。",
        "correct": false
      }
    ],
    "explanation": "購物清單應結合現有材料與預計食量。",
    "hint": "先掌握家中已有甚麼。",
    "source": "logic",
    "table": null
  },
  {
    "id": "waste-03",
    "topic": "waste",
    "level": 1,
    "prompt": "小組每次煮四人份都剩一大碗，下一次最值得先調整甚麼？",
    "options": [
      {
        "text": "記錄實際吃下的量，減少預備份量",
        "feedback": "可從源頭減少煮多。",
        "correct": true
      },
      {
        "text": "維持份量，把剩下的留待決定",
        "feedback": "沒有解決經常煮多的原因。",
        "correct": false
      },
      {
        "text": "改用更大的碗盛剩菜",
        "feedback": "容器不會減少多煮的量。",
        "correct": false
      },
      {
        "text": "要求每人吃完所有剩下的",
        "feedback": "食量應按需要，不應用勉強多吃處理。",
        "correct": false
      }
    ],
    "explanation": "惜食可以由適量採購及烹調開始。",
    "hint": "這個問題每次都出現，源頭在哪裏？",
    "source": "logic",
    "table": null
  },
  {
    "id": "waste-04",
    "topic": "waste",
    "level": 1,
    "prompt": "一條紅蘿蔔形狀彎曲，經成人確認新鮮、安全。哪個判斷最合理？",
    "options": [
      {
        "text": "按需要切好使用，不必因形狀丟掉",
        "feedback": "形狀不規則本身不是丟棄原因。",
        "correct": true
      },
      {
        "text": "只因形狀不同就當作變壞",
        "feedback": "題目已確認新鮮安全。",
        "correct": false
      },
      {
        "text": "必須多加調味才可使用",
        "feedback": "外形不同不表示需要額外調味。",
        "correct": false
      },
      {
        "text": "先買筆直的，這條繼續擺放",
        "feedback": "可能造成不必要購買及延誤使用。",
        "correct": false
      }
    ],
    "explanation": "外形與安全狀態要分開判斷。",
    "hint": "題目已提供哪些安全條件？",
    "source": "logic",
    "table": null
  },
  {
    "id": "waste-05",
    "topic": "waste",
    "level": 2,
    "prompt": "今天晚餐需要兩份菜，家中已有一份可用的菜。超市三份裝特價，但未計劃之後食用。先怎樣做？",
    "options": [
      {
        "text": "先按缺少的一份購買，再考慮能否用完特價裝",
        "feedback": "先核對需要，避免因優惠買多。",
        "correct": true
      },
      {
        "text": "買三份裝，再把家中一份擱置",
        "feedback": "未安排多出的份量。",
        "correct": false
      },
      {
        "text": "買兩份，因為晚餐需要兩份",
        "feedback": "漏計家中已有的一份。",
        "correct": false
      },
      {
        "text": "取消晚餐蔬菜，避免有剩",
        "feedback": "已有材料及需求，不必直接取消。",
        "correct": false
      }
    ],
    "explanation": "比較優惠時也要計及是否用得完。",
    "hint": "實際還欠多少份？",
    "source": "logic",
    "table": null
  },
  {
    "id": "waste-06",
    "topic": "waste",
    "level": 2,
    "prompt": "有一批煮熟食物預留下一餐，應如何處理？",
    "options": [
      {
        "text": "及早分裝淺容器冷卻，兩小時內冷藏",
        "feedback": "小份淺容器有助較快冷卻。",
        "correct": true
      },
      {
        "text": "放在枱上過夜，明早再冷藏",
        "feedback": "長時間室溫存放會增加風險。",
        "correct": false
      },
      {
        "text": "用厚毛巾包好，慢慢降溫",
        "feedback": "這會阻慢降溫。",
        "correct": false
      },
      {
        "text": "等下一餐前才開始冷藏",
        "feedback": "冷藏安排得太遲。",
        "correct": false
      }
    ],
    "explanation": "由成人協助及早分裝冷卻，兩小時內放入雪櫃。",
    "hint": "要減少食物在室溫放置的時間。",
    "source": "leftovers",
    "table": null
  },
  {
    "id": "waste-07",
    "topic": "waste",
    "level": 2,
    "prompt": "一盒熟食在室溫放了五小時。為了惜食，應怎樣處理？",
    "options": [
      {
        "text": "棄掉，不能靠再加熱補救這種存放",
        "feedback": "超過四小時的室溫剩食應丟棄。",
        "correct": true
      },
      {
        "text": "先聞一聞，沒有異味就吃",
        "feedback": "氣味不能可靠判斷安全。",
        "correct": false
      },
      {
        "text": "冷藏到明天再吃",
        "feedback": "冷藏不能消除先前不當存放的風險。",
        "correct": false
      },
      {
        "text": "加熱一次就一定安全",
        "feedback": "再加熱不能保證補救不當存放。",
        "correct": false
      }
    ],
    "explanation": "惜食不等於冒險吃不安全食物。",
    "hint": "題目給了存放時間，比氣味更重要。",
    "source": "leftovers",
    "table": null
  },
  {
    "id": "waste-08",
    "topic": "waste",
    "level": 2,
    "prompt": "生雞肉與即食沙律都要放雪櫃，哪個安排較合適？",
    "options": [
      {
        "text": "生雞肉密封放下層，沙律妥善包好放上層",
        "feedback": "可減少生肉汁液污染即食食物。",
        "correct": true
      },
      {
        "text": "生雞肉放上層，沙律放它下方",
        "feedback": "滴漏可能污染沙律。",
        "correct": false
      },
      {
        "text": "兩者放同一個未分隔容器",
        "feedback": "會增加交叉污染機會。",
        "correct": false
      },
      {
        "text": "把沙律放在生雞肉包裝下面承接滴水",
        "feedback": "不應讓即食食物接觸生肉汁液。",
        "correct": false
      }
    ],
    "explanation": "生熟分開，生肉放在即食或熟食下方。",
    "hint": "哪種擺法可避免肉汁滴到即食食物？",
    "source": "safety",
    "table": null
  },
  {
    "id": "waste-09",
    "topic": "waste",
    "level": 3,
    "prompt": "四人每人預計吃 150 克熟飯，家中有 200 克已確認安全可用的熟飯。還需準備多少熟飯？",
    "options": [
      {
        "text": "400 克",
        "feedback": "4 × 150 − 200 = 400。",
        "correct": true
      },
      {
        "text": "600 克",
        "feedback": "這是總需要，未扣已有的飯。",
        "correct": false
      },
      {
        "text": "800 克",
        "feedback": "把已有飯加到需求而不是扣除。",
        "correct": false
      },
      {
        "text": "200 克",
        "feedback": "已有的量不等於還欠的量。",
        "correct": false
      }
    ],
    "explanation": "先算總需求，再扣掉可用存貨；題目全部使用熟飯重量。",
    "hint": "四人合共需要多少？",
    "source": "logic",
    "table": null
  },
  {
    "id": "waste-10",
    "topic": "waste",
    "level": 3,
    "prompt": "家中有 6 隻蛋，兩日食譜合共需要 4 隻。優惠要再買 10 隻。未有其他用途，最合理決定是？",
    "options": [
      {
        "text": "先不買，用現有雞蛋完成計劃",
        "feedback": "存貨已足夠，還會剩兩隻。",
        "correct": true
      },
      {
        "text": "買優惠裝，因每隻價錢較低就一定省錢",
        "feedback": "未必用得完，不能只看單價。",
        "correct": false
      },
      {
        "text": "先丟掉舊蛋再買優惠裝",
        "feedback": "題目沒有說現有雞蛋不能食用。",
        "correct": false
      },
      {
        "text": "把食譜改成一定用完 16 隻蛋",
        "feedback": "不應只為清貨而忽略所需份量。",
        "correct": false
      }
    ],
    "explanation": "需要、存貨與能否用完，比優惠字眼更關鍵。",
    "hint": "把已有數量與需求相減。",
    "source": "logic",
    "table": null
  },
  {
    "id": "waste-11",
    "topic": "waste",
    "level": 3,
    "prompt": "熟食放在室溫約三小時，依兩小時／四小時原則，成人確認其他處理正常。應如何安排？",
    "options": [
      {
        "text": "立即食用，不能再冷藏留待下一餐",
        "feedback": "兩至四小時應立即食用，不宜留存。",
        "correct": true
      },
      {
        "text": "冷藏後明天再吃",
        "feedback": "超過兩小時不應再冷藏作日後食用。",
        "correct": false
      },
      {
        "text": "放到五小時後再決定",
        "feedback": "會超過四小時界線。",
        "correct": false
      },
      {
        "text": "只要加蓋便可繼續放室溫",
        "feedback": "加蓋沒有控制存放溫度。",
        "correct": false
      }
    ],
    "explanation": "時間累積會影響能否留存；不清楚時間或狀況時先請成人處理。",
    "hint": "分清「立即食用」與「留到下一餐」。",
    "source": "leftovers",
    "table": null
  },
  {
    "id": "waste-12",
    "topic": "waste",
    "level": 3,
    "prompt": "本星期兩次晚餐都剩下未吃完的蔬菜。想下星期改善，哪項做法最有幫助？",
    "options": [
      {
        "text": "記下剩多少和原因，再調整購買量或做法",
        "feedback": "可以針對份量過多或不喜歡的做法處理。",
        "correct": true
      },
      {
        "text": "下星期完全不買任何蔬菜",
        "feedback": "減少浪費仍需兼顧食物配搭。",
        "correct": false
      },
      {
        "text": "份量不變，只換更大的碟子",
        "feedback": "沒有處理吃剩的原因。",
        "correct": false
      },
      {
        "text": "每次都煮雙倍，再要求大家清碟",
        "feedback": "更容易超出需要。",
        "correct": false
      }
    ],
    "explanation": "從剩食找原因，再改善下次的採購和烹調。",
    "hint": "究竟是買太多，還是做法不合口味？",
    "source": "logic",
    "table": null
  },
  {
    "id": "recipe-01",
    "topic": "recipe",
    "level": 1,
    "prompt": "第一次跟食譜煮菜，材料寫「少許油」，你不清楚應用多少。怎樣做較妥當？",
    "options": [
      {
        "text": "先請成人確認適量份量，用量匙量好",
        "feedback": "讓新手知道實際加入多少。",
        "correct": true
      },
      {
        "text": "直接倒到鍋底很厚一層才開始",
        "feedback": "沒有按所需用量控制。",
        "correct": false
      },
      {
        "text": "每看一次步驟便再加一點",
        "feedback": "可能不知不覺加多。",
        "correct": false
      },
      {
        "text": "把整瓶油先倒出，再慢慢決定",
        "feedback": "不方便控制，也可能造成浪費。",
        "correct": false
      }
    ],
    "explanation": "不清楚份量時先確認，再量度加入。",
    "hint": "開始前把不清楚的指示問清楚。",
    "source": "logic",
    "table": null
  },
  {
    "id": "recipe-02",
    "topic": "recipe",
    "level": 1,
    "prompt": "食譜需要焗爐，但家中只有電飯煲和煮食爐。第一步應怎樣做？",
    "options": [
      {
        "text": "找有相應器具的做法，重新確認時間和步驟",
        "feedback": "器具改變可能需要改做法。",
        "correct": true
      },
      {
        "text": "只把「焗」字改成「蒸」，時間不變",
        "feedback": "不同烹調方法不能直接套同一時間。",
        "correct": false
      },
      {
        "text": "先買齊材料，到煮時才處理器具問題",
        "feedback": "可能買了卻無法按食譜製作。",
        "correct": false
      },
      {
        "text": "略過加熱步驟，直接上碟",
        "feedback": "不能為配合器具而省略必要煮熟步驟。",
        "correct": false
      }
    ],
    "explanation": "先確認器具，才能判斷食譜是否可行。",
    "hint": "改器具會連帶影響甚麼？",
    "source": "logic",
    "table": null
  },
  {
    "id": "recipe-03",
    "topic": "recipe",
    "level": 1,
    "prompt": "小學生需要切硬南瓜及用明火。食譜最應加入哪項安排？",
    "options": [
      {
        "text": "由成人處理或協助刀具和高溫步驟",
        "feedback": "把需要成人協助的工作寫清楚。",
        "correct": true
      },
      {
        "text": "只寫「小心」但不分配工作",
        "feedback": "沒有清楚指出誰負責較高風險步驟。",
        "correct": false
      },
      {
        "text": "先把火開大，再找成人協助",
        "feedback": "應事先安排協助。",
        "correct": false
      },
      {
        "text": "為節省時間同時切菜和看火",
        "feedback": "新手同時分心處理會增加風險。",
        "correct": false
      }
    ],
    "explanation": "可行食譜也要考慮使用者的能力與協助。",
    "hint": "不只是提醒，還要安排誰做。",
    "source": "safety",
    "table": null
  },
  {
    "id": "recipe-04",
    "topic": "recipe",
    "level": 1,
    "prompt": "照食譜買餸前，發現材料有雞蛋，但步驟沒提到用途。最好先怎樣做？",
    "options": [
      {
        "text": "確認是否需要雞蛋，再完成購物清單",
        "feedback": "避免買了卻沒有用途。",
        "correct": true
      },
      {
        "text": "多買幾隻，以防食譜還漏了材料",
        "feedback": "未釐清問題就增加購買量。",
        "correct": false
      },
      {
        "text": "先買回來，煮完不用就丟掉",
        "feedback": "會造成可避免的浪費。",
        "correct": false
      },
      {
        "text": "把雞蛋加在任何一步就算完成",
        "feedback": "未確認做法，可能影響食譜可行性。",
        "correct": false
      }
    ],
    "explanation": "買餸前核對材料與步驟，有助避免多買或漏買。",
    "hint": "哪一步可以在花錢購買之前完成？",
    "source": "logic",
    "table": null
  },
  {
    "id": "recipe-05",
    "topic": "recipe",
    "level": 2,
    "prompt": "兩人份食譜用米 100 克、豆腐 200 克。做同樣比例四人份，應用多少？",
    "options": [
      {
        "text": "米 200 克、豆腐 400 克",
        "feedback": "人數加倍，兩種材料都加倍。",
        "correct": true
      },
      {
        "text": "米 100 克、豆腐 200 克",
        "feedback": "仍是原本兩人份。",
        "correct": false
      },
      {
        "text": "米 200 克、豆腐 200 克",
        "feedback": "只把米加倍，比例改變了。",
        "correct": false
      },
      {
        "text": "米 400 克、豆腐 800 克",
        "feedback": "這是原本的四倍，足八人份。",
        "correct": false
      }
    ],
    "explanation": "先算人份倍數，再調整每項材料。",
    "hint": "四人是兩人的多少倍？",
    "source": "logic",
    "table": null
  },
  {
    "id": "recipe-06",
    "topic": "recipe",
    "level": 2,
    "prompt": "備料需 8 分鐘，之後煮 12 分鐘，最後上碟 3 分鐘；全部依次進行。至少需多少時間？",
    "options": [
      {
        "text": "23 分鐘",
        "feedback": "8 + 12 + 3 = 23。",
        "correct": true
      },
      {
        "text": "12 分鐘",
        "feedback": "只算烹調，漏了備料和上碟。",
        "correct": false
      },
      {
        "text": "20 分鐘",
        "feedback": "漏算上碟的三分鐘。",
        "correct": false
      },
      {
        "text": "15 分鐘",
        "feedback": "漏算備料的八分鐘。",
        "correct": false
      }
    ],
    "explanation": "總時間包括備料、烹調和完成工作。",
    "hint": "題目說步驟依次進行，沒有重疊。",
    "source": "logic",
    "table": null
  },
  {
    "id": "recipe-07",
    "topic": "recipe",
    "level": 2,
    "prompt": "煮菜前已量好 5 克油。家人提議改用另一款油，但仍維持相同用量。應怎樣做？",
    "options": [
      {
        "text": "另量 5 克新油，只用這一份",
        "feedback": "是替換原有油，不是兩份一起加。",
        "correct": true
      },
      {
        "text": "把兩款各 5 克一起放入",
        "feedback": "總用油會變成 10 克。",
        "correct": false
      },
      {
        "text": "換油後再按喜好多加一份",
        "feedback": "不再維持題目指定用量。",
        "correct": false
      },
      {
        "text": "把新油倒滿量杯，不看刻度",
        "feedback": "沒有按 5 克控制份量。",
        "correct": false
      }
    ],
    "explanation": "替換材料時，先分清是代替還是額外加入。",
    "hint": "題目有要求總用量維持多少？",
    "source": "logic",
    "table": null
  },
  {
    "id": "recipe-08",
    "topic": "recipe",
    "level": 2,
    "prompt": "食譜只有「煮至熟」。哪個修改最有助新手執行？",
    "options": [
      {
        "text": "補上火力、估計時間及檢查熟透的方法",
        "feedback": "時間和熟透檢查需要一起看。",
        "correct": true
      },
      {
        "text": "只加入一張成品照片",
        "feedback": "照片不能代替過程和熟透判斷。",
        "correct": false
      },
      {
        "text": "只把字體放大",
        "feedback": "較易閱讀，但沒有補足指示。",
        "correct": false
      },
      {
        "text": "只寫一個固定時間，不看材料大小",
        "feedback": "材料大小等會影響煮熟時間。",
        "correct": false
      }
    ],
    "explanation": "步驟要能操作，亦不能把固定時間當作熟透保證。",
    "hint": "新手還缺少哪些行動資訊？",
    "source": "safety",
    "table": null
  },
  {
    "id": "recipe-09",
    "topic": "recipe",
    "level": 3,
    "prompt": "食譜寫「熟飯 300 克」，家中只有生米。開始前最應確認甚麼？",
    "options": [
      {
        "text": "需要煮多少生米，煮熟後取所需熟飯",
        "feedback": "生米和熟飯重量不能直接等同。",
        "correct": true
      },
      {
        "text": "直接用 300 克生米代替",
        "feedback": "煮飯吸水後重量會改變。",
        "correct": false
      },
      {
        "text": "把 300 克生米改稱熟飯便可",
        "feedback": "改名稱不能改變食材狀態。",
        "correct": false
      },
      {
        "text": "一定用 150 克生米，不用查看做法",
        "feedback": "沒有足夠資料支持這個固定換算。",
        "correct": false
      }
    ],
    "explanation": "閱讀食譜時要留意生熟狀態，避免準備過量或不足。",
    "hint": "煮飯時加入的水會令重量怎樣變？",
    "source": "logic",
    "table": null
  },
  {
    "id": "recipe-10",
    "topic": "recipe",
    "level": 3,
    "prompt": "食譜可選 A：備料 10 分鐘後蒸 15 分鐘；B：備料 5 分鐘後焗 30 分鐘。只有蒸鍋、共 30 分鐘，哪個符合條件？",
    "options": [
      {
        "text": "A：器具吻合，合共 25 分鐘",
        "feedback": "10 + 15 = 25，且有蒸鍋。",
        "correct": true
      },
      {
        "text": "B：備料只需 5 分鐘",
        "feedback": "忽略焗的時間及欠焗爐。",
        "correct": false
      },
      {
        "text": "兩者都可：烹調時間都不超過 30 分鐘",
        "feedback": "要計總時間，亦要核對器具。",
        "correct": false
      },
      {
        "text": "兩者都不可：蒸煮一定超過半小時",
        "feedback": "A 按題目條件合共 25 分鐘。",
        "correct": false
      }
    ],
    "explanation": "可行性要同時符合時間和器具條件。",
    "hint": "逐一檢查所有限制。",
    "source": "logic",
    "table": null
  },
  {
    "id": "recipe-11",
    "topic": "recipe",
    "level": 3,
    "prompt": "原本四人份食譜用豆腐 400 克、紅蘿蔔 200 克。現在只做一半份量，材料應怎樣準備？",
    "options": [
      {
        "text": "豆腐 200 克、紅蘿蔔 100 克",
        "feedback": "兩項都減半，保持原本比例。",
        "correct": true
      },
      {
        "text": "豆腐 200 克、紅蘿蔔 200 克",
        "feedback": "只把豆腐減半，沒有把全份食譜減半。",
        "correct": false
      },
      {
        "text": "豆腐 100 克、紅蘿蔔 50 克",
        "feedback": "這是原本四分之一。",
        "correct": false
      },
      {
        "text": "豆腐 800 克、紅蘿蔔 400 克",
        "feedback": "這是加倍，不是減半。",
        "correct": false
      }
    ],
    "explanation": "按需要縮小食譜時，每項材料都要相應調整。",
    "hint": "每個原本用量分成兩份。",
    "source": "logic",
    "table": null
  },
  {
    "id": "recipe-12",
    "topic": "recipe",
    "level": 3,
    "prompt": "學生對花生敏感，但準備使用的食譜含花生碎。煮食前應怎樣處理？",
    "options": [
      {
        "text": "先停用這份食譜，請成人確認合適替代",
        "feedback": "飲食限制必須先處理，不能只看營養分數。",
        "correct": true
      },
      {
        "text": "減到一半份量即可照用",
        "feedback": "減量不能保證避免過敏反應。",
        "correct": false
      },
      {
        "text": "磨成粉後混入就可使用",
        "feedback": "改形狀不會消除過敏原。",
        "correct": false
      },
      {
        "text": "只挑走看得見的花生碎，其他照吃",
        "feedback": "已接觸花生的食物仍可能有致敏物。",
        "correct": false
      }
    ],
    "explanation": "煮食前要核對用餐者的食物敏感及材料成分；不能靠減少份量或磨碎來避免過敏。",
    "hint": "先確認用餐者能否安全吃這些材料。",
    "source": "allergy",
    "table": null
  }
];
