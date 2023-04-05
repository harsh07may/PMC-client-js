import React from "react";
import LoadingSpinnerCss from "./LoadingSpinner.module.css";

export default function LoadingSpinner() {
  return (
    <div
      class={`${LoadingSpinnerCss.spinneroverlay} ${LoadingSpinnerCss.donatespinner}`}
    >
      <div className={LoadingSpinnerCss.loadingcontent}>
        <div className={LoadingSpinnerCss.spinner}></div>
        <div className={LoadingSpinnerCss.textCenter}>
          <p id="waitText">Please wait...</p>
          <p id="spinnerText"></p>
        </div>
      </div>
    </div>
  );
}
