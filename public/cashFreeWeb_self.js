const cashfree = Cashfree({
  mode: "sandbox",
});

document.getElementById("renderBtn").addEventListener("click", async () => {
  try {
    let token = localStorage.getItem("token");
    // Fetch payment session ID from backend
    const response = await axios.post("/payment/pay", {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = response.data;
    const paymentSessionId = data.paymentSessionId;

    // Initialize checkout options
    let checkoutOptions = {
      paymentSessionId: paymentSessionId,

      //? New page payment options
      redirectTarget: "_self", // (default)
    };

    // Start the checkout process
    await cashfree.checkout(checkoutOptions);
  } catch (err) {
    console.error("Error:", err);
  }
});
