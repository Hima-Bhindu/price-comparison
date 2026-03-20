const platforms = ['Amazon', 'Flipkart', 'Myntra', 'Meesho'];

const platformColors = {
  Amazon: '#FF9900',
  Flipkart: '#2874F0',
  Myntra: '#FF3E6C',
  Meesho: '#F43397'
};

const randomRating = () => (Math.random() * (5 - 3) + 3).toFixed(1);

const searchProducts = async (query) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));

  const results = [];
  const queryLower = query.toLowerCase();

  // Generate base prices for the query
  let basePrice = 1000;
  if (queryLower.includes('shirt')) basePrice = 600;
  else if (queryLower.includes('jean')) basePrice = 1200;
  else if (queryLower.includes('jacket')) basePrice = 2500;
  else if (queryLower.includes('dress')) basePrice = 1500;
  else if (queryLower.includes('shoe')) basePrice = 2000;

  const brands = {
    Amazon: ['Amazon Essentials', 'Puma', 'Levis', 'Allen Solly'],
    Flipkart: ['Tokyo Talkies', 'WROGN', 'Highlander', 'Nike'],
    Myntra: ['H&M', 'Roadster', 'Mast & Harbour', 'Mango'],
    Meesho: ['Generic', 'Trendy', 'FashionHub', 'StyleCast']
  };

  // Generate 3-5 products per platform
  platforms.forEach((platform) => {
    const numProducts = Math.floor(Math.random() * 3) + 3;
    const platformBrands = brands[platform];

    for (let i = 0; i < numProducts; i++) {
      // Vary price by +/- 25%
      const priceVariation = 1 + (Math.random() * 0.5 - 0.25);
      const price = Math.round(basePrice * priceVariation);
      
      const imageId = Math.floor(Math.random() * 1000) + 1;
      const brand = platformBrands[Math.floor(Math.random() * platformBrands.length)];

      let searchUrl = '';
      const encodedQuery = encodeURIComponent(query);
      if (platform === 'Amazon') searchUrl = `https://www.amazon.in/s?k=${encodedQuery}`;
      else if (platform === 'Flipkart') searchUrl = `https://www.flipkart.com/search?q=${encodedQuery}`;
      else if (platform === 'Myntra') searchUrl = `https://www.myntra.com/${query.replace(/\\s+/g, '-')}`;
      else if (platform === 'Meesho') searchUrl = `https://www.meesho.com/search?q=${encodedQuery}`;

      results.push({
        id: `${platform.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${brand} ${query.charAt(0).toUpperCase() + query.slice(1)} - Edition ${i + 1}`,
        price: price,
        image: `https://picsum.photos/400/500?random=${imageId}`,
        platform: platform,
        rating: parseFloat(randomRating()),
        url: searchUrl,
        brand: brand,
        color: ['Black', 'Blue', 'White', 'Red', 'Olive'][Math.floor(Math.random() * 5)]
      });
    }
  });

  // Shuffle the aggregated results
  return results.sort(() => Math.random() - 0.5);
};

module.exports = {
  searchProducts
};
