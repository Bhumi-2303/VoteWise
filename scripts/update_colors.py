import os

REPLACEMENTS = {
    "bg-white dark:bg-zinc-900": "bg-card-bg",
    "bg-white dark:bg-zinc-800": "bg-card-bg",
    "bg-zinc-50 dark:bg-zinc-900": "bg-bg-secondary",
    "bg-zinc-50 dark:bg-zinc-800": "bg-card-bg",
    "bg-zinc-50 dark:bg-zinc-950/50": "bg-bg-secondary",
    "bg-zinc-100 dark:bg-zinc-800": "bg-card-bg",
    "bg-zinc-50/50 dark:bg-zinc-900/50": "bg-chat-bg",
    "bg-zinc-50 dark:bg-zinc-800/50": "bg-card-bg",
    
    "text-text-primary dark:text-white": "text-text-primary",
    "text-zinc-900 dark:text-white": "text-text-primary",
    "text-text-secondary dark:text-zinc-400": "text-text-secondary",
    "text-zinc-400 dark:text-zinc-500": "text-text-secondary",
    "text-zinc-500 dark:text-zinc-400": "text-text-secondary",
    
    "border-zinc-200 dark:border-zinc-800": "border-card-border",
    "border-zinc-200 dark:border-zinc-700": "border-card-border",
    "border-zinc-100 dark:border-zinc-800": "border-card-border",

    "bg-white/80 dark:bg-zinc-900/80": "bg-nav-bg",
    
    "bg-primary text-white": "bg-btn-primary-bg text-btn-primary-text",
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
        
    original = content
    for old, new in REPLACEMENTS.items():
        content = content.replace(old, new)
        
    if original != content:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
