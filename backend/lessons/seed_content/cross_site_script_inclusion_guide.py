GUIDE = {
    "overview": {
        "title": "Cross-Site Script Inclusion (XSSI)",
        "metrics": [
            {"icon": "📊", "label": "Prevalence:", "value": "Occasional", "tone": "orange"},
            {"icon": "💣", "label": "Exploitability:", "value": "Easy", "tone": "red"},
            {"icon": "🔥", "label": "Impact:", "value": "Harmful", "tone": "orange"},
        ],
        "paragraphs": [
            [
                {
                    "type": "text",
                    "text": "A Cross-Site Script Inclusion (XSSI) attack occurs when a malicious site imports JavaScript from a third-party domain and is able to extract sensitive details like user credentials from the imported script.",
                }
            ]
        ],
    },
    "sections": [
        {
            "icon": "⚠️",
            "title": "Risks",
            "blocks": [
                {
                    "type": "paragraph",
                    "parts": [
                        {
                            "type": "text",
                            "text": "If your website stores sensitive data in JavaScript files, an attacker can trick users into visiting a malicious site which imports your JavaScript code, allowing the attacker to scoop up any sensitive data included within that code.",
                        }
                    ],
                }
            ],
        },
        {
            "title": "Anatomy of an XSSI Attack",
            "blocks": [
                {
                    "type": "paragraph",
                    "parts": [
                        {
                            "type": "text",
                            "text": "JavaScript files are not subject to the same-origin policy in browsers in the same way that other content types (like JSON and HTML) are. This allows JavaScript files to be included from different domains, but also creates an opportunity for attackers to steal sensitive data written inside those files.",
                        }
                    ],
                },
                {
                    "type": "paragraph",
                    "parts": [
                        {
                            "type": "text",
                            "text": "Developers often embed state directly into JavaScript files for Single Page Apps (SPAs), giving scripts contextual information even before loading additional data. However, any website can import your transpiled JavaScript files with a simple <script> tag.",
                        }
                    ],
                },
                {
                    "type": "paragraph",
                    "parts": [
                        {
                            "type": "text",
                            "text": "A malicious website can include your JavaScript bundles, harvest the sensitive data embedded within them, and even lure victims by posting links inside comments on your legitimate site.",
                        }
                    ],
                },
            ],
        },
        {
            "title": "Mitigation",
            "blocks": [
                {
                    "type": "paragraph",
                    "parts": [
                        {
                            "type": "text",
                            "text": "To avoid XSSI attacks, do not interpolate sensitive data directly into JavaScript files. Instead, load state using JSON endpoints or encode data in HTML where the browser’s same-origin policy provides protection. Below are safe examples showing how to initialize page state in React and Angular by loading configuration from a JSON URL.",
                        }
                    ],
                }
            ],
        },
    ],
    "code_samples": {
        "items": [
            {
                "title": "React",
                "samples": [
                    {
                        "heading": "React",
                        "code": """// Retrieve configuration information from the server.
async componentDidMount() {
  const response = await fetch('/api/config')
  const data = await response.json()

  this.setState({
    loading: false,
    user: data.user,
    accessToken: data.accessToken
  })
}""",
                    }
                ],
            },
            {
                "title": "Angular JS",
                "samples": [
                    {
                        "heading": "Angular JS",
                        "code": """// The configuration information we will retrieve from the server.
export interface Config {
  username: string;
  accessToken: string;
  role: string;
}

@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) {}

  // Retrieve configuration information from the server.
  getConfig() {
    return this.http.get<Config>('api/config').pipe(catchError(this.handleError))
  }
}""",
                    }
                ],
            },
        ],
        "quiz_cta": {
            "eyebrow": "Got all that?",
            "icon": "🧠",
            "label": "Quiz:",
            "title": "XSSI",
            "summary": "Take a quick quiz to show you were paying attention →",
            "path": "/lessons/cross-site-script-inclusion-quiz",
        },
    },
}
