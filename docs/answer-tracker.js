console.log("answer-tracker.js loaded");

// Submitボタンが押されたときの処理
document.addEventListener("click", function (event) {
  const submitBtn = event.target.closest("button.button-cta.check");
  if (!submitBtn) return;

  // 対応するクイズ全体を取得
  const quizEl = submitBtn.closest(".quiz");
  if (!quizEl) {
    console.warn("❌ .quiz 要素が見つかりません");
    return;
  }

  // 選択された選択肢を取得
  const selectedChoice = quizEl.querySelector("label.choice.active");
  if (!selectedChoice) {
    console.warn("❌ 選択肢が選ばれていません");
    return;
  }

  // 問題文を取得
  const question = quizEl.querySelector(".title.content > p")?.innerText.trim() ?? "Unknown question";

  // 回答内容を取得（改行などをまとめて1行に）
  const answer = selectedChoice.innerText.trim().replace(/\s+/g, " ");

  // 正誤をクラスで判定
  const correct =
    selectedChoice.classList.contains("correct") ? true :
    selectedChoice.classList.contains("incorrect") ? false :
    null;

  console.log("✅ 送信準備OK:", { question, answer, correct });

  // Google Apps Script にフォーム送信
  sendViaForm(question, answer, correct);
});

// CORSを回避してGASにデータ送信する関数
function sendViaForm(question, answer, correct) {
  // 1. 非表示 iframe を作る（1回だけ作られるようにする）
  let iframe = document.getElementById("submission-target");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.name = "submission-target";
    iframe.id = "submission-target";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  }

  // 2. フォームを作成
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://script.google.com/macros/s/AKfycbyDDvFIXyIIhAR0Df1LTtkxtAimh3MEFZmofvWBbTqJedYkJ4nNgKG1nnVFwZvbh7nV/exec";
  form.target = "submission-target"; // ← 遷移先を iframe に！

  // 3. hidden フィールド追加
  const addInput = (name, value) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  };
  addInput("question", question);
  addInput("answer", answer);
  addInput("correct", correct);

  form.style.display = "none";
  document.body.appendChild(form);
  form.submit();
}


