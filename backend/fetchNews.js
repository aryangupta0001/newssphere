const Articles = require('./models/Articles');
const { getArticleEmbedding } = require('./bertUtiils');
const { api_response } = require('./api_repsonse_demo');
const cheerio = require('cheerio');


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



                    // Generate bert_embeddings for each article :-
                    const embedding = await getArticleEmbedding(text);

                    if (!embedding || !Array.isArray(embedding) || embedding.length !== 768) {
                        console.warn(`Skipping due to invalid embedding: ${article.title}`);
                        failedEmbeddings++;
                        continue;
                    }

                    article.bert_embedding = embedding;



                    // Fetch Photo & Thumbnail :-
                    article.photo_data = await downloadAndConvertImage(article.photo_url);
                    // article.thumbnail_data = await downloadAndConvertImage(article.thumbnail_url);



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



        // syncArticlesToDB(articles);


    }

    catch (error) {
        console.error("Inside fetchNews.js :\n", error.message);
    }



}


async function fetchArticles() {

    // To fetch Articles from API :-
    /*
    
        const categories = ['WORLD', 'NATIONAL', 'BUSINESS', 'TECHNOLOGY', 'ENTERTAINMENT', 'SPORTS', 'SCIENCE', 'HEALTH']
    
        const urlGeneral = 'https://real-time-news-data.p.rapidapi.com/top-headlines?limit=500&country=IN&lang=en';
    
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '1fb97fae2fmshd5799e01f4fff11p13d4bbjsnadf24e426e9f',
                'x-rapidapi-host': 'real-time-news-data.p.rapidapi.com'
            }
        };
    
        try {
            let articles = [];
    
            const response = await fetch(urlGeneral, options);
            const result = await response.json();
    
            console.log("Keys in Response : ", Object.keys(result))
            console.log("Length of Response : ", Object.keys(result).length)
    
            if (!result.data) {
                console.log(result.message);
                return ["API Expired"];
            }
    
            articles.push(...result.data)
    
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
    
    
    
            const articleData = articles.map(({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc, authors, source_name, category }) => ({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc: new Date(published_datetime_utc), authors, source_name, category: category || 'GENERAL' }));
    
            console.log("No. of articles fetched : ", articleData.length, "@");
    
            return articleData;
    
        } catch (error) {
            console.error("Error in fetching articles from api : \n", error);
        }
    
    */

    try {
        const result = api_response;



        const articleData = result.data.map(({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc, authors, source_name, category }) => ({ title, link, snippet, photo_url, thumbnail_url, published_datetime_utc: new Date(published_datetime_utc), authors, source_name, category: category || 'GENERAL' }));

        console.log("No. of articles fetched : ", articleData.length, "@");

        return articleData;


    } catch (error) {
        console.error("Error in fetching articles from api : \n", error);

    }


}


const downloadAndConvertImage = async (imageUrl) => {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image from ${imageUrl}`);

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer; // You can also return base64 if needed
    } catch (err) {
        console.error("Image download error:", err.message);
        return null;
    }
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
        return(articleContent.trim());


    } catch (error) {
        console.error(error.message);
        // res.status(500).json({ error: 'Failed to scrape article' });
        return("Failed to scrape article");

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