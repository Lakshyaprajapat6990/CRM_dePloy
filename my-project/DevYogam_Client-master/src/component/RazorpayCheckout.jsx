import React, { useEffect } from "react";
import { baseURL } from "../utils/constant/Constant";
import { useLocation } from "react-router-dom";

export default function RazorpayCheckout() {
  const location = useLocation();
  const amount = location.state?.amount || 500;
  const participants = location.state?.participants;
  const username = location.state?.username || "";
  const userGotra = location.state?.userGotra || "";
  const mobile = location.state?.mobile || "";
  const id = location.state?.id || "";
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  console.log("location data----> ", location);
  const handlePayment = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      const result = await fetch(`${baseURL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          username,
          userGotra,
          mobile,
          pooja: id,
          participants: participants,
        }),
      });
      const data = await result.json();
      const options = {
        key: "rzp_live_RHWbkMMBTyv7oi",
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "Dev Yogam",
        description: "Transaction",
        order_id: data?.order?.id,
        handler: async function (response) {
          const verifyRes = await fetch(
            `${baseURL}/api/payment/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                amount: amount,
                username,
                userGotra,
                mobile,
                pooja: id,
                participants: participants,
              }),
            }
          );
          const verifyData = await verifyRes.json();
          // alert(verifyData.message);
          if (verifyData.message === "Payment verified successfully") {
            if (
              window.confirm(
                "✅ Payment successful! Click OK to go to homepage."
              )
            ) {
              window.location.href = "/"; 
            }
          } else {
            alert(`${verifyData.message || "Payment verification failed"}`);
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      alert("Payment failed");
    }
  };

  useEffect(() => {
    handlePayment();
  }, []);

  return null;
}
