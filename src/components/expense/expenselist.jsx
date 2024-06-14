import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { BASE_URL, getConfig } from "../../helpers/config";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import EditExpense from "./editexpense";
import CanvasJSReact from "@canvasjs/react-charts";
import { Calendar } from "react-date-range";
import { DateRangePicker } from "react-date-range";
function ExpenseList() {
  const { accessToken, setAccessToken, currentUser, setCurrentUser } =useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();
  const [charts, setCharts] = useState([]);
  const [categories, setCategories] = useState([]);
  //console.log(currentUser);
  const CanvasJS = CanvasJSReact.CanvasJS;
  const CanvasJSChart = CanvasJSReact.CanvasJSChart;
  useEffect(() => {
    if (!accessToken) navigate('/')
    //fecth expense lists
    const fetchExpensesLists = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/expenses`,
          getConfig(accessToken)
        );
        if (response.data.status == true) {
          toast.success(response.data.message);
          setExpenses(response.data.data.expenses.lists);
          setCharts(
            response.data.data.expenses.charts.map((chart) => {
              return { label: chart.category.category_name, y: chart.total };
            })
          );
        }
      } catch (error) {
        if (error.response == false) {
        }
      }
    };
    //get categories list
    const fetchCategoryList = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/categories`,
          getConfig(accessToken)
        );
        if (response.data.status == true) {
          setCategories(response.data.data.categories);
        }
      } catch (error) {
        if (error.response) {
        }
      }
    };
    if (accessToken) fetchExpensesLists(), fetchCategoryList();
  }, []);
  const deleteExpense = async (id) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/expenses/${id}`,
        getConfig(accessToken)
      );
      if (response.data.status == true) {
        //console.log(response.data.status);
        toast.success(response.data.message);
        const remainingResults = expenses.filter(
          (expense) => expense.id !== id
        );
        setExpenses(remainingResults);
      }
    } catch (error) {
      if (error.response == false) {
      }
    }
  };
  //filter by category
  const filterByCategory = async (event) => {
    const category_id = event.target.value;
    try {
      const response = await axios.get(
        `${BASE_URL}/filter-category/${category_id}`,
        getConfig(accessToken)
      );
      if (response.data.status == true) {
        //console.log(response.data.status);
        toast.success(response.data.message);
        setExpenses(response.data.data.expenses);
      }
    } catch (error) {
      if (error.response == false) {
      }
    }
  };

  //filter by date range
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { start_date, end_date } = e.target.elements;
    const data = {
      start_date: start_date.value,
      end_date: end_date.value,
    };
    try {
      const response = await axios.post(
        `${BASE_URL}/filter-daterange`,
        data,
        getConfig(accessToken)
      );
      if (response.data.status == true) {
        //console.log(response.data.status);
        toast.success(response.data.message);
        setExpenses(response.data.data.expenses);
      }
    } catch (error) {
      if (error.response == false) {
      }
    }
  };

  //pie chart 
  const options = {
    exportEnabled: true,
    animationEnabled: true,
    title: {
      text: "Expense Sources",
    },
    data: [
      {
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}%",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}%",
        dataPoints: charts,
      },
    ],
  };
  return (
    <div className="container">
      <div className="row my-5">
        <div className="col-md-10 mx-auto">
          <div className="card">
            <div className="card-header bg-white">
              <h3 className="text-center mt-2">
                Expense List of user &nbsp;
                {currentUser ? <span>{currentUser.name}</span> : <></>}
                &nbsp;&nbsp;
                <Link to="/add-expense" className="btn btn-primary">
                  Add new
                </Link>
              </h3>
              <div className="mb-3">
                <h5>Filter By</h5>

                <select
                  className="form-select"
                  id="category_id"
                  name="category_id"
                  onChange={filterByCategory}
                >
                  <option value="all">All</option>
                  {categories.map((category) => (
                    <option value={category.id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <form onSubmit={(e) => handleSubmit(e)}>
                <h5>Filter By Date Range</h5>

                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    From Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="start"
                    required
                    name="start_date"
                    max={new Date()}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    End Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="end_date"
                    name="end_date"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
            <div className="card-body">
              <div className="table-responsive ">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Category</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Description</th>
                    <th scope="col">Expense Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length
                    ? expenses.map((expense, index) => (
                        <tr>
                          <th scope="row">{index + 1}</th>
                          <td>{expense.category.category_name}</td>
                          <td>{expense.amount}</td>
                          <td>{expense.description}</td>
                          <td>{expense.expense_date}</td>
                          <td>
                            <Link to={`/edit-expense/${expense.id}`}>
                              <i className="bi bi-pencil-square"></i>
                            </Link>
                            &nbsp;&nbsp;
                            <button
                              className=""
                              onClick={() => {
                                deleteExpense(expense.id);
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    : <p>No Results Found</p>}
                </tbody>
              </table>
              </div>
              <CanvasJSChart options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseList;
