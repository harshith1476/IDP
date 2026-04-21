"""
Extract all CSE faculty image URLs from vignan_faculty.html.
Saves results to faculty_images.json
"""
import re, json

html = open('vignan_faculty.html', 'r', encoding='utf-8', errors='ignore').read()

# Parse faculty-card blocks
# Each card has: img src + name in aboutus-div-56 + dept in faculty-branch
card_pattern = re.compile(
    r'<div class="faculty-card">(.*?)</div>\s*</div>\s*</div>',
    re.DOTALL | re.IGNORECASE
)

cse_faculty = []
all_faculty = []

# More reliable: find each faculty-card block
cards = re.split(r'<div class="faculty-card">', html)

for card in cards[1:]:  # skip first which is before first card
    # Extract image src
    img_match = re.search(r'<img\s+class="faculty-img"[^>]+src=([^\s>]+)', card, re.IGNORECASE)
    # Extract name
    name_match = re.search(r'<p class="aboutus-div-56">(.*?)</p>', card, re.IGNORECASE | re.DOTALL)
    # Extract department
    dept_match = re.search(r'<p class="faculty-branch">(.*?)</p>', card, re.IGNORECASE | re.DOTALL)
    
    if img_match and name_match:
        img_src = img_match.group(1).strip('"\'')
        name = re.sub(r'<[^>]+>', '', name_match.group(1)).strip()
        dept = re.sub(r'<[^>]+>', '', dept_match.group(1)).strip() if dept_match else ''
        
        # Build full image URL (fix relative path)
        if img_src.startswith('../'):
            img_url = 'https://vignan.ac.in/' + img_src[3:]
        elif img_src.startswith('http'):
            img_url = img_src
        else:
            img_url = 'https://vignan.ac.in/newvignan/' + img_src
        
        faculty_entry = {'name': name, 'department': dept, 'image_url': img_url}
        all_faculty.append(faculty_entry)
        
        if '(CSE)' in dept.upper():
            cse_faculty.append(faculty_entry)

print(f"Total faculty found: {len(all_faculty)}")
print(f"Total CSE faculty found: {len(cse_faculty)}")

with open('cse_faculty_images.json', 'w', encoding='utf-8') as f:
    json.dump(cse_faculty, f, indent=2)

with open('all_faculty_images.json', 'w', encoding='utf-8') as f:
    json.dump(all_faculty, f, indent=2)

print("Saved to cse_faculty_images.json and all_faculty_images.json")
print("\nCSE Faculty:")
for f in cse_faculty:
    print(f"  {f['name']} | {f['department']} | {f['image_url']}")
