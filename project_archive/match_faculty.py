"""
Generate the matching between FacultyDataLoader.java faculty names
and corresponding Vignan image URLs.
"""
import json, re

# Load CSE faculty from Vignan website
with open('cse_faculty_images.json', 'r', encoding='utf-8') as f:
    vignan_faculty = json.load(f)

# Faculty names in FacultyDataLoader.java (from the code we read)
drims_faculty = [
    "Renugadevi R", "Dr.R.Renugadevi", "Maridu Bhargavi", "B Suvarna",
    "Venkatrama Phani Kumar Sistla", "S Deva Kumar", "Sajida Sultana Sk",
    "Chavva Ravi Kishore Reddy", "Venkatrajulu Pilli", "Dega Balakotaiah",
    "Mr.Kiran Kumar Kaveti", "K Pavan Kumar", "Ongole Gandhi", "KOLLA JYOTSNA",
    "Saubhagya Ranjan Biswal", "Sumalatha M", "O. Bhaskaru",
    "Venkata Krishna Kishore Kolli", "Dr. Md Oqail Ahmad", "Dr Satish Kumar Satti",
    "Dr. E. Deepak Chowdary", "Dr Sunil Babu Melingi"
]

def normalize(name):
    """Normalize a name for fuzzy matching."""
    name = name.lower()
    # Remove prefixes
    name = re.sub(r'^(dr\.|dr |mr\.|mr |mrs\.|mrs |ms\.|ms |prof\.)', '', name).strip()
    name = re.sub(r'^\.', '', name).strip()
    # Remove extra spaces
    name = re.sub(r'\s+', ' ', name)
    return name

# Build a map of normalized Vignan names -> original entry
vignan_map = {}
for v in vignan_faculty:
    norm = normalize(v['name'])
    vignan_map[norm] = v

print("Vignan faculty (normalized):")
for k in sorted(vignan_map.keys()):
    print(f"  {k}")

print("\n\nMatching DRIMS faculty to Vignan faculty:")
matches = {}
unmatched = []

for drims_name in drims_faculty:
    norm_drims = normalize(drims_name)
    
    # Try exact match first
    if norm_drims in vignan_map:
        matches[drims_name] = vignan_map[norm_drims]
        continue
    
    # Try partial matching (all words in drims name appear in vignan name)
    drims_words = set(norm_drims.split())
    best_match = None
    best_score = 0
    for vk, ventry in vignan_map.items():
        vignan_words = set(vk.split())
        common = drims_words & vignan_words
        score = len(common) / max(len(drims_words), 1)
        if score > best_score and score >= 0.6:
            best_score = score
            best_match = (vk, ventry, score)
    
    if best_match:
        matches[drims_name] = best_match[1]
        print(f"  MATCHED: '{drims_name}' -> '{best_match[0]}' (score={best_match[2]:.2f})")
    else:
        unmatched.append(drims_name)
        print(f"  UNMATCHED: '{drims_name}'")

print(f"\nTotal matched: {len(matches)}/{len(drims_faculty)}")
print(f"Unmatched: {unmatched}")

# Output Java map entries
print("\n\n--- Java Map entries for FacultyDataLoader ---")
print("Map<String, String> photoMap = new HashMap<>();")
for drims_name, ventry in matches.items():
    img_url = ventry['image_url']
    print(f'photoMap.put("{drims_name}", "{img_url}");')

# Save matches
with open('faculty_matches.json', 'w', encoding='utf-8') as f:
    json.dump({k: v for k, v in matches.items()}, f, indent=2)
