package fi.graphsheets.ui;

import java.awt.Component;
import java.awt.Cursor;
import java.awt.Point;
import java.awt.event.MouseEvent;
import java.awt.geom.AffineTransform;

import javax.swing.JComponent;
import javax.swing.SwingUtilities;
import javax.swing.event.MouseInputAdapter;

import fi.graphsheets.graphelements.Node;
import fi.graphsheets.graphelements.Sheet.SheetEntry;
import fi.graphsheets.ui.atomic.GSTextArea;
import fi.graphsheets.ui.sheet.SheetContainerFactory;

public class ResizeMoveMouseAdapter extends MouseInputAdapter {
	boolean dragging = false;
	
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
			source.putClientProperty("ResizeMove", Cursor.HAND_CURSOR);
		} else if(e.getX() > source.getWidth() - 10 && e.getY() > source.getHeight() - 10) {
			source.setCursor(Cursor.getPredefinedCursor(Cursor.SE_RESIZE_CURSOR));
			source.putClientProperty("ResizeMove", Cursor.SE_RESIZE_CURSOR);
		} else if (e.getX() > source.getWidth() - 10) {
			source.setCursor(Cursor.getPredefinedCursor(Cursor.E_RESIZE_CURSOR));
			source.putClientProperty("ResizeMove", Cursor.E_RESIZE_CURSOR);
		} else if (e.getY() > source.getHeight() - 10) {
			source.setCursor(Cursor.getPredefinedCursor(Cursor.S_RESIZE_CURSOR));
			source.putClientProperty("ResizeMove", Cursor.S_RESIZE_CURSOR);
		} else if(GlobalState.shouldProcessAddMouseEvents()){
			source.setCursor(Cursor.getPredefinedCursor(Cursor.CROSSHAIR_CURSOR));
			source.putClientProperty("ResizeMove", Cursor.CROSSHAIR_CURSOR);
		} else {
			source.putClientProperty("ResizeMove", defaultCursor);
			source.setCursor(Cursor.getPredefinedCursor(defaultCursor));
		}
	}
	
	

	//FIXME when resizing text area to very large sized, zooming does not behave as expected (and parts of the textarea are not rendered)
