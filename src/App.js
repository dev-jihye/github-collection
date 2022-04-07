import Main from "./pages/Main";
import { HashRouter, Routes, Route } from "react-router-dom";
import StoredRepo from "./pages/StoredRepo";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/storedRepo" element={<StoredRepo />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
