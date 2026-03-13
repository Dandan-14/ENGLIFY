
// question bank with categories
let questions = [
  {
    category: "Vocabulary",
    question: "What is the translation of 'gato'?",
    options: ["Dog", "Cat", "Bird", "Fish"],
    correct: 1
  },
  {
    category: "Writing",
    question: "What is the translation of 'casa'?",
    options: ["House", "Car", "Tree", "Book"],
    correct: 0
  },
  {
    category: "Grammar",
    question: "Choose the correct past tense of 'go'.",
    options: ["goed", "went", "gone", "going"],
    correct: 1
  },
  {
    category: "Listening",
    question: "(pretend you heard) 'She _____ to school every day.'",
    options: ["walk", "walks", "walking", "walked"],
    correct: 1
  },
  {
    category: "Reading",
    question: "Which word is a noun: 'quickly', 'table', 'blue', 'run'?",
    options: ["quickly", "table", "blue", "run"],
    correct: 1
  }
];

// state for current question
let currentQuestion = null;

function getCategoryIcon(category) {
  const icons = {
    Vocabulary: '📚',
    Writing: '✏️',
    Listening: '🎧',
    Reading: '📖',
    Grammar: '🧠'
    
  };
  return icons[category] || '🧩';
}

function getCategoryClass(category) {
  return category.toLowerCase();
}

function showAlert(message, category = 'Vocabulary', duration = 1400, onDone) {
  let overlay = document.getElementById('alertas-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'alertas-overlay';
    overlay.className = 'alertas-overlay';

    const box = document.createElement('div');
    box.className = 'alertas-box';
    box.innerHTML = `
      <div class="alertas-icon">${getCategoryIcon(category)}</div>
      <h2 class="alertas-title">${message}</h2>
      <p class="alertas-subtitle">${category}</p>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  const box = overlay.querySelector('.alertas-box');
  box.className = `alertas-box ${getCategoryClass(category)}`;
  box.querySelector('.alertas-icon').textContent = getCategoryIcon(category);
  box.querySelector('.alertas-title').textContent = message;
  box.querySelector('.alertas-subtitle').textContent = category;

  overlay.classList.add('show');

  setTimeout(() => {
    overlay.classList.remove('show');
    setTimeout(() => {
      if (overlay.parentElement) overlay.remove();
      if (typeof onDone === 'function') onDone();
    }, 240);
  }, duration);
}

function spin() {
  const wheel = document.getElementById('wheel');
  const btn = document.querySelector('button');
  if (!wheel || !btn) return;

  // choose category and determine which slice index it corresponds to
  const categories = [
    "Vocabulary",
    "Grammar",
    "Listening",
    "Reading"
  ];
  const random = Math.floor(Math.random() * categories.length);
  const choice = categories[random];
  localStorage.setItem("category", choice);

  // map categories to slice positions (0‑4)
  const mapping = {
    Vocabulary: 0,
    Grammar:     1,
    Listening:   2,
    Reading:     3
  };
  const targetIndex = mapping[choice] || 0;

  const slices = 5;
  const baseAngle = 360 / slices;
  const spins = 3; // how many full turns before landing
  const angle = spins * 360 + targetIndex * baseAngle;

  // animate rotation via transition
  btn.disabled = true;
  wheel.style.transition = 'transform 2s ease-out';
  wheel.style.transform = `rotate(${angle}deg)`;

  wheel.addEventListener('transitionend', () => {
    btn.disabled = false;
    showAlert("Categoría: " + choice, choice, 1400, () => {
      window.location.href = "question.html";
    });
  }, { once: true });
}

function loadQuestion() {
  let cat = localStorage.getItem("category");
  if (!cat) cat = "Vocabulary"; // fallback

  // pick a random question from that category
  let pool = questions.filter(q => q.category === cat);
  if (pool.length === 0) {
    document.getElementById("question").innerText = "No questions available.";
    return;
  }
  currentQuestion = pool[Math.floor(Math.random() * pool.length)];

  document.getElementById("question").innerText = currentQuestion.question;
  // show category label
  document.getElementById("category").innerText = "Category: " + cat;
  document.getElementById("a").innerText = currentQuestion.options[0];
  document.getElementById("b").innerText = currentQuestion.options[1];
  document.getElementById("c").innerText = currentQuestion.options[2];
  document.getElementById("d").innerText = currentQuestion.options[3];
}

function answer(option) {
  if (!currentQuestion) return;

  if (option === currentQuestion.correct) {
    // correct -> show a quick message and load another question
    showAlert("¡Correcto!", currentQuestion.category, 1100, () => {
      loadQuestion();
    });
  } else {
    localStorage.setItem("result", "Wrong Answer");
    window.location.href = "result.html";
  }
}


window.onload = () => {
  // reset rotation when the roulette page loads
  const wheel = document.getElementById('wheel');
  if (wheel) {
    wheel.style.transition = '';
    wheel.style.transform = 'rotate(0deg)';
    setupWheel(); // arrange slices in circle
  }
  loadQuestion();
};

// arrange roulette icons evenly around circumference
function setupWheel(){
  const wheel = document.getElementById('wheel');
  if (!wheel) return;
  const icons = wheel.querySelectorAll('.icon');
  const count = icons.length;
  const angleStep = 360 / count;
  const rect = wheel.getBoundingClientRect();
  const wheelRadius = rect.width / 2;
  const radius = wheelRadius * 0.65;
  icons.forEach((icon,i) => {
    const angle = i * angleStep;
    icon.style.transform = `rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`;
  });
}

