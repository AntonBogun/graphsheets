package fi.graphsheets.ui.graph;

import java.util.UUID;
import java.util.stream.Stream;

import javax.swing.JLayer;
import javax.swing.JTable;
import javax.swing.RepaintManager;
import javax.swing.plaf.LayerUI;
import javax.swing.table.TableCellRenderer;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.graphelements.Sheet;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.ZoomableContainerControlLayer;
import fi.graphsheets.ui.atomic.GSTextArea;
import fi.graphsheets.ui.sheet.GraphCellRenderer;
import fi.graphsheets.ui.sheet.TextCellRenderer;

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
						String[] names = Stream.generate(() -> {return UUID.randomUUID().toString();}).limit(sheet.getCells().length).toArray(String[]::new);
						JTable table = new JTable(sheet.getCells(), names) {
							private GraphCellRenderer gRender = new GraphCellRenderer();
							private TextCellRenderer tRender = new TextCellRenderer();
							@Override
				            public TableCellRenderer getCellRenderer(int row, int column) {
								switch (getValueAt(row, column)) {
					                case Cell.SheetCell(Sheet sheet) -> {
//					                    sheet renderer
					                	return  super.getCellRenderer(row, column);
					                }
					                
					                case Cell.GraphCell(Graph graph) -> {
					                	return gRender;
					                }
					                
					                case Cell.Atomic.TextCell(String text) -> {
					                	return tRender;
					                }
					                
					                default -> super.getCellRenderer(row, column);
				                };
								return super.getCellRenderer(row, column);
				            }
						};
						table.putClientProperty("node", node);
						add(table);
//						table.setDefaultRenderer(Cell.GraphCell.class, new GraphCellRenderer());
					}
					
					default -> throw new IllegalArgumentException("Unexpected value: " + node.getCell());
					
				
				}
			}
		}

	}
}
