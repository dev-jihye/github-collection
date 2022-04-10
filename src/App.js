import Main from "./pages/Main";
import { HashRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import { RepositoriesProvider } from "./contextApi/RepositoriesContext";

function App() {
  return (
    <RepositoriesProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </HashRouter>
    </RepositoriesProvider>
  );
}

export default App;
