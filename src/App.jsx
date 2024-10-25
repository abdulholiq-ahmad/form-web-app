import { useEffect } from "react";
import { Route, Routes } from "react-router";
import useTelegram from "./hook/useTelegram";
import Home from "./pages/home/Home";

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
        <Route index element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
