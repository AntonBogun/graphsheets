package fi.graphsheets.ui.graph;

import java.awt.Component;
import java.awt.Container;
import java.awt.Rectangle;
import java.util.HashMap;

import javax.swing.JComponent;
import javax.swing.JLayer;
import javax.swing.JPanel;
import javax.swing.JTextArea;
import javax.swing.RepaintManager;
import javax.swing.plaf.LayerUI;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.ZoomableContainerControlLayer;
import fi.graphsheets.ui.atomic.GSTextArea;

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
		graphContainer.initialiseGraph();
		
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
			RepaintManager.setCurrentManager(new GSRepaintManager());
			
		}
		
		public void initialiseGraph() {
			for (Node node : graph.getNodes()) {
				switch (node.getCell()) {
					
					case Cell.GraphCell graphCell -> {
						JLayer<? extends AbstractZoomableContainer> graphContainer = GraphContainerFactory.createZoomableGraphContainer(graphCell.graph());
						graphContainer.putClientProperty("node", node);
						add(graphContainer);
					}
					
					case Cell.Atomic.TextCell text -> {
						GSTextArea gst = new GSTextArea();
						JTextArea textarea = gst.getTextArea();
						textarea.setText(text.value());
						textarea.putClientProperty("node", node);
						textarea.putClientProperty("mipmap", false);
						textarea.putClientProperty("controller", gst);
						add(textarea);
						}
//					}
					
					default -> throw new IllegalArgumentException("Unexpected value: " + node.getCell());
					
				
			}
		}
		}

	}
}
