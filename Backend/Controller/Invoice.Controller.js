import InvoiceSchema from "../Model/InvoiceSchema.js";

export async function InvoiceData(req, res) {
    try{
        const {from,to,items} = req.body;

        if(!from || !to || !items){
           return res.status(400).json({
                message:"All Fields must be required"
            });
        }

        if(to.name==="" || to.address==="" || to.contact==="" || to.email==="" || to.state==="" || to.StateCode==="" || to.GSTNo===""){
            res.status(400).json({
                message:"Customer Data Must be required",
            });
            return;
        }

        if(!to.email.includes("@")){
            return res.status(400).json({
                message:"Customer Email Is Invalid",
            });
        }

        const invoice = new InvoiceSchema(req.body);
        await invoice.save();

        res.status(200).send({
            invoice: invoice
        });
    }catch(err){
        res.status(500).send(err);
    }
}

export async function Invoices(req, res) {
    try {
        const Invoices = await InvoiceSchema.find();
        res.status(200).send(Invoices);
    }catch(err){
        res.status(400).send({
            error: err
        })
    }
}

export async function DeleteInvoice(req, res) {
    try {
        const DeleteInvoice = await InvoiceSchema.deleteOne({_id:req.params.id});
        res.status(200).send({
            status: "success",
            message: "Invoice deleted successfully",
        })
    }catch(err){
        res.status(400).send({
            error: err,
        })
    }
}

export  async function SearchData(req,res){
    try{
        let searchQuery = req.query.search;
        const Search = await InvoiceSchema.find({
            "to.name":{
                $regex:searchQuery,
                $options:"i"
            }
        })
        if(searchQuery===""){
            return res.json({
                status: "false",
                message: "Please enter a valid Search Data",
            })
        }else{
            return res.status(200).send(Search);
        }
    }catch(err){
        res.status(400).send({
            error: err,
        })
    }
}
