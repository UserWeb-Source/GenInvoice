import React, {useContext, useRef} from 'react';
import "./invoice.css";
import {LoadingContext} from "../Context/contextLoading.jsx";
import { Toast } from 'primereact/toast';
import Loader from "../Loader/Loader.jsx";
export default function MainPanel({page,setpage}) {
    const toast = useRef(null);
    const [calculationData, setCalculationData] = React.useState({
        Sub_total: 0,
        CGST: "2.5%",
        SGST: "2.5%",
        Grand_total: 0,
    });
    const {loading,setLoading} = useContext(LoadingContext);
    // EmptyItemInvoiceData
    const createEmptyData = (sr) => ({
        Sr_no: sr,
        Item_Description: "",
        Hsn_Code: "",
        Quantity: 0,
        Rate: 0,
        Amount: 0,
    });

    const CreateIntitalFrom = {
        fname: "GenInvoice LTD",
        faddress: "sdgfgfdgd",
        fcontact: "97689 59689",
        femail: "agbdh@jfsf",
        fstate: "sdffdf",
        fscode: "12",
        fGSTNo: "24AATDE1234F1Z5"
    }

    const CreateIntitalTo = {
        tname: "fgddgdgdgd",
        taddress: "dfgdgdgfdg",
        tcontact: "96879 56735",
        temail: "asderw@dgfg",
        tstate: "sdfssdf",
        tscode: "31",
        tGSTNo: "24AVTDE1234F1Z5"
    }

    const [from, setFrom] = React.useState(CreateIntitalFrom);
    const [to, setTo] = React.useState(CreateIntitalTo);
    const [activePDF, setActivePDF] = React.useState(false);
    const [Data, setData] = React.useState({});
    // const [page,setPage] = React.useState(false);

    const {fname, faddress, fcontact, femail, fstate, fscode, fGSTNo} = from;
    const {tname, taddress, tcontact, temail, tstate, tscode, tGSTNo} = to;

    const onchangeFrom = (e) => {
        setFrom({
            ...from, [e.target.name]: e.target.value,
        });
    }

    const onchangeTo = (e) => {
        setTo({
            ...to, [e.target.name]: e.target.value,
        });
    }

    const [tableData, setTableData] = React.useState([createEmptyData(1)]);
    const AddRow = () => {
        setTableData((prevState) => [
            ...prevState,
            createEmptyData(prevState.length + 1)
        ]);
    }

    const handleChangeData = (index, field, value) => {
        try {
            // Invoice table form row Data Assigned Hook
            const newRow = [...tableData];
            newRow[index] = {
                ...newRow[index],
                [field]: value,
            };

            //Amount Calaulation
            let Amt = Number(newRow[index].Amount);
            Amt = Number(newRow[index].Quantity) * Number(newRow[index].Rate);
            newRow[index].Amount = Amt;

            //SubTotal Calculation of Multiple Invoice Amount
            let sum_Amt = 0;
            newRow.map((item) => {
                sum_Amt += item.Amount;
            })

            //Grand Total Calculation
            let calculateGST = sum_Amt * 0.05;
            setCalculationData({
                ...calculationData,
                Sub_total: parseFloat(sum_Amt).toFixed(2),
                Grand_total: parseFloat((sum_Amt + calculateGST).toFixed(2))
            })
            setTableData(newRow);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmitInvoice = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const body = {
                from: {
                    name: fname,
                    address: faddress,
                    contact: fcontact,
                    email: femail,
                    state: fstate,
                    StateCode: fscode,
                    GSTNo: fGSTNo
                },
                to: {
                    name: tname,
                    address: taddress,
                    contact: tcontact,
                    email: temail,
                    state: tstate,
                    StateCode: tscode,
                    GSTNo: tGSTNo
                },
                items: tableData.map((item, index) => ({
                    srNo: Number(item.Sr_no),
                    description: item.Item_Description,
                    hsnCode: item.Hsn_Code,
                    qty: Number(item.Quantity),
                    rate: Number(item.Rate)
                }))
            }
            const res = await fetch("http://localhost:5002/invoice/v2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (res.status === 200) {
                setTimeout(() => { setLoading(false); }, 2000);
                setActivePDF(true);
                setData(data.invoice);
                setpage(true);
                return;
            }
            if (res.status === 400) {
                console.log(data);
                setTimeout(() => { setLoading(false); }, 500);
                toast.current.show({ severity: 'error', summary: 'Error', detail: data?.message });
                return;
            }
            if(res.status === 500) {
                setTimeout(() => { setLoading(false); }, 500);
            }
        } catch (error) {
            console.log(error);

        }
    }
    const downloadPDF = () => {
        try {
            setLoading(true);
            document.title = `INV-0${Data.Bill_No}`;
            window.print();
            console.log(loading);
            setTimeout(() => {
                setLoading(false);
            },2000);
        }catch (error) {
            console.log(error);
        }
    }
    return (
            <section className='main-panel  bg-stone-100/40'>
                {!page ? (
                        <>
                                <Toast ref={toast}/>
                                <div className="mainpanel-container mx-5 mt-6">
                                    <p className="text-4xl text-cyan-900 font-bold"> Create Invoice </p>
                                    <p className="text-gray-500"> Make Invoices and Bills for your Business </p>
                                </div>
                                <div className="invoice-form-container mt-3 mx-5" style={{fontFamily: "system-ui"}}>
                                    <form className="invoice-form" onSubmit={handleSubmitInvoice}>
                                        <div className="grid md:grid-cols-2">
                                            <div className="from-container p-5 max-w-3xl bg-white shadow rounded-xl">
                                                <p className="text-lg font-bold mb-3 bg-gray-100 text-cyan-900 p-3 rounded"> Business Information </p>
                                                <div className="form-group flex gap-5">
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor="" className="text-[15px] text-cyan-900 font-semibold"> From Party </label>
                                                        <input type="text" value={fname} className="form-control bg-white"
                                                               name="fname" id="fname" onChange={onchangeFrom}
                                                               placeholder="GenVoice LTD"/>
                                                    </div>
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor=""
                                                               className="text-[15px] text-cyan-900 font-semibold"> GST/IN </label>
                                                        <input type="text" value={fGSTNo} className="form-control bg-white"
                                                               name="fGSTNo" id="fGSTNo" onChange={onchangeFrom}
                                                               placeholder="24DHSD8756845ZL"/>
                                                    </div>
                                                </div>
                                                <div className="form-group mt-3 gap-5">
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor=""
                                                               className="text-[15px] text-cyan-900 font-semibold"> Address </label>
                                                        <input type="text" value={faddress} className="form-control bg-white"
                                                               name="faddress" onChange={onchangeFrom} id="faddress"
                                                               placeholder="Los Angeles"/>
                                                    </div>
                                                </div>
                                                <div className="form flex mt-3 gap-5">
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor="" className="text-[15px] text-cyan-900 font-semibold"> Email </label>
                                                        <input type="text" value={femail} className="form-control bg-white"
                                                               name="femail" onChange={onchangeFrom} id="femail"
                                                               placeholder="demo@yahoo.com"/>
                                                    </div>
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor="" className="text-[15px] text-cyan-900 font-semibold"> Mobile No </label>
                                                        <input type="text" value={fcontact} className="form-control bg-white"
                                                               name="fcontact" onChange={onchangeFrom} id="fcontact"
                                                               placeholder="+87 975 847 5874"/>
                                                    </div>
                                                </div>
                                                <div className="form flex mt-3 gap-5">
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor="" className="text-[15px] text-cyan-900 font-semibold"> State </label>
                                                        <input type="text" value={fstate} className="form-control bg-white"
                                                               name="fstate" onChange={onchangeFrom} id="fstate"
                                                               placeholder="Pensacola"/>
                                                    </div>
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor="" className="text-[15px] text-cyan-900 font-semibold"> State Code </label>
                                                        <input type="text" value={fscode} className="form-control bg-white"
                                                               name="fscode" onChange={onchangeFrom} id="fscode"
                                                               placeholder="31"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="from-container p-5 max-w-3xl bg-white shadow rounded-xl">
                                                <p className="text-lg font-bold mb-3 bg-gray-100 text-cyan-900 p-3 rounded"> Client
                                                                                                                             Information </p>
                                                <div className="form-group flex gap-5">
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor="" className="text-[15px] text-cyan-900 font-semibold"> To Party </label>
                                                        <input type="text" value={tname} className="form-control bg-white"
                                                               name="tname" id="tname" onChange={onchangeTo}
                                                               placeholder="GenVoice LTD"/>
                                                    </div>
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor=""
                                                               className="text-[15px]  text-cyan-900 font-semibold"> GST/IN </label>
                                                        <input type="text" value={tGSTNo} className="form-control bg-white"
                                                               name="tGSTNo" id="tGSTNo" onChange={onchangeTo}
                                                               placeholder="24DHSD8756845ZL"/>
                                                    </div>
                                                </div>
                                                <div className="form-group mt-3 gap-5">
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor=""
                                                               className="text-[15px]  text-cyan-900 font-semibold"> Address </label>
                                                        <input type="text" value={taddress} className="form-control bg-white"
                                                               name="taddress" id="taddress" onChange={onchangeTo}
                                                               placeholder="Los Angeles"/>
                                                    </div>
                                                </div>
                                                <div className="form flex mt-3 gap-5">
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor=""
                                                               className="text-[15px]  text-cyan-900 font-semibold"> Email </label>
                                                        <input type="text" value={temail} className="form-control bg-white"
                                                               name="temail" id="temail" onChange={onchangeTo}
                                                               placeholder="demo@yahoo.com"/>
                                                    </div>
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor=""
                                                               className="text-[15px]  text-cyan-900 font-semibold"> Mobile
                                                                                                                     No </label>
                                                        <input type="text" value={tcontact} className="form-control bg-white"
                                                               name="tcontact" id="tcontact" onChange={onchangeTo}
                                                               placeholder="+87 975 847 5874"/>
                                                    </div>
                                                </div>
                                                <div className="form flex mt-3 gap-5">
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor=""
                                                               className="text-[15px]  text-cyan-900 font-semibold"> State </label>
                                                        <input type="text" value={tstate} className="form-control bg-white"
                                                               name="tstate" id="tstate" onChange={onchangeTo}
                                                               placeholder="Pensacola"/>
                                                    </div>
                                                    <div className="flex w-full flex-col gap-1">
                                                        <label htmlFor=""
                                                               className="text-[15px]  text-cyan-900 font-semibold"> State
                                                                                                                     Code </label>
                                                        <input type="text" value={tscode} className="form-control bg-white"
                                                               name="tscode" id="tscode" onChange={onchangeTo}
                                                               placeholder="31"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="invoice grid overflow-hidden pb-5 rounded-xl shadow max-w-[98.5rem] mt-4 bg-white">
                                                <div className="bg-gray-100 flex items-center p-3 justify-between">
                                                    <p className="text-lg font-bold  text-cyan-900  rounded"> Invoice Item </p>
                                                    <div className="btns flex space-x-2">
                                                        <button type="button"
                                                                className="bg-black text-white font-semibold rounded-lg cursor-pointer transition active p-2"
                                                                onClick={AddRow}> + Add item
                                                        </button>
                                                        <button type="button" disabled={tableData.length === 1 ? true : false}
                                                                className={` ${tableData.length === 1 ? "bg-red-500/30" : "bg-red-700 cursor-pointer transition active:scale-96"} font-semibold text-white rounded-lg p-2`}
                                                                onClick={(e) => {
                                                                    setTableData([...tableData.slice(0, -1)]);
                                                                }}> Delete Row
                                                        </button>
                                                    </div>
                                                </div>
                                                <table className="invoice-item-table mt-3 mx-3 table-striped">
                                                    <thead className="table-head text-left">
                                                    <tr>
                                                        <th>
                                                            <p className=" text-cyan-900 "> Sr No. </p>
                                                        </th>
                                                        <th>
                                                            <p className=" text-cyan-900 "> Item Description </p>
                                                        </th>
                                                        <th>
                                                            <p className="mx-10 text-cyan-900 "> HSN Code </p>
                                                        </th>
                                                        <th>
                                                            <p className=" text-cyan-900 "> Quantity </p>
                                                        </th>
                                                        <th>
                                                            <p className=" text-cyan-900 "> Rate </p>
                                                        </th>
                                                        <th>
                                                            <p className=" text-cyan-900 "> Amount </p>
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className="table-body">
                                                    {
                                                        tableData.map((item, index) => {
                                                            return (
                                                                    <tr key={index}>
                                                                        <td>
                                                                            <input type="Number" name="Sr_no" value={item.Sr_no}
                                                                                   onChange={(e) => {
                                                                                       handleChangeData(index, "Sr_no", e.target.value)
                                                                                   }} id="Item_Description"
                                                                                   className="form-control max-w-[90px]"/>
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" name="Item_Description"
                                                                                   value={item.Item_Description}
                                                                                   onChange={(e) => {
                                                                                       handleChangeData(index, "Item_Description", e.target.value)
                                                                                   }} id="Item_Description"
                                                                                   className="form-control w-full"/>
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" name="Hsn_Code"
                                                                                   value={item.Hsn_Code} onChange={(e) => {
                                                                                handleChangeData(index, "Hsn_Code", e.target.value)
                                                                            }} id="Hsn_Code"
                                                                                   className="form-control w-full mx-10 max-w-[200px]"/>
                                                                        </td>
                                                                        <td>
                                                                            <input type="Number" name="Quantity"
                                                                                   value={item.Quantity} onChange={(e) => {
                                                                                handleChangeData(index, "Quantity", e.target.value)
                                                                            }} id="Quantity"
                                                                                   className="form-control w-full max-w-[150px]"/>
                                                                        </td>
                                                                        <td>
                                                                            <input type="Number" name="Rate" value={item.Rate}
                                                                                   onChange={(e) => {
                                                                                       handleChangeData(index, "Rate", e.target.value)
                                                                                   }} id="Rate"
                                                                                   className="form-control w-full max-w-[200px]"/>
                                                                        </td>
                                                                        <td>
                                                                            <input type="text" name="Amount" value={item.Amount}
                                                                                   onChange={(e) => {
                                                                                       handleChangeData(index, "Amount", e.target.value)
                                                                                   }} id="Amount"
                                                                                   className="form-control w-full " disabled/>
                                                                        </td>
                                                                    </tr>
                                                            )
                                                        })
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="invoice-summary-container shadow-sm border rounded-2xl overflow-hidden border-gray-100 bg-white grid max-w-sm mt-5">
                                            <p className="text-lg font-bold mb-3 bg-gray-100 text-cyan-900 p-3 rounded"> Invoice Summary </p>
                                            <div className="sub-total font-bold text-[17px] flex justify-between mx-3">
                                                <p> Sub Total </p>
                                                <p> ₹{calculationData.Sub_total} </p>
                                            </div>
                                            <hr className="mt-2 text-gray-200"/>
                                            <div className="csgt font-semibold text-[15px] flex mt-3 mb-1 justify-between mx-3">
                                                <p> CGST </p>
                                                <p> {calculationData.CGST} </p>
                                            </div>
                                            <hr className="mt-2 text-gray-200"/>
                                            <div className="sgst font-semibold items-center mt-2 text-[15px] mb-1 flex justify-between mx-3">
                                                <p> SGST </p>
                                                <p> {calculationData.SGST} </p>
                                            </div>
                                            <hr className="mt-2 text-gray-200"/>
                                            <div className="grand-total items-center flex justify-between text-[17px] font-bold  bg-gray-100 text-cyan-900 p-3 rounded">
                                                <p> Grand Total </p>
                                                <p> ₹{parseFloat(calculationData.Grand_total).toFixed(2)} </p>
                                            </div>
                                            <div className="btns flex  font-semibold">
                                                <button type="submit" className="bg-gray-200 w-full m-2 rounded-xl cursor-pointer transition active:scale-90 p-3">
                                                    Save Invoice
                                                </button>
                                                <button type="button"
                                                        className={`${!activePDF ? "bg-cyan-900/65" : "transition bg-cyan-900 active:scale-90 cursor-pointer"} text-white m-2 rounded-xl  w-full p-3`}
                                                        disabled={!activePDF}
                                                        onClick={() => {setpage(true)}}>
                                                    Invoice PDF
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                {
                                    loading && (
                                                <Loader/>
                                        )
                                }

                        </>
                    ):(
                       <>
                           <div className="min-h-screen  font-[system-ui] flex p-6">
                               <div className="bg-white mx-auto w-full order-1 max-w-4xl p-10 rounded-2xl shadow">
                                   {/* Header */}
                                   <div className="flex justify-between items-start mb-8">
                                       <div>
                                           <h1 className="text-4xl font-semibold mb-6"> Tax Invoice </h1>
                                       </div>

                                       <div className="text-right text-sm text-gray-700">
                                           <p className="text-cyan-800 font-bold">{Data.from.name} </p>
                                           <p>{Data.from.address}</p>
                                           <p>{Data.from.email}</p>
                                           <p>{Data.from.contact}</p>
                                           <p>{Data.from.state} - {Data.from.StateCode}</p>
                                           <p className="mt-1 font-semibold"> GSTIN : {Data.from.GSTNo}</p>
                                       </div>
                                   </div>

                                   {/* Billing + Info */}
                                   <div className="grid grid-cols-2 gap-10 mb-5">
                                       <div>
                                           <p className="text-cyan-800 font-medium mb-2">Billed To</p>
                                           <p>{Data.to.name}</p>
                                           <p>{Data.to.address}</p>
                                           <p>Contact: {Data.to.contact}</p>
                                           <p>Email: {Data.to.email}</p>
                                           <p>GSTIN: {Data.to.GSTNo}</p>
                                           <p>
                                               {Data.to.state} - {Data.to.StateCode}
                                           </p>
                                       </div>

                                       <div className="grid grid-cols-2 gap-6 text-sm">
                                           <div>
                                               <p className="text-cyan-800 font-semibold">Date Issued</p>
                                               <p className="mt-1"> {Data.Created_at.slice(0,10)}  </p>
                                           </div>

                                           <div>
                                               <p className="text-cyan-800 font-semibold">Invoice Number</p>
                                               <p className="mt-1"> {Data.Bill_No} </p>
                                           </div>

                                           <div>
                                               <p className="text-cyan-800 font-semibold">Due Date</p>
                                               <p className="mt-1"> {Data.Due_date.slice(0,10)} </p>
                                           </div>

                                           <div>
                                               <p className="text-cyan-800 font-semibold">Amount Due</p>
                                               <p className="mt-1 font-semibold">{Data.GrandTotal}</p>
                                           </div>
                                       </div>
                                   </div>

                                   <div className="border-b-2 border-cyan-800 mb-4" />

                                   {/* Table */}
                                   <table className="w-full text-sm">
                                       <thead>
                                       <tr className="text-cyan-800 text-left">
                                           <th className="pb-3">SR.No</th>
                                           <th className="pb-3">DESCRIPTION</th>
                                           <th className="pb-3">HSN CODE</th>
                                           <th className="pb-3">RATE</th>
                                           <th className="pb-3">QTY</th>
                                           <th className="pb-3 text-right">AMOUNT</th>
                                       </tr>
                                       </thead>

                                       <tbody className="text-gray-700">
                                       {Data.items?.map((item) => (
                                               <tr key={item.srNo}>
                                                   <td className="py-2">{item.srNo}</td>
                                                   <td>{item.description}</td>
                                                   <td>{item.hsnCode}</td>
                                                   <td>{item.qty}</td>
                                                   <td>₹{item.rate}</td>
                                                   <td className="text-right">₹{item.amount}</td>
                                               </tr>
                                       ))}
                                       </tbody>
                                   </table>

                                   {/* Totals */}
                                   <div className="flex justify-between mt-8">
                                       <div>
                                           <p className="text-cyan-800 border-b py-2 font-medium text-sm"> Total Amount in Word  </p>
                                           <p className=" text-md font-semibold mt-2 text-xs"> {Data.WordAmount} </p>
                                       </div>
                                       <div className="w-64 text-sm space-y-2">
                                           <div className="flex justify-between">
                                               <span> Subtotal </span>
                                               <span> ₹{Data.Sub_Total} </span>
                                           </div>

                                           <div className="flex justify-between">
                                               <span> CGST </span>
                                               <span> +₹{Data.CGST} </span>
                                           </div>

                                           <div className="flex justify-between">
                                               <span> SGST </span>
                                               <span> +₹{Data.SGST} </span>
                                           </div>
                                           <div className="border-t-2 border-cyan-800 pt-2 flex justify-between font-semibold">
                                               <span> Total Amount </span>
                                               <span> {Data.GrandTotal} </span>
                                           </div>
                                       </div>
                                   </div>

                                   <div className="mt-10 text-sm flex justify-between">
                                       <div>
                                           <p className="mt-16 font-semibold">Thank you for your business!</p>
                                       </div>
                                       <div className="font-semibold flex flex-col space-y-9 mt-3">
                                           <p> For GenInvoice Info. </p>
                                           <p> Authorized Signature </p>
                                       </div>
                                   </div>
                               </div>
                               <div className="btns-container flex flex-col justify-center mx-3  my-3 mt-3 gap-5">
                                   <button className="pdf-btn text-white bg-cyan-900 pl-6 pe-10 py-3 rounded-xl cursor-pointer"
                                           onClick={downloadPDF} style={{
                                       clipPath: "polygon(10% 0%, 10% 0%, 85% 0%, 100% 50%, 85% 100%, 10% 100%)"}}>
                                       <svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="20" x="0"
                                            y="0" viewBox="0 0 25 24"><g><g fill="#000"><path d="M4.637 16a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a1 1 0 1 1 2 0v2a3 3 0 0 1-3 3h-12a3 3 0 0 1-3-3v-2a1 1 0 0 1 1-1z" fill="#fff9f9" opacity="1" data-original="#000000" className=""></path><path
                                               d="M6.93 10.293a1 1 0 0 1 1.414 0l4.293 4.293 4.293-4.293a1 1 0 1 1 1.414 1.414l-5 5a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 0-1.414z"
                                               fill="#fff9f9" opacity="1" data-original="#000000" className=""></path><path
                                               d="M12.637 3a1 1 0 0 1 1 1v12a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1z"
                                               fill="#fff9f9" opacity="1" data-original="#000000" className=""></path></g></g>
                                       </svg>
                                   </button>
                                   <button className="pdf-btn text-black bg-gray-300 pl-6 pe-10 py-3 rounded-xl cursor-pointer"
                                           onClick={() => setpage(false)} style={{
                                       clipPath: "polygon(10% 0%, 10% 0%, 85% 0%, 100% 50%, 85% 100%, 10% 100%)"}}>
                                       <svg  version="1.1" height="20" x="0" y="0" viewBox="0 0 512 512" >
                                           <g><path d="m142.716 293.147-94-107.602 94-107.602c7.596-8.705 6.71-21.924-1.995-29.527-8.705-7.596-21.917-6.703-29.527 1.995L5.169 171.782c-6.892 7.882-6.892 19.65 0 27.532l106.026 121.372a20.913 20.913 0 0 0 15.771 7.157 20.84 20.84 0 0 0 13.755-5.169c8.706-7.603 9.598-20.822 1.995-29.527z" fill="#000000" opacity="1" data-original="#000000" className=""></path><path
                                                   d="M359.93 164.619H20.926C9.368 164.619 0 173.986 0 185.545c0 11.558 9.368 20.926 20.926 20.926H359.93c60.776 0 110.218 49.441 110.218 110.211S420.706 426.893 359.93 426.893H48.828c-11.558 0-20.926 9.368-20.926 20.926 0 11.558 9.368 20.926 20.926 20.926H359.93c83.844 0 152.07-68.219 152.07-152.063s-68.219-152.063-152.07-152.063z"
                                                   fill="#000000" opacity="1" data-original="#000000" className=""></path></g>
                                       </svg>
                                   </button>
                               </div>
                           </div>
                           {
                                       loading && (
                                               <Loader/>
                                       )
                           }
                           </>
                    )
                }

            </section>
    )
}