Function.prototype.bindThis = function(that) {
    return (...args) => this.apply(that, args);
}

const logThisName = function (arg, arg1) {console.log(this.name, arg, arg1)};

const b1 = logThisName.bindThis({name: 'b1'});

b1('arg', 'arg1');
