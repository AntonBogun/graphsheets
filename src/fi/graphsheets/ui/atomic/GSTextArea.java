package fi.graphsheets.ui.atomic;

import java.awt.Color;
import java.awt.Component;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Point;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionListener;
import java.awt.geom.AffineTransform;

import javax.swing.BorderFactory;
import javax.swing.JTextArea;
import javax.swing.SwingUtilities;
import javax.swing.border.BevelBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.graphelements.Sheet.SheetEntry;
import fi.graphsheets.ui.AbstractZoomableContainer;
import fi.graphsheets.ui.IZoomableComponent;

@SuppressWarnings("serial")
public class GSTextArea extends JTextArea implements IZoomableComponent {

	private double font = 12;
	private double defaultFont = 12;
	private boolean resizable;
	private AffineTransform zoomTransform = AffineTransform.getRotateInstance(0);
	public GSTextArea() {
		super();
		this.setMaximumSize(new Dimension(Integer.MAX_VALUE, Integer.MAX_VALUE));
		this.setBorder(BorderFactory.createBevelBorder(BevelBorder.LOWERED));
		this.setLineWrap(true);
		this.getDocument().addDocumentListener(new DocumentListener() {

			@Override
			public void removeUpdate(DocumentEvent e) {
				if(getClientProperty("node") instanceof Node node) {
					node.setCell(new Cell.Atomic.TextCell(getText()));
				} else if(getClientProperty("entry") instanceof SheetEntry entry) {
					entry.setCell(new Cell.Atomic.TextCell(getText()));
				} else {
//					System.out.println("ERROR NODE DOES NOT HAVE A SHEET ENTRY NOR A NODE");
				}

			}

			@Override
			public void insertUpdate(DocumentEvent e) {
				if(getClientProperty("node") instanceof Node node) {
					node.setCell(new Cell.Atomic.TextCell(getText()));
				} else if(getClientProperty("entry") instanceof SheetEntry entry) {
					entry.setCell(new Cell.Atomic.TextCell(getText()));
				} else {
//					System.out.println("ERROR NODE DOES NOT HAVE A SHEET ENTRY NOR A NODE");
				}

			}

			@Override
			public void changedUpdate(DocumentEvent e) {
//				updateFont();

			}
		});
		
		this.addMouseMotionListener(new MouseMotionListener() {
			@Override
			public void mouseMoved(MouseEvent e) {
//				System.out.println(e.getPoint());
//				System.out.println(getWidth() + " " + getHeight());
				
				if(e.getX() < 10 && e.getY() < 10) {
					setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
				} else if(e.getX() > getWidth() - 10 && e.getY() > getHeight() - 10) {
					setCursor(Cursor.getPredefinedCursor(Cursor.SE_RESIZE_CURSOR));
				} else if (e.getX() > getWidth() - 10) {
					setCursor(Cursor.getPredefinedCursor(Cursor.E_RESIZE_CURSOR));
				} else if (e.getY() > getHeight() - 10) {
                    setCursor(Cursor.getPredefinedCursor(Cursor.S_RESIZE_CURSOR));
				} else {
					setCursor(Cursor.getPredefinedCursor(Cursor.TEXT_CURSOR));
				}
			}

			//FIXME when resizing text area to very large sized, zooming does not behave as expected (and parts of the textarea are not rendered)
			@Override
			public void mouseDragged(MouseEvent e) {
//				((AbstractZoomableContainer)getParent()).convertFromScreen(p);
				if(getCursor().getType() == Cursor.E_RESIZE_CURSOR) {
					Point p = new Point((int) (e.getX()/zoomTransform.getScaleX()), (int) (e.getY()/zoomTransform.getScaleY()));
//					System.out.println(p);
//					((AbstractZoomableContainer)getParent()).convertFromScreen(p);
					if(getClientProperty("node") instanceof Node node && p.x<1000) {
						node.setWidth(p.x);
						((AbstractZoomableContainer)getParent()).forceRepaint();
					}
				}
				
				if(getCursor().getType() == Cursor.S_RESIZE_CURSOR) {
					Point p = new Point((int) (e.getX()/zoomTransform.getScaleX()), (int) (e.getY()/zoomTransform.getScaleY()));
					if(getClientProperty("node") instanceof Node node && p.y<1000) {
						node.setHeight(p.y);
						((AbstractZoomableContainer)getParent()).forceRepaint();
					}
				}
				
				if(getCursor().getType() == Cursor.SE_RESIZE_CURSOR) {
					Point p = new Point((int) (e.getX()/zoomTransform.getScaleX()), (int) (e.getY()/zoomTransform.getScaleY()));
					if(getClientProperty("node") instanceof Node node && p.x<1000 && p.y<1000) {
						node.setWidth(p.x);
						node.setHeight(p.y);
						((AbstractZoomableContainer)getParent()).forceRepaint();
					}
				}
				
				if (getCursor().getType() == Cursor.HAND_CURSOR) {
					if (getClientProperty("node") instanceof Node node) {
						MouseEvent e1 = SwingUtilities.convertMouseEvent((Component) e.getSource(), e, getParent());
						Point p = e1.getPoint();
//						System.out.println(p);
						((AbstractZoomableContainer)getParent()).convertFromScreen(p);
//						System.out.println(p);
						node.setX(p.x);
						node.setY(p.y);
						((AbstractZoomableContainer) getParent()).forceRepaint();
					}
				}
				
			}
		});
		
		
		
	}
	
	@Override
    public void paint(Graphics g) {
        if(font < 1.0) {
            g.setColor(getBackground());
            g.fillRect(0, 0, 100, 100);
            g.setColor(Color.BLACK);
        } else {
            super.paint(g);
        }
    }
	

	
	@Override
	public void setZoomTransform(AffineTransform zoomTransform) {
		this.zoomTransform = zoomTransform;
		font = defaultFont*zoomTransform.getScaleX();
		if(font < 1.0) {
			this.setBorder(null);
			return;
		}
		
		if(this.getBorder()==null) {
			this.setBorder(BorderFactory.createBevelBorder(BevelBorder.LOWERED));
		}
		
		setFont(getFont().deriveFont((float) font));
	}

}
