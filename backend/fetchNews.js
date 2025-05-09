const Articles = require('./models/Articles');
const { fetchBertEmbeddings } = require('./utils/fetchBertEmbeddings');
const { api_response } = require('./api_repsonse_demo');
const cheerio = require('cheerio');
const { handleSearchedArticles } = require('./handleSearchedArticles');
const { fetchImage } = require('./utils/fetchImage');


async function fetchNews(search) {
    // async function fetchNews() {
    // try {

    let articles;

    articles = await fetchArticles(search);

    if (articles == "API Expired") {
        console.log(articles[0]);
        return;
    }


    console.log("No. of articles in API Res : ", articles.length);

    if (search.type == 'search') {
        const objectId = await handleSearchedArticles(articles);
        return objectId;

    }

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

    // console.time("Emebdding generation time");


    let i = 0;
    let failedEmbeddings = 0;

    for (const article of articles) {
        if (!existingLinks.has(article.link)) {
            const text = `${article.title} ${article.snippet || ''}`.trim(); // Combine title & snippet

            try {

                // Fetch Photo & Thumbnail :-
                article.photo_data = await fetchImage(article.photo_url);




                // Generate bert_embeddings for each article :-
                const embedding = await fetchBertEmbeddings(text);

                if (!embedding || !Array.isArray(embedding) || embedding.length !== 768) {
                    console.warn(`Skipping due to invalid embedding: ${article.title}`);
                    failedEmbeddings++;
                    continue;
                }

                article.bert_embedding = embedding;



                // Scrape Article Content :-
                // article.content = await scrapeArticle(article.link);


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
            // console.log(article.link);
        }
    }

    console.log("New Articles fetched : ", i);

    if (search.type == 'fetch')
        await Articles.bulkWrite(
            articles.map(article => ({
                updateOne: {
                    filter: { link: article.link },
                    update: { $setOnInsert: article },
                    upsert: true
                }
            }))
        );

    // console.timeEnd("Emebdding generation time");



    if (search.type == 'search') {
        const urls = articles.map(article => article.url);

        // Step 1: Find existing articles
        const existingArticles = await Articles.find({ url: { $in: urls } });
        const existingMap = new Map();
        existingArticles.forEach(article => existingMap.set(article.url, article._id));

        // Step 2: Separate new articles
        const newArticles = articles.filter(article => !existingMap.has(article.url));

        // Step 3: Insert new ones and map their _ids
        if (newArticles.length > 0) {
            const insertedDocs = await Article.insertMany(newArticles);
            insertedDocs.forEach(article => existingMap.set(article.url, article._id));
        }

        // Step 4: Return _ids in the original order
        const finalIds = articles.map(article => existingMap.get(article.url));

        // console.log(finalIds); // array of ObjectIds in same order as articles
        return finalIds;


    }



    // syncArticlesToDB(articles);


    // }

    // catch (error) {
    //     console.error("Inside fetchNews.js :\n", error.message);
    // }



}


async function fetchArticles(search) {

    // To fetch Articles from API :-
    // /*

    // const categories = ['WORLD', 'NATIONAL', 'BUSINESS', 'TECHNOLOGY', 'ENTERTAINMENT', 'SPORTS', 'SCIENCE', 'HEALTH']
    const categories = ['WORLD']

    let url;



    if (search.type == 'search') {
        const encodedQuery = encodeURIComponent(search.query);
        url = `https://real-time-news-data.p.rapidapi.com/search?query=${encodedQuery}&limit=500&time_published=anytime&country=IN&lang=en`;
    }

    else
        url = 'https://real-time-news-data.p.rapidapi.com/top-headlines?limit=500&country=IN&lang=en';


    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'aa555d3625msh3242388e20b50dep158d6ejsn3343160cd9bc',
            'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com'
        }
    };


    try {
        let articles = [];

        // Fetch Top Headlines :-                                             GENERAL CATEGORY
        const response = await fetch(url, options);

        const result = await response.json();

        console.log("Keys in Response : ", Object.keys(result))
        console.log("Length of Response : ", Object.keys(result).length)

        if (!result.data) {
            console.log("Hey", result.message);
            return ["API Expired"];
        }

        articles.push(...result.data)

        if (search.type == "fetch") {
            for (const category of categories) {
                const response = await fetch(`https://real-time-news-data.p.rapidapi.com/topic-headlines?topic=${category}&limit=500&country=IN&lang=en`, options);

                const result = await response.json();

                console.log(`Keys in Response for ${category} : `, Object.keys(result))
                console.log(`Length of Response for ${category} : `, result.data.length)

                if (!result.data) {
                    console.log(result.message);
                    return "API Expired";
                }


                const categorizedData = result.data.map(article => ({
                    ...article,
                    category
                }));

                articles.push(...categorizedData);
            }
        }

        const articleData = articles.map(({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc, authors, source_name, category }) => ({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc: new Date(published_datetime_utc), authors, source_name, category: category || 'GENERAL' }));

        console.log("No. of articles fetched : ", articleData.length, "@");

        return articleData;

    } catch (error) {
        console.error("Error in fetching articles from api : \n", error);
    }

    // */

    /*

    try {
        const result = api_response;



        const articleData = result.data.map(({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc, authors, source_name, category }) => ({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc: new Date(published_datetime_utc), authors, source_name, category: category || 'GENERAL' }));

        console.log("No. of articles fetched : ", articleData.length, "@");

        return articleData;


    } catch (error) {
        console.error("Error in fetching articles from api : \n", error);

    }

    */


}





const scrapeArticle = async (articleLink) => {
    try {
        const response = await fetch(articleLink);
        const html = await response.text();

        const $ = cheerio.load(html);

        let paragraphs = [];

        $('p').each((i, el) => {
            const text = $(el).text().trim();
            if (text.length > 50) { // Ignore very small paragraphs
                paragraphs.push(text);
            }
        });

        paragraphs.sort((a, b) => b.length - a.length);

        let topParagraphs = paragraphs.slice(0, 5);
        let articleContent = topParagraphs.join('\n\n');

        // res.json({ content: articleContent.trim() });
        return (articleContent.trim());


    } catch (error) {
        console.error(error.message);
        // res.status(500).json({ error: 'Failed to scrape article' });
        return ("Failed to scrape article");

    }
}





const syncArticlesToDB = async (articles) => {
    // Step 1: Get all links from incoming articles
    const links = articles.map(article => article.link);

    // Step 2: Fetch existing articles with matching links
    const existingArticles = await Articles.find({ link: { $in: links } }).select('link category');

    // Step 3: Create a map of link -> category from DB
    const linkToCategoryMap = new Map();
    for (const doc of existingArticles) {
        linkToCategoryMap.set(doc.link, doc.content);
    }

    // Step 4: Prepare bulk operations
    const operations = [];

    for (const article of articles) {
        const existingCategory = linkToCategoryMap.get(article.link);

        if (existingCategory === undefined) {
            // New article → insert
            operations.push({
                updateOne: {
                    filter: { link: article.link },
                    update: { $setOnInsert: article },
                    upsert: true
                }
            });
        } else if (existingCategory !== article.content) {
            // Category changed → update
            operations.push({
                updateOne: {
                    filter: { link: article.link },
                    update: { $set: { category: article.category } }
                }
            });
        }
        // else → category is same → do nothing
    }

    // Step 5: Perform bulk write if needed
    if (operations.length > 0) {
        await Articles.bulkWrite(operations);
        console.log(`Synced ${operations.length} articles.`);
    } else {
        console.log('No updates needed.');
    }
};




































module.exports = {
    fetchNews
};