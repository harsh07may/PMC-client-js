import React, { useEffect, useState, useRef } from "react";
import listenForOutsideClick from "./listen-for-outside-clicks";
import "./CustomDropdown.css";

function CustomDropdown({ menu, children }) {
  const [isOpen, setIsOpen] = useState(false);

  // Hide Dropdown on Outside Click
  const menuRef = useRef(null);
  const [listening, setListening] = useState(false);
  useEffect(listenForOutsideClick(listening, setListening, menuRef, setIsOpen));

  function handleDropdownClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="dropdown" ref={menuRef}>
      <div className="dropdown__toggle" onClick={handleDropdownClick}>
        {children}
        {/* <span className="dropdown__icon">{isOpen ? "▲" : "▼"}</span> */}
      </div>
      {isOpen && (
        <div className="dropdown__menu">
          {menu.map((item) => (
            <div
              className="dropdown__item"
              key={item.key}
              onClick={handleDropdownClick}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
