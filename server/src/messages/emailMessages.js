import { __dirname, __filename } from "../../index.js"
import path from 'path';
import fs from 'fs/promises'
import asyncHandler from "express-async-handler"
import { generatePDF } from "../utils/convert-to-pdf.js";
import { AppError } from "../errors/AppError.js";
export const INVOICE_EMAIL_MESSAGE = () => {
    return {
        subject: `Invoice #{invoiceData.invoiceNumber}`,
        html: `
        <h1>Invoice from {invoiceData.companyName}</h1>
        <p>Please find attached your invoice #{invoiceData.invoiceNumber}.</p>
        <p>Total Amount: {invoiceData.totalAmount}</p>
        <p>Due Date: {invoiceData.dueDate}</p>
        <br>
        <p>Thank you for your business!</p>
        `
    }
};


export const INVOICE_TEMPLATE = asyncHandler(async () => {
    const filePath = path.join(__dirname, 'public', 'template', 'invoice.html');
    // Read the HTML file
    try{

        const data = await fs.readFile(filePath, 'utf8'); 
        
        return await generatePDF(data); 
    } catch(err){
        console.log(err)
        throw new AppError("Error getting Invoice", 500)
    }
   
})
