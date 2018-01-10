
module.exports.isRealString = function (str) {
    return typeof str === 'string' && str.trim().length > 0 && isNaN(str.charAt(0));
};

