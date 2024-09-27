// backend.js (Node.js server-side script)
const PDFDocument = require("pdfkit");
const { PassThrough } = require("stream");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

const propertiesFilePath = "../../config.properties";

// Function to generate PDF and return it as a stream
function createPDFStream(text, requestOrigin) {
  const { tenantName, roomNo, amount, date, email, phno, receiptNo } = text;

  // Create a new PDF document
  const doc = new PDFDocument();
  const passThrough = new PassThrough();

  // Pipe the PDF into a file
  doc.pipe(passThrough);

  // Define styles
  const titleStyle = {
    fontSize: 25,
    color: "blue",
    align: "center",
  };

  const headingStyle = {
    fontSize: 18,
    color: "#736768",
    backgroundColor: "lightgray",
  };

  const textStyle = {
    fontSize: 14,
    color: "#736768",
  };

  const margin = 40;
  const width = 520; // Width of the receipt
  const height = 700; // Height of the receipt
  const rectangleHeight = 10; // Height of each rectangle
  const spaceAfterFirstRectangle = 30; // Space after the first rectangle

  // Generate current date
  const currentDate = new Date().toLocaleDateString("en-US");

  // First Red Rectangle (top-most)
  doc
    .rect(margin, margin, width, rectangleHeight) // Starting at top margin, width of the page
    .fill("#cc0001"); // Fill with red color

  // Draw a border around the receipt
  doc.rect(margin, margin, width, height).stroke();

  // Space after the first rectangle
  const contentYPosition = margin + rectangleHeight + spaceAfterFirstRectangle;
  // Adjust the vertical position for the logo and address
  const logoYPosition = contentYPosition - 10; // Move logo higher
  const addressYPosition = logoYPosition + 15; // Position address directly below the logo

  
  console.log(`Inside Create PDF ----> `);
  // Add the logo on the left side
  console.log(`LOGO PATH FIRST ----> ${__dirname}`);
  // const logoPath = path.join(__dirname, "../PG_LOGO.jpg");  
  const logoPath = `${requestOrigin}/PG_LOGO.jpg`;
  console.log(`LOGO PATH SECOND ----> ${logoPath}`);
  doc.image(logoPath, margin + 10, logoYPosition, {
    // Positioned below the title
    width: 200,
  });
  const landlordInfo = readLandlordAddress(); // Call the function to get the info

  console.log(`first address: ${landlordInfo.landlordAddress1}`);
  // Landlord Address
  // Print each part of the landlord address on a new line
  const addressLines = [
    landlordInfo.landlordAddress1,
    landlordInfo.landlordAddress2,
    landlordInfo.landlordAddress3,
    landlordInfo.city,
    landlordInfo.state,
    landlordInfo.country,
    landlordInfo.mobileno,
  ];

  // Set the starting Y position for the address
  let currentYPosition = addressYPosition - 5;

  // Loop through the address lines and add them to the document
  const addressLeftOffset = 10; // Adjust this value for the right margin

  // Loop through the address lines and add them to the document
  addressLines.forEach((line, index) => {
    if (line !== undefined && line !== null && line !== "") {
      doc
        .fillColor("#969696")
        .text(
          index == 6 ? `Phone: ${line}` : line,
          margin + width - 220 - addressLeftOffset,
          currentYPosition,
          {
            width: 220,
            align: "right",
            lineBreak: true,
          }
        );
      currentYPosition += 15;
    } // Adjust this value for spacing between lines
  });

  // Add the title "Rental Receipt" in the center on the next line
  const titleYPosition = currentYPosition + 30; // Position below the address

  // Add the title "Rental Receipt" in the center
  doc
    .font("Times-Roman")
    .fontSize(25)
    .fillColor("#969696")
    .text("Rental Receipt", margin, titleYPosition, {
      align: "center",
      width,
    }); // Center the title

  // Add Receipt Number and Date
  const receiptNumber = receiptNo; // Example receipt number
  const receiptDate = currentDate; // Use the current date generated earlier

  // Define positions for receipt number and date
  const receiptNumberYPosition = titleYPosition + 30; // Position below the title
  const receiptNumberXPosition = margin + 10; // Left side
  const receiptDateXPosition = margin + width - 220; // Right side

  // Add Receipt Number on the left
  doc.fontSize(16).text(receiptNumber, receiptNumberXPosition, receiptNumberYPosition, {
    align: "left",
  });

  // Add Date on the right
  doc.fontSize(16).text(`Date: ${receiptDate}`, receiptDateXPosition, receiptNumberYPosition, {
    align: "right",
  });

  // Continue with the rest of the fields
  const fieldStartY = receiptNumberYPosition + 30; // Adjusting the starting position for fields
  const fieldWidth = width - 20; // Width for fields
  const labelWidth = 80; // Width for the label

  // Function to draw dashed lines
  const drawDashedLine = (x, yPosition) => {
    const dashLength = 5; // Length of each dash
    const gapLength = 3; // Gap between dashes
    const totalLength = fieldWidth - x; // Total length of the line
    for (let i = 0; i < totalLength; i += dashLength + gapLength) {
      doc
        .moveTo(x + i, yPosition)
        .lineTo(x + i + dashLength, yPosition)
        .stroke();
    }
  };

  // Add Name field
  doc.fontSize(18).text("Name:", margin + 10, fieldStartY);
  drawDashedLine(margin + 10 + labelWidth, fieldStartY + 15); // Draw dashed line next to label
  doc.fontSize(16).text(tenantName, margin + 10 + labelWidth + 5, fieldStartY, {
    align: "left",
  });

  // Add RoomNo field
  doc.fontSize(18).text("RoomNo:", margin + 10, fieldStartY + 30);
  drawDashedLine(margin + 10 + labelWidth, fieldStartY + 45); // Draw dashed line next to label
  doc
    .fontSize(16)
    .text(roomNo, margin + 10 + labelWidth + 5, fieldStartY + 30, {
      align: "left",
    });

  // Add Amount field
  doc.fontSize(18).text("Amount:", margin + 10, fieldStartY + 60);
  drawDashedLine(margin + 10 + labelWidth, fieldStartY + 75); // Draw dashed line next to label
  doc
    .fontSize(16)
    .text(amount, margin + 10 + labelWidth + 5, fieldStartY + 60, {
      align: "left",
    });

  // Add Date field
  doc.fontSize(18).text("Date:", margin + 10, fieldStartY + 90);
  drawDashedLine(margin + 10 + labelWidth, fieldStartY + 105); // Draw dashed line next to label
  doc.fontSize(16).text(date, margin + 10 + labelWidth + 5, fieldStartY + 90, {
    align: "left",
  });

  // Add "Authorized By" heading
  const authorizedByYPosition = fieldStartY + 290; // Position for "Authorized By" heading
  const authorizedByXPosition = margin + width - 220; // Right-aligned X position for heading
  doc.text("Authorized By:", authorizedByXPosition, authorizedByYPosition, {
    align: "left",
  });

  // Add the image below the "Authorized By" heading
  const imagePath = path.join(__dirname, "../Authorized_Signature.jpg"); // Replace with your image file path
  const imageYPosition = authorizedByYPosition + 15; // Position the image below the heading
  doc.image(imagePath, authorizedByXPosition, imageYPosition, {
    width: 200, // Adjust the width as necessary
    height: 40, // Adjust the height as necessary
  });

  doc.fontSize(textStyle.fontSize).fillColor(textStyle.color).moveDown();
  // Last Red Rectangle (top-most)
  doc
    .rect(margin, height + margin - rectangleHeight, width, rectangleHeight) // Starting at top margin, width of the page
    .fill("#cc0001"); // Fill with red color

  // Draw a bottom border
  doc.rect(margin, margin, width, height).stroke();

  // Footer
  doc
    .fontSize(12)
    .fillColor("gray")
    .text("Thank you for your payment!", margin + 10, height + margin - 50, {
      align: "center",
      width: width - 20,
    });

  // End the document
  doc.end();
  return passThrough;
}

