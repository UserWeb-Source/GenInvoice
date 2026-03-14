import React, {useEffect,useState} from 'react';
import NoData from "../../assets/No-Data-Icon.svg";
import DeleteData from "../../assets/Delete-Icon.svg";
import {LoadingContext} from "../Context/contextLoading.jsx";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Loader from "../Loader/Loader.jsx";

export default function Invoices() {
    const [invoiceData, setInvoiceData] = React.useState([]);
    const [searchInvoice, setSearchInvoice] = React.useState([]);
    const [search, setSearch] = React.useState("");
    const {loading,setLoading} = React.useContext(LoadingContext);

    const handleRemoveInvoice = async (e) => {
        const Invoice_Id = e.target.parentElement.parentElement.parentElement.id;
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            position:"top",
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            rejectClassName: 'p-button-secondary',
            async accept() {
                const res = await fetch(`http://localhost:5002/invoice/${Invoice_Id}`, {
                    method: "DELETE",
                });
                if (res.status === 200) {
                    console.log(res);
                    window.location.reload();
                }
            }
        });
    }

    const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:5002/invoice/all', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                });
                const data = await res.json();
                setInvoiceData(data);
            }catch(err){
                console.log(err);
            }
    }

    const SearchInvoice = async (search) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5002/invoice/ser?search=${search}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            });
            const data = await res.json();
            if (res.status === 200) {
                setTimeout(() => {
                    setSearchInvoice(data);
                },1000);
                setLoading(false);
            }
        }catch(err){
            console.log(err);
            setLoading(false);
        }
    }

    useEffect(() => {
       fetchData();
    },[]);
    return (
            <>
                {/*Invoices Section*/}
                <section className="invoices-section bg-stone-100/40">
                    <div className="invoices-data-container mx-5 mt-6">
                        <p className="text-4xl text-cyan-900 font-bold"> Invoices Data </p>
                        <p className="text-gray-500"> Show your Made Invoices </p>
                        <div className="search-invoice-container mt-6">
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} name="search" className="form-control"/>
                            <button className="bg-cyan-900 font-semibold cursor-pointer p-2 mx-2 rounded-lg text-white" onClick={() => {
                                if(search===""){
                                    setActive(true);
                                }else{
                                    SearchInvoice(search);
                                }
                            }}>
                                Find Invoice
                            </button>
                        </div>
                        <div className="invoice overflow-hidden border border-gray-200 rounded-xl mt-4 h-dvh font-[system-ui]">
                            <table className="table invoices-data-table w-full">
                                <thead className="text-gray-700 bg-gray-300/80">
                                    <tr>
                                        <th className="p-2">
                                            Invoice No.
                                        </th>
                                        <th className="p-2">
                                            Client Name
                                        </th>
                                        <th className="p-2">
                                            GSTIN
                                        </th>
                                        <th className="p-2">
                                            Address
                                        </th>
                                        <th className="p-2">
                                            Phone Number
                                        </th>
                                        <th className="p-2">
                                            Email
                                        </th>
                                        <th className="p-2">
                                            Amount
                                        </th>
                                        <th className="p-2">
                                            State
                                        </th>
                                        <th className="p-2">
                                            Created At
                                        </th>
                                        <th className="p-2">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-center font-semibold">
                                {
                                    search!=="" ? (
                                            searchInvoice?.map((item, index) => {
                                                return (
                                                        <tr key={item._id} id={item._id}>
                                                            <td className="border-b border-gray-200 p-1">
                                                                {item.Bill_No}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-1">
                                                                {item?.to?.name}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-1">
                                                                {item?.to?.GSTNo}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-1">
                                                                {item?.to.address}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-1">
                                                                {item?.to.contact}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-1">
                                                                {item?.to.email}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-1">
                                                                {item.GrandTotal}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-1">
                                                                {item?.to.state}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-1">
                                                                {item.Created_at.split('T')[0]}
                                                            </td>
                                                            <td className="border-b border-gray-200 p-2">
                                                                <button className="bg-red-600 p-[6px] rounded-lg cursor-pointer" onClick={handleRemoveInvoice}>
                                                                    <img src={DeleteData} alt=""/>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                )
                                            })
                                            ):(
                                            invoiceData?.map((item, index) => {
                                                return (
                                                        <tr key={item._id} id={item._id}>
                                                            <td className="border-b border-gray-200 p-2">
                                                                {item.Bill_No}
                                                            </td>
                                                            <td className="border-b border-gray-300/70 text-gray-700 p-2">
                                                                {item?.to?.name}
                                                            </td>
                                                            <td className="border-b border-gray-300/70 font-[700] text-gray-700 p-2">
                                                                {item?.to?.GSTNo}
                                                            </td>
                                                            <td className="border-b border-gray-300/70 text-gray-700 p-2">
                                                                {item?.to.address}
                                                            </td>
                                                            <td className="border-b border-gray-300/70 text-gray-700 p-2">
                                                                {item?.to.contact}
                                                            </td>
                                                            <td className="border-b border-gray-300/70 text-gray-700 p-2">
                                                                {item?.to.email}
                                                            </td>
                                                            <td className="border-b border-gray-300/70 text-gray-700 font-[700] p-2">
                                                                ₹{item.GrandTotal.toFixed(2)}
                                                            </td>
                                                            <td className="border-b border-gray-300/70 text-gray-700 p-2">
                                                                {item?.to.state}
                                                            </td>
                                                            <td className="border-b border-gray-300/70 text-gray-700 p-2">
                                                                {item.Created_at.split('T')[0]}
                                                            </td>
                                                            <td className="border-b border-gray-300/70 text-gray-700 p-2">
                                                                <button className="bg-red-600 p-[6px] rounded-lg cursor-pointer" onClick={handleRemoveInvoice}>
                                                                    <img src={DeleteData} alt=""/>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                )
                                            })
                                    )

                                }
                                </tbody>
                                <ConfirmDialog/>
                            </table>
                            {
                                invoiceData.length === 0 ? (
                                        <div className="no-invoices-container flex flex-col text-gray-500 text-md mt-15 font-semibold items-center justify-center">
                                            <img src={NoData} alt=""/>
                                            Invoices Not Available
                                        </div>
                                ) : (
                                        <></>
                                )

                            }
                        </div>
                    </div>
                    {
                        loading && (
                                <Loader/>
                            )
                    }
                </section>
            </>
    )
}
