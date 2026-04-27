import os
from PIL import Image
import urllib.parse

assets_dir = r"d:\project\portofolio\assets"
index_file = r"d:\project\portofolio\index.html"

# Mapping of old paths to new paths (relative to index.html)
replacements = {}

for root, dirs, files in os.walk(assets_dir):
    for f in files:
        if f.lower().endswith(('.png', '.jpg', '.jpeg')):
            old_path = os.path.join(root, f)
            # Create a web-friendly name: lowercase, replace spaces with hyphens
            base_name, _ = os.path.splitext(f)
            new_base = base_name.lower().replace(' ', '-')
            new_f = new_base + ".webp"
            new_path = os.path.join(root, new_f)
            
            try:
                with Image.open(old_path) as img:
                    # Convert to RGB if it's RGBA and we want to be safe, but WebP supports RGBA
                    # Resize if too large to save space
                    max_width = 1200
                    if img.width > max_width:
                        ratio = max_width / img.width
                        new_height = int(img.height * ratio)
                        img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                    
                    img.save(new_path, "WEBP", quality=75, method=4)
                    print(f"Compressed {f} -> {new_f}")
                
                # We can delete the old file to clean up
                os.remove(old_path)
                
                # Now record the relative paths for HTML replacement
                old_rel = os.path.relpath(old_path, r"d:\project\portofolio").replace('\\', '/')
                new_rel = os.path.relpath(new_path, r"d:\project\portofolio").replace('\\', '/')
                
                replacements[old_rel] = new_rel
                
                # Also handle cases where spaces in HTML were not URL encoded
                # or where they were URL encoded (%20)
                replacements[urllib.parse.quote(old_rel)] = new_rel
                
            except Exception as e:
                print(f"Error compressing {f}: {e}")

# Also handle spaces in folder names for HTML?
# Let's just fix the HTML directly. We know what images we put.

with open(index_file, 'r', encoding='utf-8') as f:
    html_content = f.read()

for old_rel, new_rel in replacements.items():
    html_content = html_content.replace(old_rel, new_rel)

# Additionally, let's fix any folder path space issues in HTML like "icon skill" -> "icon%20skill" or similar.
# Wait, if we didn't rename the folders, the folders still have spaces.
# Vercel and CDNs sometimes fail with spaces in paths. Let's rename folders with spaces.

with open(index_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Done converting to WebP and updating index.html")
