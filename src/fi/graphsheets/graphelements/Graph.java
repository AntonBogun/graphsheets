package fi.graphsheets.graphelements;

import java.io.Serializable;
import java.util.ArrayList;

public class Graph implements Serializable{
	
	private static final long serialVersionUID = 9012062787300945259L;
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
	
	public void replaceGraph(Graph graph) {
		this.nodes = graph.nodes;
		this.edges = graph.edges;
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
		return 10000;
//		if(nodes.size() == 0 || nodes.size() == 1) return 10000;
//		System.out.println(nodes.size());
//		Node node = nodes.get(0);
//		Node farthestNode = nodes.stream().max((node1, node2) -> (Double.compare(Node.getDistance(node1, node),(Node.getDistance(node2, node))))).get();
//		Node farthestNode2 = nodes.stream().max((node1, node2) -> (Double.compare(Node.getDistance(node1, farthestNode),(Node.getDistance(node1, farthestNode))))).get();
//		return Node.getDistance(farthestNode, farthestNode2);
	}
	
}
