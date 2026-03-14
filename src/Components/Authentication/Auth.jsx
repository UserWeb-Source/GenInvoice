import React from 'react';
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import {useNavigate} from "react-router-dom";

export default function Auth() {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
    const [user, setUser] = React.useState({
        username: '',
        email: '',
        password: '',
    })
    const {username, email, password} = user;
    const [loading, setLoading] = React.useState(false);
    const onchange = (e) => {
        setUser({
            ...user,[e.target.name]: e.target.value,
        })
    }

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const res = await axios.post(`${API_URL}/admin/signup`,{
                username,
                email,
                password,
            },{
                withCredentials: true
            });
            if(res.status === 200){
                console.log("Succes");
                setTimeout(() => {
                    navigate('/verify');
                },1500);
            }
        }catch(err){
            console.log(err.response);
            setTimeout(()=> {
                setLoading(false);
            },3000);
        }
    }
    return (
            // Client Auth Section
            <div className="auth-section flex justify-center  items-center h-230">
                <div className="authentication-container border p-5 w-full rounded-2xl border-gray-300 max-w-[450px]">
                    <div className="auth-logo">
                        <p className="text-xl font-semibold uppercase my-3 text-center"> Client </p>
                    </div>
                    <p className="text-center mt-2 text-md text-gray-500"> Please! Sign In Here </p>
                    <div className="auth-form-container">
                        <form onSubmit={handleAuth} className="form">
                            <div className="form-group flex flex-col ">
                                <label htmlFor="uname" className="text-gray-500 mt-3 text-[14.5px] font-semibold"> Username </label>
                                <input type="text" className="form-control" value={username} id="uname" name="username" placeholder="Enter username" onChange={onchange} />
                                {/*<p className="text-red-600"> Username Invalid </p>*/}
                            </div>
                            <div className="form-group flex flex-col">
                                <label htmlFor="email" className="text-gray-500 mt-3 text-[14.5px] font-semibold"> Email </label>
                                <input type="email" className="form-control" value={email} id="email" name="email" placeholder="Enter Email" onChange={onchange} />
                                {/*<p className="text-red-600"> Email Invalid </p>*/}
                            </div>
                            <div className="form-group flex flex-col">
                                <label htmlFor="psw" className="text-gray-500 mt-3 text-[14.5px] font-semibold"> Password </label>
                                <input type="password" className="form-control" value={password} id="psw" name="password" placeholder="Enter Password" onChange={onchange}/>
                                {/*<p className="text-red-600"> Password Invalid </p>*/}
                            </div>
                            <p className="text-red-600 my-3 font-semibold"> All Fields Are Required! </p>
                            <div className="auth-btn gap-2 flex">
                                <button type="submit" className="bg-cyan-800 cursor-pointer w-full flex justify-center items-center mx-auto text-white p-[0.5px] font-semibold rounded-lg" >
                                    {
                                        loading===true?(
                                                <CircularProgress className="text-white mx-auto text-2xl p-[10px]" color="white" />
                                        ):(
                                                <p className="text-center"> Log In </p>
                                        )
                                    }
                                </button>

                                <button type="reset" className="bg-gray-400 w-full cursor-pointer text-white p-2 font-semibold rounded-lg" onClick={() => {
                                    setUser({
                                        username: "",
                                        email: "",
                                        password: "",
                                    })
                                }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    )
}
