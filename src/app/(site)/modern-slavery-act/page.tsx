import type { Metadata } from "next";
import LegalContent from "@/components/ui/LegalContent";

export const metadata: Metadata = {
  title: "Modern Slavery Act",
};

export default function ModernSlaveryActPage() {
  return (
    <LegalContent
      title="Modern Slavery Act"
      sections={[
        {
          body: [
            "This statement is published in alignment with global modern slavery regulations, including the Indian Modern Slavery Act 2016 and the Australian Modern Slavery Act 2018.",
            "It also reflects applicable legal frameworks in India addressing forced labour, bonded labour, child labour, and human trafficking, including the Bonded Labour System (Abolition) Act, 1976, the Child Labour (Prohibition and Regulation) Act, 1986, and relevant provisions under the Indian Penal Code, 1860.",
            "It outlines the commitment of Academy to operate responsibly, ethically, and transparently, ensuring that modern slavery, forced labour, and human trafficking have no place within our business or extended ecosystem.",
          ],
        },
        {
          heading: "Our Organisation",
          body: [
            "Academy is a global-facing digital education platform based in India, delivering professional training, mentorship, and career development across marketing, leadership, design, artificial intelligence, and strategy.",
            "While our operations are primarily digital, our responsibility extends globally. We ensure that ethical conduct is embedded into every aspect of how we operate and collaborate.",
          ],
        },
        {
          heading: "Our Global Commitment",
          body: [
            "We maintain a strict zero-tolerance stance toward modern slavery, forced labour, bonded labour, child labour, and human exploitation in any form.",
            "Our approach is grounded in respect for human rights, fair opportunity, and responsible growth. Every individual we engage with must be treated with dignity, compensated fairly, and given the freedom to work without coercion or restriction.",
          ],
        },
        {
          heading: "How We Operate",
          body: [
            "Our model is lean, collaborative, and distributed across regions. We work with educators, mentors, creators, and service providers globally. This allows us to scale knowledge while maintaining accountability. We take responsibility not only for our internal practices but also for ensuring that our partners uphold ethical and lawful standards.",
          ],
        },
        {
          heading: "Our Extended Value Chain",
          body: [
            "Our ecosystem includes technology providers, infrastructure partners, content creators, and professional service providers. This includes cloud platforms, payment systems, designers, instructors, editors, marketing teams, and advisors. Regardless of structure, our expectation of ethical conduct remains consistent across all relationships.",
          ],
        },
        {
          heading: "Understanding Risk",
          body: [
            "We recognise that risks related to modern slavery can exist in both direct and indirect forms, particularly across global and digital supply chains. We assess these risks based on geography, industry exposure, nature of work, and transparency of our partners. This enables us to identify and address areas that may require closer scrutiny.",
          ],
        },
        {
          heading: "Due Diligence and Safeguards",
          body: [
            "We follow a structured approach when selecting and working with partners. This includes evaluating credibility, reviewing alignment with labour standards, and seeking clarity on internal practices where necessary.",
            "Our agreements reflect expectations around ethical conduct, compliance with applicable laws, and accountability. Where standards are not met, we take immediate steps to review or discontinue such relationships.",
          ],
        },
        {
          heading: "Rights of People We Work With",
          body: [
            "We ensure that every employee, contractor, or collaborator is engaged voluntarily and operates under fair and lawful conditions.",
            "Clear agreements, transparent compensation, and safe working environments are fundamental. No individual is required to surrender personal documents, pay recruitment fees, or work under any form of compulsion. We also ensure access to support and the ability to raise concerns freely.",
          ],
        },
        {
          heading: "Awareness and Responsibility",
          body: [
            "We believe awareness is a key part of prevention. Our team is encouraged to stay informed about modern slavery risks, including evolving and less visible forms.",
            "We promote a culture of responsibility where ethical awareness, open communication, and accountability are actively supported.",
          ],
        },
        {
          heading: "Speaking Up",
          body: [
            "We encourage anyone who observes or suspects unethical practices within our organisation or supply chain to report concerns.",
            "Reports can be made via email at care@nigelquadros.com or through confidential channels, including anonymous reporting if preferred. All concerns are treated seriously, investigated appropriately, and handled with confidentiality.",
          ],
        },
        {
          heading: "Measuring Our Progress",
          body: [
            "We regularly review the effectiveness of our approach through internal evaluations, monitoring of supplier practices, and risk assessments. Feedback from employees and partners helps us refine and strengthen our processes over time.",
          ],
        },
        {
          heading: "Continuous Improvement",
          body: [
            "Our approach to preventing modern slavery continues to evolve. We are committed to strengthening due diligence, improving transparency, and aligning with global best practices as our platform grows.",
          ],
        },
        {
          heading: "Approval and Review",
          body: ["This statement reflects the position and commitment of Academy, and is reviewed periodically to ensure continued relevance and effectiveness."],
        },
        {
          heading: "Contact Information",
          body: ["Academy Worldwide", "Email: care@nigelquadros.com", "Phone: +91 96650 64435"],
        },
      ]}
    />
  );
}
