import React, { Suspense } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./utils/auth";
import RequireAuth from "./utils/RequireAuth";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import AccessHandler from "./utils/AccessHandler";
import { DefaultDigitizationRoute } from "./utils/DefaultDigitizationRoute";
import TestPage from "./pages/TestPage";
import NewApplication from "./components/AppTracking/NewApplication/NewApplication";
import TrackApplication from "./components/AppTracking/TrackApplication/TrackApplication";
import ApplicationInbox from "./components/AppTracking/ApplicationInbox/ApplicationInbox";

const Login = React.lazy(() => import("./pages/Login/Login"));
const AppGallery = React.lazy(() => import("./pages/AppGallery/AppGallery"));

const DigitizationNavbar = React.lazy(() =>
  import("./components/Digitization/navbar/DigitizationNavbar")
);
const AdministrationNavbar = React.lazy(() =>
  import("./components/Administration/navbar/AdminNavbar")
);
const LeaveManagementNavbar = React.lazy(() =>
  import("./components/LeaveManagement/navbar/LeaveManagementNavbar")
);
const FileTrackingNavbar = React.lazy(() =>
  import("./components/AppTracking/navbar/FileTrackingNavbar")
);
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
const TradeLicense = React.lazy(() =>
  import("./components/Digitization/add/TradeLicense")
);
const DeathRecords = React.lazy(() =>
  import("./components/Digitization/add/DeathRecords")
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
const DeathRecordsSearch = React.lazy(() =>
  import("./components/Digitization/search/DeathRecordsSearch")
);
const TradeLicenseSearch = React.lazy(() =>
  import("./components/Digitization/search/TradeLicenseSearch")
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
            path="/test"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <TestPage />
              </Suspense>
            }
          />
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
          //* DIGITIZATION ROUTE
          <Route
            path="/digitization/*"
            element={
              <RequireAuth>
                <AccessHandler
                  resource={[
                    "municipality_property_records",
                    "birth_records",
                    "construction_license_records",
                    "death_records",
                    "house_tax_records",
                    "trade_license_records",
                  ]}
                  accessLevel={"viewer"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <DigitizationNavbar />
                  </Suspense>
                </AccessHandler>
              </RequireAuth>
            }
          >
            //* FALLBACK ROUTE
            {/*//* index routes will activate when none of the paths are matched,
            //* here this index routes navigates to "search" which doesn't exist
            //* so the wildcard (*) path gets activated, which navigates to search/MunicipalPropertyRecord */}
            <Route index element={<DefaultDigitizationRoute />} />
            <Route path="*" element={<DefaultDigitizationRoute />} />
            //* ADD RECORD ROUTES
            <Route
              path="add/MunicipalPropertyRecord"
              element={
                <AccessHandler
                  resource={["municipality_property_records"]}
                  accessLevel={"editor"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <MunicipalProperty />
                  </Suspense>
                </AccessHandler>
              }
            />
            <Route
              path="add/BirthRecord"
              element={
                <AccessHandler
                  resource={["birth_records"]}
                  accessLevel={"editor"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <BirthRecords />
                  </Suspense>
                </AccessHandler>
              }
            />
            <Route
              path="add/ConstructionLicenseRecord"
              element={
                <AccessHandler
                  resource={["construction_license_records"]}
                  accessLevel={"editor"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <ConstructionLicense />
                  </Suspense>
                </AccessHandler>
              }
            />
            <Route
              path="add/HouseTaxRecord"
              element={
                <AccessHandler
                  resource={["house_tax_records"]}
                  accessLevel={"editor"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <HouseTax />
                  </Suspense>
                </AccessHandler>
              }
            />
            <Route
              path="add/TradeLicenseRecord"
              element={
                <AccessHandler
                  resource={["trade_license_records"]}
                  accessLevel={"editor"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <TradeLicense />
                  </Suspense>
                </AccessHandler>
              }
            />
            <Route
              path="add/DeathRecord"
              element={
                <AccessHandler
                  resource={["death_records"]}
                  accessLevel={"editor"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <DeathRecords />
                  </Suspense>
                </AccessHandler>
              }
            />
            //* SEARCH RECORD ROUTES
            <Route
              path="search/MunicipalPropertyRecord"
              element={
                <AccessHandler
                  resource={["municipality_property_records"]}
                  accessLevel={"viewer"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <MunicipalPropertySearch />
                  </Suspense>
                </AccessHandler>
              }
            />
            <Route
              path="search/BirthRecord"
              element={
                <AccessHandler
                  resource={["birth_records"]}
                  accessLevel={"viewer"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <BirthRecordsSearch />
                  </Suspense>
                </AccessHandler>
              }
            />
            <Route
              path="search/ConstructionLicenseRecord"
              element={
                <AccessHandler
                  resource={["construction_license_records"]}
                  accessLevel={"viewer"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <ConstructionLicenseSearch />
                  </Suspense>
                </AccessHandler>
              }
            />
            <Route
              path="search/HouseTaxRecord"
              element={
                <AccessHandler
                  resource={["house_tax_records"]}
                  accessLevel={"viewer"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <HouseTaxSearch />
                  </Suspense>
                </AccessHandler>
              }
            />
            <Route
              path="search/TradeLicenseRecord"
              element={
                <AccessHandler
                  resource={["trade_license_records"]}
                  accessLevel={"viewer"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <TradeLicenseSearch />
                  </Suspense>
                </AccessHandler>
              }
            />
            <Route
              path="search/DeathRecord"
              element={
                <AccessHandler
                  resource={["death_records"]}
                  accessLevel={"viewer"}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <DeathRecordsSearch />
                  </Suspense>
                </AccessHandler>
              }
            />
          </Route>
          //* ADMIN ROUTES
          <Route
            path="/administration/*"
            element={
              <RequireAuth>
                <AccessHandler resource={["admin"]} accessLevel={"admin"}>
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdministrationNavbar />
                  </Suspense>
                </AccessHandler>
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
            //* FALLBACK ROUTE
            <Route index element={<Navigate to="test" />} />
            <Route path="*" element={<Navigate to="test" />} />
            <Route
              path="test"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  {/* <AuditLogs /> */}
                  <p>test</p>
                </Suspense>
              }
            />
            <Route
              path="dashboard"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  {/* <ManageAccounts /> */}
                  <p>dashboard</p>
                </Suspense>
              }
            />
          </Route>
          //* APP TRACKING ROUTES
          <Route
            path="/apptracking/*"
            element={
              <RequireAuth>
                <Suspense fallback={<LoadingSpinner />}>
                  <FileTrackingNavbar></FileTrackingNavbar>
                </Suspense>
              </RequireAuth>
            }
          >
            //* FALLBACK ROUTE
            <Route index element={<Navigate to="inbox" />} />
            <Route path="*" element={<Navigate to="inbox" />} />
            <Route
              path="inbox"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ApplicationInbox />
                </Suspense>
              }
            />
            <Route
              path="file/new"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <NewApplication />
                </Suspense>
              }
            />
            <Route
              path="file/tracking"
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <TrackApplication />
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
