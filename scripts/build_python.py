import os
import shutil
import sys
from pathlib import Path

def copy_python_files():
    """Copy Python source files to dist directory"""
    src_dir = Path('src')
    dist_dir = Path('dist/python')
    expo_assets_dir = Path('assets/python')

    # Create directories if they don't exist
    dist_dir.mkdir(parents=True, exist_ok=True)
    expo_assets_dir.mkdir(parents=True, exist_ok=True)

    # Copy Python files to dist and expo assets
    for python_file in src_dir.rglob('*.py'):
        relative_path = python_file.relative_to(src_dir)

        # Copy to dist
        target_path = dist_dir / relative_path
        target_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(python_file, target_path)

        # Copy to expo assets
        expo_target = expo_assets_dir / relative_path
        expo_target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(python_file, expo_target)

def copy_model_files():
    """Copy GGUF model files to dist directory"""
    models_dir = Path('src/models')
    dist_models_dir = Path('dist/python/models')
    expo_models_dir = Path('assets/python/models')

    # Create directories
    dist_models_dir.mkdir(parents=True, exist_ok=True)
    expo_models_dir.mkdir(parents=True, exist_ok=True)

    # Copy .gguf files
    for model_file in models_dir.glob('*.gguf'):
        # Copy to dist
        shutil.copy2(model_file, dist_models_dir / model_file.name)
        # Copy to expo assets
        shutil.copy2(model_file, expo_models_dir / model_file.name)

def main():
    try:
        # Clean dist directory if it exists
        dist_dir = Path('dist')
        if dist_dir.exists():
            shutil.rmtree(dist_dir)

        # Clean assets/python if it exists
        expo_assets = Path('assets/python')
        if expo_assets.exists():
            shutil.rmtree(expo_assets)

        # Copy Python files
        copy_python_files()

        # Copy model files
        copy_model_files()

        print("Python build completed successfully!")
        print("Files have been copied to both dist/python and assets/python")

    except Exception as e:
        print(f"Error during build: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()