use std::time::{SystemTime, Instant};

use sdl2::{render::Canvas, video::Window, pixels::Color, rect::{Point, Rect}, event::Event, keyboard::Keycode};
mod GraphElements;
use GraphElements as gs;
use gs::rendering::GraphicsRenderer;

fn find_sdl_gl_driver() -> Option<u32> {
    for (index, item) in sdl2::render::drivers().enumerate() {
        if item.name == "opengl" {
            return Some(index as u32);
        }
    }
    None
}

impl GraphicsRenderer for Canvas<Window>{
    fn draw_line(&mut self, x1: f32, y1: f32, x2: f32, y2: f32) {
        self.draw_line(Point::new(x1 as i32, y1 as i32), Point::new(x2 as i32, y2 as i32));
    }
    fn draw_rect(&mut self, x: f32, y: f32, w: f32, h: f32) {
        self.draw_rect(Rect::new(x as i32, y as i32, w as u32, h as u32));
    }
    fn draw_text(&mut self, x: f32, y: f32, text: &str, size: f32) {
        //self.
    }

}

fn main()  -> Result<(), String>{
    let sdl_context = sdl2::init().unwrap();
    let video_subsystem = sdl_context.video().unwrap();
    let ttf_context = sdl2::ttf::init().map_err(|e| e.to_string()).unwrap();
    let window = video_subsystem.window("Window", 800, 600)
        .opengl() // this line DOES NOT enable opengl, but allows you to create/get an OpenGL context from your window.
        .build()
        .unwrap();

    let mut canvas = window.into_canvas()
        .index(find_sdl_gl_driver().unwrap())
        .build()
        .unwrap();
    let texture_creator = canvas.texture_creator();

    let mut font = ttf_context.load_font("src/assets/unifont.ttf", 128).unwrap();
    font.set_style(sdl2::ttf::FontStyle::BOLD);
    
    
    let mut event_pump = sdl_context.event_pump().unwrap();

    'running: loop{
        let now = Instant::now();
        let surface = font.render("الجمهورية اللبنانية").solid(Color::RGBA(255, 0, 0, 255))
     .map_err(|e| e.to_string()).unwrap();
    let texture = texture_creator.create_texture_from_surface(&surface)
     .map_err(|e| e.to_string()).unwrap();

     canvas.set_draw_color(Color::RGBA(195, 217, 255, 255));
     canvas.clear();

    canvas.copy(&texture, None, Some(Rect::from_center(Point::new(100, 100), 1000, 100))).unwrap();
    canvas.present();

        for event in event_pump.poll_iter() {
            match event {
                Event::Quit { .. }
                | Event::KeyDown {
                    keycode: Some(Keycode::Escape),
                    ..
                } => break 'running,
                _ => {}
            }
        }
        println!("{}", now.elapsed().as_micros());
    }

    Ok(())
}