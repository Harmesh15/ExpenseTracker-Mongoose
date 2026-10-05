const cashfree = Cashfree({
  mode: "sandbox",
});

document.getElementById("renderBtn").addEventListener("click", async () => {
  try {
    // Fetch payment session ID from backend
    const response = await fetch("/pay", {
      method: "POST",
    });

    const data = await response.json();
    const paymentSessionId = data.paymentSessionId;

    // Initialize checkout options
    let checkoutOptions = {
      paymentSessionId: paymentSessionId,

      //? Inline payment options
      redirectTarget: document.getElementById("cf_checkout"),
      appearance: {
        width: "325px",
        height: "325px",
      },
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

      const response = await fetch(
        `/payment-status/${orderId}`,
        {
          method: "GET",
        },
      );
      const data = await response.json();
      alert("Your payment is " + data.orderStatus);
    }
  } catch (err) {
    console.error("Error:", err);
  }
});
