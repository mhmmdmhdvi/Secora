import sql from "../assets/lessons/sql-3d.webp";
import crossSiteInclusion from "../assets/lessons/cross-site-inclusion-3d.webp";
import crossSiteScripting from "../assets/lessons/cross-site-scripting-3d.webp";
import reflectedXss from "../assets/lessons/reflected-xss-3d.webp";
import domBasedXss from "../assets/lessons/dom-based-xss-3d.webp";
import xmlExternal from "../assets/lessons/xml-external-3d.webp";
import xmlBombs from "../assets/lessons/xml-bombs-3d.webp";
import weakSessionIds from "../assets/lessons/weak-session-ids-3d.webp";
import userEnumeration from "../assets/lessons/user-enumeration-3d.webp";
import unencryptedCommunication from "../assets/lessons/unencrypted-communication-3d.webp";
import toxicdependencies from "../assets/lessons/toxic-dependencies-3d.webp"
import subdomainsquatting from "../assets/lessons/subdomain-squatting-3d.webp"
import sideserverrequestforgery from "../assets/lessons/server-side-request-forgery-3d.webp"
import sslstripping from "../assets/lessons/ssl-stripping-3d.webp"
import sessionfixation from "../assets/lessons/session-fixation-3d.webp"
import remotecodeexecution from "../assets/lessons/remote-code-execution-3d.webp"
import regexinjection from "../assets/lessons/regex-injection-3d.webp"
import prototypepollution from "../assets/lessons/prototype-pollution-3d.webp"
import privilegeescalation from "../assets/lessons/privilege-escalation-3d.webp"
import passwordmissmanagement from "../assets/lessons/password-mismanagement-3d.webp"
import openredirects from "../assets/lessons/open-redirects-3d.webp"
import massassigment from "../assets/lessons/mass-assignment-3d.webp"
import maLvertising from "../assets/lessons/malvertising-3d.webp"
import loggingandmonitoring from "../assets/lessons/logging-and-monitoring-3d.webp"
import laxsecuritysettings from "../assets/lessons/lax-security-settings-3d.webp"
import insecuredesign from "../assets/lessons/insecure-design-3d.webp"
import informationleakage from "../assets/lessons/information-leakage-3d.webp"
import hostheaderpoisoning from "../assets/lessons/host-header-poisoning-3d.webp"
import fileuploadvul from "../assets/lessons/file-upload-vulnerabilities-3d.webp"
import emailspoofing from "../assets/lessons/email-spoofing-3d.webp"
import downgradeattacks from "../assets/lessons/downgrade-attacks-3d.webp"
import dnspoisoning from "../assets/lessons/dns-poisoning-3d.webp"
import directorytraversal from "../assets/lessons/directory-traversal-3d.webp"
import denialofserviceattacks from "../assets/lessons/denial-of-service-attacks-3d.webp"
import crosssiterequestforgery from "../assets/lessons/cross-site-request-forgery-3d.webp"
import commandexecution from "../assets/lessons/command-execution-3d.webp"
import clickjacking from "../assets/lessons/clickjacking-3d.webp"
import bufferoverflows from "../assets/lessons/buffer-overflows-3d.webp"
import brokenaccesscontrol from "../assets/lessons/broken-access-control-3d.webp"
import aipromptinjection from "../assets/lessons/ai-prompt-injection-3d.webp"
import aidataextractionattacks from "../assets/lessons/ai-data-extraction-attacks-3d.webp"
import aibiasandunreliability from "../assets/lessons/ai-bias-and-unreliability-3d.webp"

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
