import logo from "../assets/github.svg";
import { HomeIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { RepositoriesContext } from "../contextApi/RepositoriesContext";
import { XIcon } from "@heroicons/react/solid";

const navigation = [
  { name: "All Issues", href: "/", icon: HomeIcon, current: true },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { repositories, deleteRepository } = useContext(RepositoriesContext);
  const navigate = useNavigate();
  const onImgClick = () => {
    navigate("/");
  };

  return (
    <div className="flex w-64 fixed inset-y-0">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
          <img
            className="h-8 w-auto cursor-pointer"
            src={logo}
            alt="github"
            onClick={onImgClick}
          />
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto bg-gray-800">
          <nav className="flex-1 px-2 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? "text-gray-300"
                        : "text-gray-400 group-hover:text-gray-300",
                      "mr-3 flex-shrink-0 h-6 w-6"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ))}
            </div>
            <div className="mt-10">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Repositories
              </p>
              <ul className="mt-2 space-y-1">
                {repositories.map((repository) => (
                  <li
                    key={repository.id}
                    className="group flex justify-between items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700"
                  >
                    <a
                      href={repository.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="truncate"
                    >
                      {repository.full_name}
                    </a>
                    <XIcon
                      onClick={() => {
                        deleteRepository(repository);
                      }}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
