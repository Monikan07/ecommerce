import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const data = res.data.products || [];
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let temp = [...products];

    if (category) {
      temp = temp.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (searchTerm) {
      temp = temp.filter(
        (p) => p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(temp);
  }, [category, searchTerm, products]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="products-page">
      <header className="products-header">
        <h1>All Products</h1>
        <p>Browse our entire collection of high-quality products</p>
      </header>

      {/* Filters */}
      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          <option value="accessories">Accessories</option>
        </select>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p._id} className="product-card-wrapper">
              <ProductCard p={p} />
            </div>
          ))
        ) : (
          <p className="no-products">No products found</p>
        )}
      </div>

      <style>{`
        .products-page {
          width: 100%;
          margin: 0;
          padding: 0;
          background: #f8fafc;
          min-height: 100vh;
        }

        .products-header {
          text-align: center;
          padding: 3rem 1rem;
          position: relative;
          background: linear-gradient(135deg, #2563eb, #22d3ee, #a5f3fc);
          color: white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .products-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.2);
          z-index: 0;
        }

        .products-header h1,
        .products-header p {
          position: relative; 
          z-index: 1;
        }

        .products-header h1 {
          font-size: 3rem;
          font-weight: 800;
        }

        .products-header p {
          font-size: 1.5rem;
          color: #e0e7ff;
        }

        .filters {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          padding: 2rem 5vw;
        }

        .filters select,
        .filters input {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
        }

        .filters button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .filters button:hover {
          background-color: #2563eb;
        }

        /* Horizontal Flex Grid */
        .products-grid {
          display: flex;
          flex-wrap: wrap; /* wraps if screen is small */
          justify-content: center;
          gap: 20px;
          padding: 3rem 5vw;
          max-width: 1200px;
          margin: 0 auto;
        }

        .product-card-wrapper {
          display: inline-block;
          box-shadow: 0 4px 10px rgba(0,0,0,0.48);
          border-radius: 10px;
          transition: box-shadow 0.3s, transform 0.2s;
          background-color: white;
          min-width: 250px;
          flex: 0 0 auto;
        }

        .product-card-wrapper:hover {
          box-shadow: 0 6px 20px rgba(0,0,0,0.65);
          transform: translateY(-2px);
        }

        .no-products {
          text-align: center;
          margin-top: 3rem;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .products-header h1 {
            font-size: 2rem;
          }
          .products-grid {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
