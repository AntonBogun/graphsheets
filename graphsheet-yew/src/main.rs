use core::panic;
use web_sys::{HtmlTextAreaElement, Text};
use yew::events::InputEvent;
use yew::prelude::*;

#[function_component(App)]
fn app() -> Html {
  let on_input = {};
  html! {
      <TextBox />
  }
}

#[derive(Properties, PartialEq)]
pub struct TextBoxProps {}

pub struct TextBox {}

impl Component for TextBox {
  fn view(&self, cts : &Context<Self>) -> Html {
    html! {
      <textarea style="height:0;width:100;min-height:10px;min-width:10px;" placeholder="test" oninput={Callback::from(move |event: InputEvent| {
        let element = event.target_unchecked_into::<HtmlTextAreaElement>();
        element.style().set_property("height", "auto").unwrap();
        element.style().set_property("height", &*format!("{}px", element.scroll_height())).unwrap();
      })}></textarea>
    }
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

  type Message = ();

  type Properties = TextBoxProps;

  fn create(ctx : &Context<Self>) -> Self {
    TextBox {}
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

fn main() {
  yew::Renderer::<App>::new().render();
}
