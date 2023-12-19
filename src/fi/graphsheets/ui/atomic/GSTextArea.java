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

	private double font = 12;
	private double defaultFont = 12;
	private JTextArea textarea;
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
	}
	
	public JTextArea getTextArea() {
		return this.textarea;
	}
	
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
