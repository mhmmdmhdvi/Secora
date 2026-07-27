GUIDE = {
    "overview": {
        "title": "SQL Injection",
        "metrics": [
            {
                "icon": "📊",
                "label": "Prevalence",
                "value": "Occasional",
                "tone": "orange",
            },
            {
                "icon": "💣",
                "label": "Exploitability",
                "value": "Easy",
                "tone": "red",
            },
            {
                "icon": "🔥",
                "label": "Impact",
                "value": "Devastating",
                "tone": "rose",
            },
        ],
        "paragraphs": [
            [
                {"type": "strong", "text": "SQL Injection"},
                {
                    "type": "text",
                    "text": " is a type of injection attack. Injection attacks occur when maliciously crafted inputs are submitted by an attacker, causing an application to perform an unintended action. Because of the ubiquity of SQL databases, SQL injection is one of the most common types of attack on the internet.",
                },
            ],
            [
                {
                    "type": "strong",
                    "text": "If you only have time to protect yourself against one vulnerability, you should be checking for SQL injection vulnerabilities in your codebase!",
                }
            ],
        ],
    },
    "risks": {
        "icon": "⚠️",
        "title": "Risks",
        "paragraphs": [
            [
                {
                    "type": "text",
                    "text": "Our example hack showed you how to bypass the login page: a huge security flaw for a banking site. More complex attacks will allow an attacker to run arbitrary statements on the database. In the past, hackers have used injection attacks to:",
                }
            ],
            [
                {"type": "strong", "text": "SQL injection attacks are astonishingly common."},
                {
                    "type": "text",
                    "text": " Major companies like Yahoo and Sony have had their applications compromised. In other cases, hacker groups targeted specific applications or wrote scripts intended to harvest authentication details. Not even security firms are immune!",
                },
            ],
        ],
        "bullets": [
            [
                {"type": "strong", "text": "Extract sensitive information"},
                {
                    "type": "text",
                    "text": ", like Social Security numbers, or credit card details.",
                },
            ],
            [
                {
                    "type": "strong",
                    "text": "Enumerate the authentication details of users registered on a website,",
                },
                {
                    "type": "text",
                    "text": " so these logins can be used in attacks on other sites.",
                },
            ],
            [
                {"type": "strong", "text": "Delete data or drop tables"},
                {
                    "type": "text",
                    "text": ", corrupting the database, and making the website unusable.",
                },
            ],
            [
                {"type": "strong", "text": "Inject further malicious code"},
                {"type": "text", "text": " to be executed when users visit the site."},
            ],
        ],
    },
    "protection": {
        "icon": "🛡️",
        "title": "Protection",
        "callout": "So SQL Injection is a serious risk. How can you protect yourself?",
        "blocks": [
            {"type": "heading", "text": "Parameterized Statements"},
            {
                "type": "paragraph",
                "parts": [
                    {"type": "text", "text": "Programming languages talk to SQL databases using "},
                    {"type": "strong", "text": "database drivers."},
                    {
                        "type": "text",
                        "text": " A driver allows an application to construct and run SQL statements against a database, extracting and manipulating data as needed. ",
                    },
                    {"type": "strong", "text": "Parameterized statements"},
                    {
                        "type": "text",
                        "text": " make sure that the parameters (i.e., inputs) passed into SQL statements are treated in a safe manner.",
                    },
                ],
            },
            {
                "type": "terminal",
                "code": """// Connect to the database.
Connection conn = DriverManager.getConnection(URL, USER, PASS);

// Construct the SQL statement we want to run, specifying the parameter.
String sql = "SELECT * FROM users WHERE email = ?";

// Generate a prepared statement with the placeholder parameter.
PreparedStatement stmt = conn.prepareStatement(sql);

// Bind email value into the statement at parameter index 1.
stmt.setString(1, email);

// Run the query...
ResultSet results = stmt.executeQuery(sql);

while (results.next())
{
  // ...do something with the data returned.
}""",
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "Contrast this to explicit construction of the SQL string, which is ",
                    },
                    {"type": "strong", "text": "very, very dangerous:"},
                ],
            },
            {
                "type": "terminal",
                "code": """// The user we want to find.
String email = "user@email.com";

// Connect to the database.
Connection conn = DriverManager.getConnection(URL, USER, PASS);
Statement stmt = conn.createStatement();

// Bad, bad news! Don't construct the query with string concatenation.
String sql = "SELECT * FROM users WHERE email = '" + email + "'";

// I have a bad feeling about this...
ResultSet results = stmt.executeQuery(sql);

while (results.next()) {
  // ...oh look, we got hacked.
}""",
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "The key difference is the data being passed to the ",
                    },
                    {"type": "strong", "text": "executeQuery(...)"},
                    {
                        "type": "text",
                        "text": " method. In the first case, the parameterized string and the parameters are passed to the database separately, which allows the driver to correctly interpret them. In the second case, the full SQL statement is constructed before the driver is invoked, meaning we are vulnerable to maliciously crafted parameters.",
                    },
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "strong",
                        "text": "You should always use parameterized statements where available, they are your number one protection against SQL injection.",
                    }
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "You can see more examples of parameterized statements in various languages in the code samples below.",
                    }
                ],
            },
            {"type": "heading", "text": "Object Relational Mapping"},
            {
                "type": "paragraph",
                "parts": [
                    {"type": "text", "text": "Many development teams prefer to use "},
                    {"type": "strong", "text": "Object Relational Mapping (ORM)"},
                    {
                        "type": "text",
                        "text": " frameworks to make the translation of SQL result sets into code objects more seamless. ORM tools often mean developers will rarely have to write SQL statements in their code -- and these tools thankfully use parameterized statements under the hood.",
                    },
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "The most well-known ORM is probably Ruby on Rails' ",
                    },
                    {"type": "strong", "text": "Active Record"},
                    {
                        "type": "text",
                        "text": " framework. Fetching data from the database using Active Record looks like this:",
                    },
                ],
            },
            {
                "type": "terminal",
                "code": """def current_user(email)
  # The 'User' object is an Active Record object with generated find methods.
  User.find_by_email(email)
end""",
            },
            {"type": "paragraph", "parts": [{"type": "text", "text": "Code like this is safe from SQL Injection attacks."}]},
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "strong",
                        "text": "Using an ORM does not automatically make you immune to SQL injection, however.",
                    },
                    {
                        "type": "text",
                        "text": " Many ORM frameworks allow you to construct SQL statements manually when more complex operations are needed. For example, the following Ruby code is vulnerable:",
                    },
                ],
            },
            {
                "type": "terminal",
                "code": """def current_user(email)
  # This code is vulnerable to SQL injection.
  User.where("email = '" + email + "'")
end""",
            },
            {
                "type": "paragraph",
                "parts": [
                    {"type": "strong", "text": "As a general rule of thumb:"},
                    {
                        "type": "text",
                        "text": " if you find yourself writing SQL statements by concatenating strings, think very carefully about what you are doing.",
                    },
                ],
            },
            {"type": "heading", "text": "Escaping Inputs"},
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "If you are unable to use parameterized statements or a library that writes SQL for you, the next best approach is to ensure proper escaping of special string characters in input parameters.",
                    }
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "Injection attacks often rely on the attacker being able to craft an input that will prematurely close the argument string in which they appear in the SQL statement. (This is why you will often see ' or \" characters in attempted SQL injection attacks.)",
                    }
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "Programming languages have standard ways to describe strings containing quotes within them -- SQL is no different in this respect. Typically, doubling up the quote character -- replacing ' with '' -- means ",
                    },
                    {
                        "type": "strong",
                        "text": "\"treat this quote as part of the string, not the end of the string\".",
                    },
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "Escaping symbol characters is a simple way to protect against most SQL injection attacks, and many languages have standard functions to achieve this. There are a couple of drawbacks to this approach, however:",
                    }
                ],
            },
            {
                "type": "list",
                "items": [
                    [
                        {
                            "type": "strong",
                            "text": "You need to be very careful to escape characters everywhere in your codebase where an SQL statement is constructed.",
                        }
                    ],
                    [
                        {
                            "type": "strong",
                            "text": "Not all injection attacks rely on abuse of quote characters.",
                        }
                    ],
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "For example, when a numeric ID is expected in a SQL statement, quote characters are not required. The following code is still vulnerable to injection attacks, no matter how much you play around with quote characters:",
                    }
                ],
            },
            {
                "type": "terminal",
                "code": """def current_user(id)
  User.where("id = " + id)
end""",
            },
            {"type": "heading", "text": "Sanitizing Inputs"},
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "Sanitizing inputs is a good practice for all applications. In our example hack, the user supplied a password as ' or 1=1--, which looks pretty suspicious as a password choice.",
                    }
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "Developers should always make an effort to reject inputs that look suspicious out of hand, while taking care not to accidentally punish legitimate users. For instance, your application may clean parameters supplied in GET and POST requests in the following ways:",
                    }
                ],
            },
            {
                "type": "list",
                "items": [
                    [{"type": "text", "text": "Check that supplied fields like email addresses match a regular expression."}],
                    [{"type": "text", "text": "Ensure that numeric or alphanumeric fields do not contain symbol characters."}],
                    [{"type": "text", "text": "Reject (or strip) out whitespace and new line characters where they are not appropriate."}],
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "strong",
                        "text": "Client-side validation (i.e. in JavaScript) is useful for giving the user immediate feedback when filling out a form, but is no defense against a serious hacker. Most hack attempts are performed using scripts, rather than the browser itself.",
                    }
                ],
            },
        ],
    },
    "code_samples": {
        "icon": "📝",
        "title": "Code Samples",
        "intro": "The code samples below illustrate good and bad practices when trying to protect against SQL injection.",
        "quiz_cta": {
            "eyebrow": "Got all that?",
            "icon": "🧠",
            "label": "Quiz:",
            "title": "SQL Injection",
            "summary": "Take a quick quiz to show you were paying attention →",
            "path": "/lessons/sql-injection-quiz",
        },
        "items": [
            {
                "title": "Node",
                "samples": [
                    {
                        "heading": "Node-sql",
                        "code": """var sql = require('sql');

// Queries are constructed as parameterized by default.
var query = user.select(user.star())
         .from(user)
         .where(
              user.email.equals(email)
         ).toQuery();""",
                    },
                    {
                        "heading": "mysql",
                        "code": """var mysql = require('mysql');

var connection = mysql.createConnection({
         host     : HOST,
         user     : USERNAME,
         password : PASSWORD
});

connection.connect();

// Query and parameters passed separately.
connection.query(
         'select * from users where email = ?',
         [email],
         function(err, rows, fields) {
               // Do something with the retrieved data.
         });

connection.end();""",
                    },
                    {
                        "heading": "pg",
                        "code": """var pg = require('pg');

var connection = "postgres://username:password@localhost/database";
var client = new pg.Client(connection);

// Query and parameters passed separately.
client.connect(function(err) {
  client.query(
    'select * from users where email = ?',
    [email],
    function(err, result) {
      // Do something with the retrieved data.
    });
});

client.end();""",
                    },
                ],
            },
            {
                "title": "Python",
                "samples": [
                    {
                        "heading": "DB 2.0 API",
                        "code": """# SQL and parameter is sent off separately to the database driver.
cursor.execute("select user_id, user_name from users where email = ?", email)

for row in cursor.fetchall():
     print row.user_id, row.user_name

# String concatenation is vulnerable.
cursor.execute("select user_id, user_name from users where email = '%s'" % email)""",
                    },
                    {
                        "heading": "Django",
                        "code": """# Fetch using a user using native ORM syntax, good.
Users.objects.filter(email=email)

# Fetch a user using raw SQL, also safe.
Users.objects.raw("select * from users where email = %s", [email])

# Liable to get hacked.
Users.objects.raw("select * from users where email = '%s'" % email)""",
                    },
                ],
            },
            {
                "title": "Ruby",
                "samples": [
                    {
                        "heading": "Active Record",
                        "code": """def current_user(email)
   User.find_by_email(email)
end

def current_user(email)
  User.where("email = '" + email + "'")
end""",
                    },
                    {
                        "heading": "Sequel",
                        "code": """def current_user(email)
  User.where(:email=>email)
end

def current_user(email)
  User.where("email = #{params[:email]}")
end""",
                    },
                ],
            },
            {
                "title": "Java",
                "samples": [
                    {
                        "heading": "JDBC",
                        "code": """Connection conn = DriverManager.getConnection(URL, USER, PASS);
String sql = "SELECT * FROM users WHERE email = ?";
PreparedStatement stmt = conn.prepareStatement(sql);
stmt.setString(1, email);
ResultSet results = stmt.executeQuery(sql);

String unsafe = "SELECT * FROM users WHERE email = '" + email + "'";
ResultSet unsafeResults = stmt.executeQuery(unsafe);""",
                    },
                    {
                        "heading": "Hibernate",
                        "code": """@Entity
public class User {
  @Id
  @GeneratedValue
  Long id;

  @NaturalId
  String email;
}

return session.bySimpleNaturalId(User.class).load(email);""",
                    },
                    {
                        "heading": "Spring",
                        "code": """public Customer findUserByEmail(String email) {
  String sql = "select * from users where email = ?";

  User user = (User) getJdbcTemplate().queryForObject(
    sql,
    new Object[] { email },
    new UserRowMapper());

  return user;
}""",
                    },
                ],
            },
            {
                "title": "C#",
                "samples": [
                    {
                        "heading": "SqlClient",
                        "code": """SqlCommand command = new SqlCommand(
  "select * from Users where email = @email", conn);

command.Parameters.Add(new SqlParameter("email", email));

using (SqlDataReader reader = command.ExecuteReader()) {
  while (reader.Read()) {
    // Do something with the retrieved data.
  }
}""",
                    },
                    {
                        "heading": "LINQ",
                        "code": """using (ServiceContext ctx = new ServiceContext(...)) {
  var users = from user in ctx.Users
              where user.email equals email
              select user;

  foreach (var user in users) {
    // Do something with the retrieved data.
  }
}""",
                    },
                ],
            },
            {
                "title": "PHP",
                "samples": [
                    {
                        "heading": "PDO",
                        "code": """$statement = $dbh->prepare("select * from users where email = ?");
$statement->execute(array(email));""",
                    },
                ],
            },
        ],
    },
}

