document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("empresaForm");

  const VALIDATE_URL =
    "https://elevagestaofinanceira.app.n8n.cloud/webhook/validar-cliente";
  // CADASTRO_URL não é mais usado, o form envia direto pelo action


  const inputCodigo = document.getElementById("clienteCode");
  const inputRS = document.getElementById("razaoSocial");
  const inputNF = document.getElementById("nomeFantasia");
  const inputCNPJ = document.getElementById("cnpj");
  const btnValidar = document.getElementById("btnValidar");
  const btnSubmit = document.getElementById("btnSubmit");
  const extraFields = document.getElementById("extraFields");

  const CNPJ_FMT_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  const onlyDigits = (v) => String(v || "").replace(/\D/g, "");
  const normCode = (v) =>
    String(v || "")
      .trim()
      .toUpperCase();

  function setError(inputEl, message) {
    const container = inputEl.closest(".field");
    let target = container.querySelector(".error-msg");
    if (!target) {
      target = document.createElement("small");
      target.className = "error-msg";
      target.setAttribute("role", "alert");
      target.setAttribute("aria-live", "assertive");
      inputEl.insertAdjacentElement("afterend", target);
    }
    target.textContent = message || "";
    target.style.color = message ? "red" : "";
    if (message) {
      inputEl.setAttribute("aria-invalid", "true");
      inputEl.style.borderColor = "red";
    } else {
      inputEl.removeAttribute("aria-invalid");
      inputEl.style.borderColor = "#000";
    }
  }

  function clearError(inputEl) {
    setError(inputEl, "");
  }

  function setLoading(btn, loading, idleLabel = "Processar") {
    if (loading) {
      btn.dataset._label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Processando...";
    } else {
      btn.disabled = false;
      btn.textContent = btn.dataset._label || idleLabel;
    }
  }

  function showExtraFields() {
    extraFields.classList.remove("hidden");
    btnValidar.style.display = "none";
    inputCodigo.readOnly = true;
  }

  function hideExtraFields() {
    extraFields.classList.add("hidden");
    btnValidar.style.display = "inline-block";
    inputCodigo.readOnly = false;
  }

  function resetFormState() {
    [inputCodigo, inputRS, inputNF, inputCNPJ].forEach(clearError);
    hideExtraFields();
    inputCodigo.focus();
  }

  form.setAttribute("novalidate", "");

  [inputCodigo, inputRS, inputNF, inputCNPJ].forEach((el) => {
    el.addEventListener("input", () => clearError(el));
  });

  btnValidar.addEventListener("click", async () => {
    const code = normCode(inputCodigo.value);
    if (!code) {
      setError(inputCodigo, "Informe o código do cliente.");
      return;
    }
    clearError(inputCodigo);
    setLoading(btnValidar, true, "Validar");

    try {
      const resp = await fetch(VALIDATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ cliente_code: code }),
      });

      let data = {};
      try {
        data = await resp.json();
      } catch (_) {}

      if (!(resp.ok && data?.ok === true)) {
        setError(inputCodigo, data?.error || "Código inválido ou inativo.");
        return;
      }

      inputCodigo.value = code;
      showExtraFields();
      inputRS.focus();
    } catch (_) {
      setError(inputCodigo, "Não foi possível validar. Tente novamente.");
    } finally {
      setLoading(btnValidar, false, "Validar");
    }
  });

  form.addEventListener("submit", (e) => {

    const cliente_code = normCode(inputCodigo.value);
    if (!cliente_code) {
      setError(inputCodigo, "Valide primeiro o código do cliente.");
      e.preventDefault();
      return;
    }

    const razao_social = String(inputRS.value || "").trim();
    const nome_fantasia = String(inputNF.value || "").trim();
    const cnpjRaw = String(inputCNPJ.value || "").trim();
    const cnpjDigits = onlyDigits(cnpjRaw);

    let ok = true;

    if (!razao_social) {
      setError(inputRS, "Informe a razão social.");
      ok = false;
    }

    if (!nome_fantasia) {
      setError(inputNF, "Informe o nome fantasia.");
      ok = false;
    }

    if (!(CNPJ_FMT_REGEX.test(cnpjRaw) || cnpjDigits.length === 14)) {
      setError(inputCNPJ, "CNPJ deve ter 14 dígitos (apenas números).");
      ok = false;
    }

    if (!ok) {
      e.preventDefault();
      return;
    }

    setLoading(btnSubmit, true, "Cadastrar");
  });

  form.addEventListener("reset", () => {
    setTimeout(() => resetFormState(), 0);
  });
});

// JAVASCRIPT ANTERIOR
// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("empresaForm");

//   // ===== Endpoints do n8n =====
//   const VALIDATE_URL =
//     "https://elevagestaofinanceira.app.n8n.cloud/webhook/validar-cliente";
//   const CADASTRO_URL =
//     "https://elevagestaofinanceira.app.n8n.cloud/webhook/cadastroempresa";

//   // ===== Elementos =====
//   const inputCodigo = document.getElementById("clienteCode");
//   const inputRS = document.getElementById("razaoSocial");
//   const inputNF = document.getElementById("nomeFantasia");
//   const inputCNPJ = document.getElementById("cnpj");
//   const btnValidar = document.getElementById("btnValidar");
//   const btnSubmit = document.getElementById("btnSubmit");
//   const extraFields = document.getElementById("extraFields");

//   // ===== Helpers =====
//   const CNPJ_FMT_REGEX = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
//   const onlyDigits = (v) => String(v || "").replace(/\D/g, "");
//   const normCode = (v) =>
//     String(v || "")
//       .trim()
//       .toUpperCase();

