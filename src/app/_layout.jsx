import React from "react";

const RootLayout = ({ children }) => {
  return (
    <>
      Header
      {children}
      Footer
    </>
  );
};

export default RootLayout;
