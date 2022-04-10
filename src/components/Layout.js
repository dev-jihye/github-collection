import Navbar from "./Navbar";
import Searchbar from "./Searchbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Navbar />
      <div className="pl-64 flex flex-col w-0 flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <Searchbar />
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
