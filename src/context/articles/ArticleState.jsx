import { useState } from "react"
import articleContext from "./articleContext"





const ArticleState = (props) => {
    
    const HOST = "http://localhost:5000";
    
    const [toggleLogin, setToggleLogin] = useState(false);
    const [alertObj, setAlert] = useState(null);
    
    
    const userAuth = async () => {
        try {
            const response = await fetch(`${HOST}/api/auth/userauth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token")
                },
            });

            const json = await response.json();

            localStorage.setItem("name", json.name);
            localStorage.setItem("email", json.email);
            setUser({ name: json.name, email: json.email });

        } catch (error) {
            alert("Some eerror occured \n Check console fcor more info.")
            console.log("Error verifying user", error);
        }
    }








    const showAlert = (alertObj) => {
        setAlert(alertObj)

        setTimeout(() => {
            setAlert(null);
        }, 750);
    }



    return (
        <articleContext.Provider value={{ userAuth, setToggleLogin, showAlert, toggleLogin, alertObj }}>
            {props.children}
        </articleContext.Provider>
    )
}

export default ArticleState;