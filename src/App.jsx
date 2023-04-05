import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./utils/auth";
import RequireAuth from "./utils/RequireAuth";

// import Navbar from "./components/Digitization/navbar/Navbar";
// import Add from "./pages/Digitization/Add";
// import Search from "./pages/Digitization/Search";
// import Help from "./pages/Digitization/Help";
// import Login from "./pages/Login/Login";
// import AppGallery from "./pages/AppGallery/AppGallery";

const Navbar = React.lazy(() =>
  import("./components/Digitization/navbar/Navbar")
);
const Add = React.lazy(() => import("./pages/Digitization/Add"));
const Search = React.lazy(() => import("./pages/Digitization/Search"));
const Help = React.lazy(() => import("./pages/Digitization/Help"));
const Login = React.lazy(() => import("./pages/Login/Login"));
const AppGallery = React.lazy(() => import("./pages/AppGallery/AppGallery"));
import LoadingSpinner from "./components/LoadingSpinner";

// Icons taken from https://www.svgrepo.com

const NotFound = () => {
  return <h1>Page Not found</h1>;
};

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/AppGallery"
            element={
              <RequireAuth>
                <Suspense fallback={<LoadingSpinner />}>
                  <AppGallery />
                </Suspense>
              </RequireAuth>
            }
          />

          <Route
            path="/digitization/*"
            element={
              <RequireAuth>
                <Suspense fallback={<LoadingSpinner />}>
                  <Navbar />
                </Suspense>
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="search" />} />
            <Route path="*" element={<Navigate to="search" />} />
            <Route
              path="search"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Search />
                </Suspense>
              }
            />
            <Route
              path="add"
              element={
                // <Help />
                <Suspense fallback={<LoadingSpinner />}>
                  <Add />
                </Suspense>
              }
            />
            <Route
              path="help"
              element={
                <Suspense fallback={<LoadingSpinner />}>
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
