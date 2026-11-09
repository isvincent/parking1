# 路邊停車｜駕駛圖解

可直接部署至 **GitHub Pages** 的繁體中文教學網站。首頁為 `index.html`，純 HTML、CSS、JavaScript，無須建置、資料庫、Azure 金鑰或外部 CDN。

## 內容與功能

- 原版 9:16 教學影片：1080×1920、4 分 18.3 秒；曉臻旁白、燒錄字幕、原創合成配樂與音效。
- **RWD**：手機單欄、平板與電腦雙欄；影片維持 9:16 不變形，章節按鈕與播放控制可觸控及鍵盤操作。
- 原生播放器：播放／暫停、時間拖曳、音量、全螢幕（依瀏覽器支援）、0.75／1／1.25／1.5 倍速。
- 四章跳轉、目前章節標記、完整 22 段教學文字、SRT 字幕與 MP4 下載。
- **PWA**：Web App Manifest、本地安裝圖示、Service Worker、離線網頁、可選擇儲存完整影片。
- 離線影片支援 HTTP Range 回應，包括開放區間、尾端區間及無效範圍 416；斷網時仍能播放與跳轉。
- 所有資源使用相對路徑，可部署於 `https://帳號.github.io/儲存庫名稱/` 子目錄。

## 完整檔案架構

```text
GitHub-Pages/                 ← 將這一層的內容上傳到儲存庫根目錄
├── index.html               # 首頁與語意化版面
├── styles.css               # RWD、觸控、焦點及低動態偏好
├── app.js                   # 播放器、章節、文字、安裝及離線狀態
├── sw.js                    # 快取、離線影片、Range、版本更新
├── manifest.webmanifest     # PWA 名稱、圖示、啟動路徑與範圍
├── README.md                # 本說明文件
├── .nojekyll                # 使用純靜態檔案
├── .gitignore               # 避免誤傳環境設定、日誌等檔案
├── assets/
│   └── icons/
│       ├── icon.svg
│       ├── icon-192.png
│       ├── icon-512.png
│       ├── maskable-512.png
│       └── apple-touch-icon.png
├── data/
│   └── lesson.json          # 真實旁白時間、四章與完整教學文字
└── media/
    ├── parking.mp4          # 原版教學影片，約 17.9 MB
    ├── poster.png           # 影片封面
    ├── parking.vtt          # 原生播放器可選字幕
    └── parking.srt          # 可下載字幕
```

ZIP 已含完整影片及所有圖示，不需要另外尋找素材。影片、配音製作工具與原始動畫工程保留在原先的「路邊停車教學」製作資料夾；這個資料夾專供網站部署，不含語音 API 憑據。

## 上傳 GitHub Pages

1. 建立或開啟自己的 GitHub 儲存庫。
2. 將本資料夾**裡面的檔案與子資料夾**上傳到儲存庫根目錄。首頁應是根目錄的 `index.html`，不要再多包一層 `GitHub-Pages`。
3. 到 **Settings → Pages → Build and deployment**。
4. Source 選 **Deploy from a branch**，Branch 選 **main**（或實際分支），資料夾選 **/(root)**，按 **Save**。
5. 等待部署完成，開啟 GitHub 顯示的 HTTPS 網址，例如 `https://你的帳號.github.io/你的儲存庫/`。
6. 首次開啟保持連網，待離線功能準備完成；需要離線影片時，再按「儲存離線影片」。

若採用 `/docs` 發布方式，將全部網站檔案放進 `docs/`，再把 Pages 的資料夾改選 `/docs`。不需修改程式內路徑。

如果瀏覽器上傳介面拒絕影片，可透過 Git 或 GitHub Desktop 上傳整個資料夾。儲存庫的可見性、Pages 使用資格及限制依 GitHub 帳號與方案而異。

本次交付為可上傳套件，**尚未代為推送 GitHub 或部署公開網址**。

## 安裝與離線使用

1. 在支援的瀏覽器以 HTTPS 開啟網站。
2. 桌面或 Android：若瀏覽器提供安裝事件，頁首會顯示「安裝到裝置」；也可使用瀏覽器選單的安裝功能。
3. iPhone／iPad：在 Safari 的分享選單選擇「加入主畫面」。顯示文字與安裝能力依系統版本而異。
4. 按「儲存離線影片」，等待顯示 **離線影片已儲存**。影片約需 18 MB 額外空間，網頁本身另需少量空間。
5. 可先切換飛航或離線模式，重新開啟網站，確認影片播放及章節跳轉正常。

