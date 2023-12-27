package fi.graphsheets.ui.sheet;

import java.awt.Component;
import java.awt.Cursor;
import java.awt.geom.AffineTransform;

import javax.swing.JComponent;
import javax.swing.JLayer;
import javax.swing.RepaintManager;
import javax.swing.plaf.LayerUI;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Graph;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.graphelements.Sheet;
import fi.graphsheets.graphelements.Sheet.SheetEntry;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.GlobalState;
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
	
	public static void updateSheet(Component sheetcontainer) {
        ((SheetContainer)sheetcontainer).sheet.calculateCellsDimensions();
        ((SheetContainer)sheetcontainer).sheet.updateCellsLayout();
    }
	
	public static boolean isSheetChanged(Component sheetcontainer) {
		return ((SheetContainer) sheetcontainer).sheet.sheetChanged;
	}
	
	public static void resizeIfNeeded(JComponent component) {
		if (component instanceof SheetContainer sheetcontainer && isSheetChanged(sheetcontainer)) {
			System.out.println(((SheetContainer) sheetcontainer).sheet.totalWidth());
//			sheetcontainer.setBounds(sheetcontainer.getX(), sheetcontainer.getY(), ((SheetContainer) sheetcontainer).sheet.totalWidth(), ((SheetContainer) sheetcontainer).sheet.totalHeight());
			//XXX wont work for nested sheets
			if((Node)((JComponent) sheetcontainer.getParent()).getClientProperty("node") instanceof Node node) {
				node.setWidth(((SheetContainer) sheetcontainer).sheet.totalWidth());
				node.setHeight(((SheetContainer) sheetcontainer).sheet.totalHeight());
			}
			sheetcontainer.sheet.sheetChanged = false;
		}
	}
	
	public static void updateSizeOfCell(JComponent component, int x, int y, int newdimension, boolean width) {
//		System.out.println(x + " " + newdimension);
		if(component.getParent() instanceof SheetContainer sheetcontainer) {
//			System.out.println(sheetcontainer.sheet.layoutWidths);
			if(width) {
				sheetcontainer.sheet.layoutWidths.set(x, newdimension);
			} else {
				sheetcontainer.sheet.layoutHeights.set(y, newdimension);
			}
			sheetcontainer.sheet.sheetChanged = true;
			sheetcontainer.sheet.updateCellsLayout();
			sheetcontainer.needRender = true;
			((AbstractZoomableContainer) sheetcontainer.getParent().getParent()).forceRepaint();
		}
	}
	
	@SuppressWarnings("serial")
	private class SheetContainer extends AbstractZoomableContainer{
		
		private Sheet sheet;
		private int zoom;
		private boolean zooming;
		private SheetContainer(Sheet sheet) {
			this.sheet = sheet;
			this.setLayout(new SheetLayout());
			RepaintManager.setCurrentManager(new GSRepaintManager());
			
		}
		
		public void initialiseSheet() {
			for (SheetEntry entry : sheet) {
				initialiseCell(entry);
			}
		}
		

		private void initialiseCell(SheetEntry entry) {
			switch (entry.cell()) {
			
				case Cell.GraphCell(Graph graph) -> {
					JLayer<? extends AbstractZoomableContainer> graphContainer = GraphContainerFactory.createZoomableGraphContainer(graph, false);
					double size = graph.getDiameter();
					AffineTransform scale = AffineTransform.getScaleInstance(100/size, 100/size);
//					scale.concatenate(AffineTransform.getTranslateInstance(size/2, size/2));
					graphContainer.getView().addZoomTransform(scale);
//					graphContainer.getView().setZoomTransform(getZoomTransform());
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
	//				table.setDefaultRenderer(Cell.GraphCell.class, new GraphCellRenderer());
				}
				
			default -> throw new IllegalArgumentException("Unexpected value: " + entry.cell());
			
		
			}
			
		}

		@Override
		public boolean isZoomingEnabled() {
			return zooming;
		}
//
//		@Override
//		public void setZoomTransform(AffineTransform zoomTransform) {
//			for(Component c : this.getComponents()) if(c instanceof IZoomableComponent z) z.setZoomTransform(zoomTransform);
//			
//		}

		@Override
		public int getMaxZoom() {
			return 100;
		}

		@Override
		public int getMinZoom() {
			return 1;
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



	}
}
