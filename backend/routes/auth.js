const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");
const Articles = require("../models/Articles");

const JWT_SECRET = "#365$36884";

// ROUTE 1 --->             create a news article using : POST "/api/article/createuser"          Doesn't require auth.

router.post("/createuser",

    [
        body('name', "Enter a valid name").isLength({ min: 3 }),
        body('email', "Enter a valid email").isEmail(),
        body('password', "Password must be atleast 5 characters").isLength({ min: 5 })

    ],

    async (req, res) => {
        const result = validationResult(req);

        // If validation result is empty, i.e there is no error, then crreate user
        if (result.isEmpty()) {
            // Check whether a user with the same email exist alredy

            try {
                let user = await User.findOne({ email: req.body.email });

                if (user) {
                    return res.status(400).json({ error: "User with same email already exists" });
                }

                const salt = await bcrypt.genSalt(10);

                const password = await bcrypt.hash(req.body.password, salt);


                user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: password
                })

                const userData = {
                    id: user.id
                }

                const authToken = jwt.sign(userData, JWT_SECRET);

                res.json({ authToken })
            }

            catch (error) {
                console.error(error.message + "1");
                res.status(500).send(error.message);
            }
        }

        // If validation results are not empty, i.e there are errors, send error.
        else
            return res.status(400).json({ error: result.array() });
    }
)

// ROUTE 2 --->         create a user using : POST "/api/auth/login"          Doesn't require auth.
router.post('/login',
    [
        body('email', "Enter a valid email").isEmail(),
        body('password', "Password cannot be blank").exists()

    ],

    async (req, res) => {
        const result = validationResult(req);

        // If validation result is empty, i.e there is no error, then crreate user
        if (result.isEmpty()) {
            // Check whether a user with the same email exist alredy

            try {
                let user = await User.findOne({ email: req.body.email });

                if (!user) {
                    return res.status(401).json({ error: "Incorrect email or password" });
                }


                const passwordCompare = await bcrypt.compare(req.body.password, user.password);

                if (!passwordCompare)
                    return res.status(401).json({ error: "Incorrect email or password" })

                const userData = {
                    user: {
                        id: user.id
                    }
                }

                const authToken = jwt.sign(userData, JWT_SECRET);
                res.json({ authToken })

            }

            catch (error) {
                console.error(error.message + "2");
                res.status(500).send("Internal Server Error");
            }
        }

        // If validation results are not empty, i.e there are errors, send error.
        else
            return res.status(400).json({ error: result.array() });
    }

)


// ROUTE 3 --->         get user details using : POST "/api/auth/getuser"          Require auth.

router.post('/getuser', fetchuser, async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select('-password');
        res.send(user);
    }

    catch (error) {
        console.error(error.message + "3");
        res.status(500).send("Internal Server Error");
    }
}
)






module.exports = router