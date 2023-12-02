package graphelements;

public class Edge {
	
	private Node start;
	private Node end;
	private String name;

	public Edge(Node start, Node end, String name) {
		this.start = start;
		this.end = end;
		this.name = name;
	}

	public Edge() {
		this.start = new Node();
		this.end = new Node();
		this.name = "dummy";
	}

	public Node getStart() {
		return start;
	}

	public Node getEnd() {
		return end;
	}

	public String getName() {
		return name;
	}

}