const transporter = nodemailer.createTransport({
  service: "gmail", // or another email service
  auth: {
    user: "karuppusamythangavel97@gmail.com",
    pass: "rfds oxjr arnh lxog",
  },
});

// Handler for Netlify serverless function
exports.handler = async (event) => {
  try {
    if (event.httpMethod === "GET") {
      const counter = readCounter();
      return {
        statusCode: 200,
        body: JSON.stringify({ receiptNumber: `Receipt #${counter}` }),
      };
    }

    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);

      if (body.action === "increment") {
        let counter = readCounter();
        counter++;
        updateCounter(counter);
        return {
          statusCode: 200,
          body: JSON.stringify({ receiptNumber: `Receipt #${counter}` }),
        };
      } else if (body.action === "sendEmail") {
        const { to, subject, text, values } = body;        
        const requestOrigin = event.headers.origin || `https://skydreampgrentreceipt.netlify.app/`; 
        const pdfStream = createPDFStream(values, requestOrigin);

        const mailOptions = {
          from: "your_email@gmail.com",
          to,
          subject,
          text,
          attachments: [
            {
              filename: "rentreceipt.pdf",
              content: pdfStream,
              contentType: "application/pdf",
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "Email sent successfully!" }),
        };
      }
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.toString() }),
    };
  }
};

