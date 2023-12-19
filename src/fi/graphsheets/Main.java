package fi.graphsheets;

import java.awt.Color;
import java.util.ArrayList;

import javax.swing.JFrame;
import javax.swing.JLayer;
import javax.swing.RepaintManager;
import javax.swing.SwingUtilities;
import javax.swing.WindowConstants;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Edge;
import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.graph.GraphContainerFactory;


public class Main{
	

	public static void main(String[] args) {
		JFrame frame = new JFrame();
		frame.setTitle("Graphsheets");
		frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
		frame.getContentPane().setBackground(Color.BLACK);
		
		ArrayList<Node> nodes = new ArrayList<Node>();
		ArrayList<Edge> edges = new ArrayList<Edge>();
		
//		for (int i = 0; i < 1000; i++) {
//			nodes.add(new Node((int) (Math.cos(i / 10.0) * i * 10.0), (int) (Math.sin(i / 10.0) * i * 10.0),
//					(int) (100 - i), (int) (100 - i), new Cell.Atomic.TextCell("A")));
//		}

		for (int i = 0; i < 100; i++) {
			for (int j = 0; j < 100; j++) {
				nodes.add(new Node((int) (i * 105), (int) (j * 105), (int) (100), (int) (100),
						i+10000*j, new Cell.Atomic.TextCell(i+10*j+"")));
			}
		}
		
		Graph graph = new Graph(nodes, edges);
		
		JLayer<? extends AbstractZoomableContainer> layer = GraphContainerFactory.createZoomableGraphContainer(graph);
		
		frame.add(layer);
		frame.setSize(1000, 1000);
		frame.setVisible(true);
		SwingUtilities.invokeLater(() -> {
			RepaintManager.setCurrentManager(new GSRepaintManager());
		});
		
	}
	

}
