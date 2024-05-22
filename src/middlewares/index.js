const Logger = require('../logger/discordv2.log')

const pushLogToDiscord = async(req,res,next) => {
    try {

        Logger.sendToFormatCode({
            title:`Method:${req.method}`,
            code:req.method == 'GET' ? req.query:req.body,
            message:`${req.get('host')}${req.originalUrl}`
        })
        return next()   
    } catch (error) {
        next(error)
    }
}
module.exports = {
    pushLogToDiscord
}