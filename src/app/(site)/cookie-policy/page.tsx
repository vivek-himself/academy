import type { Metadata } from "next";
import LegalContent from "@/components/ui/LegalContent";

export const metadata: Metadata = {
  title: "Cookie Policy — Academy",
};

export default function CookiePolicyPage() {
  return (
    <LegalContent
      title="Cookie Policy"
      sections={[
        {
          body: [
            "This Cookie Policy explains how Academy uses cookies and similar tracking technologies when you access or interact with our website and digital platforms. It is designed to provide clarity on what cookies are, how and why they are used, and the level of control you have over them.",
            "Cookies are small text files stored on your device when you visit a website. They help websites function efficiently, enhance user experience, and provide insights into how platforms are being used.",
            "These files may contain identifiers, preferences, and limited technical information that enable smoother interactions between the user and the platform.",
          ],
        },
        {
          heading: "How We Use Cookies",
          body: [
            "At Academy, cookies are used to ensure that the platform operates seamlessly while also allowing us to improve the overall experience.",
            "They support essential operations such as maintaining secure sessions, enabling account access, and ensuring platform stability. In addition, cookies help us remember user preferences, optimise performance, analyse engagement patterns, and understand how learners interact with our content and services.",
            "We also use cookies to enhance functionality by retaining settings such as language preferences, learning progress, and user-specific configurations.",
          ],
        },
        {
          heading: "Analytics, Marketing, and Third Parties",
          body: [
            "Certain cookies assist in analysing traffic patterns and identifying areas of improvement by collecting aggregated, non-personally identifiable data such as pages visited, time spent, device type, and general geographic location.",
            "In some instances, cookies may be used for marketing and communication purposes. This includes delivering relevant content, improving the effectiveness of campaigns, and ensuring that users are not repeatedly shown the same information.",
            "Our platform may integrate with third-party services such as analytics providers, payment processors, social media platforms, and video hosting services. These providers may place their own cookies on your device in accordance with their respective privacy policies.",
          ],
        },
        {
          heading: "Cookie Control",
          body: [
            "Cookies used on the platform may either be session-based, which expire once the browser is closed, or persistent, which remain on the device for a defined period to support repeat visits and personalised experiences.",
            "Users have the ability to control or restrict cookies through their browser settings. Most browsers allow you to view, manage, block, or delete cookies at any time.",
            "However, disabling cookies may impact the functionality of the platform, including login persistence, personalised features, course progress tracking, and certain interactive elements.",
          ],
        },
        {
          heading: "Related Technologies and Updates",
          body: [
            "In addition to cookies, we may use related technologies such as web beacons, local storage, and device-level identifiers to better understand user interaction and maintain platform integrity.",
            "This Cookie Policy may be updated periodically to reflect changes in technology, legal requirements, or how we operate our platform. Continued use of the website after such updates constitutes acceptance of the revised policy.",
          ],
        },
        {
          heading: "Contact Information",
          body: ["Academy Worldwide", "Email: care@nigelquadros.com", "Phone: +91 96650 64435"],
        },
      ]}
    />
  );
}
