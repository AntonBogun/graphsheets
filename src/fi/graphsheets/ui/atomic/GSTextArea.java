package fi.graphsheets.ui.atomic;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.geom.AffineTransform;

import javax.swing.BorderFactory;
import javax.swing.JComponent;
import javax.swing.JPanel;
import javax.swing.JTextArea;
import javax.swing.border.BevelBorder;

import fi.graphsheets.graphelements.Node;
import fi.graphsheets.ui.IZoomableComponent;

@SuppressWarnings("serial")
public class GSTextArea implements IZoomableComponent {
	
//	private BufferedImage image;
	private double font = 12;
	private double defaultFont = 12;
	private JTextArea textarea;
//	private boolean isMipMapPaint = false;
//	private Color backgroundColor;
	
	public GSTextArea() {
		this.textarea = new JTextArea() {
			@Override
            public void paint(Graphics g) {
                if(font <= 2.0) {
                    g.setColor(getBackground());
                    g.fillRect(0, 0, 100, 100);
                    g.setColor(Color.BLACK);
                } else {
                    super.paint(g);
                }
            }
        };
		

		this.textarea.setBorder(BorderFactory.createBevelBorder(BevelBorder.LOWERED));
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
	
	public JTextArea getTextArea() {
		return this.textarea;
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
//	@Override
//	public void paint(Graphics g) {
////		if(font<12 && !isMipMapPaint) {
//			if (image != null) {
//				g.drawImage(image, 0, 0, null);
//			} else {
//				g.drawRect(0, 0, 100, 100);
//			}
////			g.clipRect(0, 0, 50, 50);
////			g.fillRect(0, 0, 50, 50);
//			g.dispose();
//		if(this.getParent() instanceof AbstractZoomableContainer parent) {
//			if(parent.isPaintingStopped()) {
//				System.out.println("caught");
//				
//				return;
////				FIXED FIX-ME clear the repaint queue. Actually, make custom RepaintManager!!!
//			}
//		}


	@Override
	public void setZoomTransform(AffineTransform zoomTransform) {
		font = defaultFont*zoomTransform.getScaleX();
		if(font < 2.0) {
			this.textarea.setBorder(null);
			return;
		}
		
		if(this.textarea.getBorder()==null) {
			this.textarea.setBorder(BorderFactory.createBevelBorder(BevelBorder.LOWERED));
		}
		
		textarea.setFont(textarea.getFont().deriveFont((float) font));
	}

	@Override
	public boolean isMipMapRequired(AffineTransform zoomTransform) {
		return font < 2.0 || defaultFont*zoomTransform.getScaleX() < 2.0;
	}
	
	//XXX add font properties to nodes, this function only works if all the nodes are the same
	public static boolean _TEMPisMipMapRequired(AffineTransform zoomTransform) {
		return 12*zoomTransform.getScaleX() < 2.0;
	}

	@Override
	public JComponent getMipMapComponent(Node node) {
		JComponent mipMap = new JComponent() {
			@Override
            public void paint(Graphics g) {
                g.setColor(Color.WHITE);
                g.fillRect(0, 0, 100, 100);
                g.setColor(Color.BLACK);
            }
        };

        mipMap.putClientProperty("node", node);
        mipMap.putClientProperty("controller", this);
        mipMap.putClientProperty("mipmap", true);
        
        return mipMap;
	}
}
