const form = document.querySelector('form');
const email = document.querySelector('#email');
const forgotpassbtn = document.querySelector('#fpswd');
const password = document.querySelector('#password');

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        let object = {
            email: email.value,
            password: password.value
        }
        const response = await axios.post(
            "/user/login", object
        )
        alert("you loging successfully");

        const token = localStorage.setItem('token', response.data.token)
        window.location.href = "../Expense.html"
        console.log(response.data.token);
    } catch (error) {
        console.log(error.response.data.message);
        alert("something went wrong");
    }
})

forgotpassbtn.addEventListener('click', async () => {
    try {
        console.log("Clicked on Forgate button");
        const response = await axios.post("/password/sendmail", {
            email: email.value,
        })
        alert("Reset password mail send");
    } catch (err) {
        console.log(err.message)
    }
})




/////////////////////////////////// practice  /////////////////////////////////////////////////////

// socket.on("connection", (socket) => {
//     console.log("connnection stablish");
// })

// socket.emit("send_message", messageObkect);

// // in backend

// socket.io("send_message", (socket) => {
//     socket.emit("received message", (msg) => {
//         io.emit(msg);
//     })
// })