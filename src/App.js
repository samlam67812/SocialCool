import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { firebase, auth } from "./utils/firebase";

import Header from "./Header";
import Signin from "./pages/Signin";
import NewPost from "./pages/NewPost";
import PostNavigate from "./pages/PostNavigate";
import MemberNavigate from "./pages/MemberNavigate";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import ResetPassword from "./pages/ResetPassword";
import Posts from "./pages/Posts";

const App = () => {
  const auth = getAuth();
  const [user, setUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <BrowserRouter>
      <Header user={user} />
      <Routes>
        <Route path="/" element={<PostNavigate />}></Route>
        <Route
          path="/member/*"
          element={
            user ? (
              <MemberNavigate user={user} />
            ) : (
              <Navigate replace to="/posts" />
            )
          }
        />
        <Route
          path="/signin"
          element={user ? <Navigate replace to="/posts" /> : <Signin />}
        />
        <Route
          path="/reset-password"
          element={user ? <Navigate replace to="/posts" /> : <ResetPassword />}
        />
        <Route
          path="/new-post"
          element={user ? <NewPost /> : <Navigate replace to="/posts" />}
        />
        <Route path="/posts/*" element={<PostNavigate />}></Route>
        {/* if page not found */}
        <Route path="/*" element={<Navigate replace to="/posts" />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
