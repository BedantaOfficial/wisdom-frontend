import React, { useState } from "react";
import "./index.css";

const ExpenseReport = () => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setExpenses([
      ...expenses,
      {
        name,
        type,
        amount,
      },
    ]);
    setName("");
    setType("");
    setAmount("");
  };

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
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
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
                <td>{expense.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total-expense-row text-right p-2">
        <span>Total Expense: </span>
        <span id="total-expense" className="total-expense">
          ₹0.00
        </span>
      </div>
    </div>
  );
};

export default ExpenseReport;
