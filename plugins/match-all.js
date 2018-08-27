const matchAll = (str, regex) => {
    const matches = [];
    
    while (true) {
        const match = regex.exec(str);
        if (match) {
            matches.push(match);
        } else {
            break;
        }
    }

    return matches;
};

module.exports = matchAll;
