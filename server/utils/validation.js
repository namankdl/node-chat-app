var isRealString = (str) => {
    var checkstring = str.trim();
    if(checkstring.length === 0)
    {
        return false;
    }

    return true;
};

module.exports = {isRealString};