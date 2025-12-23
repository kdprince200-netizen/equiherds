"use client";

import { useState } from "react";

export default function AgreementModal({ isOpen, onClose, onAccept, isLoading }) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    console.log('Scroll detected:', { scrollTop, scrollHeight, clientHeight, isAtBottom });
    setHasScrolled(isAtBottom);
  };

  const handleAccept = () => {
    if (isChecked && hasScrolled) {
      onAccept();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Terms and Conditions Agreement</h2>
          <p className="text-gray-600 mt-2">Please read and accept our terms to continue</p>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-6"
          onScroll={handleScroll}
        >
          <div className="space-y-3 text-xs text-gray-700">
            <h2 className="font-bold text-sm text-center mb-4">📜 General Terms and Conditions of Equiherds</h2>
            <p className="text-center text-xs text-gray-500 mb-4">Version: 07/10/2025 | Effective as of: 17/10/2025</p>

            <h3 className="font-semibold text-sm">1. Preamble and Definitions</h3>
            <p className="text-xs">
              <strong>1.1 Preamble</strong><br/>
              These General Terms and Conditions (hereinafter the "Terms") govern the use of the Platform operated by Equiherds. By accessing or using the Platform, the User accepts these Terms in full and without reservation.
            </p>
            <p className="text-xs">
              <strong>1.2 Definitions</strong><br/>
              For the purposes of these Terms:<br/>
              • "Equiherds": refers to the company operating the Platform, headquartered at 1024 Route de Mouliherne, 49390 Mouliherne, France. Contact: support@equiherds.com.<br/>
              • "Platform": refers to the website and related digital services offered by Equiherds.<br/>
              • "User": any natural or legal person who uses the Platform, whether registered or unregistered.<br/>
              • "Consumer": a User acting for non-commercial, personal purposes, within the meaning of Article L.221-1 of the French Consumer Code.<br/>
              • "Professional User": any User acting in the context of their commercial, industrial, craft, liberal, or agricultural profession.
            </p>

            <h3 className="font-semibold text-sm">2. Purpose and Scope</h3>
            <p className="text-xs">
              <strong>2.1 Purpose</strong><br/>
              The Platform enables Users to publish, browse, and respond to advertisements related to equine sales, services, and related products.
            </p>
            <p className="text-xs">
              <strong>2.2 Scope</strong><br/>
              These Terms apply to all Users of the Platform. Specific provisions apply differently to Consumers and Professional Users in accordance with applicable legal standards.
            </p>

            <h3 className="font-semibold text-sm">3. Access to the Platform</h3>
            <p className="text-xs">
              <strong>3.1 General Access</strong><br/>
              Access to the Platform is open to the public. However, certain features require account registration.
            </p>
            <p className="text-xs">
              <strong>3.2 Availability</strong><br/>
              Equiherds strives to maintain uninterrupted access but does not guarantee continuous operation. The Platform may be unavailable due to maintenance, upgrades, or Force Majeure.
            </p>

            <h3 className="font-semibold text-sm">4. Registration and Account Use</h3>
            <p className="text-xs">
              <strong>4.1 Account Creation</strong><br/>
              Users must provide accurate, up-to-date information. Multiple accounts per User are prohibited unless authorized by Equiherds.
            </p>
            <p className="text-xs">
              <strong>4.2 Account Security</strong><br/>
              Users are responsible for safeguarding their credentials. Unauthorized use must be reported immediately.
            </p>

            <h3 className="font-semibold text-sm">5. Use of Services and User Obligations</h3>
            <p className="text-xs">
              <strong>5.1 General Conduct</strong><br/>
              Users shall use the Platform in good faith and in compliance with all applicable French and EU laws.
            </p>
            <p className="text-xs">
              <strong>5.2 Prohibited Activities</strong><br/>
              Users must not:<br/>
              • Post false, misleading, or unlawful content;<br/>
              • Impersonate others or create fake identities;<br/>
              • Scrape, hack, or reverse-engineer the Platform;<br/>
              • Promote illegal sales or animal abuse.
            </p>

            <h3 className="font-semibold text-sm">6. Content and User Responsibility</h3>
            <p className="text-xs">
              <strong>6.1 User-Generated Content</strong><br/>
              Users remain fully responsible for all content they publish.
            </p>
            <p className="text-xs">
              <strong>6.2 Prohibited Content</strong><br/>
              The following are strictly forbidden:<br/>
              • Copyright-infringing material;<br/>
              • Defamatory, hateful, or violent content;<br/>
              • False or misleading advertising;<br/>
              • Animal cruelty or violations of animal welfare laws.
            </p>

            <h3 className="font-semibold text-sm">7. Rights Granted to Equiherds</h3>
            <p className="text-xs">
              By publishing Content, Users grant Equiherds a worldwide, non-exclusive, royalty-free, sub-licensable license to use, copy, display, and distribute the Content for the purpose of operating and promoting the Platform.
            </p>

            <h3 className="font-semibold text-sm">8. Posting Ads and Marketplace Rules</h3>
            <p className="text-xs">
              <strong>8.1 General Principles</strong><br/>
              Users may publish advertisements offering equine-related goods or services, such as horses, equipment, boarding, training, and transport. All Ads must comply with these Terms and applicable laws.
            </p>
            <p className="text-xs">
              <strong>8.2 Ad Content Requirements</strong><br/>
              Each Ad must:<br/>
              • Be clear, truthful, and accurate;<br/>
              • Include essential information (e.g., age, breed, sex, price, health status of horses);<br/>
              • Be updated promptly when circumstances change;<br/>
              • Indicate whether the seller is a Professional User or Consumer.
            </p>

            <h3 className="font-semibold text-sm">9. Premium and Paid Services</h3>
            <p className="text-xs">
              <strong>9.1 Description of Premium Services</strong><br/>
              Equiherds offers optional Premium Services that may include:<br/>
              • Featured listings or homepage placements;<br/>
              • Highlighted Ads with color or badges;<br/>
              • Enhanced media uploads (e.g., video, image gallery);<br/>
              • Access to analytics or performance statistics.
            </p>

            <h3 className="font-semibold text-sm">10. Prices, Billing, and Payment Terms</h3>
            <p className="text-xs">
              <strong>10.1 Accepted Payment Methods</strong><br/>
              Equiherds accepts major credit and debit cards (Visa, Mastercard, etc.) and PayPal or other payment gateways as listed on the Platform.
            </p>
            <p className="text-xs">
              <strong>10.2 Payment Terms</strong><br/>
              Payment is due immediately upon order confirmation unless otherwise stated. Delayed payments may result in account suspension.
            </p>

            <h3 className="font-semibold text-sm">11. Right of Withdrawal for Consumers</h3>
            <p className="text-xs">
              <strong>11.1 Legal Right</strong><br/>
              Under Articles L221-18 to L221-28 of the French Consumer Code, Consumers have the right to withdraw from a contract within 14 calendar days without giving any reason.
            </p>
            <p className="text-xs">
              <strong>11.2 Exercise of the Right</strong><br/>
              Consumers must notify Equiherds of their decision to withdraw via email: support@equiherds.com.
            </p>

            <h3 className="font-semibold text-sm">12. Limitation of Liability</h3>
            <p className="text-xs">
              <strong>12.1 General Principle</strong><br/>
              Equiherds shall not be held liable for any damages resulting from the User's use of the Platform, except as required by mandatory legal provisions.
            </p>
            <p className="text-xs">
              <strong>12.2 Scope of Liability</strong><br/>
              To the fullest extent permitted by law, Equiherds excludes liability for:<br/>
              • Errors, interruptions, or downtime of the Platform;<br/>
              • Data loss or corruption;<br/>
              • Content posted by Users, including illegal or inaccurate information;<br/>
              • Commercial loss, loss of profits, or consequential damages;<br/>
              • Transactions concluded solely between Users.
            </p>

            <h3 className="font-semibold text-sm">13. Data Protection and Privacy</h3>
            <p className="text-xs">
              <strong>13.1 Compliance</strong><br/>
              Equiherds processes personal data in accordance with Regulation (EU) 2016/679 (GDPR) and Loi Informatique et Libertés of 6 January 1978 as amended.
            </p>
            <p className="text-xs">
              <strong>13.2 User Rights</strong><br/>
              Under GDPR, Users have the following rights:<br/>
              • Right of access to their data;<br/>
              • Right to rectification;<br/>
              • Right to erasure ("right to be forgotten");<br/>
              • Right to data portability;<br/>
              • Right to object to processing;<br/>
              • Right to restrict processing.
            </p>

            <h3 className="font-semibold text-sm">14. Intellectual Property</h3>
            <p className="text-xs">
              <strong>14.1 Ownership</strong><br/>
              All content on the Platform, including but not limited to logos, designs, layouts, texts, source code, and images created by Equiherds, is the exclusive property of Equiherds or its licensors.
            </p>
            <p className="text-xs">
              <strong>14.2 User License</strong><br/>
              Equiherds grants Users a non-exclusive, non-transferable, and revocable license to access and use the Platform for personal or professional purposes, within the limits of these Terms.
            </p>

            <h3 className="font-semibold text-sm">15. Duration, Termination, and Account Closure</h3>
            <p className="text-xs">
              <strong>15.1 Duration of Agreement</strong><br/>
              These Terms apply from the moment of User access to the Platform and remain in force until voluntary closure of the account, termination by Equiherds, or cessation of the Platform.
            </p>
            <p className="text-xs">
              <strong>15.2 Equiherds-Initiated Termination</strong><br/>
              Equiherds may suspend or terminate a User's account with 14 days' notice for any reason, or immediately and without notice in case of serious breach of these Terms, fraudulent activity, or publication of unlawful content.
            </p>

            <h3 className="font-semibold text-sm">16. Force Majeure</h3>
            <p className="text-xs">
              <strong>16.1 Definition</strong><br/>
              In accordance with Article 1218 of the French Civil Code, Force Majeure refers to any event beyond the reasonable control of Equiherds that was unforeseeable, irresistible, and external, which prevents performance of contractual obligations.
            </p>
            <p className="text-xs">
              <strong>16.2 Examples</strong><br/>
              Such events include but are not limited to: natural disasters, fires, governmental restrictions, pandemics, cyberattacks, wars, terrorism, riots, or civil unrest.
            </p>

            <h3 className="font-semibold text-sm">17. Dispute Resolution and Mediation</h3>
            <p className="text-xs">
              <strong>17.1 Initial Complaint Procedure</strong><br/>
              Users are encouraged to first contact Equiherds Customer Support to resolve any complaints or disputes:<br/>
              Email: support@equiherds.com | Tel: +33 6 89 42 97 37
            </p>
            <p className="text-xs">
              <strong>17.2 Consumer Mediation</strong><br/>
              In accordance with Article L612-1 of the French Consumer Code, Consumers may have recourse to a certified consumer mediator free of charge after exhausting internal complaint procedures.
            </p>

            <h3 className="font-semibold text-sm">18. Governing Law and Jurisdiction</h3>
            <p className="text-xs">
              <strong>18.1 Applicable Law</strong><br/>
              These Terms are governed and interpreted under French law, excluding the application of the United Nations Convention on Contracts for the International Sale of Goods (CISG).
            </p>
            <p className="text-xs">
              <strong>18.2 Jurisdiction</strong><br/>
              For Consumer Users: jurisdiction lies with the courts of the Consumer's place of residence. For Professional Users: the courts of Paris, France, shall have exclusive jurisdiction.
            </p>

            <h3 className="font-semibold text-sm">19. Final Provisions</h3>
            <p className="text-xs">
              <strong>19.1 Entire Agreement</strong><br/>
              These Terms constitute the entire agreement between Equiherds and the User. They supersede all prior understandings, written or oral, regarding the subject matter.
            </p>
            <p className="text-xs">
              <strong>19.2 Modification of Terms</strong><br/>
              Equiherds may modify these Terms at any time. Users will be notified of material changes via the Platform or by email. Continued use after changes constitutes acceptance.
            </p>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Contact Information</h3>
              <p className="text-xs">
                <strong>Equiherds</strong><br/>
                1024 Route de Mouliherne<br/>
                49390 Mouliherne, France<br/>
                Email: support@equiherds.com<br/>
                Tel: +33 6 89 42 97 37
              </p>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Cookie Policy</h3>
              <p className="text-xs">
                We use cookies to enhance your browsing experience, analyze traffic, and personalize content. 
                You can manage or disable cookies in your browser settings. For more details, refer to our Cookie Policy.
              </p>
            </div>

            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Privacy Policy</h3>
              <p className="text-xs">
                We process personal data in accordance with GDPR and French data protection laws. 
                A separate Privacy Policy governs data processing in detail. Users have rights to access, rectification, erasure, portability, objection, and restriction of processing.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="agree-terms"
                  className="rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!hasScrolled}
                  checked={isChecked}
                  onChange={(e) => {
                    console.log('Checkbox clicked:', { hasScrolled, checked: e.target.checked });
                    if (hasScrolled) {
                      setIsChecked(e.target.checked);
                    }
                  }}
                />
                <label 
                  htmlFor="agree-terms" 
                  className={`text-sm text-gray-700 ${hasScrolled ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                  onClick={() => {
                    console.log('Label clicked:', { hasScrolled, isChecked });
                    if (hasScrolled) {
                      setIsChecked(!isChecked);
                    }
                  }}
                >
                  I have read and agree to the terms and conditions
                </label>
              </div>
              {!hasScrolled && (
                <p className="text-xs text-orange-600">Please scroll to the bottom to enable the checkbox</p>
              )}
              {hasScrolled && !isChecked && (
                <p className="text-xs text-blue-600">Please check the box to continue</p>
              )}
              {hasScrolled && isChecked && (
                <p className="text-xs text-green-600">✓ Ready to proceed</p>
              )}
              <p className="text-xs text-gray-500">
                Debug: Scrolled: {hasScrolled ? 'Yes' : 'No'} | Checked: {isChecked ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!hasScrolled || !isChecked || isLoading}
              >
                {isLoading ? "Processing..." : "Accept & Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
