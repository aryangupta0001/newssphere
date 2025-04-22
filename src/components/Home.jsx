import { useContext } from "react";
import Login from "./Login";
import Signup from "./Signup";
import articleContext from "../context/articles/articleContext";
import News from './News'


const Home = () => {
  const context = useContext(articleContext);
  const { toggleLogin } = context;

  console.log("toggleLogin: ", toggleLogin);  // Check its value


  return (
    <>
      {localStorage.getItem("token") ? <News /> : (toggleLogin ? <Login /> : <Signup />)}
      {/* {toggleLogin ? <Login /> : <Signup />} */}
    </>
  )
}

export default Home