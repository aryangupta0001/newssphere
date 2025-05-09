const express = require("express");
const router = express.Router();
const Articles = require("../models/Articles");
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");
const { fetchNews } = require('../fetchNews');


const JWT_SECRET = "#365$36884";

// ROUTE 1 --->             create a user using : POST "/api/auth/fetchuser"          Requires auth.

router.get("/fetcharticles", fetchuser, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId).select('-password');


        const articles = [];

        const { searchQuery } = req.query;


        if (!searchQuery) {

            if (user.bertEmbeddings.length == 0) {

                const categories = ['WORLD', 'NATIONAL', 'BUSINESS', 'TECHNOLOGY', 'ENTERTAINMENT', 'SPORTS', 'SCIENCE', 'HEALTH'];

                for (const category of categories) {
                    // const recentArticles = await Articles.find({ category: category }).select('-bert_embedding')
                    const recentArticles = await Articles.find({ category: category })
                        .sort({ published_datetime_utc: -1 }) // sort by date descending
                        .limit(5);

                    // console.log(recentArticles);

                    articles.push(...recentArticles);
                }

                // const recentArticles = await Articles.find({ category: 'GENERAL' }).select('-bert_embedding')
                const recentArticles = await Articles.find({ category: 'GENERAL' })
                    .sort({ published_datetime_utc: -1 }) // sort by date descending
                    .limit(10);

                // console.log(recentArticles);

                articles.push(...recentArticles);


                console.log(Object.keys(articles[0].toObject()));
                // console.log(articles[0]);


                for (let i = articles.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [articles[i], articles[j]] = [articles[j], articles[i]]; // Swap elements
                }

                console.log("Articles sent to ArticleState : ", articles.length);
                res.json(articles)



            }

            else {

                
                const N = 40;                    // No. of articles to fetch from the sorted list.

                const userVec = user.bertEmbeddings;

                const articles = await Articles.find({});

                const rankedArticles = articles.map(article => ({
                    ...article.toObject(),

                    score: cosineSimilarity(userVec, article.bert_embedding)
                }))
                    .sort((a, b) => b.score - a.score);

                const topArticles = rankedArticles.slice(0, N);

                console.log("Articles sent to ArticleState : ", topArticles.length);
                res.json(topArticles);
            }
        }


        else {
            console.log("Search Query : ", searchQuery);
            const searchResult = await fetchNews({ type: 'search', query: searchQuery })


            if (searchResult) {
                console.log("Type Of : ", typeof (searchResult), Array.isArray(searchResult));
                console.log("Type Of 0th ele : ", typeof (searchResult[0]), Array.isArray(searchResult[0]));
                const articles = await Articles.find({ _id: { $in: searchResult } });
                res.json(articles);

            }
            else {
                res.send(['No Article Fetched']);

            }

            // const insertedIds = Object.values(searchResult);


        }

    }

    catch (error) {
        console.error(error.message + "1");
        res.status(500).send(error.message);
    }
}
)



// coosineSimilarity function --->

const cosineSimilarity = (userVec, articleVec) => {
    const dotProduct = userVec.reduce((sum, val, i) => sum + val * articleVec[i], 0);

    const userNormmal = Math.sqrt(userVec.reduce((sum, val) => sum + val * val, 0));
    const articleNormal = Math.sqrt(articleVec.reduce((sum, val) => sum + val * val, 0));

    return dotProduct / (userNormmal * articleNormal);

}


// ROUTE 2 ---> fetch images

router.get('/fetchimage', async (req, res) => {
    try {
        const article = await Articles.findById(req.query.id);
        if (!article || !article.photo_data) {
            return res.status(404).send('Thumbnail not found');
        }

        res.set('Content-Type', 'image/jpeg'); // or image/png if needed


        if (req.query.image === 'thumbnail')
            res.send(article.thumbnail_data);

        else if (req.query.image === 'photo')
            res.send(article.photo_data);

    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server Error');

    }
})


module.exports = router