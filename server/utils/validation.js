var isRealString = (str) => {
    str = str.trim();
    if(str.length === 0)
    {
        return false;
    }

    return true;
};

module.exports = {isRealString};