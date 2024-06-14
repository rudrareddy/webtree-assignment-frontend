import axios from "axios";
import React, {useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { BASE_URL } from "../../helpers/config";
import Spinner from "../layouts/spinner";
import { AuthContext } from "../../context/authContext";

function Login(){
    
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [errors, setErrors] = useState(null)
    const navigate = useNavigate()
    const [loading,setLoading] = useState(false)
    const { accessToken, setAccessToken,setCurrentUser} = useContext(AuthContext)

    useEffect(() => {
        if (accessToken) navigate('/')
    }, [accessToken])
    const handleSubmit = async (e) =>{
        e.preventDefault()
        setErrors(null)
        setLoading(true)
        const  {email,password} = e.target.elements;
        const data ={
            email: email.value,
            password: password.value,
        }
        try {
            const response = await axios.post(`${BASE_URL}/login`,data)
            
            if(response.data.status == true){
                //console.log(response.data.data);
                setLoading(false)
                localStorage.setItem('currentToken', JSON.stringify(response.data.data.token))
                setAccessToken(response.data.data.token)
                setCurrentUser(response.data.data.user)
                setLoading(false)
                toast.success(response.data.message)
                navigate('/')  
            }
                 
        } catch (error) {
            setLoading(false)
            if(error){
                if(error.response.data.status == false){
                    toast.error(error.response.data.message)
                    //setErrors(error.response.data.data);
                    
                    if(error.response.data.data.email){
                        setEmailError(error.response.data.data.email[0]);
                    }else{
                        setEmailError('')
                    }
                    if(error.response.data.data.password){
                        setPasswordError(error.response.data.data.password[0]);
                    }else{
                        setPasswordError('')
                    }
                }
            }         
            
        }
    }
    return (
        <div className="container">
        <div className="row my-5">
            <div className="col-md-6 mx-auto">
                <div className="card">
                    <div className="card-header bg-white">
                        <h3 className="text-center mt-2">
                            Login
                        </h3>
                    </div>
                    <div className="card-body">
                    <form onSubmit={(e) => handleSubmit(e)}>
                    
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address <span className="text-danger">*</span></label>
                            <input type="email" className="form-control" id="email"  name="email"/>
                            {emailError  && ( <span className="text-danger">{emailError}</span>)} 
                            {/*--<div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> */}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password <span className="text-danger">*</span></label>
                            <input type="password" className="form-control" id="password" name="password"/>
                            {passwordError  && ( <span className="text-danger">{passwordError}</span>)} 
                        </div>
                        { 
                                    loading ? 
                                        <Spinner/>
                                    :
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Login