package fi.graphsheets.ui;

import java.awt.AWTEvent;
import java.awt.Point;
import java.awt.event.KeyEvent;
import java.awt.event.MouseWheelEvent;
import java.awt.geom.AffineTransform;
import java.awt.geom.NoninvertibleTransformException;

import javax.swing.JComponent;
import javax.swing.JLayer;
import javax.swing.plaf.LayerUI;

import fi.graphsheets.graphelements.Node;

@SuppressWarnings("serial")
public class ZoomableContainerControlLayer extends LayerUI<AbstractZoomableContainer> {
	
	public void installUI(JComponent c) {
		super.installUI(c);
	    @SuppressWarnings("unchecked")
		JLayer<? extends AbstractZoomableContainer> l = (JLayer<? extends AbstractZoomableContainer>) c;
		//For the future, make the events pass to the parent container transformed with the correct zoom transform
	    //in order to allow for zooming to sub-pixel levels
	    l.setLayerEventMask(AWTEvent.MOUSE_WHEEL_EVENT_MASK | AWTEvent.KEY_EVENT_MASK);
	}
	
	public void uninstallUI(JComponent c) {
		 super.uninstallUI(c);
		@SuppressWarnings("unchecked")
		JLayer<? extends AbstractZoomableContainer> l = (JLayer<? extends AbstractZoomableContainer>) c;
	     l.setLayerEventMask(0);
	 }
	
	
	@SuppressWarnings("unchecked")
	@Override
    public void eventDispatched(AWTEvent e, JLayer<? extends AbstractZoomableContainer> l) {
		if(l.getView().isZoomingEnabled()) {
			super.eventDispatched(e, l);
		} else {
//			System.out.println(l.getParent());
			if(l.getParent() instanceof AbstractZoomableContainer parentcontainer) {
//				System.out.println(l.getParent());
//				System.out.println(l.getParent().getParent());
//				System.out.println(l.getParent().getParent().getParent());
//				System.out.println(l);
				if(e instanceof MouseWheelEvent e1) {
					Point point = ((MouseWheelEvent) e).getPoint();
					
//					System.out.println(l);
					if(l.getClientProperty("node") instanceof Node node) {
						Point nodePosition = new Point(node.getX(), node.getY());
						parentcontainer.getZoomTransform().transform(nodePosition, nodePosition);
						System.out.println("node position" + nodePosition);
						AffineTransform.getTranslateInstance(nodePosition.getX(), nodePosition.getY()).transform(point, point);
					}
					System.out.println(point);
//					System.out.println(l.getView().getZoomTransform());
////					AffineTransform trans = null;
//					try {
//						trans = l.getView().getZoomTransform().createInverse();
//					} catch (NoninvertibleTransformException e2) {
//						e2.printStackTrace();
//					}
					
					MouseWheelEvent e2 = new MouseWheelEvent(parentcontainer.getParent(), e1.getID(), e1.getWhen(), e1.getModifiers(), (int)(point.x), (int)(point.y), e1.getClickCount(), e1.isPopupTrigger(), e1.getScrollType(), e1.getScrollAmount(), e1.getWheelRotation());
					((ZoomableContainerControlLayer) ((JComponent) parentcontainer.getParent()).getUI()).eventDispatched(e2, (JLayer<? extends AbstractZoomableContainer>) parentcontainer.getParent());
					
					
				}
			}
		}
    }
	
	private long last;
	@Override
	public void processMouseWheelEvent(MouseWheelEvent e, JLayer<? extends AbstractZoomableContainer> l) {
		Point origin = e.getPoint();
		if(last == e.getWhen()) {
			return;
		}
		System.out.println(e.getPoint() + " " + e.getWhen());
		last = e.getWhen();
		if (e.getWheelRotation() > 0) {
			l.getView().zoomFrom(origin, e.getWheelRotation()*2);
			l.requestFocus();
		} else {
			
			l.getView().zoomTo(origin, -e.getWheelRotation()*2);
			l.requestFocus();
		}
		e.consume();
	}
	
	@Override
	public void processKeyEvent(KeyEvent e, JLayer<? extends AbstractZoomableContainer> l) {
		//zoom on numpad + and -
		if(e.getID() != java.awt.event.KeyEvent.KEY_PRESSED) {
			return;
		}
		if (e.getKeyCode() == 107) {
			l.getView().zoomFrom(new Point(l.getWidth() / 2, l.getHeight() / 2), 2);
			l.requestFocus();
		} else if (e.getKeyCode() == 109) {
			l.getView().zoomTo(new Point(l.getWidth() / 2, l.getHeight() / 2), 2);
			l.requestFocus();
		}
	}
	
	
}
