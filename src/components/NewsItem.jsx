import React, { useContext, useEffect } from 'react'
import './NewsItem.css'
import articleContext from '../context/articles/articleContext';


const NewsItem = (props) => {

    const context = useContext(articleContext);

    const { article } = props;
    const { articleClicked } = context;

    console.log("Displaying article : ", article.bert_embedding)
    return (
        <div id='news'>
            <div id="info">
                <h1 id='title'>
                    {article.title}
                </h1>
                <h6 id='publishedAt'>
                    Published at : {new Date(article.published_datetime_utc).toLocaleString()}
                </h6>

                <h2 id='snippet'>
                    {article.snippet}
                </h2>
                <h5 id='link'>
                    Read full article at :<a href={article.link} target='_blank' rel='noopener noreferrer' onClick={() => articleClicked(article)} > {article.link} </a>
                </h5>
            </div>

            <div id="photo">
                <img src={`http://localhost:5000/api/article/fetchimage?id=${article._id}&image=photo`} alt="" />
            </div>
        </div>
    )
}

export default NewsItem
