import os

def generate_ultimate_map():
    current_dir = os.getcwd()
    try:
        depth = int(input("How many levels up is Project Root? (Type 1 for Iqdrone/): "))
    except:
        depth = 1

    project_root = current_dir
    for _ in range(depth):
        project_root = os.path.dirname(project_root)

    project_parent = os.path.dirname(project_root)
    project_name = os.path.basename(project_root)
    desktop = os.path.join(os.environ['USERPROFILE'], 'Desktop')
    save_path = os.path.join(desktop, f"{project_name}_DASHBOARD.html")
    
    html_out = []
    stats = {"HTML": 0, "Images": 0}

    def process_folder(path, prefix=""):
        try:
            items = sorted(os.listdir(path))
        except: return 
            
        items = [i for i in items if not i.startswith(('.', '$')) and i != 'iQDRONE-SCAN']
        folders = [i for i in items if os.path.isdir(os.path.join(path, i))]
        files = [i for i in items if not os.path.isdir(os.path.join(path, i))]
        
        h_files = [f for f in files if f.lower().endswith(('.html', '.htm'))]
        i_files = [f for f in files if f.lower().endswith(('.jpg', '.png', '.webp', '.svg', '.jpeg'))]
        
        display_path = os.path.relpath(path, project_parent).replace("\\", "/")

        html_out.append('<div class="row-container">')
        html_out.append(f'  <div class="col tree-col">{prefix}└── 📁 <b class="folder-name">{display_path}/</b></div>')
        
        # HTML Column
        html_out.append('  <div class="col html-col">')
        for f in h_files:
            rel = os.path.relpath(os.path.join(path, f), project_parent).replace("\\", "/")
            html_out.append(f'<div class="file-item searchable" data-name="{f.lower()}">📄 {f} <button class="copy-btn" onclick="copyT(\'{rel}\')">copy</button></div>')
            stats["HTML"] += 1
        html_out.append('  </div>')

        # Image Column
        html_out.append('  <div class="col img-col">')
        for f in i_files:
            rel = os.path.relpath(os.path.join(path, f), project_parent).replace("\\", "/")
            
            # --- AUTO ALT TAG LOGIC ---
            # 1. Take filename 2. Remove extension 3. Replace dots/dashes with spaces 4. Capitalize Words
            clean_name = f.rsplit('.', 1)[0]
            alt_val = clean_name.replace('-', ' ').replace('_', ' ').replace('.', ' ').title()
            
            tag_code = f'<img src="{rel}" alt="{alt_val}" loading="lazy">'.replace('"', '&quot;')
            abs_img = "file:///" + os.path.abspath(os.path.join(path, f)).replace("\\", "/")
            
            html_out.append(f'''
                <div class="img-wrapper searchable" data-name="{f.lower()}">
                    <img src="{abs_img}" class="mini-thumb">
                    <div style="flex-grow:1; min-width:0; z-index:10;">
                        <div style="font-size:11px; font-weight:bold; overflow:hidden;">{f}</div>
                        <div style="display:flex; gap:4px; margin-top:4px;">
                            <button class="copy-btn" onclick="copyT('{rel}')">Path</button>
                            <button class="copy-btn tag-btn" onclick="copyT('{tag_code}')">Tag</button>
                        </div>
                    </div>
                    <img src="{abs_img}" class="left-preview">
                </div>''')
            stats["Images"] += 1
        html_out.append('  </div></div>')

        for d in folders:
            process_folder(os.path.join(path, d), prefix + "    ")

    process_folder(project_root)

    full_html = f"""<!DOCTYPE html><html><head><title>{project_name} Dashboard</title>
    <style>
        body {{ font-family: sans-serif; background: #f4f7f6; margin: 0; padding-bottom: 100px; }}
        .header {{ background: #0d47a1; color: white; padding: 20px; position: sticky; top: 0; z-index: 5000; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }}
        .search-box {{ width: 100%; max-width: 500px; padding: 12px; border-radius: 6px; border: none; font-size: 16px; margin-top: 10px; outline: none; }}
        .row-container {{ display: flex; border-bottom: 1px solid #ddd; background: white; }}
        .col {{ padding: 15px; border-right: 1px solid #eee; }}
        .tree-col {{ flex: 1.5; white-space: pre; font-family: 'Consolas', monospace; color: #444; font-size: 14px; }}
        .folder-name {{ color: #1565c0; font-size: 16px; }}
        .html-col {{ flex: 1; display: flex; flex-direction: column; gap: 8px; }}
        .img-col {{ flex: 3.5; display: flex; flex-wrap: wrap; gap: 10px; }}
        .file-item, .img-wrapper {{ background: #fff; padding: 8px; border-radius: 6px; border: 1px solid #ddd; display: flex; align-items: center; gap: 10px; }}
        .img-wrapper {{ width: 220px; transition: background 0.2s; }}
        .img-wrapper:hover {{ background: #e3f2fd; border-color: #2196f3; }}
        .mini-thumb {{ width: 45px; height: 45px; object-fit: cover; border-radius: 4px; border: 1px solid #eee; }}
        .copy-btn {{ font-size: 11px; cursor: pointer; background: #424242; color: white; border: none; border-radius: 4px; padding: 5px 10px; font-weight: bold; }}
        .tag-btn {{ background: #2e7d32; }}
        .tag-btn:hover {{ background: #1b5e20; }}
        
        /* THE LEFT PREVIEW FIX */
        .left-preview {{ 
            display: none; 
            position: fixed; 
            top: 120px; 
            left: 20px; /* Forces image to the extreme left */
            width: 400px; 
            border: 10px solid white; 
            box-shadow: 0 0 50px rgba(0,0,0,0.6); 
            z-index: 9999; 
            pointer-events: none; /* Mouse passes right through it */
            border-radius: 8px; 
        }}
        .img-wrapper:hover .left-preview {{ display: block; }}
        .hidden {{ display: none !important; }}
    </style>
    <script>
        function copyT(t) {{ 
            navigator.clipboard.writeText(t).then(() => {{
                let b = document.createElement('div');
                b.innerHTML = "✓ Copied!";
                b.style = "position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:#0d47a1; color:white; padding:12px 25px; border-radius:30px; z-index:10000; font-weight:bold; box-shadow: 0 4px 15px rgba(0,0,0,0.3);";
                document.body.appendChild(b);
                setTimeout(() => b.remove(), 1200);
            }});
        }}
        function doSearch() {{
            let v = document.getElementById('search').value.toLowerCase();
            let items = document.getElementsByClassName('searchable');
            for (let i of items) {{ i.classList.toggle('hidden', !i.getAttribute('data-name').includes(v)); }}
        }}
    </script></head><body>
    <div class="header">
        <strong>iQDRONE Dashboard</strong> | {stats['HTML']} Pages | {stats['Images']} Images<br>
        <input type="text" id="search" onkeyup="doSearch()" placeholder="Search assets (e.g. spray, academy, logo)..." class="search-box">
    </div>
    {"".join(html_out)}
<!-- Cookie Consent Banner -->
<div id="cookie-banner" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 500px; background: var(--dark-gray); border: 2px solid var(--saffron); border-radius: 12px; padding: 15px 20px; z-index: 10000; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <p style="color: white; margin: 0; font-size: 0.9rem; line-height: 1.4;">
        <i class="fas fa-cookie-bite" style="color: var(--saffron); margin-right: 8px;"></i>
        We use cookies to enhance your experience. By continuing, you agree to our 
        <a href="privacy.html" style="color: var(--saffron); text-decoration: underline;">Privacy Policy</a>.
    </p>
    <div style="display: flex; gap: 10px;">
        <button onclick="rejectCookies()" class="btn btn-secondary btn-small" style="background: transparent; border: 1px solid var(--saffron);">Reject All</button>
        <button onclick="acceptCookies()" class="btn btn-primary btn-small">Accept</button>
    </div>
</div>
</body></html>"""
    
    with open(save_path, "w", encoding="utf-8") as f: f.write(full_html)
    os.startfile(save_path)

if __name__ == "__main__": generate_ultimate_map()