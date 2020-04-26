import React from "react";

const Overlay = (props) => {
  return (
    <div>
      <div className="overLay">{props.children}</div>
    </div>
  );
};

export default Overlay;
