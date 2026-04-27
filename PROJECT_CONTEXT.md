# DoorUVDesign 專案上下文

這份文件用來保存目前「彩燿門 x UV 局部彩繪點綴模擬器」的開發進度，方便之後接續開發、上線或交接。

## 專案位置

- 本機資料夾：`C:\Users\Kulimu\Desktop\DoorDesign`
- GitHub repo：`https://github.com/bloodilywei/DoorUVDesign.git`
- GitHub Pages 預計網址：`https://bloodilywei.github.io/DoorUVDesign/`

注意：舊 repo `bloodilywei/doordesign` 是原本的舊系統，不要覆蓋或推送到那邊。新模擬器請使用 `bloodilywei/DoorUVDesign`。

## 目前主要檔案

- `index.html`：頁面結構
- `styles.css`：版面與視覺樣式
- `catalog.js`：素材清單與分類
- `app.js`：互動邏輯、配件操作、PNG 匯出
- `.nojekyll`：讓 GitHub Pages 正常讀取靜態檔案
- `PROJECT_CONTEXT.md`：本交接摘要

## 已完成功能

- Step 1 門板底色：白梣、柚木、胡桃。
- Step 2 局部點綴：支援「圖案」與「線條」切換。
- Step 3 配件：支援玻璃框、百頁。
- 配件可以多個疊加、拖曳位置、方向鍵微調、旋轉、換色、刪除選取、清除全部。
- 中央即時預覽可下載 PNG，按鈕文字為「下載成圖片」。
- PNG 匯出會包含門板預覽與選擇摘要，方便美工知道客戶搭配內容。
- 門板下方已顯示尺寸概念：

```text
門板比例示意
尺寸：70.3×200CM
```

## 素材資料夾

### 門板底圖

- `assets/base/white-ash/base.png`
- `assets/base/teak/base.png`
- `assets/base/walnut/base.png`

### 局部點綴圖案

- `assets/overlays/`
- 目前格式：`1.png` 到 `13.png`

### 線條點綴

- `assets/lines/`
- 命名格式範例：`01_B.png`, `01_G.png`, `01_W.png`
- 色碼對應：`B=黑`, `G=灰`, `W=白`

### 配件

- 玻璃框：`assets/accessories/glass/`
- 百頁：`assets/accessories/louvers/`
- 命名格式：`型號_白.png`, `型號_柚木.png`, `型號_胡桃.png`

## 重要調整紀錄

- A-00 百頁原尺寸標示錯誤，已更正為 `LOU_A-00-450×20`。
- 線條高度曾偏短，已在 `styles.css` 加上微調：

```css
.overlay.line-overlay {
  height: 104%;
  top: -2%;
}
```

- 左右面板維持同高，左右清單各自捲動。
- Step 1 三個底色按鈕置中於中間欄，接近預覽上方。
- 只保留 PNG 匯出，不保留 JPG。

## GitHub 狀態

本機專案已初始化 Git，並已設定 remote：

```text
origin  https://github.com/bloodilywei/DoorUVDesign.git
branch  main
```

GitHub Desktop 內建 Git 路徑：

```text
C:\Users\Kulimu\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe
```

先前已成功 push 到 `bloodilywei/DoorUVDesign`。不過如果此文件是 push 之後才新增或修改，需要再 commit/push 才會同步到 GitHub。

## GitHub Pages 上線步驟

到 GitHub repo：

```text
https://github.com/bloodilywei/DoorUVDesign
```

設定：

```text
Settings -> Pages
Source: Deploy from a branch
Branch: main
Folder: /root
Save
```

等待約 1 到 3 分鐘後，網站應會出現在：

```text
https://bloodilywei.github.io/DoorUVDesign/
```

## 後續新增素材注意事項

- 若只是新增同格式圖片，優先放到既有資料夾並更新 `catalog.js`。
- 後續可再做「自動讀取資料夾」或「素材管理」功能，但 GitHub Pages 是純靜態網站，不能直接讓客戶或美工在網頁後台上傳圖片。
- 若要有後台上傳素材，未來需要加雲端儲存或後端系統。

## 常用驗證命令

```powershell
node --check app.js
node --check catalog.js
```

如果要使用 GitHub Desktop 內建 Git：

```powershell
& "C:\Users\Kulimu\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe" status --short --branch
& "C:\Users\Kulimu\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe" remote -v
& "C:\Users\Kulimu\AppData\Local\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe" push -u origin main
```
