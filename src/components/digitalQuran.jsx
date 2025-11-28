import React, { useState, useEffect } from 'react';
import { 
  MdMenuBook, 
  MdSearch, 
  MdTextFields, 
  MdDarkMode, 
  MdLightMode, 
  MdBookmark, 
  
  MdShare 
} from 'react-icons/md';
const DigitalQuran = () => {
  const [verses, setVerses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState('1');
  const [showTranslation, setShowTranslation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState('text-2xl');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedVerses, setBookmarkedVerses] = useState(new Set());
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchChapters();
  }, []);

  useEffect(() => {
    if (selectedSurah) {
      fetchVerses(selectedSurah);
    }
  }, [selectedSurah]);

  const fetchChapters = async () => {
    try {
      const res = await fetch('https://api.alquran.cloud/v1/surah');
      const data = await res.json();
      setChapters(data.data);
    } catch (err) {
      console.error('Error fetching chapters:', err);
    }
  };

  const fetchVerses = async (surahNumber) => {
    setLoading(true);
    try {
      const [arabicRes, translationRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.asad`)
      ]);
      
      const arabicData = await arabicRes.json();
      const translationData = await translationRes.json();
      
      const combined = arabicData.data.ayahs.map((ayah, i) => ({
        number: ayah.numberInSurah,
        text: ayah.text,
        translation: translationData.data.ayahs[i]?.text || '',
        globalNumber: ayah.number
      }));
      
      setVerses(combined);
    } catch (err) {
      console.error('Error fetching verses:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = (verseNum) => {
    setBookmarkedVerses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(verseNum)) {
        newSet.delete(verseNum);
      } else {
        newSet.add(verseNum);
      }
      return newSet;
    });
  };

  const filteredVerses = verses.filter(v => 
    searchQuery === '' || 
    v.text.includes(searchQuery) || 
    v.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentSurah = chapters.find(c => c.number === parseInt(selectedSurah));

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-black';
  const secondaryTextClass = darkMode ? 'text-gray-400' : 'text-gray-600';
  const accentBgClass = darkMode ? 'bg-gray-800' : 'bg-zinc-50';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverClass = darkMode ? 'hover:bg-gray-700' : 'hover:bg-zinc-100';

  return (
    <div className={`flex-1 flex ${bgClass} ${textClass} transition-colors duration-200 `}>
      <div className={`h-[90vh] flex flex-col border-l ${borderClass} ${bgClass} w-full`}>
        {/* Header */}
        <div className={`${accentBgClass} border-b ${borderClass} p-4 space-y-3`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MdMenuBook className="w-6 h-6 text-[#005188]" />
              <h1 className="text-xl font-bold">Quran Reader</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${hoverClass} transition`}
                title="Toggle dark mode"
              >
                {darkMode ? <MdLightMode className="w-5 h-5" /> : <MdDarkMode className="w-5 h-5" />}
              </button>
           
            </div>
          </div>

          {/* Surah Selector */}
          <div className="flex gap-2">
            <select
              className={`flex-1 border ${borderClass} rounded-lg p-2.5 text-sm ${bgClass} ${textClass} focus:ring-2 focus:ring-[#005188] focus:outline-none`}
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(e.target.value)}
            >
              {chapters.map((surah) => (
                <option key={surah.number} value={surah.number}>
                  {surah.number}. {surah.englishName} ({surah.name})
                </option>
              ))}
            </select>

            <select
              className={`border ${borderClass} rounded-lg p-2.5 text-sm ${bgClass} ${textClass} focus:ring-2 focus:ring-[#005188] focus:outline-none`}
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              title="Font size"
            >
              <option value="text-xl">Small</option>
              <option value="text-2xl">Medium</option>
              <option value="text-3xl">Large</option>
              <option value="text-4xl">X-Large</option>
            </select>
          </div>

          {/* Search and Controls */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MdSearch className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${secondaryTextClass}`} />
              <input
                type="text"
                placeholder="Search verses..."
                className={`w-full pl-10 pr-3 py-2 border ${borderClass} rounded-lg text-sm ${bgClass} ${textClass} focus:ring-2 focus:ring-[#005188] focus:outline-none`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-4 py-2 border ${borderClass} rounded-lg text-sm ${hoverClass} transition flex items-center gap-2`}
            >
              <MdTextFields className="w-4 h-4" />
              {showTranslation ? "Arabic" : "Translation"}
            </button>
          </div>

          {/* Surah Info */}
          {currentSurah && (
            <div className={`text-sm ${secondaryTextClass} flex justify-between items-center pt-2 border-t ${borderClass}`}>
              <span>{currentSurah.englishNameTranslation}</span>
              <span>{currentSurah.numberOfAyahs} verses • {currentSurah.revelationType}</span>
            </div>
          )}
        </div>

        {/* Verses */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005188]"></div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Bismillah */}
              {selectedSurah !== '1' && selectedSurah !== '9' && (
                <div className="text-center mb-8">
                  <p className="text-3xl font-bold text-[#005188]" style={{ fontFamily: 'Amiri, serif' }}>
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                  </p>
                </div>
              )}

              {filteredVerses.map((v) => (
                <div
                  key={v.globalNumber}
                  className={`${accentBgClass} rounded-xl p-4 ${hoverClass} transition-all border ${borderClass}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#005188] text-white text-sm font-semibold`}>
                      {v.number}
                    </span>
                    <button
                      onClick={() => toggleBookmark(v.globalNumber)}
                      className={`p-1.5 rounded-lg ${hoverClass} transition`}
                      title="Bookmark verse"
                    >
                      <MdBookmark 
                        className={`w-5 h-5 ${bookmarkedVerses.has(v.globalNumber) ? 'fill-[#005188] text-[#005188]' : secondaryTextClass}`}
                      />
                    </button>
                  </div>

                  {/* Arabic Text */}
                  <p 
                    className={`${fontSize} font-bold leading-loose mb-4 text-right`}
                    style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}
                  >
                    {v.text}
                  </p>

                  {/* Translation */}
                  {showTranslation && (
                    <p className={`text-sm ${secondaryTextClass} leading-relaxed border-t ${borderClass} pt-3`}>
                      {v.translation}
                    </p>
                  )}
                </div>
              ))}

              {filteredVerses.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <p className={secondaryTextClass}>No verses found matching "{searchQuery}"</p>
                </div>
              )}
            </div>)}
          </div>
        
      </div>
    </div>
  );
};

export default DigitalQuran;