//	private MouseEvent prev;
	@Override
	public void mouseDragged(MouseEvent e) {
		int defaultCursor = -1;
		JComponent source = (JComponent) e.getSource();
		Point screenP = SwingUtilities.convertPoint(source, new Point(e.getX(), e.getY()), GlobalState.getRootFrame().getContentPane().getComponent(0));
		if(source instanceof IZoomableComponent comp) defaultCursor = comp.getDefaultCursor();
		if(source instanceof AbstractZoomableContainer comp) defaultCursor = comp.getDefaultCursor();
//		System.out.println(e.getPoint());
//		System.out.println(prev!=null);
//		if(prev!=null) System.out.println(prev.getPoint());
//		if(prev!=null && e.getPoint()==prev.getPoint()) {
//			source.putClientProperty("ResizeMove", defaultCursor);
//			source.setCursor(Cursor.getPredefinedCursor(defaultCursor));
//			e.consume();
//			return;
//		}
//		prev = e;
		AffineTransform zoomTransform = getZoomTransform(source);
		Point p = new Point((int) (e.getX()/zoomTransform.getScaleX()), (int) (e.getY()/zoomTransform.getScaleY()));
		Node node = getNode(source);
		SheetEntry entry = getSheetEntry(source);
		boolean graph = node != null;
		AbstractZoomableContainer parent = getAbstractZoomableContainer(source);
		switch((int)source.getClientProperty("ResizeMove")) {
			case Cursor.E_RESIZE_CURSOR:
				System.out.println("what");
				if((p.x<1000 || !(source instanceof GSTextArea)) && p.x>10) {
					if(graph) {
						node.setWidth(p.x);
					} else {
						SheetContainerFactory.updateSizeOfCell(source, entry.x(), entry.y(), p.x, true);
					}
					parent.forceRepaint();
				}
	        break;
            case Cursor.S_RESIZE_CURSOR:
				if ((p.y < 1000 || !(source instanceof GSTextArea)) && p.y > 10) {
					if (graph) {
						node.setHeight(p.y);
					} else {
						SheetContainerFactory.updateSizeOfCell(source, entry.x(), entry.y(), p.y, false);
					}
					parent.forceRepaint();
				}
//            	if((p.y<1000 || !(source instanceof GSTextArea)) && p.y>10) {
//                    node.setHeight(p.y);
//            	}
            break;
			case Cursor.SE_RESIZE_CURSOR:
				if (((p.x < 1000 && p.y < 1000) || !(source instanceof GSTextArea)) && p.x > 10 && p.y > 10) {
					if (graph) {
						node.setWidth(p.x);
						node.setHeight(p.y);
					} else {
						SheetContainerFactory.updateSizeOfCell(source, entry.x(), entry.y(), p.x, true);
						SheetContainerFactory.updateSizeOfCell(source, entry.x(), entry.y(), p.y, false);
					}
					parent.forceRepaint();
				}
//				if (((p.x < 1000 && p.y < 1000) || !(source instanceof GSTextArea)) && p.x > 10 && p.y > 10) {
//					node.setWidth(p.x);
//					node.setHeight(p.y);
//				}
			break;
		case Cursor.HAND_CURSOR:
			MouseEvent e1 = SwingUtilities.convertMouseEvent((Component) e.getSource(), e, source.getParent());
			p = e1.getPoint();
			parent.convertFromScreen(p);
			if(graph) {
				node.setX(p.x);
				node.setY(p.y);
			} else {
			}
			parent.forceRepaint();
			break;
		}
		
		
		
//		
//		if((int)source.getClientProperty("ResizeMove") == Cursor.E_RESIZE_CURSOR) {
//			
////			System.out.println(p);
////			((AbstractZoomableContainer)getParent()).convertFromScreen(p);
//			Node node = null;
//			if(source.getClientProperty("node") instanceof Node node1) node = node1;
//			else if(((JComponent) source.getParent()).getClientProperty("node") instanceof Node node1) node = node1;
//			
//
//			AbstractZoomableContainer parent = null;
//			if(source.getParent() instanceof AbstractZoomableContainer cont) parent = cont;
//			else if (source.getParent().getParent() instanceof AbstractZoomableContainer cont) parent = cont;
//			
//			if((p.x<1000 || !(source instanceof GSTextArea)) && p.x>10) {
//				node.setWidth(p.x);
//				parent.forceRepaint();
//			}
//		}
//		
//		if((int)source.getClientProperty("ResizeMove") == Cursor.S_RESIZE_CURSOR) {
//			Point p = new Point((int) (e.getX()/zoomTransform.getScaleX()), (int) (e.getY()/zoomTransform.getScaleY()));
//			Node node = null;
//			if(source.getClientProperty("node") instanceof Node node1) node = node1;
//			else if(((JComponent) source.getParent()).getClientProperty("node") instanceof Node node1) node = node1;
//			
//			
//
//			AbstractZoomableContainer parent = null;
//			if(source.getParent() instanceof AbstractZoomableContainer cont) parent = cont;
//			else if (source.getParent().getParent() instanceof AbstractZoomableContainer cont) parent = cont;
//			
//			if((p.y<1000 || !(source instanceof GSTextArea)) && p.y>10) {
//				node.setHeight(p.y);
//				parent.forceRepaint();
//			}
//		}
//		
//		if((int)source.getClientProperty("ResizeMove") == Cursor.SE_RESIZE_CURSOR) {
//			Point p = new Point((int) (e.getX()/zoomTransform.getScaleX()), (int) (e.getY()/zoomTransform.getScaleY()));
//			Node node = null;
//			if(source.getClientProperty("node") instanceof Node node1) node = node1;
//			else if(((JComponent) source.getParent()).getClientProperty("node") instanceof Node node1) node = node1;
//			
//
//			AbstractZoomableContainer parent = null;
//			if(source.getParent() instanceof AbstractZoomableContainer cont) parent = cont;
//			else if (source.getParent().getParent() instanceof AbstractZoomableContainer cont) parent = cont;
//			
//			if(((p.x<1000 && p.y<1000) || !(source instanceof GSTextArea)) && p.x>10 && p.y>10) {
//				node.setWidth(p.x);
//				node.setHeight(p.y);
//				parent.forceRepaint();
//			}
//		}
		
//		if ((int)source.getClientProperty("ResizeMove") == Cursor.HAND_CURSOR) {
//			Node node = null;
//			if(source.getClientProperty("node") instanceof Node node1) node = node1;
//			else if(((JComponent) source.getParent()).getClientProperty("node") instanceof Node node1) node = node1;
//			MouseEvent e1 = SwingUtilities.convertMouseEvent((Component) e.getSource(), e, source.getParent());
//			Point p = e1.getPoint();
////				System.out.println(p);
//			AbstractZoomableContainer parent = null;
//			if(source.getParent() instanceof AbstractZoomableContainer cont) parent = cont;
//			else if (source.getParent().getParent() instanceof AbstractZoomableContainer cont) parent = cont;
//			parent.convertFromScreen(p);
////				System.out.println(p);
//			node.setX(p.x);
//			node.setY(p.y);
//			parent.forceRepaint();
//		
//		}
		
	}
	
	private Node getNode(JComponent source) {
        Node node = null;
        if(source.getClientProperty("node") instanceof Node node1) node = node1;
        else if(((JComponent) source.getParent()).getClientProperty("node") instanceof Node node1) node = node1;
        return node;
    }
		
	private AffineTransform getZoomTransform(JComponent source) {
		AffineTransform zoomTransform = null;
		if (source instanceof IZoomableComponent comp) zoomTransform = comp.getZoomTransform();
		if (source instanceof AbstractZoomableContainer comp) zoomTransform = comp.getZoomTransform();
		return zoomTransform;
    }
	
	private SheetEntry getSheetEntry(JComponent source) {
		SheetEntry entry = null;
		if (source.getClientProperty("entry") instanceof SheetEntry entry1) entry = entry1;
		else if (((JComponent) source.getParent()).getClientProperty("entry") instanceof SheetEntry entry1) entry = entry1;
		return entry;
	}
	
	private AbstractZoomableContainer getAbstractZoomableContainer(JComponent source) {
		AbstractZoomableContainer parent = null;
		if (source.getParent() instanceof AbstractZoomableContainer cont) parent = cont;
		else if (source.getParent().getParent() instanceof AbstractZoomableContainer cont) parent = cont;
		return parent;
	}

	
}
