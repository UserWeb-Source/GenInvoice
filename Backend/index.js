import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {connectionDB} from "./Database/database.js";
import Routes from "./Routes/Routes.js";
import verifyClient from "./Middleware/VerifyClient.js";
import dotenv from 'dotenv';
const app = express();
dotenv.config();

await connectionDB(process.env.MONGODB_URI);

app.use(cookieParser());
app.use(cors({
    origin: (origin, callback) => {
        // allow non-browser tools and same-origin requests
        if (!origin) return callback(null, true);

        const allowed = new Set([
            "http://localhost:5173",  // Vite dev
            "tauri://localhost",      // Tauri (desktop)
            "http://tauri.localhost", // some WebView variants
            "https://tauri.localhost"
        ]);

        return allowed.has(origin)
            ? callback(null, true)
            : callback(new Error("Not allowed by CORS: " + origin), false);
    },
    credentials: true,
}));


app.use(express.json());
app.use("/admin",Routes);
app.use("/invoice",Routes);
app.get('/', (req, res) => {
    res.send("Server");
})


app.get('/profile', verifyClient, (req, res) => {
    try{
        res.send({
            status: "success",
            id:req.userId,
        });
    }catch(err){
        res.status(401).send({
            success: false,
        })
    }
})

// eslint-disable-next-line no-undef
app.listen(process.env.SERVER_PORT, () => {
    console.log("Server running on port http://localhost:" + process.env.SERVER_PORT);
});