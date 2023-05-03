module.exports.formatResponseUtil = (status, jsonObject, callback) => {
    callback(status, 'application/json', jsonObject)
}