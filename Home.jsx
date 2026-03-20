import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Sparkles } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const trendingSearches = ['Denim Jacket', 'Summer Dress', 'White Sneakers', 'Polo Shirt'];

  return (
    <div className="home-container">
      <div className="hero-section glass-panel">
        <div className="hero-badge">
          <Sparkles size={16} /> Latest Fashion Deals
        </div>
        <h1 className="hero-title">Find the Best Clothing Deals Across Platforms</h1>
        <p className="hero-subtitle">Compare prices from Amazon, Flipkart, Myntra, and Meesho in one place.</p>
        
        <form onSubmit={handleSearch} className="search-bar">
          <Search className="search-icon" size={24} />
          <input 
            type="text" 
            placeholder="Search for shirts, dresses, jeans..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">Search Now</button>
        </form>

        <div className="trending">
          <h3><TrendingUp size={18} /> Trending Now</h3>
          <div className="trending-tags">
            {trendingSearches.map((tag) => (
              <button key={tag} className="tag" onClick={() => setQuery(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
