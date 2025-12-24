// Seleção de elementos
const tabRegister = document.getElementById("tabRegister");
const tabLogin = document.getElementById("tabLogin");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

// Alternar abas
tabRegister.addEventListener("click", () => {
    registerForm.style.display = "block";
    loginForm.style.display = "none";
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    mensagem.textContent = "";
});

tabLogin.addEventListener("click", () => {
    registerForm.style.display = "none";
    loginForm.style.display = "block";
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    mensagem.textContent = "";
});

// Função para mostrar mensagens
function mostrarMensagem(texto, cor = "red") {
    mensagem.style.color = cor;
    mensagem.textContent = texto;
}

// Cadastro
document.getElementById("btnRegister").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!username || !email || !senha) {
        mostrarMensagem("Preencha todos os campos!");
        return;
    }

    try {
        const res = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, senha })
        });

        const data = await res.json();

        if (res.ok) {
            mostrarMensagem(data.mensagem, "green");
        } else {
            mostrarMensagem(data.erro);
        }
    } catch (err) {
        mostrarMensagem("Erro ao conectar com o servidor");
    }
});

// Login
document.getElementById("btnLogin").addEventListener("click", async () => {
    const login = document.getElementById("login").value;
    const senha = document.getElementById("loginSenha").value;

    if (!login || !senha) {
        mostrarMensagem("Preencha todos os campos!");
        return;
    }

    try {
        const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login, senha })

        });

        const data = await res.json();

        if (res.ok) {
            mostrarMensagem(data.mensagem + " (ID: " + data.userId + ")", "green");
            // Aqui você pode salvar o token no futuro, quando adicionarmos JWT
        } else {
            mostrarMensagem(data.erro);
        }
    } catch (err) {
        mostrarMensagem("Erro ao conectar com o servidor");
    }
});
