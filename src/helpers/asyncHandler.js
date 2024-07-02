
const catchAsync =  fn => (req, res, next) => {
    return Promise
        .resolve(fn(req, res, next))
        .catch((err) => next(err));
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
      
    } 
}
const wrapAsync = fn => {
    return async(req,res,next)=> {
        try {
             await fn(req,res,next)
        } catch(error) {
            next(error)
        }
    }
}
module.exports = {
    asyncHandler,
    catchAsync
}
