document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  const mensaje = document.getElementById('mensaje');
  const tableBody = document.querySelector("#usuariosTable tbody");

  const validarFormulario = () => {
    mensaje.textContent = "";
    const nombre = form.nombre.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!nombre || !email || !password || !confirmPassword) {
      mensaje.textContent = "Todos los campos son obligatorios.";
      return false;
    }
    if (!emailRegex.test(email)) {
      mensaje.textContent = "Formato de email inválido.";
      return false;
    }
    if (!passRegex.test(password)) {
      mensaje.textContent = "La contraseña debe tener al menos 8 caracteres, una letra mayúscula y un número.";
      return false;
    }
    if (password !== confirmPassword) {
      mensaje.textContent = "Las contraseñas no coinciden.";
      return false;
    }
    return true;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      password: form.password.value,
    };

    try {
      const res = await fetch('/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      mensaje.textContent = result.message || "";
      form.reset();
      cargarUsuarios();
    } catch (error) {
      mensaje.textContent = "Error al enviar datos.";
    }
  });

  const cargarUsuarios = async () => {
    try {
      const res = await fetch('/datos');
      const usuarios = await res.json();
      tableBody.innerHTML = "";
      usuarios.forEach(u => {
        tableBody.innerHTML += `
          <tr>
            <td>${u.id}</td>
            <td>${u.nombre}</td>
            <td>${u.email}</td>
            <td><button onclick="eliminarUsuario(${u.id})">Eliminar</button></td>
          </tr>
        `;
      });
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  window.eliminarUsuario = async (id) => {
    try {
      await fetch(`/eliminar/${id}`, { method: 'DELETE' });
      cargarUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  cargarUsuarios();
});

const verPassword = document.getElementById('verPassword');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

verPassword.addEventListener('change', () => {
  const tipo = verPassword.checked ? 'text' : 'password';
  passwordInput.type = tipo;
  confirmPasswordInput.type = tipo;
});

