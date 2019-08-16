'use strict';

// const button = document.getElementById('ginger-click');

// function handleClick (event) {
//   console.log(event);
// }

// button.addEventListener('click', handleClick);

// button.addEventListener('click', function(event) {
//   console.log(event);
// })

// button.addEventListener('click', event => console.log(event));

// const sum = (a, b) => a + b;


const Dog = function (name) {
  this.name = name;
}

Dog.prototype.sayName = () => {
  console.log(`my name is ${this.name}`);
}

let ginger = new Dog('ginger');

console.log(ginger.name);

this.name = 'nicholas';

console.log(this);

ginger.sayName();