**安裝 App 與儲存影片是兩件事。** 安裝不會自動下載完整影片。首次載入只預存網頁、資料、字幕、封面和圖示；影片須按鈕下載完成才會可離線播放。按「移除離線影片」只刪本案影片快取，不清除其他網站資料。

瀏覽器可能因儲存壓力、私人瀏覽模式、使用者清除資料或網站版本更新而移除離線資料。程式會盡量請求持久儲存，但不保證瀏覽器允許；使用前請查看離線狀態。iOS 實機安裝與背景儲存表現仍需在目標裝置確認。

## 本機預覽

不要直接雙擊 `index.html`，`file://` 不支援本案 PWA 與資料讀取流程。

如果電腦有 Python，在網站資料夾開啟終端機：

```sh
python -m http.server 8080
```

然後開啟 `http://localhost:8080/`。`localhost` 可用於 Service Worker 開發測試；一般區域網路 IP 的 HTTP 網址不等同安全來源，手機測試請使用 HTTPS 部署網址。

## 如何修改

| 項目 | 修改檔案 |
| --- | --- |
| 網站標題、說明、使用提醒 | `index.html` |
| 顏色、字級、手機／平板／電腦版型 | `styles.css` |
| 章節時間、說明、完整文字 | `data/lesson.json` |
| 播放器、倍速、安裝提示 | `app.js` |
| App 名稱、主題色、啟動設定 | `manifest.webmanifest` |
| App 圖示 | `assets/icons/` |
| 替換影片、封面、字幕 | `media/` |
| 快取版本與離線規則 | `sw.js` |

影片已含燒錄字幕，VTT 預設關閉以免重複顯示。若透過瀏覽器字幕選單開啟 VTT，畫面會同時保留燒錄字幕。

### 更新版本

1. 修改網站內容或替換媒體。
2. 同時更新 `sw.js` 的 `VERSION`，例如由 `2026-11-09-v1` 改為 `2026-11-10-v2`，再上傳 GitHub。
3. 新 Service Worker 預備完成後，既有使用者會看到「有新版本，更新頁面」。按下後重新載入。
4. 啟用新版本時只清除本案路徑下舊版快取。**新版影片需要重新按「儲存離線影片」。**

如刪改預存檔案名稱，必須一併修改 `sw.js` 的 `SHELL_FILES`；任一預存檔案 404 都會讓新版安裝失敗，既有版本仍可保留。

## 驗證範圍

本機測試資料另附在交付套件外的 `網站驗證` 資料夾，涵蓋手機／平板／桌面尺寸、章節與倍速、Manifest 圖示、GitHub 專案子路徑、完整影片儲存、離線重新載入、Range 回應、離線播放及移除快取。這些測試不代表已完成 GitHub 線上部署或所有手機瀏覽器實機測試。

## 教學使用與來源

示範情境為右側、平坦道路、自排小客車。俯視圖為動作示意，非特定車型的精確轉彎軌跡。實際操作應由合格教練指導，依車型與現場環境調整；使用於教學前請開啟聲音完整試看。

車輛圖形、網站圖示、原創音樂及提示音由本案程式產生；旁白由使用者的 Azure Speech 設定合成，音色 `zh-TW-HsiaoChenNeural`。影片內使用 Noto Sans TC（SIL OFL），字型嵌於影片畫面；網站介面使用本機字型，不載入外部字型服務。網站與本案自製程式、媒體未另指定開放原始碼授權；公開儲存庫不等同授予任意再授權權利。

- [道路交通安全規則](https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040013)：第89、110、112條。
- [臺南市政府警察局燈光宣導](https://www.tnpd.gov.tw/precinct6/News/Details/39426?sClass=4&unid=a6dad55a-7217-5dba-cd48-14c04d24c768)。
- [California DMV：Parallel Parking](https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/navigating-the-roads-cont1/)：僅參考基本操作順序，未採用美國路緣距離規定。
- [GitHub Pages 建立網站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)。
- [GitHub Pages 發布來源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
- [MDN：PWA 快取](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)、[Manifest scope](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope)。
