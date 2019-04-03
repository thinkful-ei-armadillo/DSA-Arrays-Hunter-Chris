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

  console.log(Memory.get(0));
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
