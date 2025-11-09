import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data.products || []))
      .catch(console.error);
  }, []);

  const featuredProducts = products.slice(0, 3);

  return (
    <div style={styles.home}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Welcome to <span style={styles.brand}>MyShop</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Discover amazing products and exclusive deals — curated just for you.
          </p>
          <button style={styles.heroBtn} onClick={() => navigate("/products")}>
            Shop Now →
          </button>
        </div>
      </section>

      <section id="products" style={styles.productsSection}>
        <h2 style={styles.sectionTitle}>Featured Products</h2>
        <p style={styles.sectionSubtitle}>Our bestsellers and trending picks</p>
        <div style={styles.grid}>
          {featuredProducts.length > 0 ? (
            featuredProducts.map((p) => (
              <div key={p._id} style={styles.cardWrapper}>
                <ProductCard p={p} />
              </div>
            ))
          ) : (
            <p style={styles.noProducts}>No products available</p>
          )}
        </div>

        {products.length > 3 && (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <button
              style={styles.viewAllBtn}
              onClick={() => navigate("/products")}
            >
              View All Products →
            </button>
          </div>
        )}
      </section>

      <section style={styles.whySection}>
        <h2 style={styles.sectionTitleWhite}>Why Choose Us?</h2>
        <div style={styles.infoGrid}>
          <div style={styles.infoBox}>
            <h3 style={styles.infoHeading}>Quality Products</h3>
            <p>We ensure every product meets the highest standards.</p>
          </div>
          <div style={styles.infoBox}>
            <h3 style={styles.infoHeading}>Fast Delivery</h3>
            <p>Get your products quickly with reliable shipping.</p>
          </div>
          <div style={styles.infoBox}>
            <h3 style={styles.infoHeading}>Easy Returns</h3>
            <p>Shop confidently with hassle-free return policies.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <h4 style={styles.footerBrand}>MyShop</h4>
            <p>Your one-stop shop for style and comfort.</p>
          </div>
          <div>
            <h5 style={styles.footerHeading}>Quick Links</h5>
            <ul style={styles.footerList}>
              <li><Link to="/" style={styles.footerLink}>Home</Link></li>
              <li><Link to="/products" style={styles.footerLink}>Our Products</Link></li>
              <li><Link to="/login" style={styles.footerLink}>Login</Link></li>
              <li><Link to="/register" style={styles.footerLink}>Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h5 style={styles.footerHeading}>Contact</h5>
            <p>Email: support@myshop.com</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>
        <div style={styles.footerBar}>
          © {new Date().getFullYear()} MyShop. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

const styles = {
  home: {
    width: "100%",
    margin: 0,
    padding: 0,
    overflowX: "hidden",
  },
  hero: {
    width: "100%",
    height: "90vh",
    backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://img.freepik.com/premium-photo/flat-lay-womens-accessories-variety-shades-beige-brown-white_36682-168680.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    textAlign: "center",
    padding: "0 2rem",
  },
  heroContent: { maxWidth: "800px" },
  heroTitle: { fontSize: "3.5rem", fontWeight: "800", marginBottom: "1rem" },
  brand: { color: "#93c5fd" },
  heroSubtitle: { fontSize: "1.4rem", fontWeight: "300", marginBottom: "2rem" },
  heroBtn: {
    background: "#1e3a8a",
    color: "white",
    border: "none",
    padding: "1rem 2.5rem",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  productsSection: {
    width: "100%",
    padding: "4rem 2rem",
    textAlign: "center",
    backgroundColor: "#f8fafc",
  },
  sectionTitle: { fontSize: "2.5rem", color: "#1e3a8a", fontWeight: "700" },
  sectionSubtitle: { color: "#64748b", marginBottom: "2rem" },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    justifyContent: "center",
  },
  cardWrapper: {
    boxShadow: "0 4px 10px rgba(0,0,0,0.48)", 
    borderRadius: "10px",
    transition: "box-shadow 0.3s, transform 0.3s",
    backgroundColor: "white",
  },
  noProducts: { fontSize: "1.1rem", color: "#64748b" },
  viewAllBtn: {
    background: "#1e3a8a",
    color: "white",
    border: "none",
    padding: "0.8rem 2rem",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  whySection: {
    backgroundColor: "#1e3a8a",
    color: "white",
    padding: "6rem 2rem",
    textAlign: "center",
    width: "100%",
  },
  sectionTitleWhite: {
    fontSize: "2.8rem",
    fontWeight: "800",
    marginBottom: "3rem",
  },
  infoGrid: {
   maxWidth: "1200px",
   margin: "0 auto",
   display: "grid",
   gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
   gap: "3rem",
  },
  infoBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: "3rem",
    borderRadius: "12px",
    color: "white",
    border: "1px solid rgba(96, 250, 250, 1)", 
    boxShadow: "inset 0 0 8px rgba(147, 196, 253, 0.75)",
  },
  infoHeading: { fontSize: "1.5rem", color: "#bfdbfe", marginBottom: "1rem" },
  footer: { background: "#0f172a", color: "#e5e7eb", width: "100vw" },
  footerContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    padding: "4rem 2rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  footerBrand: { fontSize: "1.6rem", color: "white" },
  footerHeading: { fontSize: "1.1rem", color: "#93c5fd" },
  footerList: { listStyle: "none", padding: 0 },
  footerLink: {
    color: "#e5e7eb",
    textDecoration: "none",
    margin: "0.3rem 0",
    display: "block",
  },
  footerBar: {
    textAlign: "center",
    padding: "1rem",
    fontSize: "0.9rem",
    backgroundColor: "#020617",
  },
};
