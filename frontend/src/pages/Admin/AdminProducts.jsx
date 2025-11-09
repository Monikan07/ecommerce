import React, { useEffect, useState } from 'react';
import API from '../../api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    price: 0,
    stock: 0,
    category: '',
    description: '',
    image: '',
  });
  const [editProduct, setEditProduct] = useState(null);

  const fetch = async () => {
    try {
      const res = await API.get('/admin/products');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load products');
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    const res = await API.post('/admin/products/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setForm({ ...form, image: res.data.image });
  };

  const create = async () => {
    try {
      const autoSlug = form.name.toLowerCase().trim().replace(/\s+/g, '-');
      await API.post('/admin/products', { ...form, slug: autoSlug });
      alert('Product created');
      setForm({ name: '', slug: '', price: 0, stock: 0, category: '', description: '', image: '' });
      fetch();
    } catch (err) {
      alert(err?.response?.data?.message || 'Error creating product');
    }
  };

  const update = async () => {
    try {
      await API.put(`/admin/products/${editProduct._id}`, editProduct);
      alert('Product updated');
      setEditProduct(null);
      fetch();
    } catch (err) {
      alert(err?.response?.data?.message || 'Error updating product');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete product?')) return;
    try {
      await API.delete(`/admin/products/${id}`);
      alert('Product deleted');
      fetch();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Error deleting product');
    }
  };

  return (
    <div className="admin-products">
      <h3>Manage Products</h3>

      {/* Add Product Form */}
      <div className="product-form">
        <div className="form-group">
          <label>Name</label>
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Image URL</label>
          <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {form.image && <img src={form.image} alt="preview" className="preview-img" />}
        </div>

        <div className="form-group">
          <label>Category</label>
          <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
        </div>

        <div className="form-group">
          <label>Stock</label>
          <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
        </div>

        <button className="btn-add" onClick={create}>Add Product</button>
      </div>

      {/* Edit Product Form */}
      {editProduct && (
        <div className="edit-form">
          <h4>Edit Product</h4>
          <div className="form-group">
            <label>Name</label>
            <input value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input value={editProduct.image || ''} onChange={e => setEditProduct({ ...editProduct, image: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Upload Image</label>
            <input
              type="file"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('image', file);
                const res = await API.post('/admin/products/upload', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
                });
                setEditProduct({ ...editProduct, image: res.data.image });
              }}
            />
            {editProduct.image && <img src={editProduct.image} alt="preview" className="preview-img" />}
          </div>
          <div className="form-group">
            <label>Category</label>
            <input value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" value={editProduct.stock} onChange={e => setEditProduct({ ...editProduct, stock: Number(e.target.value) })} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={editProduct.description} onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}></textarea>
          </div>
          <div className="edit-actions">
            <button className="btn-save" onClick={update}>Save Changes</button>
            <button className="btn-cancel" onClick={() => setEditProduct(null)}>Cancel</button>
          </div>
        </div>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name / Slug</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                <img
                  src={p.image ? `http://localhost:5000${p.image}` : "https://via.placeholder.com/60x60?text=No+Image"}
                  alt={p.name}
                  style={{ width: "60px", height: "60px", borderRadius: "6px", objectFit: "cover" }}
                />
              </td>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{p.name}</span>
                  <small style={{ color: '#64748b' }}>/{p.slug}</small>
                </div>
              </td>
              <td>{p.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button className="btn-edit" onClick={() => setEditProduct(p)}>Edit</button>
                <button className="btn-delete" onClick={() => remove(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .admin-products {
          background: #f8fafc;
          padding: 20px;
          border-radius: 12px;
        }

        .product-form, .edit-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
          background: white;
          padding: 16px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group input,
        .form-group textarea {
          margin-top: 4px;
          padding: 8px 10px;
          font-size: 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
        }

        .preview-img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .btn-add, .btn-save {
          background: #2563eb;
          color: white;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-cancel {
          background: #64748b;
          color: white;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-edit {
          background: #10b981;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          margin-right: 6px;
          cursor: pointer;
        }

        .btn-delete {
          background: #ef4444;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .product-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        th, td {
          padding: 12px 14px;
          border-bottom: 1px solid #e2e8f0;
          text-align: left;
        }

        th {
          background: #f1f5f9;
        }
      `}</style>
    </div>
  );
}
