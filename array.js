'use strict';

const memory = require('./memory');

let Memory = new memory();

class Array {
  constructor() {
    this.length = 0;
    this.capacity = 0;
    this.ptr = Memory.allocate(this.length);
  }

  push(value) {
    if (this.length >= this.capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }
    Memory.set(this.ptr + this.length, value);
    this.length++;
  }

  _resize(size) {
    const oldPtr = this.ptr;
    this.ptr = Memory.allocate(size);
    if (this.ptr === null) {
      throw new Error('Out of Memory');
    }
    Memory.copy(this.ptr, oldPtr, this.length);
    Memory.free(oldPtr);
    this.capacity = size;
  }

  get(index) {
    if (index < 0 || index >= this.length) {
      throw new Error('Index error');
    }
    return Memory.get(this.ptr + index);
  }

  pop() {
    if (this.length === 0) {
      throw new Error('Index error');
    }
    const value = Memory.get(this.ptr + this.length - 1);
    this.length--;
    return value;
  }

  insert(index, value) {
    if (index < 0 || index >= this.length) {
      throw new Error('Index error');
    }

    if (this.length >= this.capacity) {
      this._resize((this.length + 1) * Array.SIZE_RATIO);
    }

    Memory.copy(this.ptr + index + 1, this.ptr + index, this.length - index);
    Memory.set((this.ptr = index), value);
    this.length++;
  }

  remove(index) {
    if (index < 0 || index >= this.length) {
      throw new Error('Index error');
    }
    Memory.copy(
      this.ptr + index,
      this.ptr + index + 1,
      this.length - index - 1
    );
    this.length--;
  }
}

Array.SIZE_RATIO = 3;

function main() {
  Array.SIZE_RATIO = 3;
  let arr = new Array();

  arr.push(3);
  // console.log(arr);

  arr.push(5);
  arr.push(15);
  arr.push(19);
  arr.push(45);
  arr.push(10);

  arr.pop();
  arr.pop();
  arr.pop();
  // console.log(arr);

  // console.log(Memory.get(0));
}

main();

// 2. Array { length: 1, capacity: 3, ptr: 0 }
//  Array { length: 6, capacity: 12, ptr: 3 }
//  Memory capacity capacity was exceeded after 6 pushes, increased with
// _resize, and the pointer moved to three because all of the array was
// to that postion.

// 3. Array { length: 6, capacity: 12, ptr: 3 }
// Removing items from the end of the array does not change the capacity, but
// will reduce the length by 3.  Since the array was not copied to another
// space, the pointer won't move.

// 4. 3
// Nan because the array is set up to only take floats
// _resize() adds capacity to the array when the limit has been reached.

//5.
const urlify = string => {
  let newStr = '';
  for (let i = 0; i < string.length; i++) {
    const element = string[i];
    if (element === ' ') {
      newStr += '%20';
    } else {
      newStr += element;
    }
  }
  return newStr;
};

// console.log(urlify('h e l l o'));

//6.
const filter = arr => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < 5) {
      arr.splice(i, 1);
      i--;
    }
  }
  return arr;
};

// console.log(filter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));

//7.
function largestSum(arr) {
  let biggestNum = 0;
  let currentNum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (currentNum > biggestNum) {
      biggestNum = currentNum;
    }
    currentNum += arr[i];
  }
  return biggestNum;
}

// console.log(largestSum([8, 6, -7, 5, -2, 1]));

//8.
function sortAndCombine(arr1, arr2) {
  function sorter(a, b) {
    return a - b;
  }
  let combinedArr = arr1.concat(arr2);
  let sortedArr = combinedArr.sort(sorter);
  return sortedArr;
}

// console.log(sortAndCombine([1, 3, 6, 8, 11], [2, 3, 5, 8, 9, 10]));

//9.
function noVowels(str, vowels, sI = 0) {
  if (sI === str.length) {
    return '';
  }
  for (let i = 0; i < str.length; i++) {
    for (let i = 0; i < vowels.length; i++) {
      if (str[sI] === vowels[i]) {
        return '' + noVowels(str, vowels, sI + 1);
      }
    }
    return str[sI] + noVowels(str, vowels, sI + 1);
  }
}

// console.log(noVowels('Battle of the Vowels: Hawaii vs. Grozny', 'aeiou'));

//10.
function products(arr, i = 0) {
  if (i === arr.length) {
    return '';
  }
  let tempArr = [];
  for (let idx = 0; idx < arr.length; idx++) {
    if (arr[i] === arr[idx]) {
      idx + 1;
    } else {
      tempArr.push(arr[idx]);
    }
  }
  let product = 1;
  for (let idx = 0; idx < arr.length - 1; idx++) {
    product = product * tempArr[idx];
  }
  return product + ' ' + products(arr, i + 1);
}

console.log(products([1, 2, 3, 4]));

function product(arr){
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    let product = 1;
    for (let j = 0; j < arr.length; j++) {
      const element = arr[j];
      if(arr[i] !== arr[j]){
        product *= element;
      }
    }
    newArr.push(product); 
  }
  return newArr;
}