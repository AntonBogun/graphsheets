package fi.graphsheets;

import java.util.ArrayList;

import javax.swing.JFrame;
import javax.swing.JLayer;
import javax.swing.WindowConstants;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Edge;
import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.graph.GraphContainerFactory;


public class Main{
	

	public static void main(String[] args) {
		JFrame frame = new JFrame();
		frame.setTitle("Graphsheets");
		frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
		
		
		ArrayList<Node> nodes = new ArrayList<Node>();
		ArrayList<Edge> edges = new ArrayList<Edge>();
		
		//make spiral of nodes which get proportionally smaller and smaller. make sure the coordinates are ints
//		for (int i = 0; i < 1000; i++) {
//			nodes.add(new Node((int) (Math.cos(i / 10.0) * i * 10.0), (int) (Math.sin(i / 10.0) * i * 10.0),
//					(int) (100 - i), (int) (100 - i), new Cell.Atomic.TextCell("A")));
//		}
//		
		//make a grid of nodes
		for (int i = 0; i < 100; i++) {
			for (int j = 0; j < 100; j++) {
				nodes.add(new Node((int) (i * 100), (int) (j * 100), (int) (100), (int) (100),
						new Cell.Atomic.TextCell("A")));
			}
		}
		
//		nodes.add(new Node((int)0, (int)0, (int)100, (int)100, new Cell.Atomic.TextCell("A")));
		Graph graph = new Graph(nodes, edges);
		
		JLayer<? extends AbstractZoomableContainer> layer = GraphContainerFactory.createZoomableGraphContainer(graph);
		
		frame.add(layer);
		frame.setSize(1000, 1000);
		frame.setVisible(true);
	}
	

}
