import { Node } from "./Node.js";

export class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  #mergeSortRemoveDuplicates(array) {
    if (array.length === 1) {
      return array;
    }

    const midPoint = Math.floor(array.length / 2);
    const left = array.slice(0, midPoint);
    const right = array.slice(midPoint, array.length);

    const sortedLeft = this.#mergeSortRemoveDuplicates(left);
    const sortedRight = this.#mergeSortRemoveDuplicates(right);
    return this.#mergeSortedArrays(sortedLeft, sortedRight);
  }

  #mergeSortedArrays(left, right) {
    const mergedArray = [];

    while (left.length > 0 && right.length > 0) {
      if (left[0] === right[0]) {
        // Ignore duplicates
        left.shift();
      } else if (left[0] < right[0]) {
        mergedArray.push(left.shift());
      } else {
        mergedArray.push(right.shift());
      }
    }

    return [...mergedArray, ...left, ...right];
  }

  buildTree(array) {
    // If array is empty return null
    if (array.length === 0) {
      return null;
    }

    const sortedArray = this.#mergeSortRemoveDuplicates(array);

    return this.buildTreeWithRecursion(sortedArray, 0, sortedArray.length - 1);
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

  insert(value) {
    // If root is null add value as new node in root
    if (this.root == null) {
      this.root = new Node(null, value, null);
    } else {
      this.insertRecursively(value, this.root);
    }
  }

  insertRecursively(value, currentNode) {
    if (value < currentNode.data) {
      if (currentNode.leftChild == null) {
        currentNode.leftChild = new Node(null, value, null);
      } else {
        this.insertRecursively(value, currentNode.leftChild);
      }
    } else {
      if (currentNode.rightChild == null) {
        currentNode.rightChild = new Node(null, value, null);
      } else {
        this.insertRecursively(value, currentNode.rightChild);
      }
    }
  }
}
