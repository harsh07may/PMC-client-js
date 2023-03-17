import { useState } from "react";
import Navbar from "./components/Digitization/navbar/Navbar";
import Add from "./pages/Digitization/Add";
import Search from "./pages/Digitization/Search";
import Help from "./pages/Digitization/Help";
import Login from "./pages/Login";
import AppGallery from "./pages/AppGallery";
import { Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/AppGallery" element={<AppGallery />} />

        <Route path="/digitization/*" element={<Navbar />}>
          <Route index element={<Navigate to="search" />} />
          <Route path="*" element={<Navigate to="search" />} />
          <Route path="search" element={<Search />} />
          <Route path="add" element={<Add />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
