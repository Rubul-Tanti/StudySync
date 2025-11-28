import { useQuery } from "@tanstack/react-query";
import React, { useState, useRef, useEffect } from "react";
import { FiStar, FiDollarSign, FiUsers, FiGlobe } from "react-icons/fi";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { RiFindReplaceLine } from "react-icons/ri";
import api from "../../utils/axios";
import Loader from "../loader";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const FindTeachers = () => {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [rating, setRating] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Applied filters (actual search values)
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedSubject, setAppliedSubject] = useState("");
  const [appliedRating, setAppliedRating] = useState("");
  const [appliedGender, setAppliedGender] = useState("");
  const [appliedLanguage, setAppliedLanguage] = useState("");

  // Suggestions state
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [languageSuggestions, setLanguageSuggestions] = useState([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);

  // Refs for click outside detection
  const nameInputRef = useRef(null);
  const languageInputRef = useRef(null);

  const RadioGroup = ({ label, options, value, setValue }) => (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`px-3 py-1 border rounded-full cursor-pointer text-sm whitespace-nowrap ${
              value === opt.value
                ? "bg-[#005188] text-white border-zinc-200"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            <input
              type="radio"
              name={label}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => setValue(opt.value)}
              className="hidden"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );

  // Fetch suggestions for names
  const fetchNameSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setNameSuggestions([]);
      return;
    }
    
    try {
      const res = await api.get(`/v1/teacherlist?name=${query}&limit=5`);
      const teachers = res.data.data || [];
      const uniqueNames = [...new Set(teachers.map(t => t.persnalDetails.name))];
      setNameSuggestions(uniqueNames);
    } catch (error) {
      console.error("Error fetching name suggestions:", error);
      setNameSuggestions([]);
    }
  };

  // Fetch suggestions for languages
  const fetchLanguageSuggestions = async (query) => {
    if (!query || query.length < 1) {
      setLanguageSuggestions([]);
      return;
    }
    
    try {
      // This fetches all teachers and extracts unique languages
      // For better performance, you might want a dedicated endpoint
      const res = await api.get(`/v1/teacherlist?limit=100`);
      const teachers = res.data.data || [];
      const allLanguages = teachers.flatMap(t => t.persnalDetails.languageSpoken || []);
      const uniqueLanguages = [...new Set(allLanguages)];
      const filtered = uniqueLanguages.filter(lang => 
        lang.toLowerCase().includes(query.toLowerCase())
      );
      setLanguageSuggestions(filtered.slice(0, 5));
    } catch (error) {
      console.error("Error fetching language suggestions:", error);
      setLanguageSuggestions([]);
    }
  };

  // Debounce function
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Debounced suggestion fetchers
  const debouncedNameSearch = useRef(
    debounce((query) => fetchNameSuggestions(query), 300)
  ).current;

  const debouncedLanguageSearch = useRef(
    debounce((query) => fetchLanguageSuggestions(query), 300)
  ).current;

  // Handle name input change
  const handleNameChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length >= 2) {
      debouncedNameSearch(value);
      setShowNameSuggestions(true);
    } else {
      setNameSuggestions([]);
      setShowNameSuggestions(false);
    }
  };

  // Handle language input change
  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setLanguage(value);
    if (value.length >= 1) {
      debouncedLanguageSearch(value);
      setShowLanguageSuggestions(true);
    } else {
      setLanguageSuggestions([]);
      setShowLanguageSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nameInputRef.current && !nameInputRef.current.contains(event.target)) {
        setShowNameSuggestions(false);
      }
      if (languageInputRef.current && !languageInputRef.current.contains(event.target)) {
        setShowLanguageSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch teachers with filters
  const teacherlist = async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: "10",
    });

    if (appliedSearch) params.append("name", appliedSearch);
    if (appliedSubject) params.append("subject", appliedSubject);
    if (appliedRating) params.append("ratting", appliedRating);
    if (appliedGender) params.append("gender", appliedGender);
    if (appliedLanguage) params.append("language", appliedLanguage);

    const res = await api.get(`/v1/teacherlist?${params.toString()}`);
    return res.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["teacherList", appliedSearch, appliedSubject, appliedRating, appliedGender, appliedLanguage, page],
    queryFn: teacherlist,
    keepPreviousData: true,
  });

  // Apply filters and search
  const handleSearch = () => {
    setAppliedSearch(search);
    setAppliedSubject(subject);
    setAppliedRating(rating);
    setAppliedGender(gender);
    setAppliedLanguage(language);
    setPage(1);
    setShowNameSuggestions(false);
    setShowLanguageSuggestions(false);
  };

  // Reset to page 1 when filters change
  const handleFilterChange = (setter) => (value) => {
    setter(value);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading teachers: {error.message}
      </div>
    );
  }

  const teachers = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="p-6 bg-white min-h-screen text-zinc-900 space-y-6">
      <h1 className="text-2xl font-semibold text-zinc-700 flex items-center gap-2">
        <RiFindReplaceLine size={24} className="text-blue-400" /> Find Teachers
      </h1>

      {/* Mobile Filter Toggle */}
      <div
        className="md:hidden flex justify-between items-center bg-white p-3 rounded-xl shadow cursor-pointer"
        onClick={() => setShowFilters(!showFilters)}
      >
        <div className="flex items-center gap-2 font-medium text-zinc-900">
          <FiFilter /> Filters
        </div>
        {showFilters ? <FiChevronUp /> : <FiChevronDown />}
      </div>

      {/* Filter Section */}
      <div
        className={`bg-white p-4 rounded-2xl shadow space-y-4 ${
          showFilters ? "block" : "hidden"
        } md:block`}
      >
        <div className="flex flex-col gap-5">
          {/* Search with Suggestions */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1" ref={nameInputRef}>
              <div className="flex items-center border h-10 border-gray-300 rounded-lg px-3 py-2 w-full">
                <FiSearch className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={search}
                  onChange={handleNameChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  onFocus={() => nameSuggestions.length > 0 && setShowNameSuggestions(true)}
                  className="outline-none flex-1 ml-2"
                />
              </div>
              
              {/* Name Suggestions Dropdown */}
              {showNameSuggestions && nameSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {nameSuggestions.map((name, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                      onClick={() => {
                        setSearch(name);
                        setShowNameSuggestions(false);
                      }}
                    >
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSearch}
              className="px-6 h-10 bg-[#005188] hover:bg-[#005188] text-white rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Subject Filter */}
            <RadioGroup
              label="Subject"
              options={[
                { label: "All", value: "" },
                { label: "Tajweed", value: "Tajweed Course" },
                { label: "Hifz", value: "Hifz Course" },
                { label: "Qira'at", value: "Qira'at Course" },
              ]}
              value={subject}
              setValue={handleFilterChange(setSubject)}
            />

            {/* Rating Filter */}
            <RadioGroup
              label="Rating"
              options={[
                { label: "All", value: "" },
                { label:<div className="flex  items-center gap-1"><FaStar/>5</div>, value: "5" },
                { label:<div className="flex  items-center gap-1"><FaStar/>4</div>, value: "4" },
                { label:<div className="flex  items-center gap-1"><FaStar/>3</div>, value: "3" },
              ]}
              value={rating}
              setValue={handleFilterChange(setRating)}
            />

            {/* Gender Filter */}
            <RadioGroup
              label="Gender"
              options={[
                { label: "Any", value: "" },
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
              ]}
              value={gender}
              setValue={handleFilterChange(setGender)}
            />

            {/* Language Filter with Suggestions */}
            <div className="flex flex-col gap-1 relative" ref={languageInputRef}>
              <span className="text-sm font-medium text-gray-700">Language</span>
              <input
                type="text"
                placeholder="e.g., Arabic, English, Urdu..."
                value={language}
                onChange={handleLanguageChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                onFocus={() => languageSuggestions.length > 0 && setShowLanguageSuggestions(true)}
                className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-sm"
              />
              
              {/* Language Suggestions Dropdown */}
              {showLanguageSuggestions && languageSuggestions.length > 0 && (
                <div className="absolute top-full left-0 z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {languageSuggestions.map((lang, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                      onClick={() => {
                        setLanguage(lang);
                        setShowLanguageSuggestions(false);
                      }}
                    >
                      {lang}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-[#005188] hover:bg-[#005188] text-white rounded-lg font-medium transition-colors"
            >
              Apply Filters
            </button>
            {(appliedSearch || appliedSubject || appliedRating || appliedGender || appliedLanguage) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSubject("");
                  setRating("");
                  setGender("");
                  setLanguage("");
                  setAppliedSearch("");
                  setAppliedSubject("");
                  setAppliedRating("");
                  setAppliedGender("");
                  setAppliedLanguage("");
                  setPage(1);
                  setNameSuggestions([]);
                  setLanguageSuggestions([]);
                }}
                className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {teachers.length} of {data?.total || 0} teachers
      </div>

      {/* Teacher Cards */}
      <div className="grid grid-cols-1 gap-4">
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <div
              key={teacher._id}
              className="bg-white p-5 rounded-xl border border-zinc-200 relative shadow hover:shadow-md transition flex flex-col sm:flex-row gap-4 items-start sm:items-start"
            >
              {/* Profile Picture */}
              <img
                src={teacher.persnalDetails.profilePic}
                alt={teacher.persnalDetails.name}
                className="w-24 h-24 rounded-full object-cover"
              />

              {/* Main Info */}
              <div className="flex-1 space-y-2">
                {/* Name + Verified */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-semibold text-zinc-700 truncate">
                    {teacher.persnalDetails.name}
                  </h2>
                  {teacher.verified && (
                    <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                      ✅ Verified
                    </span>
                  )}
                </div>

                {/* Rating + Country */}
                <div className="flex items-center -mt-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FiStar  />
                    <span>{teacher.rating || 0}</span>
                  </div>
                  <span className="text-gray-500">
                    {teacher.persnalDetails.country}
                  </span>
                </div>
                <p className="text-sm max-h-[100px] text-zinc-600 overflow-y-auto">
                  {teacher.profesnalDetails.bio}
                </p>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1">
                  {teacher.profesnalDetails.specializations
                    ?.slice(0, 3)
                    .map((spec, idx) => (
                      <span
                        key={idx}
                        className="bg-[#dbeafe] text-gray-700 px-2 py-0.5 rounded-full text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                  {teacher.profesnalDetails.specializations?.length > 3 && (
                    <span className="text-xs text-gray-500">+ more</span>
                  )}
                </div>

                {/* Compact Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-1">
                  <div className="flex items-center gap-1">
                    <FiDollarSign className="text-zinc-900" />
                    <span>${teacher.profesnalDetails.MonthlyRate}/hr</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiGlobe className="text-zinc-900" />
                    <span>
                      {teacher.persnalDetails.languageSpoken?.join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiUsers className="text-zinc-900" />
                    <span>{teacher.studentsTaught || 0} students</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No teachers found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages >= 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FindTeachers;