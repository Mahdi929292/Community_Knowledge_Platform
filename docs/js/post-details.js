const welcomeMessage = document.getElementById("welcome-message");
const username = localStorage.getItem("username") || "User"; 
welcomeMessage.textContent = `Welcome, ${username}`;

function logout() {
    localStorage.removeItem("userID");
    localStorage.removeItem("username");
    window.location.href = "login.html";
}

const postId = new URLSearchParams(window.location.search).get("postId");
const postContainer = document.getElementById("post-container");
const commentsContainer = document.getElementById("comments-container");
const upvoteButton = document.getElementById("upvote-button");
const downvoteButton = document.getElementById("downvote-button");
const voteCount = document.getElementById("vote-count");
const commentForm = document.getElementById("comment-form");
const commentInput = document.getElementById("comment-input");

let currentVotes = 0;
let hasUpvoted = false;
let hasDownvoted = false;

document.getElementById("logout-link").addEventListener("click", logout);

async function fetchPost() {
    try {
        const response = await fetch(`https://localhost:7024/api/Posts/${postId}`);
        if (!response.ok) throw new Error("Failed to fetch post.");
        const post = await response.json();

        document.getElementById("post-title").textContent = post.title;
        document.getElementById("post-content").textContent = post.description;
        currentVotes = post.votes || 0;
        voteCount.textContent = currentVotes;
    } catch (error) {
        console.error("Error fetching post:", error);
        postContainer.innerHTML = "<p>Error loading post.</p>";
    }
}

async function fetchComments() {
    try {
        const response = await fetch(`https://localhost:7024/api/Posts/${postId}/comments`);
        if (!response.ok) throw new Error("Failed to fetch comments.");
        const comments = await response.json();

        commentsContainer.innerHTML = "";
        if (comments.length === 0) {
            commentsContainer.innerHTML = "<p>No comments yet.</p>";
            return;
        }

        const currentUserId = localStorage.getItem("userID");

        comments.forEach(comment => {
            const commentElement = document.createElement("div");
            commentElement.classList.add("comment");
            commentElement.innerHTML = `
                <p><strong>${comment.userName}:</strong> ${comment.content}</p>
                ${
                    comment.userID === parseInt(currentUserId, 10) 
                        ? `<button class="delete-button" onclick="deleteComment(${comment.commentID})">Delete</button>`
                        : ""
                }
            `;
            commentsContainer.appendChild(commentElement);
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        commentsContainer.innerHTML = `<p>Error loading comments: ${error.message}</p>`;
    }
}

async function deleteComment(commentID) {
    console.log("Deleting comment ID:", commentID); 
    try {
        const response = await fetch(`https://localhost:7024/api/Posts/comments/${commentID}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`, 
            }
        });
        if (!response.ok) {
            const errorData = await response.json(); 
            throw new Error(errorData.Message || `Failed to delete comment. Status: ${response.status}`);
        }
        alert("Comment deleted successfully.");
        await fetchComments();
    } catch (error) {
        console.error("Error deleting comment:", error);
        alert(error.message || "Error deleting comment. Please try again.");
    }
}



async function postComment(content) {
    try {
        const userID = localStorage.getItem("userID");
        const userName = localStorage.getItem("username"); 

        const response = await fetch(`https://localhost:7024/api/posts/${postId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userID,
                userName, 
                content,
            }),
        });

        if (!response.ok) throw new Error("Failed to post comment.");
        commentInput.value = ""; 
        await fetchComments(); 
    } catch (error) {
        console.error("Error posting comment:", error);
        alert("Error posting comment.");
    }
}

commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = commentInput.value.trim();
    if (content) {
        postComment(content);
    }
});

async function updateVotes(action) {
    try {
        const response = await fetch(`https://localhost:7024/api/posts/${postId}/votes`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(action),
        });
        if (!response.ok) throw new Error("Failed to update votes.");
    } catch (error) {
        console.error("Error updating votes:", error);
    }
}

upvoteButton.addEventListener("click", async () => {
    if (!hasUpvoted) {
        currentVotes++;
        voteCount.textContent = currentVotes;
        hasUpvoted = true;
        hasDownvoted = false;
        await updateVotes("upvote"); 
    }
});

downvoteButton.addEventListener("click", async () => {
    if (!hasDownvoted) {
        currentVotes--;
        voteCount.textContent = currentVotes;
        hasUpvoted = false;
        hasDownvoted = true;
        await updateVotes("downvote");
    }
});


document.addEventListener("DOMContentLoaded", () => {
    fetchPost();
    fetchComments();
});
