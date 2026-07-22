import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";

function ToastProvider() {
  const { resolvedTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <ToastContainer
      position={isMobile ? "top-center" : "top-right"}
      autoClose={3000}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme={resolvedTheme}
      limit={3}
      style={{
        width: isMobile ? "92vw" : "420px",
        maxWidth: "92vw",
      }}
    />
  );
}

export default ToastProvider;
