import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./utils/auth";
import RequireAuth from "./utils/RequireAuth";

const Navbar = React.lazy(() =>
  import("./components/Digitization/navbar/Navbar")
);
const Help = React.lazy(() => import("./pages/Digitization/Help"));
const Login = React.lazy(() => import("./pages/Login/Login"));
const AppGallery = React.lazy(() => import("./pages/AppGallery/AppGallery"));
import LoadingSpinner from "./components/LoadingSpinner";

const BirthRecords = React.lazy(() =>
  import("./components/Digitization/add/BirthRecords")
);
const ConstructionLicense = React.lazy(() =>
  import("./components/Digitization/add/ConstructionLicense")
);
const MunicipalProperty = React.lazy(() =>
  import("./components/Digitization/add/MunicipalProperty")
);
const HouseTax = React.lazy(() =>
  import("./components/Digitization/add/HouseTax")
);
const MunicipalPropertySearch = React.lazy(() =>
  import("./components/Digitization/search/MunicipalPropertySearch")
);
const BirthRecordsSearch = React.lazy(() =>
  import("./components/Digitization/search/BirthRecordsSearch")
);
const ConstructionLicenseSearch = React.lazy(() =>
  import("./components/Digitization/search/ConstructionLicenseSearch")
);
const HouseTaxSearch = React.lazy(() =>
  import("./components/Digitization/search/HouseTaxSearch")
);

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
            //* FALLBACK ROUTE
            <Route index element={<Navigate to="search" />} />
            <Route
              path="*"
              element={<Navigate to="search/MunicipalPropertyRecord" />}
            />
            //* ADD RECORD ROUTES
            <Route
              path="add/MunicipalPropertyRecord"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <MunicipalProperty></MunicipalProperty>
                </Suspense>
              }
            />
            <Route
              path="add/BirthRecord"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <BirthRecords></BirthRecords>
                </Suspense>
              }
            />
            <Route
              path="add/ConstructionLicenseRecord"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ConstructionLicense></ConstructionLicense>
                </Suspense>
              }
            />
            <Route
              path="add/HouseTaxRecord"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <HouseTax></HouseTax>
                </Suspense>
              }
            />
            //* SEARCH RECORD ROUTES
            <Route
              path="search/MunicipalPropertyRecord"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <MunicipalPropertySearch />
                </Suspense>
              }
            />
            <Route
              path="search/BirthRecord"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <BirthRecordsSearch />
                </Suspense>
              }
            />
            <Route
              path="search/ConstructionLicenseRecord"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ConstructionLicenseSearch />
                </Suspense>
              }
            />
            <Route
              path="search/HouseTaxRecord"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <HouseTaxSearch />
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
