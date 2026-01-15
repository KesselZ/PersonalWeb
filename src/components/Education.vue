<template>
  <section class="education">
    <div class="container">
      <h2>{{ t.title }}</h2>
      <div class="timeline">
        <div v-for="edu in items" :key="edu.id" class="timeline-item">
          <div class="timeline-marker">
            <i class="fas fa-graduation-cap"></i>
          </div>
          <div class="timeline-content">
            <div class="timeline-period">{{ edu.period }}</div>
            <h3>{{ edu.school }}</h3>
            <p>{{ edu.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['items', 't']
}
</script>

<style scoped>
.education {
    background-color: transparent;
}

.timeline {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: translateX(-50%);
}

.timeline-item {
    display: flex;
    margin-bottom: 3rem;
    position: relative;
}

.timeline-item:nth-child(odd) {
    flex-direction: row-reverse;
}

.timeline-item:nth-child(odd) .timeline-content {
    text-align: right;
    margin-right: 2rem;
}

.timeline-item:nth-child(even) .timeline-content {
    margin-left: 2rem;
}

.timeline-marker {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
    z-index: 2;
}

.timeline-content {
    flex: 1;
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    max-width: 45%;
}

.timeline-period {
    color: #667eea;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.timeline-content h3 {
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
}

.timeline-content p {
    color: #666;
    line-height: 1.6;
}

@media (max-width: 768px) {
    .timeline::before {
        left: 20px;
    }
    
    .timeline-item {
        flex-direction: row !important;
    }
    
    .timeline-item .timeline-content {
        margin-left: 3rem !important;
        margin-right: 0 !important;
        text-align: left !important;
        max-width: none;
    }
    
    .timeline-marker {
        left: 20px;
        transform: translateX(-50%);
    }
}
</style>
