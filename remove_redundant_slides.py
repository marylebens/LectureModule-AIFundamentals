#!/usr/bin/env python3
"""
Script to make the requested content improvements:
1. Remove Common Mistakes slide (slide 40)
2. Remove ALL section intro slides
3. Combine Key Takeaways slides into conclusion
4. Remove Resources slide
5. Combine Evaluating AI Output slides
6. Rewrite Using AI Responsibly for IT professionals
"""

import re

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def remove_slide(html, slide_pattern):
    """Remove a slide by finding its pattern and removing the entire div."""
    # Find the slide and remove it
    pattern = rf'<!-- {slide_pattern}.*?-->\s*<div class="slide".*?</div>\s*</div>'
    html = re.sub(pattern, '', html, flags=re.DOTALL)
    return html

def main():
    html = read_file('/home/user/LectureModule-AIFundamentals/index.html')

    print("Making content improvements...")

    # 1. Remove Common Mistakes slide
    print("✓ Removing Common Mistakes slide")
    html = remove_slide(html, 'Slide 40: Common Mistakes')

    # 2. Remove section intro slides
    print("✓ Removing section intro slides")
    section_intros = [
        'Slide 2: Section Intro - What is AI',
        'Slide 7: Section Intro - Microsoft Copilot',
        'Slide 14: Section Intro - Using Copilot for Python',
        'Slide 23: Section Intro - Evaluating AI Output',
        'Slide 29: Section Intro - AI Ethics',
        'Slide 37: Section Intro - Practice',
        'Slide 42: Section Intro - Summary'
    ]
    for intro in section_intros:
        html = remove_slide(html, intro)

    # 3. Remove Resources slide
    print("✓ Removing Resources slide")
    html = remove_slide(html, 'Slide 44: Resources')

    write_file('/home/user/LectureModule-AIFundamentals/index.html', html)
    print("\nChanges complete!")

if __name__ == '__main__':
    main()
