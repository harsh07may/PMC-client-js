import React, { useState, useEffect, Suspense } from "react";
// import Navbar from "./components/Digitization/navbar/Navbar";
const Navbar = React.lazy(() =>
  import("./components/Digitization/navbar/Navbar")
);
// import Add from "./pages/Digitization/Add";
const Add = React.lazy(() => import("./pages/Digitization/Add"));
// import Search from "./pages/Digitization/Search";
const Search = React.lazy(() => import("./pages/Digitization/Search"));
// import Help from "./pages/Digitization/Help";
const Help = React.lazy(() => import("./pages/Digitization/Help"));
// import Login from "./pages/Login/Login";
const Login = React.lazy(() => import("./pages/Login/Login"));
// import AppGallery from "./pages/AppGallery/AppGallery";
const AppGallery = React.lazy(() => import("./pages/AppGallery/AppGallery"));

import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./utils/auth";
import RequireAuth from "./utils/RequireAuth";
import { FILE_UPLOAD_SIZE_LIMIT } from "./GLOBAL_VARS";

import axios from "axios";
// Icons taken from https://www.svgrepo.com

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/AppGallery"
            element={
              //<RequireAuth>
              <Suspense fallback={<div>Loading...</div>}>
                <AppGallery />
              </Suspense>
              //</RequireAuth>
            }
          />

          <Route
            path="/digitization/*"
            element={
              //<RequireAuth>
              <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
              </Suspense>
              //</RequireAuth>
            }
          >
            <Route index element={<Navigate to="search" />} />
            <Route path="*" element={<Navigate to="search" />} />
            <Route
              path="search"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Search />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                // <Help />
                <Suspense fallback={<div>Loading...</div>}>
                  <Add />
                </Suspense>
              }
            />
            <Route
              path="help"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Help />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
