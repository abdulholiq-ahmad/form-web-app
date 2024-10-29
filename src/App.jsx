import { useEffect } from "react";
import { Route, Routes } from "react-router";
import useTelegram from "./hooks/useTelegram";
import FormComponent from "./pages/form/FormComponent";

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
        <Route index element={<FormComponent />} />
      </Routes>
    </>
  );
}

export default App;
