const jwt=require("jsonwebtoken")
const Authentication=async(req,res,next)=>{
    const token=req.headers?.authorization?.split(" ")[1];
    if(token && token.length>5){
        const decoded=jwt.verify(token,process.env.SECRET)
        if(decoded?.id.length>0){
            req.body.userid=decoded.id;
            next()
        }else{
            res.status(404).send({"msg":"token Exprired"})
        }
    }else{ 
        res.status(404).send({"msg":"User is not Authenticated",token})
    }
}

module.exports={Authentication}