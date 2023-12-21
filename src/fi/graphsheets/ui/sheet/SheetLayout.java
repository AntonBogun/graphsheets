package fi.graphsheets.ui.sheet;

import java.awt.Component;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.LayoutManager;
import java.awt.Rectangle;
import java.awt.geom.AffineTransform;
import java.awt.geom.NoninvertibleTransformException;

import javax.swing.JComponent;
import javax.swing.JLayer;
import javax.swing.RepaintManager;
import javax.swing.SwingUtilities;

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
	
	//this is almost identical to GraphLayout, but scared merging them this early on will cause headaches later
    private Rectangle previousBounds = new Rectangle();
	@Override
	public void layoutContainer(Container parent) {
    	if(parent instanceof AbstractZoomableContainer container) {
    		if(container.getZoomRegion() == previousBounds) return;
    		((GSRepaintManager)RepaintManager.currentManager(container)).setPainting(false);
    		Component[] components = parent.getComponents();
			for (Component component : components) {
				if(component instanceof JComponent jcomponent && jcomponent.getClientProperty("entry") instanceof SheetEntry entry) {
					
					Rectangle defaultBounds = new Rectangle(entry.x() * 100, entry.y() * 100, 100, 100);
					component.setBounds(container.getZoomTransform().createTransformedShape(defaultBounds).getBounds());
					
					
					if(jcomponent instanceof IZoomableComponent zcomponent) {
						zcomponent.setZoomTransform(container.getZoomTransform());
					} else if(jcomponent instanceof JLayer jlayer && jlayer.getView() instanceof AbstractZoomableContainer subcontainer) {
//						System.out.println(subcontainer.getClass());
//						System.out.println(container.getScaleTransform());AffineTransform trans = container.getScaleTransform();
						subcontainer.setZoomTransform(container.getScaleTransform());
						
					}
					
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
