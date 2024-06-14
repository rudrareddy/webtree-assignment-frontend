import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/home"
import Header from "./components/layouts/header"
import Register from "./components/auth/register"
import Login from "./components/auth/signin"
import { useEffect, useState } from "react"
import { AuthContext } from "./context/authContext"
import { getConfig, BASE_URL } from "./helpers/config"
import axios from "axios";
import ExpenseList from "./components/expense/expenselist"
import AddExpense from "./components/expense/addexpense"
import EditExpense from "./components/expense/editexpense"
function App() {
  const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem('currentToken')))
  const [currentUser, setCurrentUser]=useState(null)
  useEffect(()=>{
    const fetchCurrentlyLoggedInUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user`, getConfig(accessToken))
        setCurrentUser(response.data.user)
      } catch (error) {
          console.log(error)
          if (error.response.status === 401) {
              localStorage.removeItem('currentToken')
              setCurrentUser(null)
              setAccessToken('')
          }
          console.log(error)
      }
    }
    if (accessToken) fetchCurrentlyLoggedInUser()
  },[accessToken])
  return (
    <AuthContext.Provider value={{accessToken,setAccessToken,currentUser,setCurrentUser}}>
       <BrowserRouter>
    <Header/>
      <Routes>
         <Route path="/" element={ <Home /> }/>
         <Route path="/register" element={ <Register/>} />  
         <Route path='/login' element={<Login/>}/> 
         <Route path='/expense-list' element={<ExpenseList/>}/>
         <Route path='/add-expense' element={<AddExpense/>}/>
         <Route path='/edit-expense/:id' element={<EditExpense/>}/>
      </Routes>
    </BrowserRouter>
    </AuthContext.Provider>
    
  )
}

export default App
