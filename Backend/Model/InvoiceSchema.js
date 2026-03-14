import mongoose from 'mongoose';
import { toCurrency } from 'to-words/en-IN';

const InfoSchema = new mongoose.Schema(
    {
        name:{type: String,required: true},
        address:{type:String,required: true},
        contact:{type:String,required: true},
        email:{type: String,required: true},
        state:{type:String,required: true},
        StateCode:{type:Number,required: true},
        GSTNo:{type:String,required: true},
    },
)

const invoiceItemSchema = new mongoose.Schema(
        {
            srNo: {
                type: Number,
                required: true  
            },

            description: {
                type: String,
                required: true,
            },

            hsnCode: {
                type: String,
                required: true
            },

            qty: {
                type: Number,
                required: true,
                min: 1
            },

            rate: {
                type: Number,
                required: true,
                min: 0
            },

            amount: {
                type: Number
            }
        }
)

invoiceItemSchema.pre("validate",  function () {
    this.amount = parseFloat((this.qty * this.rate).toFixed(2));
})

const InvoiceSchema = new mongoose.Schema({
    from:{
        type:InfoSchema,
        required: true,
    },
    to:{
        type:InfoSchema,
        required:true,
    },
    Created_at:{
        type:Date,
        default:Date.now(),
        required:true,
    },
    Due_date:{
        type:Date,
        default:new Date().setDate(new Date().getDate()+10),
        required:true,
    },
    Bill_No : {type: Number, default: 0, required:true},
    items:{
        type:[invoiceItemSchema],
        required:true,
    },
    Sub_Total : {type: Number, default:0,required:true},
    CGST : {type: Number, default:0, required:true},
    SGST : {type: Number, default:0, required:true},
    GrandTotal : {type: Number, default:0, required:true},
    WordAmount : {type:String,default:""},
});

InvoiceSchema.pre('save', async function() {
    try{
        if(this.isNew){
            const count = await this.constructor.countDocuments();
            this.Bill_No = count + 1;
        }
        this.Sub_Total = this.items.reduce((total, item) => total + item.rate * item.qty, 0);
        const taxRate = 0.025;
        this.CGST = parseFloat((this.Sub_Total * taxRate).toFixed(2));
        this.SGST = parseFloat((this.Sub_Total * taxRate).toFixed(2));
        this.GrandTotal = parseFloat((this.Sub_Total + this.CGST + this.SGST).toFixed(2));
        this.WordAmount = toCurrency(this.GrandTotal);
    }catch(err){
        console.log(err);
    }
});

export default mongoose.model("InvoiceSchema", InvoiceSchema);