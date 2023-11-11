mod GraphElements;
mod id_manager;
use gs::cell::Cell;
use gs::cell::Idx;
use gs::rendering::GraphicsRenderer;
use gs::rendering::Render;
use gs::sheet::Sheet;
use GraphElements as gs;

use macroquad::prelude::*;

struct MacroquadRenderer {}

impl GraphicsRenderer for MacroquadRenderer {
  fn draw_line(&mut self, x1: f32, y1: f32, x2: f32, y2: f32) {
    draw_line(x1, y1, x2, y2, 15.0, WHITE);
  }
  fn draw_rect(&mut self, x: f32, y: f32, w: f32, h: f32, color: Color) {
    draw_rectangle(x, y, w, h, color);
  }
  fn draw_text(&mut self, x: f32, y: f32, text: &str, size: f32) {
    draw_text(text, x, y, size, BLUE);
  }
}

#[macroquad::main("Hello Macroquad")]
async fn main() {
  let mut renderer = MacroquadRenderer {};
  let mut sheet = Sheet::<Idx<Cell>>::pure(Idx::from_raw(1));
  sheet.insert_row(1, &Idx::from_raw(1));
  sheet.insert_row(0, &Idx::from_raw(1));
  sheet.insert_column(1, &Idx::from_raw(1));
  sheet.insert_column(0, &Idx::from_raw(1));
  let mut cell = gs::cell::Cell::S(sheet);

  let mut ctx = gs::rendering::GraphicsContext {
    render_origin: (0.0, 0.0),
    render_scale: 1.0,
    current_depth: 0,
    max_depth: 0,
  };

  let mut panning = false;
  let mut initial_mouse_pos: (f32,f32) = (0.0, 0.0);
  let render_scale = 1.0;
  let mut fps = 0;

  loop {
    clear_background(Color::new(0.11, 0.12, 0.13, 1.0));
	draw_text(format!("FPS: {}", get_fps()).as_str(), 0., 16., 32., WHITE);

    if (is_mouse_button_pressed(MouseButton::Middle)) {
      panning = true;
      initial_mouse_pos = mouse_position();
	}

	if(is_mouse_button_released(MouseButton::Middle)) {
	  panning = false;
	}

	if (panning) {
	  let (dx, dy) = (mouse_position().0 - initial_mouse_pos.0, mouse_position().1 - initial_mouse_pos.1);
	  ctx.render_origin.0 += dx as f32;
	  ctx.render_origin.1 += dy as f32;
	  initial_mouse_pos = mouse_position();
	}

	match mouse_wheel(){
		(x,y) => {
		  ctx.render_scale += y * 0.001;
		}
	}

	if (is_mouse_button_pressed(MouseButton::Right)) {
	  match &mut cell {
		Cell::S(sheet) => sheet.insert_row(0, &Idx::from_raw(2)),
		Cell::Atom(_) => todo!(),
		Cell::Graph { nodes, edges } => todo!(),
	  }
	}

	if (is_mouse_button_pressed(MouseButton::Left)) {
	  match &mut cell {
		Cell::S(sheet) => sheet.insert_column(0, &Idx::from_raw(2)),
		Cell::Atom(_) => todo!(),
		Cell::Graph { nodes, edges } => todo!(),
	  }
	}

	
    cell.render(&mut ctx, &mut renderer);
	
    next_frame().await
  }
}
