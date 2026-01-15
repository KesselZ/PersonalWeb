<template>
  <section class="about">
    <div class="container">
      <h2>{{ t.title }}</h2>
      <div class="about-content">
        <div class="about-grid">
          <div class="about-info">
            <div class="info-list">
              <div class="info-item"><strong>{{ t.info.age }}:</strong> {{ info.age }}</div>
              <div class="info-item"><strong>{{ t.info.job }}:</strong> {{ t.info.student }}</div>
              <div class="info-item"><strong>{{ t.info.citizenship }}:</strong> {{ info.citizenship }}</div>
              <div class="info-item"><strong>{{ t.info.address }}:</strong> {{ info.address }}</div>
              <div class="info-item"><strong>{{ t.info.email }}:</strong> <a :href="'mailto:' + info.email">{{ info.email }}</a></div>
            </div>
          </div>
          <div class="about-text">
            <p><strong>{{ t.greeting }} {{ info.name }}</strong></p>
            <p>{{ info.bio }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['info', 't']
}
</script>

<style scoped>
.about {
    background-color: transparent;
}

.about-content {
    max-width: 1000px;
    margin: 0 auto;
}

.about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.about-info .info-list {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(255, 255, 255, 0.6);
}

.info-item {
    margin-bottom: 1rem;
    padding: 0.8rem 1rem;
    border-radius: 12px;
    background: rgba(248, 250, 252, 0.5); /* 适配玻璃感 */
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

.info-item:hover {
    transform: translateX(10px);
    background: white;
    border-color: rgba(99, 102, 241, 0.1);
    box-shadow: var(--shadow-md);
}

.info-item:last-child {
    margin-bottom: 0;
}

.info-item strong {
    color: var(--primary);
    margin-right: 0.8rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-item a {
    color: var(--text-main);
    text-decoration: none;
    font-weight: 500;
}

.about-text {
    padding-left: 1rem;
}

.about-text p {
    font-size: 1.15rem;
    margin-bottom: 1.8rem;
    color: var(--text-muted);
    line-height: 1.8;
}

.about-text p strong {
    color: var(--text-main);
    font-size: 1.8rem;
    display: block;
    margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
    .about-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
}
</style>
