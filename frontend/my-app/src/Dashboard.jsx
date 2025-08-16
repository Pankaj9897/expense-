import { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'
export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // Fetch all expenses
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  // Add expense
  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/expenses",
        { title, amount, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setAmount("");
      setCategory("");
      fetchExpenses();
    } catch (err) {
      console.error("Add Error:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);
  const totalAmount = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="container py-4 bg1">
      <h1 className="text-center mb-4">
  <i className="bi bi-currency-dollar"></i> Expense Dashboard
</h1>

      {/* Add Expense Form */}
      <form
        onSubmit={addExpense}
        className="card p-3 shadow-sm mb-4"
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <div className="mb-3">
          <label className="form-label">Expense Title</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
  <label className="form-label">Category</label>
  <select
    className="form-select"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    required
  >
    <option value="">Select category</option>
    <option value="Food">Food</option>
    <option value="Transport">Transport</option>
    <option value="Shopping">Shopping</option>
    <option value="Bills">Bills</option>
    <option value="Entertainment">Entertainment</option>
    <option value="Other">Other</option>
  </select>
</div>

        <button type="submit" className="btn btn-primary w-100">
          Add Expense
        </button>
      </form>

      {/* Expenses List */}

      <div className="card shadow-sm">
        <div className="card-header">Your Expenses</div>
        <ul className="list-group list-group-flush">
          {expenses.length > 0 ? (
            expenses.map((e, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{e.title}</strong> <br />
                  <small className="text-muted">{e.category}</small>
                </div>
                <span className="badge bg-success fs-6">₹{e.amount}</span>
              </li>
            ))
          ) : (
            <li className="list-group-item text-center text-muted">
              No expenses yet
            </li>
          )}
        </ul>
      </div>
      <div className="p-3 text-end">
    <strong>Total: ₹{totalAmount}</strong>
  </div>
    </div>
  );
}
