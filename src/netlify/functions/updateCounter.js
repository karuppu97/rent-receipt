const fs = require("fs");
const path = require("path");

exports.handler = async function (event) {
  // Ensure this is a POST request (for updating)
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  // Parse the request body to get the new counter value
  const { newCounter } = JSON.parse(event.body);

  if (typeof newCounter !== "number") {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid counter value" }),
    };
  }

  try {
    // Define the path to the config.properties file
    const propertiesFilePath = path.join(__dirname, "../../public/config.properties");

    // Read the existing config.properties file
    let data = fs.readFileSync(propertiesFilePath, "utf-8");

    // Update the receiptCounter value
    data = data.replace(/receiptCounter=\d+/, `receiptCounter=${newCounter}`);

    // Write the updated data back to the file
    fs.writeFileSync(propertiesFilePath, data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Counter updated successfully", newCounter }),
    };
  } catch (error) {
    console.error("Error updating counter:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to update the counter" }),
    };
  }
};
