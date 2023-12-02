package main;

import java.awt.Cursor;
import java.awt.event.MouseEvent;
import java.awt.event.MouseMotionListener;

import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.text.BadLocationException;

import graphelements.Node;

@SuppressWarnings("serial")
public class NodeComponent extends JScrollPane{
	
	public Node node;
	public JTextArea textArea= new JTextArea();
	public NodeComponent(Node node) {
		super();
		this.getViewport().add(textArea);
        this.node = node;
        textArea.setLineWrap(true);
        
        textArea.getDocument().addDocumentListener(new DocumentListener() {

            @Override
            public void removeUpdate(DocumentEvent e) {

            }

            @Override
            public void insertUpdate(DocumentEvent e) {
            	
            }

            @Override
            public void changedUpdate(DocumentEvent e) {
            	try {
					node.setName(e.getDocument().getText(0, e.getDocument().getLength()));
				} catch (BadLocationException e1) {
					e1.printStackTrace();
				}
            }
        }
        );
        
        this.addMouseMotionListener(new MouseMotionListener() {

			@Override
			public void mouseDragged(MouseEvent e) {
				
			}

			@Override
			public void mouseMoved(MouseEvent e) {
				if (e.getX() > getWidth() - 50) {
					setCursor(Cursor.getPredefinedCursor(Cursor.E_RESIZE_CURSOR));
				} else if (e.getY() > getHeight() - 50) {
					setCursor(Cursor.getPredefinedCursor(Cursor.S_RESIZE_CURSOR));
				} else {
					setCursor(Cursor.getPredefinedCursor(Cursor.DEFAULT_CURSOR));
				}
			}
        	
        });
        
    }
	
	public void updateName() {
		textArea.setText(node.getName());
	}
	
	
}
