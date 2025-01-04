package fi.graphsheets.ui.highlight;

import java.awt.event.MouseEvent;

import javax.swing.JComponent;
import javax.swing.event.MouseInputAdapter;

/**
 * A mouse input adapter for IHighlightable components for highlighting on hover
 */
public class HighlightMouseMoveAdapter extends MouseInputAdapter {
	
	@Override
    public void mouseExited(MouseEvent e)
    {
        if(e.getSource() instanceof IHighlightable h && h instanceof JComponent c) {
        	h.clearHighlight();
        	c.repaint();
        }
        
    }
    @Override
    public void mouseEntered(MouseEvent e)
    {
        if(e.getSource() instanceof IHighlightable h && h instanceof JComponent c) {
        	h.setHighlight();
        	c.repaint();
        }
    }
	
}
