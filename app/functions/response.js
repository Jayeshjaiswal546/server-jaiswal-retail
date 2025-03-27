exports.successResponse = (res,statusCode,message) =>{
    console.log("Request responded with SUCCESS");
    res.send({
        "status":statusCode,
        "message":message
    })
}

exports.successResponseWithData = (res,statusCode,message,data) =>{
    console.log("Request responded with SUCCESS");
    res.send({
        "status":statusCode,
        "message":message,
        "data":data
    })
}

exports.failResponse = (res,statusCode,message) =>{
    console.log("Request responded with ERROR");
    res.send({
        "status":statusCode,
        "message":message
    })
}