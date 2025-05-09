const Articles = require('./models/Articles')
const { fetchBertEmbeddings } = require('./utils/fetchBertEmbeddings');
const { fetchImage } = require('./utils/fetchImage');


const handleSearchedArticles = async (articles) => {
    const seenLinks = new Set();
    const filteredArticles = [];
    let allArticleIds = [];

    // Filter duplicates based on link
    for (const article of articles) {
        if (!seenLinks.has(article.link)) {
            seenLinks.add(article.link);
            filteredArticles.push(article);

        }
    }

    // try {


    // Step 1: Extract links from incoming articles
    const newLinks = filteredArticles.map(article => article.link);

    // Step 2: Find existing articles from DB by link
    const existingArticles = await Articles.find({ link: { $in: newLinks } }, '_id link');

    // Step 3: Build a Set of existing links
    const existingLinksSet = new Set(existingArticles.map(a => a.link));

    // Step 4: Separate new articles (not in DB)
    // const articlesToInsert = uniqueArticles.filter(article => !existingLinksSet.has(article.link));
    // const articlesArray = Array.from(uniqueArticles); // Convert Set to Array
    const articlesToInsert = filteredArticles.filter(article => !existingLinksSet.has(article.link));


    // for (const article of articlesToInsert) {
    //     article.photo_data = await fetchImage(article.photo_url);
    // }


    await (async () => {

        const pLimit = (await import('p-limit')).default;
        const limit = pLimit(5);

        await Promise.all(articlesToInsert.map(article => limit(async () => {
            article.photo_data = await fetchImage(article.photo_url);
        })));

    })();


    // Fetch Photos :-

    console.log("Type of articlesToInsert : ", typeof (articlesToInsert), Array.isArray(articlesToInsert));


    // Step 5: Insert only new articles
    const insertedArticles = await Articles.insertMany(articlesToInsert);

    // Step 6: Collect all _ids (existing + new)
    allArticleIds = [
        ...existingArticles.map(a => a._id),
        ...insertedArticles.map(a => a._id)
    ];
    // }

    // catch (error) {
    // console.log(error);
    // }

    console.log("Type of allArticleIDs : ", typeof (allArticleIds), Array.isArray(allArticleIds), allArticleIds.length);

    handleBertGeneration(insertedArticles).catch(err =>
        console.error("BERT generation crashed:", err)
    );

    insertedArticles.length = 0;

    return allArticleIds;

}




const handleBertGeneration = async (insertedArticles) => {
    try {
        const updates = [];
        let failedEmbeddings = 0;


        for (const article of insertedArticles) {

            const text = `${article.title} ${article.snippet || ''}`.trim(); // Combine title & snippet

            const embedding = await fetchBertEmbeddings(text);

            if (!embedding || !Array.isArray(embedding) || embedding.length !== 768) {
                console.warn(`Skipping due to invalid embedding: ${article.title}`);
                failedEmbeddings++;
                continue;
            }

            console.log("Embedding example:", embedding.slice(0, 5), "Length:", embedding.length);

            updates.push({
                updateOne: {
                    filter: { _id: article._id },
                    update: { $set: { bert_embedding: embedding } }
                }
            });
        }

        if (updates.length > 0) {

            console.log("Total updates prepared:", updates.length);
            console.log("Sample update (stringified):", JSON.stringify(updates[0], null, 2));

            await Articles.bulkWrite(updates);

            console.log("Bulk write  for searched Articles Completed");
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports = { handleSearchedArticles };