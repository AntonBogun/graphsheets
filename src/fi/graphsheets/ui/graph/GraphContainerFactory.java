package fi.graphsheets.ui.graph;

import javax.swing.JLayer;
import javax.swing.RepaintManager;
import javax.swing.plaf.LayerUI;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.graphelements.Sheet;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.ZoomableContainerControlLayer;
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
					
					case Cell.GraphCell(Graph graph) -> {
						JLayer<? extends AbstractZoomableContainer> graphContainer = GraphContainerFactory.createZoomableGraphContainer(graph);
						graphContainer.putClientProperty("node", node);
						add(graphContainer);
					}
					
					case Cell.Atomic.TextCell(String text) -> {
						GSTextArea textarea = new GSTextArea();
						textarea.setText(text);
						textarea.putClientProperty("node", node);
						add(textarea);
					}
					
					case Cell.SheetCell(Sheet sheet) -> {
						System.out.println("hahahahahahahhaahdjkashdasjkdhasjkhd");
						JLayer<? extends AbstractZoomableContainer> sheetContainer = SheetContainerFactory.createZoomableSheetContainer(sheet);
						sheetContainer.putClientProperty("node", node);
						add(sheetContainer);
					}
					
					default -> throw new IllegalArgumentException("Unexpected value: " + node.getCell());
					
				
				}
			}
		}

	}
}
