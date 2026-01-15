const calculateAge = () => {
  const birthDate = new Date(2000, 4, 19);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const personalInfo = {
  zh: {
    name: "张心澈",
    title: "清华大学博士研究生",
    location: "北京市，中国",
    bio: "清华大学生物医学工程专业博士研究生，专注于人工智能在医疗健康领域的应用研究。具备计算机科学背景，致力于将机器学习技术应用于生物医学领域。",
    citizenship: "中国",
    address: "北京市",
  },
  en: {
    name: "Xinche (Kessel) Zhang",
    title: "PhD Student at Tsinghua University",
    location: "Beijing, China",
    bio: "PhD student in Biomedical Engineering at Tsinghua University, focusing on AI applications in healthcare. With a computer science background, I am dedicated to applying machine learning technologies to the biomedical field.",
    citizenship: "China",
    address: "Beijing",
  }
};

const commonInfo = {
  email: "kesselzhang@foxmail.com",
  phone: "+86 176 0378 9929",
  age: calculateAge(),
};

const skills = [
  // Professional Skills
  { name: "机器学习", nameEn: "Machine Learning", level: 5, category: "professional" },
  { name: "软件开发", nameEn: "Software Development", level: 4, category: "professional" },
  { name: "UI/UX设计", nameEn: "UI/UX Design", level: 4, category: "professional" },
  { name: "操作系统", nameEn: "Operating System", level: 4, category: "professional" },
  { name: "网络安全", nameEn: "Cyber Security", level: 4, category: "professional" },

  // Programming Languages
  { name: "Python", nameEn: "Python", level: 5, category: "language" },
  { name: "JavaScript", nameEn: "JavaScript", level: 5, category: "language" },
  { name: "Java", nameEn: "Java", level: 4, category: "language" },
  { name: "C++", nameEn: "C++", level: 4, category: "language" },
  { name: "R", nameEn: "R", level: 4, category: "language" },

  // Tools
  { name: "Android Studio", nameEn: "Android Studio", level: 5, category: "tools" },
  { name: "Premiere/AfterEffect", nameEn: "Premiere/AfterEffect", level: 4, category: "tools" },
  { name: "Tomcat", nameEn: "Tomcat", level: 4, category: "tools" },
  { name: "Unity", nameEn: "Unity", level: 4, category: "tools" },
  { name: "Burpsuit", nameEn: "Burpsuit", level: 4, category: "tools" },

  // Knowledge
  { name: "线性代数", nameEn: "Linear Algebra", level: 5, category: "knowledge" },
  { name: "统计学", nameEn: "Statistics", level: 5, category: "knowledge" },
  { name: "微积分", nameEn: "Calculus", level: 4, category: "knowledge" },
  { name: "离散数学", nameEn: "Discrete Math", level: 4, category: "knowledge" },
  { name: "宏观经济学", nameEn: "Macroeconomics", level: 4, category: "knowledge" }
];

const education = [
  {
    id: 1,
    zh: { period: "2015-2018", school: "河南省实验中学", location: "河南，中国", description: "河南省实验中学是由河南省人民政府创办的唯一一所省级重点中学。" },
    en: { period: "2015-2018", school: "Henan Experimental High School", location: "Henan, China", description: "Henan experimental high school is a key high school." }
  },
  {
    id: 2,
    zh: { period: "2018-2022", school: "达尔豪斯大学", location: "新斯科舍省，加拿大", description: "计算机科学荣誉学士学位。" },
    en: { period: "2018-2022", school: "Dalhousie University", location: "Nova Scotia, Canada", description: "Bachelor of Computer Science with honors." }
  },
  {
    id: 3,
    zh: { period: "2022-2024", school: "纽约大学", location: "纽约，美国", description: "计算机科学硕士学位。" },
    en: { period: "2022-2024", school: "New York University", location: "New York, US", description: "Master of Computer Science." }
  },
  {
    id: 4,
    zh: { period: "2024-至今", school: "清华大学", location: "北京，中国", description: "生物医学工程博士研究生。" },
    en: { period: "2024-Present", school: "Tsinghua University", location: "Beijing, China", description: "PhD student in Biomedical Engineering." }
  }
];

const portfolio = [
  {
    id: 1,
    zh: { name: "HTML冒险游戏", description: "JavaScript前端冒险游戏。", category: "网页" },
    en: { name: "HTML Game: Adventure", description: "Front-end adventure game.", category: "Web" },
    image: "/static/images/captures/adventure.png",
    link: "/static/jump_game/menu.html"
  },
  {
    id: 2,
    zh: { 
      name: "基于随机释放可塑性的奖励优化学习", 
      description: "发表于 Frontiers in Neural Circuits (2025)。提出 RSRP 学习框架，通过模拟生物突触释放分布实现高效奖励优化，在强化学习中达到媲美 PPO 的性能。", 
      category: "研究" 
    },
    en: { 
      name: "Reward-optimizing learning using stochastic release plasticity", 
      description: "Published in Frontiers in Neural Circuits (2025). Introduces RSRP, a biologically plausible framework achieving competitive RL performance via natural gradient estimation.", 
      category: "Research" 
    },
    image: "/static/images/captures/scholar_rsrp.png",
    link: "https://scholar.google.com/citations?view_op=view_citation&hl=zh-CN&user=2O5jgPMAAAAJ&citation_for_view=2O5jgPMAAAAJ:u5HHmVD_uO8C"
  },
  {
    id: 8,
    zh: { 
      name: "经典 CNN 架构在 CIFAR-10 上的应用研究", 
      description: "发表于 ICBASE 2021 (IEEE)。深入探讨并对比了 AlexNet、LeNet-5 和 VGG Net 在 CIFAR-10 数据集上的性能特征与架构兼容性。", 
      category: "研究" 
    },
    en: { 
      name: "AlexNet, LeNet-5 and VGG NET applied to CIFAR-10", 
      description: "Presented at ICBASE 2021 (IEEE). A comparative evaluation of classical CNN architectures, analyzing their performance and compatibility on the CIFAR-10 database.", 
      category: "Research" 
    },
    image: "/static/images/captures/scholar_cifar.png",
    link: "https://scholar.google.com/citations?view_op=view_citation&hl=zh-CN&user=2O5jgPMAAAAJ&citation_for_view=2O5jgPMAAAAJ:d1gkVwhDpl0C"
  },
  {
    id: 3,
    zh: { name: "ProCreate绘画作品", description: "使用iPad创作的一些绘画作品。", category: "艺术" },
    en: { name: "Pictures by ProCreate", description: "Paintings done through iPad.", category: "Art" },
    image: "/static/images/works/pic1.png",
    link: ""
  },
  {
    id: 4,
    zh: { name: "Quick Cash安卓应用", description: "Quick Cash是一款安卓应用程序，用于接受短期工作赚取报酬。", category: "网页" },
    en: { name: "Android App: Quick Cash", description: "Quick Cash is an android application.", category: "Web" },
    image: "/static/images/captures/quickC.png",
    github: "https://github.com/KesselZ/Quick_Cash"
  },
  {
    id: 5,
    zh: { name: "TacOps - 战术行动", description: "一款硬核战术射击游戏，具有完善的仓库管理系统、装备系统和实时联机模式。", category: "网页" },
    en: { name: "TacOps", description: "A hardcore tactical extraction shooter featuring stash management, equipment system, and real-time multiplayer.", category: "Web" },
    image: "/static/images/captures/tacops.png",
    link: "https://tac-ops.top/"
  },
  {
    id: 6,
    zh: { name: "稻香村发展计划", description: "武侠题材的策略经营游戏。管理资源，招募李忘生、李承恩等名侠，发展属于你的江湖势力。", category: "网页" },
    en: { name: "DX-Game", description: "A Wuxia-themed strategy and management game. Manage resources, recruit iconic heroes, and build your martial arts influence.", category: "Web" },
    image: "/static/images/captures/dxgame.png",
    link: "https://dx-game.top/"
  },
  {
    id: 7,
    zh: { name: "Triage - 医疗分诊模拟", description: "结合生物医学背景开发的医疗救护模拟系统，旨在模拟紧急情况下的伤员分类与处理流程。", category: "网页" },
    en: { name: "Triage", description: "A medical emergency triage simulation system developed with a biomedical background to simulate patient sorting and treatment processes.", category: "Web" },
    image: "/static/images/captures/triage.png",
    link: "https://triage.top/"
  }
];

const artworks = [
  { src: '/static/images/works/pic1.png', cover: '/static/images/works/pic1.png' },
  { src: '/static/images/works/pic2.png', cover: '/static/images/works/pic2.png' },
  { src: '/static/images/works/pic3.png', cover: '/static/images/works/pic3.png' },
  { src: '/static/images/works/pic4.png', cover: '/static/images/works/pic4.png' },
  { src: '/static/images/works/pic5.png', cover: '/static/images/works/pic5.png' },
  { src: '/static/images/works/pic6.png', cover: '/static/images/works/pic6.png' }
];

export {
  calculateAge,
  personalInfo,
  commonInfo,
  skills,
  education,
  portfolio,
  artworks
};
