import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, ExternalLink } from 'lucide-react';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = () => {
    fetch('http://localhost:5000/api/wishlist')
      .then(res => res.json())
      .then(data => {
        setWishlist(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const removeFromWishlist = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/wishlist/${id}`, { method: 'DELETE' });
      setWishlist(wishlist.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="loading-state">
           <div className="spinner"></div>
           <p>Loading your saved items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h2>Your Wishlist</h2>
        <p>You have {wishlist.length} saved items</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <ShoppingBag size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
          <h3>Your wishlist is empty</h3>
          <p>Search for products and add them to your wishlist to see them here.</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(item => (
             <div key={item.id} className="wishlist-card glass-panel">
               <div className="wishlist-img">
                 <img src={item.image} alt={item.title} loading="lazy" />
               </div>
               <div className="wishlist-details">
                 <span className={`platform-badge platform-${item.platform.toLowerCase()}`}>
                   {item.platform}
                 </span>
                 <h3 className="card-title">{item.title}</h3>
                 <div className="card-price">₹{item.price}</div>
                 
                 <div className="card-actions">
                   <a href={item.url} target="_blank" rel="noopener noreferrer" className="buy-btn">
                     Buy Now <ExternalLink size={16} />
                   </a>
                   <button className="icon-btn remove-btn" onClick={() => removeFromWishlist(item.id)} title="Remove from wishlist">
                     <Trash2 size={20} />
                   </button>
                 </div>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}
