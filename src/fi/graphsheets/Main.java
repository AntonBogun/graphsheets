package fi.graphsheets;

import java.awt.Color;
import java.lang.reflect.InvocationTargetException;
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
import fi.graphsheets.ui.GSMenu;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.GlobalState;
import fi.graphsheets.ui.graph.GraphContainerFactory;


public class Main{
	

	public static void main(String[] args) throws InvocationTargetException, InterruptedException {
		JFrame frame = new JFrame();
		frame.setTitle("Graphsheets");
		frame.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
		frame.getContentPane().setBackground(Color.BLACK);
		
		ArrayList<Node> nodes = new ArrayList<Node>();
		ArrayList<Edge> edges = new ArrayList<Edge>();
//		
//		//Nodes in a galaxy formation
		for (int i = 0; i < 1000; i++) {
			nodes.add(new Node( 100000/2 + (int) (Math.cos(i / 10.0) * i * 100.0), 100000/2 + (int) (Math.sin(i / 10.0) * i * 100.0),
					(int) (100), (int) (100), i, new Cell.Atomic.TextCell("ab")));
		}
//		
		Graph graph = new Graph(nodes, edges);
		
		ArrayList<Node> nodes1 = new ArrayList<Node>();
		ArrayList<Edge> edges1 = new ArrayList<Edge>();
		
		//Nodes in a galaxy formation
		for (int i = 20; i < 1000; i++) {
			nodes1.add(new Node( 100000/2 + (int) (Math.cos(i / 10.0) * i * 100.0),  100000/2 + (int) (Math.sin(i / 10.0) * i * 100.0),
					(int) (100), (int) (100), i, new Cell.Atomic.TextCell("ab")));
		}
		
		nodes1.add(new Node(100000/2, 100000/2, 100, 100, 1, new Cell.GraphCell(graph)));
		
		Graph graph1 = new Graph(nodes1, edges1);

		ArrayList<Node> nodes2 = new ArrayList<Node>();
		ArrayList<Edge> edges2 = new ArrayList<Edge>();
		
		//nodes1.add(new Node(0,0,100,100,0, new Cell.SheetCell(new Sheet(cells, 1, 1))));
		
		for (int i = 20; i < 10020; i++) {
			nodes2.add(new Node(0 + (int) (Math.cos(i / 10.0) * i * 100.0), 0 + (int) (Math.sin(i / 10.0) * i * 100.0),
					(int) (100), (int) (100), i, new Cell.Atomic.TextCell("A")));
		}
		
		nodes2.add(new Node(0, 0, 100, 100, 1000000, new Cell.GraphCell(graph1)));
		
		Graph graph2 = new Graph(nodes2, edges2);
//		
		JLayer<? extends AbstractZoomableContainer> layer = GraphContainerFactory.createZoomableGraphContainer(graph2, true);
//		
//		String[] names = Stream.generate(() -> {return UUID.randomUUID().toString();}).limit(sheet1.getCells().length).toArray(String[]::new);
		
//		JTable table = new JTable(sheet1.getCells(), names);
		//Add menu bar
		GlobalState.initaliseState(frame, graph2);
		frame.setJMenuBar(new GSMenu());
		frame.add(layer);
		frame.setSize(1000, 1000);
		frame.setVisible(true);
		SwingUtilities.invokeLater(() -> {
			RepaintManager.setCurrentManager(new GSRepaintManager());
		});
		
	}
	

}
