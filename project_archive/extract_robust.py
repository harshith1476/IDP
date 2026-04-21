import json
import re

def extract_from_html(html_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Looking for: {"id":"...","empcode":"...","salutation":"...","name":"...","desig":"...","branch":"...","profilepic":"...","resume":"..."}
    # We use a more generic pattern to catch variations
    pattern = r'\{"id":"[^"]+","empcode":"[^"]+",[^{}]+\}'
    matches = re.finditer(pattern, content)
    
    faculty_list = []
    for m in matches:
        match_str = m.group(0)
        try:
            data = json.loads(match_str)
            fid = data.get('empcode', data.get('id'))
            name = data.get('name', '')
            # If it's a profilepic field or photo field
            photo = data.get('profilepic', data.get('photo', ''))
            
            if not name or not photo:
                continue
                
            # Build full image URL
            # Example: https://vignan.ac.in/Facultyprofiles/uploads/02462/profilepic02462.png
            # Note: empcode seems to be the directory name in some cases, id in others.
            # Looking at snippet: empcode "02462" matches folder 02462.
            image_url = f"https://vignan.ac.in/Facultyprofiles/uploads/{fid}/{photo}"
            
            faculty_list.append({
                "name": name.lower(),
                "department": data.get('branch', ''),
                "image_url": image_url
            })
        except Exception as e:
            continue
            
    return faculty_list

if __name__ == "__main__":
    all_faculty = extract_from_html('vignan_faculty.html')
    with open('robust_faculty_images.json', 'w', encoding='utf-8') as f:
        json.dump(all_faculty, f, indent=2)
    print(f"Extracted {len(all_faculty)} faculty members.")
