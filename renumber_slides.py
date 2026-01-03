#!/usr/bin/env python3
"""
Script to renumber slides after content changes:
- Added 3 slides about LLMs (new slides 5, 6, 7)
- Condensed 4 slides into 2 (removed 2 slides)
- Net change: +1 slide (46 -> 47 total)
"""

import re

def renumber_slides_in_html():
    """Renumber all slide data-slide attributes and navigation."""

    with open('/home/user/LectureModule-AIFundamentals/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Mapping: old slide number -> new slide number
    # Slides 1-4: unchanged
    # NEW slides 5, 6, 7 (LLMs)
    # Old 5-21 -> New 8-24 (shifted by +3)
    # Old 22 (Quiz 5) -> New 20 (condensed 4 slides into 2, so -2 offset)
    # From old 22 onward: shift by +1 (net of +3 for LLM slides, -2 for condensed slides)

    slide_mapping = {}
    for i in range(1, 5):  # Slides 1-4 unchanged
        slide_mapping[i] = i
    # Slides 5-21 shift by +3
    for i in range(5, 22):
        slide_mapping[i] = i + 3
    # From slide 22 onward, shift by +1 (net change)
    for i in range(22, 47):  # Old total was 46
        slide_mapping[i] = i + 1

    # Update data-slide attributes
    for old_num in sorted(slide_mapping.keys(), reverse=True):  # Reverse to avoid conflicts
        new_num = slide_mapping[old_num]
        if old_num != new_num:
            # Replace data-slide attribute
            html = re.sub(
                f'data-slide="{old_num}"',
                f'data-slide="{new_num}"',
                html
            )

    # Update navigation ids
    for old_num in sorted(slide_mapping.keys(), reverse=True):
        new_num = slide_mapping[old_num]
        if old_num != new_num:
            # Replace nav id
            html = re.sub(
                f'id="nav-{old_num}"',
                f'id="nav-{new_num}"',
                html
            )
            # Replace goToSlide calls in navigation
            html = re.sub(
                f'goToSlide\\({old_num}\\)',
                f'goToSlide({new_num})',
                html
            )

    # Update total slides count in HTML comments if any
    html = re.sub(
        r'Slide \d+ of 46',
        'Slide X of 47',  # Temporary placeholder
        html
    )
    html = re.sub(
        'Slide X of 47',
        'Slide 1 of 47',
        html,
        count=1
    )

    with open('/home/user/LectureModule-AIFundamentals/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

    print("HTML slides renumbered successfully")

def update_lesson_js():
    """Update totalSlides and slide mapping in lesson.js."""

    with open('/home/user/LectureModule-AIFundamentals/lesson.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # Update totalSlides
    js = re.sub(
        r'const totalSlides = 46;',
        'const totalSlides = 47;',
        js
    )

    # Update comment about total slides
    js = re.sub(
        r'// Total number of slides including all content, quizzes, score report, and credits',
        '// Total number of slides: 47 (added LLM content, condensed code help slides)',
        js
    )

    # Update score slide reference
    js = re.sub(
        r'if \(slideNum === 45\)',
        'if (slideNum === 46)',  # Score report is now slide 46 (was 45, +1 from net change)
        js
    )

    with open('/home/user/LectureModule-AIFundamentals/lesson.js', 'w', encoding='utf-8') as f:
        f.write(js)

    print("lesson.js updated successfully")

def main():
    print("Starting slide renumbering process...")
    print("This will update:")
    print("- data-slide attributes in HTML")
    print("- navigation IDs and goToSlide calls")
    print("- totalSlides in lesson.js")
    print("- score report slide number")
    print()

    renumber_slides_in_html()
    update_lesson_js()

    print()
    print("Renumbering complete!")
    print("New total: 47 slides (was 46)")
    print("Score report is now on slide 46 (was 45)")

if __name__ == '__main__':
    main()
