package fi.graphsheets.ui;

import java.awt.Component;
import java.awt.Cursor;
import java.awt.Point;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionAdapter;
import java.awt.geom.AffineTransform;

import javax.swing.JComponent;
import javax.swing.SwingUtilities;

import fi.graphsheets.graphelements.Node;

public class ResizeMoveMouseMotionAdapter extends MouseMotionAdapter {
	
	@Override
	public void mouseMoved(MouseEvent e) {
		int defaultCursor = -1;

		JComponent source = (JComponent) e.getSource();
		if(source instanceof IZoomableComponent comp) defaultCursor = comp.getDefaultCursor();
		if(source instanceof AbstractZoomableContainer comp) defaultCursor = comp.getDefaultCursor();
//		System.out.println(e.getPoint());
//		System.out.println(getWidth() + " " + getHeight());
		if(e.getX() < 10 && e.getY() < 10) {
			source.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
		} else if(e.getX() > source.getWidth() - 10 && e.getY() > source.getHeight() - 10) {
			source.setCursor(Cursor.getPredefinedCursor(Cursor.SE_RESIZE_CURSOR));
		} else if (e.getX() > source.getWidth() - 10) {
			source.setCursor(Cursor.getPredefinedCursor(Cursor.E_RESIZE_CURSOR));
		} else if (e.getY() > source.getHeight() - 10) {
			source.setCursor(Cursor.getPredefinedCursor(Cursor.S_RESIZE_CURSOR));
		} else {
			source.setCursor(Cursor.getPredefinedCursor(defaultCursor));
		}
	}

	//FIXME when resizing text area to very large sized, zooming does not behave as expected (and parts of the textarea are not rendered)
	@Override
	public void mouseDragged(MouseEvent e) {
		JComponent source = (JComponent) e.getSource();
		AffineTransform zoomTransform = null;
		if(source instanceof IZoomableComponent comp) zoomTransform = comp.getZoomTransform();
		if(source instanceof AbstractZoomableContainer comp) zoomTransform = comp.getZoomTransform();
//		((AbstractZoomableContainer)getParent()).convertFromScreen(p);
		if(source.getCursor().getType() == Cursor.E_RESIZE_CURSOR) {
			Point p = new Point((int) (e.getX()/zoomTransform.getScaleX()), (int) (e.getY()/zoomTransform.getScaleY()));
//			System.out.println(p);
//			((AbstractZoomableContainer)getParent()).convertFromScreen(p);
			if(source.getClientProperty("node") instanceof Node node && p.x<1000) {
				node.setWidth(p.x);
				((AbstractZoomableContainer)source.getParent()).forceRepaint();
			}
		}
		
		if(source.getCursor().getType() == Cursor.S_RESIZE_CURSOR) {
			Point p = new Point((int) (e.getX()/zoomTransform.getScaleX()), (int) (e.getY()/zoomTransform.getScaleY()));
			if(source.getClientProperty("node") instanceof Node node && p.y<1000) {
				node.setHeight(p.y);
				((AbstractZoomableContainer)source.getParent()).forceRepaint();
			}
		}
		
		if(source.getCursor().getType() == Cursor.SE_RESIZE_CURSOR) {
			Point p = new Point((int) (e.getX()/zoomTransform.getScaleX()), (int) (e.getY()/zoomTransform.getScaleY()));
			if(source.getClientProperty("node") instanceof Node node && p.x<1000 && p.y<1000) {
				node.setWidth(p.x);
				node.setHeight(p.y);
				((AbstractZoomableContainer)source.getParent()).forceRepaint();
			}
		}
		
		if (source.getCursor().getType() == Cursor.HAND_CURSOR) {
			if (source.getClientProperty("node") instanceof Node node) {
				MouseEvent e1 = SwingUtilities.convertMouseEvent((Component) e.getSource(), e, source.getParent());
				Point p = e1.getPoint();
//				System.out.println(p);
				((AbstractZoomableContainer)source.getParent()).convertFromScreen(p);
//				System.out.println(p);
				node.setX(p.x);
				node.setY(p.y);
				((AbstractZoomableContainer) source.getParent()).forceRepaint();
			}
		}
		
	}
	
}
