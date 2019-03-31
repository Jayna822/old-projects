// Use this presets array inside your presetHandler
let presets = require('./presets');

// Complete this function:
const presetHandler = (requestType, index, newPresetArray) => {
    if (index < 0 || index > presets.length - 1) {
        return [404];
    }
    if (!['GET','PUT'].includes(requestType)) {
        return [400];
    }
    let result = [200];
    if (requestType === 'GET') {
        result.push(presets[index]);
    } else if (requestType === 'PUT') {
        presets = presets[index] = newPresetArray;
        result.push(presets);
    }
    return result;
};

// Leave this line so that your presetHandler function can be used elsewhere:
module.exports = presetHandler;
