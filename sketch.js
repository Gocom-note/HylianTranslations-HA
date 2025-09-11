let mapping = [
  { file: "Hylia-A.svg", letter: "A" },
  { file: "Hylia-B.svg", letter: "B" },
  { file: "Hylia-C.svg", letter: "C" },
  { file: "Hylia-DG.svg", letter: "DG" },
  { file: "Hylia-EW.svg", letter: "EW" },
  { file: "Hylia-FR.svg", letter: "FR" },
  { file: "Hylia-H.svg", letter: "H" },
  { file: "Hylia-I.svg", letter: "I" },
  { file: "Hylia-JT.svg", letter: "JT" },
  { file: "Hylia-K.svg", letter: "K" },
  { file: "Hylia-L.svg", letter: "L" },
  { file: "Hylia-M.svg", letter: "M" },
  { file: "Hylia-N.svg", letter: "N" },
  { file: "Hylia-OZ.svg", letter: "OZ" },
  { file: "Hylia-P.svg", letter: "P" },
  { file: "Hylia-Q.svg", letter: "Q" },
  { file: "Hylia-S.svg", letter: "S" },
  { file: "Hylia-U.svg", letter: "U" },
  { file: "Hylia-V.svg", letter: "V" },
  { file: "Hylia-X.svg", letter: "X" },
  { file: "Hylia-Y.svg", letter: "Y" },
];

let imgs = {};
let lines = [[], [], [], []]; // 4行
let currentLine = 0;
let maxPerLine = 16;

function preload() {
  mapping.forEach((m) => {
    imgs[m.letter] = loadImage(m.file);
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, TOP);
}

function draw() {
  background(255);

  let margin = 10;
  let canvasWidth = width - 2 * margin;
  let lineHeight = ((height / 2 - 2 * margin) / 4) * 0.8; 
  textSize(lineHeight * 0.35);

  // ===== 上半分：文章描画 =====
  for (let i = 0; i < 4; i++) {
    let x = margin;
    let y = margin + i * lineHeight;
    let cellW = canvasWidth / maxPerLine;

    for (let j = 0; j < lines[i].length; j++) {
      let letter = lines[i][j];
      let img = imgs[letter];
      if (img) {
        let imgScale = min(cellW / img.width, (lineHeight * 0.5) / img.height);
        imageMode(CENTER);
        image(
          img,
          x + cellW / 2,
          y + lineHeight / 3,
          img.width * imgScale,
          img.height * imgScale
        );
      }
      fill(0);
      text(letter, x + cellW / 2, y + lineHeight * 0.75);
      x += cellW;
    }
  }

  // ===== カーソル =====
  let cursorCol = lines[currentLine].length;
  let cellW = canvasWidth / maxPerLine;

  if (currentLine === 3 && cursorCol >= maxPerLine) {
    cursorCol = maxPerLine - 1;
  } else if (cursorCol >= maxPerLine) {
    cursorCol = 0;
    if (currentLine < 3) currentLine++;
  }

  let cursorX = cursorCol * cellW + margin;
  let cursorY = margin + currentLine * lineHeight;
  noStroke();
  fill(200, 200, 255, 100);
  rect(cursorX, cursorY, cellW, lineHeight);

  // ===== 操作ボタン =====
  let btnW = width * 0.2;
  let btnH = height * 0.06;
  let btnY = height / 2 - btnH * 1.5;
  let btnMargin = (width - btnW * 4) / 5;

  let buttons = [
    { label: "Back", color: color(159, 200, 213) },
    { label: "Space", color: color(159, 200, 213) },
    { label: "Enter", color: color(40, 113, 136) },
    { label: "Clear", color: color(150, 228, 219) },
  ];
  buttons.forEach((b, i) => {
    b.x = btnMargin * (i + 1) + btnW * i;
    drawButton(b.label, b.x, btnY, btnW, btnH, b.color);
  });

  // ===== 下半分：文字ボタン =====
  let cols = 7;
  let rows = ceil(mapping.length / cols);
  let buttonW = width / cols;
  let buttonH = height / 2 / rows;

  for (let i = 0; i < mapping.length; i++) {
    let col = i % cols;
    let rowIndex = floor(i / cols);
    let bx = col * buttonW;
    let by = height / 2 + rowIndex * buttonH;

    stroke(200);
    fill(240);
    rect(bx, by, buttonW, buttonH);

    let img = imgs[mapping[i].letter];
    let imgScale = min(buttonW / img.width, (buttonH * 0.5) / img.height);
    imageMode(CENTER);
    image(
      img,
      bx + buttonW / 2,
      by + buttonH * 0.45,
      img.width * imgScale,
      img.height * imgScale
    );

    fill(0);
    text(mapping[i].letter, bx + buttonW / 2, by + buttonH * 0.8);
  }
}

// ===== 統一されたボタン描画関数 =====
function drawButton(label, x, y, w, h, col) {
  fill(col);
  rect(x, y, w, h, 10);
  fill(0);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}

// ===== ボタン判定 =====
function mousePressed() {
  handleButtons();
}

// ===== タップ対応 =====
function touchStarted() {
  handleButtons();
  return false; // これで画面全体の選択を防ぐ
}

// ===== ボタン処理共通関数 =====
function handleButtons() {
  let btnW = width * 0.2;
  let btnH = height * 0.06;
  let btnY = height / 2 - btnH * 1.5;
  let btnMargin = (width - btnW * 4) / 5;

  let btnX = [
    btnMargin,
    btnMargin * 2 + btnW,
    btnMargin * 3 + btnW * 2,
    btnMargin * 4 + btnW * 3,
  ];

  // 操作ボタン
  // Back
  if (mouseY > btnY && mouseY < btnY + btnH && mouseX > btnX[0] && mouseX < btnX[0] + btnW) {
    if (lines[currentLine].length > 0) {
      lines[currentLine].pop();
    } else if (currentLine > 0) {
      currentLine--;
      if (lines[currentLine].length > 0) lines[currentLine].pop();
    }
    return;
  }

  // Space
  if (mouseY > btnY && mouseY < btnY + btnH && mouseX > btnX[1] && mouseX < btnX[1] + btnW) {
    pushLetter(" ");
    return;
  }

  // Enter
  if (mouseY > btnY && mouseY < btnY + btnH && mouseX > btnX[2] && mouseX < btnX[2] + btnW) {
    if (currentLine < 3) currentLine++;
    return;
  }

  // Clear
  if (mouseY > btnY && mouseY < btnY + btnH && mouseX > btnX[3] && mouseX < btnX[3] + btnW) {
    lines = [[], [], [], []];
    currentLine = 0;
    return;
  }

  // 文字ボタン
  let cols = 7;
  let rows = ceil(mapping.length / cols);
  let buttonW = width / cols;
  let buttonH = height / 2 / rows;

  for (let i = 0; i < mapping.length; i++) {
    let col = i % cols;
    let rowIndex = floor(i / cols);
    let bx = col * buttonW;
    let by = height / 2 + rowIndex * buttonH;

    if (mouseX > bx && mouseX < bx + buttonW && mouseY > by && mouseY < by + buttonH) {
      pushLetter(mapping[i].letter);
      break;
    }
  }
}

// 文字追加関数
function pushLetter(letter) {
  if (lines[currentLine].length < maxPerLine) {
    lines[currentLine].push(letter);
  } else if (currentLine < 3) {
    currentLine++;
    lines[currentLine].push(letter);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
