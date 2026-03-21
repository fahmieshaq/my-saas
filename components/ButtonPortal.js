"use client";

import axios from "axios"; // We need to import axios to make the POST request to our API route

const ButtonPortal = () => {
  const handleBilling = async () => {
    try {
      // The first url takes the endpoint and the second parameter has
      // what we need to include in the json request body.
      const response = await axios.post("/api/billing/create-portal", {
        // Once user presses return, we take them back to the current page that is just before billing page
        returnUrl: window.location.href, 
      });

      // In the data part of the response, there will be a key called url. Its the url of the checkout
      const portalUrl = response.data.url;

      // Redirect the user to the checkout page
      window.location.href = portalUrl;
    } catch (e) {
        console.log("Error creating checkout session:", e);
    }
  };

  return (
    <button className="btn btn-neutral" onClick={() => handleBilling()}>
        Billing
    </button>
  );
};

export default ButtonPortal;
