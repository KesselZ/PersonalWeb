<template>
  <section class="hero" ref="heroSection" @mousemove="handleMouseMove">
    <!-- 动态背景光晕 -->
    <div class="blob-c">
      <div class="shape-blob"></div>
      <div class="shape-blob one"></div>
      <div class="shape-blob two"></div>
    </div>

    <!-- 粒子系统 Canvas -->
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>
    
    <div class="hero-content">
      <h1>{{ t.greeting }}, {{ info.name }}</h1>
      <h2>{{ info.title }}</h2>
      <p>{{ t.bio }}</p>
      <div class="social-links-hero">
        <a v-for="link in socialLinks" :key="link.icon" :href="link.url" target="_blank" class="social-btn">
          <i :class="link.icon"></i>
        </a>
      </div>
      <div class="hero-buttons">
        <button @click="$emit('navigate', 'portfolio')" class="btn btn-primary">
          <i class="fas fa-code"></i> {{ t.buttons.portfolio }}
        </button>
        <a href="/static/jump_game/menu.html" target="_blank" class="btn btn-secondary">
          <i class="fas fa-gamepad"></i> {{ t.buttons.game }}
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['info', 't'],
  data() {
    return {
      socialLinks: [
        { icon: 'fab fa-facebook', url: 'https://facebook.com/...' },
        { icon: 'fab fa-github', url: 'https://github.com/KesselZ' },
        { icon: 'fas fa-graduation-cap', url: 'https://scholar.google.com/...' },
        { icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/kessel-zhang/' }
      ],
      ctx: null,
      canvas: null,
      particles: [],
      animationId: null,
      mouse: { x: null, y: null, radius: 150 }
    }
  },
  mounted() {
    this.initCanvas();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.particleCanvas;
      this.ctx = this.canvas.getContext('2d');
      this.handleResize();
      this.createParticles();
      this.animate();
    },
    handleResize() {
      this.canvas.width = this.$refs.heroSection.offsetWidth;
      this.canvas.height = this.$refs.heroSection.offsetHeight;
      this.createParticles(); // 重新调整大小时重置粒子，确保密度一致
    },
    handleMouseMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    },
    createParticles() {
      this.particles = [];
      const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000); // 动态密度
      for (let i = 0; i < particleCount; i++) {
        this.particles.push(new Particle(this.canvas.width, this.canvas.height));
      }
    },
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].update(this.mouse);
        this.particles[i].draw(this.ctx);
        
        // 连线逻辑
        for (let j = i; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const opacity = 1 - distance / 120;
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
            this.ctx.stroke();
          }
        }
      }
      
      this.animationId = requestAnimationFrame(this.animate);
    }
  }
}

// 粒子类定义
class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = Math.random() * 2 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 30) + 1;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }

  draw(ctx) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouse) {
    // 基础缓慢漂移
    this.x += this.vx;
    this.y += this.vy;

    // 边界反弹
    if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;

    // 鼠标交互：排斥效果
    if (mouse.x !== null && mouse.y !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      }
    }
  }
}
</script>

<style scoped>
.hero {
    position: relative;
    /* 移除硬编码背景，改用透明或变量，确保与父容器一致 */
    background: transparent; 
    color: white;
    padding: 120px 0 80px;
    text-align: center;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden; 
}

/* 动态光晕效果 */
.blob-c {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0; left: 0;
    z-index: 0;
    overflow: hidden;
    filter: blur(80px);
}

.shape-blob {
    position: absolute;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    animation: move 20s infinite alternate;
}

.shape-blob.one {
    background: rgba(168, 85, 247, 0.3);
    width: 500px; height: 500px;
    top: -100px; left: -100px;
}

.shape-blob.two {
    background: rgba(99, 102, 241, 0.3);
    width: 600px; height: 600px;
    bottom: -200px; right: -100px;
    animation-duration: 30s;
}

@keyframes move {
    from { transform: translate(0, 0) scale(1); }
    to { transform: translate(100px, 50px) scale(1.1); }
}

.particle-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1; /* 粒子在光晕上方 */
    pointer-events: none; /* 确保不阻碍点击社交链接等按钮 */
}

.hero-content {
    position: relative;
    z-index: 2; /* 确保文字在最上方 */
}

.hero-content h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero-content h2 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #ffd700; /* 金黄色 */
    /* 核心修复：强制覆盖 App.vue 中的全局透明渐变效果 */
    background: none !important;
    -webkit-text-fill-color: #ffd700 !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.hero-content p {
    font-size: 1.25rem;
    margin-bottom: 2.5rem;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.95);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

.social-links-hero {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 50%;
    text-decoration: none;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

.social-btn:hover {
    background-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px);
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background-color: #ffd700;
    color: #333;
}

.btn-primary:hover {
    background-color: #ffed4e;
    transform: translateY(-2px);
}

.btn-secondary {
    background-color: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background-color: white;
    color: #333;
    transform: translateY(-2px);
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .hero-content h1 {
        font-size: 2rem;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
}
</style>
