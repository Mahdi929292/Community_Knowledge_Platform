document.addEventListener("DOMContentLoaded", async () => {
    const welcomeMessage = document.getElementById("welcome-message");
    const profileTitle = document.getElementById("profile-title");
    const userEmailElement = document.getElementById("user-email");
    const userPostsElement = document.getElementById("user-posts");

    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email"); 

    if (!username) {
        alert("User not logged in. Redirecting to login page.");
        window.location.href = "login.html";
        return;
    }

    welcomeMessage.textContent = `Welcome, ${username}`;
    profileTitle.textContent = `Profile of ${username}`;
    
    if (email) {
        userEmailElement.textContent = `Email: ${email}`;
    } else {
        userEmailElement.textContent = "Email: Not available.";
    }

    try {
        const postsResponse = await fetch(`https://localhost:7024/api/Users/${username}/posts`);
        if (!postsResponse.ok) throw new Error("Failed to fetch user posts.");

        const posts = await postsResponse.json();

        if (posts && posts.length > 0) {
            userPostsElement.innerHTML = posts.map(post => `
                <article>
                    <h3><a href="post-details.html?postId=${post.postID}">${post.title}</a></h3>
                    <p>${post.description}</p>
                    <button class="delete-post" data-post-id="${post.postID}">Delete</button>
                </article>
            `).join("");
        } else {
            userPostsElement.innerHTML = "<p>You have no posts yet.</p>";
        }

        document.querySelectorAll(".delete-post").forEach(button => {
            button.addEventListener("click", async (event) => {
                const postID = event.target.dataset.postId;

                if (confirm("Are you sure you want to delete this post?")) {
                    try {
                        const deleteResponse = await fetch(`https://localhost:7024/api/Posts/${postID}`, {
                            method: "DELETE"
                        });

                        if (deleteResponse.ok) {
                            alert("Post deleted successfully.");
                            event.target.closest("article").remove();
                        } else if (deleteResponse.status === 404) {
                            alert("Post not found.");
                        } else {
                            throw new Error("Failed to delete the post.");
                        }
                    } catch (error) {
                        console.error("Error deleting post:", error);
                        alert("An error occurred while deleting the post.");
                    }
                }
            });
        });
    } catch (error) {
        console.error("Error loading user posts:", error);
        userPostsElement.innerHTML = "<p>There are no posts yet!</p>";
    }
});
document.addEventListener("DOMContentLoaded", async () => {
    const welcomeMessage = document.getElementById("welcome-message");
    const profileTitle = document.getElementById("profile-title");
    const userEmailElement = document.getElementById("user-email");
    const userPostsElement = document.getElementById("user-posts");

    const editUsernameForm = document.getElementById("edit-username-form");
    const editPasswordForm = document.getElementById("edit-password-form");

    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    if (!username) {
        alert("User not logged in. Redirecting to login page.");
        window.location.href = "login.html";
        return;
    }

    welcomeMessage.textContent = `Welcome, ${username}`;
    profileTitle.textContent = `Profile of ${username}`;
    userEmailElement.textContent = email ? `Email: ${email}` : "Email: Not available.";

    try {
        const postsResponse = await fetch(`https://localhost:7024/api/Users/${username}/posts`);
        if (!postsResponse.ok) throw new Error("Failed to fetch user posts.");
        const posts = await postsResponse.json();

        if (posts && posts.length > 0) {
            userPostsElement.innerHTML = posts.map(post => `
                <article>
                    <h3><a href="post-details.html?postId=${post.postID}">${post.title}</a></h3>
                    <button class="edit-post" data-post-id="${post.postID}">Edit</button>
                    <button class="delete-post" data-post-id="${post.postID}">Delete</button>
                </article>
            `).join("");
        } else {
            userPostsElement.innerHTML = "<p>You have no posts yet.</p>";
        }

        document.querySelectorAll(".edit-post").forEach(button => {
            button.addEventListener("click", async (event) => {
                const postID = event.target.dataset.postId;
                const newTitle = prompt("Enter new title:");
                const newDescription = prompt("Enter new description:");

                if (newTitle && newDescription) {
                    try {
                        const editResponse = await fetch(`https://localhost:7024/api/Posts/${postID}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ title: newTitle, description: newDescription }),
                        });

                        if (!editResponse.ok) throw new Error("Failed to edit post.");
                        alert("Post updated successfully!");
                        location.reload();
                    } catch (error) {
                        console.error("Error editing post:", error);
                        alert("Error updating post.");
                    }
                }
            });
        });

        document.querySelectorAll(".delete-post").forEach(button => {
            button.addEventListener("click", async (event) => {
                const postID = event.target.dataset.postId;
                if (confirm("Are you sure you want to delete this post?")) {
                    try {
                        const deleteResponse = await fetch(`https://localhost:7024/api/Posts/${postID}`, { method: "DELETE" });
                        if (!deleteResponse.ok) throw new Error("Failed to delete post.");
                        alert("Post deleted successfully.");
                        event.target.closest("article").remove();
                    } catch (error) {
                        console.error("Error deleting post:", error);
                        alert("Error deleting post.");
                    }
                }
            });
        });
    } catch (error) {
        console.error("Error loading posts:", error);
        userPostsElement.innerHTML = "<p>Error loading posts.</p>";
    }

    editUsernameForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const newUsername = document.getElementById("new-username").value.trim();
        if (newUsername) {
            try {
                const response = await fetch(`https://localhost:7024/api/Users/${username}/username`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ newUsername }),
                });

                if (!response.ok) throw new Error("Failed to update username.");
                alert("Username updated successfully!");
                localStorage.setItem("username", newUsername);
                location.reload();
            } catch (error) {
                console.error("Error updating username:", error);
                alert("Error updating username.");
            }
        }
    });

    editPasswordForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const newPassword = document.getElementById("new-password").value.trim();
        if (newPassword) {
            try {
                const response = await fetch(`https://localhost:7024/api/Users/${username}/password`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ newPassword }),
                });

                if (!response.ok) throw new Error("Failed to update password.");
                alert("Password updated successfully!");
            } catch (error) {
                console.error("Error updating password:", error);
                alert("Error updating password.");
            }
        }
    });
});

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
