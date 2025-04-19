const Articles = require('./models/Articles');
const { getArticleEmbedding } = require('./bertUtiils');
const { api_response } = require('./api_repsonse_demo');
const { text } = require('express');



async function fetchNews() {
    try {

        // Fetch News Articles from API :-
        const articles = await fetchArticles();

        if (articles == "API Expired") {
            console.log(articles[0]);
            return;
        }


        // Step 1: Get all existing links from DB :-

        const existingLinks = new Set(
            (await Articles.find({}, 'link')).map(a => a.link)
        );


        // For Individual Article Processing --->

        /*

        // Step 2: Process new articles only :-

        let i = 1;
        for (const article of articles) {
            if (!existingLinks.has(article.link)) {
                const text = `${article.title} ${article.snippet || ''}`.trim(); // Combine title & snippet

                const embedding = await getArticleEmbedding(text);
                article.bert_embedding = embedding;

                console.log("Articles processed : ", i);
                i+=1;
            }
        }



        await Articles.bulkWrite(
            articles.map(article => ({
                updateOne: {
                    filter: { link: article.link },
                    update: { $setOnInsert: article },
                    upsert: true
                }
            }))
        );

        */


        // For Bulk Article Processing --->

        const newArticles = articles.filter(article => !existingLinks.has(article.link));

        if (newArticles.length == 0) {
            return;
        }

        const texts = newArticles.map(a => `${a.title} ${a.snippet || ''}`.trim());

        const embeddings = getArticleEmbedding(texts);

        let i = 0;

        for (const article of newArticles) {
            article.bert_embedding = embeddings[i];
            i++;
        }

        await Articles.bulkWrite(
            articles.map(article => ({
                updateOne: {
                    filter: { link: article.link },
                    update: { $setOnInsert: article },
                    upsert: true
                }
            }))
        );



    }

    catch (error) {
        console.error("Inside fetchNews.js :\n", error.message);
    }

}


async function fetchArticles() {

    // To fetch Articles from API :-
    /*
    const url = 'https://real-time-news-data.p.rapidapi.com/top-headlines?limit=500&country=IN&lang=en';
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

        console.log("Keys in Response : ", Object.keys(result))
        console.log("Length of Response : ", Object.keys(result).length)

        if (!result.data) {
            console.log(result.message);
            return "API Expired";
        }


        const articleData = result.data.map(({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc, authors, source_name }) => ({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc: new Date(published_datetime_utc), authors, source_name }));

        console.log("No. of articles fetched : ", articleData.length, "@");

        return articleData;

    } catch (error) {
        console.error("Error in fetching articles from api : \n", error);
    }

    */

    try {
        const result = api_response;



        const articleData = result.data.map(({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc, authors, source_name }) => ({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc: new Date(published_datetime_utc), authors, source_name }));

        console.log("No. of articles fetched : ", articleData.length, "@");

        return articleData;


    } catch (error) {
        console.error("Error in fetching articles from api : \n", error);

    }


}


module.exports = {
    fetchNews
};