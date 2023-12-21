package fi.graphsheets.ui.atomic;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.geom.AffineTransform;

import javax.swing.BorderFactory;
import javax.swing.JTextArea;
import javax.swing.border.BevelBorder;

import fi.graphsheets.ui.IZoomableComponent;

@SuppressWarnings("serial")
public class GSTextArea extends JTextArea implements IZoomableComponent {

	private double font = 12;
	private double defaultFont = 12;
//	private Color backgroundColor;
	
	public GSTextArea() {
		super();
		this.setBorder(BorderFactory.createBevelBorder(BevelBorder.LOWERED));
		this.setLineWrap(true);
		
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
