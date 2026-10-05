const users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addUser = async (req, res) => {
  console.log("add controller hit")
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "all field required" });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const response = await users.create({
      name: name,
      email: email,
      password: hashedPass,
    });

    console.log("user added in table");

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};



/////////////// LOG IN ////////////////////


const loginUser = async (req, res) => {
    console.log("login controller hit");

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "All fields required"
            });
        }

        const user = await users.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid user"
            });
        }

        const isMatched = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatched) {
            return res.status(400).json({
                message: "Wrong Password"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login Successful",
            token
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error);

        res.status(500).json({
            error: error.message
        });
    }
};


module.exports = {
  addUser,
  loginUser,
};