FA_GUIDE = {
    "overview": {
        "title": "SQL Injection",
        "metrics": [
            {
                **GUIDE["overview"]["metrics"][0],
                "label": "چقدر رایج است",
                "value": "گاه‌به‌گاه",
            },
            {
                **GUIDE["overview"]["metrics"][1],
                "label": "سوءاستفاده از آن",
                "value": "آسان",
            },
            {
                **GUIDE["overview"]["metrics"][2],
                "label": "شدت آسیب",
                "value": "زیاد",
            },
        ],
        "paragraphs": [
            [
                {"type": "strong", "text": "SQL Injection"},
                {
                    "type": "text",
                    "text": " نوعی حمله injection است. حمله‌های injection زمانی رخ می‌دهند که مهاجم ورودی‌ای با ساختار مخرب ارسال می‌کند و باعث می‌شود برنامه کاری را انجام دهد که قرار نبوده انجام بدهد. چون پایگاه‌داده‌های SQL در وب بسیار رایج‌اند، SQL Injection هم یکی از شناخته‌شده‌ترین و رایج‌ترین حمله‌های اینترنتی است.",
                },
            ],
            [
                {
                    "type": "strong",
                    "text": "اگر فقط برای محافظت در برابر یک آسیب‌پذیری وقت داری، بررسی SQL Injection در کدبیس باید یکی از اولین اولویت‌هایت باشد!",
                }
            ],
        ],
    },
    "risks": {
        "icon": GUIDE["risks"]["icon"],
        "title": "ریسک‌ها",
        "paragraphs": [
            [
                {
                    "type": "text",
                    "text": "در مثال هک دیدی چطور می‌شود صفحه ورود را دور زد؛ برای یک سایت بانکی، این یک نقص امنیتی بسیار جدی است. حمله‌های پیچیده‌تر می‌توانند به مهاجم اجازه دهند دستورهای دلخواه روی پایگاه‌داده اجرا کند. در گذشته، مهاجمان از حمله‌های injection برای این کارها استفاده کرده‌اند:",
                }
            ],
            [
                {"type": "strong", "text": "حمله‌های SQL Injection به‌طرز عجیبی رایج‌اند."},
                {
                    "type": "text",
                    "text": " شرکت‌های بزرگی مثل Yahoo و Sony هم سابقه نفوذ از این جنس آسیب‌پذیری‌ها را داشته‌اند. در موارد دیگر، گروه‌های هکری برنامه‌های خاصی را هدف گرفته‌اند یا اسکریپت‌هایی نوشته‌اند که اطلاعات ورود کاربران را جمع‌آوری کند. حتی شرکت‌های امنیتی هم از این خطر کاملاً مصون نیستند!",
                },
            ],
        ],
        "bullets": [
            [
                {"type": "strong", "text": "استخراج اطلاعات حساس"},
                {
                    "type": "text",
                    "text": " مثل شماره‌های شناسایی، اطلاعات کارت بانکی یا داده‌های محرمانه کاربران.",
                },
            ],
            [
                {
                    "type": "strong",
                    "text": "فهرست‌کردن اطلاعات احراز هویت کاربران ثبت‌شده در یک وب‌سایت،",
                },
                {
                    "type": "text",
                    "text": " تا از همان ورودها برای حمله به سایت‌های دیگر استفاده شود.",
                },
            ],
            [
                {"type": "strong", "text": "حذف داده‌ها یا drop کردن جدول‌ها"},
                {
                    "type": "text",
                    "text": " که می‌تواند پایگاه‌داده را خراب کند و وب‌سایت را از کار بیندازد.",
                },
            ],
            [
                {"type": "strong", "text": "تزریق کد مخرب بیشتر"},
                {"type": "text", "text": " که هنگام بازدید کاربران از سایت اجرا شود."},
            ],
        ],
    },
    "protection": {
        "icon": GUIDE["protection"]["icon"],
        "title": "محافظت",
        "callout": "پس SQL Injection یک ریسک جدی است. چطور می‌توانی از خودت محافظت کنی؟",
        "blocks": [
            {"type": "heading", "text": "Parameterized Statements"},
            {
                "type": "paragraph",
                "parts": [
                    {"type": "text", "text": "زبان‌های برنامه‌نویسی برای صحبت با پایگاه‌داده‌های SQL از "},
                    {"type": "strong", "text": "database driver"},
                    {
                        "type": "text",
                        "text": " استفاده می‌کنند. driver به برنامه اجازه می‌دهد دستورهای SQL بسازد و روی پایگاه‌داده اجرا کند تا داده‌ها را بخواند یا تغییر دهد. ",
                    },
                    {"type": "strong", "text": "Parameterized statements"},
                    {
                        "type": "text",
                        "text": " مطمئن می‌شوند پارامترها، یعنی همان ورودی‌هایی که وارد دستور SQL می‌شوند، به شکل امن تفسیر شوند.",
                    },
                ],
            },
            {"type": "terminal", "code": GUIDE["protection"]["blocks"][2]["code"]},
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "این را با ساختن مستقیم رشته SQL مقایسه کن؛ کاری که ",
                    },
                    {"type": "strong", "text": "واقعاً خطرناک است:"},
                ],
            },
            {"type": "terminal", "code": GUIDE["protection"]["blocks"][4]["code"]},
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "تفاوت کلیدی در داده‌ای است که به متد ",
                    },
                    {"type": "strong", "text": "executeQuery(...)"},
                    {
                        "type": "text",
                        "text": " داده می‌شود. در حالت اول، رشته پارامتری و مقدار پارامتر جداگانه به پایگاه‌داده فرستاده می‌شوند و driver می‌تواند آن‌ها را درست تفسیر کند. در حالت دوم، کل دستور SQL قبل از فراخوانی driver ساخته می‌شود؛ یعنی در برابر پارامترهای مخرب آسیب‌پذیر می‌شویم.",
                    },
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "strong",
                        "text": "هرجا امکانش وجود دارد از parameterized statements استفاده کن؛ این مهم‌ترین خط دفاعی تو در برابر SQL Injection است.",
                    }
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "در نمونه‌کدهای پایین می‌توانی مثال‌های بیشتری از parameterized statements در زبان‌های مختلف ببینی.",
                    }
                ],
            },
            {"type": "heading", "text": "Object Relational Mapping"},
            {
                "type": "paragraph",
                "parts": [
                    {"type": "text", "text": "بسیاری از تیم‌های توسعه ترجیح می‌دهند از فریم‌ورک‌های "},
                    {"type": "strong", "text": "Object Relational Mapping (ORM)"},
                    {
                        "type": "text",
                        "text": " استفاده کنند تا تبدیل نتیجه‌های SQL به آبجکت‌های برنامه ساده‌تر شود. ORMها معمولاً باعث می‌شوند توسعه‌دهنده کمتر مجبور شود SQL خام بنویسد، و خوشبختانه بیشترشان در پشت صحنه از parameterized statements استفاده می‌کنند.",
                    },
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "یکی از معروف‌ترین ORMها احتمالاً ",
                    },
                    {"type": "strong", "text": "Active Record"},
                    {
                        "type": "text",
                        "text": " در Ruby on Rails است. گرفتن داده از پایگاه‌داده با Active Record می‌تواند شبیه این باشد:",
                    },
                ],
            },
            {"type": "terminal", "code": GUIDE["protection"]["blocks"][11]["code"]},
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "کدی شبیه این در برابر حمله‌های SQL Injection امن است.",
                    }
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "strong",
                        "text": "البته استفاده از ORM به‌صورت خودکار تو را در برابر SQL Injection کاملاً ایمن نمی‌کند.",
                    },
                    {
                        "type": "text",
                        "text": " بسیاری از ORMها اجازه می‌دهند برای عملیات پیچیده‌تر، دستور SQL را دستی بسازی. برای مثال، کد Ruby زیر آسیب‌پذیر است:",
                    },
                ],
            },
            {"type": "terminal", "code": GUIDE["protection"]["blocks"][14]["code"]},
            {
                "type": "paragraph",
                "parts": [
                    {"type": "strong", "text": "به عنوان یک قانون کلی:"},
                    {
                        "type": "text",
                        "text": " اگر دیدی داری دستور SQL را با چسباندن رشته‌ها به هم می‌سازی، خیلی جدی مکث کن و دوباره به کاری که می‌کنی فکر کن.",
                    },
                ],
            },
            {"type": "heading", "text": "Escaping Inputs"},
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "اگر نمی‌توانی از parameterized statements یا کتابخانه‌ای استفاده کنی که SQL را برایت امن می‌سازد، راه بعدی این است که کاراکترهای خاص ورودی را درست escape کنی.",
                    }
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "حمله‌های injection معمولاً به این وابسته‌اند که مهاجم بتواند ورودی‌ای بسازد که رشته آرگومان داخل دستور SQL را زودتر از موعد ببندد. به همین دلیل در تلاش‌های SQL Injection زیاد کاراکترهای ' یا \" را می‌بینی.",
                    }
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "زبان‌های برنامه‌نویسی روش‌های استانداردی برای نمایش رشته‌هایی دارند که داخلشان quote وجود دارد؛ SQL هم از این نظر متفاوت نیست. معمولاً دوبرابر کردن quote، یعنی جایگزین کردن ' با ''، یعنی ",
                    },
                    {
                        "type": "strong",
                        "text": "«این quote بخشی از رشته است، نه پایان رشته».",
                    },
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "Escape کردن کاراکترهای نمادین راه ساده‌ای برای کاهش بسیاری از حمله‌های SQL Injection است و زبان‌های مختلف معمولاً تابع‌های استانداردی برای آن دارند. با این حال، این روش چند ضعف مهم دارد:",
                    }
                ],
            },
            {
                "type": "list",
                "items": [
                    [
                        {
                            "type": "strong",
                            "text": "باید در تمام نقاط کدبیس که دستور SQL ساخته می‌شود، با دقت کاراکترها را escape کنی.",
                        }
                    ],
                    [
                        {
                            "type": "strong",
                            "text": "همه حمله‌های injection به سوءاستفاده از quote وابسته نیستند.",
                        }
                    ],
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "برای مثال، وقتی در دستور SQL انتظار یک ID عددی وجود دارد، نیازی به quote نیست. کد زیر همچنان در برابر injection آسیب‌پذیر است، هرچقدر هم با quoteها بازی کنی:",
                    }
                ],
            },
            {"type": "terminal", "code": GUIDE["protection"]["blocks"][23]["code"]},
            {"type": "heading", "text": "Sanitizing Inputs"},
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "پاک‌سازی ورودی‌ها برای همه برنامه‌ها عادت خوبی است. در مثال ما، کاربر رمزی مثل ' or 1=1-- فرستاد؛ چیزی که برای یک رمز عبور کاملاً مشکوک به نظر می‌رسد.",
                    }
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "text",
                        "text": "توسعه‌دهنده‌ها باید تلاش کنند ورودی‌هایی را که مشکوک به نظر می‌رسند رد کنند، البته بدون اینکه کاربران واقعی را بی‌دلیل تنبیه کنند. مثلاً برنامه می‌تواند پارامترهای GET و POST را این‌طور بررسی یا پاک‌سازی کند:",
                    }
                ],
            },
            {
                "type": "list",
                "items": [
                    [{"type": "text", "text": "بررسی کن فیلدهایی مثل email با یک regular expression معتبر هماهنگ باشند."}],
                    [{"type": "text", "text": "مطمئن شو فیلدهای عددی یا حروف‌عددی شامل کاراکترهای نمادین غیرمنتظره نیستند."}],
                    [{"type": "text", "text": "فاصله‌ها و خط جدید را در جاهایی که مناسب نیستند رد کن یا حذف کن."}],
                ],
            },
            {
                "type": "paragraph",
                "parts": [
                    {
                        "type": "strong",
                        "text": "اعتبارسنجی سمت کاربر، مثلاً در JavaScript، برای دادن بازخورد سریع به کاربر مفید است؛ اما در برابر مهاجم جدی دفاع محسوب نمی‌شود. بیشتر تلاش‌های هک با اسکریپت انجام می‌شوند، نه با خود مرورگر.",
                    }
                ],
            },
        ],
    },
    "code_samples": {
        **GUIDE["code_samples"],
        "title": "نمونه‌کدها",
        "intro": "نمونه‌کدهای زیر چند روش خوب و بد برای محافظت در برابر SQL Injection را نشان می‌دهند.",
        "quiz_cta": {
            **GUIDE["code_samples"]["quiz_cta"],
            "eyebrow": "یاد گرفتی؟",
            "label": "آزمون:",
            "summary": "یک آزمون کوتاه بده تا مطمئن شوی نکته‌ها را خوب گرفته‌ای ←",
        },
    },
}

GUIDE_TRANSLATIONS = {
    "en": GUIDE,
    "fa": FA_GUIDE,
}