// Function to read the current receipt counter
const readCounter = () => {
  const data = fs.readFileSync(propertiesFilePath, "utf-8");
  const lines = data.split("\n");
  const counterLine = lines.find((line) => line.startsWith("receiptCounter"));
  return parseInt(counterLine.split("=")[1], 10);
};

// Function to read the current landlord address
const readLandlordAddress = () => {
  const data = fs.readFileSync(propertiesFilePath, "utf-8");
  const lines = data.split("\n");
  console.log(`lines: ${lines}`);

  // Initialize an object to hold all the extracted information
  const landlordInfo = {};

  // Extract each piece of information
  lines.forEach((line) => {
    if (line.startsWith("landlordAddress1")) {
      landlordInfo.landlordAddress1 = line
        .split("=")[1]
        .replace(/"/g, "")
        .trim();
    } else if (line.startsWith("landlordAddress2")) {
      landlordInfo.landlordAddress2 = line
        .split("=")[1]
        .replace(/"/g, "")
        .trim();
    } else if (line.startsWith("landlordAddress3")) {
      landlordInfo.landlordAddress3 = line
        .split("=")[1]
        .replace(/"/g, "")
        .trim();
    } else if (line.startsWith("city")) {
      landlordInfo.city = line.split("=")[1].replace(/"/g, "").trim();
    } else if (line.startsWith("state")) {
      landlordInfo.state = line.split("=")[1].replace(/"/g, "").trim();
    } else if (line.startsWith("country")) {
      landlordInfo.country = line.split("=")[1].replace(/"/g, "").trim();
    } else if (line.startsWith("mobileno")) {
      landlordInfo.mobileno = line.split("=")[1].replace(/"/g, "").trim();
    } else if (line.startsWith("mailId")) {
      landlordInfo.mailId = line.split("=")[1].replace(/"/g, "").trim();
    }
  });

  console.log("Extracted Landlord Info:", landlordInfo);

  // Return the extracted information as an object
  return landlordInfo;
};

// Function to update the receipt counter
const updateCounter = (newCounter) => {
  let data = fs.readFileSync(propertiesFilePath, "utf-8");
  data = data.replace(/receiptCounter=\d+/, `receiptCounter=${newCounter}`);
  fs.writeFileSync(propertiesFilePath, data);
};

// Endpoint to get the next receipt number
// app.get("/api/landlord-address", (req, res) => {
//   const landlordAddress = readLandlordAddress();
//   console.log(`landlordAddress = ${JSON.stringify(landlordAddress)}`);
//   res.json({ landlordAddress: JSON.stringify(landlordAddress) });
// });

// // Endpoint to get the next receipt number
// app.get("/api/receipt-number", (req, res) => {
//   const counter = readCounter();
//   res.json({ receiptNumber: `Receipt #${counter}` });
// });

// // Endpoint to increment the counter
// app.post("/api/receipt-number", (req, res) => {
//   let counter = readCounter();
//   counter++;
//   updateCounter(counter);
//   res.json({ receiptNumber: `Receipt #${counter}` });
// });

// app.post("/send-email", (req, res) => {
//   const { to, subject, text, values } = req.body;

//   const pdfStream = createPDFStream(values);
//   const mailOptions = {
//     from: "karuppusamythangavel97@gmail.com",
//     to,
//     subject,
//     text,
//     attachments: [
//       {
//         filename: "rentreceipt.pdf",
//         content: pdfStream,
//         encoding: "application/pdf", // Optional: encoding can be used for specific cases
//       },
//     ],
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).send(error.toString());
//     }
//     res.status(200).send("Email sent: " + info.response);
//   });
// });

// const port = 5000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
