let a = 5;
console.log(a*2);

// Function Expression
const takeOrder = () => {
  console.log('Order: pizza')
}

takeOrder()

const takeOrder = (topping) => {
  console.log('Order: pizza topped with ' + topping);
};

takeOrder('pepperoni');

// Function Declaration
function isGreaterThan (numberOne, numberTwo) {
  if (numberOne > numberTwo) {return true;}
  else {return false;}
}

isGreaterThan(3,4);

// Arrow Function
const volumeOfSphere = diameter => (1/6) * Math.PI * diameter * diameter * diameter;

let vacationSpots = ['1','2','3'];

for (let vacationSpotIndex = vacationSpots.length-1; vacationSpotIndex >= 0; vacationSpotIndex--) {
  console.log('I would love to visit ' + vacationSpots[vacationSpotIndex]);
}

// .forEach() Iterator
let groceries = ['whole wheat flour', 'brown sugar', 'salt', 'cranberries', 'walnuts'];

groceries.forEach(function(groceryItem) {
  console.log(' - ' + groceryItem);
});
fruits.forEach(fruit => console.log('I want to eat a ' + fruit));

// .map() Iterator
let numbers = [1, 2, 3, 4, 5];
let bigNumbers = numbers.map(function(number) {
  return number * 10;
});

// .filter() Iterator
let words = ['chair', 'music', 'pillow', 'brick', 'pen', 'door'];
let shortWords = words.filter(function(word) {
  return word.length < 6;
});

// Object
let restaurant = {
  name: 'Italian Bistro',
  seatingCapacity: 120,
  hasDineInSpecial: true,
  entrees: ['Penne alla Bolognese', 'Chicken Cacciatore', 'Linguine Pesto'],
  sayHello() {return 'Hi my name is ' + this.name}
};

// Getters and Setters
let person = {
  _name: 'Lu Xun',
  _age: 137,
 set age(myAge) {
  if (typeof myAge === 'number') {
    this._age = myAge;
  }
   else {
     return 'Invalid input';
   }
},
  get age() {
  console.log(this._name + ' is ' + this._age + ' years old.');
}
};

person.age = 10;
console.log(person.age);

// Classes
class Surgeon {
  constructor(name, department){
    this._name = name;
    this._department = department;
  }
}
const surgeonCurry = new Surgeon('Curry', 'Cardiovascular');
const surgeonDurant = new Surgeon('Durant', 'Orthopedics');

// Inheritance
class HospitalEmployee {
  constructor(name) {
    this._name = name;
    this._remainingVacationDays = 20;
  }

  get name() {
    return this._name;
  }

  get remainingVacationDays() {
    return this._remainingVacationDays;
  }

  takeVacationDays(daysOff) {
    this._remainingVacationDays -= daysOff;
  }
}

class Nurse extends HospitalEmployee {
  constructor(name, certifications) {
    super(name);
    this._certifications = certifications;
  }
}
const nurseOlynyk = new Nurse('Olynyk', ['Trauma', 'Pediatrics']);

// Static Methods
class Animal {
  constructor(name) {
    this._name = name;
    this._behavior = 0;
  }

  static generateName() {
    const names = ['Angel', 'Spike', 'Buffy', 'Willow', 'Tara'];
    const randomNumber = Math.floor(Math.random()*5);
    return names[randomNumber];
  }
}

// Modules
const Menu = require('./menu.js');

function placeOrder() {
  console.log('My order is: ' + Menu.specialty);
}

placeOrder();

// Modules II
let Airplane = {};

module.exports = {
  myAirplane: "CloudJet",
  displayAirplane: function() {
    return this.myAirplane;
  }
};

// Modules III
export default meetsSpeedRangeRequirements;
export {availableAirplanes as aircrafts,
     flightRequirements as flightReqs,
      meetsStaffRequirements as meetsStaffReqs,
       meetsSpeedRangeRequirements as meetsSpeedRangeReqs};

// Modules IV
import { specialty, isVegetarian } from './menu';
console.log(specialty);

// Create package.json
$ npm init

// Install babel
$ npm install babel-cli -D
$ npm install babel-preset-env -D
