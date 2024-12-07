
import { AppError } from "../errors/AppError.js";
import asyncHandler from "express-async-handler";
import puppeteer from 'puppeteer';



// Function to generate PDF from HTML
export const generatePDF =asyncHandler( async (invoiceTemplate) => {
  try {
    // const browser = await puppeteer.launch({ headless: 'new' });
    const browser = await puppeteer.launch({ headless: true });

    const page = await browser.newPage();

    // Replace placeholders with actual data
    const populatedTemplate = invoiceTemplate
    //   .replace('{{companyName}}', invoiceData.companyName)
    //   .replace('{{invoiceNumber}}', invoiceData.invoiceNumber)
    //   .replace('{{date}}', invoiceData.date)
      // Add more replacements as needed

    // Set the HTML content
    await page.setContent(invoiceTemplate);

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    await browser.close();
    return pdf;
  } catch (error) {
    throw new AppError('Error generating PDF invoice', 500);
  }
});

// Enhanced email sending function with PDF attachment
// export const sendEmailWithInvoice = asyncHandler(async (TO, message, invoiceData) => {
//   try {
//     // Generate PDF
//     const pdfBuffer = await generatePDF(invoiceData);

//     // Define email options with attachment
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: TO,
//       subject: message.subject,
//       html: message.html,
//       attachments: [
//         {
//           filename: `Invoice-${invoiceData.invoiceNumber}.pdf`,
//           content: pdfBuffer,
//           contentType: 'application/pdf'
//         }
//       ]
//     };
//     // Send email with PDF attachment
    
//   } catch (error) {
//     console.error('Error in sendEmailWithInvoice:', error);
//     throw new AppError('Failed to send invoice email', 500);
//   }
// });

