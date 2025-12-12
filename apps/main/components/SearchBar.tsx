import React from 'react'

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
    return (
        <div className="search-box" >
            <input
                type="text"
                placeholder="Search Astrologer, Type, Language..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <button className="search-icon-btn" style={{backgroundColor: "#732882" }}>
                <i className="fa-solid fa-magnifying-glass" style={{color: "#fff" }} ></i>
            </button>
        </div>
    )
}

export default SearchBar