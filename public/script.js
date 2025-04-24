function createBlog() {
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;
    let author = document.getElementById("author").value;

    if (title === "" || body === "" || author === "") {
        alert("All fields are required!");
        return;
    }

    const newBlog = { title, body, author };

    fetch("http://localhost:5000/api/blogs", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlog)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Blog created:", data);

        let blogContainer = document.getElementById("blogs");
        let blogPost = document.createElement("div");
        blogPost.classList.add("card", "my-3", "p-3");
        blogPost.dataset.id = data._id;

        blogPost.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.body}</p>
            <small class="text-muted">By: ${data.author}</small>
            <button class="btn btn-warning btn-sm mt-2" onclick="editBlog(this)">Edit</button>
            <button class="btn btn-danger btn-sm mt-2" onclick="deleteBlog(this)">Delete</button>
        `;

        blogContainer.appendChild(blogPost);

        document.getElementById("title").value = "";
        document.getElementById("body").value = "";
        document.getElementById("author").value = "";
    })
    .catch(error => {
        console.error("Error creating blog:", error);
        alert("There was an error creating the blog. Please try again.");
    });
}

function deleteBlog(button) {
    let blogPost = button.parentElement;
    let blogId = blogPost.dataset.id; 

    console.log("Blog ID:", blogId); 

    fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Blog deleted successfully") {
            blogPost.remove();  
        } else {
            alert("Error deleting blog.");
        }
    })
    .catch(error => {
        console.error("Error deleting blog:", error);
        alert("There was an error deleting the blog. Please try again.");
    });
}

function editBlog(button) {
    let blogPost = button.parentElement;
    let blogId = blogPost.dataset.id; 

    let title = blogPost.querySelector("h3").innerText;
    let body = blogPost.querySelector("p").innerText;
    let author = blogPost.querySelector("small").innerText.replace("By: ", "");

    document.getElementById("title").value = title;
    document.getElementById("body").value = body;
    document.getElementById("author").value = author;

    document.getElementById("updateBtn").dataset.id = blogId;
    document.getElementById("updateBtn").style.display = "block";
    document.getElementById("createBtn").style.display = "none";
}

document.addEventListener("DOMContentLoaded", fetchBlogs);

function fetchBlogs() {
    fetch("http://localhost:5000/api/blogs")
        .then(response => response.json())
        .then(blogs => {
            let blogsContainer = document.getElementById("blogs");
            blogsContainer.innerHTML = "";

            blogs.forEach(blog => {
                let blogPost = document.createElement("div");
                blogPost.classList.add("card", "p-3", "mb-3");
                blogPost.setAttribute("data-id", blog._id);

                blogPost.innerHTML = `
                    <h3>${blog.title}</h3>
                    <p>${blog.body}</p>
                    <small>By: ${blog.author}</small>
                    <button class="btn btn-warning mt-2 editBtn" data-id="${blog._id}">Edit</button>
                    <button class="btn btn-danger mt-2 deleteBtn" data-id="${blog._id}">Delete</button>
                `;

                blogsContainer.appendChild(blogPost);
            });

            document.querySelectorAll(".editBtn").forEach(button => {
                button.addEventListener("click", function () {
                    let blogId = this.dataset.id;
                    editBlog(blogId);
                });
            });

            document.querySelectorAll(".deleteBtn").forEach(button => {
                button.addEventListener("click", function () {
                    let blogId = this.dataset.id;
                    deleteBlog(blogId);
                });
            });
        })
        .catch(error => console.error("Error fetching blogs:", error));
}

function createBlog() {
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;
    let author = document.getElementById("author").value;

    if (!title || !body || !author) {
        alert("All fields are required!");
        return;
    }

    const newBlog = { title, body, author };

    fetch("http://localhost:5000/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlog)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Blog created:", data);
        fetchBlogs();
        document.getElementById("title").value = "";
        document.getElementById("body").value = "";
        document.getElementById("author").value = "";
    })
    .catch(error => console.error("Error creating blog:", error));
}

function editBlog(blogId) {
    fetch(`http://localhost:5000/api/blogs/${blogId}`)
        .then(response => response.json())
        .then(blog => {
            document.getElementById("title").value = blog.title;
            document.getElementById("body").value = blog.body;
            document.getElementById("author").value = blog.author;

            document.getElementById("updateBtn").dataset.id = blogId;
            document.getElementById("updateBtn").style.display = "block";
            document.getElementById("createBtn").style.display = "none";
        })
        .catch(error => console.error("Error fetching blog for edit:", error));
}

function updateBlog() {
    let blogId = document.getElementById("updateBtn").dataset.id;
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;
    let author = document.getElementById("author").value;

    if (!title || !body || !author) {
        alert("All fields are required!");
        return;
    }

    const updatedBlog = { title, body, author };

    fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBlog)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Blog updated:", data);
        fetchBlogs();

        document.getElementById("title").value = "";
        document.getElementById("body").value = "";
        document.getElementById("author").value = "";

        document.getElementById("updateBtn").style.display = "none";
        document.getElementById("createBtn").style.display = "block";
    })
    .catch(error => console.error("Error updating blog:", error));
}

function deleteBlog(blogId) {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    fetch(`http://localhost:5000/api/blogs/${blogId}`, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then(() => {
        console.log("Blog deleted:", blogId);
        fetchBlogs();
    })
    .catch(error => console.error("Error deleting blog:", error));
}
