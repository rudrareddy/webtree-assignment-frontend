import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

 function Home(){
    const { accessToken, setAccessToken,setCurrentUser} = useContext(AuthContext)
    return (
        <div className='container'>
        <div className="row my-5">
            <div className="col-md-10 mx-auto">
                <div className="card">
                    <div className="card-body">
                        <h3 className="text-center mt-2">
                             Webtree Assignment {accessToken ?  <Link to="/expense-list">Go Expenses</Link>:null}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Home