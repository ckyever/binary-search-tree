import { Node } from "./Node.js";
import { Queue } from "./Queue.js";

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
    if (array == null || array.length === 0) {
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
      if (value < currentNode.data) {
        parentNode = currentNode;
        currentNode = currentNode.leftChild;
      } else {
        parentNode = currentNode;
        currentNode = currentNode.rightChild;
      }
      if (currentNode == null) {
        // Value doesn't exist in the tree
        break;
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

  find(value) {
    let node = this.recursiveFind(this.root, value);
    return node;
  }

  recursiveFind(node, value) {
    // Found the node
    if (node.data == value) {
      return node;
    }

    // No more nodes to search
    if (node.leftChild == null && node.rightChild == null) {
      return null;
    }

    // Go down the corresponding subtree
    if (value < node.data) {
      return this.recursiveFind(node.leftChild, value);
    } else {
      return this.recursiveFind(node.rightChild, value);
    }
  }

  levelOrderForEach(callback) {
    if (callback == null) {
      throw new Error("You must pass a callback");
    }
    const queue = new Queue();
    queue.enqueue(this.root);

    let currentNode;
    while ((currentNode = queue.dequeue())) {
      callback(currentNode);
      if (currentNode.leftChild != null) {
        queue.enqueue(currentNode.leftChild);
      }
      if (currentNode.rightChild != null) {
        queue.enqueue(currentNode.rightChild);
      }
    }
  }

  inOrderForEach(callback) {
    this.#recursiveInOrderForEach(callback, this.root);
  }

  #recursiveInOrderForEach(callback, node) {
    if (node == null) {
      return;
    }

    this.#recursiveInOrderForEach(callback, node.leftChild);
    callback(node);
    this.#recursiveInOrderForEach(callback, node.rightChild);
  }

  preOrderForEach(callback) {
    this.#recursivePreOrderForEach(callback, this.root);
  }

  #recursivePreOrderForEach(callback, node) {
    if (node == null) {
      return;
    }

    callback(node);
    this.#recursivePreOrderForEach(callback, node.leftChild);
    this.#recursivePreOrderForEach(callback, node.rightChild);
  }

  postOrderForEach(callback) {
    this.#recursivePostOrderForEach(callback, this.root);
  }

  #recursivePostOrderForEach(callback, node) {
    if (node == null) {
      return;
    }

    this.#recursivePostOrderForEach(callback, node.leftChild);
    this.#recursivePostOrderForEach(callback, node.rightChild);
    callback(node);
  }

  height(value) {
    let height = null;
    this.preOrderForEach((node) => {
      if (node.data == value) {
        height = this.#recursiveHeight(node);
      }
    });

    return height;
  }

  #recursiveHeight(node) {
    if (node == null) {
      return -1; // Start at -1 from null child so the previous node is treated as 0
    }
    return (
      1 +
      Math.max(
        this.#recursiveHeight(node.leftChild),
        this.#recursiveHeight(node.rightChild)
      )
    );
  }

  depth(value) {
    // Call recursive depth on root
    return this.#recursiveDepth(this.root, value);
  }

  #recursiveDepth(node, value) {
    if (node === null) {
      return null;
    }
    if (node.data === value) {
      return 0;
    }

    const leftDepth = this.#recursiveDepth(node.leftChild, value);
    const rightDepth = this.#recursiveDepth(node.rightChild, value);

    // Ensure this equals which ever value is not null
    // If both are null then the value does not exist in this subtree
    const actualDepth = leftDepth ?? rightDepth;

    return actualDepth == null ? null : actualDepth + 1;
  }

  isBalanced() {
    let allNodesBalanced = true;

    this.postOrderForEach((node) => {
      const leftHeight = this.#recursiveHeight(node.leftChild);
      const rightHeight = this.#recursiveHeight(node.rightChild);

      if (Math.abs(leftHeight - rightHeight) > 1) {
        // We've found one node that is not balanced hence all of the tree is not balanced
        allNodesBalanced = allNodesBalanced && false;
      }
    });

    return allNodesBalanced;
  }

  rebalance() {
    const sortedArray = [];
    this.inOrderForEach((node) => {
      sortedArray.push(node.data);
    });
    this.root = this.buildTreeWithRecursion(
      sortedArray,
      0,
      sortedArray.length - 1
    );
  }
}
