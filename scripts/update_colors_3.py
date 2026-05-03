import os

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    original = content
    content = content.replace("bg-white dark:bg-zinc-950", "bg-bg-primary")
    content = content.replace("bg-primary text-white", "bg-btn-primary-bg text-btn-primary-text")
    content = content.replace("bg-primary hover:bg-primary-dark text-white", "bg-btn-primary-bg hover:bg-primary-dark text-btn-primary-text")
    
    if original != content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
