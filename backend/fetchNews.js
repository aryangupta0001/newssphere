const Articles = require('./models/Articles');
const { getArticleEmbedding } = require('./bertUtiils');
const { api_response } = require('./api_repsonse_demo');


async function fetchNews() {
    try {

        // Fetch News Articles from API :-
        const articles = await fetchArticles();
        
        if (articles == "API Expired") {
            console.log(articles[0]);
            return;
        }

        
        console.log("No. of articles in API Res : ", articles.length);

        const uniqueArticles = new Set();
        let dupli = 0;

        for (const article of articles) {
            if (uniqueArticles.has(article.link)) {
                dupli++;
            }
            uniqueArticles.add(article.link);
        }

        console.log("No. of duplicate articles in API Response: ", dupli);





        // Step 1: Get all existing links from DB :-

        const existingLinks = new Set(
            (await Articles.find({}, 'link')).map(a => a.link)
        );


        // Step 2: Process new articles only :-

        console.time("Emebdding generation time");


        let i = 0;
        let failedEmbeddings = 0;

        for (const article of articles) {
            if (!existingLinks.has(article.link)) {
                const text = `${article.title} ${article.snippet || ''}`.trim(); // Combine title & snippet

                try {


                    const embedding = await getArticleEmbedding(text);

                    if (!embedding || !Array.isArray(embedding) || embedding.length !== 768) {
                        console.warn(`Skipping due to invalid embedding: ${article.title}`);
                        failedEmbeddings++;
                        continue;
                    }

                    article.bert_embedding = embedding;

                    i += 1;
                }
                catch (e) {
                    failedEmbeddings++;
                    console.error(`Embedding error for article '${article.title}':`, err.message);
                }
                console.log("Articles processed : ", i);
                console.log("Failed to embed:", failedEmbeddings);

            }

            else {
                console.log(article.link);
            }
        }

        console.log("New Articles fetched : ", i);



        await Articles.bulkWrite(
            articles.map(article => ({
                updateOne: {
                    filter: { link: article.link },
                    update: { $setOnInsert: article },
                    upsert: true
                }
            }))
        );

        console.timeEnd("Emebdding generation time");

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