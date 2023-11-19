const createLinkedList = function (capacity) {
  const createNode = (key, value, next = null) => {
    const node = {
      key: key,
      value: value,
      next: next,
    };

    return node;
  };

  let head = null;
  let currentSize = 0;

  this.isEmpty = () => currentSize == 0;

  this.insert = (key, value) => {
    currentSize++;
    const newNode = createNode(key, value);

    if (head == null) {
      head = newNode;
    } else {
      let tmp = head;

      while (tmp.next != null) {
        tmp = tmp.next;
      }

      tmp.next = newNode;
    }
  };

  this.extractMin = () => {
    let minValue = Infinity;
    let minNode = null;
    let tmp = createNode(-1, -1, head);

    //find the min node
    while (tmp.next) {
      if (tmp.next.value < minValue) {
        minValue = tmp.next.value;
        minNode = tmp;
      }

      tmp = tmp.next;
    }
    tmp = minNode.next;

    //delete the min node
    if (minNode.next == head) {
      head = head.next;
    } else {
      minNode.next = minNode.next.next;
    }
    --currentSize;

    return tmp;
  };

  this.decreaseKey = (key, newValue) => {
    let tmp = createNode(-1, -1, head);

    while (tmp.next.key != key) {
      tmp = tmp.next;
    }

    tmp.next.value = newValue;
  };
};

export default createLinkedList;
