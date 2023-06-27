import { Route, BrowserRouter, Routes, redirect, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import { useCookies } from "react-cookie"

import Home from "./components/Home";
import Login from "./components/Login";
import { useContext, useEffect } from "react";
import { AppContext } from "./context/AppContext";

function App() {
  const { token, dispatch }  = useContext(AppContext);
  const [cookie] = useCookies(['jwt'])

  useEffect(() => {
    const setToken = () => {
      const { jwt } = cookie;
      if (jwt) {
        const token = {
          token: jwt
        }
  
        dispatch({
          type: 'ADD_TOKEN',
          payload: token
        })
      }
    };
  
    if (token === null) {
      setToken();
    }
  }, [dispatch, token, cookie]);



  return (
    <>
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/account" />} />
        <Route path="/account" element={!token ? <Login /> : <Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App;
