package fi.graphsheets.graphelements;

import java.util.ArrayList;

public class Graph {
	
	private ArrayList<Node> nodes;
	private ArrayList<Edge> edges;
	public Graph(ArrayList<Node> nodes, ArrayList<Edge> edges) {
		this.nodes = nodes;
		this.edges = edges;
    }
	
	public Graph() {
		nodes = new ArrayList<Node>();
		edges = new ArrayList<Edge>();
	}
	
	public void addNode(Node node) {
		nodes.add(node);
	}
	
	public void addEdge(Edge edge) {
		edges.add(edge);
	}

	public ArrayList<Node> getNodes() {
        return nodes;
	}
	
	public ArrayList<Edge> getEdges() {
        return edges;
	}
	

	public double getDiameter() {
		Node node = nodes.get(0);
		Node farthestNode = nodes.stream().max((node1, node2) -> (Double.compare(Node.getDistance(node1, node),(Node.getDistance(node2, node))))).get();
		Node farthestNode2 = nodes.stream().max((node1, node2) -> (Double.compare(Node.getDistance(node1, farthestNode),(Node.getDistance(node1, farthestNode))))).get();
		return Node.getDistance(farthestNode, farthestNode2);
	}
	
}
