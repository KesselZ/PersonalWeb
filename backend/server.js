const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
let sharp;
try { sharp = require('sharp'); } catch (e) { console.warn('Sharp not found'); }

let puppeteer;
try { puppeteer = require('puppeteer'); } catch (e) { console.warn('Puppeteer not found'); }

// 核心修改：使用异步方式加载 ESM 格式的 data.js
let data;
(async () => {
  const dataModule = await import('./data.js');
  data = dataModule;
})();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '../static')));

// 静态文件服务：在生产环境下服务构建好的 Vue 前端
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// 自动截图函数
async function takeScreenshot(url, savePath) {
  if (!puppeteer) return false;
  console.log(`Starting capture for: ${url}...`);
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    // 等待网络空闲，确保游戏资源加载
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    // 额外多等 5 秒，确保进度条走完，画面渲染
    await new Promise(r => setTimeout(r, 5000)); 
    await page.screenshot({ path: savePath });
    await browser.close();
    console.log(`Capture saved to: ${savePath}`);
    return true;
  } catch (err) {
    console.error(`Capture failed for ${url}:`, err);
    return false;
  }
}

// 增强版图片接口：支持自动抓取和缩放
app.get('/api/image', async (req, res) => {
  const { path: imgPath, w, h } = req.query;
  if (!imgPath) return res.status(400).send('Path is required');

  const absolutePath = path.join(__dirname, '..', imgPath);
  const dirPath = path.dirname(absolutePath);

  // 1. 如果文件不存在，且是 captures 目录，尝试自动抓取
  if (!fs.existsSync(absolutePath) && imgPath.includes('captures/')) {
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
    
    // 从文件名匹配 URL
    let targetUrl = '';
    if (imgPath.includes('tacops')) targetUrl = 'https://tac-ops.top/';
    else if (imgPath.includes('dxgame')) targetUrl = 'https://dx-game.top/';
    else if (imgPath.includes('triage')) targetUrl = 'https://triage.top/';
    else if (imgPath.includes('scholar_rsrp')) targetUrl = 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=2O5jgPMAAAAJ&citation_for_view=2O5jgPMAAAAJ:u5HHmVD_uO8C';
    else if (imgPath.includes('scholar_cifar')) targetUrl = 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=2O5jgPMAAAAJ&citation_for_view=2O5jgPMAAAAJ:d1gkVwhDpl0C';

    if (targetUrl) {
      const success = await takeScreenshot(targetUrl, absolutePath);
      if (!success) return res.status(500).send('Failed to capture screenshot');
    } else {
      return res.status(404).send('Capture target not defined');
    }
  }

  // 2. 文件现在应该存在了（或者是普通图片），执行缩放
  if (!fs.existsSync(absolutePath)) return res.status(404).send('Image not found');

  if (!sharp) return res.redirect(imgPath);

  try {
    let transform = sharp(absolutePath);
    if (w || h) {
      transform = transform.resize(w ? parseInt(w) : null, h ? parseInt(h) : null, { fit: 'cover', withoutEnlargement: true });
    }
    res.type('image/webp');
    transform.webp({ quality: 80 }).pipe(res);
  } catch (err) {
    res.redirect(imgPath);
  }
});

// 统一返回原始数据，不再在后端进行多语言过滤，交给前端实时切换
app.get('/api/personal-info', (req, res) => res.json({ ...data.commonInfo, ...data.personalInfo, age: data.calculateAge() }));
app.get('/api/education', (req, res) => res.json(data.education));
app.get('/api/skills', (req, res) => res.json(data.skills));
app.get('/api/portfolio', (req, res) => res.json(data.portfolio));
app.get('/api/artworks', (req, res) => res.json(data.artworks));

// SPA 路由回退：确保刷新页面时不会 404
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('API endpoint not found (or build not found)');
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
