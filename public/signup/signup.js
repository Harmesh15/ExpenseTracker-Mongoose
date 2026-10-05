const form = document.querySelector("form");
const username = document.querySelector("#name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        let object = {
            name: username.value,
            email: email.value,
            password: password.value
        }
        const res = await axios.post("/user/signup", object);
        alert("You register successfully");
        window.location.href = "../login/login.html"
        form.reset();
        console.log(res.data);
    } catch (error) {
        console.log(error.message);
    }
})


