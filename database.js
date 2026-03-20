const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'temp_wishlist.db');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id TEXT PRIMARY KEY,
      title TEXT,
      price REAL,
      image TEXT,
      platform TEXT,
      rating REAL,
      url TEXT
    )
  `);
};

const getWishlist = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM wishlist', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const addToWishlist = (product) => {
  return new Promise((resolve, reject) => {
    const { id, title, price, image, platform, rating, url } = product;
    db.run(
      `INSERT OR IGNORE INTO wishlist (id, title, price, image, platform, rating, url) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, title, price, image, platform, rating, url],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
};

const removeFromWishlist = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM wishlist WHERE id = ?', [id], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
};

module.exports = {
  initDb,
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
