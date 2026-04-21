"""
Search for API endpoints and faculty data in the HTML.
"""
import re

html = open('vignan_faculty.html', 'r', encoding='utf-8', errors='ignore').read()

# Find any API endpoints
api_matches = re.findall(r'["\']([^"\']*api[^"\']*)["\']', html, re.IGNORECASE)
with open('api_endpoints.txt', 'w') as f:
    for a in list(dict.fromkeys(api_matches)):
        f.write(a + '\n')
print(f"Written {len(api_matches)} API references to api_endpoints.txt")

# Search for JSON-like data with empcode or profilepic
for keyword in ['empcode', 'profilepic', 'emp_code', 'profile_pic', 'Facultyprofiles']:
    idx = html.lower().find(keyword.lower())
    if idx != -1:
        with open(f'context_{keyword}.txt', 'w', encoding='utf-8') as f:
            f.write(html[max(0,idx-200):idx+2000])
        print(f"Found '{keyword}' at index {idx} -> written to context_{keyword}.txt")
    else:
        print(f"'{keyword}' NOT FOUND in HTML")
