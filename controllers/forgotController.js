const SibApiV3Sdk = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const ForgotPassword = require("../models/forgot");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_K;

const api = new SibApiV3Sdk.TransactionalEmailsApi();


// SEND RESET MAIL
const sendmailTouser = async (req, res) => {
  console.log("SendMail hit in controller");

  try {
    const { email } = req.body;
    const requestId = uuidv4();

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        message: "Valid email is required"
      });
    }

    // Sequelize:
    // users.findOne({ where: { email } })

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Sequelize:
    // forgotpassword.create({
    //   id,
    //   userId,
    //   isActive
    // })

    await ForgotPassword.create({
      requestId: requestId,
      userId: user._id,
      isActive: true
    });

    console.log(requestId, "reqid");

    const resetLink =
      `${process.env.BASE_URL}/forgot/resetpassword.html?requestId=${requestId}`;

    await api.sendTransacEmail({
      sender: {
        email: "harmeshmahaur44@gmail.com",
        name: "ExpenseTracker"
      },
      to: [{ email }],
      subject: "Forgot Password request",
      htmlContent: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">Reset Password</a>
        <p>This link is valid for 15 minutes.</p>
      `
    });

    res.status(200).json({
      message: "mail sent to user"
    });

  } catch (error) {
    console.error("Brevo Error:", error);

    res.status(500).json({
      message: "Email sending failed",
      error: error.message
    });
  }
};


// SAVE NEW PASSWORD
const saveNewpassword = async (req, res) => {
  console.log("savenewpass hit");

  try {
    const { password, requestId } = req.body;

    // Sequelize:
    // findOne({ where: { id: requestId, isActive: true } })

    const request = await ForgotPassword.findOne({
      requestId: requestId,
      isActive: true
    });

    if (!request) {
      return res.status(400).json({
        message: "Invalid or expired request"
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    // Sequelize:
    // users.update(
    //   { password: hashedPass },
    //   { where: { id: request.userId } }
    // )

    await User.findByIdAndUpdate(
      request.userId,
      { password: hashedPass }
    );

    // Sequelize:
    // forgotpassword.update(
    //   { isActive: false },
    //   { where: { id: requestId } }
    // )

    await ForgotPassword.findOneAndUpdate(
      { requestId: requestId },
      { isActive: false }
    );

    res.status(200).json({
      message: "Password successfully updated"
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Something went wrong"
    });
  }
};

module.exports = {
  sendmailTouser,
  saveNewpassword
};