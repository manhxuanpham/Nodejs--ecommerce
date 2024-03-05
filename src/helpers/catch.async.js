
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

module.exports = {
    asyncHandler,
    catchAsync
}