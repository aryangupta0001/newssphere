const Articles = require('../models/Articles');
const { fetchBertEmbeddings } = require('./fetchBertEmbeddings');
const { fetchImage } = require('./fetchImage'); // adjust path if needed

const fixIncompleteArticles = async () => {

    const allArticles = await Articles.find({});
    let updatedCount = 0;
    const articleCount = allArticles.length;

    for (const article of allArticles) {
        const update = {};

        // 🖼️ Fix missing photo_data
        if (!article.photo_data) {
            try {
                const photo = await fetchImage(article.photo_url);
                if (photo) update.photo_data = photo;
            } catch (err) {
                console.warn(`Photo fetch failed for article: ${article.link}`);
            }
        }

        // 🧠 Fix missing bert_embedding    
        if (article.bert_embedding.length == 0) {
            try {
                const text = `${article.title} ${article.snippet || ''}`.trim();
                const embedding = await fetchBertEmbeddings(text);
                if (embedding && Array.isArray(embedding) && embedding.length === 768) {
                    update.bert_embedding = embedding;
                }
            } catch (err) {
                console.warn(`Embedding failed for article: ${article.link}`);
            }
        }

        // ✅ Update in DB if needed
        if (Object.keys(update).length > 0) {
            await Articles.updateOne({ _id: article._id }, { $set: update });
            updatedCount++;
        }

        console.log("Updated : ", updatedCount, ' / ', articleCount);
    }

    console.log(`✅ Fixed ${updatedCount} incomplete articles`);
};

module.exports = fixIncompleteArticles;
