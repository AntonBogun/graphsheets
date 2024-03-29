package fi.graphsheets.ui.atomic;

import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.event.MouseAdapter;
import java.awt.geom.AffineTransform;

import javax.swing.BorderFactory;
import javax.swing.JTextArea;
import javax.swing.border.BevelBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;

import fi.graphsheets.graphelements.Cell;
import fi.graphsheets.graphelements.Node;
import fi.graphsheets.graphelements.Sheet.SheetEntry;
import fi.graphsheets.ui.IZoomableComponent;
import fi.graphsheets.ui.ResizeMoveMouseAdapter;

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
		ResizeMoveMouseAdapter ma = new ResizeMoveMouseAdapter();
//		this.addMouseListener(ma);
		this.addMouseMotionListener(ma);
		
		
		
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

	@Override
	public AffineTransform getZoomTransform() {
		return zoomTransform;
		
	}

	@Override
	public int getDefaultCursor() {
		return Cursor.TEXT_CURSOR;
	}

}
