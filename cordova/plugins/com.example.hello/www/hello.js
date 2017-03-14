/*global cordova, module*/

module.exports = {
    setBrightness: function (value, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "Hello", "setBrightness", [value]);
    }
};
