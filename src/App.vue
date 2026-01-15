<template>
  <div id="app" :class="{ 'is-home': activeSection === 'home' }">
    <div class="ambient-glow-3"></div>
    <!-- 全局加载进度条 -->
    <div v-show="isLoading" class="loading-overlay">
      <div class="loading-container">
        <div class="loading-progress"><div class="progress-bar" :style="{ width: loadingProgress + '%' }"></div></div>
        <div class="loading-text">{{ loadingText }}</div>
      </div>
    </div>

    <Navbar 
      :name="localizedInfo.name" 
      :labels="t.nav" 
      :currentLang="currentLang" 
      :currentSection="activeSection"
      @navigate="navigateToSection" 
      @switch-lang="switchLanguage" 
    />

    <main>
      <Transition name="fade" mode="out-in">
        <div :key="activeSection + currentLang" class="content-wrapper">
          <Hero v-if="activeSection === 'home'" :info="localizedInfo" :t="t.hero" @navigate="navigateToSection" />
          <About v-if="activeSection === 'about'" :info="localizedInfo" :t="t.about" />
          <Education v-if="activeSection === 'education'" :items="localizedEducation" :t="t.education" />
          <Skills v-if="activeSection === 'skills'" :items="localizedSkills" :t="t.skills" />
          <Portfolio 
            v-if="activeSection === 'portfolio'" 
            :items="localizedPortfolio" 
            :t="t.portfolio" 
            :currentLang="currentLang"
            @open-gallery="openGallery"
          />
        </div>
      </Transition>
    </main>

    <!-- 画廊模态框 -->
    <div v-if="showGallery" class="gallery-modal" @click="closeGallery">
      <div class="gallery-container" @click.stop>
        <div class="gallery-header">
          <h3>{{ currentLang === 'zh' ? '我的绘画作品集' : 'My Art Gallery' }}</h3>
          <button @click="closeGallery" class="gallery-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="gallery-content">
          <div class="gallery-grid">
            <div v-for="(artwork, index) in artworks" :key="index" class="gallery-item" @click="openLightbox(index)">
              <img :src="getArtThumb(artwork.src)" :alt="'Artwork ' + (index + 1)" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 灯箱模态框 -->
    <div v-if="showLightbox" class="lightbox-modal" @click="closeLightbox">
      <div class="lightbox-container" @click.stop>
        <button @click="closeLightbox" class="lightbox-close"><i class="fas fa-times"></i></button>
        <button @click="prevImage" class="lightbox-nav lightbox-prev"><i class="fas fa-chevron-left"></i></button>
        <button @click="nextImage" class="lightbox-nav lightbox-next"><i class="fas fa-chevron-right"></i></button>
        <img :src="artworks[currentImageIndex].src" class="lightbox-image" />
        <div class="lightbox-info">
          <span>{{ currentImageIndex + 1 }} / {{ artworks.length }}</span>
        </div>
      </div>
    </div>

    <Footer :name="personalInfo.name" :t="t.footer" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Hero from './components/Hero.vue';
import About from './components/About.vue';
import Education from './components/Education.vue';
import Skills from './components/Skills.vue';
import Portfolio from './components/Portfolio.vue';
import Footer from './components/Footer.vue';

// 核心重构：直接导入本地数据，不再请求 API
import * as siteData from '../backend/data.js';

