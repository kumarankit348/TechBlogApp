import React from "react";
import ReactLoading from "react-loading";

function LoadingComponent() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ReactLoading type={"spin"} color={"green"} height={50} width={50} />
    </div>
  );
}

export default LoadingComponent;
