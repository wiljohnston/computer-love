import React from "react";

import "./TextFlow.css";

const Overlay = (props) => {
  return (
    <div className={`textFlow flexCol fullHeight ${props.className || ""}`}>
      <p style={{ fontSize: props.lineHeight, lineHeight: props.lineHeight }}>
        {props.chunks.join(" ")}
      </p>
    </div>
  );
};

export default Overlay;
