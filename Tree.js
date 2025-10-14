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

  deleteItem(value) {
    let { parentNode, nodeToDelete } = this.#getNodesForDelete(value);
    if (nodeToDelete == null) {
      // Value doesn't exist in tree
      return;
    }

    // It is a leaf node
    if (nodeToDelete.leftChild == null && nodeToDelete.rightChild == null) {
      if (parentNode == null) {
        // We must be deleting the root node
        this.root = null;
        return;
      } else {
        if (value < parentNode.data) {
          parentNode.leftChild = null;
        } else {
          parentNode.rightChild = null;
        }
      }
    }

    // It has a single child
    else if (
      (nodeToDelete.leftChild == null && nodeToDelete.rightChild != null) ||
      (nodeToDelete.leftChild != null && nodeToDelete.rightChild == null)
    ) {
      if (value < parentNode.data) {
        parentNode.leftChild =
          nodeToDelete.leftChild ?? nodeToDelete.rightChild;
      } else {
        parentNode.rightChild =
          nodeToDelete.leftChild ?? nodeToDelete.rightChild;
      }
    }

    // It has more than a single child
    else {
      const nextBiggestValue = this.#getNextBiggestValue(nodeToDelete);
      // Recursively delete this node
      this.deleteItem(nextBiggestValue);
      // Replace node to delete with this value
      nodeToDelete.data = nextBiggestValue;
    }
  }

  #getNodesForDelete(value) {
    let parentNode = null;
    let currentNode = this.root;

    while (currentNode.data !== value) {
      if (currentNode == null) {
        // Value doesn't exist in the tree
        break;
      }
      if (value < currentNode.data) {
        parentNode = currentNode;
        currentNode = currentNode.leftChild;
      } else {
        parentNode = currentNode;
        currentNode = currentNode.rightChild;
      }
    }
    return { parentNode, nodeToDelete: currentNode };
  }

  #getNextBiggestValue(node) {
    // Next biggest node will always be on the right of the original node
    let currentNode = node.rightChild;

    // Next biggest node will be the left most one
    while (currentNode != null) {
      if (currentNode.leftChild == null) {
        break;
      }
      currentNode = currentNode.leftChild;
    }
    return currentNode.data;
  }
}
