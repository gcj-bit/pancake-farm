const fs = require("fs");
const cacheDir = fs.realpathSync(__dirname + "/../../cache/") + '/';
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

/**
 * 缓存数据记录
 * @type {{all(): *, set(*=, *=): *, get(*=): *, append(*=, *): *}}
 */
module.exports = {
    get(key) {
        return this._tryParse(cacheDir + key + '.json', {});
    },
    append(key, value) {
        let data = this.get(key);
        data = data ? Object.assign(data, value) : value;
        return this.set(key, data);
    },
    set(key, value) {
        this._writeJSON(cacheDir + key + '.json', value);
        return true;
    },
    exists(key){
        return fs.existsSync(cacheDir + key + '.json');
    },
    filepath(key){
        return cacheDir + key + '.json';
    },
    _tryParse: function (filePath, defaultValue = null) {
        var result;
        try {
            result = this._readJSON(filePath);
        } catch (ex) {
            result = defaultValue;
        }
        return result;
    },

    /**
     * Read json file synchronously using flatted
     *
     * @method readJSON
     * @param  {String} filePath Json filepath
     * @returns {*} parse result
     */
    _readJSON: function (filePath) {
        return JSON.parse(
            fs.readFileSync(filePath, {
                encoding: 'utf8',
            })
        );
    },

    /**
     * Write json file synchronously using circular-json
     *
     * @method writeJSON
     * @param  {String} filePath Json filepath
     * @param  {*} data Object to serialize
     */
    _writeJSON: function (filePath, data) {
        fs.writeFileSync(filePath, JSON.stringify(data));
    }
}