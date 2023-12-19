package fi.graphsheets.ui;

import java.awt.AWTEvent;
import java.awt.Point;

import javax.swing.JComponent;
import javax.swing.JLayer;
import javax.swing.plaf.LayerUI;

import fi.graphsheets.ui.graph.GraphContainerFactory;

@SuppressWarnings("serial")
public class ZoomableContainerControlLayer extends LayerUI<AbstractZoomableContainer> {
	
	public void installUI(JComponent c) {
		super.installUI(c);
	    JLayer l = (JLayer) c;
	    l.setLayerEventMask(AWTEvent.MOUSE_WHEEL_EVENT_MASK | AWTEvent.KEY_EVENT_MASK);
	 }
	
	public void uninstallUI(JComponent c) {
		 super.uninstallUI(c);
	     JLayer l = (JLayer) c;
	     l.setLayerEventMask(0);
	 }
	
	@Override
    public void eventDispatched(AWTEvent e, JLayer<? extends AbstractZoomableContainer> l) {
    	super.eventDispatched(e, l);
    }
	
	@Override
	public void processMouseWheelEvent(java.awt.event.MouseWheelEvent e, JLayer<? extends AbstractZoomableContainer> l) {
		Point origin = new Point(e.getX(), e.getY());
		
		if(!(l.getComponentAt(origin) instanceof AbstractZoomableContainer)) return;

		if (e.getWheelRotation() > 0) {
			l.getView().zoomFrom(origin, e.getWheelRotation()*2);
		} else {
			
			l.getView().zoomTo(origin, -e.getWheelRotation()*2);
		}
		l.requestFocus();
		e.consume();
	}
	
	@Override
	public void processKeyEvent(java.awt.event.KeyEvent e, JLayer<? extends AbstractZoomableContainer> l) {
		//zoom on numpad + and -
		if(e.getID() != java.awt.event.KeyEvent.KEY_PRESSED) return;
		if (e.getKeyCode() == 107) {
			l.getView().zoomFrom(new Point(l.getWidth() / 2, l.getHeight() / 2), 2);
		} else if (e.getKeyCode() == 109) {
			l.getView().zoomTo(new Point(l.getWidth() / 2, l.getHeight() / 2), 2);
		}
		l.requestFocus();
	}
	
	
}
