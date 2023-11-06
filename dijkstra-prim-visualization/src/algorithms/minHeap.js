const createMinHeap = function (capacity) {
  this.createNode = (key, value) => {
    const node = {
      key: key,
      value: value,
    };
    return node;
  };

  this.currentSize = 0;
  this.nodes = new Array(capacity + 1);
  this.nodes[0] = this.createNode(-1, -Infinity);
  this.indices = new Array(capacity);

  this.isEmpty = () => this.currentSize == 0;

  this.display = () => {
    for (let index = 0; index < this.currentSize; index++) {
      console.log(
        `key: ${this.nodes[index].key}, value: ${this.nodes[index].value}`,
      );
    }
  };

  this.swapNodes = (index1, index2) => {
    [this.nodes[index1], this.nodes[index2]] = [
      this.nodes[index2],
      this.nodes[index1],
    ];
  };

  this.bubbleUp = (index) => {
    let parentIndex = Math.floor(index / 2);
    let currentIndex = index;
    while (
      currentIndex > 0 &&
      this.nodes[parentIndex].value > this.nodes[currentIndex].value
    ) {
      const parentNode = this.nodes[parentIndex];
      const currentNode = this.nodes[currentIndex];

      this.indices[currentNode.key] = parentIndex;
      this.indices[parentNode.key] = currentIndex;
      this.swapNodes(currentIndex, parentIndex);
      currentIndex = parentIndex;
      parentIndex = Math.floor(parentIndex / 2);
    }
  };

  this.sinkDown = (k) => {
    let smallest = k;
    let leftChildIndex = 2 * k;
    let rightChildIndex = 2 * k + 1;
    if (
      leftChildIndex < this.currentSize &&
      this.nodes[smallest].value > this.nodes[leftChildIndex].value
    ) {
      smallest = leftChildIndex;
    }
    if (
      rightChildIndex < this.currentSize &&
      this.nodes[smallest].value > this.nodes[rightChildIndex].value
    ) {
      smallest = rightChildIndex;
    }
    if (smallest != k) {
      const smallestNode = this.nodes[smallest];
      const kNode = this.nodes[k];

      this.indices[smallestNode.key] = k;
      this.indices[kNode.key] = smallest;
      this.swapNodes(k, smallest);
      this.sinkDown(smallest);
    }
  };

  this.insert = (key, value) => {
    this.currentSize++;
    this.nodes[this.currentSize] = this.createNode(key, value);
    this.indices[key] = this.currentSize;
    this.bubbleUp(this.currentSize);
  };

  this.extractMin = () => {
    const min = this.nodes[1];
    const last = this.nodes[this.currentSize];
    this.indices[last.key] = 1;
    this.nodes[1] = last;
    this.nodes[this.currentSize] = null;
    this.sinkDown(1);
    this.currentSize--;
    return min;
  };

  this.decreaseKey = (key, newValue) => {
    const index = this.indices[key];
    const node = this.nodes[index];
    node.value = newValue;
    this.bubbleUp(index);
  };
};

export default createMinHeap;
