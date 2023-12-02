
#[derive(Properties, PartialEq)]
pub struct Graphprops {
  graph: Graph<NodeView>,
}

pub struct GraphView {}

impl Component for GraphView {
  
  type Message = ();

  type Properties = Graphprops;

  fn view(&self, ctx : &Context<Self>) -> Html {
    let graph: &mut Graph = &mut self.props().graph;

    


    // html! {
    //   <textarea style="
    //       white-space: pre;
    //       overflow-wrap: normal;
    //       width: 100px;
    //       height: 100px;
    //       max-width:100%;
    //       min-height:10px;
    //       min-width:10px;" placeholder="test" oninput={Callback::from(move |event: InputEvent| {
    //     let element = event.target_unchecked_into::<HtmlTextAreaElement>();
    //     element.style().set_property("width", "auto").unwrap();
    //     element.style().set_property("width", &*format!("{}px", element.scroll_width())).unwrap();
    //     element.style().set_property("height", "auto").unwrap();
    //     element.style().set_property("height", &*format!("{}px", element.scroll_height())).unwrap();
    //   })}></textarea>
    // }
  }

  fn update(&mut self, ctx : &Context<Self>, msg : Self::Message) -> bool {
    true
  }

  fn changed(&mut self, ctx : &Context<Self>, _old_props : &Self::Properties) -> bool {
    true
  }

  fn rendered(&mut self, ctx : &Context<Self>, first_render : bool) {}

  fn prepare_state(&self) -> Option<String> {
    None
  }

  fn destroy(&mut self, ctx : &Context<Self>) {}

  fn create(ctx : &Context<Self>) -> Self {
    GraphView {}
  }
}

// #[function_component(TextBox)]
// fn text_box() -> Html {
// 	let oninput: Callback<InputEvent> = Callback::from(move |event: InputEvent| {
// 		let element = event.target_unchecked_into::<HtmlTextAreaElement>();
// 		element.style().set_property("height", "auto").unwrap();
// 		element.style().set_property("height", &*format!("{}px",
// element.scroll_height())).unwrap();     });
// 	html! {
// 		<textarea style="height:auto;width:auto;" placeholder="test"
// {oninput}></textarea> 	}
// }