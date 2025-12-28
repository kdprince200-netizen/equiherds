"use client"

import React from 'react'

const DataPrivacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16"
        style={{
          backgroundImage: 'url(/slider/4.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-blue-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy of Equiherds</h1>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
              <span className="bg-blue-700/80 backdrop-blur-sm px-4 py-2 rounded-full">Effective Date: 07/10/2025</span>
              <span className="bg-blue-700/80 backdrop-blur-sm px-4 py-2 rounded-full">Last updated: 07/10/2025</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 leading-7 text-gray-700">
          <p className="mb-6">
            Equiherds (“Equiherds”, “we”, “us”, “our”) operates the website www.equiherds.com, a social and professional platform connecting horse owners, stables, veterinarians, farriers, and coaches. We respect your privacy and are committed to protecting your personal data in compliance with the General Data Protection Regulation (EU) 2016/679 (“GDPR”) and French data protection laws, including the Loi Informatique et Libertés as supervised by the CNIL (Commission Nationale de l’Informatique et des Libertés).
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Data Controller</h2>
            <p>Equiherds</p>
            <p>1024 Route de Mouliherne</p>
            <p>49390 Mouliherne, France</p>
            <p>
              Email: <a className="text-blue-600" href="mailto:support@equiherds.com">support@equiherds.com</a>
            </p>
            <p>Phone: +33 6 89 42 97 37</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Personal Data We Collect</h2>
            <p className="mb-2">We collect and process the following categories of data:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Identification data:</strong> name, business name (if applicable), professional license or registration details.
              </li>
              <li>
                <strong>Contact data:</strong> email address, postal address, phone number.
              </li>
              <li>
                <strong>Payment data:</strong> payment method information processed securely through third-party providers (e.g., Stripe).
              </li>
              <li>
                <strong>Usage data:</strong> browsing behavior, login activity, and interactions on the platform.
              </li>
              <li>
                <strong>Technical data:</strong> cookies, IP address, browser type, device information.
              </li>
            </ul>
            <p className="mt-2">We do not intentionally collect data from minors under 16 without parental consent.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. How We Use Personal Data</h2>
            <p className="mb-2">We process your personal data for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To create and manage your user account.</li>
              <li>To provide and improve the services offered through equiherds.com.</li>
              <li>To process transactions and manage payments via Stripe.</li>
              <li>To analyze site performance and user behavior through Google Analytics.</li>
              <li>To send service notifications, updates, and — where permitted — promotional communications.</li>
              <li>To ensure compliance with our legal and regulatory obligations.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Legal Basis for Processing</h2>
            <p className="mb-2">Data processing is carried out under the following legal bases (Article 6 GDPR):</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Contractual necessity:</strong> for the performance of the services you request.
              </li>
              <li>
                <strong>Legal obligation:</strong> for compliance with French and EU legal requirements.
              </li>
              <li>
                <strong>Legitimate interest:</strong> to ensure the security and performance of our platform and to improve user experience.
              </li>
              <li>
                <strong>Consent:</strong> for marketing communications and non-essential cookies.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Cookies and Tracking</h2>
            <p>
              We use cookies to enhance your browsing experience, analyze traffic, and personalize content. You can manage or disable cookies in your browser settings. For more details, refer to our Cookie Policy [link or section to be inserted].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Data Retention</h2>
            <p className="mb-2">
              We retain personal data only for as long as necessary to fulfill the purposes for which it was collected or as required by law.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Account data:</strong> retained for the duration of your account and deleted within 12 months after closure.
              </li>
              <li>
                <strong>Payment and transaction data:</strong> retained for up to 10 years for accounting and tax compliance.
              </li>
              <li>
                <strong>Analytics data:</strong> retained for up to 26 months.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Data Sharing and Transfers</h2>
            <p className="mb-2">Your data may be shared with trusted third parties strictly for operational purposes, including:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Stripe Payments Europe, Ltd. – for payment processing.</li>
              <li>Google Ireland Ltd. – for analytics and performance insights.</li>
              <li>
                Professional partners or service providers acting under data processing agreements compliant with Article 28 GDPR.
              </li>
            </ul>
            <p className="mt-2">
              Where data is transferred outside the European Economic Area (EEA), appropriate safeguards (e.g., Standard Contractual Clauses) are applied to ensure adequate protection.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Data Security</h2>
            <p>
              We implement technical and organizational measures to protect your personal data against unauthorized access, loss, alteration, or disclosure. This includes encryption, secure servers, and restricted access to authorized personnel only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">9. Your Rights</h2>
            <p className="mb-2">Under the GDPR and French data protection law, you have the following rights:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Access:</strong> obtain a copy of your personal data.
              </li>
              <li>
                <strong>Rectification:</strong> correct inaccurate or incomplete data.
              </li>
              <li>
                <strong>Erasure (“right to be forgotten”):</strong> request deletion of your data under certain conditions.
              </li>
              <li>
                <strong>Restriction:</strong> limit how we process your data.
              </li>
              <li>
                <strong>Portability:</strong> receive your data in a structured, machine-readable format.
              </li>
              <li>
                <strong>Objection:</strong> object to data processing based on legitimate interests or for marketing purposes.
              </li>
              <li>
                <strong>Withdrawal of consent:</strong> withdraw consent at any time for processing based on consent.
              </li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at
              {' '}
              <a className="text-blue-600" href="mailto:support@equiherds.com">support@equiherds.com</a>. You may also lodge a complaint with the CNIL
              {' '}
              (<a className="text-blue-600" href="https://www.cnil.fr" target="_blank" rel="noreferrer">www.cnil.fr</a>).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">10. Marketing Communications</h2>
            <p>
              If you have consented to receive marketing messages, you may unsubscribe at any time by following the link in our emails or contacting us directly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">11. Changes to This Policy</h2>
            <p>
              Equiherds reserves the right to modify this Privacy Policy to reflect updates in our practices or changes in legal requirements. The revised version will be posted on www.equiherds.com with a new effective date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">12. Contact</h2>
            <p>If you have any questions about this Privacy Policy or how we handle your data, please contact:</p>
            <p>Data Protection Officer</p>
            <p>Equiherds</p>
            <p>1024 Route de Mouliherne</p>
            <p>49390 Mouliherne, France</p>
            <p>
              Email: <a className="text-blue-600" href="mailto:support@equiherds.com">support@equiherds.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default DataPrivacy