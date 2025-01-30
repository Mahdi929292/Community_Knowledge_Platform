const welcomeMessage = document.getElementById("welcome-message");
const username = localStorage.getItem("username") || "User";
welcomeMessage.textContent = `Welcome, ${username}`;

function logout() {
    localStorage.removeItem("userID");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

document.getElementById("createPostForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const userID = parseInt(localStorage.getItem("userID"), 10);

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const categoryID = parseInt(document.getElementById("category").value, 10);

    if (!title || !description || isNaN(categoryID)) {
        alert("Title, description, and category are required.");
        return;
    }

    const postData = {
        postID: 0, 
        userID,
        title,
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(), 
        categoryID,
        comments: null 
    };

    console.log("Payload being sent:", JSON.stringify(postData));

    try {
        const response = await fetch("https://localhost:7024/api/Posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

        console.log("Response status:", response.status);

        if (response.ok) {
            alert("Post created successfully!");
            window.location.href = "index.html"; 
        } else {
            const error = await response.json();
            console.error("Backend error:", error);
            alert("Failed to create post: " + (error.Message || "Unknown error"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Network or server error: " + error.message);
    }
});
