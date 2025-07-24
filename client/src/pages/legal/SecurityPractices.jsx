import React, { useEffect } from "react";
import {
  ShieldCheck, // Changed to ShieldCheck for security focus
  Lock,
  HardDrive,
  Users,
  Eye,
  ScrollText,
  Mail,
  Scale,
  Cloud, // New icon for cloud security
  KeyRound, // New icon for access control
  Info, // <--- ADDED THIS IMPORT!
} from "lucide-react"; // Importing icons

const SecurityPractices = () => {
  useEffect(() => {
    // Scrolls to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 ease-in-out hover:shadow-3xl hover:-translate-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center flex items-center justify-center gap-3">
          <ShieldCheck
            className="text-green-600 dark:text-green-400"
            size={36}
          />{" "}
          ConnectingConstructions Security Practices
        </h1>

        <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          At <strong>ConnectingConstructions</strong>, safeguarding your data
          and ensuring the integrity of our platform are paramount. This
          Security Practices document outlines the measures we implement to
          protect your personal and business information from unauthorized
          access, disclosure, alteration, and destruction.
        </p>

        {/* SECTION 1: Data Encryption */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Lock className="text-green-500 dark:text-green-300" size={24} /> 1.
          Data Encryption
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          We employ robust encryption protocols to protect your data both in
          transit and at rest:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Encryption in Transit (SSL/TLS):</strong> All communication
            between your device and our servers is secured using
            industry-standard SSL/TLS encryption. This ensures that any data you
            send or receive through our Service is protected from eavesdropping
            and tampering.
          </li>
          <li>
            <strong>Encryption at Rest:</strong> Your data stored on our servers
            is encrypted using advanced encryption standards (e.g., AES-256).
            This provides an additional layer of security, protecting your
            information even if our storage infrastructure were to be
            compromised.
          </li>
        </ul>

        {/* SECTION 2: Access Control */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <KeyRound className="text-green-500 dark:text-green-300" size={24} />{" "}
          2. Access Control
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Access to your data is strictly controlled and monitored:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Least Privilege Principle:</strong> Our internal team
            members and third-party service providers are granted access to
            personal data only on a "need-to-know" basis, and only for the
            specific tasks required to operate and improve the Service.
          </li>
          <li>
            <strong>Authentication Mechanisms:</strong> We enforce strong
            authentication mechanisms, including password policies and, where
            applicable, multi-factor authentication (MFA) to protect user
            accounts and internal systems.
          </li>
          <li>
            <strong>Regular Audits:</strong> Access logs are regularly reviewed
            and audited to detect and prevent unauthorized access or suspicious
            activities.
          </li>
        </ul>

        {/* SECTION 3: Network Security */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Cloud className="text-green-500 dark:text-green-300" size={24} /> 3.
          Network Security
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          Our network infrastructure is designed with security in mind:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Firewalls and Intrusion Detection:</strong> We utilize
            enterprise-grade firewalls and intrusion detection/prevention
            systems (IDPS) to monitor network traffic and block malicious
            activities.
          </li>
          <li>
            <strong>Vulnerability Management:</strong> Regular vulnerability
            scans and penetration testing are conducted by internal teams and
            external security experts to identify and address potential
            weaknesses in our systems and applications.
          </li>
          <li>
            <strong>Secure Configurations:</strong> All servers and network
            devices are configured according to security best practices to
            minimize attack surfaces.
          </li>
        </ul>

        {/* SECTION 4: Incident Response */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Eye className="text-green-500 dark:text-green-300" size={24} /> 4.
          Incident Response
        </h2>
        <p className="text-base mb-4 text-gray-700 dark:text-gray-300">
          We have a defined process for handling security incidents:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Monitoring & Detection:</strong> Our systems are
            continuously monitored for unusual activities that could indicate a
            security incident.
          </li>
          <li>
            <strong>Response & Recovery:</strong> In the event of a security
            incident, we have a trained team and established protocols to
            respond quickly, mitigate the impact, and restore services.
          </li>
          <li>
            <strong>Post-Incident Analysis:</strong> After an incident, we
            conduct a thorough analysis to understand the root cause, implement
            corrective actions, and strengthen our defenses.
          </li>
          <li>
            <strong>User Notification:</strong> If a security breach affecting
            your personal data occurs, we will notify you in accordance with
            applicable laws and regulations.
          </li>
        </ul>

        {/* SECTION 5: Employee Training */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Users className="text-green-500 dark:text-green-300" size={24} /> 5.
          Employee Training
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          Our employees undergo regular security awareness training to ensure
          they understand their role in protecting your data and adhere to our
          security policies. This includes training on topics like phishing,
          social engineering, and secure data handling.
        </p>

        {/* SECTION 6: Third-Party Security */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <HardDrive className="text-green-500 dark:text-green-300" size={24} />{" "}
          6. Third-Party Services
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We carefully select and vet third-party service providers (e.g., cloud
          hosting, payment processors) to ensure they meet our stringent
          security and privacy standards. We enter into data processing
          agreements with these providers, obligating them to protect your data.
        </p>

        {/* SECTION 7: Compliance & Governance */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Scale className="text-green-500 dark:text-green-300" size={24} /> 7.
          Compliance & Governance
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We are committed to complying with applicable data protection laws and
          regulations. Our security practices are regularly reviewed and updated
          to reflect new threats and regulatory requirements.
        </p>

        {/* SECTION 8: Reporting Security Vulnerabilities */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <ScrollText
            className="text-green-500 dark:text-green-300"
            size={24}
          />{" "}
          8. Reporting Security Vulnerabilities
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          We encourage security researchers and users to report any potential
          vulnerabilities they discover in our Service. If you believe you have
          found a security issue, please contact us immediately at:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:security@connectingconstructions.com"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              security@connectingconstructions.com
            </a>
          </li>
        </ul>

        {/* SECTION 9: Changes to This Security Practices */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Info className="text-green-500 dark:text-green-300" size={24} /> 9.
          Changes to This Security Practices
        </h2>
        <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
          We may update our Security Practices from time to time. We will notify
          you of any changes by posting the new document on this page and
          updating the "Last updated" date. We advise you to review this
          Security Practices periodically for any changes.
        </p>

        {/* SECTION 10: Contact Us */}
        <h2 className="text-2xl font-bold mt-10 mb-4 border-b-2 border-green-200 dark:border-green-700 pb-3 flex items-center gap-2">
          <Mail className="text-green-500 dark:text-green-300" size={24} /> 10.
          Contact Us
        </h2>
        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
          If you have any questions or concerns about these Security Practices,
          please contact us:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:anilnunnagopula15@gmail.com"
              className="underline text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
            >
              anilnunnagopula15@gmail.com
            </a>
          </li>
          <li>
            <strong>Address:</strong> ConnectingConstructions HQ, Mangalpalle,
            Telangana, India
          </li>
        </ul>

        <p className="mt-12 text-sm text-center italic text-gray-500 dark:text-gray-400">
          Last updated: July 2025
        </p>
      </div>
    </div>
  );
};

export default SecurityPractices;
