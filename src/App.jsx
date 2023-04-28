import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./utils/auth";
import RequireAuth from "./utils/RequireAuth";
import AdminAccess from "./utils/AdminAccess";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

const Login = React.lazy(() => import("./pages/Login/Login"));
const AppGallery = React.lazy(() => import("./pages/AppGallery/AppGallery"));

const DigitizationNavbar = React.lazy(() =>
  import("./components/Digitization/navbar/DigitizationNavbar")
);
const AdministrationNavbar = React.lazy(() =>
  import("./components/Administration/navbar/AdminNavbar")
);
const LeaveManagementNavbar = React.lazy(() => {
  import("./components/LeaveManagement/navbar/LeaveManagementNavbar");
});
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
const AuditLogs = React.lazy(() =>
  import("./components/Administration/AuditLogs/AuditLogs")
);
const CreateAccount = React.lazy(() =>
  import("./components/Administration/Accounts/CreateAccount/CreateAccount")
);
const ManageAccounts = React.lazy(() =>
  import("./components/Administration/Accounts/ManageAccounts/ManageAccounts")
);

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
                  <DigitizationNavbar />
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
          </Route>
          //* ADMIN ROUTES
          <Route
            path="/administration/*"
            element={
              <RequireAuth>
                <AdminAccess>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdministrationNavbar />
                  </Suspense>
                </AdminAccess>
              </RequireAuth>
            }
          >
            //* FALLBACK ROUTE
            <Route index element={<Navigate to="AuditLog" />} />
            <Route path="*" element={<Navigate to="AuditLog" />} />
            <Route
              path="AuditLog"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AuditLogs />
                </Suspense>
              }
            />
            <Route
              path="accounts/ManageAccounts"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ManageAccounts />
                </Suspense>
              }
            />
            <Route
              path="accounts/CreateAccount"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <CreateAccount />
                </Suspense>
              }
            />
            <Route
              path="accounts/EditAccount"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <CreateAccount />
                </Suspense>
              }
            />
          </Route>
          //* LEAVE MANAGEMENT ROUTES
          <Route
            path="/leavemanagement/*"
            element={
              <RequireAuth>
                <Suspense fallback={<LoadingSpinner />}>
                  <LeaveManagementNavbar />
                </Suspense>
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="AuditLog" />} />
            <Route path="*" element={<Navigate to="AuditLog" />} />
            <Route
              path="AuditLog"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AuditLogs />
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
