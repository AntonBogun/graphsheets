struct NodeView{
	content: String,
	pos_x: i32,
	pos_y: i32,
}

impl Component for NodeView{
	type Message = ();
	type Properties = NodeView;

	fn create(props: Self::Properties, link: ComponentLink<Self>) -> Self {
		Self {
			props,
			link,
		}
	}

	fn update(&mut self, msg: Self::Message) -> bool {
		true
	}

	fn change(&mut self, props: Self::Properties) -> bool {
		self.props = props;
		true
	}

	fn view(&self) -> Html {
		html! {
			<div class="node" style={format!("left: {}px; top: {}px;", self.props.pos_x, self.props.pos_y)}>
				{self.props.content}
			</div>
		}
	}
}