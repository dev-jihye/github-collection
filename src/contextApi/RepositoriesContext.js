import { createContext, useEffect, useState } from "react";

export const RepositoriesContext = createContext({
  repositories: [],
  addRepository: () => {},
  deleteRepository: () => {},
  getRepositories: () => {},
});

const STORAGE_KEY = "repositories";

export const RepositoriesProvider = ({ children }) => {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    const repositories = localStorage.getItem("repositories");
    if (repositories) {
      setRepositories(JSON.parse(repositories));
    }
  }, [setRepositories]);

  const addRepository = (repository) => {
    const repositories = localStorage.getItem(STORAGE_KEY);
    if (repositories) {
      const parsedRepositories = JSON.parse(repositories);
      if (parsedRepositories.length > 3) {
        alert("레포지토리는 최대 4개까지 저장가능합니다.");
        return;
      }
      const newRepositories = [...parsedRepositories, repository];
      localStorage.setItem("repositories", JSON.stringify(newRepositories));
      setRepositories(newRepositories);
    } else {
      const newRepositories = [repository];
      localStorage.setItem("repositories", JSON.stringify(newRepositories));
      setRepositories(newRepositories);
    }
  };

  const deleteRepository = (repository) => {
    const repositories = localStorage.getItem(STORAGE_KEY);
    if (repositories) {
      const parsedRepositories = JSON.parse(repositories);
      const newRepositories = parsedRepositories.filter(
        (parsedRepository) => parsedRepository.id !== repository.id
      );
      localStorage.setItem("repositories", JSON.stringify(newRepositories));
      setRepositories(newRepositories);
    }
  };

  const getRepositories = () => {
    const repositories = localStorage.getItem(STORAGE_KEY);
    if (repositories) {
      return JSON.parse(repositories);
    }
  };

  return (
    <RepositoriesContext.Provider
      value={{
        repositories,
        addRepository,
        deleteRepository,
        getRepositories,
      }}
    >
      {children}
    </RepositoriesContext.Provider>
  );
};
