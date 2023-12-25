{
  description = "";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
    rust-overlay.inputs.nixpkgs.follows = "nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
    flake-utils.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { nixpkgs, rust-overlay, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };
      in
      with pkgs; let
        rust = rust-bin.nightly.latest.default.override {
          extensions = [ "rust-src" "llvm-tools-preview" ];
          targets = [ "wasm32-unknown-unknown" ];
        };
      in
      {
        devShell = mkShell {
          # buildInputs = [
          #   rust
          #   cargo-binutils
          #   pkg-config
          #   cmake
          #   libglvnd
          #   SDL2
          #   SDL2_ttf
          #   SDL2_image
          #   vulkan-loader
          # ] ++ (with xorg; [ libX11 libXext libXinerama libXi libXrandr ]);
          # LD_LIBRARY_PATH = with xorg; "${libX11}/lib:${libXext}/lib:${libXinerama}/lib:${libXi}/lib:${libXrandr}/lib:${libglvnd}/lib:${SDL2}/lib";
          # SDL_VIDEODRIVER = "x11";
          buildInputs = [
            rust
            cargo-binutils
            trunk
          ];
          nativeBuildInputs = [
            SDL2
            SDL2_ttf
          ];
        };
      }
    );
}
