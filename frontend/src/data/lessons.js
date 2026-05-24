import sql from "../assets/lessons/sql.gif";
import crossSiteInclusion from "../assets/lessons/Cross-site-inclusion.gif";
import crossSiteScripting from "../assets/lessons/Cross-SiteScripting.gif";
import reflectedXss from "../assets/lessons/ReflectedXSS.gif";
import domBasedXss from "../assets/lessons/DOM-based-XSS.gif";
import xmlExternal from "../assets/lessons/XML-external.gif";
import xmlBombs from "../assets/lessons/XML-Bombs.gif";
import weakSessionIds from "../assets/lessons/Weak-Session-IDs.gif";
import userEnumeration from "../assets/lessons/User-Enumeration.gif";
import unencryptedCommunication from "../assets/lessons/Unencrypted-Communication.gif";
import toxicdependencies from "../assets/lessons/Toxic-Dependencies.gif"
import subdomainsquatting from "../assets/lessons/Subdomain-Squatting.gif"
import sideserverrequestforgery from "../assets/lessons/Server-Side-Request-Forgery.gif"
import sslstripping from "../assets/lessons/SSL-Stripping.gif"
import sessionfixation from "../assets/lessons/Session-Fixation.gif"
import remotecodeexecution from "../assets/lessons/Remote-Code-Execution.gif"
import regexinjection from "../assets/lessons/Regex-Injection.gif"
import prototypepollution from "../assets/lessons/Prototype-Pollution.gif"
import privilegeescalation from "../assets/lessons/Privilege-Escalation.gif"
import passwordmissmanagement from "../assets/lessons/Password-Mismanagement.gif"
import openredirects from "../assets/lessons/Open-Redirects.gif"
import massassigment from "../assets/lessons/Mass-Assignment.gif"
import maLvertising from "../assets/lessons/Malvertising.gif"
import loggingandmonitoring from "../assets/lessons/Logging-and-Monitoring.gif"
import laxsecuritysettings from "../assets/lessons/Lax-Security-Settings.gif"
import insecuredesign from "../assets/lessons/Insecure-Design.gif"
import informationleakage from "../assets/lessons/Information-Leakage.gif"
import hostheaderpoisoning from "../assets/lessons/Host-Header-Poisoning.gif"
import fileuploadvul from "../assets/lessons/File-Upload-Vulnerabilities.gif"
import emailspoofing from "../assets/lessons/Email-Spoofing.gif"
import downgradeattacks from "../assets/lessons/Downgrade-Attacks.gif"
import dnspoisoning from "../assets/lessons/DNS-Poisoning.gif"
import directorytraversal from "../assets/lessons/DirectoryTraversal.gif"
import denialofserviceattacks from "../assets/lessons/DenialofServiceAttacks.gif"
import crosssiterequestforgery from "../assets/lessons/Cross-SiteRequestForgery.gif"
import commandexecution from "../assets/lessons/CommandExecution.gif"
import clickjacking from "../assets/lessons/Clickjacking.gif"
import bufferoverflows from "../assets/lessons/BufferOverflows.gif"
import brokenaccesscontrol from "../assets/lessons/BrokenAccessControl.gif"
import aipromptinjection from "../assets/lessons/AIPromptInjection.gif"
import aidataextractionattacks from "../assets/lessons/AIDataExtractionAttacks.gif"
import aibiasandunreliability from "../assets/lessons/AIBiasandUnreliability.gif"

