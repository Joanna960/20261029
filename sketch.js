// 宣告全局變數：儲存兩張精靈圖檔資源
let imgIdle; // 預設走路圖片 (1/走路/走路.png)
let imgWalkRight; // 向右/向左走路圖片 (1/又走路/又走路.png)

// 宣告角色狀態與位置變數
let posX; // 角色的 X 座標位置
let posY; // 角色的 Y 座標位置
let speed = 4; // 角色的移動速度（像素/幀）

// 宣告精靈圖檔與動畫相關參數
const totalFrames = 5; // 精靈圖檔中的總幀數 (共有 5 張圖片)
const sheetWidth = 199; // 整張橫向圖檔的總寬度 (像素)
const sheetHeight = 61; // 整張圖檔的總高度 (像素)
const frameWidth = sheetWidth / totalFrames; // 計算單一幀的寬度 (199 / 5 = 39.8 像素)

let currentFrame = 0; // 當前播放到的幀索引 (0 到 4)
let frameDelay = 6; // 控制動畫播放速度的延遲計數器（數字越小動畫越快）

// p5.js preload 預載函數：在 setup 執行前預先載入圖片檔，確保繪圖時圖檔已準備就緒
function preload() {
  // 載入預設的走路圖檔
  imgIdle = loadImage('1/走路/走路.png');
  // 載入方向性走路圖檔
  imgWalkRight = loadImage('1/又走路/又走路.png');
}

// p5.js setup 初始化函數：只會在程式啟動時執行一次
function setup() {
  // 建立全螢幕畫布，寬度與高度等於當前瀏覽器視窗尺寸
  createCanvas(windowWidth, windowHeight);
  
  // 初始化角色的起始位置在畫布正中央
  posX = width / 2;
  posY = height / 2;
  
  // 設定繪製圖片時的基準點為圖片的中心點（方便旋轉與翻轉操作）
  imageMode(CENTER);
}

// p5.js draw 繪圖主循環函數：每秒預設執行 60 次
function draw() {
  // 設定背景顏色為指定藍色 #84BCDA (RGB: 132, 188, 218)
  background(132, 188, 218);
  
  // 預設當前使用的精靈圖檔為預設圖片
  let currentImg = imgIdle;
  // 預設角色的面向方向 (1 代表面向右邊，-1 代表面向左邊)
  let facingDirection = 1;
  // 判斷角色目前是否有在移動
  let isMoving = false;

  // 檢測鍵盤按鍵狀態：如果按下右方向鍵 (RIGHT_ARROW)
  if (keyIsDown(RIGHT_ARROW)) {
    currentImg = imgWalkRight; // 切換為方向性走路圖檔
    facingDirection = 1;      // 設定方向為面向右邊
    posX += speed;            // 角色的 X 座標向右增加
    isMoving = true;          // 標記為正在移動
  } 
  // 檢測鍵盤按鍵狀態：如果按下左方向鍵 (LEFT_ARROW)
  else if (keyIsDown(LEFT_ARROW)) {
    currentImg = imgWalkRight; // 切換為方向性走路圖檔
    facingDirection = -1;     // 設定方向為面向左邊（需做翻轉）
    posX -= speed;            // 角色的 X 座標向左減少
    isMoving = true;          // 標記為正在移動
  }

  // 更新動畫幀索引：利用 frameCount 時間因子與 frameDelay 控制切換頻率
  if (frameCount % frameDelay === 0) {
    // 幀索引在 0 到 totalFrames - 1 之間循環增加
    currentFrame = (currentFrame + 1) % totalFrames;
  }

  // 計算當前幀在橫向精靈圖檔中的 X 軸裁切起始位置
  let sx = currentFrame * frameWidth;

  // 儲存當前的畫布狀態與座標系統矩陣
  push();
  
  // 將畫布的原點 (0, 0) 移動到角色的當前位置 (posX, posY)
  translate(posX, posY);
  
  // 根據面向方向進行水平翻轉：如果面向左邊，將 X 軸金字塔縮放成 -1 進行鏡像翻轉
  scale(facingDirection, 1);

  // 繪製精靈圖檔切片
  // 參數說明：
  // currentImg: 要繪製的來源圖檔
  // 0, 0: 在當前平移後的畫布原點繪製
  // frameWidth, sheetHeight: 繪製在畫布上的寬與高
  // sx, 0: 來源圖檔中要裁切的左上角 X 與 Y 座標
  // frameWidth, sheetHeight: 來源圖檔中要裁切的寬與高
  image(
    currentImg,
    0, 0,
    frameWidth, sheetHeight,
    sx, 0,
    frameWidth, sheetHeight
  );

  // 恢復先前儲存的畫布狀態與座標系統，避免影響後續繪圖
  pop();

  // 限制角色座標範圍，防止角色走出螢幕畫面外
  posX = constrain(posX, frameWidth / 2, width - frameWidth / 2);
}

// p5.js windowResized 視窗大小改變事件函數：當使用者調整瀏覽器視窗大小時自動觸發
function windowResized() {
  // 自動將畫布重新設定為新的視窗寬高，確保全螢幕呈現
  resizeCanvas(windowWidth, windowHeight);
}