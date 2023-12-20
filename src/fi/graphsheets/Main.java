package fi.graphsheets;

import java.awt.Color;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.UUID;
import java.util.stream.Stream;

import javax.swing.JFrame;
import javax.swing.JLayer;
import javax.swing.JTable;
import javax.swing.RepaintManager;
import javax.swing.SwingUtilities;
import javax.swing.WindowConstants;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Edge;
import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.graphelements.Sheet;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.graph.GraphContainerFactory;


public class Main{
	

	public static void main(String[] args) throws InvocationTargetException, InterruptedException {
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

//		for (int i = 0; i < 100; i++) {
//			for (int j = 0; j < 100; j++) {
//				nodes.add(new Node((int) (i * 105), (int) (j * 105), (int) (100), (int) (100),
//						i+10000*j, new Cell.Atomic.TextCell(i+10*j+"")));
//			}
//		}
		
		//Nodes in a galaxy formation
		SwingUtilities.invokeAndWait(() -> {
			for (int i = 0; i < 100; i++) {
				nodes.add(new Node((int) (Math.cos(i / 10.0) * i * 100.0), (int) (Math.sin(i / 10.0) * i * 100.0),
						(int) (100), (int) (100), i, new Cell.Atomic.TextCell("A")));
			}
		});
		
		Graph graph = new Graph(nodes, edges);
		
		
//		Cell[][] cells = new Cell[2][2];
//		
//		cells[0][0] = (Cell) new Cell.GraphCell(graph);
//
////		cells[0][0] = new Cell.Atomic.TextCell("A");
//		cells[0][1] = new Cell.Atomic.TextCell("B");
//		cells[1][0] = new Cell.Atomic.TextCell("C");
//		cells[1][1] = new Cell.Atomic.TextCell("D");
//		
//		Sheet sheet1 = new Sheet(cells);
//		
//
//		Node node = new Node(0, 0, 100, 100, 1, new Cell.SheetCell(sheet1));
//		ArrayList<Node> nodes1 = new ArrayList<Node>();
//		ArrayList<Edge> edges1 = new ArrayList<Edge>();
//		nodes1.add(node);
//		
//		Graph graph1 = new Graph(nodes1, edges1);
//		
//		JLayer<? extends AbstractZoomableContainer> layer = GraphContainerFactory.createZoomableGraphContainer(graph1);
//		
//		String[] names = Stream.generate(() -> {return UUID.randomUUID().toString();}).limit(sheet1.getCells().length).toArray(String[]::new);
		
//		JTable table = new JTable(sheet1.getCells(), names);
//		frame.add(layer);
		frame.setSize(1000, 1000);
		frame.setVisible(true);
		SwingUtilities.invokeLater(() -> {
			RepaintManager.setCurrentManager(new GSRepaintManager());
		});
		
	}
	

}