export default {
  components: { Navbar, Hero, About, Education, Skills, Portfolio, Footer },
  data() {
    return {
      activeSection: 'home',
      currentLang: localStorage.getItem('preferred-language') || 'en',
      isLoading: true,
      loadingProgress: 0,
      loadingText: '',
      // 初始化时直接赋值
      personalInfo: { ...siteData.commonInfo, ...siteData.personalInfo, age: siteData.calculateAge() },
      education: siteData.education,
      skills: siteData.skills,
      portfolio: siteData.portfolio,
      artworks: siteData.artworks,
      showGallery: false,
      showLightbox: false,
      currentImageIndex: 0,
      translations: {
        zh: {
          loading: { info: '正在获取个人资料...', edu: '加载教育背景...', skills: '同步技能列表...', port: '扫描作品集...', gallery: '准备画廊...', fonts: '优化图标资源...' },
          nav: { home: '首页', about: '关于我', education: '教育经历', skills: '技能', portfolio: '作品集' },
          hero: { greeting: '你好，我是', bio: '清华大学博士研究生', buttons: { portfolio: '查看作品集', game: '小游戏' } },
          about: { title: '关于我', greeting: '你好，我是', info: { age: '年龄', job: '职业', citizenship: '国籍', address: '地址', email: '邮箱', student: '学生' } },
          education: { title: '教育经历' },
          skills: { title: '我的技能', categories: { professional: '专业技能', language: '编程语言', tools: '工具', knowledge: '专业知识' } },
          portfolio: { title: '作品集', filters: { all: '全部', web: '网页', research: '研究', art: '艺术' } },
          footer: { rights: '保留所有权利。' }
        },
        en: {
          loading: { info: 'Fetching Profile...', edu: 'Loading Education...', skills: 'Syncing Skills...', port: 'Scanning Portfolio...', gallery: 'Preparing Gallery...', fonts: 'Optimizing Icons...' },
          nav: { home: 'Home', about: 'About', education: 'Education', skills: 'Skills', portfolio: 'Portfolio' },
          hero: { greeting: 'Hi, I am', bio: 'PhD student at Tsinghua', buttons: { portfolio: 'Portfolio', game: 'Game' } },
          about: { title: 'About Me', greeting: 'Hi, I am', info: { age: 'Age', job: 'Job', citizenship: 'Citizenship', address: 'Address', email: 'Email', student: 'Student' } },
          education: { title: 'Education' },
          skills: { title: 'My Skills', categories: { professional: 'Professional', language: 'Languages', tools: 'Tools', knowledge: 'Knowledge' } },
          portfolio: { title: 'Portfolio', filters: { all: 'All', web: 'Web', research: 'Research', art: 'Art' } },
          footer: { rights: 'All rights reserved.' }
        }
      }
    };
  },
  computed: {
    t() { return this.translations[this.currentLang]; },
    localizedInfo() {
      if (!this.personalInfo.zh) return this.personalInfo;
      return { ...this.personalInfo, ...this.personalInfo[this.currentLang] };
    },
    localizedEducation() {
      return this.education.map(e => ({ ...e, ...(e[this.currentLang] || {}) }));
    },
    localizedSkills() {
      return this.skills.map(s => ({ ...s, name: this.currentLang === 'en' ? s.nameEn : s.name }));
    },
    localizedPortfolio() {
      return this.portfolio.map(p => ({ ...p, ...(p[this.currentLang] || {}) }));
    }
  },
  async mounted() {
    // 强制浏览器在刷新时不要记住之前的滚动位置
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    await this.loadData();
    window.scrollTo(0, 0);
    window.addEventListener('popstate', () => {
      this.activeSection = window.location.hash.slice(1) || 'home';
    });
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      this.loadingProgress = 0;

      // 1. 搜集所有需要预加载的缩略图
      const imageUrls = [
        ...this.portfolio.map(p => this.getArtThumb(p.image)), // 作品集缩略图
        ...this.artworks.map(a => this.getArtThumb(a.src))     // 画廊缩略图
      ];

      const total = imageUrls.length + 1; // +1 用于字体加载
      let loaded = 0;

      // 更新进度的闭包函数
      const tick = () => {
        loaded++;
        this.loadingProgress = Math.round((loaded / total) * 100);
      };

      // 图片加载并强制解码 Promise 化
      const preloadImage = (url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = () => { 
            // 核心优化：利用 decode API 确保图片被预先解码到内存中
            if (img.decode) {
              img.decode()
                .then(() => { tick(); resolve(); })
                .catch(() => { tick(); resolve(); });
            } else {
              tick(); resolve();
            }
          };
          img.onerror = () => { tick(); resolve(); };
        });
      };

      try {
        this.loadingText = this.currentLang === 'zh' ? '正在优化图片资源...' : 'Optimizing images...';
        
        // 并行预加载所有图片
        await Promise.all(imageUrls.map(url => preloadImage(url)));

        // 等待字体就绪
        this.loadingText = this.t.loading.fonts;
        if (document.fonts) {
          await document.fonts.ready;
        }
        tick();

      } catch (e) {
        console.error('Preload failed:', e);
      } finally {
        this.loadingProgress = 100;
        // 稍微停顿一下，让 100% 的状态能被看到，然后淡出
        setTimeout(() => { 
          this.isLoading = false; 
          window.scrollTo(0, 0);
        }, 500);
      }
    },
    navigateToSection(section) {
      this.activeSection = section;
      history.pushState(null, null, `#${section}`);
      window.scrollTo(0, 0);
    },
    switchLanguage(lang) {
      this.currentLang = lang;
      localStorage.setItem('preferred-language', lang);
      // 不再调用 loadData()
    },
    openGallery() { this.showGallery = true; },
    closeGallery() { this.showGallery = false; },
    openLightbox(index) {
      this.currentImageIndex = index;
      this.showLightbox = true;
    },
    closeLightbox() { this.showLightbox = false; },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.artworks.length) % this.artworks.length;
    },
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.artworks.length;
    },
    getArtThumb(src) {
      // 将 /static/images/works/pic1.png 转换为 /static/images/thumbnails/pic1.webp
      const fileName = src.split('/').pop().split('.')[0];
      return `/static/images/thumbnails/${fileName}.webp`;
    }
  }
};
</script>

