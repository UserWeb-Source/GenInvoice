import jwt from 'jsonwebtoken';

export default function verifyClient(req, res, next){
        const token = req.cookies.access_token;
        try{
            jwt.verify(token, process.env.CLIENT_SECRET, (err, decoded) => {
                if (err) {
                    res.status(401).send({
                        status: err.status,
                        message: err.message,
                    })
                }
                req.userId = decoded;
                next();
            })
        }catch(err){
            console.log(err);
        }
}