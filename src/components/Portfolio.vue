<template>
  <section class="portfolio">
    <div class="container">
      <h2>{{ t.title }}</h2>
      <div class="portfolio-filters">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          @click="currentFilter = filter.value"
          :class="{ active: currentFilter === filter.value }"
          class="filter-btn"
        >
          {{ filter.label }}
        </button>
      </div>
      <div class="portfolio-grid">
        <TransitionGroup name="list" tag="div" class="portfolio-grid-inner">
          <div v-for="item in filteredItems" :key="item.id" class="portfolio-item">
            <div class="portfolio-image">
              <!-- 移除 loading="lazy"：因为资源已经预加载，我们需要立即显示 -->
              <!-- 添加 decoding="async"：让浏览器在后台解码，避免阻塞主线程，但配合预加载会瞬间完成 -->
              <img 
                :src="getOptimizedImage(item.image)" 
                :alt="item.name" 
                @error="handleImageError($event, item.image)"
                decoding="async"
              />
              <!-- 标签移动到图片右下角 -->
              <span class="portfolio-tag" :class="getTagClass(item.category)">{{ item.category }}</span>
              <div class="portfolio-overlay">
                <div class="portfolio-links">
                  <a v-if="item.link" :href="item.link" target="_blank" class="portfolio-link">
                    <i class="fas fa-external-link-alt"></i>
                  </a>
                  <a v-if="item.github" :href="item.github" target="_blank" class="portfolio-link">
                    <i class="fab fa-github"></i>
                  </a>
                  <a v-if="isArt(item)" @click="$emit('open-gallery')" class="portfolio-link" style="cursor: pointer;">
                    <i class="fas fa-images"></i>
                  </a>
                </div>
              </div>
            </div>
            <div class="portfolio-content">
              <!-- 标题现在独占一行，增加 Tooltip 检测 -->
              <div class="title-wrapper" @mouseenter="handleMouseEnter($event)">
                <h3 class="portfolio-title">{{ item.name }}</h3>
                <div class="portfolio-tooltip">{{ item.name }}</div>
              </div>
              <div class="description-wrapper" @mouseenter="handleMouseEnter($event)">
                <p class="portfolio-description">{{ item.description }}</p>
                <div class="portfolio-tooltip">{{ item.description }}</div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['items', 't', 'currentLang'],
  data() {
    return {
      currentFilter: 'all'
    };
  },
  computed: {
    filters() {
      const f = this.t.filters;
      return [
        { label: f.all, value: 'all' },
        { label: f.web, value: this.currentLang === 'zh' ? '网页' : 'Web' },
        { label: f.research, value: this.currentLang === 'zh' ? '研究' : 'Research' },
        { label: f.art, value: this.currentLang === 'zh' ? '艺术' : 'Art' }
      ];
    },
    filteredItems() {
      if (this.currentFilter === 'all') return this.items;
      return this.items.filter(item => item.category === this.currentFilter);
    }
  },
  methods: {
    getOptimizedImage(originalPath) {
      // 逻辑：由于我们现在将 static 移入了 public 目录
      // 打包后路径将保留 /static，与开发环境保持一致
      const fileName = originalPath.split('/').pop().split('.')[0];
      return `/static/images/thumbnails/${fileName}.webp`;
    },
    handleImageError(event, originalPath) {
      // 极其防御性的处理：确保不出现 //static 这种情况
      // 如果路径已经是 / 开头，直接用；如果不是，补上 /
      let fallbackPath = originalPath;
      if (!fallbackPath.startsWith('/')) {
        fallbackPath = '/' + fallbackPath;
      }
      
      // 避免重复斜杠并强制指向当前域名的根路径
      const cleanPath = fallbackPath.replace(/\/+/g, '/');
      
      // 如果已经尝试过原图还是失败，就停止防止死循环
      if (event.target.src.endsWith(cleanPath)) {
        console.warn('Image failed to load even with fallback:', cleanPath);
        return;
      }
      
      console.log(`Fallback triggered for: ${originalPath} -> using ${cleanPath}`);
      event.target.src = cleanPath;
    },
    isArt(item) {
      const artLabel = this.currentLang === 'zh' ? '艺术' : 'Art';
      return item.category === artLabel;
    },
    getTagClass(category) {
      const map = {
        '网页': 'tag-web', 'Web': 'tag-web',
        '研究': 'tag-research', 'Research': 'tag-research',
        '艺术': 'tag-art', 'Art': 'tag-art'
      };
      return map[category] || 'tag-default';
    },
    handleMouseEnter(event) {
      const wrapper = event.currentTarget;
      const content = wrapper.querySelector('h3, p');
      if (content) {
        // 检测是否溢出：scrollHeight > clientHeight 说明垂直方向有截断
        const isOverflowing = content.scrollHeight > content.clientHeight;
        if (isOverflowing) {
          wrapper.classList.add('show-tooltip');
        } else {
          wrapper.classList.remove('show-tooltip');
        }
      }
    }
  }
}
</script>

<style scoped>
.portfolio {
    background-color: transparent;
}

.portfolio-filters {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
    flex-wrap: wrap;
}

