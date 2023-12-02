use core::panic;
use web_sys::{HtmlTextAreaElement, Text};
use yew::events::InputEvent;
use yew::prelude::*;
use graph_elements::graph::Graph;
use crate::GraphView::GraphView;


#[function_component(App)]
fn app() -> Html {
  let on_input = {};
  html! {
      <GraphView />
  }
}


fn main() {
  let mut graph: Graph<&str> = Graph::pure("1");
  yew::Renderer::<App>::new().render();
}
