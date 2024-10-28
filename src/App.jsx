import { useEffect } from "react";
import { Route, Routes } from "react-router";
import useTelegram from "./hook/useTelegram";
import Form from "./pages/form/FormComponent";

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
      </Routes>
    </>
  );
}

export default App;
