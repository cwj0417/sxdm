Function.prototype.applyThis = function(that, args) {
    that._fn = this
    that._fn(...args);
    delete that._fn;
}

const logThisName = function (arg, arg1) {console.log(this.name, arg, arg1)};

logThisName.applyThis({name: 'b1'}, ['arg', 'arg1']);
