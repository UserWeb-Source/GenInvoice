import React, {useEffect} from 'react';
import { InputOtp } from 'primereact/inputotp';
import {useNavigate} from "react-router-dom";
import bcrypt from 'bcryptjs';
import CircularProgress from "@mui/material/CircularProgress";


export default function Verify() {
    const [otp, setOTP] = React.useState();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(otp===import.meta.env.VITE_VERIFY_OTP){
            let Hash_OTP = await bcrypt.hash(otp, 10);
            sessionStorage.setItem("verify_token",Hash_OTP);
            navigate('/dashboard');
            return;
        }
        alert("Verification Failed");
        setTimeout(() => {
            navigate("/");
        },500);
    }
    return (
            // Client Auth Section
            <div className="auth-section flex justify-center  items-center h-230">
                <div className="authentication-container border p-5 w-full rounded-2xl border-gray-300 max-w-[450px]">
                    <div className="auth-logo">
                        <p className="text-xl font-semibold uppercase my-3 text-center"> OTP Verification </p>
                    </div>
                    <p className="text-center mt-2 text-sm text-gray-500"> Enter the OTP we send to <br/> your account Client@gmail.com </p>
                    <div className="auth-form-container">
                        <form className="form mx-8" onSubmit={handleSubmit}>
                            <p className="text-xl font-semibold text-cyan-900  mt-5"> Enter OTP </p>
                            <div className="card flex justify-center">
                                <InputOtp value={otp} length={5} onChange={(e) => setOTP(e.value)}/>
                            </div>
                            <p className="text-red-600 my-3 font-semibold"> OTP Required! </p>
                            <div className="verify-btn gap-2 flex flex-col">
                                <button type="submit" className="bg-cyan-800 w-full text-white p-2 font-semibold rounded-lg">
                                    {
                                        loading===true?(
                                                <CircularProgress className="text-white mx-auto text-2xl p-[10px]" color="white" />
                                        ):(
                                                <span> Verify OTP </span>
                                        )
                                    }
                                </button>
                                <button type="submit" className="bg-gray-400 w-full text-white p-2 font-semibold rounded-lg">
                                    Clear
                                </button>
                            </div>
                            <p className="text-center mt-2 text-gray-500"> Back to <a href="/" className="font-semibold text-cyan-700 transition hover:underline duration-300  cursor-pointer"> Sign In </a></p>
                        </form>
                    </div>

                </div>
            </div>
    )
}
