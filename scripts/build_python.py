import os
import shutil
import sys
import subprocess
from pathlib import Path

def copy_python_files():
    """Copy Python source files to dist directory"""
    src_dir = Path('src')
    dist_dir = Path('dist/python')
    
    # Create dist directory if it doesn't exist
    dist_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy Python files
    for python_file in src_dir.rglob('*.py'):
        relative_path = python_file.relative_to(src_dir)
        target_path = dist_dir / relative_path
        target_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(python_file, target_path)

def copy_model_files():
    """Copy GGUF model files to dist directory"""
    models_dir = Path('src/models')
    dist_models_dir = Path('dist/python/models')
    
    # Create models directory in dist if it doesn't exist
    dist_models_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy .gguf files if they exist
    for model_file in models_dir.glob('*.gguf'):
        shutil.copy2(model_file, dist_models_dir / model_file.name)

def main():
    # Clean dist directory if it exists
    dist_dir = Path('dist')
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
    
    # Copy Python files
    copy_python_files()
    
    # Copy model files
    copy_model_files()
    
    print("Python build completed successfully!")

if __name__ == '__main__':
    main()
