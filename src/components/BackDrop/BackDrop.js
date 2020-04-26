import React from "react";

import "./BackDrop.css";

const BackDrop = (props) => {
  const { style } = props;
  return (
    <div className="backDrop" style={style}>
      {props.children}
    </div>
  );
};

export default BackDrop;
