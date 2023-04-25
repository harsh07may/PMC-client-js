import React, { useState } from "react";
import "./CustomDropdown.css";

function Dropdown({ menu, children }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleDropdownClick() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="dropdown">
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

export default Dropdown;