//   function setError(inputEl, message) {
//     const container = inputEl.closest(".field");
//     let target = container.querySelector(".error-msg");
//     if (!target) {
//       target = document.createElement("small");
//       target.className = "error-msg";
//       target.setAttribute("role", "alert");
//       target.setAttribute("aria-live", "assertive");
//       inputEl.insertAdjacentElement("afterend", target);
//     }
//     target.textContent = message || "";
//     target.style.color = message ? "red" : "";
//     if (message) {
//       inputEl.setAttribute("aria-invalid", "true");
//       inputEl.style.borderColor = "red";
//     } else {
//       inputEl.removeAttribute("aria-invalid");
//       inputEl.style.borderColor = "#000";
//     }
//   }

//   function clearError(inputEl) {
//     setError(inputEl, "");
//   }

//   function setLoading(btn, loading, idleLabel = "Processar") {
//     if (loading) {
//       btn.dataset._label = btn.textContent;
//       btn.disabled = true;
//       btn.textContent = "Processando...";
//     } else {
//       btn.disabled = false;
//       btn.textContent = btn.dataset._label || idleLabel;
//     }
//   }

//   function showExtraFields() {
//     extraFields.classList.remove("hidden");
//     btnValidar.style.display = "none";
//     inputCodigo.readOnly = true;
//   }

//   function hideExtraFields() {
//     extraFields.classList.add("hidden");
//     btnValidar.style.display = "inline-block";
//     inputCodigo.readOnly = false;
//   }

//   function resetFormState() {
//     // limpa erros
//     [inputCodigo, inputRS, inputNF, inputCNPJ].forEach(clearError);
//     // limpa campos (o próprio reset do form fará isso também)
//     hideExtraFields();
//     inputCodigo.focus();
//   }

//   // desativa validação nativa; JS controla
//   form.setAttribute("novalidate", "");

//   // limpa erros enquanto digita
//   [inputCodigo, inputRS, inputNF, inputCNPJ].forEach((el) => {
//     el.addEventListener("input", () => clearError(el));
//   });

//   // ============ Etapa 1: Validar código ============
//   btnValidar.addEventListener("click", async () => {
//     const code = normCode(inputCodigo.value);
//     if (!code) {
//       setError(inputCodigo, "Informe o código do cliente.");
//       return;
//     }
//     clearError(inputCodigo);
//     setLoading(btnValidar, true, "Validar");

//     try {
//       const resp = await fetch(VALIDATE_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//         body: JSON.stringify({ cliente_code: code }),
//       });
//       let data = {};
//       try {
//         data = await resp.json();
//       } catch (_) {}

//       if (!(resp.ok && data?.ok === true)) {
//   setError(inputCodigo, data?.error || "Código inválido ou inativo.");
//   return;
// }

//       // OK → libera restante
//       inputCodigo.value = code;
//       showExtraFields();
//       inputRS.focus();
//     } catch (_) {
//       setError(inputCodigo, "Não foi possível validar. Tente novamente.");
//     } finally {
//       setLoading(btnValidar, false, "Validar");
//     }
//   });

//   // ============ Etapa 2: Submit do cadastro ============
//   form.addEventListener("submit", async (e) => {
//     e.preventDefault(); // intercepta envio padrão

//     const cliente_code = normCode(inputCodigo.value);
//     if (!cliente_code) {
//       setError(inputCodigo, "Valide primeiro o código do cliente.");
//       return;
//     }

//     const razao_social = String(inputRS.value || "").trim();
//     const nome_fantasia = String(inputNF.value || "").trim();
//     const cnpjRaw = String(inputCNPJ.value || "").trim();
//     const cnpjDigits = onlyDigits(cnpjRaw);

//     // validações mínimas
//     let ok = true;
//     if (!razao_social) {
//       setError(inputRS, "Informe a razão social.");
//       ok = false;
//     }
//     if (!nome_fantasia) {
//       setError(inputNF, "Informe o nome fantasia.");
//       ok = false;
//     }
//     // aceita formatado (CNPJ_FMT_REGEX) ou apenas dígitos (14)
//     if (!(CNPJ_FMT_REGEX.test(cnpjRaw) || cnpjDigits.length === 14)) {
//       setError(
//         inputCNPJ,
//         "CNPJ deve ter 14 dígitos (apenas números)."
//       );
//       ok = false;
//     }
//     if (!ok) return;

//     setLoading(btnSubmit, true, "Cadastrar");
//     try {
//       const resp = await fetch(CADASTRO_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Accept: "text/html" },
//         body: JSON.stringify({
//           cliente_code,
//           razao_social,
//           nome_fantasia,
//           cnpj: cnpjDigits, // normaliza para apenas dígitos
//         }),
//       });

//       const html = await resp.text();

//       if (!resp.ok) {
//         alert("Não foi possível concluir o cadastro.");
//         return;
//       }

//       // Abre o HTML retornado (página com botão "Acessar")
//       const w = window.open("", "_blank");
//       w.document.write(html);
//       w.document.close();

//       // Reseta para novo cadastro >>> TIRAR
//       form.reset();
//       resetFormState();
//     } catch (_) {
//       alert("Erro ao enviar. Tente novamente.");
//     } finally {
//       setLoading(btnSubmit, false, "Cadastrar");
//     }
//   });

//   // ============ Botão "Limpar" (reset) ============
//   form.addEventListener("reset", () => {
//     // pequeno delay para permitir que o reset limpe os campos
//     setTimeout(() => resetFormState(), 0);
//   });
// });
