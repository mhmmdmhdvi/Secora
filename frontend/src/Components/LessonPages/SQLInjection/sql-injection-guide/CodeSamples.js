import { useState } from "react";
import TerminalBox from "./TerminalBox";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function CodeSamples() {

  const navigate = useNavigate();
  const [open, setOpen] = useState({
    Node: false,
    Python: false,
    Ruby: false,
    Java: false,
    "C#": false,
    PHP: false,
  });

  const toggle = (section) => {
    setOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const Item = ({ title, children }) => {
    const isOpen = !!open[title];

    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300">
        <button
          onClick={() => toggle(title)}
          className="w-full flex justify-between items-center px-5 sm:px-6 py-5 text-left font-semibold
            text-gray-800 bg-white hover:bg-gray-50 active:scale-[0.98] transition"
        >
          <span>{title}</span>

          {/* Arrow Icon */}
          <span
            className={`transform transition-transform duration-300 text-gray-500 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {/* Animated Content */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-6 pt-2 text-gray-700">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full flex flex-col items-center mt-12 sm:mt-20">
      <div className="w-full max-w-4xl px-4 sm:px-0 space-y-6">

        {/* Title */}
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl text-gray-700">📝</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Code Samples
          </h2>
        </div>

        <p className="text-base sm:text-lg text-gray-700">
          The code samples below illustrate good and bad practices when trying
          to protect against SQL injection.
        </p>

        {/* Accordion */}
        <div className="space-y-4">

          <Item title="Node">
            {/* Node-sql */}
            <h3 className="font-semibold mb-2">Node-sql</h3>
            <TerminalBox>
              {/* var sql = require('sql'); */}
              <span className="text-blue-400">var</span>{" "}
              <span className="text-white">sql</span>{" "}
              <span className="text-white">=</span>{" "}
              <span className="text-orange-400">require</span>
              <span className="text-white">&#40;</span>
              <span className="text-green-400">'sql'</span>
              <span className="text-white">&#41;;</span>
              {"\n\n"}
              {/* // Queries are constructed as parameterized by default. */}
              <span className="text-gray-400">
                // Queries are constructed as parameterized by default.
              </span>
              {"\n"}
              {/* var query = user.select(user.star()) */}
              <span className="text-blue-400">var</span>{" "}
              <span className="text-white">query</span>{" "}
              <span className="text-white">=</span>{" "}
              <span className="text-white">user.</span>
              <span className="text-orange-400">select</span>
              <span className="text-white">&#40;</span>
              <span className="text-white">user.</span>
              <span className="text-orange-400">star</span>
              <span className="text-white">&#40;&#41;&#41;</span>
              {"\n         "}
              {/* .from(user) */}
              <span className="text-white">.</span>
              <span className="text-orange-400">from</span>
              <span className="text-white">&#40;user&#41;</span>
              {"\n         "}
              {/* .where( */}
              <span className="text-white">.</span>
              <span className="text-orange-400">where</span>
              <span className="text-white">&#40;</span>
              {"\n              "}
              {/* user.email.equals(email) */}
              <span className="text-white">user.email.</span>
              <span className="text-orange-400">equals</span>
              <span className="text-white">&#40;email&#41;</span>
              {"\n         "}
              {/* ).toQuery(); */}
              <span className="text-white">&#41;.</span>
              <span className="text-orange-400">toQuery</span>
              <span className="text-white">&#40;&#41;;</span>
            </TerminalBox>

            {/* mysql */}
            <h3 className="font-semibold mt-6 mb-2">mysql</h3>
            <TerminalBox>
              {/* var mysql = require('mysql'); */}
              <span className="text-blue-400">var</span>{" "}
              <span className="text-white">mysql</span>{" "}
              <span className="text-white">=</span>{" "}
              <span className="text-orange-400">require</span>
              <span className="text-white">&#40;</span>
              <span className="text-green-400">'mysql'</span>
              <span className="text-white">&#41;;</span>
              {"\n\n"}
              {/* var connection = mysql.createConnection({ */}
              <span className="text-blue-400">var</span>{" "}
              <span className="text-white">connection</span>{" "}
              <span className="text-white">=</span>{" "}
              <span className="text-white">mysql.</span>
              <span className="text-orange-400">createConnection</span>
              <span className="text-white">&#40;&#123;</span>
              {"\n         "}
              <span className="text-white">host     : </span>
              <span className="text-green-400">HOST</span>
              <span className="text-white">,</span>
              {"\n         "}
              <span className="text-white">user     : </span>
              <span className="text-green-400">USERNAME</span>
              <span className="text-white">,</span>
              {"\n         "}
              <span className="text-white">password : </span>
              <span className="text-green-400">PASSWORD</span>
              {"\n"}
              {/* }); */}
              <span className="text-white">&#125;&#41;;</span>
              {"\n\n"}
              {/* connection.connect(); */}
              <span className="text-white">connection.</span>
              <span className="text-orange-400">connect</span>
              <span className="text-white">&#40;&#41;;</span>
              {"\n\n"}
              {/* // Query and parameters passed separately. */}
              <span className="text-gray-400">
                // Query and parameters passed separately.
              </span>
              {"\n"}
              {/* connection.query( */}
              <span className="text-white">connection.</span>
              <span className="text-orange-400">query</span>
              <span className="text-white">&#40;</span>
              {"\n         "}
              <span className="text-green-400">
                {'\'select * from users where email = ?\''}
              </span>
              <span className="text-white">,</span>
              {"\n         "}
              <span className="text-white">[email],</span>
              {"\n         "}
              {/* function(err, rows, fields) { */}
              <span className="text-blue-400">function</span>
              <span className="text-white">
                &#40;err, rows, fields&#41; &#123;
              </span>
              {"\n               "}
              <span className="text-gray-400">
                // Do something with the retrieved data.
              </span>
              {"\n         "}
              {/* } ); */}
              <span className="text-white">&#125;&#41;;</span>
              {"\n\n"}
              {/* connection.end(); */}
              <span className="text-white">connection.</span>
              <span className="text-orange-400">end</span>
              <span className="text-white">&#40;&#41;;</span>
            </TerminalBox>

            {/* pg */}
            <h3 className="font-semibold mt-6 mb-2">pg</h3>
            <TerminalBox>
              {/* var pg = require('pg'); */}
              <span className="text-blue-400">var</span>{" "}
              <span className="text-white">pg</span>{" "}
              <span className="text-white">=</span>{" "}
              <span className="text-orange-400">require</span>
              <span className="text-white">&#40;</span>
              <span className="text-green-400">'pg'</span>
              <span className="text-white">&#41;;</span>
              {"\n\n"}
              {/* var connection = "postgres://..."; */}
              <span className="text-blue-400">var</span>{" "}
              <span className="text-white">connection</span>{" "}
              <span className="text-white">=</span>{" "}
              <span className="text-green-400">
                "postgres://username:password@localhost/database"
              </span>
              <span className="text-white">;</span>
              {"\n\n"}
              {/* var client = new pg.Client(connection); */}
              <span className="text-blue-400">var</span>{" "}
              <span className="text-white">client</span>{" "}
              <span className="text-white">=</span>{" "}
              <span className="text-blue-400">new</span>{" "}
              <span className="text-white">pg.</span>
              <span className="text-orange-400">Client</span>
              <span className="text-white">&#40;connection&#41;;</span>
              {"\n\n"}
              {/* // Query and parameters passed separately. */}
              <span className="text-gray-400">
                // Query and parameters passed separately.
              </span>
              {"\n"}
              {/* client.connect(function(err) { */}
              <span className="text-white">client.</span>
              <span className="text-orange-400">connect</span>
              <span className="text-white">&#40;</span>
              <span className="text-blue-400">function</span>
              <span className="text-white">&#40;err&#41; &#123;</span>
              {"\n  "}
              {/* client.query( */}
              <span className="text-white">client.</span>
              <span className="text-orange-400">query</span>
              <span className="text-white">&#40;</span>
              {"\n    "}
              <span className="text-green-400">
                {'\'select * from users where email = ?\''}
              </span>
              <span className="text-white">,</span>
              {"\n    "}
              <span className="text-white">[email],</span>
              {"\n    "}
              {/* function(err, result) { */}
              <span className="text-blue-400">function</span>
              <span className="text-white">&#40;err, result&#41; &#123;</span>
              {"\n      "}
              <span className="text-gray-400">
                // Do something with the retrieved data.
              </span>
              {"\n    "}
              {/* } ); */}
              <span className="text-white">&#125;&#41;;</span>
              {"\n  "}
              {/* } ); */}
              <span className="text-white">&#125;&#41;;</span>
              {"\n\n"}
              {/* client.end(); */}
              <span className="text-white">client.</span>
              <span className="text-orange-400">end</span>
              <span className="text-white">&#40;&#41;;</span>
            </TerminalBox>
          </Item>

          <Item title="Python">

  <strong className="block text-lg mb-2">DB 2.0 API</strong>

  {/* GOOD – parameterized */}
  <TerminalBox>
    <span className="text-gray-400">
      # SQL and parameter is sent off separately to the database driver.
    </span>
    {"\n"}
    <span className="text-white">cursor.</span>
    <span className="text-orange-400">execute</span>
    <span className="text-white">&#40;</span>
    <span className="text-green-400">
      "select user_id, user_name from users where email = ?"
    </span>
    <span className="text-white">, email&#41;</span>

    {"\n\n"}

    <span className="text-blue-400">for</span>{" "}
    <span className="text-white">row</span>{" "}
    <span className="text-blue-400">in</span>{" "}
    <span className="text-white">cursor.</span>
    <span className="text-orange-400">fetchall</span>
    <span className="text-white">&#40;&#41;:</span>
    {"\n     "}
    <span className="text-orange-400">print</span>{" "}
    <span className="text-white">row.user_id, row.user_name</span>
  </TerminalBox>

  {/* BAD – string concatenation */}
  <TerminalBox>
    <span className="text-gray-400">
      # String concatenation is vulnerable.
    </span>
    {"\n"}
    <span className="text-white">cursor.</span>
    <span className="text-orange-400">execute</span>
    <span className="text-white">&#40;</span>
    <span className="text-green-400">
      "select user_id, user_name from users where email = '%s'"
    </span>
    <span className="text-white"> % email&#41;</span>

    {"\n\n"}

    <span className="text-blue-400">for</span>{" "}
    <span className="text-white">row</span>{" "}
    <span className="text-blue-400">in</span>{" "}
    <span className="text-white">cursor.</span>
    <span className="text-orange-400">fetchall</span>
    <span className="text-white">&#40;&#41;:</span>
    {"\n  "}
    <span className="text-orange-400">print</span>{" "}
    <span className="text-white">row.user_id, row.user_name</span>
  </TerminalBox>

  <strong className="block text-lg mt-6 mb-2">Django</strong>

  {/* GOOD – ORM filter */}
  <TerminalBox>
    <span className="text-gray-400">
      # Fetch using a user using native ORM syntax, good.
    </span>
    {"\n"}
    <span className="text-white">Users.objects.</span>
    <span className="text-orange-400">filter</span>
    <span className="text-white">&#40;email=email&#41;</span>
  </TerminalBox>

  {/* SAFE – raw with parameters */}
  <TerminalBox>
    <span className="text-gray-400">
      # Fetch a user using raw SQL, also safe.
    </span>
    {"\n"}
    <span className="text-white">Users.objects.</span>
    <span className="text-orange-400">raw</span>
    <span className="text-white">&#40;</span>
    <span className="text-green-400">
      "select * from users where email = %s"
    </span>
    <span className="text-white">, [email]&#41;</span>
  </TerminalBox>

  {/* VULNERABLE */}
  <TerminalBox>
    <span className="text-gray-400">
      # Liable to get hacked.
    </span>
    {"\n"}
    <span className="text-white">Users.objects.</span>
    <span className="text-orange-400">raw</span>
    <span className="text-white">&#40;</span>
    <span className="text-green-400">
      "select * from users where email = '%s'"
    </span>
    <span className="text-white"> % email&#41;</span>
  </TerminalBox>

</Item>


          <Item title="Ruby">

<strong className="block text-lg mb-2">Active Record</strong>

<TerminalBox>
<span className="text-blue-400">def</span>{" "}
<span className="text-orange-400">current_user</span>
<span className="text-white">&#40;email&#41;</span>
{"\n   "}
<span className="text-orange-400">User</span>
<span className="text-white">.</span>
<span className="text-orange-400">find_by_email</span>
<span className="text-white">&#40;email&#41;</span>
{"\n"}
<span className="text-blue-400">end</span>
</TerminalBox>

<TerminalBox>
<span className="text-blue-400">def</span>{" "}
<span className="text-orange-400">current_user</span>
<span className="text-white">&#40;email&#41;</span>
{"\n  "}
<span className="text-orange-400">User</span>
<span className="text-white">.</span>
<span className="text-orange-400">where</span>
<span className="text-white">&#40;</span>
<span className="text-green-400">"email = '"</span>
<span className="text-white"> + email + </span>
<span className="text-green-400">"'"</span>
<span className="text-white">&#41;</span>
{"\n"}
<span className="text-blue-400">end</span>
</TerminalBox>


<strong className="block text-lg mt-6 mb-2">Sequel</strong>

<TerminalBox>
<span className="text-blue-400">def</span>{" "}
<span className="text-orange-400">current_user</span>
<span className="text-white">&#40;email&#41;</span>
{"\n  "}
<span className="text-orange-400">User</span>
<span className="text-white">.</span>
<span className="text-orange-400">where</span>
<span className="text-white">&#40;</span>
<span className="text-green-400">:email</span>
<span className="text-white">=&gt;email&#41;</span>
{"\n"}
<span className="text-blue-400">end</span>
</TerminalBox>

<TerminalBox>
<span className="text-blue-400">def</span>{" "}
<span className="text-orange-400">current_user</span>
<span className="text-white">&#40;email&#41;</span>
{"\n  "}
<span className="text-orange-400">User</span>
<span className="text-white">.</span>
<span className="text-orange-400">where</span>
<span className="text-white">&#40;</span>
<span className="text-green-400">"email = #&#123;params[:email]&#125;"</span>
<span className="text-white">&#41;</span>
{"\n"}
<span className="text-blue-400">end</span>
</TerminalBox>

</Item>


          <Item title="Java">

  <strong className="block text-lg mb-2">JDBC</strong>

  <TerminalBox>
    <span className="text-gray-400">// Connect to the database.</span>{"\n"}
    <span className="text-orange-400">Connection</span>{" "}
    <span className="text-green-400">conn</span>{" "}
    <span className="text-white">= DriverManager.getConnection&#40;URL, USER, PASS&#41;;</span>

    {"\n\n"}
    <span className="text-gray-400">
      // Construct the SQL statement we want to run, specifying the parameter.
    </span>{"\n"}
    <span className="text-orange-400">String</span>{" "}
    <span className="text-green-400">sql</span>{" "}
    <span className="text-white">= </span>
    <span className="text-green-400">"SELECT * FROM users WHERE email = ?"</span>
    <span className="text-white">;</span>

    {"\n\n"}
    <span className="text-gray-400">
      // Generate a prepared statement with the placeholder parameter.
    </span>{"\n"}
    <span className="text-orange-400">PreparedStatement</span>{" "}
    <span className="text-green-400">stmt</span>{" "}
    <span className="text-white">= conn.prepareStatement&#40;sql&#41;;</span>

    {"\n\n"}
    <span className="text-gray-400">
      // Bind email value into the statement at parameter index 1.
    </span>{"\n"}
    <span className="text-white">stmt.setString&#40;</span>
    <span className="text-orange-400">1</span>
    <span className="text-white">, email&#41;;</span>

    {"\n\n"}
    <span className="text-gray-400">// Run the query...</span>{"\n"}
    <span className="text-orange-400">ResultSet</span>{" "}
    <span className="text-green-400">results</span>{" "}
    <span className="text-white">= stmt.executeQuery&#40;sql&#41;;</span>

    {"\n\n"}
    <span className="text-blue-400">while</span>
    <span className="text-white">&#40;results.next&#40;&#41;&#41; &#123;</span>
    {"\n  "}
    <span className="text-gray-400">// ...do something with the data returned.</span>{"\n"}
    <span className="text-white">&#125;</span>
  </TerminalBox>

  <TerminalBox>
    <span className="text-gray-400">// The user we want to find.</span>{"\n"}
    <span className="text-orange-400">String</span>{" "}
    <span className="text-green-400">email</span>{" "}
    <span className="text-white">= </span>
    <span className="text-green-400">"user@email.com"</span>
    <span className="text-white">;</span>

    {"\n\n"}
    <span className="text-gray-400">// Connect to the database.</span>{"\n"}
    <span className="text-orange-400">Connection</span>{" "}
    <span className="text-green-400">conn</span>{" "}
    <span className="text-white">= DriverManager.getConnection&#40;URL, USER, PASS&#41;;</span>{"\n"}
    <span className="text-orange-400">Statement</span>{" "}
    <span className="text-green-400">stmt</span>{" "}
    <span className="text-white">= conn.createStatement&#40;&#41;;</span>

    {"\n\n"}
    <span className="text-gray-400">
      // Bad, bad news! Don't construct the query with string concatenation.
    </span>{"\n"}
    <span className="text-orange-400">String</span>{" "}
    <span className="text-green-400">sql</span>{" "}
    <span className="text-white">= </span>
    <span className="text-green-400">
      "SELECT * FROM users WHERE email = '"
    </span>
    <span className="text-white"> + email + </span>
    <span className="text-green-400">"'"</span>
    <span className="text-white">;</span>

    {"\n\n"}
    <span className="text-gray-400">// I have a bad feeling about this...</span>{"\n"}
    <span className="text-orange-400">ResultSet</span>{" "}
    <span className="text-green-400">results</span>{" "}
    <span className="text-white">= stmt.executeQuery&#40;sql&#41;;</span>

    {"\n\n"}
    <span className="text-blue-400">while</span>
    <span className="text-white">&#40;results.next&#40;&#41;&#41; &#123;</span>{"\n  "}
    <span className="text-gray-400">// ...oh look, we got hacked.</span>{"\n"}
    <span className="text-white">&#125;</span>
  </TerminalBox>

  <strong className="block text-lg mt-6 mb-2">Hibernate</strong>

  <TerminalBox>
    <span className="text-blue-400">@Entity</span>{"\n"}
    <span className="text-blue-400">public class</span>{" "}
    <span className="text-orange-400">User</span>{" "}
    <span className="text-white">&#123;</span>
    {"\n  "}
    <span className="text-blue-400">@Id</span>{"\n  "}
    <span className="text-blue-400">@GeneratedValue</span>{"\n  "}
    <span className="text-white">Long id;</span>
    {"\n\n  "}
    <span className="text-blue-400">@NaturalId</span>{"\n  "}
    <span className="text-white">String email;</span>{"\n"}
    <span className="text-white">&#125;</span>

    {"\n\n"}
    <span className="text-gray-400">
      // ORM will ensure safe passing of the 'email' parameter.
    </span>{"\n"}
    <span className="text-blue-400">return</span>{" "}
    <span className="text-white">
      session.bySimpleNaturalId&#40;User.class&#41;.load&#40;email&#41;;
    </span>
  </TerminalBox>

  <strong className="block text-lg mt-6 mb-2">Spring</strong>

  <TerminalBox>
    <span className="text-blue-400">public</span>{" "}
    <span className="text-white">Customer </span>
    <span className="text-orange-400">findUserByEmail</span>
    <span className="text-white">&#40;String email&#41; &#123;</span>{"\n  "}
    <span className="text-orange-400">String</span>{" "}
    <span className="text-green-400">sql</span>{" "}
    <span className="text-white">= </span>
    <span className="text-green-400">
      "select * from users where email = ?"
    </span>
    <span className="text-white">;</span>

    {"\n\n  "}
    <span className="text-orange-400">User</span>{" "}
    <span className="text-green-400">user</span>{" "}
    <span className="text-white">= &#40;User&#41; getJdbcTemplate&#40;&#41;.queryForObject&#40;</span>{"\n    "}
    <span className="text-white">sql, </span>
    <span className="text-gray-400">// SQL statement...</span>{"\n    "}
    <span className="text-blue-400">new</span>{" "}
    <span className="text-orange-400">Object</span>
    <span className="text-white">[] &#123; email &#125;, </span>
    <span className="text-gray-400">// ...separate from parameters.</span>{"\n    "}
    <span className="text-blue-400">new</span>{" "}
    <span className="text-orange-400">UserRowMapper</span>
    <span className="text-white">&#40;&#41;&#41;;</span>

    {"\n\n  "}
    <span className="text-blue-400">return</span>{" "}
    <span className="text-white">user;</span>{"\n"}
    <span className="text-white">&#125;</span>
  </TerminalBox>

</Item>


          <Item title="C#">

  <strong className="block text-lg mb-2">SqlClient</strong>

  <TerminalBox>
    <span className="text-gray-400">// Create the SQL command.</span>{"\n"}
    <span className="text-white">SqlCommand command = </span>
    <span className="text-blue-400">new</span>{" "}
    <span className="text-white">SqlCommand&#40;</span>
    <span className="text-green-400">
      "select * from Users where email = @email"
    </span>
    <span className="text-white">, conn&#41;;</span>

    {"\n\n"}
    <span className="text-gray-400">
      // Add the parameter values in separately.
    </span>{"\n"}
    <span className="text-white">command.Parameters.Add&#40;</span>
    <span className="text-blue-400">new</span>{" "}
    <span className="text-white">SqlParameter&#40;</span>
    <span className="text-green-400">"email"</span>
    <span className="text-white">, email&#41;&#41;;</span>

    {"\n\n"}
    <span className="text-blue-400">using</span>
    <span className="text-white">
      &#40;SqlDataReader reader = command.ExecuteReader&#40;&#41;&#41;
    </span>{" "}
    <span className="text-white">&#123;</span>

    {"\n  "}
    <span className="text-blue-400">while</span>
    <span className="text-white">&#40;reader.Read&#40;&#41;&#41;</span>{" "}
    <span className="text-white">&#123;</span>

    {"\n    "}
    <span className="text-gray-400">
      // Do something with the retrieved data.
    </span>

    {"\n  "}
    <span className="text-white">&#125;</span>

    {"\n"}
    <span className="text-white">&#125;</span>
  </TerminalBox>

  <strong className="block text-lg mt-6 mb-2">LINQ</strong>

  <TerminalBox>
    <span className="text-blue-400">using</span>
    <span className="text-white">
      &#40;ServiceContext ctx = </span>
    <span className="text-blue-400">new</span>{" "}
    <span className="text-white">ServiceContext&#40;...&#41;&#41;</span>{" "}
    <span className="text-white">&#123;</span>

    {"\n  "}
    <span className="text-gray-400">
      // LINQ will ensure safe passing of parameters.
    </span>

    {"\n  "}
    <span className="text-blue-400">var</span>{" "}
    <span className="text-white">users = </span>
    <span className="text-blue-400">from</span>{" "}
    <span className="text-white">user </span>
    <span className="text-blue-400">in</span>{" "}
    <span className="text-white">ctx.Users</span>
    {"\n             "}
    <span className="text-blue-400">where</span>{" "}
    <span className="text-white">user.email </span>
    <span className="text-blue-400">equals</span>{" "}
    <span className="text-white">email</span>
    {"\n            "}
    <span className="text-blue-400">select</span>{" "}
    <span className="text-white">user;</span>

    {"\n\n  "}
    <span className="text-blue-400">foreach</span>{" "}
    <span className="text-white">&#40;</span>
    <span className="text-blue-400">var</span>{" "}
    <span className="text-white">user </span>
    <span className="text-blue-400">in</span>{" "}
    <span className="text-white">users&#41;</span>{" "}
    <span className="text-white">&#123;</span>

    {"\n    "}
    <span className="text-gray-400">
      // Do something with the retrieved data
    </span>

    {"\n  "}
    <span className="text-white">&#125;</span>

    {"\n"}
    <span className="text-white">&#125;</span>
  </TerminalBox>

</Item>


          <Item title="PHP">

  <TerminalBox>
    <span className="text-green-400">$statement</span>{" "}
    <span className="text-white">= </span>
    <span className="text-green-400">$dbh</span>
    <span className="text-white">-&gt;</span>
    <span className="text-orange-400">prepare</span>
    <span className="text-white">&#40;</span>
    <span className="text-green-400">
      "select * from users where email = ?"
    </span>
    <span className="text-white">&#41;;</span>

    {"\n"}

    <span className="text-green-400">$statement</span>
    <span className="text-white">-&gt;</span>
    <span className="text-orange-400">execute</span>
    <span className="text-white">&#40;</span>
    <span className="text-blue-400">array</span>
    <span className="text-white">&#40;email&#41;&#41;;</span>
  </TerminalBox>

</Item>

<div
  onClick={() => navigate("/lessons/sql-injection-quiz")}
  className="mt-10 cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl
  p-6 sm:p-8 active:scale-[0.98] transition shadow-md hover:shadow-xl border-4 border-black text-center"
>
  <p className="text-sm font-semibold opacity-90 mb-2">
    Got all that?
  </p>

  <h2 className="text-2xl sm:text-3xl font-bold mb-3 flex items-center justify-center gap-2">
    <span>🧠</span>
    <span className="text-black">Quiz:</span>
    <span className="text-white">SQL Injection</span>
  </h2>

  <p className="text-md opacity-95">
    Take a quick quiz to show you were paying attention →
  </p>
</div>


        </div>

      </div>
    </section>
  );
}
