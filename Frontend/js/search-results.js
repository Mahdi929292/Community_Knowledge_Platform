const welcomeMessage = document.getElementById("welcome-message");
        const username = localStorage.getItem("username") || "User"; 
        welcomeMessage.textContent = `Welcome, ${username}`;
document.addEventListener("DOMContentLoaded", () => {
    const resultsContainer = document.getElementById("results-container");
    const urlParams = new URLSearchParams(window.location.search);
    const resultsData = urlParams.get("data");

    if (!resultsData) {
        resultsContainer.innerHTML = "<p>No search results to display.</p>";
        return;
    }

    const results = JSON.parse(decodeURIComponent(resultsData));

    if (results.length === 0) {
        resultsContainer.innerHTML = "<p>No posts found matching your search.</p>";
        return;
    }

    resultsContainer.innerHTML = "";

    results.forEach(post => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.description}</p>
            <a href="post-details.html?postId=${post.postID}">View Details</a>
        `;
        resultsContainer.appendChild(postElement);
    });
});
