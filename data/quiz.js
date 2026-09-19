/* ==========================================================================
   性格測驗：十題，計分對應角色
   scores 內的鍵為角色 id，值為該選項給予的分數。
   ========================================================================== */

window.CHIIKAWA_QUIZ = {
  intro: '十條問題，每題揀一個最接近你的反應。測驗以角色的行為模式為依據，結果會連到對應的人生參照建議。沒有好壞之分，只有不同的應對方式。',
  results: ['chiikawa', 'hachiware', 'usagi', 'momonga', 'kurimanju', 'rakko', 'shisa', 'furuhonya'],
  questions: [
    {
      q: '一件重要的事失敗了，你的第一個反應係？',
      options: [
        { text: '好難過，可能會喊，但過後照樣會再試一次。', scores: { chiikawa: 3, shisa: 1 } },
        { text: '先搞清楚問題出喺邊，把它拆成可以處理的部分。', scores: { hachiware: 3, rakko: 1 } },
        { text: '唔當一回事，去食餐勁嘅，下次再算。', scores: { usagi: 3, kurimanju: 2 } },
        { text: '會想搵人講，想有人知道我而家好唔開心。', scores: { momonga: 3, hachiware: 1 } }
      ]
    },
    {
      q: '朋友情緒低落，你通常會？',
      options: [
        { text: '唔出聲，但會留喺附近，等佢想講先講。', scores: { chiikawa: 2, furuhonya: 3 } },
        { text: '主動行埋去，先安撫佢，再同佢諗下一步。', scores: { hachiware: 3 } },
        { text: '直接拉佢去做啲別嘅——行街、食嘢、打波。', scores: { usagi: 3 } },
        { text: '整啲嘢俾佢，或者幫佢搞掂手上件事。', scores: { shisa: 2, kurimanju: 1, rakko: 2 } }
      ]
    },
    {
      q: '揀工作或科目嘅時候，你最睇重？',
      options: [
        { text: '穩陣、做得到、唔好太大風險。', scores: { chiikawa: 3, furuhonya: 1 } },
        { text: '有無嘢可以學到、有無師傅可以跟。', scores: { shisa: 3, hachiware: 1 } },
        { text: '有無得做到最好、有無得證明自己實力。', scores: { rakko: 3 } },
        { text: '做完之後有無自己嘅時間。', scores: { kurimanju: 3, furuhonya: 2 } }
      ]
    },
    {
      q: '喺一個新群體入面，你通常係？',
      options: [
        { text: '靜靜哋觀察，慢慢先熟。', scores: { furuhonya: 3, chiikawa: 2 } },
        { text: '主動同人傾偈，幫手搞氣氛。', scores: { hachiware: 3 } },
        { text: '憑心情，鍾意就好熱情，唔鍾意就唔理。', scores: { usagi: 3, momonga: 1 } },
        { text: '想快啲有人記得我，會主動做啲嘢刷存在感。', scores: { momonga: 3 } }
      ]
    },
    {
      q: '你點樣睇「休息」呢件事？',
      options: [
        { text: '休息要理直氣壯，收咗工就唔好再諗返工嘅嘢。', scores: { kurimanju: 3 } },
        { text: '休息嗰陣都會諗住下一步點做。', scores: { rakko: 2, shisa: 2 } },
        { text: '休息即係食嘢同瞓覺，唔使諗咁多。', scores: { usagi: 3 } },
        { text: '成日覺得自己休息得太多，會有啲罪惡感。', scores: { chiikawa: 3 } }
      ]
    },
    {
      q: '一份禮物對你嚟講，重要嘅係？',
      options: [
        { text: '係邊個送、當時發生過咩事。', scores: { hachiware: 3, furuhonya: 2 } },
        { text: '實不實用、用唔用得着。', scores: { rakko: 1, shisa: 2, kurimanju: 1 } },
        { text: '好唔好食、好唔好玩。', scores: { usagi: 3 } },
        { text: '送嗰個人有無用心諗過我。', scores: { momonga: 3, chiikawa: 1 } }
      ]
    },
    {
      q: '面對一個明顯強過自己好多嘅對手，你會？',
      options: [
        { text: '驚，手會震，但最後都會出手。', scores: { chiikawa: 3 } },
        { text: '諗清楚點打先有機會，再決定。', scores: { hachiware: 2, rakko: 2 } },
        { text: '唔諗咁多，衝先算。', scores: { usagi: 3 } },
        { text: '避開，唔啱自己嘅仗唔使打。', scores: { furuhonya: 2, kurimanju: 2 } }
      ]
    },
    {
      q: '你比較接近邊種學習方式？',
      options: [
        { text: '要人教、有規矩、一步步嚟。', scores: { shisa: 3 } },
        { text: '自己邊做邊摸索，跌親咗先學識。', scores: { usagi: 2, chiikawa: 2 } },
        { text: '要先搞清楚整件事嘅原理先開始。', scores: { hachiware: 3 } },
        { text: '學自己真係有興趣嗰啲，唔使有用。', scores: { kurimanju: 2, furuhonya: 2 } }
      ]
    },
    {
      q: '你最唔鍾意自己邊一點？',
      options: [
        { text: '成日覺得自己唔夠好。', scores: { chiikawa: 3 } },
        { text: '成日顧住人哋，自己嘅嘢無人知。', scores: { hachiware: 3 } },
        { text: '太衝動，成日闖禍。', scores: { usagi: 3 } },
        { text: '太想人注意自己。', scores: { momonga: 3 } }
      ]
    },
    {
      q: '如果知道咗一個講出嚟會傷害好多人嘅真相，你會？',
      options: [
        { text: '唔講，自己收埋，即使好辛苦。', scores: { chiikawa: 3, furuhonya: 1 } },
        { text: '會搵一個信得過嘅人傾，再決定點做。', scores: { hachiware: 3 } },
        { text: '直接講出嚟，唔講唔舒服。', scores: { usagi: 2, momonga: 2 } },
        { text: '睇情況，衡量講同唔講邊樣代價細啲。', scores: { rakko: 2, kurimanju: 2, shisa: 1 } }
      ]
    }
  ],
  /* 各角色的結果描述 */
  verdicts: {
    chiikawa: {
      headline: '你係「明知會驚，都照樣行出去」嗰種人。',
      body: '你嘅標準定得高，所以達唔到嗰陣特別難受。你好少遷怒別人，通常把責任攬晒上身。你嘅強項唔係天賦，而係被打低之後仍然願意再排一次隊——呢樣嘢比你想像中罕有。要留意嘅係：高標準值得保留，但如果無相應嘅自我肯定機制，佢只會變成長期自我消耗。',
      domain: 'emotion'
    },
    hachiware: {
      headline: '你係大家嘅定海針，但你自己嗰把針邊個扶？',
      body: '你習慣先穩住場面、再諗解決方法，而且好識得把混亂嘅處境命名，令佢變得可以應對。你嘅樂觀唔係天真，而係一種選擇。要留意嘅係：長期擔任支柱角色嘅人，情緒容易無處可去。有意識咁安排一兩個可以示弱嘅場合，唔係軟弱，係續航嘅必要條件。',
      domain: 'friendship'
    },
    usagi: {
      headline: '你唔多解釋，但每次真係要出手嗰陣你都喺度。',
      body: '你行動先於思考，因此製造過唔少麻煩，但亦因此救過唔少場。你係全場最少內耗嘅人——呢一點喺一個人人都喺度自我懷疑嘅世界裡面，相當珍貴。要留意嘅係：分辨手上嘅決定可唔可逆。可逆嘅就快啲做，不可逆嘅先值得諗清楚。',
      domain: 'work'
    },
    momonga: {
      headline: '你想要嘅可能唔係感情，而係被望住。',
      body: '你唔會等人主動關心你，你會直接開口要。呢種做法社交上容易惹反感，但背後嘅邏輯好清楚：你唔相信自己唔開口就會被記得。要留意嘅係：注視可以靠表演換取，感情唔可以。試吓建立一段唔使表現嘅關係，即使只有一個人——嗰個係最有效嘅緩衝。',
      domain: 'emotion'
    },
    kurimanju: {
      headline: '你識得收工，而且理直氣壯。',
      body: '你把勞動同享受切得好開，喺一個人人焦慮排名同資格嘅環境裡面，呢種切割能力係稀有資源。你唔係無追求，你只係把追求放喺自己真正在乎嘅事上面。要留意嘅係：喺以成就衡量價值嘅環境裡，選擇唔參賽需要持續嘅意志力，而且會被誤解為不上進。',
      domain: 'work'
    },
    rakko: {
      headline: '你做得好，而且肯教。',
      body: '你嘅地位來自實力，但你嘅影響力來自願意傳授。你唔需要靠貶低別人嚟確認自己嘅位置——呢一點比實力本身更難得。要留意嘅係：長期處於被仰望嘅位置，好少人會問你自己點。記得留一個可以唔做強者嘅空間。',
      domain: 'work'
    },
    shisa: {
      headline: '你揀咗一條慢但有真本事嘅路。',
      body: '你唔怕捱、肯跟規矩、識得搵師傅。而且你識得把努力轉換成制度承認嘅憑據——呢一步好多勤力嘅人都漏咗。要留意嘅係：分清「被要求高」同「被否定」。能夠把批評解讀為技術回饋而非人身評價嘅人，喺高要求環境入面會行得遠好多。',
      domain: 'study'
    },
    furuhonya: {
      headline: '你唔出聲，但你記得住所有重要嘅嘢。',
      body: '你安靜、內斂，喺人多嘅場合唔急於表態。你唔跟主流路徑，寧願喺邊緣建立一個小而可控嘅位置。你對關係嘅重視方式好特別：重要嘅唔係件嘢有無用，而係佢由邊個嚟。要留意嘅係：安靜唔等於無需要。你都需要有人主動問你一句。',
      domain: 'friendship'
    }
  }
};
