import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import useTelegram from "./hooks/useTelegram";
import FormComponent from "./pages/form/FormComponent";
import { SuspenseComponent } from "@/utils";

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
        <Route
          index
          element={
            <SuspenseComponent>
              <FormComponent />
            </SuspenseComponent>
          }
        />
      </Routes>
    </>
  );
}

export default App;
