# 門板模擬器

這是一個可在瀏覽器直接開啟的靜態門板模擬器。

## 使用方式

1. 直接開啟 `index.html`
2. 左側會顯示門板預覽
3. 右側先選底色，再選局部 UV 點綴樣式

## 素材放置規則

### 門板底圖

- `assets/base/white-ash/base.png`
- `assets/base/teak/base.png`
- `assets/base/walnut/base.png`

請將三個門板底圖裁成相同比例，建議使用透明背景或完整門板正面圖。

### 局部點綴樣式

目前已直接接上以下檔案：

- `assets/overlays/1.png`
- `assets/overlays/2.png`
- `assets/overlays/3.png`
- `assets/overlays/4.png`
- `assets/overlays/5.png`
- `assets/overlays/6.png`
- `assets/overlays/7.png`
- `assets/overlays/8.png`
- `assets/overlays/9.png`
- `assets/overlays/10.png`
- `assets/overlays/11.png`
- `assets/overlays/12.png`
- `assets/overlays/13.png`

這些圖會在介面中顯示為 `樣式 01` 到 `樣式 13`。

## 若要新增更多樣式

到 `catalog.js` 內新增一筆 `overlays` 資料即可。

範例：

```js
{
  id: "style-14",
  name: "樣式 14",
  description: "UV 局部彩繪示意樣式。",
  image: "assets/overlays/14.png",
  preview: "assets/overlays/14.png"
}
```

## 注意

- 目前工作目錄內尚未偵測到現成圖片，所以模擬器骨架已先完成，補上圖片後即可使用。
- 若之後你希望做到像 IKEA 一樣更細緻的區域切換、門型切換、縮放與下載報價圖，我也可以再幫你往下一版擴充。
