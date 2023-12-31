package fi.graphsheets.ui;

import java.awt.Component;
import java.awt.Container;
import java.awt.Rectangle;

import javax.swing.RepaintManager;
import javax.swing.SwingUtilities;

public abstract class ZoomableContainerLayout {
	
    private Rectangle previousBounds = new Rectangle();
    private int numComponents = 0;
	public void layoutZoomableContainer(Container parent) {
		if(parent instanceof AbstractZoomableContainer container) {
    		if(container.getZoomRegion() == previousBounds && parent.getComponentCount() == numComponents && !container.needRender) { 
    			return;
    		}
    		((GSRepaintManager)RepaintManager.currentManager(container)).setPainting(false);
//    		GraphContainerFactory.realiseGraphElementsInRenderRegion(parent, container.getZoomRegion());
	    	Component[] components = parent.getComponents();
	    	
			for (Component component : components) {
				layoutComponent(component, container, container.getZoomRegion() != previousBounds);
			}
			
    		((GSRepaintManager)RepaintManager.currentManager(container)).setPainting(true);
			SwingUtilities.invokeLater(() -> {
				((GSRepaintManager) RepaintManager.currentManager(container)).markCompletelyDirty(container);
				((GSRepaintManager) RepaintManager.currentManager(container)).paintDirtyRegions();
			});
	    	previousBounds = container.getZoomRegion();
	    	numComponents = parent.getComponentCount();
	    	container.needRender = false;
    	}
	}
	
	public abstract void layoutComponent(Component component, AbstractZoomableContainer container, boolean newZoom);

}
