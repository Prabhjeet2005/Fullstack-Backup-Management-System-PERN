const responseCreator = (message="Ok",data={})=>{
  return {success:true,message,data};
}

const errorCreator = (errMsg,errCode)=>{
  const err = new Error(errMsg);
  err.status = errCode || 501;
  throw err
}

const errorHandler = async(err,req,res,next)=>{
  const errCode = err.status || 501;
  res.status(errCode).send({success:false,message:err.message})
}

module.exports = {responseCreator,errorCreator,errorHandler}