export class Queue {
  #array;
  constructor() {
    this.#array = [];
  }

  enqueue(item) {
    this.#array.push(item);
  }

  dequeue() {
    return this.#array.shift();
  }
}
