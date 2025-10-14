import { Node } from "./Node.js";

export class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  buildTree(array) {
    // If array is empty return null
    if (array.length === 0) {
      return null;
    }

    return this.buildTreeWithRecursion(array, 0, array.length - 1);
  }

  buildTreeWithRecursion(array, startIndex, endIndex) {
    if (startIndex > endIndex) {
      return null;
    }
    const midpoint = startIndex + Math.floor((endIndex - startIndex) / 2);
    const leftChild = this.buildTreeWithRecursion(
      array,
      startIndex,
      midpoint - 1
    );
    const rightChild = this.buildTreeWithRecursion(
      array,
      midpoint + 1,
      endIndex
    );
    return new Node(leftChild, array[midpoint], rightChild);
  }
}
