import React from "react";
import { Link } from "react-router-dom";

 function Home(){
    return (
        <div className='container'>
        <div className="row my-5">
            <div className="col-md-10 mx-auto">
                <div className="card">
                    <div className="card-body">
                        <h3 className="text-center mt-2">
                            Welcome <Link to="/expense-list">Go Expenses</Link>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Home