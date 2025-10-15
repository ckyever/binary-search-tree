import { Tree } from "./Tree.js";

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node === null) {
    return;
  }
  if (node.rightChild !== null) {
    prettyPrint(node.rightChild, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.leftChild !== null) {
    prettyPrint(node.leftChild, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function createRandomIntegerArray(length) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(Math.floor(Math.random() * 1000));
  }
  return array;
}

function testBalance(bst) {
  console.log(bst.isBalanced() ? "Is Balanced" : "Is NOT Balanced");
}

function testTraversal(bst) {
  let inOrderArray = [];
  bst.inOrderForEach((node) => inOrderArray.push(node.data));
  console.log(inOrderArray);

  let preOrderArray = [];
  bst.preOrderForEach((node) => preOrderArray.push(node.data));
  console.log(preOrderArray);

  let postOrderArray = [];
  bst.postOrderForEach((node) => postOrderArray.push(node.data));
  console.log(postOrderArray);
}

// Create and test initial BST
const unsortedArray = createRandomIntegerArray(50);
const bst = new Tree(unsortedArray);
prettyPrint(bst.root);
testBalance(bst);
testTraversal(bst);

// Unbalance BST
function unBalanceTree(tree, numberOfIntegers) {
  for (let i = 0; i < numberOfIntegers; i++) {
    tree.insert(Math.floor(Math.random() * 1000));
  }
}
unBalanceTree(bst, 200);
prettyPrint(bst.root);
testBalance(bst);

// Rebalance BST
bst.rebalance();
prettyPrint(bst.root);
testBalance(bst);
testTraversal(bst);
