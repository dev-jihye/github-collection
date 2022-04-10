import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useContext, useEffect, useState } from "react";
import { parseQueryString } from "../utils";
import { RepositoriesContext } from "../contextApi/RepositoriesContext";
import Paginator from "../components/Paginator";
import Loader from "../components/Loader";

export default function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState([]);
  const { getRepositories } = useContext(RepositoriesContext);
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;
  const [lastPageNum, setLastPageNum] = useState(1);

  useEffect(() => {
    const queries = parseQueryString(location.search);
    const repositories = getRepositories();
    if (queries.page) {
      setPage(Number(queries.page));
    } else {
      navigate("/?page=1");
    }
    setLoading(true);

    let maxIssuesCount = 0;

    repositories.forEach((repository) => {
      if (repository.open_issues_count > maxIssuesCount) {
        maxIssuesCount = repository.open_issues_count;
      }
    });
    setLastPageNum(
      Math.ceil(
        maxIssuesCount > 1000 ? 1000 / PER_PAGE : maxIssuesCount / PER_PAGE
      )
    );

    const fetchIssues = async (repository) => {
      const api = `https://api.github.com/repos/${repository.owner.login}/${repository.name}/issues?&per_page=${PER_PAGE}&page=${queries.page}`;
      const res = await fetch(api, {
        headers: {
          Authorization: process.env.REACT_APP_GITHUB_TOKEN,
        },
      });
      return await res.json();
    };

    const mergeIssues = async () => {
      let newIssues = [];
      for (let i = 0; i < repositories.length; i++) {
        const issues = await fetchIssues(repositories[i]);
        newIssues = [
          ...newIssues,
          ...issues.map((issue) => {
            return {
              ...issue,
              repository_name: repositories[i].name,
              repository_owner: repositories[i].owner.login,
            };
          }),
        ];
      }
      setIssues(newIssues);
      setLoading(false);
    };
    mergeIssues();
  }, [location.search, getRepositories, navigate]);

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
                {issues.length === 0 && (
                  <span>저장된 레포지토리 이슈가 없습니다.</span>
                )}
                {issues &&
                  issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="py-10 border-b border-gray-300"
                    >
                      {issue.pull_request && (
                        <p className="bg-indigo-600 text-white inline-block text-xs px-2 py-1 rounded-md mb-1">
                          PR
                        </p>
                      )}
                      <a href={issue.html_url} target="_blank" rel="noreferrer">
                        <h1 className="text-2xl font-bold text-gray-900 hover:text-gray-400">
                          {issue.title}
                        </h1>
                      </a>
                      <p className="mt-2 text-sm text-gray-500">
                        📊 {issue.repository_name} by ✍️{" "}
                        {issue.repository_owner}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      {issues.length !== 0 && (
        <footer className="mb-20">
          <Paginator page={page} url={"?"} lastPageNum={lastPageNum} />
        </footer>
      )}
    </Layout>
  );
}
