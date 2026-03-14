import UserSchema from "../Model/UserSchema.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

// Client Authentication
export async function SignUp(req, res) {
    const {username, email, password} = req.body;
    try {
            const Client = await UserSchema.findOne({email});

            if (!Client) {
                return res.status(400).send({
                    message: "Email Not Exist",
                })
            }
            // Client Validation
            if(username === "" || username !== process.env.CLIENT_NAME){
                return res.status(400).send({
                    error: "Username Invalid",
                })
            }

            if(password === "" || password !== process.env.CLIENT_PSW){
                return res.status(400).send({
                    error: "Password Invalid",
                })
            }

            const token = jwt.sign(
                {id:Client._id},
                process.env.CLIENT_SECRET,
                    {expiresIn: "15m"}
            )

            res.cookie("access_token", token, {
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                maxAge: 15 * 60 * 1000,
            });

            res.json({
                success: true,
                message: "SignUp successfully",
            })
    }catch(err){
        res.status(400).send({
            error: err,
        })
    }
}

export async function LogOut(req, res) {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        });

        res.json({
            success: true,
            message: "Log Out successfully",
        });
    } catch (err) {
        res.status(400).send({
            error: err,
        });
    }
}


