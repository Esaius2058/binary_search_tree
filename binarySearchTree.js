/* eslint-disable no-undef */
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  buildTree = (arr) => {
    let sortedArr = this.removeDuplicates(this.mergeSort(arr));

    let root = this.buildBalancedBST(sortedArr, 0, sortedArr.length - 1);
    return root;
  };

  merge = (left, right) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  };

  mergeSort = (arr) => {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return this.merge(this.mergeSort(left), this.mergeSort(right));
  };

  removeDuplicates = (arr) => {
    return [...new Set(arr)];
  };

  buildBalancedBST = (sortedArr, start, end) => {
    if (start > end) {
      return null;
    }

    let mid = Math.floor((end + start) / 2);

    //Create a new node with the middle element as the value
    let root = new Node(sortedArr[mid]);

    // Recursively build left and right subtrees
    root.left = this.buildBalancedBST(sortedArr, start, mid - 1);
    root.right = this.buildBalancedBST(sortedArr, mid + 1, end);

    return root;
  };

  prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  insert = (value, root) => {
    if (root === null) {
      return new Node(value);
    }

    // If the value is already present in the tree, return the node
    if (root.data == value) {
      return root;
    }

    // Otherwise, recur down the tree
    if (value < root.data) {
      root.left = this.insert(value, root.left);
    } else {
      root.right = this.insert(value, root.right);
    }

    return root;
  };

  delete = (root, value) => {
    if (root == null) {
      return root;
    }

    // If key to be searched is in a subtree
    if (root.value > value) {
      root.left = delete (root.left, value);
    } else if (root.value < value) {
      root.right = delete (root.right, value);
    } else {
      // If root matches with the given key

      // Cases when root has 0 children or only right/left child
      if (root.left == null) {
        return root.right;
      }

      if (root.right == null) {
        return root.left;
      }

      //When both children are present
      let succ = getSuccessor(root);
      root.value = succ.value;
      root.right = del(root.right, succ.value);
    }
    return root;
  };

  // finds the smallest node in the right subtree
  getSuccessor = (curr) => {
    curr = curr.right;
    while (curr != null && curr.left != null) {
      curr = curr.left;
    }

    return curr;
  };

  find = (value, root) => {
    let curr = root;
    while (curr != null) {
      if (curr.value == value) {
        return curr;
      }

      if (curr.value < value) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }

    return null;
  };

  levelOrder = (root, callback) => {
    if (typeof callback !== "function") {
      throw new Error(
        "A callback function is required for level order traversal"
      );
    }

    if (root == null) {
      return;
    }

    let queue = [root];

    console.log("Level order recursion: ");
    while (queue.length > 0) {
      let curr = queue.shift();
      callback(curr);
      if (curr.left != null) {
        queue.push(curr.left);
      }

      if (curr.right != null) {
        queue.push(curr.right);
      }
    }
  };

  //left, root, right
  inOrder = (root, callback) => {
    if (root == null) {
      return root;
    }

    this.inOrder(root.left, callback);
    console.log(root.value);
    this.inOrder(root.right, callback);
  };

  //root, left, right
  preOrder = (root, callback) => {
    if (root == null) {
      return root;
    }

    console.log(root.value);
    this.preOrder(root.left, callback);
    this.preOrder(root.right, callback);
  };

  //right, left, root
  postOrder = (root, callback) => {
    if (root == null) {
      return root;
    }

    this.preOrder(root.right, callback);
    this.preOrder(root.left, callback);
    console.log(root.value);
  };

  height = (root) => {
    //Height is defined as the number of edges in the longest
    //path from a given node to a leaf node
    if (root == null) {
      return-1;
    }

    let leftHeight = this.height(root.left);
    let rightHeight = this.height(root.right);

    return Math.max(leftHeight, rightHeight) + 1;
  };

  //  Depth is defined as the number of edges in the path 
  //from a given node to the tree’s root node
  depth = (node, currNode, currDepth) => {
    if (currNode == null) {
        return -1; // Node not found
    }

    if (currNode === node) {
        return currDepth; // Found the node
    }

    // Search the left subtree
    let leftDepth = depth(node, currNode.left, currentDepth + 1);
    if (leftDepth !== -1) {
        return leftDepth; // Node found in the left subtree
    }

    // Search the right subtree
    return depth(node, currNode.right, currDepth + 1);
  }

  isBalanced = (node) => {
    if (node === null) {
        return true;
    }

    // Get the height of the left and right subtrees
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);

    // Check if the current node is balanced and recurse for its children
    return (
      Math.abs(leftHeight - rightHeight) <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    );
  };

  rebalance = (root) => {
    const sortedNodes = this.inOrder(root, node => console.log(node));

    //Use the buildTree function to create a balanced tree from sorted array
    return this.buildTree(sortedNodes);
  };
}

let t = new Tree();
let arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
let root = t.buildTree(arr);
t.prettyPrint(root, "", true);
/*t.levelOrder(root, (node) => console.log(node.value));
console.log("Pre-order recursion: ");
t.preOrder(root, (node) => console.log(node));
console.log("Post-order recursion: ");
t.postOrder(root, (node) => console.log(node));
console.log("In-order recursion: ");
t.inOrder(root, (node) => console.log(node));*/
console.log(t.height(root));
console.log(t.isBalanced(root));