const welcomeMessage = document.getElementById("welcome-message");
        const username = localStorage.getItem("username") || "User"; 
        welcomeMessage.textContent = `Welcome, ${username}`;

        function logout() {
            localStorage.removeItem("userID");
            localStorage.removeItem("username");
            window.location.href = "login.html";}


async function loadPosts() {
    const postsContainer = document.getElementById("posts-container");

    try {
        const response = await fetch("https://localhost:7024/api/posts");
        if (!response.ok) {
            throw new Error("Failed to fetch posts.");
        }

        const posts = await response.json();

        postsContainer.innerHTML = "";

        if (posts.length === 0) {
            postsContainer.innerHTML = "<p>No posts available.</p>";
            return;
        }

        posts.forEach(async (post) => {
            const postElement = document.createElement("article");
            postElement.classList.add("post");
            postElement.innerHTML = `
                <h2><a href="post-details.html?postId=${post.postID}">${post.title}</a></h2>
                <p class='desc'>${post.description.substring(0, 100)}...</p>
                
                </div>
            `;
            postsContainer.appendChild(postElement);

            await loadComments(post.postID);
        });
    } catch (error) {
        console.error("Error loading posts:", error);
        postsContainer.innerHTML = `<p>Error loading posts: ${error.message}</p>`;
    }
}

async function loadComments(postID) {
    const commentsContainer = document.getElementById(`comments-container-${postID}`);

    try {
        const response = await fetch(`https://localhost:7024/api/posts/${postID}/comments`);
        if (!response.ok) {
            throw new Error("Failed to fetch comments.");
        }

        const comments = await response.json();

        commentsContainer.innerHTML = "";

        if (comments.length === 0) {
            commentsContainer.innerHTML = "<p>No comments yet.</p>";
            return;
        }

        comments.forEach((comment) => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            commentElement.innerHTML = `
                <p>${comment.content}</p>
                
            `;
            commentsContainer.appendChild(commentElement);
        });
    } catch (error) {
        console.error(`Error loading comments for post ${postID}:`, error);
        commentsContainer.innerHTML = `<p>Error loading comments: ${error.message}</p>`;
    }
}

document.addEventListener("DOMContentLoaded", loadPosts);