<style>
/* 全局基础样式升级 */
:root {
  --primary: #4f46e5;
  --secondary: #7c3aed;
  --bg-main: #fbfcfe;
  --text-main: #0f172a; /* 极深蓝黑，提升可读性 */
  --text-muted: #334155; /* 加深灰色，确保在玻璃背景下清晰 */
  --glass-bg: rgba(255, 255, 255, 0.75);
  --border-light: rgba(226, 232, 240, 0.8);
  --primary-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

/* 定制高级滚动条 */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scrollbar-gutter: stable;
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  line-height: 1.6;
  color: var(--text-main);
  background-color: #f0f4f8; 
  /* 暴力强化网格：改为更明显的细线 */
  background-image: 
    linear-gradient(rgba(99, 102, 241, 0.08) 1.5px, transparent 1.5px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1.5px, transparent 1.5px);
  background-size: 50px 50px;
  transition: background-color 0.4s ease;
  position: relative;
  overflow-x: hidden;
}

/* 强化氛围灯：分布更广，确保玻璃组件下永远有内容 */
body::before, body::after, .ambient-blob {
  content: '';
  position: fixed;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  z-index: -1;
  filter: blur(140px);
  opacity: 0.25; 
  pointer-events: none;
  animation: pulse 15s infinite alternate ease-in-out;
}

body::before {
  top: -10%; right: -5%;
  background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
}

body::after {
  bottom: -10%; left: -5%;
  background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
  animation-delay: -7s;
}

/* 增加第三个光球，确保屏幕中间和顶部也有色彩 */
.ambient-glow-3 {
  position: fixed;
  top: 40%; left: 50%;
  width: 600px; height: 600px;
  background: radial-gradient(circle, #6366f1 0%, transparent 70%);
  z-index: -1;
  filter: blur(120px);
  opacity: 0.15;
  pointer-events: none;
  animation: pulse 20s infinite alternate-reverse;
}

@keyframes pulse {
  0% { transform: scale(1) translate(0, 0); opacity: 0.25; }
  100% { transform: scale(1.3) translate(100px, 100px); opacity: 0.45; }
}

/* 核心修复：让首页也能透出网格纹理 */
#app.is-home {
  /* 使用半透明渐变，让底层的 body 网格透上来 */
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.96) 0%, rgba(124, 58, 237, 0.96) 100%);
}

/* 确保内容在背景切换时也有平滑感 */
.content-wrapper {
  min-height: 100vh;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

section {
  padding: 100px 0;
  min-height: calc(100vh - 80px);
}

section h2 {
  text-align: center;
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 5rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

section h2::after {
  content: '';
  width: 60px;
  height: 4px;
  background: var(--primary-gradient);
  border-radius: 10px;
  opacity: 0.3;
}

/* 优雅的淡入动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from { opacity: 0; transform: translateY(5px); }
.fade-leave-to { opacity: 0; transform: translateY(-5px); }

/* 加载遮罩优化：改为深色渐变以匹配首页 */
.loading-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
}

.loading-container {
  width: 280px;
  text-align: center;
}

.loading-text {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.loading-progress {
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.progress-bar {
  height: 100%;
  background: white; /* 在深色背景下使用白色进度条最醒目 */
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  transition: width 0.4s ease;
}
/* 画廊模态框样式优化 - 极致玻璃拟态 */
.gallery-modal {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.4); /* 极大幅度减弱遮罩，透出背景 */
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.gallery-container {
  background: rgba(255, 255, 255, 0.7); /* 玻璃材质 */
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  width: 100%;
  max-width: 1100px;
  max-height: 85vh;
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.2),
    0 0 80px rgba(99, 102, 241, 0.1); /* 增加微弱的淡紫色外发光 */
  animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.gallery-header {
  padding: 2rem 2.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.3);
}

.gallery-header h3 {
  font-size: 1.8rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.gallery-close {
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
  width: 44px;
  height: 44px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-main);
}

.gallery-close:hover {
  background: #ef4444;
  color: white;
  transform: rotate(90deg) scale(1.1);
  border-color: transparent;
}

.gallery-content {
  padding: 2.5rem;
  overflow-y: auto;
  /* 自定义画廊内部滚动条 */
}

.gallery-content::-webkit-scrollbar {
  width: 6px;
}
.gallery-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
}

.gallery-item {
  aspect-ratio: 0.9;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  border: 4px solid white; /* 拍立得相框感 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  position: relative;
}

.gallery-item::after {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity 0.3s;
}

.gallery-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(79, 70, 229, 0.2);
  border-color: rgba(99, 102, 241, 0.2);
}

.gallery-item:hover::after {
  opacity: 0.1;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s ease;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

/* 灯箱模态框样式 */
.lightbox-modal {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lightbox-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 0 40px rgba(0,0,0,0.5);
  animation: zoomIn 0.3s ease-out;
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

.lightbox-close {
  position: absolute;
  top: 20px; right: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
  width: 70px;
  height: 70px;
}

.lightbox-prev { left: 30px; }
.lightbox-next { right: 30px; }

.lightbox-info {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(4px);
}

@media (max-width: 768px) {
  .lightbox-nav {
    width: 40px;
    height: 40px;
  }
  .lightbox-prev { left: 10px; }
  .lightbox-next { right: 10px; }
  .gallery-modal { padding: 1rem; }
  .gallery-container { max-height: 95vh; }
}
</style>
