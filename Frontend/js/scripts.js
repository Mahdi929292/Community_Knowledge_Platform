document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");

    const welcomeMessage = document.getElementById("welcome-message");
    if (username) {
        welcomeMessage.textContent = `Welcome ${username}`;
    }
});

function logout() {
    localStorage.removeItem("username");

    window.location.href = "login.html";
}
