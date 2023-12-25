use crate::GraphElements as ge;
use std::sync::{Arc, Mutex};
use bevy::prelude::*;

pub fn start(graph: ge::GraphRef){
	App::new()
		.add_plugins(DefaultPlugins)
		.add_systems(Startup, setup)
		.insert_resource(Graph(graph))
		.run();
}


fn setup(mut commands: Commands, graph: Res<Graph>){
	commands.spawn(Camera2dBundle::default());
	graph.0.lock().unwrap().nodes.iter().for_each(|node| {
		commands.spawn(NodeBundle {
			node: NodeComponent(node.clone()),
			sprite: SpriteBundle {
				sprite: Sprite {
					color: Color::rgb(0.0, 0.0, 1.0),
					custom_size: Some(Vec2::new(100.0, 100.0)),
					..default()
				},
				transform: Transform::from_xyz(node.lock().unwrap().position.0 as f32, node.lock().unwrap().position.1 as f32,0.0),
				..default()
			},
		});
	});
	graph.0.lock().unwrap().edges.iter().for_each(|edge| {
		commands.spawn(EdgeBundle {
			edge: EdgeComponent(edge.clone()),
			line: Line {
				line: ((Vec2::new(edge.lock().unwrap().get_from().lock().unwrap().position.0 as f32,edge.lock().unwrap().get_from().lock().unwrap().position.1 as f32)), 
				(Vec2::new(edge.lock().unwrap().get_to().lock().unwrap().position.0 as f32,edge.lock().unwrap().get_to().lock().unwrap().position.1 as f32)))
			},
		});
	});
}

#[derive(Resource)]
struct Graph(ge::GraphRef); 

#[derive(Component)]
struct NodeComponent(ge::NodeRef);

#[derive(Component)]
struct EdgeComponent(ge::EdgeRef);


#[derive(Bundle)]
struct NodeBundle {
	node: NodeComponent, 
	sprite: SpriteBundle,
}

#[derive(Bundle)]
struct EdgeBundle {
	edge: EdgeComponent,
	line: Line,
}


#[derive(Component)]
struct Line {
	line: (Vec2,Vec2),
}

impl Default for Line {
	fn default() -> Self {
		Line {
			line: (Vec2::new(0.0, 0.0), Vec2::new(100.0, 100.0)),
		}
	}
}