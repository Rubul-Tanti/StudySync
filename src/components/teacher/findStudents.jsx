import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiBookmark, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/axios";
import Loader from "../loader";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-start">
        <Link to={`page/${course._id}`}>
          <h2 className="text-lg font-semibold text-gray-800 hover:underline hover:text-[#005188] cursor-pointer">
            {course.title}
          </h2>
        </Link>
        <button className="text-gray-500 hover:text-[#005188]">
          <FiBookmark size={20} />
        </button>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mt-3 line-clamp-3">
        {course.description}
      </p>
      <p className="text-sm text-gray-500 font-semibold">
        Budget : $ {course.budget}/hr
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-xs bg-blue-100 text-[#005188] px-2 py-1 rounded-full">
          {course.course}
        </span>
      </div>

      {/* CTA */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-gray-500 text-sm">
          Posted{" "}
          {new Date(course.postedAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
        <p className="text-gray-600 text-sm">
          {course.postedBy?.name}
        </p>
      </div>
    </div>
  );
};

const fetchPosts = async (page, searchQuery, sortBy) => {
  const limit = 20;
  const p = page ? parseInt(page) : 1;
  const skip = (p - 1) * limit;
  
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (sortBy) params.append('sortBy', sortBy);
    
    const queryString = params.toString();
    const url = `/v1/fetchjobs/${skip}/${limit}${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return response.data.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const CourseList = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = page ? parseInt(page) : 1;
  
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["jobPost", currentPage, searchQuery, sortBy],
    queryFn: () => fetchPosts(currentPage, searchQuery, sortBy),
    keepPreviousData: true,
  });

  // Fetch suggestions
  const { data: suggestionsData } = useQuery({
    queryKey: ["suggestions", searchInput],
    queryFn: () => fetchPosts(1, searchInput, sortBy),
    enabled: searchInput.length > 2 && showSuggestions,
    keepPreviousData: true,
  });

  if (error) {
    toast.error("Something went wrong");
  }

  // Update suggestions when data arrives
  if (suggestionsData?.allposts && showSuggestions) {
    if (JSON.stringify(suggestions) !== JSON.stringify(suggestionsData.allposts.slice(0, 5))) {
      setSuggestions(suggestionsData.allposts.slice(0, 5));
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    // Reset to page 1 when searching
    if (currentPage !== 1) {
      navigate('/1');
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    // Show suggestions if input has more than 2 characters
    if (e.target.value.length > 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
    // Clear search if input is empty
    if (e.target.value === "") {
      setSearchQuery("");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchInput(suggestion.title);
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    setSuggestions([]);
    if (currentPage !== 1) {
      navigate('/1');
    }
  };

  const handleClickOutside = () => {
    setShowSuggestions(false);
  };

  const handleTabChange = (tab) => {
    setSortBy(tab);
    // Reset to page 1 when changing tabs
    if (currentPage !== 1) {
      navigate('/1');
    }
  };

  const handlePageChange = (newPage) => {
    navigate(`/${newPage}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) return <Loader />;

  if (data?.allposts?.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses, description, or instructor"
              value={searchInput}
              onChange={handleSearchInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#005188]"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#005188]"
            >
              <FiSearch size={20} />
            </button>
          </div>
        </form>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 text-sm">
          <button
            onClick={() => handleTabChange("recent")}
            className={`pb-2 font-medium ${
              sortBy === "recent"
                ? "border-b-2 border-[#005188] text-[#005188]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleTabChange("recent")}
            className={`pb-2 font-medium ${
              sortBy === "recent"
                ? "border-b-2 border-[#005188] text-[#005188]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Most Recent
          </button>
        </div>

        <div className="bg-white text-[#005188] p-8 rounded-md shadow-md text-center">
          <div className="bg-gray-100 p-8 rounded-lg">
            <p className="font-semibold text-lg">No jobs available</p>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-2">
                Try adjusting your search terms
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6" onClick={handleClickOutside}>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6 relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search courses, description, or instructor"
            value={searchInput}
            onChange={handleSearchInputChange}
            onClick={(e) => {
              e.stopPropagation();
              if (searchInput.length > 2) setShowSuggestions(true);
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-24 focus:outline-none focus:ring-2 focus:ring-[#005188]"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#005188] text-white px-4 py-2 rounded-lg hover:bg-[#005188] transition-colors flex items-center gap-2"
          >
            <FiSearch size={18} />
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2">
              <div className="text-xs text-gray-500 px-3 py-2 font-semibold">
                Suggestions
              </div>
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion._id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <FiSearch className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.title}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#005188] font-medium">
                          ${suggestion.budget}/hr
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {suggestion.postedBy?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No suggestions found */}
        {showSuggestions && searchInput.length > 2 && suggestions.length === 0 && !suggestionsData && (
          <div 
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 text-center text-sm text-gray-500">
              No suggestions found
            </div>
          </div>
        )}
      </form>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 text-sm">
        <button
          onClick={() => handleTabChange("all")}
          className={`pb-2 font-medium transition-colors ${
            sortBy === "all"
              ? "border-b-2 border-[#005188] text-[#005188]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleTabChange("recent")}
          className={`pb-2 font-medium transition-colors ${
            sortBy === "recent"
              ? "border-b-2 border-[#005188] text-[#005188]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Most Recent
        </button>
      </div>

      {/* Results count */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600">
          {data?.pagination?.total || 0} results found for "{searchQuery}"
        </div>
      )}

      {/* Course cards */}
      <div className="space-y-4">
        {data?.allposts?.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {/* Pagination info */}
      {data?.pagination && (
        <div className="mt-8">
          <div className="text-center text-sm text-gray-600 mb-4">
            Page {data.pagination.currentPage} of {data.pagination.totalPages} • 
            Showing {data.allposts.length} of {data.pagination.total} jobs
          </div>
          
          {/* Pagination controls */}
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!data.pagination.hasPrev}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition-colors ${
                data.pagination.hasPrev
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <FiChevronLeft size={18} />
              Previous
            </button>

            {/* Page numbers */}
            <div className="flex gap-1">
              {(() => {
                const pages = [];
                const totalPages = data.pagination.totalPages;
                let startPage = Math.max(1, currentPage - 2);
                let endPage = Math.min(totalPages, currentPage + 2);

                // Adjust if we're near the start or end
                if (currentPage <= 3) {
                  endPage = Math.min(5, totalPages);
                }
                if (currentPage > totalPages - 3) {
                  startPage = Math.max(1, totalPages - 4);
                }

                // First page
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      1
                    </button>
                  );
                  if (startPage > 2) {
                    pages.push(
                      <span key="dots1" className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                }

                // Page numbers
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        i === currentPage
                          ? "bg-[#005188] text-white border-[#005188]"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                // Last page
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="dots2" className="px-2 text-gray-500">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!data.pagination.hasNext}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition-colors ${
                data.pagination.hasNext
                  ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Next
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;