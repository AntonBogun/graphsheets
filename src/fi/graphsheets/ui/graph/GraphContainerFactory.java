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
		
		LayerUI<AbstractZoomableContainer> layout = new ZoomableContainerControlLayer(); 
		JLayer<? extends AbstractZoomableContainer> layer = new JLayer<AbstractZoomableContainer>(graphContainer,layout);
		
		return layer;
	}
	
	public static void realiseGraphElementsInRenderRegion(Container container, Rectangle renderRegion) {
		if(container instanceof GraphContainer graphContainer) {
			graphContainer.realiseGraphElementsInRenderRegion(renderRegion);
		} else {
			throw new IllegalArgumentException("Container must be a GraphContainer");
		}
	}
	
	@SuppressWarnings("serial")
	private class GraphContainer extends AbstractZoomableContainer {
		
		private Graph graph;
		private HashMap<Node, JComponent> graphElements = new HashMap<Node, JComponent>();
		private GraphContainer(Graph graph) {
			this.graph = graph;
			this.setLayout(new GraphLayout());
			RepaintManager.setCurrentManager(new GSRepaintManager());
			
		}

		private void realiseGraphElementsInRenderRegion(Rectangle renderRegion) {
			for (Component component : getComponents()) {
				if (component instanceof JComponent jcomponent && jcomponent.getClientProperty("node") instanceof Node node) {
					graphElements.put(node, jcomponent);
				}
			}
			
			for (Node node : graph.getNodes()) {
				if(new Rectangle(node.getX(), node.getY(), node.getWidth(), node.getHeight()).intersects(renderRegion)) {
					//If component already exist
					switch (node.getCell()) {
						
						case Cell.GraphCell graphCell -> {
							if (graphElements.get(node) != null) continue;
							JLayer<? extends AbstractZoomableContainer> graphContainer = GraphContainerFactory.createZoomableGraphContainer(graphCell.graph());
							graphContainer.putClientProperty("node", node);
							add(graphContainer);
						}
						
						case Cell.Atomic.TextCell text -> {
							if (graphElements.get(node) != null && (GSTextArea._TEMPisMipMapRequired(getZoomTransform()) == (boolean)graphElements.get(node).getClientProperty("mipmap"))) continue;//XXX
							GSTextArea gst = new GSTextArea();
							if(GSTextArea._TEMPisMipMapRequired(getZoomTransform())){//XXX
								JComponent mipmap = gst.getMipMapComponent(node);
								add(mipmap);
								if (graphElements.get(node) != null) {
									remove(graphElements.get(node));
									graphElements.remove(node);
								}
								graphElements.put(node, mipmap);
							} else {
								JTextArea textarea = gst.getTextArea();
								textarea.setText(text.value());
								textarea.putClientProperty("node", node);
								textarea.putClientProperty("mipmap", false);
								textarea.putClientProperty("controller", gst);
								add(textarea);
								if (graphElements.get(node) != null) {
									remove(graphElements.get(node));
									graphElements.remove(node);
								}
								graphElements.put(node, (JComponent)textarea);
							}
						}
						
						default -> throw new IllegalArgumentException("Unexpected value: " + node.getCell());
						
					}
				} else {
					if (graphElements.get(node) != null) {
						remove(graphElements.get(node));
						graphElements.remove(node);
					}
				}
			}
		}
	}
}
