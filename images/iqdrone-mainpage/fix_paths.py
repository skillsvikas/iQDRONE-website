import os
import re

def fix_my_images():
    # We are running this from C:/Users/harry/Desktop/Iqdrone/
    index_path = "index.html"
    
    # This is your new path for the webp files
    target_folder = "images/iqdrone-mainpage"
    
    if not os.path.exists(index_path):
        print("Could not find index.html in this folder!")
        return

    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # This looks for the data-iqid hooks we added in VS Code
    def update_tag(match):
        full_tag = match.group(0)
        id_match = re.search(r'data-iqid=["\']([^"\']+)["\']', full_tag)
        
        if id_match:
            iqid = id_match.group(1)
            # Builds the path: images/iqdrone-mainpage/filename.webp
            new_src = f"{target_folder}/{iqid}.webp"
            
            # Replaces the src inside the HTML tag
            tag = re.sub(r'src=["\']([^"\']+)["\']', f'src="{new_src}"', full_tag)
            return tag
        return full_tag

    # Scan and replace
    updated_content = re.sub(r'<img[^>]+data-iqid=[^>]+>', update_tag, content)

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print(f"✅ Done! All images now point to {target_folder}/")

if __name__ == "__main__":
    fix_my_images()