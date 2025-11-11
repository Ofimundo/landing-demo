import TOKEN from './token.js';

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM cargado — formulario de referidos activo");

    // 🔹 Variables globales
    const form = document.getElementById("wizardForm");
    window.steps = document.querySelectorAll(".wizard-step");
    const progressSteps = document.querySelectorAll(".progress-step");
    const successMessage = document.getElementById("successMessage");
    window.currentStep = 1;

    // 🔹 Mostrar paso actual
    window.showStep = function (step) {
        steps.forEach((s) => s.classList.toggle("active", parseInt(s.dataset.step) === step));
        progressSteps.forEach((p, index) => {
            const isActive = index < step;
            p.classList.toggle("active", isActive);
            p.classList.toggle("bg-purple-600", isActive);
            p.classList.toggle("text-white", isActive);
            p.classList.toggle("bg-gray-200", !isActive);
        });
    };

    // 🔹 Validar correo
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // 🔹 Mostrar error debajo del campo
    function showError(field, message) {
        removeError(field); // eliminar mensaje anterior si existe
        const error = document.createElement("p");
        error.className = "text-red-500 text-sm mt-1 error-message";
        error.textContent = message;
        field.classList.add("border-red-500");

        // Insertar mensaje después del campo
        if (field.parentNode) {
            field.parentNode.appendChild(error);
        }
    }

    // 🔹 Quitar mensaje de error
    function removeError(field) {
        field.classList.remove("border-red-500");
        const parent = field.parentNode;
        if (!parent) return;
        const oldError = parent.querySelector(".error-message");
        if (oldError) oldError.remove();
    }

    // 🔹 Avanzar al siguiente paso
    window.nextStep = function (next) {
        const current = steps[currentStep - 1];
        const currentFields = current.querySelectorAll("input[required], textarea[required], select[required]");
        let valid = true;
        let firstInvalid = null;

        currentFields.forEach((field) => {
            removeError(field); // limpiar errores previos
            const value = field.value?.trim();

            // Validación general
            if (!value) {
                valid = false;
                showError(field, "Este campo es obligatorio");
                if (!firstInvalid) firstInvalid = field;
            }

            // Validar email
            if (field.type === "email" && value && !validateEmail(value)) {
                valid = false;
                showError(field, "Ingresa un correo electrónico válido");
                if (!firstInvalid) firstInvalid = field;
            }

            // Validar checkbox
            if (field.type === "checkbox" && !field.checked) {
                valid = false;
                showError(field, "Debes marcar esta casilla");
                if (!firstInvalid) firstInvalid = field;
            }

            // Validar radio (solo una vez por grupo)
            if (field.type === "radio") {
                const radios = current.querySelectorAll(`input[type="radio"][name="${field.name}"]`);
                const isChecked = Array.from(radios).some(r => r.checked);
                if (!isChecked) {
                    valid = false;
                    if (!firstInvalid) firstInvalid = radios[0];
                    radios.forEach(r => showError(r, "Selecciona una opción"));
                }
            }
        });

        if (!valid) {
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Avanzar paso
        currentStep = next;
        showStep(currentStep);

        // Desplazamiento suave al formulario
        document.getElementById("wizardForm").scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // 🔹 Retroceder al paso anterior
    window.prevStep = function (prev) {
        currentStep = prev;
        showStep(currentStep);
        document.getElementById("wizardForm").scrollIntoView({ behavior: "smooth", block: "start" });
    };

    // 🔹 Limpiar formulario
    window.limpiarFormulario = function () {
        if (confirm("¿Estás seguro de que quieres limpiar todos los campos?")) {
            form.reset();
            currentStep = 1;
            showStep(currentStep);

            // eliminar errores visuales
            form.querySelectorAll(".error-message").forEach(e => e.remove());
            form.querySelectorAll(".border-red-500").forEach(f => f.classList.remove("border-red-500"));

            alert("El formulario ha sido limpiado y reiniciado.");
        }
    };

    // 🔹 Enviar formulario
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Limpiar errores previos
        form.querySelectorAll(".error-message").forEach(e => e.remove());
        form.querySelectorAll(".border-red-500").forEach(f => f.classList.remove("border-red-500"));

        const data = {
            referidor_nombre: document.getElementById("referidor_nombre").value.trim(),
            referidor_empresa: document.getElementById("referidor_empresa").value.trim(),
            referidor_email: document.getElementById("referidor_email").value.trim(),
            referidor_telefono: document.getElementById("referidor_telefono").value.trim(),
            referido_nombre: document.getElementById("referido_nombre").value.trim(),
            referido_empresa: document.getElementById("referido_empresa").value.trim(),
            referido_telefono: document.getElementById("referido_telefono").value.trim(),
            referido_email: document.getElementById("referido_email").value.trim(),
            referido_cargo: document.getElementById("referido_cargo").value.trim(),
            referido_info: document.getElementById("referido_info").value.trim(),
            tipo_contacto: "Corre la Voz"
        };

        // Validar campos antes de enviar
        let valid = true;
        for (let key in data) {
            if (key !== "referido_info" && data[key] === "") {
                const field = document.getElementById(key);
                if (field) showError(field, "Este campo es obligatorio");
                valid = false;
            }
        }

        if (!valid) return;

        try {
            const response = await fetch("https://www.omitec.cl/api/v1/ofimundo", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const responseBody = await response.text();
            console.log("📨 Respuesta del servidor:", response.status, responseBody);

            if (response.ok) {
                form.classList.add("hidden");
                successMessage.classList.remove("hidden");
                window.scrollTo({ top: successMessage.offsetTop, behavior: "smooth" });
            } else {
                alert(`Error ${response.status}: ${responseBody}`);
            }
        } catch (error) {
            console.error("❌ Error de conexión:", error);
            alert("No se pudo conectar con el servidor. Inténtalo nuevamente más tarde.");
        }
    });

    // Mostrar primer paso
    showStep(currentStep);
});

console.log("🧩 Funciones globales de formulario listas");
