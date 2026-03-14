import express from "express";
import {SignUp} from "../Controller/Auth.Controller.js";
import {InvoiceData, Invoices, DeleteInvoice, SearchData} from "../Controller/Invoice.Controller.js";
import {LogOut} from "../Controller/Auth.Controller.js";
const route = express.Router();

route.post("/signup" , SignUp);

route.post("/v2",InvoiceData);

route.post("/logout", LogOut);

route.post("/all", Invoices);

route.delete("/:id", DeleteInvoice);

route.post("/ser", SearchData);


export default route;
