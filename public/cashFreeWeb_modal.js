const cashfree = Cashfree({
  mode: "sandbox",
});

console.log("model m redirect hokar aagyi");

document.getElementById("renderBtn").addEventListener("click", async () => {
  try {
    let token = localStorage.getItem("token");

    // Fetch payment session ID from backend
    const response = await axios.post("/pay", {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = response.data;
    console.log("response pay is", data);
    const paymentSessionId = data.paymentSessionId;
    const orderId = data.orderId;

    // Initialize checkout options
    let checkoutOptions = {
      paymentSessionId: paymentSessionId,

      //? Modal payment options
      redirectTarget: "_modal",
    };

    // Start the checkout process
    const result = await cashfree.checkout(checkoutOptions);

    if (result.error) {
      // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
      console.log(
        "User has closed the popup or there is some payment error, Check for Payment Status",
      );
      console.log(result.error);
    }
    if (result.redirect) {
      // This will be true when the payment redirection page couldn't be opened in the same window
      // This is an exceptional case only when the page is opened inside an inAppBrowser
      // In this case the customer will be redirected to return url once payment is completed
      console.log("Payment will be redirected");
    }
    if (result.paymentDetails) {
      // This will be called whenever the payment is completed irrespective of transaction status
      console.log("Payment has been completed, Check for Payment Status");
      console.log(result.paymentDetails.paymentMessage);

      const response = await axios.get(`/payment/payment-status/${orderId}`);
      console.log("payemenet status is ", response);
      const data = response.data;
      alert("Your payment is " + data.orderStatus);
    }
  } catch (err) {
    console.error("Error:", err);
  }
});
