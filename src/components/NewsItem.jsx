import React, { useContext, useEffect } from 'react'
import './NewsItem.css'
import articleContext from '../context/articles/articleContext';
import { formatDistanceToNow } from 'date-fns';



const NewsItem = (props) => {

    const context = useContext(articleContext);

    const { article, i } = props;
    const { articleClicked } = context;
    const relativeTime = formatDistanceToNow(new Date(article.published_datetime_utc), { addSuffix: true });


    // console.log("Displaying article : ", article.bert_embedding)
    return (
        <div id='news' className={`${i % 2 == 0 ? 'even' : 'odd'} mx-2 d-flex justify-content-between`}>

            {
                i % 2 ?
                    <div id="photo" className={`${i % 2 == 0 ? 'left' : 'right'} photo-wrapper`} style={{ backgroundImage: `url(http://localhost:5000/api/article/fetchimage?id=${article._id}&image=photo)` }}>
                        <div className="blur-overlay"></div>

                        <img src={`http://localhost:5000/api/article/fetchimage?id=${article._id}&image=photo`} alt="" className='content' />
                    </div>
                    :

                    <></>
            }
            <div id="info" className='py-2'>
                <h3 id='title'>
                    {article.title}
                </h3>

                <h6>
                    <u>
                        {relativeTime}
                    </u>
                </h6>

                <h6 id='author'>
                    Written by <u>{article.authors ? article.authors[0] : ''} | {article.source_name}</u> ({relativeTime})
                </h6>

                <p id='publishedAt'>
                    Published at : {new Date(article.published_datetime_utc).toLocaleString()} IST
                </p>

                <h5 id='snippet'>
                    {article.snippet}
                </h5>

                <p id='link' className='my-3'>
                    Read full article at :<a href={article.link} target='_blank' rel='noopener noreferrer' onClick={() => articleClicked(article)} > {article.link} </a>
                </p>

                <h6>
                    {article.score}
                </h6>
            </div>

            {
                i % 2 ?
                    <></>
                    :
                    <div id="photo" className={`${i % 2 == 0 ? 'left' : 'right'} photo-wrapper`} style={{ backgroundImage: `url(http://localhost:5000/api/article/fetchimage?id=${article._id}&image=photo)` }}>
                        <div className="blur-overlay"></div>

                        <img src={`http://localhost:5000/api/article/fetchimage?id=${article._id}&image=photo`} alt="" className='content' />
                    </div>
            }
        </div>
    )
}

export default NewsItem