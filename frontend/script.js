const API_URL = "http://localhost:3000";

const state = {
  alunos: [],
  cursos: [],
  matriculas: []
};

const pageTitles = {
  alunos: "Alunos",
  cursos: "Cursos",
  matriculas: "Matrículas"
};

const elements = {
  title: document.getElementById("page-title"),
  toastRegion: document.getElementById("toast-region"),
  alunosTable: document.getElementById("alunos-table"),
  cursosTable: document.getElementById("cursos-table"),
  matriculasTable: document.getElementById("matriculas-table"),
  alunosCount: document.getElementById("alunos-count"),
  cursosCount: document.getElementById("cursos-count"),
  matriculasCount: document.getElementById("matriculas-count"),
  alunoSelect: document.getElementById("matricula-aluno"),
  cursoSelect: document.getElementById("matricula-curso")
};

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast${type === "error" ? " error" : ""}`;

  const mark = document.createElement("span");
  mark.className = "toast-mark";
  mark.setAttribute("aria-hidden", "true");
  mark.textContent = type === "error" ? "!" : "✓";

  const text = document.createElement("span");
  text.textContent = message;

  toast.append(mark, text);
  elements.toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 4500);
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique se o servidor está rodando em localhost:3000.");
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === "string"
      ? data
      : data.mensagem || data.message || "Ocorreu um erro ao processar a solicitação.";
    throw new Error(message);
  }

  return data;
}

function setTableMessage(tbody, colspan, message) {
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = colspan;
  cell.className = "table-message";
  cell.textContent = message;
  row.append(cell);
  tbody.replaceChildren(row);
}

function setLoading(tbody, colspan) {
  setTableMessage(tbody, colspan, "Carregando…");
}

function addCell(row, value, className = "") {
  const cell = document.createElement("td");
  if (className) cell.className = className;
  cell.textContent = value == null || value === "" ? "—" : String(value);
  row.append(cell);
  return cell;
}

function renderAlunos() {
  elements.alunosCount.textContent = state.alunos.length;
  if (!state.alunos.length) {
    setTableMessage(elements.alunosTable, 3, "Nenhum aluno cadastrado.");
    return;
  }

  const rows = state.alunos.map((aluno) => {
    const row = document.createElement("tr");
    addCell(row, aluno.nome);
    addCell(row, aluno.email);
    addCell(row, aluno.id, "id-column");
    return row;
  });
  elements.alunosTable.replaceChildren(...rows);
}

function renderCursos() {
  elements.cursosCount.textContent = state.cursos.length;
  if (!state.cursos.length) {
    setTableMessage(elements.cursosTable, 3, "Nenhum curso cadastrado.");
    return;
  }

  const rows = state.cursos.map((curso) => {
    const row = document.createElement("tr");
    addCell(row, curso.nome);
    const vacancies = document.createElement("td");
    const badge = document.createElement("span");
    const full = Number(curso.vagas) <= 0;
    badge.className = `vacancy-badge${full ? " full" : ""}`;
    badge.textContent = full ? "Lotado" : `${curso.vagas} ${Number(curso.vagas) === 1 ? "vaga" : "vagas"}`;
    vacancies.append(badge);
    row.append(vacancies);
    addCell(row, curso.id, "id-column");
    return row;
  });
  elements.cursosTable.replaceChildren(...rows);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function renderMatriculas() {
  elements.matriculasCount.textContent = state.matriculas.length;
  if (!state.matriculas.length) {
    setTableMessage(elements.matriculasTable, 3, "Nenhuma matrícula encontrada.");
    return;
  }

  const rows = state.matriculas.map((matricula) => {
    const row = document.createElement("tr");
    addCell(row, matricula.aluno || matricula.aluno_nome || matricula.nome_aluno);
    addCell(row, matricula.curso || matricula.curso_nome || matricula.nome_curso);
    addCell(row, formatDate(matricula.data_matricula || matricula.data));
    return row;
  });
  elements.matriculasTable.replaceChildren(...rows);
}

function updateSelect(select, entries, label, emptyLabel, disableWhenFull = false) {
  const previousValue = select.value;
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = emptyLabel;
  const options = entries.map((entry) => {
    const option = document.createElement("option");
    option.value = entry.id;
    option.textContent = label(entry);
    if (disableWhenFull && Number(entry.vagas) <= 0) {
      option.disabled = true;
      option.textContent += " (lotado)";
    }
    return option;
  });
  select.replaceChildren(placeholder, ...options);
  if (entries.some((entry) => String(entry.id) === previousValue)) {
    select.value = previousValue;
  }
  select.disabled = entries.length === 0 || (disableWhenFull && entries.every((entry) => Number(entry.vagas) <= 0));
}

function updateMatriculaSelects() {
  updateSelect(elements.alunoSelect, state.alunos, (aluno) => aluno.nome, "Selecione um aluno");
  updateSelect(
    elements.cursoSelect,
    state.cursos,
    (curso) => `${curso.nome} — ${curso.vagas} ${Number(curso.vagas) === 1 ? "vaga" : "vagas"}`,
    "Selecione um curso",
    true
  );
}

async function loadAlunos() {
  setLoading(elements.alunosTable, 3);
  try {
    const data = await request("/alunos");
    state.alunos = Array.isArray(data) ? data : [];
    renderAlunos();
    updateMatriculaSelects();
  } catch (error) {
    setTableMessage(elements.alunosTable, 3, "Não foi possível carregar os alunos.");
    showToast(error.message, "error");
  }
}

async function loadCursos() {
  setLoading(elements.cursosTable, 3);
  try {
    const data = await request("/cursos");
    state.cursos = Array.isArray(data) ? data : [];
    renderCursos();
    updateMatriculaSelects();
  } catch (error) {
    setTableMessage(elements.cursosTable, 3, "Não foi possível carregar os cursos.");
    showToast(error.message, "error");
  }
}

async function loadMatriculas() {
  setLoading(elements.matriculasTable, 3);
  try {
    const data = await request("/turmas");
    state.matriculas = Array.isArray(data) ? data : [];
    renderMatriculas();
  } catch (error) {
    setTableMessage(elements.matriculasTable, 3, "Não foi possível carregar as matrículas.");
    showToast(error.message, "error");
  }
}

async function submitForm(form, path, getPayload, successMessage, reload) {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await request(path, {
      method: "POST",
      body: JSON.stringify(getPayload(new FormData(form)))
    });
    form.reset();
    showToast(successMessage);
    await reload();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    button.disabled = false;
  }
}

document.querySelectorAll(".nav-link").forEach((button) => {
  button.addEventListener("click", () => {
    const sectionName = button.dataset.section;
    document.querySelectorAll(".nav-link").forEach((item) => {
      item.classList.toggle("active", item === button);
      if (item === button) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    document.querySelectorAll(".page-section").forEach((section) => {
      const active = section.id === `section-${sectionName}`;
      section.hidden = !active;
      section.classList.toggle("active", active);
    });
    elements.title.textContent = pageTitles[sectionName];
  });
});

document.querySelectorAll(".refresh-button").forEach((button) => {
  button.addEventListener("click", () => {
    const loaders = {
      alunos: loadAlunos,
      cursos: loadCursos,
      matriculas: loadMatriculas
    };
    loaders[button.dataset.refresh]();
  });
});

document.getElementById("aluno-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  submitForm(form, "/alunos", (data) => ({
    nome: data.get("nome").trim(),
    email: data.get("email").trim()
  }), "Aluno cadastrado com sucesso.", async () => {
    await loadAlunos();
  });
});

document.getElementById("curso-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  submitForm(form, "/cursos", (data) => ({
    nome: data.get("nome").trim(),
    vagas: Number(data.get("vagas"))
  }), "Curso cadastrado com sucesso.", async () => {
    await loadCursos();
  });
});

document.getElementById("matricula-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  submitForm(form, "/turmas", (data) => ({
    aluno_id: Number(data.get("aluno_id")),
    curso_id: Number(data.get("curso_id"))
  }), "Matrícula realizada com sucesso.", async () => {
    await Promise.all([loadMatriculas(), loadCursos()]);
  });
});

Promise.all([loadAlunos(), loadCursos(), loadMatriculas()]);
