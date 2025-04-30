import React, { useContext, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import articleContext from '../context/articles/articleContext';
import NewsItem from './NewsItem';




const News = () => {

    const context = useContext(articleContext);
    const { fetchNews, newsArticles } = context;

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("token")) {

            fetchNews();

            console.log("No. of articles : ", newsArticles.length);


        }
        else {

            navigate("/login");
        }
        // eslint-disable-next-line
    }, []);

    const displayNews = (article) => {
        console.log(article.bert_embedding);

        <NewsItem key={article._id} article={article} />

    }


    return (
        <>
            <div>
                {
                    newsArticles.length === 0 ? (
                        <p>Loading...</p>
                    ) : (
                        newsArticles.map((article) => (
                            // displayNews(article)

                            <NewsItem key={article._id} article={article} />
                        ))
                    )

                }
            </div>
        </>
    )
}

export default News;