import React from 'react'

const SearchBar = () => {
    return (
        <div className="search-box">
            <input
                type="text"
                placeholder="Search Astrologer, Type, Language..."
            />
            <button>Search</button>
        </div>
    )
}

export default SearchBar