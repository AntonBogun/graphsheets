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
	fn draw_line(&mut self, x1 : f32, y1 : f32, x2 : f32, y2 : f32) {
	  draw_line(x1, y1, x2, y2, 15.0, WHITE);
	}
	fn draw_rect(&mut self, x : f32, y : f32, w : f32, h : f32) {
		draw_rectangle(x, y, w, h, WHITE);
	}
	fn draw_text(&mut self, x : f32, y : f32, text : &str) {
	  draw_text(text, x, y, 30.0, BLUE);
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
		render_origin : (0.0,0.0),
		render_scale : 1.0,
		current_depth : 0,
		max_depth : 0,
	  };
    loop {
        clear_background(Color::new(0.11, 0.12, 0.13, 1.0));


		cell.render(&mut ctx, &mut renderer);

        next_frame().await
    }
}