/* =========================================================
   MEC EASY — TREINAMENTO

   Vídeos cadastrados por módulo.
   Para adicionar o vídeo de Ordens de Serviço depois,
   localize a aula com id: "ordens-servico" e altere:

   video: ""
   para:
   video: "https://www.youtube.com/watch?v=ID_DO_VIDEO"
========================================================= */

const trainingLessons = [
  {
    id: "dashboard",
    number: "01",
    title: "Dashboard",
    icon: "bi-speedometer2",
    description: "Visão geral do sistema, indicadores e principais informações da oficina.",
    video: "https://www.youtube.com/watch?v=p3iDoJWE1vU"
  },
  {
    id: "log-pecas",
    number: "02",
    title: "Log de Peças",
    icon: "bi-clock-history",
    description: "Consulta ao histórico de movimentações e alterações de peças.",
    video: "https://www.youtube.com/watch?v=D_yKwYNhcdY"
  },
  {
    id: "log-servicos",
    number: "03",
    title: "Log de Serviços",
    icon: "bi-journal-text",
    description: "Consulta ao histórico de atividades e alterações em serviços.",
    video: "https://www.youtube.com/watch?v=GtyikNgKcgY"
  },
  {
    id: "pecas",
    number: "04",
    title: "Peças",
    icon: "bi-box-seam",
    description: "Cadastro e gerenciamento de peças e movimentações de estoque.",
    video: "https://www.youtube.com/watch?v=FX2n910Ag8g"
  },
  {
    id: "servicos",
    number: "05",
    title: "Serviços",
    icon: "bi-tools",
    description: "Cadastro e gerenciamento dos serviços realizados na oficina.",
    video: "https://www.youtube.com/watch?v=RKWPFov3yAk"
  },
  {
    id: "usuarios",
    number: "06",
    title: "Usuários",
    icon: "bi-person-gear",
    description: "Cadastro, edição e gerenciamento dos usuários e permissões de acesso.",
    video: "https://www.youtube.com/watch?v=dy3vD-V1e-I"
  },
  {
    id: "veiculos",
    number: "07",
    title: "Veículos",
    icon: "bi-car-front",
    description: "Cadastro, edição e gerenciamento dos veículos dos clientes.",
    video: "https://www.youtube.com/watch?v=QGppJCZi9-4"
  },
  {
    id: "clientes",
    number: "08",
    title: "Clientes",
    icon: "bi-people",
    description: "Cadastro, consulta e atualização dos dados dos clientes.",
    video: "https://www.youtube.com/watch?v=gNMG2JRRQhg"
  },
  {
    id: "ordens-servico",
    number: "09",
    title: "Ordens de Serviço (OS)",
    icon: "bi-clipboard-check",
    description: "Criação, acompanhamento e organização das ordens de serviço da oficina.",
    video: "" // ADICIONE AQUI o link do vídeo de OS quando estiver pronto.
  }
];

const STORAGE_KEY = "meceasy-training-progress-v1";

const lessonsGrid = document.getElementById("lessonsGrid");
const lessonCount = document.getElementById("lessonCount");

const overallProgressText = document.getElementById("overallProgressText");
const overallProgressPercent = document.getElementById("overallProgressPercent");
const overallProgressBar = document.getElementById("overallProgressBar");

const videoModalElement = document.getElementById("videoModal");
const videoModal = new bootstrap.Modal(videoModalElement);
const videoModalLabel = document.getElementById("videoModalLabel");
const youtubeFrame = document.getElementById("youtubeFrame");
const videoFrameWrapper = document.getElementById("videoFrameWrapper");
const videoPlaceholder = document.getElementById("videoPlaceholder");
const videoDescription = document.getElementById("videoDescription");
const completeLesson = document.getElementById("completeLesson");
const completeLessonText = document.getElementById("completeLessonText");

let activeLessonId = null;

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function isLessonCompleted(lessonId) {
  return Boolean(getProgress()[lessonId]);
}

function setLessonCompleted(lessonId, completed) {
  const progress = getProgress();

  if (completed) {
    progress[lessonId] = true;
  } else {
    delete progress[lessonId];
  }

  saveProgress(progress);
}

function renderLessons() {
  lessonsGrid.innerHTML = "";

  lessonCount.textContent = `${trainingLessons.length} aulas`;

  trainingLessons.forEach((lesson, index) => {
    const completed = isLessonCompleted(lesson.id);
    const column = document.createElement("div");

    column.className = "col-12 col-md-6 col-lg-4";
    column.style.animationDelay = `${index * 45}ms`;

    column.innerHTML = `
      <article
        class="lesson-card ${completed ? "completed" : ""}"
        role="button"
        tabindex="0"
        data-lesson-id="${lesson.id}"
        aria-label="Abrir aula ${lesson.title}"
      >
        <div class="lesson-card-top">
          <div class="lesson-icon">
            <i class="bi ${lesson.icon}"></i>
          </div>

          <span class="lesson-status">
            ${completed ? '<i class="bi bi-check-lg"></i> Concluída' : `AULA ${lesson.number}`}
          </span>
        </div>

        <h3>${lesson.title}</h3>
        <p>${lesson.description}</p>

        <div class="lesson-card-footer">
          <span>${completed ? "Assistir novamente" : "Assistir aula"}</span>
          <i class="bi bi-play-fill"></i>
        </div>
      </article>
    `;

    lessonsGrid.appendChild(column);
  });

  document.querySelectorAll(".lesson-card").forEach((card) => {
    card.addEventListener("click", () => openLesson(card.dataset.lessonId));

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLesson(card.dataset.lessonId);
      }
    });
  });
}

function getOverallProgress() {
  const total = trainingLessons.length;
  const completed = trainingLessons.filter((lesson) =>
    isLessonCompleted(lesson.id)
  ).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percent };
}

function updateOverallProgress() {
  const { total, completed, percent } = getOverallProgress();

  overallProgressText.textContent = `${completed} de ${total} aulas concluídas`;
  overallProgressPercent.textContent = `${percent}%`;
  overallProgressBar.style.width = `${percent}%`;
  overallProgressBar.parentElement.setAttribute("aria-valuenow", percent);
}

function extractYouTubeId(url) {
  if (!url) return "";

  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return "";
}

function openLesson(lessonId) {
  const lesson = trainingLessons.find((item) => item.id === lessonId);
  if (!lesson) return;

  activeLessonId = lesson.id;
  videoModalLabel.textContent = lesson.title;
  videoDescription.textContent = lesson.description;

  const completed = isLessonCompleted(lesson.id);
  completeLesson.checked = completed;
  completeLessonText.textContent = completed ? "Aula concluída" : "Marcar como concluída";

  const youtubeId = extractYouTubeId(lesson.video);

  if (youtubeId) {
    youtubeFrame.src = `https://www.youtube.com/embed/${youtubeId}?rel=0`;
    videoFrameWrapper.classList.remove("d-none");
    videoPlaceholder.classList.add("d-none");
  } else {
    youtubeFrame.src = "";
    videoFrameWrapper.classList.add("d-none");
    videoPlaceholder.classList.remove("d-none");
  }

  videoModal.show();
}

completeLesson.addEventListener("change", () => {
  if (!activeLessonId) return;

  setLessonCompleted(activeLessonId, completeLesson.checked);
  completeLessonText.textContent = completeLesson.checked
    ? "Aula concluída"
    : "Marcar como concluída";

  renderLessons();
  updateOverallProgress();
});

videoModalElement.addEventListener("hidden.bs.modal", () => {
  youtubeFrame.src = "";
  activeLessonId = null;
});

renderLessons();
updateOverallProgress();
