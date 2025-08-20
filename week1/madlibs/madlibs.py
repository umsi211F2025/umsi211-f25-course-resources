import re

# Extract all placeholders in order of appearance
def get_placeholders_in_order(story):
    pattern = re.compile(r"(?:\[[^\]]*\])?\{(\d+):([a-zA-Z_]+)\}|(?:\[[^\]]*\])?\{([a-zA-Z_]+)\}|(?:\[[^\]]*\])?\{(\d+)\}")
    placeholders = []
    for match in pattern.finditer(story):
        if match.group(1) and match.group(2):
            # [text]{n:label}
            placeholders.append(('numbered', match.group(1), match.group(2)))
        elif match.group(3):
            # [text]{label}
            placeholders.append(('unnumbered', match.group(3)))
        elif match.group(4):
            # [text]{n}
            placeholders.append(('numbered_ref', match.group(4)))
    return placeholders

def prompt_user(placeholders):
    answers = {}
    unnumbered_idx = 0
    for ph in placeholders:
        if ph[0] == 'numbered':
            num, label = ph[1], ph[2]
            if num not in answers:
                article = 'an' if label[0].lower() in 'aeiou' else 'a'
                prompt = f"Enter {article} {label}: "
                answers[num] = input(prompt)
        elif ph[0] == 'unnumbered':
            label = ph[1]
            article = 'an' if label[0].lower() in 'aeiou' else 'a'
            prompt = f"Enter {article} {label}: "
            answers[f"unnumbered_{unnumbered_idx}"] = input(prompt)
            unnumbered_idx += 1
    return answers


def fill_story(story, answers):
    # Replace placeholders with user answers
    def replacer(match):
        if match.group(1) and match.group(2):
            # [text]{n:label}
            return answers.get(match.group(1), match.group(0))
        elif match.group(3):
            # [text]{label}
            key = f"unnumbered_{replacer.unnumbered_idx}"
            replacer.unnumbered_idx += 1
            return answers.get(key, match.group(0))
        elif match.group(4):
            # [text]{n}
            return answers.get(match.group(4), match.group(0))
        return match.group(0)
    replacer.unnumbered_idx = 0
    pattern = re.compile(r"(?:\[[^\]]*\])?\{(\d+):([a-zA-Z_]+)\}|(?:\[[^\]]*\])?\{([a-zA-Z_]+)\}|(?:\[[^\]]*\])?\{(\d+)\}")
    return pattern.sub(replacer, story)


if __name__ == "__main__":
    # Read the story from file
    with open("sample_story.txt") as f:
        story = f.read()
    placeholders = get_placeholders_in_order(story)
    answers = prompt_user(placeholders)
    completed_story = fill_story(story, answers)
    print("\nYour completed story:\n")
    print(completed_story)
