import { useEffect } from "react";

const PrivacyPage = () => {

  useEffect(() => {
    document.title = 'Privacy Policy - Starex Hub';
  }, []);

  return (
    <div className="py-28 md:px-0 px-3 mx-auto bg-primary/10">
      <div className="container mx-auto px-6 md:max-w-[60%]">
        <section className="text-center mb-16">
          <h2 className="md:text-4xl text-2xl font-bold text-primary md:mb-4 mb-2">Privacy Policy</h2>
          <p className="md:text-md text-sm mx-auto">
            Last Updated: January 2025
          </p>
        </section>

        <section className="md:text-md text-sm space-y-8">
          <p className="">
            At <strong>Starex Hub</strong>, we value and respect the privacy of our users. This Privacy Policy outlines the types of personal information we collect and how we use, protect, and disclose that information. By using our services, you agree to the terms of this policy.
          </p>

          <h3 className="md:text-2xl text-xl font-semibold">1. Information We Collect</h3>
          <ul className="list-disc pl-8">
            <li><strong>Personal Information:</strong> When you sign up or interact with Starex Hub, we collect personal details such as your name, email address, phone number, and any other information you provide during registration.</li>
            <li><strong>Usage Data:</strong> We collect information about your usage of Starex Hub, including your interaction with the platform, your login history, and any communications with other users.</li>
            <li><strong>Device Information:</strong> We collect information about the device you use to access Starex Hub, including browser type, IP address, operating system, and other technical details.</li>
            <li><strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance your experience. These cookies help us remember your preferences and improve the overall functionality of the platform.</li>
          </ul>

          <h3 className="md:text-2xl text-xl font-semibold">2. How We Use Your Information</h3>
          <p>
            We use the information we collect in the following ways:
          </p>
          <ul className="list-disc pl-8">
            <li><strong>To Provide and Improve Our Services:</strong> We use your information to provide you with access to Starex Hub, respond to your inquiries, and improve the functionality of the platform.</li>
            <li><strong>To Personalize Your Experience:</strong> We may use the data to customize your experience and provide tailored content, advertisements, and recommendations.</li>
            <li><strong>To Communicate with You:</strong> We may send you notifications, updates, and important information about your account and changes to our policies or terms of use.</li>
            <li><strong>To Prevent Fraud and Ensure Security:</strong> We use your information to monitor for fraudulent activity, ensure the safety and security of the platform, and prevent misuse of our services.</li>
          </ul>

          <h3 className="md:text-2xl text-xl font-semibold">3. Sharing Your Information</h3>
          <p>
            We do not sell, rent, or trade your personal information. However, we may share your information in the following situations:
          </p>
          <ul className="list-disc pl-8">
            <li><strong>With Service Providers:</strong> We may share your data with trusted third-party vendors and service providers who assist in the operation of Starex Hub, such as hosting services, analytics, and customer support.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information when required by law or in response to legal processes, such as a subpoena or court order.</li>
            <li><strong>In Case of Business Transactions:</strong> If Starex Hub is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
          </ul>

          <h3 className="md:text-2xl text-xl font-semibold">4. Data Security</h3>
          <p>
            We implement reasonable security measures to protect your personal data from unauthorized access, alteration, or destruction. However, no method of data transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
          </p>

          <h3 className="md:text-2xl text-xl font-semibold">5. Your Rights and Choices</h3>
          <p>
            As a user, you have the following rights regarding your personal information:
          </p>
          <ul className="list-disc pl-8">
            <li><strong>Access and Update:</strong> You have the right to access and update your personal information at any time by logging into your account on Starex Hub.</li>
            <li><strong>Delete Your Account:</strong> You can delete your account by contacting us or using the provided options in your account settings. Once your account is deleted, your personal information will be removed from our system, subject to legal and regulatory requirements.</li>
            <li><strong>Opt-Out of Communications:</strong> You can opt-out of receiving promotional emails or notifications by following the unsubscribe instructions in the communication.</li>
          </ul>

          <h3 className="md:text-2xl text-xl font-semibold">6. Children’s Privacy</h3>
          <p>
            Starex Hub is not intended for children under the age of 13. We do not knowingly collect personal information from children under the age of 13. If we become aware that we have collected information from a child under 13, we will take steps to delete that information from our system.
          </p>

          <h3 className="md:text-2xl text-xl font-semibold">7. Changes to This Privacy Policy</h3>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, or legal requirements. We will notify you of any significant changes by posting the updated policy on our website. The date of the most recent update will be indicated at the top of this page.
          </p>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPage