package fi.graphsheets.ui.sheet;

import java.awt.Component;

import javax.swing.JTable;
import javax.swing.table.TableCellRenderer;

import fi.graphsheets.graphelements.Cell;

public class TextCellRenderer implements TableCellRenderer{

	@Override
	public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
		if(value instanceof Cell.Atomic.TextCell textcell) 
			return table.getDefaultRenderer(String.class).getTableCellRendererComponent(table, textcell.value(), isSelected, hasFocus, row, column);
		return table.getDefaultRenderer(String.class).getTableCellRendererComponent(table, "TEXT ERROR", isSelected, hasFocus, row, column);
	}
	
}
