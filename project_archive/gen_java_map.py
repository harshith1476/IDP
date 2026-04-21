import json
matches = json.load(open('final_faculty_matches.json', 'r', encoding='utf-8'))
with open('java_map.txt', 'w', encoding='utf-8') as f:
    for name, url in matches.items():
        f.write(f'        photoMap.put("{name}", "{url}");\n')
