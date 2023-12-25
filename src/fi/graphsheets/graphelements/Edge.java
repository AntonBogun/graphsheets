package fi.graphsheets.graphelements;

import java.io.Serializable;

public class Edge implements Serializable{
	
	private static final long serialVersionUID = 133461738167404297L;
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
