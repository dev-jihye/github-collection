import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Pagination({ page, url, lastPageNum }) {
  const [pageGroup, setPageGroup] = useState([]);

  useEffect(() => {
    const pageNums = [];
    const splicedPageNums = [];
    for (let i = 1; i <= lastPageNum; i++) {
      pageNums.push(i);
    }

    const loop = Math.ceil(pageNums.length / 10);
    for (let j = 0; j < loop; j++) {
      splicedPageNums.push(pageNums.splice(0, 10));
    }

    splicedPageNums.forEach((splicedPageNum) => {
      if (splicedPageNum.indexOf(page) >= 0) {
        setPageGroup(splicedPageNum);
      }
    });
  }, [page, lastPageNum]);

  return (
    <div className="bg-white py-3 flex items-center justify-between px-6">
      <div className="flex-1 flex items-center justify-center">
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <Link
              to={`${url}page=${page > 1 ? page - 1 : page}`}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
            {pageGroup.map((item) => (
              <Link
                key={item}
                to={`${url}page=${item}`}
                className={
                  item === page
                    ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                }
              >
                {item}
              </Link>
            ))}
            <Link
              to={`${url}page=${page < lastPageNum ? page + 1 : page}`}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
