use std::fmt::Debug;

pub trait Atomic : Debug {

}

impl Atomic for () {}
