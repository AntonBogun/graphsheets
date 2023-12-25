package fi.graphsheets.ui.sheet;

import java.awt.Component;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.LayoutManager;
import java.awt.Rectangle;

import javax.swing.JComponent;
import javax.swing.JLayer;

import fi.graphsheets.graphelements.Sheet.SheetEntry;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.IZoomableComponent;
import fi.graphsheets.ui.ZoomableContainerLayout;

public class SheetLayout extends ZoomableContainerLayout implements LayoutManager {

	
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
	
	@Override
	public void layoutContainer(Container parent) {
    	super.layoutZoomableContainer(parent);
	}

	@Override
	public void layoutComponent(Component component, AbstractZoomableContainer container, boolean newZoom) {
		if(component instanceof JComponent jcomponent && jcomponent.getClientProperty("entry") instanceof SheetEntry entry) {
			

			Rectangle defaultBounds = new Rectangle(entry.x() * 100, entry.y() * 100, 100, 100);
			component.setBounds(container.getZoomTransform().createTransformedShape(defaultBounds).getBounds());
			
			
			if(jcomponent instanceof IZoomableComponent zcomponent) {
				zcomponent.setZoomTransform(container.getZoomTransform());
			} else if(jcomponent instanceof JLayer jlayer && jlayer.getView() instanceof AbstractZoomableContainer subcontainer && newZoom) {
				subcontainer.addZoomTransform(container.getPrevScaleTransform());
				
			}
			
		}
		
	}

}
