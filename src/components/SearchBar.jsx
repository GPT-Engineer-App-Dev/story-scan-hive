import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder="Search stories..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-64 pl-10 pr-4 py-2 rounded-full border-2 border-orange-300 focus:outline-none focus:border-orange-400 transition duration-300"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" />
    </form>
  );
};

export default SearchBar;