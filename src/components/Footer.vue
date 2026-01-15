<template>
  <footer class="footer">
    <div class="container">
      <p>&copy; 2024 {{ name }}. {{ t.rights }}</p>
      <div class="social-links">
        <a v-for="link in socialLinks" :key="link.icon" :href="link.url" target="_blank" class="social-link">
          <i :class="link.icon"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  props: ['name', 't'],
  data() {
    return {
      socialLinks: [
        { icon: 'fab fa-github', url: 'https://github.com/KesselZ' },
        { icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/kessel-zhang/' },
        { icon: 'fab fa-facebook', url: 'https://facebook.com/...' }
      ]
    }
  }
}
</script>

<style scoped>
.footer {
    padding: 2rem 0 4rem;
}

.footer .container {
    /* 核心：将页脚也改为玻璃悬浮卡片 */
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(15px) saturate(160%);
    -webkit-backdrop-filter: blur(15px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 24px;
    padding: 2rem 3rem;
    
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    max-width: 1200px;
}

.social-links {
    display: flex;
    gap: 1.5rem;
}

.social-link {
    color: var(--text-muted);
    font-size: 1.2rem;
    transition: all 0.3s ease;
}

.social-link:hover {
    color: var(--primary);
    transform: translateY(-3px);
}

@media (max-width: 768px) {
    .footer .container {
        flex-direction: column;
        text-align: center;
    }
}
</style>
