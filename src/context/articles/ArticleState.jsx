import { useState } from "react"
import articleContext from "./articleContext"





const ArticleState = (props) => {

    const HOST = "http://localhost:5000";

    const [toggleLogin, setToggleLogin] = useState(true);
    const [alertObj, setAlert] = useState(null);
    const [newsArticles, setNewsArticles] = useState([]);






    // User Login & Authentication :-

    // Authenticate a user --->

    const userAuth = async () => {
        try {
            // console.log(localStorage.getItem("token"));
            const response = await fetch(`${HOST}/api/auth/getuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                },
            });

            const json = await response.json();

            localStorage.setItem("name", json.name);
            localStorage.setItem("email", json.email);
            // setUser({ name: json.name, email: json.email });

        } catch (error) {
            alert("Some eerror occured \n Check console fcor more info.")
            console.log("Error verifying user", error);
        }
    }










    // News aggregation :-

    // Fetch News for a user --->

    const fetchNews = async () => {

        try {
            const response = await fetch(`${HOST}/api/article/fetcharticles`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                }
            });

            const articles = await response.json();

            console.log("ArticleState > fetchNews\tType of Articles : ", typeof (articles));
            console.log("ArticleState > fetchNews\t Articles is Array ? : ",Array.isArray(articles));


            // console.log(articles);
            // newsArticles.push(...articles);

            setNewsArticles(articles);

        }

        catch (error) {
            console.log(error);
        }
    }


    const articleClicked = async (article) => {
        try {

            // console.log("articleClicked : ", article._id);
            // console.log("articleClicked : ", article.bert_embedding);
            // console.log("articleClicked : ", typeof (article.bert_embedding));

            const response = await fetch('http://localhost:5000/api/auth/updatepreferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token')
                },
                body: JSON.stringify({ id: article._id, bert_embedding: article.bert_embedding })
            });

            const result = await response.json();

            if (result.success)
                console.log("User preference updated");

            else
                console.error("Error updating user preferences");
        }
        catch (error) {
            console.error(error);
        }
    }








    const showAlert = (alertObj) => {
        setAlert(alertObj)

        setTimeout(() => {
            setAlert(null);
        }, 750);
    }



    return (
        <articleContext.Provider value={{ userAuth, setToggleLogin, showAlert, fetchNews, setNewsArticles, articleClicked, toggleLogin, alertObj, newsArticles }}>
            {props.children}
        </articleContext.Provider>
    )
}

export default ArticleState;