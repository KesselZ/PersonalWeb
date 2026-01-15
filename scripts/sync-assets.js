const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const puppeteer = require('puppeteer');

async function sync() {
    console.log('🚀 开始本地资产同步...');
    
    // 动态导入数据，以兼容 ESM 格式的 data.js
    const dataModule = await import('../backend/data.js');
    const data = dataModule;

    const CAPTURES_DIR = path.join(__dirname, '../static/images/captures');
    const THUMBNAILS_DIR = path.join(__dirname, '../static/images/thumbnails');

    // 确保目录存在
    [CAPTURES_DIR, THUMBNAILS_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });

    const allProjects = [...data.portfolio];
    
    for (const item of allProjects) {
        const itemName = item.en ? item.en.name : item.name;
        const screenshotPath = path.join(__dirname, '..', item.image);
        
        // 1. 自动截图（如果文件不存在且是 captures 目录）
        if (!fs.existsSync(screenshotPath) && item.image.includes('captures/')) {
            let targetUrl = '';
            if (item.image.includes('tacops')) targetUrl = 'https://tac-ops.top/';
            else if (item.image.includes('dxgame')) targetUrl = 'https://dx-game.top/';
            else if (item.image.includes('triage')) targetUrl = 'https://triage.top/';
            else if (item.image.includes('scholar_rsrp')) targetUrl = 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=2O5jgPMAAAAJ&citation_for_view=2O5jgPMAAAAJ:u5HHmVD_uO8C';
            else if (item.image.includes('scholar_cifar')) targetUrl = 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=2O5jgPMAAAAJ&citation_for_view=2O5jgPMAAAAJ:d1gkVwhDpl0C';

            if (targetUrl) {
                console.log(`📸 正在截取: ${itemName} -> ${targetUrl}`);
                try {
                    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
                    await new Promise(r => setTimeout(r, 5000));
                    await page.screenshot({ path: screenshotPath });
                } catch (err) {
                    console.error(`❌ 截图失败: ${itemName}`, err.message);
                }
            }
        }

        // 2. 生成缩略图（提升生产环境加载速度）
        const thumbName = path.basename(item.image, path.extname(item.image)) + '.webp';
        const thumbPath = path.join(THUMBNAILS_DIR, thumbName);
        
        if (fs.existsSync(screenshotPath) && !fs.existsSync(thumbPath)) {
            console.log(`🖼️  正在优化图片: ${itemName}`);
            try {
                await sharp(screenshotPath)
                    .resize(400, null, { withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(thumbPath);
            } catch (err) {
                console.error(`❌ 优化失败: ${itemName}`, err.message);
            }
        }
    }

    // 3. 处理绘画作品 (Artworks) 的缩略图
    console.log('🎨 正在同步绘画作品...');
    for (const art of data.artworks) {
        const artPath = path.join(__dirname, '..', art.src);
        const thumbName = path.basename(art.src, path.extname(art.src)) + '.webp';
        const thumbPath = path.join(THUMBNAILS_DIR, thumbName);

        if (fs.existsSync(artPath) && !fs.existsSync(thumbPath)) {
            console.log(`🖼️  正在优化绘画: ${path.basename(art.src)}`);
            try {
                await sharp(artPath)
                    .resize(400, null, { withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(thumbPath);
            } catch (err) {
                console.error(`❌ 优化失败: ${art.src}`, err.message);
            }
        }
    }

    await browser.close();
    console.log('✅ 资产同步完成！请将 static/images/ 里的变动提交到 Git。');
}

sync();
