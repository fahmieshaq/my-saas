"use client";

import axios from "axios"; // We need to import axios to make the POST request to our API route

const ButtonCheckout = () => {
  const handleSubscribe = async () => {
    try {
      // The first url takes the endpoint and the second parameter has
      // what we need to include in the json request body.
      const response = await axios.post("/api/billing/create-checkout", {
        // DEV > http://localhost:3000/dashboard/success
        // PROD > https://my-saas.com/dashboard/success
        successUrl: window.location.href + "/success", // window.location.href gives you the current url
        cancelUrl: window.location.href, // Once user presses cancel, we take them back to the current page that is just before the checkout page
      });

      // In the data part of the response, there will be a key called url. Its the url of the checkout
      const checkoutUrl = response.data.url;

      // Redirect the user to the checkout page
      window.location.href = checkoutUrl;
    } catch (e) {
        console.log("Error creating checkout session:", e);
    }
  };

  return (
    <button className="btn btn-neutral" onClick={() => handleSubscribe()}>
      Subscribe
    </button>
  );
};

export default ButtonCheckout;
