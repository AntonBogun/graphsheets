#!/usr/bin/env python3
"""
TypeScript File Merger

Merges TypeScript files with ES module imports into a single file.
Builds dependency graph to determine correct merge order and handles .glsl files.
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Set, Optional
from dataclasses import dataclass


@dataclass
class ImportStatement:
    """Represents a parsed import statement"""
    imported_items: List[str]
    source_path: str
    line_number: int


class TypeScriptMerger:
    def __init__(self, src_dir: str, output_file: str = "merged.ts"):
        self.src_dir = Path(src_dir)
        self.output_file = output_file
        self.dependency_graph: Dict[str, Set[str]] = {}
        self.file_contents: Dict[str, str] = {}
        self.glsl_files: Dict[str, str] = {}
        
        # Regex patterns for parsing imports
        self.import_pattern = re.compile(
            r'^\s*import\s+(?:{([^}]+)}|\*\s+as\s+\w+|\w+)\s+from\s+["\']([^"\']+)["\'];?\s*$',
            re.MULTILINE
        )
        
    def discover_files(self) -> List[Path]:
        """Find all TypeScript and GLSL files in the source directory"""
        ts_files = list(self.src_dir.rglob("*.ts"))
        glsl_files = list(self.src_dir.rglob("*.glsl"))
        
        print(f"Found {len(ts_files)} TypeScript files and {len(glsl_files)} GLSL files")
        return ts_files, glsl_files
    
    def normalize_import_path(self, import_path: str, current_file: Path) -> Optional[str]:
        """Convert import path to normalized file path, handling .js -> .ts conversion"""
        if not import_path.startswith('.'):
            return None  # Skip non-relative imports
            
        # Convert .js extension to .ts (TypeScript convention)
        if import_path.endswith('.js'):
            import_path = import_path[:-3] + '.ts'
        elif not import_path.endswith('.ts'):
            import_path += '.ts'
            
        # Resolve relative path
        resolved_path = (current_file.parent / import_path).resolve()
        
        try:
            # Return path relative to src directory, normalize path separators
            relative_path = str(resolved_path.relative_to(self.src_dir.resolve()))
            # Normalize to forward slashes for consistency
            return relative_path.replace('\\', '/')
        except ValueError:
            return None  # Path is outside src directory
    
    def parse_imports(self, content: str, file_path: Path) -> List[ImportStatement]:
        """Extract import statements from file content"""
        imports = []
        
        for match in self.import_pattern.finditer(content):
            imported_items = []
            if match.group(1):  # Named imports
                imported_items = [item.strip() for item in match.group(1).split(',')]
            
            source_path = self.normalize_import_path(match.group(2), file_path)
            if source_path:  # Only include relative imports
                imports.append(ImportStatement(
                    imported_items=imported_items,
                    source_path=source_path,
                    line_number=content[:match.start()].count('\n') + 1
                ))
                
        return imports
    
    def build_dependency_graph(self, ts_files: List[Path]):
        """Build dependency graph from import statements"""
        # Normalize all file paths first
        normalized_files = {}
        for file_path in ts_files:
            relative_path = str(file_path.relative_to(self.src_dir)).replace('\\', '/')
            normalized_files[relative_path] = file_path
            
        for relative_path, file_path in normalized_files.items():
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                self.file_contents[relative_path] = content
                imports = self.parse_imports(content, file_path)
                
                dependencies = set()
                for imp in imports:
                    if imp.source_path in normalized_files:
                        dependencies.add(imp.source_path)
                        
                self.dependency_graph[relative_path] = dependencies
                
            except Exception as e:
                print(f"Warning: Failed to process {file_path}: {e}")
    
    def detect_circular_dependencies(self, graph: Dict[str, Set[str]]) -> List[List[str]]:
        """Detect circular dependencies using DFS with proper cycle tracking"""
        white = set(graph.keys())  # Unvisited nodes
        gray = set()   # Currently being processed
        black = set()  # Completely processed
        cycles = []
        
        def dfs(node: str, path: List[str]) -> bool:
            if node in gray:  # Back edge found - cycle detected
                if node in path:  # Only report real cycles
                    cycle_start = path.index(node)
                    cycle = path[cycle_start:] + [node]
                    if len(cycle) > 2:  # Only cycles with more than one unique node
                        cycles.append(cycle)
                return True
                
            if node in black:  # Already processed
                return False
                
            # Mark as being processed
            white.discard(node)
            gray.add(node)
            
            # Explore neighbors
            for neighbor in graph.get(node, []):
                if neighbor in graph:  # Make sure neighbor exists in current graph
                    dfs(neighbor, path + [node])
                    
            # Mark as completely processed
            gray.remove(node)
            black.add(node)
            return False
        
        # Start DFS from all unvisited nodes
        while white:
            start_node = next(iter(white))
            dfs(start_node, [])
                
        return cycles

    def topological_sort_with_cycle_breaking(self) -> List[str]:
        """Sort files in dependency order, breaking cycles if necessary"""
        # Create a copy of the graph to modify
        graph = {node: deps.copy() for node, deps in self.dependency_graph.items()}
        
        # Detect and break cycles once
        cycles = self.detect_circular_dependencies(graph)
        if cycles:
            print("Warning: Breaking circular dependencies:")
            for cycle in cycles:
                print(f"  Cycle: {' -> '.join(cycle)}")
                # Break the cycle by removing the last dependency
                if len(cycle) >= 2:
                    from_node = cycle[-2]
                    to_node = cycle[-1]
                    if to_node in graph.get(from_node, set()):
                        print(f"  Breaking: {from_node} -> {to_node}")
                        graph[from_node].discard(to_node)
        
        # Calculate in-degrees
        in_degree = {node: 0 for node in graph}
        for node in graph:
            for neighbor in graph[node]:
                if neighbor in in_degree:
                    in_degree[neighbor] += 1
        
        # Start with nodes that have no dependencies
        queue = [node for node, degree in in_degree.items() if degree == 0]
        result = []
        
        while queue:
            current = queue.pop(0)
            result.append(current)
            
            # Remove current node and update in-degrees
            for neighbor in graph.get(current, []):
                if neighbor in in_degree:
                    in_degree[neighbor] -= 1
                    if in_degree[neighbor] == 0:
                        queue.append(neighbor)
        
        # Handle any remaining nodes (shouldn't happen if cycles are properly broken)
        remaining = set(graph.keys()) - set(result)
        if remaining:
            print(f"Warning: Adding remaining files without dependency order: {remaining}")
            result.extend(remaining)
        
        return result
    
    def load_glsl_files(self, glsl_files: List[Path]):
        """Load GLSL files as string content"""
        for file_path in glsl_files:
            relative_path = str(file_path.relative_to(self.src_dir)).replace('\\', '/')
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    self.glsl_files[relative_path] = f.read()
            except Exception as e:
                print(f"Warning: Failed to load GLSL file {file_path}: {e}")
    
    def remove_imports_and_exports(self, content: str) -> str:
        """Remove import and export statements from content"""
        lines = content.split('\n')
        filtered_lines = []
        
        for line in lines:
            stripped = line.strip()
            # Skip import statements
            if stripped.startswith('import ') and ' from ' in stripped:
                continue
            # Keep export statements but remove the export keyword
            if stripped.startswith('export '):
                line = line.replace('export ', '', 1)
            
            filtered_lines.append(line)
        
        return '\n'.join(filtered_lines)
    
    def merge_files(self):
        """Main method to merge all files"""
        ts_files, glsl_files = self.discover_files()
        
        if not ts_files:
            raise ValueError("No TypeScript files found in source directory")
        
        # Load GLSL files
        self.load_glsl_files(glsl_files)
        
        # Build dependency graph
        self.build_dependency_graph(ts_files)
        
        # Sort files by dependencies (with cycle breaking)
        sorted_files = self.topological_sort_with_cycle_breaking()
        
        # Ensure main.ts is last if it exists
        main_file = "main.ts"
        if main_file in sorted_files:
            sorted_files.remove(main_file)
            sorted_files.append(main_file)
        
        # Generate merged content
        merged_content = []
        
        # Add GLSL files as string constants
        if self.glsl_files:
            merged_content.append("// GLSL Shader Sources")
            for glsl_path, glsl_content in self.glsl_files.items():
                var_name = glsl_path.replace('/', '_').replace('.glsl', '_glsl')
                escaped_content = glsl_content.replace('\\', '\\\\').replace('`', '\\`')
                merged_content.append(f"const {var_name} = `{escaped_content}`;")
            merged_content.append("")
        
        # Add TypeScript files in dependency order
        for file_path in sorted_files:
            if file_path in self.file_contents:
                merged_content.append(f"// === {file_path} ===")
                clean_content = self.remove_imports_and_exports(self.file_contents[file_path])
                merged_content.append(clean_content)
                merged_content.append("")
        
        # Write merged file
        with open(self.output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(merged_content))
        
        print(f"Successfully merged {len(sorted_files)} files into {self.output_file}")
        print(f"Merge order: {' -> '.join(sorted_files)}")


def main():
    """Entry point for the script"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Merge TypeScript files with dependency resolution")
    parser.add_argument("src_dir", help="Source directory containing TypeScript files")
    parser.add_argument("-o", "--output", default="merged.ts", help="Output file name")
    
    args = parser.parse_args()
    
    if not os.path.isdir(args.src_dir):
        print(f"Error: {args.src_dir} is not a valid directory")
        return 1
    
    merger = TypeScriptMerger(args.src_dir, args.output)
    merger.merge_files()
    return 0


if __name__ == "__main__":
    exit(main())