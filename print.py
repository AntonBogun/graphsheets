import os
from pathlib import Path

def print_ts_files(input_dir: str):
    input_path = Path(input_dir).resolve()
    if not input_path.exists():
        print(f"Error: Path '{input_dir}' does not exist.")
        return
    if not input_path.is_dir():
        print(f"Error: '{input_dir}' is not a directory.")
        return

    # Walk through the directory tree
    for root, _, files in os.walk(input_path):
        for file in files:
            if file.endswith(".js"):
                print(Path(root).joinpath(file).relative_to(input_path.parent))

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Print all .js files in a directory recursively.")
    parser.add_argument("input_dir", help="Input directory to scan recursively")
    args = parser.parse_args()

    print_ts_files(args.input_dir)