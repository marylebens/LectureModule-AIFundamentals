#!/usr/bin/env python3
"""
Script to clean up the HTML content:
1. Remove colored backgrounds and replace with simple borders
2. Add periods to list items
3. Reduce exclamation points
"""

import re

def remove_colored_backgrounds(html):
    """Replace colored backgrounds with simple border styling."""

    # Replace yellow background (#fff3cd)
    html = re.sub(
        r'background-color:\s*#fff3cd;',
        r'border: 2px solid #ddd; background-color: transparent;',
        html
    )

    # Replace green background (#d4edda)
    html = re.sub(
        r'background-color:\s*#d4edda;',
        r'border: 2px solid #ddd; background-color: transparent;',
        html
    )

    # Replace pink/red background (#f8d7da)
    html = re.sub(
        r'background-color:\s*#f8d7da;',
        r'border: 2px solid #ddd; background-color: transparent;',
        html
    )

    # Replace light blue backgrounds (#e7f3ff)
    html = re.sub(
        r'background-color:\s*#e7f3ff;',
        r'border: 2px solid #ddd; background-color: transparent;',
        html
    )

    # Replace light blue backgrounds (#f0f7ff)
    html = re.sub(
        r'background-color:\s*#f0f7ff;',
        r'border: 2px solid #ddd; background-color: transparent;',
        html
    )

    # Remove redundant border-left colors that were used with the backgrounds
    html = re.sub(
        r'border-left:\s*4px solid #ffc107;',
        r'border-left: 4px solid #666;',
        html
    )
    html = re.sub(
        r'border-left:\s*4px solid #0366d6;',
        r'border-left: 4px solid #666;',
        html
    )
    html = re.sub(
        r'border-left:\s*4px solid #dc3545;',
        r'border-left: 4px solid #666;',
        html
    )
    html = re.sub(
        r'border-left:\s*4px solid #28a745;',
        r'border-left: 4px solid #666;',
        html
    )

    # Keep code blocks (#2d2d2d) - don't change those

    return html


def add_periods_to_lists(html):
    """Add periods to the end of list items that don't have punctuation."""

    # Find list items and add periods if they don't end with punctuation
    def add_period(match):
        li_content = match.group(1)
        # Check if it already ends with punctuation
        if not re.search(r'[.!?:)]$', li_content.strip()):
            return f'<li>{li_content.strip()}.</li>'
        return match.group(0)

    html = re.sub(r'<li>(.*?)</li>', add_period, html, flags=re.DOTALL)

    return html


def reduce_exclamations(html):
    """Reduce excessive use of exclamation points."""

    # Replace multiple exclamation points with one
    html = re.sub(r'!+', r'!', html)

    # Replace some exclamations with periods (but not in headings or emphasized text)
    # This is conservative - only replacing obvious cases
    html = re.sub(r'([a-z])!\s*</p>', r'\1.</p>', html)

    return html


def main():
    # Read the HTML file
    with open('/home/user/LectureModule-AIFundamentals/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Apply transformations
    print("Removing colored backgrounds...")
    html = remove_colored_backgrounds(html)

    print("Adding periods to list items...")
    html = add_periods_to_lists(html)

    print("Reducing exclamation points...")
    html = reduce_exclamations(html)

    # Write the cleaned HTML
    with open('/home/user/LectureModule-AIFundamentals/index.html', 'w', encoding='utf-8') as f:
        f.write(html)

    print("Content cleanup complete!")


if __name__ == '__main__':
    main()
