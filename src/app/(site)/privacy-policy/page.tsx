import type { Metadata } from "next";
import LegalContent from "@/components/ui/LegalContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalContent
      title="Privacy Policy"
      sections={[
        {
          body: [
            "At Academy, accessible from https://academy-mocha-two.vercel.app/, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that are collected and recorded by Academy and how we use it.",
            "If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.",
          ],
        },
        {
          heading: "Log Files",
          body: [
            "Academy follows a standard procedure of using log files. These files log visitors when they visit websites.",
            "The information collected includes IP addresses, browser type, ISP, date and time stamp, referring/exit pages, and possibly the number of clicks.",
          ],
        },
        {
          heading: "Cookies and Web Beacons",
          body: [
            "Like any other website, Academy uses cookies. These cookies are used to store information, including visitors' preferences and the pages the visitor accessed or visited.",
            "The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and other information.",
          ],
        },
        {
          heading: "Google DoubleClick DART Cookie",
          body: [
            "Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads based upon visits to our site and other sites on the internet.",
            "Visitors may decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at https://policies.google.com/technologies/ads.",
          ],
        },
        {
          heading: "Our Advertising Partners",
          body: [
            "Some advertisers on our site may use cookies and web beacons. Each advertising partner has its own Privacy Policy for its policies on user data.",
            "For easier access, we hyperlinked to their Privacy Policies below. Google - https://policies.google.com/technologies/ads.",
          ],
        },
        {
          heading: "Privacy Policies",
          body: [
            "You may consult this list to find the Privacy Policy for each advertising partner of Academy.",
            "Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons in their advertisements and links that appear on Academy.",
            "Academy has no access to or control over cookies used by third-party advertisers.",
          ],
        },
        {
          heading: "Third Party Privacy Policies",
          body: [
            "Academy's Privacy Policy does not apply to other advertisers or websites. We advise you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.",
            "You can choose to disable cookies through your individual browser options.",
          ],
        },
        {
          heading: "Children's Information",
          body: [
            "Another part of our priority is adding protection for children while using the internet.",
            "Academy does not knowingly collect any Personal Identifiable Information from children under the age of 13.",
          ],
        },
        {
          heading: "Online Privacy Policy Only",
          body: [
            "This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information shared or collected in Academy.",
            "This policy is not applicable to any information collected offline or via channels other than this website.",
          ],
        },
        {
          heading: "Consent",
          body: ["By using our website, you hereby consent to this Privacy Policy and agree to the Terms & Conditions."],
        },
        {
          heading: "Contact Information",
          body: ["Academy Worldwide", "Email: care@nigelquadros.com", "Phone: +91 96650 64435"],
        },
      ]}
    />
  );
}
