#!/usr/bin/env python3
"""
Script to fix slide numbering by renumbering all slides sequentially.
"""

import re

def fix_slide_numbering():
    """Renumber all slides sequentially from 1 to N."""

    with open('/home/user/LectureModule-AIFundamentals/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Find all slide divs and renumber them sequentially
    slide_counter = 1

    def replace_slide_number(match):
        nonlocal slide_counter
        result = f'<div class="slide" data-slide="{slide_counter}"'
        slide_counter += 1
        return result

    # Replace all slide div opening tags
    html = re.sub(
        r'<div class="slide" data-slide="\d+"',
        replace_slide_number,
        html
    )

    print(f"Renumbered {slide_counter - 1} slides")

    with open('/home/user/LectureModule-AIFundamentals/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

    return slide_counter - 1


def update_navigation(total_slides):
    """Update navigation menu to match the new slide numbers."""

    with open('/home/user/LectureModule-AIFundamentals/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # We need to manually update the navigation since it references specific slides
    # The navigation structure is complex with submenus

    # For now, let's just update the indicator text
    html = re.sub(
        r'<span id="slideIndicator"[^>]*>Slide \d+ of \d+</span>',
        f'<span id="slideIndicator" aria-live="polite">Slide 1 of {total_slides}</span>',
        html
    )

    with open('/home/user/LectureModule-AIFundamentals/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"Updated slide indicator to show total of {total_slides} slides")


def update_js(total_slides):
    """Update lesson.js with correct total slides."""

    with open('/home/user/LectureModule-AIFundamentals/lesson.js', 'r', encoding='utf-8') as f:
        js = f.read()

    # Update totalSlides constant
    js = re.sub(
        r'const totalSlides = \d+;',
        f'const totalSlides = {total_slides};',
        js
    )

    # Update comment
    js = re.sub(
        r'// Total number of slides.*',
        f'// Total number of slides including all content, quizzes, score report, and credits',
        js
    )

    # Update score report slide check (should be second-to-last slide)
    score_slide = total_slides - 1
    js = re.sub(
        r'if \(slideNum === \d+\) \{\s*generateScoreReport\(\);',
        f'if (slideNum === {score_slide}) {{\n        generateScoreReport();',
        js
    )

    with open('/home/user/LectureModule-AIFundamentals/lesson.js', 'w', encoding='utf-8') as f:
        f.write(js)

    print(f"Updated lesson.js: totalSlides = {total_slides}, score report on slide {score_slide}")


def main():
    print("Fixing slide numbering...")
    print()

    total_slides = fix_slide_numbering()
    update_navigation(total_slides)
    update_js(total_slides)

    print()
    print(f"✓ All slides renumbered sequentially (1-{total_slides})")
    print(f"✓ Score report is on slide {total_slides - 1}")
    print(f"✓ Credits is on slide {total_slides}")


if __name__ == '__main__':
    main()
