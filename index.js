/**
 * Created by jguang on 2016/11/1.
 * swig tag extend
 */

const path = require('path');


exports.compile = function (compiler, args, content, parents, options, blockName) {
    // var ss = require(args[2]);
    // console.log(options.filename);
    try{
        var configFile = args[2].replace(/\"/gi, "");
        var configFilePath = path.normalize(configFile);
        var dirPath = path.dirname(options.filename);
        var configPath = path.resolve(dirPath, configFilePath);
        var config = require(configPath);
        args[2] = JSON.stringify(config);
        return args.join(' ') + ';\n';
    }catch (e){
        return "";
    }
};

exports.parse = function (str, line, parser, types, stack, options, swig) {

    var nameSet = '',
        propertyName;

    parser.on(types.VAR, function (token) {
        if (propertyName) {
            // Tell the parser where to find the variable
            propertyName += '_ctx.' + token.match;
            return;
        }

        if (!parser.out.length) {
            nameSet += token.match;
            return;
        }

        return true;
    });

    parser.on(types.BRACKETOPEN, function (token) {
        if (!propertyName && !this.out.length) {
            propertyName = token.match;
            return;
        }

        return true;
    });

    parser.on(types.STRING, function (token) {
        if (propertyName && !this.out.length) {
            propertyName += token.match;
            return;
        }

        return true;
    });

    parser.on(types.BRACKETCLOSE, function (token) {
        if (propertyName && !this.out.length) {
            nameSet += propertyName + token.match;
            propertyName = undefined;
            return;
        }

        return true;
    });

    parser.on(types.DOTKEY, function (token) {
        if (!propertyName && !nameSet) {
            return true;
        }
        nameSet += '.' + token.match;
        return;
    });

    parser.on(types.ASSIGNMENT, function (token) {
        if (this.out.length || !nameSet) {
            throw new Error('Unexpected assignment "' + token.match + '" on line ' + line + '.');
        }

        this.out.push(
            // Prevent the set from spilling into global scope
            '_ctx.' + nameSet
        );
        this.out.push(token.match);
        this.filterApplyIdx.push(this.out.length);
    });

    return true;
};

exports.block = true;