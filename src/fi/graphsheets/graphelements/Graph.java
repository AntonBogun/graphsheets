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
	
	public Node getNodeByCoordinates(int x, int y) {
		for (Node node : nodes) {
			if (node.getX() == x && node.getY() == y) {
				return node;
			}
		}
		return null;
	}
	
}
