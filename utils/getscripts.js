const fs = require('fs');

function getScript(filePath){
    try{
        const data = fs.readFileSync(filePath);
        return data.toString();
    }catch(err){
        console.error("Error reading script file:", err);
        throw err;
    }
}

module.exports = {
    getScript,
};