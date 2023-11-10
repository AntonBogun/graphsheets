use notan::{graphics::renderer, draw::Font};

use super::cell::Cell;

pub struct GraphicsContext{
    pub render_region: (u32, u32, u32, u32),
    pub render_scale: f32,
    pub current_depth: u32,
    pub max_depth: u32,
    pub font: Font,
}

pub trait GraphicsRenderer{
    fn draw_line(&mut self, x1: f32, y1: f32, x2: f32, y2: f32);
    fn draw_rect(&mut self, x: f32, y: f32, w: f32, h: f32);
    fn draw_text(&mut self, x: f32, y: f32, text: &str, font: &Font);
 }

pub trait Render{
    fn render(&self, ctx: &mut GraphicsContext, renderer: &mut dyn GraphicsRenderer);
}

impl Render for Cell{
    fn render(&self, ctx: &mut GraphicsContext, renderer: &mut dyn GraphicsRenderer) {
        match self {
            Cell::S(sheet) => {
                for (x, y, id) in sheet.iter() {
                    let (x, y) = (x as f32, y as f32);
                    let (x, y) = (x * ctx.render_scale, y * ctx.render_scale);
                    let (x, y) = (x + ctx.render_region.0 as f32, y + ctx.render_region.1 as f32);
                    let (w, h) = (50.0 * ctx.render_scale, 50.0 * ctx.render_scale);
                    renderer.draw_rect(x*51.0, y*51.0, w, h);
                    renderer.draw_text(x*51.0, y*51.0, id.raw.to_string().as_str(), &ctx.font);
                }
            },
            Cell::Graph { nodes, edges } => todo!(),
            Cell::Atom(_) => todo!(),
        }
    }   
}