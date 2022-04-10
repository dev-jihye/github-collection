import { useContext, useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/solid";
import { useLocation } from "react-router-dom";
import Paginator from "../components/Paginator";
import Layout from "../components/Layout";
import { RepositoriesContext } from "../contextApi/RepositoriesContext";
import { parseQueryString } from "../utils";
import Loader from "../components/Loader";

export default function Search() {
  const {
    addRepository,
    deleteRepository,
    repositories: contextRepositories,
  } = useContext(RepositoriesContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [url, setUrl] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [searchQueries, setSearchQueries] = useState("");
  const [lastPageNum, setLastPageNum] = useState(1);

  const checkExistRepository = (repository) => {
    if (contextRepositories.length === 0) {
      return false;
    } else {
      for (const contextRepository of contextRepositories) {
        if (contextRepository.id === repository.id) {
          return true;
        }
      }
      return false;
    }
  };

  useEffect(() => {
    if (!searchQueries) {
      return;
    }
    setLoading(true);
    fetch(`https://api.github.com/search/repositories${searchQueries}`, {
      headers: {
        Authorization: process.env.REACT_APP_GITHUB_TOKEN,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRepositories(data.items);
        setLastPageNum(Math.ceil(data.total_count / perPage));
        setLoading(false);
      });
  }, [searchQueries, perPage]);

  useEffect(() => {
    const queries = parseQueryString(location.search);
    if (queries.q) {
      setSearchQueries(location.search);
    }
    if (Object.keys(queries).length > 0 && queries.page) {
      const urls = [];
      Object.keys(queries).forEach((key) => {
        if (key !== "page") {
          urls.push(`${key}=${queries[key]}`);
        }
      });
      setPage(Number(queries.page));
      setPerPage(Number(queries.per_page));
      setUrl(location.pathname + "?" + urls.join("&") + "&");
    } else if (Object.keys(queries).length > 0 && !queries.page) {
      const rest = location.search.split("page=")[0];
      setUrl(location.pathname + rest + "&");
    } else {
      setPage(1);
      setUrl(location.pathname + "?");
    }
  }, [location.search, location.pathname]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <Layout>
      <main className="flex-1">
        <div className="py-8 xl:py-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-1">
            <div className="xl:col-span-2 xl:pr-8">
              <div>
                {repositories &&
                  repositories.map((repository) => (
                    <div key={repository.id}>
                      <div className="py-10 border-b border-gray-300 flex justify-between">
                        <div className="pr-5">
                          <h1 className="text-2xl font-bold text-gray-900">
                            <a
                              href={repository.html_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {repository.full_name}
                            </a>
                          </h1>
                          <p className="mt-2 text-sm text-gray-500">
                            {repository.description}
                            {repository.stargazers_count ? (
                              <span className="font-medium text-gray-900">
                                {" "}
                                ⭐️ {repository.stargazers_count}
                              </span>
                            ) : (
                              ""
                            )}

                            {repository.language ? (
                              <span className="font-medium text-gray-900">
                                {" "}
                                📊 {repository.language}
                              </span>
                            ) : (
                              ""
                            )}
                          </p>
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              if (checkExistRepository(repository)) {
                                deleteRepository(repository);
                              } else {
                                addRepository(repository);
                              }
                            }}
                            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          >
                            <BellIcon
                              className={`-ml-1 mr-2 h-5 w-5 ${
                                checkExistRepository(repository)
                                  ? "text-orange-500"
                                  : "text-gray-300"
                              }`}
                              aria-hidden="true"
                            />
                            <span>Subscribe</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="mb-20">
        <Paginator page={page} url={url} lastPageNum={lastPageNum} />
      </footer>
    </Layout>
  );
}
