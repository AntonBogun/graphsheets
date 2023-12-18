package fi.graphsheets.ui.atomic;

import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Image;
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
	private boolean isMipMapPaint = false;
	
	public GSTextArea() {
		super();
//		this.getDocument().addDocumentListener(new DocumentListener() {
//
//			private Thread userInputDaemon;
//			@Override
//			public void insertUpdate(DocumentEvent e) {
//				if(getWidth()>0)
//					acknowledgeChange();
//				
//			}
//
//			@Override
//			public void removeUpdate(DocumentEvent e) {
//				if(getWidth()>0)
//					acknowledgeChange();
//				
//			}
//			
//			@Override
//			public void changedUpdate(DocumentEvent e) {
//				if(getWidth()>0)
//					acknowledgeChange();
//				
//			}
//			
//			public void acknowledgeChange() {
//				if(userInputDaemon == null) {
//					userInputDaemon = new Thread(() -> {try { Thread.sleep(200); computeMipMap(); repaint(); } catch (InterruptedException e1) {}});
//					userInputDaemon.setDaemon(true);
//					userInputDaemon.start();
//				} else {
//					userInputDaemon.interrupt();
//					userInputDaemon = null;
//					changedUpdate(null);
//				}
//			}
//			
//		});
	}
	
//	public void computeMipMap() {
//		double scale = 12.0/font;
//		int width = (int)(getWidth()*scale);
//		int height = (int)(getHeight()*scale);
//		image = new BufferedImage(width, height, BufferedImage.TYPE_USHORT_555_RGB);
//		Graphics2D g2d = image.createGraphics();
//		g2d.clipRect(0, 0, width, height);
////		g2d.setColor(Color.BLUE);
////		g2d.fillRect(0, 0, 100, 100);
//		isMipMapPaint = true;
//		g2d.scale(scale, scale);
//		super.paint(g2d);
//		g2d.scale(1/scale, 1/scale);
//		isMipMapPaint = false;
//		g2d.drawImage(image.getScaledInstance(width/2, height/2, Image.SCALE_FAST), 0, 0, null);
//		g2d.dispose();
//	}
//	
//	public boolean isMipMapped() {
//        return image != null;
//    }
//	
	@Override
	public void paint(Graphics g) {
//		if(font<12 && !isMipMapPaint) {
//			if (image != null) {
//				g.drawImage(image, 0, 0, null);
//			} else {
//				g.drawRect(0, 0, 100, 100);
//			}
////			g.clipRect(0, 0, 50, 50);
////			g.fillRect(0, 0, 50, 50);
//			g.dispose();
//		} else {
            super.paint(g);
//        }
	}

	@Override
	public void setZoomTransform(AffineTransform zoomTransform) {
		font = defaultFont*zoomTransform.getScaleX();
		if(font < 2.0) return;
		
		setFont(getFont().deriveFont((float) font));
	}
	
}
