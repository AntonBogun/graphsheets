package fi.graphsheets.ui.atomic;

import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;

import javax.swing.JTextArea;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;

import fi.graphsheets.ui.IZoomableComponent;

@SuppressWarnings("serial")
public class GSTextArea extends JTextArea implements IZoomableComponent {
	
	private BufferedImage image;
	private double font = 12;
	private double defaultFont = 12;
	
	public void computeMipMap() {
		image = new BufferedImage(getWidth(), getHeight(), BufferedImage.TYPE_BYTE_GRAY);
		Graphics2D g2d = image.createGraphics();
		g2d.clipRect(0, 0, getWidth(), getHeight());
//		g2d.setColor(Color.BLUE);
//		g2d.fillRect(0, 0, 100, 100);
		super.paintBorder(g2d);
		super.paintComponent(g2d);
		g2d.dispose();
	}
	
	public boolean isMipMapped() {
        return image != null;
    }
	
	@Override
	public void paint(Graphics g) {
		if(font<12) {
			if (image != null) {
				g.drawImage(image, 0, 0, null);
			} else {
				g.drawRect(0, 0, 100, 100);
			}
//			g.clipRect(0, 0, 50, 50);
//			g.fillRect(0, 0, 50, 50);
			g.dispose();
		} else {
            super.paint(g);
        }
	}

	@Override
	public void setZoomTransform(AffineTransform zoomTransform) {
		font = defaultFont*zoomTransform.getScaleX();
		if(font < 2.0) return;
		
		setFont(getFont().deriveFont((float) font));
	}
	
}
