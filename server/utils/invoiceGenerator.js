// server/utils/invoiceGenerator.js
const PDFDocument = require("pdfkit");

/**
 * Generate PDF invoice for an order
 * @param {Object} order - Order object with populated fields
 * @param {Object} options - Additional options (company info, etc.)
 * @returns {PDFDocument} PDF document stream
 */
const generateInvoicePDF = (order, options = {}) => {
  // Create a new PDF document
  const doc = new PDFDocument({ margin: 50, size: "A4" });

  // Company/Platform Information
  const companyInfo = options.companyInfo || {
    name: "ConnectConstructions",
    address: "Construction Materials Marketplace",
    city: "India",
    phone: "+91 1234567890",
    email: "support@connectconstructions.com",
    website: "www.connectconstructions.com",
    gstin: "29ABCDE1234F1Z5", // Replace with actual GSTIN
  };

  // Header with company logo/name
  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .text(companyInfo.name, 50, 50)
    .fontSize(10)
    .font("Helvetica")
    .text(companyInfo.address, 50, 80)
    .text(`${companyInfo.city}`, 50, 95)
    .text(`Phone: ${companyInfo.phone}`, 50, 110)
    .text(`Email: ${companyInfo.email}`, 50, 125)
    .text(`GSTIN: ${companyInfo.gstin}`, 50, 140);

  // Invoice title and number
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("TAX INVOICE", 400, 50, { align: "right" })
    .fontSize(10)
    .font("Helvetica")
    .text(`Invoice #: ${order._id.toString().slice(-8).toUpperCase()}`, 400, 80, {
      align: "right",
    })
    .text(`Order #: ${order._id.toString().slice(-6).toUpperCase()}`, 400, 95, {
      align: "right",
    })
    .text(
      `Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
      400,
      110,
      { align: "right" },
    )
    .text(`Payment: ${order.paymentMethod?.toUpperCase() || "N/A"}`, 400, 125, {
      align: "right",
    });

  // Horizontal line
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 170)
    .lineTo(550, 170)
    .stroke();

  // Billing and Shipping Information
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Bill To:", 50, 190)
    .fontSize(10)
    .font("Helvetica")
    .text(order.deliveryAddress?.fullName || "Customer", 50, 210)
    .text(order.deliveryAddress?.phone || "", 50, 225)
    .text(order.deliveryAddress?.addressLine1 || "", 50, 240);

  if (order.deliveryAddress?.addressLine2) {
    doc.text(order.deliveryAddress.addressLine2, 50, 255);
  }

  doc.text(
    `${order.deliveryAddress?.city || ""}, ${order.deliveryAddress?.state || ""} - ${order.deliveryAddress?.pincode || ""}`,
    50,
    order.deliveryAddress?.addressLine2 ? 270 : 255,
  );

  // Items table header
  const tableTop = 330;
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Item", 50, tableTop)
    .text("Qty", 280, tableTop, { width: 50, align: "center" })
    .text("Price", 350, tableTop, { width: 80, align: "right" })
    .text("Amount", 450, tableTop, { width: 90, align: "right" });

  // Draw line under header
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  // Items
  let itemY = tableTop + 25;
  doc.font("Helvetica").fontSize(9);

  order.items.forEach((item, index) => {
    const itemName =
      item.productSnapshot?.name || item.name || "Product";
    const quantity = item.quantity || 1;
    const price = item.priceAtOrder || item.price || 0;
    const total = item.totalPrice || price * quantity;

    // Check if we need a new page
    if (itemY > 700) {
      doc.addPage();
      itemY = 50;
    }

    doc
      .text(itemName, 50, itemY, { width: 220 })
      .text(quantity.toString(), 280, itemY, { width: 50, align: "center" })
      .text(`₹${price.toLocaleString("en-IN")}`, 350, itemY, {
        width: 80,
        align: "right",
      })
      .text(`₹${total.toLocaleString("en-IN")}`, 450, itemY, {
        width: 90,
        align: "right",
      });

    itemY += 20;
  });

  // Draw line before totals
  const totalsTop = itemY + 10;
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(350, totalsTop)
    .lineTo(550, totalsTop)
    .stroke();

  // Totals section
  let totalsY = totalsTop + 15;
  doc.fontSize(10).font("Helvetica");

  // Subtotal
  doc
    .text("Subtotal:", 350, totalsY)
    .text(`₹${(order.subtotal || 0).toLocaleString("en-IN")}`, 450, totalsY, {
      width: 90,
      align: "right",
    });
  totalsY += 20;

  // Tax (GST)
  if (order.tax && order.tax > 0) {
    doc
      .text("GST (18%):", 350, totalsY)
      .text(`₹${order.tax.toLocaleString("en-IN")}`, 450, totalsY, {
        width: 90,
        align: "right",
      });
    totalsY += 20;
  }

  // Delivery Fee
  if (order.deliveryFee && order.deliveryFee > 0) {
    doc
      .text("Delivery Fee:", 350, totalsY)
      .text(`₹${order.deliveryFee.toLocaleString("en-IN")}`, 450, totalsY, {
        width: 90,
        align: "right",
      });
    totalsY += 20;
  }

  // Draw line before total
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(350, totalsY)
    .lineTo(550, totalsY)
    .stroke();

  totalsY += 10;

  // Total Amount
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Total Amount:", 350, totalsY)
    .text(
      `₹${(order.totalAmount || 0).toLocaleString("en-IN")}`,
      450,
      totalsY,
      {
        width: 90,
        align: "right",
      },
    );

  // Payment Status
  totalsY += 25;
  doc
    .fontSize(10)
    .font("Helvetica")
    .text("Payment Status:", 350, totalsY)
    .font("Helvetica-Bold")
    .text(
      order.paymentStatus?.toUpperCase() || "PENDING",
      450,
      totalsY,
      { width: 90, align: "right" },
    );

  // Footer - Terms and Conditions
  const footerTop = 720;
  doc
    .fontSize(8)
    .font("Helvetica-Oblique")
    .text(
      "Terms & Conditions:",
      50,
      footerTop,
      { continued: true, width: 500 },
    )
    .font("Helvetica")
    .text(
      " This is a computer-generated invoice and does not require a signature. All disputes are subject to jurisdiction.",
      { width: 500 },
    );

  // Thank you message
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(
      "Thank you for your business!",
      50,
      footerTop + 30,
      { align: "center", width: 500 },
    );

  // Page numbers (if multiple pages)
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .font("Helvetica")
      .text(
        `Page ${i + 1} of ${pages.count}`,
        50,
        doc.page.height - 30,
        { align: "center", width: 500 },
      );
  }

  // Finalize the PDF
  doc.end();

  return doc;
};

module.exports = {
  generateInvoicePDF,
};
