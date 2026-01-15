<template>
  <!-- 优化：首页锁定为透明主题，只有切换到其他 Section 时才变白 -->
  <nav class="navbar" :class="{ 'scrolled': currentSection !== 'home' }">
    <div class="nav-container">
      <div class="nav-logo-wrapper">
        <div class="nav-logo" @click="$emit('navigate', 'home')">
          <span class="logo-dot"></span>
          <h2 :class="{ 'on-dark': currentSection === 'home' }">
            <Transition name="text-fade" mode="out-in">
              <span :key="name">{{ name }}</span>
            </Transition>
          </h2>
        </div>
      </div>

      <ul class="nav-menu">
        <li v-for="(label, section) in labels" :key="section">
          <a :href="'#' + section" 
             :class="{ active: currentSection === section, 'on-dark': currentSection === 'home' }"
             @click.prevent="$emit('navigate', section)">
            <Transition name="text-fade" mode="out-in">
              <span :key="label">{{ label }}</span>
            </Transition>
          </a>
        </li>
      </ul>

      <div class="nav-lang-wrapper">
        <div class="language-switcher">
          <button @click="$emit('switch-lang', 'zh')" :class="{ active: currentLang === 'zh' }" class="lang-btn">中</button>
          <button @click="$emit('switch-lang', 'en')" :class="{ active: currentLang === 'en' }" class="lang-btn">EN</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: ['name', 'labels', 'currentLang', 'currentSection'],
  data() {
    return {
      isScrolled: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 20;
    }
  }
}
</script>

<style scoped>
/* 基础样式：悬浮岛设计 */
.navbar {
    position: fixed;
    top: 15px; /* 距离顶部一点距离，产生悬浮感 */
    left: 50%;
    transform: translateX(-50%);
    width: 95%; /* 不占满全宽 */
    max-width: 1200px;
    z-index: 1000;
    height: 64px;
    display: flex; align-items: center;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    
    /* 核心：极致透明玻璃 */
    background: rgba(255, 255, 255, 0.1); /* 极低不透明度 */
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.2); /* 亮色边框勾勒边缘 */
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

/* 非首页/滚动时的样式微调：增加一点亮度确保文字易读 */
.navbar.scrolled {
    background: rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
}

/* 首页锁定完全透明 */
.navbar:not(.scrolled) {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: none;
}

/* 文字颜色逻辑 */
.nav-logo h2 {
    color: var(--text-main);
}

.nav-menu a {
    color: var(--text-muted);
}

/* 特殊状态：当在深色 Hero 背景上时 */
.on-dark {
    color: white !important;
    opacity: 0.9;
}

.on-dark:hover, .on-dark.active {
    opacity: 1;
    color: white !important;
}

/* 下划线颜色适配 */
.nav-menu a.on-dark::after {
    background: white;
}

.nav-menu a:not(.on-dark).active::after {
    background: var(--primary-gradient);
}

.nav-container {
    max-width: 1200px; /* 稍微放宽一点容器，给长名字留空间 */
    margin: 0 auto;
    padding: 0 2rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo-wrapper {
    flex: 1; /* 占据左侧剩余空间 */
    display: flex;
    justify-content: flex-start;
}

.nav-lang-wrapper {
    flex: 1; /* 占据右侧剩余空间 */
    display: flex;
    justify-content: flex-end;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2.5rem;
    flex: 0 0 auto; /* 菜单保持宽度不变，居中固定 */
}

.nav-menu a {
    color: var(--text-muted);
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    position: relative;
}

.nav-menu a::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 0; width: 0; height: 2px;
    background: var(--primary-gradient);
    transition: width 0.3s ease;
}

.nav-menu a:hover, .nav-menu a.active {
    color: var(--primary);
}

.nav-menu a.active::after {
    width: 100%;
}

/* 文字切换动画 */
.text-fade-enter-active,
.text-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.text-fade-enter-from {
  opacity: 0;
  transform: translateY(3px);
}

.text-fade-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}

.language-switcher {
    display: flex;
    gap: 4px;
    background: #f1f5f9;
    padding: 4px;
    border-radius: 12px;
    position: relative;
    z-index: 1;
}

.lang-btn {
    padding: 6px 14px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 700;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.lang-btn.active {
    background: white;
    color: var(--primary);
    box-shadow: 0 4px 12px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px) scale(1.05);
}

.lang-btn:not(.active):hover {
    color: var(--primary);
    background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
    .nav-menu { gap: 1rem; }
    .nav-menu a { font-size: 0.8rem; }
}
</style>
