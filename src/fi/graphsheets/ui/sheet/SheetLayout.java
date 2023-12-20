package fi.graphsheets.ui.sheet;

import java.awt.Component;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.LayoutManager;
import java.awt.Rectangle;

import javax.swing.RepaintManager;
import javax.swing.SwingUtilities;

import fi.graphsheets.graphelements.Sheet;
import fi.graphsheets.graphelements.Sheet.SheetEntry;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GSRepaintManager;
import fi.graphsheets.ui.IZoomableComponent;

public class SheetLayout implements LayoutManager {

	@Override
	public void addLayoutComponent(String name, Component comp) {

	}

	@Override
	public void removeLayoutComponent(Component comp) {

	}

	@Override
	public Dimension preferredLayoutSize(Container parent) {
		return null;
	}

	@Override
	public Dimension minimumLayoutSize(Container parent) {
		return null;
	}
	
    private Rectangle previousBounds = new Rectangle();
    private Sheet layoutInfo;
	@Override
	public void layoutContainer(Container parent) {
    	if(parent instanceof AbstractZoomableContainer container) {
    		if(container.getZoomRegion() == previousBounds) return;
    		((GSRepaintManager)RepaintManager.currentManager(container)).setPainting(false);
			    for(SheetEntry entry : container.) {
		    		Rectangle defaultBounds = new Rectangle(node.getX(), node.getY(), node.getWidth(), node.getHeight());
					component.setBounds(container.getZoomTransform().createTransformedShape(defaultBounds).getBounds());
					
					if(jcomponent instanceof IZoomableComponent zcomponent) {
						
						zcomponent.setZoomTransform(container.getZoomTransform());
						
					}
			    }
    		((GSRepaintManager)RepaintManager.currentManager(container)).setPainting(true);
			SwingUtilities.invokeLater(() -> {
				((GSRepaintManager) RepaintManager.currentManager(container)).markCompletelyDirty(container);
				((GSRepaintManager) RepaintManager.currentManager(container)).paintDirtyRegions();
			});
	    	previousBounds = container.getZoomRegion();
    	}
	}

}
