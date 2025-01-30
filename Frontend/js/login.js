document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessageElement = document.getElementById("error-message");

    try {
        const response = await fetch("https://localhost:7024/api/users");
        
        if (!response.ok) {
            throw new Error("Failed to fetch users.");
        }

        const users = await response.json();
        
        const user = users.find(u => u.email === email && u.passwordHash === password);

        if (user) {
            alert("Login successful!");
            localStorage.setItem("userID", user.userID);
            localStorage.setItem("username", user.username);
            localStorage.setItem("email",user.email)
            localStorage.setItem("user", JSON.stringify(user));
            window.location.href = "index.html";
        } else {
            errorMessageElement.innerText = "Invalid email or password.";
        }
    } catch (err) {
        console.error(err);
        errorMessageElement.innerText = "An error occurred. Please try again.";
    }
});
