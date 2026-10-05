const urlParams = new URLSearchParams(window.location.search);
const requestId = urlParams.get("requestId");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const password1 = document.getElementById("password1").value;
  const password2 = document.getElementById("password2").value;

  if (password1 !== password2) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await axios.post("/password/savepassword", {
      password: password2,
      requestId: requestId,
    });

    alert("Password reset successfully");
    console.log(res.data);
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
});
