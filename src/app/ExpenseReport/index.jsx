import React, { useEffect, useState } from "react";
import "./index.css";
import { getAuthToken } from "../../helpers/token";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const ExpenseReport = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = getAuthToken();

  if (!token) {
    window.location.href = import.meta.env.VITE_MAIN_URL;
  }

  const fetchExpenses = async () => {
    setLoading(true);
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/v1/expenses`,
      {
        headers: {
          "X-Auth-Token": token,
        },
      }
    );
    if (response.status === 200) {
      setExpenses(response.data?.expenses?.reverse() || []);
    }
    try {
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/v1/expenses`,
      {
        name,
        type,
        amount,
      },
      {
        headers: {
          "X-Auth-Token": token,
        },
      }
    );
    console.log(response);
    if (response.status === 201) {
      fetchExpenses();
    }
    try {
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setName("");
      setType("");
      setAmount("");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="container">
      <h2 className="mb-4">Expense Report</h2>
      <form id="expense-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Expense Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <small className="form-text text-muted">
            Enter the name of the expense
          </small>
        </div>
        <div className="form-group">
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="form-control"
            placeholder="Expense Type"
            required
          />
          <small className="form-text text-muted">
            Enter the type (e.g., Food, Travel)
          </small>
        </div>
        <div className="form-group">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="form-control"
            placeholder="Expense Amount"
            required
            min={0}
          />
          <small className="form-text text-muted">Enter a valid amount</small>
        </div>
        {loading ? (
          <CircularProgress />
        ) : (
          <button type="submit" className="btn btn-primary">
            Add Expense
          </button>
        )}
      </form>
      <div className="table-container">
        <table className="table table-dark table-striped mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody id="expense-list">
            {expenses?.map((expense, index) => (
              <tr key={index}>
                <td>{expense.name}</td>
                <td>{expense.type}</td>
                <td>{expense.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total-expense-row text-right p-2">
        <span>Total Expense: </span>
        <span id="total-expense" className="total-expense">
          ₹
          {expenses
            .reduce((acc, expense) => acc + parseFloat(expense.amount), 0)
            ?.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default ExpenseReport;
