const createMinHeap = function (capacity) {
  const createNode = (key, value) => {
    const node = {
      key: key,
      value: value,
    };
    return node;
  };

  let currentSize = 0;
  const nodes = new Array(capacity + 1);
  const keysIndices = new Array(capacity);

  nodes[0] = createNode(-1, -Infinity);

  const swapNodes = (index1, index2) => {
    [nodes[index1], nodes[index2]] = [nodes[index2], nodes[index1]];
  };

  const bubbleUp = (index) => {
    let parentIndex = Math.floor(index / 2);
    let currentIndex = index;
    while (
      currentIndex > 0 &&
      nodes[parentIndex].value > nodes[currentIndex].value
    ) {
      const parentNode = nodes[parentIndex];
      const currentNode = nodes[currentIndex];

      keysIndices[currentNode.key] = parentIndex;
      keysIndices[parentNode.key] = currentIndex;
      swapNodes(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = Math.floor(parentIndex / 2);
    }
  };

  const sinkDown = (k) => {
    let smallest = k;
    let leftChildIndex = 2 * k;
    let rightChildIndex = 2 * k + 1;
    if (
      leftChildIndex < currentSize &&
      nodes[smallest].value > nodes[leftChildIndex].value
    ) {
      smallest = leftChildIndex;
    }
    if (
      rightChildIndex < currentSize &&
      nodes[smallest].value > nodes[rightChildIndex].value
    ) {
      smallest = rightChildIndex;
    }
    if (smallest != k) {
      const smallestNode = nodes[smallest];
      const kNode = nodes[k];

      keysIndices[smallestNode.key] = k;
      keysIndices[kNode.key] = smallest;
      swapNodes(k, smallest);
      sinkDown(smallest);
    }
  };

  this.isEmpty = () => currentSize == 0;

  this.insert = (key, value) => {
    currentSize++;
    nodes[currentSize] = createNode(key, value);
    keysIndices[key] = currentSize;
    bubbleUp(currentSize);
  };

  this.extractMin = () => {
    const min = nodes[1];
    const last = nodes[currentSize];
    keysIndices[last.key] = 1;
    nodes[1] = last;
    nodes[currentSize] = null;
    sinkDown(1);
    currentSize--;
    return min;
  };

  this.decreaseKey = (key, newValue) => {
    const index = keysIndices[key];
    const node = nodes[index];
    node.value = newValue;
    bubbleUp(index);
  };
};

export default createMinHeap;
