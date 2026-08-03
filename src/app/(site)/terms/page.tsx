import type { Metadata } from "next";
import LegalContent from "@/components/ui/LegalContent";

export const metadata: Metadata = {
  title: "Terms & Conditions — Academy",
};

export default function TermsPage() {
  return (
    <LegalContent
      title="Terms & Conditions"
      sections={[
        {
          body: [
            "The following Terms & Conditions govern the websites, applications, and services provided by Academy. These Terms & Conditions apply to your access and use of all websites and services offered by Academy, including all brands, entities, and platforms owned or controlled by it.",
            "Please read these Terms & Conditions carefully before using the website of Academy, including all extensions. By using the Website, you agree to be bound by these Terms & Conditions. If you do not agree, you must discontinue use of the Website immediately.",
          ],
        },
        {
          heading: "Content",
          body: [
            "All articles and content on Academy are original works protected under applicable copyright and intellectual property laws. All such content is the intellectual property of Academy.",
            "Academy does not claim ownership of images or photos featured on the Website unless explicitly stated.",
          ],
        },
        {
          heading: "Use of Content",
          body: [
            "The Website is intended for personal and non-commercial use only and not for the benefit of any third party. You may reproduce original content for non-commercial purposes only, provided that clear credit is given to Academy, including a link to the Website and display of the logo.",
            "Any other form of copying, redistribution, modification, or publication of Website content, in whole or in part, without permission is strictly prohibited.",
          ],
        },
        {
          heading: "Intellectual Property",
          body: [
            "The name Academy, along with its logos and branding elements, are trademarks and remain the exclusive property of Academy. No license or right to use these marks is granted without explicit permission.",
          ],
        },
        {
          heading: "Disclaimer and Liability",
          body: [
            "Content on the Website may include general information related to health, legal, tax, or financial topics. This does not constitute professional advice.",
            "To the fullest extent permitted by law, Academy shall not be liable for any indirect, incidental, or consequential damages arising from use of the Website.",
          ],
        },
        {
          heading: "Changes",
          body: ["Academy reserves the right to modify these Terms & Conditions at any time. Continued use of the Website constitutes acceptance of updated Terms."],
        },
        {
          heading: "Contact Information",
          body: ["Academy Worldwide", "Email: care@nigelquadros.com", "Phone: +91 96650 64435"],
        },
      ]}
    />
  );
}
