use std::cell::RefCell;
use std::rc::Rc;
use std::rc::Weak;
use std::collections::HashSet;
// use bevy::prelude::*;

mod id_manager;
mod GraphElements;
use GraphElements as gs;


fn main() {
    let foo = Rc::new(vec![1.0, 2.0, 3.0]);

    // The two syntaxes below are equivalent.
    let a = foo.clone();
    let b = Rc::clone(&foo);

    // a, b, and foo are all `Rc` that point to the same memory location
    println!("{} instances of the Rc are alive", Rc::strong_count(&foo));

    println!("Grid ID: {}", id_manager::grid_id());
    println!("Node ID: {}", id_manager::node_id());
    println!("Second Node ID: {}", id_manager::node_id());
    println!("another ID: {}", id_manager::node_id());
    println!("another ID: {}", id_manager::node_id());

    // Outputs: 3 instances of the Rc are alive
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
