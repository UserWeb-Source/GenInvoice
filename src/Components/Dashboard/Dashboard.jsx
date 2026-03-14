import React, {useEffect} from 'react'
import axios from 'axios';
import {Routes,Route,useNavigate} from 'react-router-dom';
import MainPanel from "./MainPanel.jsx";
import Invoices from "./Invoices.jsx";
import Help from "./Help.jsx";


export default  function Dashboard() {
    const navigate = useNavigate();
    const [page, setPage] = React.useState(false);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";
    useEffect(() => {
        if (!sessionStorage.getItem('verify_token')) {
            return navigate('/');
        }
        async function methodVerify()  {
            try{
                const res =  await axios.get(`${API_URL}/profile`,{
                    withCredentials: true
                });
                if (res.status === 200) {
                    console.log("Success");
                }
            }catch(err){
                console.log(err);
                window.location.reload();
                window.location.href = "/";
            }
        }
        methodVerify();
    },[]);

    const handlelogout = async () => {
        try {
            const res = await axios.post(
                `${API_URL}/admin/logout`,
                {},
                { withCredentials: true }
            );
            if(res.status === 200){
                window.location.href = "/";
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
            <section className="section-dashboard">
                <div className={`container-dashboard h-dvh`}>
                    <section className={`sidepanel-section`}>
                        <div className={`panel-container ${!page?"":"hidden"} flex flex-col mt-15`}>
                            <div className="panel-logo p-3 shadow-md border flex mx-auto rounded-xl shadow-cyan-900/50 border-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     width="35" viewBox="0 0 512.006 512.006"
                                     className=""><g><path d="M184.002 368.002h-7.572c-7.082 0-13.578-4.432-15.689-11.192-2.556-8.187 1.723-16.748 9.521-19.738l120.016-46.159c8.429-3.242 12.477-12.799 8.999-21.134-47.344-113.465-59.191-253.421-59.325-255.067-1.219-15.054-20.837-20.202-29.26-7.59l-23.13 34.69-34.68-23.12c-9.179-6.127-21.719-1.313-24.4 9.43l-10.5 41.97-29.1-19.4c-9.179-6.127-21.719-1.313-24.4 9.43l-10.5 41.97-29.1-19.4C13.796 75.301-.992 83.956.052 97.242c.32 4.15 8.23 102.86 38.24 203.34 17.88 59.85 39.98 107.77 65.68 142.45 18.034 24.311 45.676 36.97 73.602 36.97h5.579c30.732 0 56.376-24.405 56.843-55.134.475-31.275-24.826-56.866-55.994-56.866zm-102.86-170.06c-3.28-8.2.71-17.51 8.92-20.8l80-32c8.2-3.28 17.51.71 20.8 8.92 3.28 8.2-.71 17.51-8.92 20.8-86.636 34.654-81.523 33.14-85.94 33.14-6.34 0-12.35-3.8-14.86-10.06zm36.8 72.92c-8.085 3.234-17.472-.619-20.8-8.92-3.28-8.2.71-17.51 8.92-20.8l80-32c8.2-3.28 17.51.71 20.8 8.92 3.28 8.2-.71 17.51-8.92 20.8zm314.06 1.14c-4.179 0 4.086-2.709-111.59 41.78-.141-.234-77.388 29.589-77.257 29.538-5.69 2.189-6.909 9.647-2.262 13.593 48.686 41.344 38.574 118.94-19.023 146.514-4.3 2.059-2.859 8.567 1.908 8.575 13.287.022 26.037-3.221 37.184-9.04l172.53-71.04a15.9 15.9 0 0 0 8.68-3.57c46.758-19.245 44.562-17.829 47.74-21.15 48.334-50.675 12.124-135.2-57.91-135.2zM411.316 187.316c-6.238 6.236-25.779 6.22-32 0-6.248-6.248-16.379-6.249-22.627 0-6.249 6.249-6.248 16.379 0 22.627 6.711 6.711 16.326 11.272 27.313 13.126v16.933c0 8.836 7.163 16 16 16s16-7.164 16-16v-19.296c41.992-14.273 40.789-70.499 2.407-86.397l-24.568-10.177c-12.786-5.295-15.084-28.129 10.848-28.129 7.815 0 13.667 2.354 16 4.687 6.248 6.248 16.379 6.249 22.627 0 6.249-6.249 6.248-16.379 0-22.627-6.711-6.711-16.326-11.272-27.313-13.126V48.002c0-8.836-7.163-16-16-16s-16 7.164-16 16v19.296c-41.628 14.149-41.118 70.363-2.407 86.397l24.568 10.177c9.215 3.817 12.589 15.987 5.152 23.444z" fill="#1a5f78" opacity="1" data-original="#000000" className=""></path></g></svg>
                            </div>
                            <p className="text-center text-2xl font-bold text-cyan-900 hidden mt-3"> GenInvoice </p>
                            <div className="panel-items-container mt-10">
                                <ul className="panel-items-list  flex flex-col gap-5">
                                    <li
                                        className="transition hover:bg-cyan-500/15 cursor-pointer mx-2 rounded-xl p-3"
                                        onClick={() => navigate('/dashboard')}
                                    >
                                        <p className="text-cyan-900 font-semibold text-[17px]" > Dashboard </p>
                                    </li>
                                    <li
                                        className="transition hover:bg-cyan-500/15 cursor-pointer mx-2 rounded-xl p-3"
                                        onClick={() => navigate('/dashboard/invoices')}
                                    >
                                        <p className="text-cyan-900 font-semibold text-[17px]"> Invoice </p>
                                    </li>
                                    <li
                                        className="transition hover:bg-cyan-500/15 cursor-pointer mx-2 rounded-xl p-3"
                                        onClick={() => navigate('/dashboard/help')}
                                    >
                                        <p className="text-cyan-900 font-semibold text-[17px]"> Help </p>
                                    </li>
                                </ul>
                            </div>
                            <div className="lg-out-btn p-3 mx-2 rounded-xl transition hover:bg-cyan-500/15  mt-105">
                                <button
                                    className="text-cyan-900 text-center w-full cursor-pointer  font-semibold"
                                    onClick={handlelogout}
                                >
                                    Leave
                                </button>
                            </div>
                        </div>
                    </section>
                    <div>
                        <Routes>
                            <Route index element={<MainPanel page={page} setpage={setPage}/>} />
                            <Route path="invoices"  element={<Invoices/>} />
                            <Route path="help" element={<Help/>} />
                        </Routes>
                    </div>
                </div>
            </section>
    )
}
