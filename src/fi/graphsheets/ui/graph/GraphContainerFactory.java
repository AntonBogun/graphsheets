package fi.graphsheets.ui.graph;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.Stroke;
import java.awt.geom.AffineTransform;

import javax.swing.JComponent;
import javax.swing.JLayer;
import javax.swing.RepaintManager;
import javax.swing.plaf.LayerUI;

import fi.graphsheets.SerializableImage;
import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Edge;
import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.graphelements.Sheet;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.ZoomableContainerControlLayer;
import fi.graphsheets.ui.atomic.GSImage;
import fi.graphsheets.ui.atomic.GSTextArea;
import fi.graphsheets.ui.sheet.SheetContainerFactory;

public class GraphContainerFactory {
	
	private static GraphContainerFactory factory;
	private GraphContainerFactory() {}
	
	public static GraphContainerFactory getInstance() {
		if(factory == null) {
			factory = new GraphContainerFactory();
		}
		return factory;
	}
	
	public static JLayer<? extends AbstractZoomableContainer> createZoomableGraphContainer(Graph graph, boolean manualZooming) {
		GraphContainer graphContainer = GraphContainerFactory.getInstance().new GraphContainer(graph, manualZooming);
		graphContainer.initialiseGraph();
//		graphContainer.addMouseMotionListener(new ResizeMoveMouseMotionAdapter());
		
		LayerUI<AbstractZoomableContainer> layout = new ZoomableContainerControlLayer(); 
		JLayer<? extends AbstractZoomableContainer> layer = new JLayer<AbstractZoomableContainer>(graphContainer,layout);
		
		return layer;
	}
	
	public static void addNewElement(JComponent container, Point point, int width, int height, Cell cell) throws IllegalArgumentException{
		//TODO Make proper ID system
		if(container instanceof GraphContainer gcontainer) {
			Node node = new Node(point.x, point.y, width, height, 1, cell);
			gcontainer.initialiseNode(node);
			gcontainer.graph.addNode(node);
			gcontainer.forceRepaint();
		} else {
			throw new IllegalArgumentException("Container is not a GraphContainer");
		}
	}
	
	public static void addNewEdge(AbstractZoomableContainer view, Node firstEdgeNode, Node node) {
		if(view instanceof GraphContainer gcontainer) {
			gcontainer.graph.addEdge(new Edge(firstEdgeNode, node, ""));
			gcontainer.doLayout();
			gcontainer.repaint();
		}
	}
	
	
	@SuppressWarnings("serial")
	private class GraphContainer extends AbstractZoomableContainer{
		
		private Graph graph;
		private int zoom;
		private boolean zooming;
		private GraphContainer(Graph graph, boolean manualZooming) {
			this.graph = graph;
			this.setLayout(new GraphLayout());
			RepaintManager.setCurrentManager(new GSRepaintManager());
			zooming = manualZooming;
			
		}
		
		public void initialiseGraph() {
			for (Node node : graph.getNodes()) {
				initialiseNode(node);
			}
		}

		private JComponent initialiseNode(Node node) {
			switch (node.getCell()) {
			
			case Cell.GraphCell(Graph graph) -> {
				JLayer<? extends AbstractZoomableContainer> graphContainer = GraphContainerFactory.createZoomableGraphContainer(graph, false);
				double size = graph.getDiameter();
				AffineTransform scale = AffineTransform.getScaleInstance(100/size, 100/size);
//				scale.concatenate(AffineTransform.getTranslateInstance(size/2, size/2));
				graphContainer.getView().addZoomTransform(scale);
				graphContainer.putClientProperty("node", node);
				add(graphContainer);
				return graphContainer;
			}
			
			case Cell.Atomic.TextCell(String text) -> {
				GSTextArea textarea = new GSTextArea();
				textarea.setText(text);
				textarea.putClientProperty("node", node);
				add(textarea);
				return textarea;
			}
			
			case Cell.SheetCell(Sheet sheet) -> {
				JLayer<? extends AbstractZoomableContainer> sheetContainer = SheetContainerFactory.createZoomableSheetContainer(sheet);
				sheetContainer.putClientProperty("node", node);
				add(sheetContainer);
				return sheetContainer;
			}
			
			case Cell.Atomic.ImageCell(SerializableImage serial) -> {
				GSImage im = new GSImage(serial.getBufferedImage());
				im.putClientProperty("node", node);
				add(im);
				return im;
			}
			
			default -> throw new IllegalArgumentException("Unexpected value: " + node.getCell());
			
		
		}
			
		}

		@Override
		public boolean isZoomingEnabled() {
			return zooming;
		}

		@Override
		public int getMaxZoom() {
			return 20;
		}

		@Override
		public int getMinZoom() {
			return -20;
		}

		@Override
		public void incrementZoomCounter() {
			zoom++;
		}

		@Override
		public void decrementZoomCounter() {
			zoom--;
		}

		@Override
		public int getZoomCounter() {
			return zoom;
		}

		@Override
		public int getDefaultCursor() {
			return Cursor.DEFAULT_CURSOR;
		}
		
		public void paint(Graphics g) {
			//draw arrows for edges
			Graphics2D g2d = (Graphics2D) g;
			Stroke defaultStroke = g2d.getStroke();
			g.setColor(Color.white);
			for (Edge edge : graph.getEdges()) {
				Point start = edge.getStart().getCenter();
				Point end = edge.getEnd().getCenter();
				this.getZoomTransform().transform(start, start);
				this.getZoomTransform().transform(end, end);
				g.drawLine(start.x, start.y, end.x, end.y);
				g2d.setStroke(new BasicStroke(2));
				g2d.drawLine((start.x+3*end.x)/4, (start.y+3*end.y)/4, end.x, end.y);
				g2d.setStroke(defaultStroke);
			}
			g.setColor(Color.black);
			super.paint(g);
			
		}
		

//		@Override
//		public void setZoomTransform(AffineTransform zoomTransform) {
//			for(Component c : this.getComponents()) if(c instanceof IZoomableComponent z) z.setZoomTransform(zoomTransform);
//			
//		}

	}


	
}
