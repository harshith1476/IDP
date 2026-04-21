import json, re

def normalize(name):
    """Normalize a name for fuzzy matching."""
    if not name: return ""
    name = name.lower()
    # Remove common prefixes and suffixes
    name = re.sub(r'^(dr\.|dr |mr\.|mr |mrs\.|mrs |ms\.|ms |prof\.)', '', name).strip()
    name = re.sub(r'^\.', '', name).strip()
    # Remove all punctuation
    name = re.sub(r'[^\w\s]', ' ', name)
    # Remove extra spaces
    name = re.sub(r'\s+', ' ', name).strip()
    return name

# 1. Load Vignan faculty
with open('all_faculty_images.json', 'r', encoding='utf-8') as f:
    vignan_faculty = json.load(f)

vignan_map = {}
for v in vignan_faculty:
    norm = normalize(v['name'])
    vignan_map[norm] = v

# 2. Load DRIMS faculty names from MD file
with open('FACULTY_CREDENTIALS_COMPLETE.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Match names in the table: | 1 | Name | ... |
drims_names = re.findall(r'\| \d+ \| (.*?) \|', content)
drims_names = [n.strip() for n in drims_names]

# 3. Match
matches = {}
unmatched = []

# Manual overrides for problematic names
manual_overrides = {
    "Sajida Sultana Sk": "sajida sultana",
    "KOLLA JYOTSNA": "jyotsna kolla",
    "O. Bhaskaru": "bhaskara rao",
    "M.prashanth": "prashanth",
}

for drims_name in drims_names:
    norm_drims = normalize(manual_overrides.get(drims_name, drims_name))
    
    # Try exact match
    if norm_drims in vignan_map:
        matches[drims_name] = vignan_map[norm_drims]['image_url']
        continue
    
    # Try partial matching
    drims_words = set(norm_drims.split())
    if not drims_words: continue

    best_match = None
    best_score = 0
    for vk, ventry in vignan_map.items():
        vignan_words = set(vk.split())
        common = drims_words & vignan_words
        # Score based on percentage of DRIMS words found in Vignan entry
        score = len(common) / len(drims_words)
        
        # Tie-breaker: prefer shorter Vignan names (more likely to be a direct match)
        if score > best_score:
            best_score = score
            best_match = ventry['image_url']
        elif score == best_score and best_score > 0:
            if len(vk.split()) < len(normalize(best_match).split() if best_match and 'http' not in best_match else "X X X X X"):
                best_match = ventry['image_url']
            
    if best_score >= 0.5: # At least half the words must match
        matches[drims_name] = best_match
    else:
        unmatched.append(drims_name)

# 4. Generate Java code
print("--- JAVA MAP ENTRIES ---")
for name, url in matches.items():
    print(f'        photoMap.put("{name}", "{url}");')

print(f"\nMatched: {len(matches)}/{len(drims_names)}")
print(f"Unmatched: {len(unmatched)}")
if unmatched:
    print("Unmatched names:", unmatched)

# Save to file for reference
with open('final_faculty_matches.json', 'w', encoding='utf-8') as f:
    json.dump(matches, f, indent=2)
