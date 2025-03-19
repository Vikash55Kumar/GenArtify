import jwt from 'jsonwebtoken'



// const userAuth = async(req, res, next) => {
//     const token = req.headers.authorization;
//     console.log(token);
    
//     if(!token) {
//         return res.json({success: false, message: "Not Authorized user. Login again"})
//     }

//     try {
//         const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

//         if(tokenDecode.id) {
//             req.body.userId = tokenDecode.id;
//         } else {
//             return res.json({success: false, message: "Not Authorized user. Login again"})
//         }

//         next();
//     } catch (error) {
//         return res.json({success: false, message: error.message})
        
//     }
// }

const userAuth = async (req, res, next) => {
    const token = req.headers.authorization;
    

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No Token Provided" });
    }

    const tokenValue = token.split(" ")[1]; 
    // console.log("Extracted Token:", tokenValue);

    try {
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid Token" });
    }
};


export default userAuth;