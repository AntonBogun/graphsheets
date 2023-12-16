package fi.graphsheets.graphelements;

public class Edge {
	
	private Node start;
	private Node end;
	private String name;

	public Edge(Node start, Node end, String name) {
		this.start = start;
		this.end = end;
		this.name = name;
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
