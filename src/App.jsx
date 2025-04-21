import { useState } from 'react'
import './App.css'
import Login from './components/Login';
import Navbar from './components/Navbar';
import ArticleState from './context/articles/ArticleState';

import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ArticleState>
        <Router>
          <div className="d-flex flex-column sticky-top">
            <Navbar />
            {/* <Alert /> */}
          </div>

          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </Router>
      </ArticleState>
    </>
  )
}

export default App