"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={4000}
      style={{ zIndex: 99999 }}
    />
  );
};

export default ToastProvider;
