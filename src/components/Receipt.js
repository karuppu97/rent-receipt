import React from "react";

const Receipt = ({ data }) => {
  if (!data) return null;

  const { receiptNo, tenantName, roomNo, amount, date, email, phno } = data;

  return (
    <div>
      <h2>Rent Receipt</h2>
      <p>Receipt No: {receiptNo}</p>
      <p>Date: {date}</p>
      <p>Tenant: {tenantName}</p>
      <p>Room Number: {roomNo}</p>
      <p>Amount: {amount.toFixed(2)}</p>
      <p>Email: {email}</p>
      <p>Mobile Number: {phno}</p>
    </div>
  );
};

export default Receipt;
