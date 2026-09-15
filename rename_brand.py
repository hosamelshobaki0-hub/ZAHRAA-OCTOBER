from pathlib import Path

root = Path('.')
html_files = list(root.glob('*.html'))
if (root / 'admin').exists():
    html_files += list((root / 'admin').glob('*.html'))
if (root / 'driver').exists():
    html_files += list((root / 'driver').glob('*.html'))

# Ordered replacements. Keep the visible page-logo brand and the title brand consistent
# across all pages, without trying to alter any authored content beyond the UI name.
replacements = [
    ('زهراء <span>ترانسپورت</span>', 'منصة <span>زهراء أكتوبر الرقمية</span>'),
    ('زهراء ترانسپورت', 'منصة زهراء أكتوبر الرقمية'),
    ('Zahraa Transport Admin', 'منصة زهراء أكتوبر الرقمية'),
    ('Zahraa Transport - Driver', 'منصة زهراء أكتوبر الرقمية'),
    ('Zahraa Transport', 'منصة زهراء أكتوبر الرقمية'),
]

updated = []
for f in html_files:
    text = f.read_text(encoding='utf-8', errors='ignore')
    original = text
    for old, new in replacements:
        text = text.replace(old, new)
    if text != original:
        f.write_text(text, encoding='utf-8')
        updated.append(str(f.relative_to(root)))

print('updated_brand_pages=' + str(len(updated)))
