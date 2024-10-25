import { useEffect } from "react";
import { Route, Routes } from "react-router";
import useTelegram from "./hook/useTelegram";
import About from "./pages/about/About";
import Form from "./pages/home/Home";

function App() {
  const { tg } = useTelegram();

  useEffect(() => {
    if (tg) {
      tg.ready();
    }
  }, [tg]);

  return (
    <>
      <Routes>
        <Route index element={<Form />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
