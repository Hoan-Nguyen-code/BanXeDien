import Header from "../components/Header";
import Footer from "../components/Footer";

import "../assets/css/base.css";

export default function MainLayout({ children }: any) {
  return (
    <>
      <Header />

      {/* ALERT */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "20px auto",
          padding: "0 25px",
        }}
      ></div>

      {/* MAIN */}
      <main
        style={{
          minHeight: "70vh",
          maxWidth: "1400px",
          margin: "auto",
          padding: "0 25px 40px",
        }}
      >
        {children}
      </main>

      <Footer />
    </>
  );
}
