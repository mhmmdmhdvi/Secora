LESSON = {
    "slug": "dom-based-xss",
    "title": "DOM-based XSS",
    "summary": "Learn how URI fragments and unsafe browser-side rendering can create DOM-based XSS.",
    "difficulty": "intermediate",
    "sort_order": 5,
    "estimated_minutes": 15,
    "simulation_key": "dom-based-xss",
    "required_locales": ("en",),
    "guide_path": "/lessons/dom-based-xss-guide",
    "quiz_path": "/lessons/dom-based-xss-quiz",
    "quiz_start_path": "/lessons/dom-based-xss-quiz-start",
    "lessons_path": "/lessons",
    "total_steps": 9,
    "final_step": 8,
    "steps": [
        [
            {
                "type": "text",
                "text": "As JavaScript frameworks have gotten more sophisticated, a lot of business logic has been pushed to the client-side. Correspondingly, the importance of knowing how to protect against vulnerabilities occurring in the browser have increased.",
            }
        ],
        [
            {
                "type": "text",
                "text": "Rich web applications often use URI fragments - the part of the URL after the # sign. This has proven a convenient method of storing the user's location within a page in a way that keeps browser history readable, but does not cause extra round trips to the server.",
            }
        ],
        [
            {
                "type": "text",
                "text": "URI fragments are not sent with HTTP requests, so they need to be interpreted by client-side JavaScript. You should be careful that your treatment of URI fragments does not permit the injection of malicious JavaScript. Let's see how a site might be vulnerable to DOM-based XSS attacks.",
            }
        ],
        [
            {
                "type": "text",
                "text": 'Our example website has "infinite scroll": content is loaded in dynamically as the page is scrolled down. Notice how the URI fragment is used to track the scroll location.',
            }
        ],
        [
            {
                "type": "text",
                "text": "This is done so that if a user navigates away from the site, and then presses the back button, the site can reload their last location.",
            }
        ],
        [
            {
                "type": "text",
                "text": "However, there is a vulnerability in the way the URI fragment is interpreted by this site. The site updates the page number directly from the URI fragment, without checking the contents.",
            }
        ],
        [
            {
                "type": "text",
                "text": "This means an attacker can construct a URL with malicious JavaScript in the URI fragment...",
            }
        ],
        [
            {
                "type": "text",
                "text": "...and when somebody is tricked into visiting that URL, the JavaScript will be executed in their browser.",
            }
        ],
        [
            {
                "type": "text",
                "text": "Okay, that's clearly pretty dangerous. Let's see how to protect against DOM-based XSS vulnerabilities.",
            }
        ],
    ],
    "completion": [
        {
            "type": "text",
            "text": "Now that you have seen how DOM-based XSS works, let's learn how to protect against it.",
        }
    ],
    "simulation": {
        "site": {
            "name": "chinterest",
            "url": "www.chinterest.com",
            "hash": "#page=12",
            "restored_hash": "#page=12",
            "tagline": "Endless ideas, endless scrolling",
            "page_label": "Current page",
            "restore_note": "Back button restores this scroll location from the URI fragment.",
            "cards": [
                "Cozy cabin lighting",
                "Minimal desk setup",
                "Sourdough scoring ideas",
                "Tiny balcony garden",
                "Handmade ceramic mugs",
                "Weekend reading nook",
                "Clean login page inspiration",
                "Secure frontend patterns",
            ],
        },
        "code": {
            "header": "Dangerous use of innerHTML",
            "body": "window.addEventListener('load', function () {\n  const page = window.location.hash.substr(1);\n  loadPage(page);\n\n  document.getElementById('page-no').innerHTML = page;\n});",
        },
        "attack": {
            "payload_url": 'www.chinterest.com#&lt;script&gt;window.location="www.haxxed.com"&lt;/script#&gt;',
            "hacked_url": "www.haxxed.com",
            "hacked_title": "Browser redirected",
            "hacked_message": "The script from the URI fragment ran in the victim's browser.",
        },
        "scenes": {
            "1": {"type": "xss-image"},
            "2": {"type": "xss-image"},
            "3": {"type": "chinterest-scroll"},
            "4": {"type": "chinterest-restore"},
            "5": {"type": "dangerous-code"},
            "6": {"type": "mal-payload"},
            "7": {"type": "hacked-site"},
            "8": {"type": "xss-image"},
        },
    },
    "quiz_intro": {
        "eyebrow": "Test your knowledge",
        "icon": "🧠",
        "title": "Quiz: DOM-based XSS",
        "summary": "Take this quick quiz to show you were paying attention.",
        "start_button": "Start the quiz",
        "review_button": "Review the material one more time →",
    },
    "quiz": {
        "title": "DOM-based XSS quiz",
        "instructions": "Take this quick quiz to show you were paying attention.",
        "pass_percentage": 100,
        "shuffle_questions": False,
        "shuffle_answers": False,
        "questions": [
            {
                "key": "uri-fragment-location",
                "type": "single",
                "prompt": "Which part of the URL is commonly used by rich web applications to track browser-side state?",
                "answers": [
                    {"key": "fragment", "text": "The URI fragment after the # sign", "is_correct": True},
                    {"key": "scheme", "text": "The http:// or https:// scheme", "is_correct": False},
                    {"key": "domain", "text": "Only the domain name", "is_correct": False},
                    {"key": "extension", "text": "The file extension at the end of a path", "is_correct": False},
                ],
            }
        ],
    },
}


LESSON_TRANSLATIONS = {}


def inline_plain_text(parts):
    return " ".join(part.get("text", "") for part in parts if part.get("type") != "break")
