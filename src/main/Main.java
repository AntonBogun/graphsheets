package main;

import java.util.ArrayList;

import javax.swing.JFrame;
import javax.swing.WindowConstants;

import graphElements.Edge;
import graphElements.Graph;
import graphElements.Node;


public class Main{
	

	public static void main(String[] args) {
		JFrame frame = new JFrame();
		frame.setTitle("Graphsheets");
		frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
		
		
		ArrayList<Node> nodes = new ArrayList<Node>();
		ArrayList<Edge> edges = new ArrayList<Edge>();
		nodes.add(new Node(0, 0, "A"));
		nodes.add(new Node(5, 2, "B"));
		nodes.add(new Node(3, 3, "C"));
		Graph graph = new Graph(nodes, edges);
		
		GraphSheetComponent panel = new GraphSheetComponent(graph);

		panel.displayGraph();
		
		frame.add(panel);
		frame.setSize(1000, 1000);
		frame.setVisible(true);
	}
	

}
