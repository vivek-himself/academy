import type { Metadata } from "next";
import LegalContent from "@/components/ui/LegalContent";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Academy",
};

export default function RefundPolicyPage() {
  return (
    <LegalContent
      title="Refund & Cancellation Policy"
      sections={[
        {
          body: [
            "At Academy, every program, course, and experience is designed with a high level of intent, involvement, and hands-on execution. Unlike traditional platforms, our model is built around limited cohorts, direct mentorship, real-time engagement, and active participation.",
            "Significant time, effort, and resources are invested from the moment a learner enrolls, including planning, onboarding, access allocation, and faculty commitment. As a result, all enrollments are considered final and are not structured around standard refund-based models.",
            "By enrolling in any course or service offered by Academy, you acknowledge and agree that you are committing to a learning experience that is immersive, capacity-limited, and operationally intensive.",
          ],
        },
        {
          heading: "Exceptional Requests",
          body: [
            "While we do not operate with a general refund policy, we understand that exceptional situations may arise. In such cases, individuals may write to us at care@nigelquadros.com with a detailed explanation of their request, along with any relevant supporting information.",
            "Each request is reviewed internally on a case-by-case basis. Any consideration, if at all extended, remains solely at the discretion of Academy, based on the validity, timing, and nature of the concern presented. Submission of a request does not guarantee approval, nor does it create any obligation on the part of the organization.",
          ],
        },
        {
          heading: "Access and Commencement",
          body: [
            "Once access to a course, service, or any part of the platform has been granted, including but not limited to live sessions, recorded content, materials, or mentorship interactions, the service is deemed to have commenced.",
            "Certain components, including one-on-one mentoring, career services, personalized consulting, downloadable materials, and any value-added services, are strictly non-reversible once initiated or delivered.",
          ],
        },
        {
          heading: "Transfers and Disruptions",
          body: [
            "In situations where a learner is unable to continue due to scheduling conflicts or personal constraints, we may, at our discretion, allow a transfer to a future batch, subject to availability and prior notice.",
            "In the rare event of operational disruptions from our end that materially impact delivery, we will assess the situation internally and determine an appropriate resolution.",
          ],
        },
        {
          heading: "Final Decisions",
          body: [
            "All decisions made by Academy in relation to cancellations, transfers, or any exceptional considerations are final and binding. We encourage all learners to carefully review course details, schedules, and commitments before enrolling to ensure alignment with their expectations and availability.",
            "Academy reserves the right to update or modify this policy at any time without prior notice. Continued use of our services constitutes acceptance of the latest version of this policy.",
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
