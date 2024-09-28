import React, { useState } from "react";
import axios from "axios";
import ReceiptForm from "./components/ReceiptForm";
import Receipt from "./components/Receipt";
import './App.css';
import Logo from './assets/PG_LOGO.jpg'

const App = () => {
  const [receiptData, setReceiptData] = useState(null);
  // const [receiptNumber, setReceiptNumber] = useState("");
  // const [landlordAddress, setLandlordAddress] = useState("");

  // const handleGenerate = (data) => {
  //   setReceiptData(data);

  //   fetch("http://localhost:5000/send-email", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       to: data.email,
  //       subject: "Rent Receipt",
  //       text: `Rent Receipt\n\nDate: ${data.date}\nTenant: ${
  //         data.tenantName
  //       }\nLandlord: ${data.landlordName}\nAmount: $${data.amount.toFixed(2)}`,
  //       values: data,
  //     }),
  //   })
  //     .then((response) => response.text())
  //     .then((result) => console.log(result))
  //     .catch((error) => console.error("Error sending email:", error));
  // };

  // const handleGenerateAndSendEmail = async (data) => {
  //   setReceiptData(data);

  //   try {
  //     // Call the API to get and increment the receipt number
  //     const response = await axios.post(
  //       "http://localhost:5000/api/receipt-number"
  //     );
  //     const generatedReceiptNumber = response.data.receiptNumber;
  //     setReceiptNumber(generatedReceiptNumber);

  //     // Call the API to get and increment the receipt number
  //     // Note: commented out because it is handled in server.js itself
  //     // const response1 = await axios.get(
  //     //   "http://localhost:5000/api/landlord-address"
  //     // );
  //     // const generatedLandlordAddress = response1.data.landlordAddress;
  //     // console.log(`first response: ${generatedLandlordAddress}`);
  //     // setLandlordAddress(generatedLandlordAddress);

  //     // Send the email with the receipt details
  //     const emailResponse = await fetch("http://localhost:5000/send-email", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         to: data.email,
  //         subject: "Rent Receipt",
  //         text: `Hi ${data.tenantName}\n\nThanks for your payment..!}\n\nRegards\nSKY DREAM PG OFFICE\nBangalore\nMob: +91 831-0781361`,
  //         values: {
  //           ...data,
  //           receiptNo: generatedReceiptNumber,
  //           // landlordAddress: landlordAddress, // called directly from server.js
  //         },
  //       }),
  //     });

  //     const result = await emailResponse.text();
  //     console.log(result);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const handleGenerateAndSendEmail = async (data) => {
    setReceiptData(data);
  
    try {
      // Call the API to increment the receipt number and send email
      const response = await fetch("/.netlify/functions/server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendEmail",
          to: data.email,
          subject: "Rent Receipt",
          text: `Hi ${data.tenantName},\n\nThanks for your payment..!!😊\n\nRegards,\nSKY DREAM PG OFFICE\nBangalore\nMob: +91 831-0781361`,
          values: {
            ...data,
          },
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // const generatedReceiptNumber = result.receiptNumber; // Adjust as needed based on your server response
        // setReceiptNumber(generatedReceiptNumber);
        console.log("Email sent successfully:", result.message);
      } else {
        console.error("Error sending email:", result.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateReceiptCounter = async (newCounter) => {
  try {
    const response = await fetch("/.netlify/functions/updateCounter", {
      method: "POST",
      body: JSON.stringify({ newCounter }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log("Counter updated successfully:", result.newCounter);
    } else {
      console.error("Failed to update counter:", result.error);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
  
  return (
    <div>
      <img src={Logo} alt="PG Logo" className="bgImage"></img>
      <div className="App">
        <ReceiptForm onGenerate={handleGenerateAndSendEmail} />
        <Receipt data={receiptData} />
      </div>
    </div>
  );
};

export default App;
