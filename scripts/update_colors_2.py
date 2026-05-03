import os

REPLACEMENTS = {
    # Nav and generic
    "dark:hover:text-white": "hover:text-text-primary",
    "hover:bg-zinc-100 dark:hover:bg-zinc-800": "hover:bg-bg-secondary",
    "hover:bg-zinc-50 dark:hover:bg-zinc-800": "hover:bg-bg-secondary",
    "hover:bg-zinc-50 dark:hover:bg-zinc-700": "hover:bg-bg-secondary",
    "dark:bg-zinc-900": "bg-bg-primary",
    "bg-zinc-200 dark:bg-zinc-800": "bg-card-border",
    "bg-zinc-100 dark:bg-zinc-800": "bg-bg-secondary",
    "bg-zinc-300 dark:bg-zinc-700": "bg-card-border",
    "border-zinc-100 dark:border-zinc-900": "border-card-border",
    "text-zinc-500 dark:text-zinc-600": "text-text-secondary",
    
    # Hero / Inputs
    "bg-white dark:bg-zinc-800": "bg-card-bg",
    "border-zinc-200 dark:border-zinc-700": "border-card-border",
    "bg-zinc-100 dark:bg-zinc-800": "bg-bg-secondary",
    
    # Generic zincs without dark modifiers
    "text-zinc-500": "text-text-secondary",
    "text-zinc-400": "text-text-secondary",
    
    # White overrides (be careful)
    "bg-white": "bg-bg-primary",
    "dark:bg-zinc-950": "bg-bg-primary",
    "border-zinc-200 dark:border-zinc-900": "border-card-border",
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    original = content
    for old, new in REPLACEMENTS.items():
        content = content.replace(old, new)
        
    # Manual fixes for chat bubbles
    content = content.replace("bg-bg-primary text-white", "bg-btn-primary-bg text-btn-primary-text")
    content = content.replace("bg-primary text-white", "bg-btn-primary-bg text-btn-primary-text")
    content = content.replace("bg-bg-primary/20", "bg-white/20")
    content = content.replace("focus:bg-bg-primary focus:text-primary", "focus:bg-bg-primary focus:text-btn-primary-bg")
    
    if original != content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
