mod id_manager;
mod GraphElements;
use GraphElements as gs;
use gs::sheet::Sheet;

use notan::draw::*;
use notan::prelude::*;

#[notan_main]
fn main() -> Result<(), String> {
    //make a sheet of 1s
    let mut sheet = Sheet::<i32>::pure(1);

    notan::init().add_config(DrawConfig).draw(draw).build()
}

fn draw(gfx: &mut Graphics) {
    let mut draw = gfx.create_draw();
    draw.clear(Color::BLACK);

    draw.line((20.0, 30.0), (780.0, 30.0)).width(4.0);

    draw.triangle((100.0, 100.0), (150.0, 200.0), (200.0, 100.0))
        .color(Color::YELLOW);

    draw.rect((500.0, 100.0), (200.0, 150.0))
        .fill_color(Color::GREEN)
        .fill()
        .stroke_color(Color::WHITE)
        .stroke(15.0);

    draw.ellipse((400.0, 300.0), (50.0, 100.0))
        .color(Color::RED)
        .rotate_degrees(-45.0);

    draw.circle(40.0)
        .position(600.0, 450.0)
        .fill_color(Color::BLUE)
        .fill()
        .stroke_color(Color::WHITE)
        .stroke(5.0);

    draw.rect((100.0, 250.0), (150.0, 100.0))
        .corner_radius(20.0)
        .color(Color::ORANGE)
        .stroke(15.0);

    draw.star(10, 80.0, 40.0)
        .position(150.0, 480.0)
        .fill_color(Color::PINK)
        .fill()
        .stroke_color(Color::PURPLE)
        .stroke(6.0);

    draw.polygon(5, 50.0)
        .position(350.0, 150.0)
        .color(Color::WHITE)
        .stroke(8.0);

    draw.polygon(8, 80.0)
        .position(350.0, 450.0)
        .fill_color(Color::WHITE)
        .fill()
        .stroke_color(Color::ORANGE)
        .stroke(8.0);

    gfx.render(&draw);
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
