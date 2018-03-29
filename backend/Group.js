"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Group = (function () {
    function Group() {
        this.header1 = '';
        this.header2 = '';
    }
    Group.prototype.setHeaders = function (groupEval, groupValue) {
        var that = this;
        that.header1 = groupValue;
        that.header2 = groupEval + 'pokedexId';
    };
    return Group;
}());
exports.default = Group;
//# sourceMappingURL=Group.js.map