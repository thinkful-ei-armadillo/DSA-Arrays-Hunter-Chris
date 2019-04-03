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
  console.log(arr);

  arr.push(5);
  arr.push(15);
  arr.push(19);
  arr.push(45);
  arr.push(10);
  console.log(Memory.get(0));

  arr.pop();
  arr.pop();
  arr.pop();
  console.log(arr);
  console.log(Memory.get(2));
}

main();

// function sort(arr, i = 0, idx = 0, count = 0) {
//   if (count === arr.length - 1) {
//     return '';
//   }
//   if (idx === arr.length) {
//     return sort(arr, i + 1, idx - idx, count);
//   } else if (arr[idx] === i) {
//     return i + sort(arr, i, idx + 1, count + 1);
//   } else {
//     return sort(arr, i, idx + 1, count);
//   }
// }

// console.log(sort([1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0]));
