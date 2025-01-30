document.addEventListener("DOMContentLoaded", async () => {
    const welcomeMessage = document.getElementById("welcome-message");
    const username = localStorage.getItem("username") || "User"; 
    welcomeMessage.textContent = `Welcome, ${username}`;

    const categorySelect = document.getElementById("category");

    try {
        const response = await fetch("https://localhost:7024/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories.");

        const categories = await response.json();

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category.categoryID;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading categories:", error);
    }
});

const searchForm = document.getElementById("search-form");

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    const query = document.getElementById("search-query").value.trim();
    const category = document.getElementById("category").value;

    if (!query) {
        alert("Please enter a search query.");
        return;
    }

    try {
        const response = await fetch(`https://localhost:7024/api/posts/search?query=${encodeURIComponent(query)}&categoryId=${category}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.Message || "Failed to fetch search results.");
        }

        const results = await response.json();

        renderSearchResults(results);
    } catch (error) {
        console.error("Error fetching search results:", error);
        alert("No such post found.");
    }
});

function renderSearchResults(results) {
    const resultsPage = `search-results.html?data=${encodeURIComponent(JSON.stringify(results))}`;
    window.location.href = resultsPage;
}
