const express = require("express");
const router = express.Router();
const Articles = require("../models/Articles");
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "#365$36884";

// ROUTE 1 --->             create a user using : POST "/api/auth/createuser"          Doesn't require auth.

router.get("/fetcharticles",
    async (req, res) => {
        try {
            const articles = await fetchArticles();

            // console.log(articles);

            await Articles.bulkWrite(
                articles.map(article => ({

                    
                    updateOne: {
                        filter: { link: article.link },
                        update: { $setOnInsert: article },
                        upsert: true
                    }
                }))
            );


            res.send(articles);

            // const category = req.query.category;

            // let result;

            // if (category == "all") {
            //     result = await Articles.find({});
            // }

            // else {
            //     result = await Articles.find({ category: category })
            // }

            // if (result)
            //     res.send(result);
        }

        catch (error) {
            console.error(error.message + "1");
            res.status(500).send(error.message);
        }
    }
)

// Function to feth news articles :-

async function fetchArticles() {

    const url = 'https://real-time-news-data.p.rapidapi.com/top-headlines?country=IN&lang=en';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '7bea777958msh51adf9b02b44661p16dc8bjsndcb53ff7c02c',
            'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        const articleData = result.data.map(({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc, authors, source_name }) => ({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc: new Date(published_datetime_utc), authors, source_name }));


        return articleData;

    } catch (error) {
        console.error("Error in fetching articles from api : \n", error);
    }

}


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