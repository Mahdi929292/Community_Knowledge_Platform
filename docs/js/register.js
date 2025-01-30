const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const userData = {
        username,
        email,
        passwordHash: password, 
        role,
        reputationPoints: 0 
    };

    try {
        const response = await fetch("https://localhost:7024/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response from server:", errorData);
            alert(`Error: ${errorData.message || "An error occurred during registration."}`);
            return;
        }

        const result = await response.json();
        console.log("User created successfully:", result);
        alert("Registration successful!");
        window.location.href = "login.html";
    } catch (error) {
        console.error("Network or server error:", error);
        alert("A network error occurred. Please try again.");
    }
});
