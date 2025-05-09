import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import articleContext from '../context/articles/articleContext';
import NewsItem from './NewsItem';




const News = () => {

    const context = useContext(articleContext);
    const { fetchNews, newsArticles, batch, setBatch } = context;

    let news = [];

    const navigate = useNavigate();




    useEffect(() => {
        if (localStorage.getItem("token")) {

            fetchNews({ personalised: true });

            console.log("No. of articles : ", newsArticles.length);
            // news = newsArticles.slice(batch - 1 * 40, batch * 40);
        }
        else {

            navigate("/login");
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        news = newsArticles.slice(batch - 1 * 40, batch * 40);

    }, [batch]);



    const handleReadMore = () => {
        setBatch(batch + 1);


        fetchNews({ personalised: true });
    }


    return (
        <>
            <div>
                {
                    newsArticles.length === 0 ? (
                        <p>Loading...</p>
                    ) : (

                        newsArticles.map((article, i) => (
                            <NewsItem key={article._id} article={article} i={i} />
                        ))
                    )

                }
            </div>

            <div id="readMore">
                <button onClick={handleReadMore}>
                    Read More
                </button>
            </div>
        </>
    )
}

export default News;