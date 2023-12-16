package fi.graphsheets.ui.graph;

import java.awt.Point;
import java.awt.geom.AffineTransform;

import javax.swing.BorderFactory;
import javax.swing.JLayer;
import javax.swing.JTextArea;
import javax.swing.border.BevelBorder;
import javax.swing.plaf.LayerUI;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.ZoomableContainerControlLayer;

public class GraphContainerFactory {
	
	private static GraphContainerFactory factory;
	private GraphContainerFactory() {}
	
	public static GraphContainerFactory getInstance() {
		if(factory == null) {
			factory = new GraphContainerFactory();
		}
		return factory;
	}
	
	public static JLayer<? extends AbstractZoomableContainer> createZoomableGraphContainer(Graph graph) {
		GraphContainer graphContainer = GraphContainerFactory.getInstance().new GraphContainer(graph);
		graphContainer.initializeGraph();
		
		LayerUI<AbstractZoomableContainer> layout = new ZoomableContainerControlLayer(); 
		JLayer<? extends AbstractZoomableContainer> layer = new JLayer<AbstractZoomableContainer>(graphContainer,layout);
		
		return layer;
	}
	
	@SuppressWarnings("serial")
	private class GraphContainer extends AbstractZoomableContainer {
		
		private Graph graph;
		private GraphContainer(Graph graph) {
			this.graph = graph;
			this.setLayout(new GraphLayout());
			
		}
		
		public void initializeGraph() {
			for (Node node : graph.getNodes()) {
				switch (node.getCell()) {
					
					case Cell.GraphCell graphCell -> {
						JLayer<? extends AbstractZoomableContainer> graphContainer = GraphContainerFactory.createZoomableGraphContainer(graphCell.graph());
						graphContainer.putClientProperty("node", node);
						add(graphContainer);
					}
					
					case Cell.Atomic.TextCell text -> {
						JTextArea textarea = new JTextArea();
						textarea.setText(text.value());
						textarea.putClientProperty("node", node);
						textarea.setBorder(BorderFactory.createBevelBorder(BevelBorder.LOWERED));
						add(textarea);
					}
					
					default -> throw new IllegalArgumentException("Unexpected value: " + node.getCell());
					
				}
			}
		}

	}
}
