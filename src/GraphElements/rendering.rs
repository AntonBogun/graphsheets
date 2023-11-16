use macroquad::prelude::{Color, WHITE, BLUE};
use notan::{draw::Font, graphics::renderer};

use super::cell::Cell;

pub struct GraphicsContext {
  pub render_origin : (f32, f32),
  pub render_scale : f32,
  pub current_depth : u32,
  pub max_depth : u32,
  //pub font : Font,
}

pub trait GraphicsRenderer {
  fn draw_line(&mut self, x1 : f32, y1 : f32, x2 : f32, y2 : f32);
  fn draw_rect(&mut self, x : f32, y : f32, w : f32, h : f32, color: Color);
  fn draw_text(&mut self, x : f32, y : f32, text : &str, size: f32);//, font : &Font);
}

pub trait Render {
  fn render(&self, ctx : &mut GraphicsContext, renderer : &mut dyn GraphicsRenderer);
}

impl Render for Cell {
  fn render(&self, ctx : &mut GraphicsContext, renderer : &mut dyn GraphicsRenderer) {
    match self {
      Cell::S(sheet) => {
        for ((x, y), id) in sheet.iter() {
          let (x, y) = (x as f32 * 50.0, y as f32 * 50.0);
          let (x, y) = (x * ctx.render_scale, y * ctx.render_scale);
          let (w, h) = (50.0 * ctx.render_scale, 50.0 * ctx.render_scale);
          let (x, y) = (
            x + ctx.render_origin.0 as f32,
            y + ctx.render_origin.1 as f32,
          );

          renderer.draw_rect(x, y, w, h, WHITE);
          if(12.0*ctx.render_scale<8.0){
            renderer.draw_rect(x, y, 12.0*ctx.render_scale*2.0, 12.0*ctx.render_scale, BLUE);
          } else {
            renderer.draw_text(x, y, "2", 12.0*ctx.render_scale);//, &ctx.font);

          }
          
        }
      }
      Cell::Graph { nodes, edges } => todo!(),
      Cell::Atom(_) => todo!(),
    }
  }
}
