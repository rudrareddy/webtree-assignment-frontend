import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App.jsx"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import  'react-toastify/dist/ReactToastify.css'
import 'bootstrap-table/dist/bootstrap-table.css'
import 'bootstrap-table/dist/bootstrap-table.js'
import { ToastContainer } from 'react-toastify'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer position='top-right'/>
    <App />
  </React.StrictMode>,
)
