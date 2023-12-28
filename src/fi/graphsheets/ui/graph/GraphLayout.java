package fi.graphsheets.ui.graph;

import java.awt.Component;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.LayoutManager;
import java.awt.Rectangle;
import java.awt.geom.AffineTransform;

import javax.swing.JComponent;
import javax.swing.JLayer;

import fi.graphsheets.graphelements.Node;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.GlobalState;
import fi.graphsheets.ui.IZoomableComponent;
import fi.graphsheets.ui.ZoomableContainerLayout;
import fi.graphsheets.ui.sheet.SheetContainerFactory;

public class GraphLayout extends ZoomableContainerLayout implements LayoutManager {
	
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
    
	public void layoutComponent(Component component, AbstractZoomableContainer container, boolean newZoom) {
		
		if(component instanceof JComponent jcomponent && jcomponent.getClientProperty("node") instanceof Node node) {
			
			Rectangle defaultBounds = new Rectangle(node.getX(), node.getY(), node.getWidth(), node.getHeight());
			component.setBounds(container.getZoomTransform().createTransformedShape(defaultBounds).getBounds());
			
			if(jcomponent instanceof IZoomableComponent zcomponent) {
				zcomponent.setZoomTransform(container.getZoomTransform());
			} else if(jcomponent instanceof JLayer jlayer && jlayer.getView() instanceof AbstractZoomableContainer subcontainer && (newZoom || subcontainer.needRender)) {
				SheetContainerFactory.resizeIfNeeded(subcontainer);
				subcontainer.addZoomTransform(subcontainer.needRender ? AffineTransform.getRotateInstance(0) : container.getPrevScaleTransform());
				if(subcontainer.needRender) { subcontainer.needRender = false; }
				
			}
			
		}
		
	}

	@Override
	public void layoutContainer(Container parent) {
		super.layoutZoomableContainer(parent);
	}
}
