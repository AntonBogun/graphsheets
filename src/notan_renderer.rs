mod GraphElements;
mod id_manager;
use gs::cell::Cell;
use gs::cell::Idx;
use gs::rendering::GraphicsRenderer;
use gs::rendering::Render;
use gs::sheet::Sheet;
use GraphElements as gs;

use notan::draw::*;
use notan::prelude::*;

#[derive(AppState)]
struct State {
    cell: Cell,
    font: Font,
}

#[notan_main]
fn main() -> Result<(), String> {
  //make a sheet of 1s
   notan::init_with(setup).add_config(DrawConfig).draw(draw).build()
}

fn setup(gfx: &mut Graphics) -> State {
    let mut sheet = Sheet::<Idx<Cell>>::pure(Idx::from_raw(1));
    sheet = sheet.insert_row(1, &Idx::from_raw(1));
    sheet = sheet.insert_row(0, &Idx::from_raw(1));
    sheet = sheet.insert_column(1, &Idx::from_raw(1));
    sheet = sheet.insert_column(0, &Idx::from_raw(1));
    let mut cell = gs::cell::Cell::S(sheet);
    let font = gfx
            .create_font(include_bytes!("assets/unifont-15.1.04.otf"))
            .unwrap();
    State { cell: cell, font: font }
}

impl GraphicsRenderer for Draw {
  fn draw_line(&mut self, x1: f32, y1: f32, x2: f32, y2: f32) {
    self.line((x1, y1), (x2, y2));
  }
  fn draw_rect(&mut self, x: f32, y: f32, w: f32, h: f32) {
    self.rect((x, y), (w, h));
  }
  fn draw_text(&mut self, x: f32, y: f32, text: &str, font: &Font) {
    self.text(font, text).color(Color::BLUE).position(x, y);
  }
}

fn draw(gfx: &mut Graphics, state: &mut State) {
  let mut draw = gfx.create_draw();
  draw.clear(Color::BLACK);

  draw_cell(&state.cell)(&mut draw, state.font);

  gfx.render(&draw);
}

fn draw_cell(cell: &Cell) -> impl Fn(&mut Draw, Font) + '_ {
  |draw, font| {
    let mut ctx = gs::rendering::GraphicsContext {
      render_region: (0, 0, 0, 0),
      render_scale: 1.0,
      current_depth: 0,
      max_depth: 0,
      font: font,
    };
    cell.render(&mut ctx, draw)
  }
}

// struct Position(Vec3);
// struct Scale(f32);

// #[derive(Bundle)]
// pub struct NodeComponents {
//     pub node: gs::Node,
//     pub transform: Transform,
//     pub global_transform: GlobalTransform,
// }

// #[derive(Bundle)]
// pub struct CellComponents {
//     pub cell: gs::Cell,
//     pub transform: Transform,
//     pub global_transform: GlobalTransform,
// }

// fn main() {
//     App::build()
//         .add_plugins(DefaultPlugins)
//         .add_startup_system(setup.system())
//         .add_system(render_nodes.system())
//         .run();
// }

// fn setup(commands: &mut Commands) {
//     commands.spawn(NodeComponents {
//         position: Vec3::new(0.0, 0.0, 0.0),
//         scale: 1.0,
//         ..Default::default()
//     });
//     commands.spawn(CellComponents {
//         position: Vec3::new(50.0, 50.0, 0.0),
//         scale: 0.5,
//         ..Default::default()
//     });
// }
// fn render_nodes(
//     mut commands: Commands,
//     mut materials: ResMut<Assets<ColorMaterial>>,
//     query: Query<(&Transform, &Sprite)>,
// ) {
//     for (transform, _) in query.iter() {
//         commands.spawn(SpriteComponents {
//             material: materials.add(Color::rgb(0.7, 0.7, 0.7).into()),
//             transform: Transform::from_translation(transform.translation),
//             ..Default::default()
//         });
//     }
// }
