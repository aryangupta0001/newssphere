const express = require("express");
const router = express.Router();
const Articles = require("../models/Articles");
const { validationResult, body } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");
const {getArticleEmbedding} = require('../bertUtiils');

const JWT_SECRET = "#365$36884";

// ROUTE 1 --->             create a user using : POST "/api/auth/createuser"          Doesn't require auth.

router.get("/fetcharticles",
    async (req, res) => {
        try {
            const articles = await fetchArticles();

            // Step 1: Get all existing links from DB :-

            const existingLinks = new Set(
                (await Articles.find({}, 'link')).map(a => a.link)
            );

            // Step 2: Process new articles only :-

            for (const article of articles) {
                if (!existingLinks.has(article.link)) {

                    const text = `${article.title} ${article.snippet || ''}`.trim(); // Combine title & snippet

                    const embedding = await getArticleEmbedding(text);
                    article.bert_embedding = embedding;
                }
            }

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
        }

        catch (error) {
            console.error(error.message + "1");
            res.status(500).send(error.message);
        }
    }
)


module.exports = router