export const lessons = [
  {
    id: "sql-injection",
    title: "SQL Injection",
    description: "If you are vulnerable to SQL Injection, attackers can run arbitrary commands againt...",
    image: sql
  },
  {
    id: "cross-site-script-inclusion",
    title: "Cross‑site Script Inclusion",
    description: "If you are putting sensitive data in your JavaScript files an attacker is probably...",
    image: crossSiteInclusion
  },
  {
    id: "cross-site-scripting",
    title: "Cross‑Site Scripting",
    description: "If your site allows users to add content, you need to be sure that attackers cannot...",
    image: crossSiteScripting
  },
  {
    id: "reflected-xss",
    title: "Reflected XSS",
    description: "When building a website, you need to be sure you do not accidentally create a channe...",
    image: reflectedXss
  },
  {
    id: "dom-based-xss",
    title: "DOM‑based XSS",
    description: "If you make use of URI fragments in your site, you need to ensure they cannot b...",
    image: domBasedXss
  },
  {
    id: "xml-external-entities",
    title: "XML External Entities",
    description: "Unsafe treatment of external references in XML allows an attacker to probe your file...",
    image: xmlExternal
  },
  {
    id: "xml-bombs",
    title: "XML Bombs",
    description: "Unsafe treatment of XML macros can make your server vulnerable to attack from ...",
    image: xmlBombs
  },
  {
    id: "weak-session-ids",
    title: "Weak Session IDs",
    description: "Guessable session IDs make your website vulnerable to session hijacking.",
    image: weakSessionIds
  },
  {
    id: "user-enumeration",
    title: "User Enumeration",
    description: "Leaking username information on your site makes things much easier for hackers.",
    image: userEnumeration
  },
  {
    id: "unencrypted-communication",
    title: "Unencrypted Communication",
    description: "Insufficient encryption can make you vulnerable to monster-in-the-middle attacks.",
    image: unencryptedCommunication
  },
  {
    id: "toxic-dependencies",
    title: "Toxic Dependencies",
    description: "Third-party libraries could be introducing vulnerabilities or malicious code into your...",
    image: toxicdependencies
  },
  {
    id: "Subdomain-Squatting",
    title: "Subdomain Squatting",
    description: "Attackers will steal dangling subdomains to deliver malware and perform phishing attack.",
    image: subdomainsquatting
  },
  {
    id: "Server-Side-Request-Forgery",
    title: "Server-Side Request Forgery",
    description: "An Attacker can use SSRF vulnerabilities to probe your internal network",
    image: sideserverrequestforgery
  },
  {
    id: "SSL-Stripping",
    title: "SSL Stripping",
    description: "If only some actions on your website require HTTPS, an attacker may be able to stea...",
    image: sslstripping
  },
  {
    id: "Session-Fixation",
    title: "Session Fixation",
    description: "Insecure treatment of session IDs can leave your users vulnerable to having theyr...",
    image: sessionfixation
  },
  {
    id: "Remote-Code-Execution",
    title: "Remote Code Execution",
    description: "If an attacker can smuggle code into your web-server process, you have a serious...",
    image: remotecodeexecution
  },
  {
    id: "Regex-Injection",
    title: "Regex Injection",
    description: "Regular expressions are frequently used in web-development, but can be abuse...",
    image: regexinjection
  },
  {
    id: "Prototype-Pollution",
    title: "Prototype Pollution",
    description: "If an attacker can access and modify prototype objects in JavaScript, you are in danger.",
    image: prototypepollution
  },
  {
    id: "Privilege-Escalation",
    title: "Privilege Escalation",
    description: "Privilege escalation occurs when an attacker exploits a vulnerability to impersonate...",
    image: privilegeescalation
  },
  {
    id: "Password-Mismanagement",
    title: "Password Mismanagement",
    description: "Safe treatment of passwords is essential to a secure authentication system - yet...",
    image: passwordmissmanagement
  },
  {
    id: "Open-Redirects",
    title: "Open Redirects",
    description: "Most web-applications make use of redirects. If your site forwards to URLs supplied in...",
    image: openredirects
  },
  {
    id: "Mass-Assigment",
    title: "Mass Assigment",
    description: "Automatically unpacking data from the HTTP request can sometimes be too easy",
    image: massassigment
  },
  {
    id: "Malvertising",
    title: "Malvertising",
    description: "Embedded adverts are a common target for hackers.",
    image: maLvertising
  },
  {
    id: "Logging-And-Monitoring",
    title: "Logging and Monitoring",
    description: "Comprehensive logging and monitoring will tell you what your site is doing at runtime...",
    image: loggingandmonitoring
  },
  {
    id: "Lax-Security-Settings",
    title: "Lax Security Settings",
    description: "Improper security settings are a common cause of vulnerabilities.",
    image: laxsecuritysettings
  },
  {
    id: "Insecure-Design",
    title: "Insecure Design",
    description: "Security begins before you start writing code.",
    image: insecuredesign
  },
  {
    id: "Information-Leakage",
    title: "Information Leakage",
    description: "Revealing system information helps and attacker learn about your tech stack.",
    image: informationleakage
  },
  {
    id: "Host-Header-Poisoning",
    title: "Host Header Poisoning",
    description: "It's dangerous to rely on the value supplied in Host header of an HTTP request.",
    image: hostheaderpoisoning
  },
  {
    id: "File-Upload-Vul",
    title: "File Upload Vulnerabilities",
    description: "File upload are easy way for an attacker to inject malicious code into your...",
    image: fileuploadvul
  },
  {
    id: "Email-Spoofing",
    title: "Email Spoofing",
    description: "Email Spoofing is the sending of email messages with a forged from address.",
    image: emailspoofing
  },
  {
    id: "Downgrade-Attacks",
    title: "Downgrade Attacks",
    description: "Attackers may be able to intercept, read and manipulate HTTPS traffic if you fail to...",
    image: downgradeattacks
  },
  {
    id: "Dns-Poisoning",
    title: "DNS Poisoning",
    description: "If upstream DNS caches have been poisoned, attackers may be intercepting traffic befor...",
    image: dnspoisoning
  },
  {
    id: "Directory-Traversal",
    title: "Directory Traversal",
    description: "Ensure file paths are safely interpreted, or hackers can access sensitive files on you...",
    image: directorytraversal
  },
  {
    id: "Denial-of-Service-Attacks",
    title: "Denial of Service Attacks",
    description: "Sometimes attackers don't need to hack your website, they just want to make it...",
    image: denialofserviceattacks
  },
  {
    id: "Cross-Site-Request-Forgery",
    title: "Cross-Site Request Forgery",
    description: "If an attacker can forge HTTP requests to your site, they may be able to trick your...",
    image: crosssiterequestforgery
  },
  {
    id: "Command-Execution",
    title: "Command Execution",
    description: "If your application calls out to the OS, you need to be sure command strings are securely...",
    image: commandexecution
  },
  {
    id: "Clickjacking",
    title: "Clickjacking",
    description: "As an application author, you need to be sure your users aren't having theyr clicks...",
    image: clickjacking
  },
  {
    id: "Buffer-Overflows",
    title: "Buffer Overflows",
    description: "An attacker can use buffer overflows to take your site offline or to inject maliciou...",
    image: bufferoverflows
  },
  {
    id: "Broken-Access-Control",
    title: "Broken Access Control",
    description: "All resources on your site need to have access control implemented, even if they...",
    image: brokenaccesscontrol
  },
  {
    id: "Ai-Prompt-Injection",
    title: "AI: Prompt Injection",
    description: "Prompt injection represents an easy way for an attacker to introduce unexpected behavio...",
    image: aipromptinjection
  },
  {
    id: "Ai-Data-Extraction-Attacks",
    title: "AI: Data Extraction Attacks",
    description: "Your machine learning model may be leaking sensitive data without you knowing it.",
    image: aidataextractionattacks
  },
  {
    id: "Ai-Bias-and-Unreliability",
    title: "AI: Bias and Unreliability",
    description: "Machine learning is prone to bias and unreliability, and you need to put in safeguard...",
    image: aibiasandunreliability
  }
];
