const Interface = function (name, methods) {
  if (arguments.length != 2) {
    throw new Error('the interface length is bigger than 2')
  }
  this.Name = name
  this.Method = []
  for (var i = 0; i < methods.length; i++) {
    if (typeof methods[i] !== 'string') {
      throw new Error('the method name is not string')
    }
    this.Method.push(methods[i])
  }
}
/*static method in interface*/
Interface.ensureImplement = function (object) {
  if (arguments.length < 2) {
    throw new Error('there is not Interface or the instance')
  }

  for (var i = 1; i < arguments.length; i++) {
    var interface1 = arguments[i]
    if (interface1.constructor !== Interface) {
      throw new Error('the argument is not interface')
    }
    for (var j = 0; j < interface1.Method.length; j++) {
      var method = interface1.Method[j]
      if (!object[method] || typeof object[method] !== 'function') {
        throw new Error("you instance doesn't implement the interface")
      }
    }
  }
}

export default Interface
