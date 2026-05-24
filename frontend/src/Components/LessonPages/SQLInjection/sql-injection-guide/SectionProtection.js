import TerminalBox from "./TerminalBox";

export default function SectionProtection() {
  return (
    <section className="w-full flex flex-col items-center mt-12 sm:mt-16">
      <div className="w-full max-w-4xl px-2 sm:px-0">

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl text-gray-700" aria-hidden="true">🛡️</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-500">Protection</h2>
        </div>

        {/* Emphasis box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
          <p className="text-lg font-semibold text-gray-900">
            So SQL Injection is a serious risk. How can you protect yourself?
          </p>
        </div>

        {/* Content */}
        <div className="text-black text-base sm:text-lg leading-relaxed space-y-5 sm:space-y-6">

          <p><strong>Parameterized Statements</strong></p>

          <p>
            Programming languages talk to SQL databases using <strong>database drivers.</strong> 
            A driver allows an application to construct and run SQL statements against a database,
            extracting and manipulating data as needed. <strong>Parameterized statements</strong> 
            make sure that the parameters (i.e., inputs) passed into SQL statements are treated in 
            a safe manner.
          </p>

          {/* Terminal 1 - SAFE example */}
          <TerminalBox>
            <p className="text-gray-400">// Connect to the database.</p>
            <p>
              <span className="text-orange-400">Connection</span>{' '}
              <span className="text-green-400">conn</span>{' '}
              <span className="text-white">= DriverManager.getConnection(URL, USER, PASS);</span>
            </p>

            <p className="text-gray-400 mt-3">// Construct the SQL statement we want to run, specifying the parameter.</p>
            <p>
              <span className="text-orange-400">String</span>{' '}
              <span className="text-green-400">sql</span>{' '}
              <span className="text-white">= </span>
              <span className="text-green-400">"SELECT * FROM users WHERE email = ?"</span>
              <span className="text-white">;</span>
            </p>

            <p className="text-gray-400 mt-3">// Generate a prepared statement with the placeholder parameter.</p>
            <p>
              <span className="text-orange-400">PreparedStatement</span>{' '}
              <span className="text-green-400">stmt</span>{' '}
              <span className="text-white">= conn.prepareStatement(sql);</span>
            </p>

            <p className="text-gray-400 mt-3">// Bind email value into the statement at parameter index 1.</p>
            <p>
              <span className="text-white">stmt.setString(</span>
              <span className="text-orange-400">1</span>
              <span className="text-white">, email);</span>
            </p>

            <p className="text-gray-400 mt-3">// Run the query...</p>
            <p>
              <span className="text-orange-400">ResultSet</span>{' '}
              <span className="text-green-400">results</span>{' '}
              <span className="text-white">= stmt.executeQuery(sql);</span>
            </p>

            <p className="mt-2">
              <span className="text-blue-400">while</span>{' '}
              <span className="text-white">(results.next())</span>
            </p>
            <p className="text-white">{'{'}</p>
            <p className="text-gray-400 ml-6">// ...do something with the data returned.</p>
            <p className="text-white">{'}'}</p>
          </TerminalBox>

          <p>
            Contrast this to explicit construction of the SQL string, which is{' '}
            <strong>very, very dangerous:</strong>
          </p>

          {/* Terminal 2 - UNSAFE example */}
          <TerminalBox>
            <p className="text-gray-400">// The user we want to find.</p>
            <p>
              <span className="text-orange-400">String</span>{' '}
              <span className="text-green-400">email</span>{' '}
              <span className="text-white">= </span>
              <span className="text-green-400">"user@email.com"</span>
              <span className="text-white">;</span>
            </p>

            <p className="text-gray-400 mt-3">// Connect to the database.</p>
            <p>
              <span className="text-orange-400">Connection</span>{' '}
              <span className="text-green-400">conn</span>{' '}
              <span className="text-white">= DriverManager.getConnection(URL, USER, PASS);</span>
            </p>
            <p>
              <span className="text-orange-400">Statement</span>{' '}
              <span className="text-green-400">stmt</span>{' '}
              <span className="text-white">= conn.createStatement();</span>
            </p>

            <p className="text-gray-400 mt-3">// Bad, bad news! Don't construct the query with string concatenation.</p>
            <p>
              <span className="text-orange-400">String</span>{' '}
              <span className="text-green-400">sql</span>{' '}
              <span className="text-white">= </span>
              <span className="text-green-400">"SELECT * FROM users WHERE email = '"</span>
              <span className="text-white"> + email + </span>
              <span className="text-green-400">"'"</span>
              <span className="text-white">;</span>
            </p>

            <p className="text-gray-400 mt-3">// I have a bad feeling about this...</p>
            <p>
              <span className="text-orange-400">ResultSet</span>{' '}
              <span className="text-green-400">results</span>{' '}
              <span className="text-white">= stmt.executeQuery(sql);</span>
            </p>

            <p className="mt-2">
              <span className="text-blue-400">while</span>{' '}
              <span className="text-white">(results.next()) {'{'}</span>
            </p>
            <p className="text-gray-400 ml-6">// ...oh look, we got hacked.</p>
            <p className="text-white">{'}'}</p>
          </TerminalBox>

          <p>
            The key difference is the data being passed to the <strong>executeQuery(...)</strong> 
            method. In the first case, the parameterized string and the parameters are passed to 
            the database separately, which allows the driver to correctly interpret them. In the 
            second case, the full SQL statement is constructed before the driver is invoked, 
            meaning we are vulnerable to maliciously crafted parameters.
          </p>

          <p>
            <strong>You should always use parameterized statements where available, they are your number one protection against SQL injection.</strong>
          </p>

          <p>You can see more examples of parameterized statements in various languages in the code samples below.</p>

          <p><strong>Object Relational Mapping</strong></p>

          <p>
            Many development teams prefer to use <strong>Object Relational Mapping (ORM)</strong> 
            frameworks to make the translation of SQL result sets into code objects more seamless. 
            ORM tools often mean developers will rarely have to write SQL statements in their code 
            -- and these tools thankfully use parameterized statements under the hood.
          </p>

          <p>
            The most well-known ORM is probably Ruby on Rails&apos; <strong>Active Record</strong> 
            framework. Fetching data from the database using Active Record looks like this:
          </p>

          {/* Terminal 3 - SAFE ActiveRecord */}
          <TerminalBox>
            <p>
              <span className="text-blue-400">def</span>{' '}
              <span className="text-orange-400">current_user</span>
              <span className="text-white">(email)</span>
            </p>
            <p className="text-gray-400 ml-5"># The 'User' object is an Active Record object with generated find methods.</p>
            <p className="ml-5">
              <span className="text-orange-400">User</span>
              <span className="text-white">.find_by_email(email)</span>
            </p>
            <p>
              <span className="text-blue-400">end</span>
            </p>
          </TerminalBox>

          <p>Code like this is safe from SQL Injection attacks.</p>

          <p>
            <strong>Using an ORM does not automatically make you immune to SQL injection, however.</strong> 
            Many ORM frameworks allow you to construct SQL statements manually when more complex 
            operations are needed. For example, the following Ruby code is vulnerable:
          </p>

          {/* Terminal 4 - UNSAFE ActiveRecord */}
          <TerminalBox>
            <p>
              <span className="text-blue-400">def</span>{' '}
              <span className="text-orange-400">current_user</span>
              <span className="text-white">(email)</span>
            </p>
            <p className="text-gray-400 ml-5"># This code is vulnerable to SQL injection.</p>
            <p className="ml-5">
              <span className="text-orange-400">User</span>
              <span className="text-white">.where(</span>
              <span className="text-green-400">"email = '"</span>
              <span className="text-white"> + email + </span>
              <span className="text-green-400">"'"</span>
              <span className="text-white">)</span>
            </p>
            <p>
              <span className="text-blue-400">end</span>
            </p>
          </TerminalBox>
                    <p>
            <strong>As a general rule of thumb:</strong> if you find yourself writing SQL statements by concatenating strings, think very carefully about what you are doing.
          </p>

          <p><strong>Escaping Inputs</strong></p>

          <p>
            If you are unable to use parameterized statements or a library that writes SQL for you, the next best approach is to ensure proper escaping of special string characters in input parameters.
          </p>

          <p>
            Injection attacks often rely on the attacker being able to craft an input that will prematurely close the argument string in which they appear in the SQL statement. (This is why you will often see ' or " characters in attempted SQL injection attacks.)
          </p>

          <p>
            Programming languages have standard ways to describe strings containing quotes within them -- SQL is no different in this respect. Typically, doubling up the quote character -- replacing ' with '' -- means <strong>"treat this quote as part of the string, not the end of the string".</strong>
          </p>

          <p>
            Escaping symbol characters is a simple way to protect against most SQL injection attacks, and many languages have standard functions to achieve this. There are a couple of drawbacks to this approach, however:
          </p>

          <ul className="list-disc list-outside pl-6 sm:pl-10 space-y-2">
            <li>
              <strong>You need to be very careful to escape characters everywhere in your codebase where an SQL statement is constructed.</strong>
            </li>
            <li>
              <strong>Not all injection attacks rely on abuse of quote characters.</strong>
            </li>
          </ul>

          <p>
            For example, when a numeric ID is expected in a SQL statement, quote characters are not required. The following code is still vulnerable to injection attacks, no matter how much you play around with quote characters:
          </p>

          <TerminalBox>
            <p>
              <span className="text-blue-400">def</span>{' '}
              <span className="text-orange-400">current_user</span>
              <span className="text-white">(id)</span>
            </p>
            <p className="ml-5">
              <span className="text-orange-400">User</span>
              <span className="text-white">.where(</span>
              <span className="text-green-400">"id = "</span>
              <span className="text-white"> + id)</span>
            </p>
            <p>
              <span className="text-blue-400">end</span>
            </p>
          </TerminalBox>

          <p><strong>Sanitizing Inputs</strong></p>

          <p>
            Sanitizing inputs is a good practice for all applications. In our example hack, the user supplied a password as ' or 1=1--, which looks pretty suspicious as a password choice.
          </p>

          <p>
            Developers should always make an effort to reject inputs that look suspicious out of hand, while taking care not to accidentally punish legitimate users. For instance, your application may clean parameters supplied in GET and POST requests in the following ways:
          </p>

          <ul className="list-disc list-outside pl-6 sm:pl-10space-y-2">
            <li>Check that supplied fields like email addresses match a regular expression.</li>
            <li>Ensure that numeric or alphanumeric fields do not contain symbol characters.</li>
            <li>Reject (or strip) out whitespace and new line characters where they are not appropriate.</li>
          </ul>

          <p>
            <strong>Client-side validation (i.e. in JavaScript) is useful for giving the user immediate feedback when filling out a form, but is no defense against a serious hacker. Most hack attempts are performed using scripts, rather than the browser itself.</strong>
          </p>


        </div>
        
      </div>
      
    </section>
  );
}
