package fi.graphsheets.ui;

import java.awt.Component;
import java.awt.Container;
import java.awt.Rectangle;

import javax.swing.RepaintManager;
import javax.swing.SwingUtilities;

public abstract class ZoomableContainerLayout {
	
    private Rectangle previousBounds = new Rectangle();
	public void layoutZoomableContainer(Container parent) {
		if(parent instanceof AbstractZoomableContainer container) {
    		if(container.getZoomRegion() == previousBounds) { 
    			return;
    		}
    		((GSRepaintManager)RepaintManager.currentManager(container)).setPainting(false);
//    		GraphContainerFactory.realiseGraphElementsInRenderRegion(parent, container.getZoomRegion());
	    	Component[] components = parent.getComponents();
	    	
			for (Component component : components) {
				layoutComponent(component, container);
			}
			
    		((GSRepaintManager)RepaintManager.currentManager(container)).setPainting(true);
			SwingUtilities.invokeLater(() -> {
				((GSRepaintManager) RepaintManager.currentManager(container)).markCompletelyDirty(container);
				((GSRepaintManager) RepaintManager.currentManager(container)).paintDirtyRegions();
			});
	    	previousBounds = container.getZoomRegion();
    	}
	}
	
	public abstract void layoutComponent(Component component, AbstractZoomableContainer container);

}
