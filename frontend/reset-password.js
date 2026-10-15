const API_URL = `${window.location.protocol === "file:" ? "http:" : window.location.protocol}//${window.location.hostname || "localhost"}:3000`;
const resetForm = document.getElementById("reset-form");
const feedback = document.getElementById("reset-feedback");
const token = new URLSearchParams(window.location.search).get("token");

function setFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.classList.toggle("error", type === "error");
  feedback.classList.toggle("success", type === "success");
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("gestao-escolar-theme", theme);
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const isDark = theme === "dark";
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", isDark ? "Ativar modo claro" : "Ativar modo escuro");
    button.querySelector("[aria-hidden]").textContent = isDark ? "☀" : "☾";
    button.querySelector(".theme-label").textContent = isDark ? "Modo claro" : "Modo escuro";
  });
}

document.getElementById("current-year").textContent = new Date().getFullYear();
const savedTheme = localStorage.getItem("gestao-escolar-theme");
applyTheme(savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
document.querySelector("[data-theme-toggle]").addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

if (!token) {
  resetForm.querySelectorAll("input, button").forEach((element) => {
    element.disabled = true;
  });
  setFeedback("Este link de recuperação está incompleto. Solicite um novo link.", "error");
}

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!token) return;
  const formData = new FormData(resetForm);
  const novaSenha = formData.get("novaSenha");
  if (novaSenha !== formData.get("confirmacao")) {
    setFeedback("As senhas não correspondem.", "error");
    document.getElementById("confirm-password").focus();
    return;
  }

  const button = resetForm.querySelector('[type="submit"]');
  button.disabled = true;
  setFeedback();
  try {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, novaSenha })
    });
    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json") ? await response.json() : await response.text();
    if (!response.ok) {
      throw new Error(typeof data === "string" ? data : data.mensagem || data.message || "Não foi possível redefinir a senha.");
    }
    setFeedback(data.mensagem || "Senha alterada com sucesso.", "success");
    resetForm.hidden = true;
    document.getElementById("login-link").hidden = false;
  } catch (error) {
    setFeedback(error.message || "Não foi possível conectar à API. Verifique se o servidor está rodando.", "error");
  } finally {
    button.disabled = false;
  }
});
