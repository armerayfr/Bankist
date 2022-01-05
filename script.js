'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Armer Ray',
  movements: [4300, 500, 700, 50, 70, 100, 240, 500, -100, -50],
  interestRate: 1,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((movement, i) => {
    const type = movement > 0 ? 'deposit' : 'withdrawal';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${movement}€</div>
        </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const callDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySumary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov, i, arr) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  // interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;

  console.log(incomes);
  console.log(outcomes);
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ') // ['','','']
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  // Display movement
  displayMovements(acc.movements);
  // Display balance
  callDisplayBalance(acc);
  // Display summary
  calcDisplaySumary(acc);
};

// EVENT HANDLER
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display ui dan welcome message
    console.log('LOGIN');
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Clear input field
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  console.log(receiverAcc);
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // transfer to account
    receiverAcc.movements.push(amount);
    // withdrawal from account
    currentAccount.movements.push(-amount);
    // Update UI
    updateUI(currentAccount);
    console.log(currentAccount);
    console.log(receiverAcc);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  console.log(amount);

  const loanAccepted = currentAccount.movements.some(
    deposit => deposit > amount * 0.1
  );

  if (currentAccount && amount > 0 && loanAccepted) {
    // add positive number to receipt
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/* 
// simple array method

let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice(1, -2));
console.log(arr.slice(3, 5));
console.log(arr.slice());
console.log([...arr]);

// SPLICE
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

// REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];

console.log(arr2.reverse());
console.log(arr2);

// CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

// JOIN
console.log(letters.join(' - '));
*/

/* 
// New Method at()
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// getting last array element
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));
*/

/* 
// forEach Method for Array
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

movements.forEach((movement, idx, array) => {
  if (movement > 0) {
    console.log(`movement ${idx + 1} from ${array}: You deposited ${movement}`);
  } else {
    console.log(
      `movement ${idx + 1} from ${array}: You withdrew ${Math.abs(movement)}`
    );
  }
});
*/

/* 
// MAP
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

console.log(currencies);
currencies.forEach((value, key, map) => {
  console.log(`${key}: ${value}`);
});

console.log('---------SET---------');
// SET
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
currenciesUnique.forEach((value, _, map) => {
  console.log(`${_}: ${value}`);
});
*/

/* 
// CODING CHALLENGE
//  Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
const julia = {
  data1: [3, 5, 2, 12, 7],
  data2: [9, 16, 6, 8, 3],
};

const kate = {
  data1: [4, 1, 15, 8, 3],
  data2: [10, 5, 6, 1, 4],
};

const checkDogs = (julia, kate) => {
  julia.splice(0, 1) && julia.splice(-2);
  console.log(julia);
  const joinDatas = [...julia, ...kate];
  console.log(joinDatas);
  joinDatas.forEach((joinData, i) => {
    if (joinData >= 3) {
      console.log(
        `Dog number ${i + 1} is an adult, and is ${joinData} years old`
      );
    } else {
      console.log(
        `Dog number ${i + 1} is an puppy, and is ${joinData} years old`
      );
    }
  });
};

checkDogs(julia.data1, kate.data1);
*/

/* 
// Map method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUSD = 1.1;

const movementsUSD = movements.map(mov => mov * eurToUSD);

console.log(movements);
console.log(movementsUSD);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUSD);

console.log(movementsUSDfor);

const movementsDecriptions = movements.map(
  (mov, i) =>
    `movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

console.log(movementsDecriptions);
*/

/* 
const deposits = movements.filter(mov => mov > 0);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);

console.log(movements);
console.log(deposits);
console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);
const withdrawalsFor = [];

for (const mov of movements) if (mov < 0) withdrawalsFor.push(mov);

console.log(withdrawals);
console.log(withdrawalsFor);
*/

/* 
// Reduce Method

console.log(movements);

const balance = movements.reduce((acc, cur) => acc + cur, 0);

console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// Maximum value
const max = movements.reduce((acc, cur) => {
  if (acc > cur) {
    return acc;
  } else {
    return cur;
  }
}, movements[0]);
console.log(max);
*/

// Coding Challenge 1 & midodified to arrow and chain coding challenge 3

// Data 1: [5, 2, 4, 1, 15, 8, 3]
// Data 2: [16, 6, 10, 5, 6, 1, 4]

/* 
const calcAverageHumanAge = ages =>
  // after calculate humanAge AND filter 18+
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(ageHum => ageHum >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
// console.log(humanAges);
// Avg
// return humanAges.reduce((acc, cur) => acc + cur, 0) / humanAges.length;

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));
*/

/* 

// CHAINING METHODS
const eurToUSD = 1.1;
const totalDepositsUSD = movements
  .filter(mov => mov < 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUSD;
  })
  .reduce((acc, mov) => acc + mov, 0);

console.log(totalDepositsUSD);
*/

/* 
// Find Method
const firstWithdrawal = movements.find(mov => mov < 0);

console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/

/* 
// SOME
console.log(movements);
console.log(movements.includes(-130));

const anyDeposits = movements.some(mov => mov > 0);

console.log(anyDeposits);

// EVERY
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

/* 
// FLAT METHOD
const arr = [[1, 2, 3], [4, 5, 6], 7, 9];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 9];
console.log(arrDeep.flat(2));

// flat
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalBalance);

// flat map
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalBalance2);
*/

/* 

// Sorting
// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());

// Numbers
console.log(movements);

// return < 0, A, B
// return > 0, B, A
// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);

console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (a < b) return 1;
// });

movements.sort((a, b) => b - a);

console.log(movements);
*/

/* 
const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array([1, 2, 3, 4, 5, 6, 7]));

// Empity arrays + fill method
const x = new Array(7);
console.log(x);

// console.log(x.map(x => x + 5));

x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

// Random Dice in 100 length
const random = Array.from({ length: 100 }, () =>
  Math.trunc(Math.random() * 6 + 1)
);
console.log(random);

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );

  console.log(movementUI);
});
*/

/* 
// Array Practice
// 1.
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((dep, curr) => dep + curr);

console.log(bankDepositSum);

// 2. Berapa banyak simpanan yang ada di bank sedikitnya 1000
// solution 1
// const depositMin1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;

// console.log(depositMin1000);

// solution 2
const depositMin1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(depositMin1000);

// Prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

// 3
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// With array
const sumsArr = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums[0] += cur) : (sums[1] += cur);
      sums[cur > 0 ? 0 : 1] += cur;
      return sums;
    },
    [0, 0]
  );

console.log(sumsArr);

// 4
// this is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const expections = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (expections.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

const testMap = word => {
  word.forEach(str => console.log(str));
};

testMap(['ini', 'adalah', 'bagian', 'test', 'ya']);
*/

/* */
// Coding Challenge
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//1. calculate recommended food
dogs.forEach(dog => (dog.recommededFood = Math.trunc(dog.weight ** 0.75 * 28)));

console.log(dogs);

// find Sarah's dog
// solution 1
// const sarahDogs = dogs.find(dog => dog.owners[dog.owners.indexOf('Sarah')]);

// solution 2
const sarahDogs = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(sarahDogs);

// 3
// solution 1
console.log(
  `Sarah's dog is eating too ${
    sarahDogs.curFood > sarahDogs.recommededFood ? 'much' : 'little'
  }`
);

// solution 2
if (sarahDogs.curFood > sarahDogs.recommededFood * 1.1) {
  console.log('is too much');
} else if (sarahDogs.curFood < sarahDogs.recommededFood * 0.9) {
  console.log('is too little');
} else {
  console.log('its okay');
}

// 3. array containing dogs
let ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommededFood)
  .flatMap(owner => owner.owners);

let ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommededFood)
  .flatMap(owner => owner.owners);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// Load to console.string
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too little!`);

//  is any dog eating exactly the amount of food that is recommended (just true or false)
const isExactlyFood = dogs.some(dog => dog.curFood === dog.recommededFood);

console.log(isExactlyFood);

// Log to the console whether there is any dog eating an okay amount of food

const conditionOkay = dog =>
  dog.curFood > dog.recommededFood * 0.9 &&
  dog.curFood < dog.recommededFood * 1.1;

const isOkayFood = dogs.some(conditionOkay);

console.log(isOkayFood);

// Create an array containing the dogs that are eating an okay amount of food
const isOkayFoodArr = dogs.filter(conditionOkay);

console.log(isOkayFoodArr);

// Create a shallow copy of the 'dogs' array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects �)

console.log(dogs);
const ascRecommededFood = dogs
  .slice()
  .sort((a, b) => a.recommededFood - b.recommededFood);

console.log(ascRecommededFood);
