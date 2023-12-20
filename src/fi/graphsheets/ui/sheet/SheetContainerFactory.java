package fi.graphsheets.ui.sheet;

import javax.swing.JLayer;
import javax.swing.RepaintManager;
import javax.swing.plaf.LayerUI;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.graphelements.Sheet;
import fi.graphsheets.graphelements.Sheet.SheetEntry;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.ZoomableContainerControlLayer;
import fi.graphsheets.ui.atomic.GSTextArea;
import fi.graphsheets.ui.graph.GraphContainerFactory;

public class SheetContainerFactory {
	//Similar to GraphContainerFactory
	private static SheetContainerFactory factory;
	private SheetContainerFactory() {}
	
	public static SheetContainerFactory getInstance() {
		if(factory == null) {
			factory = new SheetContainerFactory();
		}
		return factory;
	}
	
	public static JLayer<? extends AbstractZoomableContainer> createZoomableSheetContainer(Sheet sheet) {
		SheetContainer sheetContainer = SheetContainerFactory.getInstance().new SheetContainer(sheet);
		sheetContainer.initialiseSheet();
		
		LayerUI<AbstractZoomableContainer> layout = new ZoomableContainerControlLayer(); 
		JLayer<? extends AbstractZoomableContainer> layer = new JLayer<AbstractZoomableContainer>(sheetContainer,layout);
		
		return layer;
	}
	
	
	@SuppressWarnings("serial")
	private class SheetContainer extends AbstractZoomableContainer {
		
		private Sheet sheet;
		private SheetContainer(Sheet sheet) {
			this.sheet = sheet;
			this.setLayout(new SheetLayout());
			RepaintManager.setCurrentManager(new GSRepaintManager());
			
		}
		
		public void initialiseSheet() {
			for (SheetEntry entry : sheet) {
				switch (entry.cell()) {
					
					case Cell.GraphCell(Graph graph) -> {
						JLayer<? extends AbstractZoomableContainer> graphContainer = GraphContainerFactory.createZoomableGraphContainer(graph);
						graphContainer.putClientProperty("entry", entry);
						add(graphContainer);
					}
					
					case Cell.Atomic.TextCell(String text) -> {
						GSTextArea textarea = new GSTextArea();
						textarea.setText(text);
						textarea.putClientProperty("entry", entry);
						add(textarea);
					}
					
					case Cell.SheetCell(Sheet sheet) -> {
//						table.setDefaultRenderer(Cell.GraphCell.class, new GraphCellRenderer());
					}
					
					default -> throw new IllegalArgumentException("Unexpected value: " + entry.cell());
					
				
				}
			}
		}

	}
}
