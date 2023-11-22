# Shortest Paths and Minimum Spanning Trees

Complex graph algorithms are fascinating, they allow us to solve difficult problems reasonably fast, but some of them can be quite tricky to understand. This page explains how Dijkstra's and Prim's algorithms work as well as provides an brief analysis of their time complexities.

On our website, you can see exactly how these algorithms traverse a given graph, this visualization will help you to fully understand them.

## Dijkstra's shortest path algorithm

Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a weighted graph. Here is how we implemented it: firstly, we assign a distance of infinity to every node in the graph, this number represents how much does it cost to get from our starting node to this particular one, for now we do not have a path to any of the nodes, thus the distance to any of them is equal to infinity, meaning they are unreachable. But, we have to start somewhere, so our starting node is assigned a distance of 0, because we do not have to go anywhere to get to it.

Now we repeat the following until we either get to our destination or run out of nodes to visit: get the node with the closest available, remove it from the fringe, and calculate a new distance for all of its adjacent nodes, being the distance to the current node plus the weight of the edge between them, if this new distance is smaller than what this adjacent node had before, we update it, since we want to have the smallest distance possible to every node in the graph.

Once we get to the finish node, its distance is in fact the length of the shortest path we were looking for (if there is no path from the starting node to the destination, we stop the loop when our fringe is empty). Along the way we record the parent of every node, meaning the node we came to it from, in order to actually recreate the path our algorithm has taken to get to the destination. And this is how our Dijkstra's algorithm visualization works.

## Prim's minimum spanning tree algorithm

Prim's algorithm is a greedy algorithm that finds a minimum spanning tree for a weighted undirected graph. This means it finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized. Here is how we implemented it: firstly, we set a value of infinity to every node in the graph, this number represents the cheapest cost to connect this node to the tree, for now we have no such information, thus all of them have the cost of infinity. But our starting node is assigned a cost of 0, since it is already in the tree.

Now we repeat the following until there are no more nodes to connect: get the cheapest node available, remove it from the fringe, and calculate a new cost for all of its neighbors, being the the weight of the edge between them, if this new cost is smaller than what it was before, we update it, since we want to find the cheapest way to connect all the nodes.

Once our fringe is empty, we are sure that every node is present in the minimum spanning tree and the algorithm is done. Along the way we record the parent of every node, meaning the node we connected to it from, in order to actually recreate the minimum spanning tree our algorithm has built. And this is how our Prim's algorithm visualization works.

## Time complexity analysis

Conveniently enough, these two algorithms have the same time complexity, since they pretty much do the same thing: finding the cheapest edge connecting every node to the graph. The time complexity of this process depends on what data structure you choose to use as a fringe.

An easy way would be to use a linked list, but this means that we have to go through all of the nodes every time we want to get the next cheapest node or to update the value of the neighbor. When implemented using a linked list both Dijkstra's and Prim's algorithms have O(E \* V) complexity.

But there is a better way, there is a perfect data structure to keep track of the smallest value in the collection of elements and it is called a min heap. Now we do not have to to scan the entire fringe to get the next cheapest node or to update some values, because we have it in the root of our heap, we still have to fix it after extracting or changing values but this has O(logN) time complexity which is still considerably faster than linked list. When implemented using a linked list both Dijkstra's and Prim's algorithms have O(E \* logV) complexity.

To demonstrate this difference we prepared to graphs that compare the running time of our algorithms implemented with linked list and min heap as a fringe:

![dijkstra_graph](src/assets/img/dijkstra_graph.jpg)

![prim_graph](src/assets/img/prim_graph.jpg)
