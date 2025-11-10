document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("empresaForm");
    const empresaIdInput = form.querySelector("input[name='empresa_id']");
    const cnpjInput = form.querySelector("input[name='cnpj']");

    // Desativa balões/erros nativos e deixa o JS controlar tudo
    form.setAttribute("novalidate", "");

    // Regex aceitando "apenas números (14 dígitos)" ou "00.000.000/0000-00"
    const CNPJ_REGEX = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

    // Helpers para exibir/limpar erros
    function showError(inputEl, message, targetId) {
      // container <label class="field"> ... </label>
      const container = inputEl.closest(".field");
      // remove erros antigos no container
      container.querySelectorAll(".error-msg").forEach((el) => el.remove());

      let target = targetId ? document.getElementById(targetId) : null;
      if (!target) {
        target = document.createElement("small");
        target.className = "error-msg";
        target.setAttribute("role", "alert");
        target.setAttribute("aria-live", "assertive");
        // insere logo após o input
        inputEl.insertAdjacentElement("afterend", target);
      }

      target.textContent = message;
      target.style.color = "red";
      inputEl.setAttribute("aria-invalid", "true");
      inputEl.style.borderColor = "red";
    }

    function clearError(inputEl) {
      const container = inputEl.closest(".field");
      container.querySelectorAll(".error-msg").forEach((el) => el.remove());
      inputEl.removeAttribute("aria-invalid");
      inputEl.style.borderColor = "#000";
      // limpa placeholder de erro dedicado (Empresa ID)
      const errEmpresaId = document.getElementById("errEmpresaId");
      if (errEmpresaId) errEmpresaId.textContent = "";
    }

    // Limpa erro enquanto o usuário digita
    [empresaIdInput, cnpjInput].forEach((el) => {
      el.addEventListener("input", () => clearError(el));
    });

    form.addEventListener("submit", (e) => {
      let isValid = true;

      // --- Empresa ID (obrigatório) ---
      if (empresaIdInput.value.trim() === "") {
        showError(
          empresaIdInput,
          "O campo Empresa ID é obrigatório.",
          "errEmpresaId" // já existe no HTML
        );
        isValid = false;
      }

      // --- CNPJ (se preenchido, precisa ser numérico/formato válido) ---
      const cnpjValue = cnpjInput.value.trim();
      if (cnpjValue !== "" && !CNPJ_REGEX.test(cnpjValue)) {
        showError(
          cnpjInput,
          "O CNPJ deve conter apenas números (14 dígitos) ou estar no formato 00.000.000/0000-00."
        );
        isValid = false;
      }

      if (!isValid) {
        e.preventDefault();
        // foca no primeiro campo inválido
        (empresaIdInput.getAttribute("aria-invalid") === "true"
          ? empresaIdInput
          : cnpjInput
        ).focus();
      }
    });
  });