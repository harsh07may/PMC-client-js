import { useState, useEffect } from "react";
import Navbar from "./components/Digitization/navbar/Navbar";
import Add from "./pages/Digitization/Add";
import Search from "./pages/Digitization/Search";
import Help from "./pages/Digitization/Help";
import Login from "./pages/Login/Login";
import AppGallery from "./pages/AppGallery/AppGallery";

import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./utils/auth";
import RequireAuth from "./utils/RequireAuth";
import { FILE_UPLOAD_SIZE_LIMIT } from "./GLOBAL_VARS";

import axios from "axios";
// Icons taken from https://www.svgrepo.com

function App() {
  const auth = useAuth();

  useEffect(() => {
    async function checkRefreshToken() {
      axios
        .post(
          "http://localhost:5000/api/v1/user/refresh_token",
          {},
          {
            credentials: "include",
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log("Error" + err);
        });
    }
    checkRefreshToken();
  }, []);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/AppGallery"
            element={
              //<RequireAuth>
              <AppGallery />
              //</RequireAuth>
            }
          />

          <Route
            path="/digitization/*"
            element={
              <RequireAuth>
                <Navbar />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="search" />} />
            <Route path="*" element={<Navigate to="search" />} />
            <Route path="search" element={<Search />} />
            <Route path="add" element={<Add />} />
            <Route path="help" element={<Help />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
