<template>
  <section class="skills">
    <div class="container">
      <h2>{{ t.title }}</h2>
      <div class="skills-categories">
        <div v-for="(catLabel, catKey) in t.categories" :key="catKey" class="skill-category">
          <div class="category-header">
            <i :class="getIcon(catKey)"></i>
            <h3>{{ catLabel }}</h3>
          </div>
          <div class="skills-list">
            <div v-for="skill in getSkillsByCategory(catKey)" :key="skill.name" class="skill-item">
              <div class="skill-name">{{ skill.name }}</div>
              <div class="skill-bar">
                <div class="skill-progress" :style="{ width: (skill.level * 20) + '%' }"></div>
              </div>
              <div class="skill-level">{{ skill.level }}/5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['items', 't'],
  methods: {
    getSkillsByCategory(category) {
      return this.items.filter(s => s.category === category);
    },
    getIcon(category) {
      const icons = {
        professional: 'fas fa-cogs',
        language: 'fas fa-code',
        tools: 'fas fa-tools',
        knowledge: 'fas fa-book'
      };
      return icons[category] || 'fas fa-star';
    }
  }
}
</script>

<style scoped>
.skills {
    background-color: transparent;
}

.skills-categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.skill-category {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 20px;
    box-shadow: var(--shadow-lg);
    border: 1px solid rgba(255, 255, 255, 0.6);
}

.category-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e9ecef;
}

.category-header i {
    font-size: 1.5rem;
    color: #667eea;
}

.category-header h3 {
    color: #333;
    margin: 0;
    font-size: 1.2rem;
}

.skills-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.skill-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.skill-name {
    flex: 0 0 120px;
    font-weight: 500;
    color: #333;
    font-size: 0.9rem;
}

.skill-bar {
    flex: 1;
    height: 8px;
    background-color: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
}

.skill-progress {
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;
}

.skill-level {
    flex: 0 0 35px;
    text-align: right;
    color: #666;
    font-size: 0.8rem;
}

@media (max-width: 768px) {
    .skills-categories {
        grid-template-columns: 1fr;
    }
}
</style>
