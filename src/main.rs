use native_dialog::FileDialog;
use serde_json;
use serde::{Serialize,Deserialize};
#[derive(Serialize,Deserialize)]
struct Node {
    id: String,
    text: String,
    url: String
}
#[derive(Serialize,Deserialize)]
struct Edge {
    text: String,
    source: String,
    target: String
}
fn load(nodes: &mut Vec<Node>, edges: &mut Vec<Edge>, file_path: Option<PathBuf>){
    let path = FileDialog::new()
        .set_location("~/")
        .add_filter("JSON File", &["json"])
        .show_open_single_file()
        .unwrap_or_else(|err| {
            eprintln!("Error: {:?}", err);
            std::process::exit(1);
        }).unwrap();
    let file = std::fs::read_to_string(path).unwrap();
    let nodes_read: Vec<Node> = serde_json::from_str(&file).unwrap();
    nodes.extend(nodes_read);
}
fn save(nodes: &mut Vec<Node>, edges: &mut Vec<Edge>){
    let path = FileDialog::new()
        .set_location("~/")
        .add_filter("JSON File", &["json"])
        .show_save_single_file()
        .unwrap_or_else(|err| {
            eprintln!("Error: {:?}", err);
            std::process::exit(1);
        }).unwrap();
    let file = std::fs::read_to_string(path).unwrap();
    let nodes_read: Vec<Node> = serde_json::from_str(&file).unwrap();
    nodes.extend(nodes_read);
}
fn main() {
    let mut nodes: Vec<Node> = Vec::new();
    let mut edges: Vec<Edge> = Vec::new();
    load(&mut nodes, &mut edges);
    println!("{}", nodes.len());
}


