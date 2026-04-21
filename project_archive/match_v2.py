import json
import re

def normalize(name):
    if not name: return ""
    name = name.lower()
    name = re.sub(r'^(dr\.|dr |mr\.|mr |mrs\.|mrs |ms\.|ms |prof\.)', '', name).strip()
    name = re.sub(r'[^a-z0-9\s]', ' ', name)
    name = re.sub(r'\s+', ' ', name).strip()
    return name

# Load DRIMS names from FACULTY_CREDENTIALS_COMPLETE.md
drims_names = []
with open('FACULTY_CREDENTIALS_COMPLETE.md', 'r', encoding='utf-8') as f:
    for line in f:
        match = re.search(r'\|\s+\d+\s+\|\s+([^|]+?)\s+\|', line)
        if match:
            drims_names.append(match.group(1).strip())

# Load robust Vignan data
with open('robust_faculty_images.json', 'r', encoding='utf-8') as f:
    vignan_data = json.load(f)

vignan_map = {normalize(item['name']): item for item in vignan_data}

matches = {}
unmatched = []

for drims_name in drims_names:
    norm_drims = normalize(drims_name)
    
    # Exact match
    if norm_drims in vignan_map:
        matches[drims_name] = vignan_map[norm_drims]['image_url']
        continue
    
    # Fuzzy match
    best_match = None
    best_score = 0
    d_words = set(norm_drims.split())
    if not d_words: continue

    for vk, vitem in vignan_map.items():
        v_words = set(vk.split())
        common = d_words & v_words
        score = len(common) / len(d_words)
        
        if score > best_score:
            best_score = score
            best_match = vitem['image_url']
        elif score == best_score and best_score > 0:
            # Prefer shorter names for ties
            if len(vk) < len(normalize(best_match)):
                best_match = vitem['image_url']
                
    if best_score >= 0.6:
        matches[drims_name] = best_match
    else:
        unmatched.append(drims_name)

# Manual overrides for requested members if not found
manual_overrides = {
    "KOLLA JYOTSNA": "https://vignan.ac.in/Facultyprofiles/uploads/312/profilepic312.jpg", # Likely match based on 'Jyostna'
}

for name, url in manual_overrides.items():
    if name in drims_names:
        matches[name] = url

with open('final_matches_v2.json', 'w', encoding='utf-8') as f:
    json.dump(matches, f, indent=2)

print(f"Matched {len(matches)} faculty members.")
print(f"Unmatched {len(unmatched)} members.")

# Generate Java code
with open('java_map_v2.txt', 'w', encoding='utf-8') as f:
    for name in sorted(matches.keys()):
        f.write(f'        photoMap.put("{name}", "{matches[name]}");\n')
