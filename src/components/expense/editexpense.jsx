import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { BASE_URL, getConfig } from "../../helpers/config";
import { toast } from "react-toastify";
import axios from "axios";
import Spinner from "../layouts/spinner";

function EditExpense() {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const { accessToken, setAccessToken } = useContext(AuthContext);
  const [expense, setExpense] = useState({});
  const [loading, setLoading] = useState(false);
  const [categoryerror, setCategoryError] = useState("");
  const [amounterror, setAmountError] = useState();
  const [descriptionerror, setDescriptionError] = useState("");
  const [dateerror, setDateError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenseDetail = async () => {
      //console.log(id)
      try {
        const response = await axios.get(
          `${BASE_URL}/expenses/${id}`,
          getConfig(accessToken)
        );
        if (response.data.status == true) {
          //console.log(response.data.data);
          toast.success(response.data.message);
          setExpense(response.data.data.expense);
        }
      } catch (error) {
        if (error.response) {
        }
      }
    };
    const fetchCategoryList = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/categories`,
          getConfig(accessToken)
        );
        if (response.data.status == true) {
          //console.log(response.data.data.categories);
          //toast.success(response.data.message);
          setCategories(response.data.data.categories);
        }
      } catch (error) {
        if (error.response) {
        }
      }
    };
    if (accessToken) fetchExpenseDetail(), fetchCategoryList();
  }, []);

  const handleAmountChange = (e) => {
    setExpense({ ...expense, amount: e.target.value });
  };
  const handleDescriptionChange = (e) => {
    setExpense({ ...expense, description: e.target.value });
  };
  const handleExpenseDateChange = (e) => {
    setExpense({ ...expense, expense_date: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { category_id, amount, description, expense_date } =
      e.target.elements;
    const data = {
      category_id: category_id.value,
      amount: amount.value,
      description: description.value,
      expense_date: expense_date.value,
    };
    try {
      const response = await axios.put(
        `${BASE_URL}/expenses/${id}`,
        data,
        getConfig(accessToken)
      );
      if (response.data.status == true) {
        setLoading(false);
        toast.success(response.data.message);
        navigate("/expense-list");
      }
    } catch (error) {
      setLoading(false);
      if (error.response.data.status === false) {
        toast.error(error.response.data.message);
        if (error.response.data.data.categories_id) {
          setCategoryError(error.response.data.data.categories_id[0]);
        } else {
          setCategoryError("");
        }
        if (error.response.data.data.amount) {
          setAmountError(error.response.data.data.amount[0]);
        } else {
          setAmountError("");
        }
        if (error.response.data.data.description) {
          setDescriptionError(error.response.data.data.description[0]);
        } else {
          setDateError("");
        }
        if (error.response.data.data.expense_date) {
          setDateError(error.response.data.data.expense_date[0]);
        } else {
          setDateError("");
        }
      }
    }
  };
  return (
    <div className="container">
      <div className="row my-5">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-header bg-white">
              <h3 className="text-center mt-2">Edit Expenses</h3>
            </div>
            <div className="card-body">
              <form onSubmit={(e) => handleSubmit(e)}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="category_id"
                    name="category_id"
                  >
                    {categories.map((category) => (
                      <option
                        value={category.id}
                        key={category.id}
                        selected={category.id == expense.category_id}
                      >
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                  {categoryerror && (
                    <span className="text-danger">{categoryerror}</span>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Amount <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    name="amount"
                    value={expense.amount}
                    onChange={handleAmountChange}
                  />
                  {amounterror && (
                    <span className="text-danger">{amounterror}</span>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    id="description"
                    value={expense.description}
                    onChange={handleDescriptionChange}
                  ></textarea>
                  {descriptionerror && (
                    <span className="text-danger">{descriptionerror}</span>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Expense Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="expense_date"
                    name="expense_date"
                    value={expense.expense_date}
                    onChange={handleExpenseDateChange}
                  />
                  {dateerror && (
                    <span className="text-danger">{dateerror}</span>
                  )}
                </div>
                {loading ? (
                  <Spinner />
                ) : (
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                )}
                &nbsp;&nbsp;
                <Link to="/expense-list" className="btn btn-danger">
                  Cancel
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditExpense;
