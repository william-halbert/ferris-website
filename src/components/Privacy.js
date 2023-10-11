import React from "react";
import Header from "./HeaderLanding";
import "./privacyAndTerms.css";
import Footer from "./Footer";

export default function Privacy() {
  return (
    <>
      <Header />
      <div
        className="privacy-policy"
        style={{ margin: "100px auto", width: "60vw" }}
      >
        <h1>Privacy Policy</h1>
        <p>
          <strong>Updated:</strong> October 10, 2023
        </p>
        <p>
          At Ferris.so (hereinafter "Ferris", "we", "our" or "us"), your privacy
          is paramount. We are dedicated to ensuring the security of information
          we collect from or about our users. This Privacy Policy outlines our
          practices concerning Personal Information that we gather when you
          utilize our website, tools, and services ("Services").
        </p>

        <h2>1. Personal Information We Collect</h2>
        <p>
          We amass personal data related to users ("Personal Information") as
          elaborated below:
        </p>
        <ul>
          <li>
            <strong>Information You Provide</strong>:
            <ul>
              <li>
                <strong>Account Data</strong>: When registering for our
                Services, we collect details linked with your account, such as
                name, contact data, and login credentials.
              </li>
              <li>
                <strong>User Content</strong>: When availing our Services, we
                obtain Personal Information in the feedback, uploads, or input
                you give.
              </li>
              <li>
                <strong>Communication Data</strong>: When you engage with us, we
                assemble details like your name, contact information, and the
                message's content.
              </li>
            </ul>
          </li>
          <li>
            <strong>Automatic Collection</strong>:
            <ul>
              <li>
                <strong>Technical Info</strong>: When browsing or interacting
                with our Services, we procure data about your visit. This might
                encompass log data, usage data, device details, and cookies.
              </li>
            </ul>
          </li>
        </ul>

        <h2>2. Utilization of Personal Information</h2>
        <p>We may use Personal Information for:</p>
        <ul>
          <li>Administering and enhancing our Services.</li>
          <li>Communicating with you.</li>
          <li>Implementing safety measures and fraud detection.</li>
          <li>Conducting research.</li>
          <li>
            Meeting legal obligations and ensuring the rights of affiliates and
            users.
          </li>
        </ul>

        <h2>3. Disclosure of Personal Information</h2>
        <p>
          We may share your Personal Information with third parties under these
          circumstances:
        </p>
        <ul>
          <li>
            <strong>Service Providers</strong>: We may share data with vendors
            that help us operate our business.
          </li>
          <li>
            <strong>Legal Obligations</strong>: We might disclose information if
            legally compelled or if it aids in protection against fraud or other
            illicit actions.
          </li>
          <li>
            <strong>Business Transfers</strong>: In the scenario of a merger or
            acquisition, your Personal Information might be shared or
            transferred.
          </li>
        </ul>
        <h2>4. Your Rights</h2>
        <p>Depending on your jurisdiction, you might have rights such as:</p>
        <ul>
          <li>Accessing, updating, or erasing your Personal Information.</li>
          <li>Data portability.</li>
          <li>Restricting or objecting to our processing of your data.</li>
          <li>Withdrawing consent.</li>
        </ul>
        <p>
          Reach out to{" "}
          <a href="mailto:tryferris@gmail.com">tryferris@gmail.com</a> for
          inquiries or to exercise these rights.
        </p>

        <h2>5. Children's Data</h2>
        <p>
          We take the privacy and protection of children very seriously.
          Ferris.so is not designed to attract individuals under the age of 13.
          We do not intentionally gather information from children under the age
          of 13. If you, as a parent or guardian, become aware that your child
          has provided us with personal information without your consent, please
          contact us. If we become aware that a child under 13 has provided us
          with personal information, we will take steps to delete such
          information from our records.
        </p>

        <h2>6. External Links</h2>
        <p>
          Ferris.so may contain links to third-party websites, apps, or
          services, which are not owned or controlled by Ferris. Please be aware
          that we are not responsible for the privacy practices of such other
          sites or services. We encourage users to be cautious when they leave
          our site and to read the privacy statements of each website that
          collects personal information. This Privacy Policy applies solely to
          information collected by Ferris.so.
        </p>

        <h2>7. Security and Data Retention</h2>
        <p>
          We take your security seriously and use industry-standard methods to
          protect your personal information from unauthorized access, use, or
          disclosure. We utilize encryption, access controls, secure protocols,
          and other technological and procedural measures to safeguard the
          information we process. However, no method of transmission over the
          Internet or method of electronic storage is 100% secure. While we
          strive to use commercially acceptable means to protect your Personal
          Information, we cannot guarantee its absolute security.
          <br></br>
          We retain Personal Information for as long as necessary to fulfill the
          purposes outlined in this Privacy Policy unless a longer retention
          period is required or permitted by law. After such time, we will
          either delete or anonymize your information or, if this is not
          possible, then we will securely store your information and isolate it
          from any further use until deletion is possible.
        </p>

        <h2>8. International Data Transfers</h2>
        <p>
          Our servers are located in the United States. Therefore, if you choose
          to provide us with Personal Information, please note that your data
          may be transferred to, and processed in, the United States and other
          countries where our servers are located. Different jurisdictions have
          different data protection laws, some of which may offer fewer
          protections than those set in your country. By using Ferris, you
          acknowledge this transfer, storing, or processing.
        </p>

        <h2>9. Modifications to This Privacy Policy</h2>
        <p>
          We reserve the right to modify this Privacy Policy from time to time
          to account for new practices or changes in the law. When we make
          changes, we will update the “Last Modified” date at the beginning of
          the Privacy Policy. If we make material changes to the way we process
          your Personal Information, we will provide you with advanced notice or
          as required by law.
        </p>

        <h2>10. Reach Out to Us</h2>
        <p>
          If you have any concerns, questions, or suggestions regarding this
          Privacy Policy or our privacy practices, don't hesitate to get in
          touch with us at{" "}
          <a href="mailto: tryferris@gmail.com">tryferris@gmail.com</a>. Our
          team is always here to help, and we're committed to addressing all
          inquiries in a timely manner.
        </p>
      </div>
      <Footer />
    </>
  );
}