.filter-btn {
    padding: 10px 24px;
    border: 1px solid #e2e8f0;
    background: white;
    color: var(--text-muted);
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: var(--shadow-sm);
    position: relative;
    overflow: hidden;
}

.filter-btn::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
}

.filter-btn:active::before {
    width: 300px;
    height: 300px;
}

.filter-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.filter-btn.active {
    background: var(--primary-gradient);
    color: white;
    border-color: transparent;
    box-shadow: 0 8px 20px -5px rgba(99, 102, 241, 0.4);
}

.portfolio-grid {
    max-width: 1200px;
    margin: 0 auto;
}

.portfolio-grid-inner {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    position: relative;
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-move {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}

.list-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.list-leave-active {
  position: absolute;
  width: calc((100% - 4rem) / 3);
  z-index: 0;
  pointer-events: none;
}

.portfolio-item {
    /* 核心改进：引入微弱的靛蓝色调，增加材质感 */
    background: rgba(248, 250, 255, 0.75); 
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 28px;
    overflow: hidden;
    box-shadow: 
        0 10px 30px -10px rgba(79, 70, 229, 0.08),
        0 20px 40px -20px rgba(0, 0, 0, 0.1);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.portfolio-item:hover {
    transform: translateY(-12px) scale(1.01);
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 
        0 40px 80px -15px rgba(99, 102, 241, 0.25),
        0 20px 40px -20px rgba(0, 0, 0, 0.2);
    border-color: rgba(99, 102, 241, 0.3); /* 悬浮时边框呈现主题色 */
}

.portfolio-image {
    position: relative;
    height: 200px; /* 稍微压低高度，给文字更多空间 */
    overflow: hidden;
    margin: 12px; /* 图片缩进，产生“边框”感 */
    border-radius: 20px;
}

.portfolio-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.portfolio-item:hover .portfolio-image img {
    transform: scale(1.1);
}

.portfolio-overlay {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.4); /* 稍微加深一点背景，让按钮更明显 */
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.4s ease;
    z-index: 5;
}

.portfolio-item:hover .portfolio-overlay {
    opacity: 1;
}

.portfolio-tag {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 10;
    padding: 5px 14px;
    border-radius: 12px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    /* 核心改进：增加内发光和半透明白色边框，确保在深色背景下的可见度 */
    border: 1px solid rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease;
}

/* 标签色彩高级化方案：采用极低饱和度的“莫兰迪”渐变色 */
.tag-web { 
    background: linear-gradient(135deg, rgba(224, 242, 254, 0.95) 0%, rgba(186, 230, 253, 0.95) 100%); 
    color: #0369a1; 
}
.tag-research { 
    background: linear-gradient(135deg, rgba(243, 232, 255, 0.95) 0%, rgba(233, 213, 255, 0.95) 100%); 
    color: #7e22ce; 
}
.tag-art { 
    background: linear-gradient(135deg, rgba(255, 241, 242, 0.95) 0%, rgba(255, 228, 230, 0.95) 100%); 
    color: #be123c; 
}
.tag-default { 
    background: rgba(255, 255, 255, 0.95);
    color: var(--text-main);
}

.portfolio-links {
    display: flex;
    gap: 0.8rem;
}

.portfolio-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    /* 核心改进：按钮不再透明，而是带有主题渐变的半透明感 */
    background: rgba(79, 70, 229, 0.2);
    color: white;
    border-radius: 14px;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.portfolio-link:hover {
    background: var(--primary-gradient); /* 悬浮时完全填充主题渐变 */
    color: white;
    transform: translateY(-5px) scale(1.1);
    box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
}

.portfolio-content {
    padding: 0.5rem 1.8rem 2rem; /* 增加呼吸感 */
    transition: transform 0.4s ease;
}

.portfolio-item:hover .portfolio-content {
    transform: translateY(-5px); /* 内容在悬浮时微微上移 */
}

.portfolio-title {
    color: var(--text-main);
    margin: 0 0 1rem 0;
    font-size: 1.25rem; /* 稍微调大标题 */
    line-height: 1.4;
    font-weight: 700;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

.portfolio-description {
    color: var(--text-muted); /* 使用加深后的变量 */
    line-height: 1.7;
    font-size: 0.92rem;
    margin-bottom: 0;
    font-weight: 450; /* 增加一点粗度，提升可读性 */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Tooltip 基础样式 */
.portfolio-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: rgba(15, 23, 42, 0.95);
    color: white;
    padding: 0.8rem 1rem;
    border-radius: 10px;
    font-size: 0.8rem;
    line-height: 1.5;
    width: 260px;
    z-index: 100;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    text-align: left;
}

.portfolio-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: rgba(15, 23, 42, 0.95) transparent transparent transparent;
}

/* 仅在具有 show-tooltip 类时显示（由 JS 控制） */
.show-tooltip:hover .portfolio-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-12px);
}

@media (max-width: 992px) {
    .portfolio-grid-inner {
        grid-template-columns: repeat(2, 1fr);
    }
    .list-leave-active {
        width: calc((100% - 2rem) / 2);
    }
}

@media (max-width: 640px) {
    .portfolio-grid-inner {
        grid-template-columns: 1fr;
    }
    .list-leave-active {
        width: 100%;
    }
}
</style>
