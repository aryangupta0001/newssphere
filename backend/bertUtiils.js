let classifier;

// Initialize BERT model once
async function initBERT() {
    if (!classifier) {
        const { pipeline } = await import('@xenova/transformers');

        classifier = await pipeline('feature-extraction', 'Xenova/bert-base-uncased');
    }
}

// Function to get BERT sentence embedding from title + snippet
async function getArticleEmbedding(texts) {
    await initBERT();

    // Get raw token-level output
    const output = await classifier(texts); // output[0] = array of token embeddings


    /*
    // Single Processing mode --->
    
    // Convert tensor to nested array
    const arrayOutput = await output.tolist(); //   Converts tensor to nested JS array
    

    // shape: [1, tokens, 768] — so arrayOutput[0] is [tokens, 768]
    const tokenEmbeddings = arrayOutput[0];

    // Initialize an array of zeros with 768 dimensions
    const sentenceEmbedding = new Array(768).fill(0);

    // Sum up all token embeddings
    for (let tokenIdx = 0; tokenIdx < tokenEmbeddings.length; tokenIdx++) {
        for (let dimIdx = 0; dimIdx < 768; dimIdx++) {
            sentenceEmbedding[dimIdx] += tokenEmbeddings[tokenIdx][dimIdx];
        }
    }

    // Divide by number of tokens to get the average
    for (let dimIdx = 0; dimIdx < 768; dimIdx++) {
        sentenceEmbedding[dimIdx] /= tokenEmbeddings.length;
    }

    */

    /*
    // Batch-Processing Mode --->
    */

    // Convert tensor to nested array
    const arrayOutput = await Promise.all(output.map(item => item.tolist())); // Converts tensor to nested JS array

    // Now, arrayOutput contains an array for each text in the batch
    const sentenceEmbeddings = arrayOutput.map((tokenEmbeddings) => {
        // shape: [tokens, 768] — tokenEmbeddings is [tokens, 768]

        // Initialize an array of zeros with 768 dimensions for each sentence
        const sentenceEmbedding = new Array(768).fill(0);

        // Sum up all token embeddings
        for (let tokenIdx = 0; tokenIdx < tokenEmbeddings.length; tokenIdx++) {
            for (let dimIdx = 0; dimIdx < 768; dimIdx++) {
                sentenceEmbedding[dimIdx] += tokenEmbeddings[tokenIdx][dimIdx];
            }
        }

        // Divide by number of tokens to get the average
        for (let dimIdx = 0; dimIdx < 768; dimIdx++) {
            sentenceEmbedding[dimIdx] /= tokenEmbeddings.length;
        }

        return sentenceEmbedding; // This is a 768-dim BERT vector for each article
    });



    return sentenceEmbeddings; // This is a 768-dim BERT vectors

}
module.exports = {
    getArticleEmbedding
};