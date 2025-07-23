const nodemailer = require("nodemailer");
const emailConfig = require("../config/emailConfig");

exports.submitContactForm = async (req, res) => {
  try {
    const { name, address, email, phone, comments } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone are required fields"
      });
    }

    // Create email content
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_TO,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Address:</strong> ${address || "Not provided"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Comments:</strong> ${comments || "No comments"}</p>
        <p>Received at: ${new Date().toLocaleString()}</p>
      `
    };

    console.log(mailOptions);

    // Send email
    const transporter = nodemailer.createTransport(emailConfig);
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Form submitted successfully"
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting form",
      error: error.message
    });
  }
};
