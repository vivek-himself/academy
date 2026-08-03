export type JobPosting = {
  title: string;
  type: "Full-time" | "Internship";
  department: string;
  location: string;
  overview: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  internshipNote?: string;
  applyNote?: string;
};

export const jobPostings: JobPosting[] = [
  {
    title: "CRM Lead",
    type: "Full-time",
    department: "Customer Success & Operations",
    location: "Remote",
    overview:
      "Academy is seeking a strategic, data-driven, and customer-focused CRM Lead who can build meaningful customer relationships at scale through intelligent systems, automation, and engagement strategies. This role is ideal for someone who understands that a CRM is far more than a database. It is the engine that powers customer journeys, lead nurturing, learner engagement, retention, communication, and business growth. The successful candidate will be responsible for managing and optimising the entire CRM ecosystem, ensuring every interaction is timely, personalised, measurable, and aligned with organisational objectives.",
    responsibilities: [
      "Own and manage the organisation's CRM strategy, processes, and platform administration.",
      "Design, implement, and optimise customer lifecycle journeys from lead generation to enrolment, engagement, retention, and advocacy.",
      "Develop automated workflows, nurture sequences, customer communication journeys, and engagement campaigns.",
      "Manage customer segmentation, audience targeting, and personalisation initiatives.",
      "Monitor CRM performance metrics, conversion rates, engagement levels, and retention indicators.",
      "Ensure data accuracy, consistency, hygiene, and governance across all CRM systems.",
      "Collaborate with marketing, sales, customer success, operations, and leadership teams to align CRM activities with business goals.",
      "Build dashboards and reports that provide actionable insights into customer behaviour and business performance.",
      "Manage integrations between CRM platforms, marketing tools, websites, learning management systems, and other business applications.",
    ],
    qualifications: [
      "Bachelor's Degree in Marketing, Business Administration, Information Systems, Data Analytics, Communications, Technology, or a related discipline.",
      "Certifications in CRM Management, Marketing Automation, Customer Success, Data Analytics, HubSpot, Salesforce, Zoho, Microsoft Dynamics, or related platforms will be advantageous.",
    ],
    skills: [
      "4-7 years of experience managing CRM systems, customer lifecycle programmes, marketing automation, or customer engagement initiatives.",
      "Strong experience with CRM platforms such as HubSpot, Salesforce, Zoho CRM, Microsoft Dynamics, ActiveCampaign, or similar systems.",
      "Experience designing automated customer journeys and lifecycle communications.",
      "Strong understanding of customer segmentation, lead nurturing, and retention strategies.",
      "Strong analytical and reporting capabilities with the ability to translate data into business insights.",
      "Excellent project management and stakeholder coordination skills.",
    ],
  },
  {
    title: "AI Process Analyst",
    type: "Full-time",
    department: "Technology & Process Excellence",
    location: "Bangalore, India",
    overview:
      "Academy is seeking an analytical, innovative, and process-driven AI Process Analyst who is passionate about improving business efficiency through the practical application of artificial intelligence, automation, and workflow optimisation. The successful candidate will work closely with leadership and cross-functional teams to evaluate existing processes, identify automation opportunities, implement AI-powered solutions, and drive continuous operational improvement.",
    responsibilities: [
      "Analyse existing business processes and identify opportunities for automation and optimisation.",
      "Map operational workflows and document current-state and future-state processes.",
      "Research, evaluate, and recommend AI tools, platforms, and technologies that support business objectives.",
      "Design and implement AI-assisted workflows to improve efficiency and productivity.",
      "Conduct process audits and identify bottlenecks, inefficiencies, and operational risks.",
      "Develop standard operating procedures (SOPs), process documentation, and workflow guidelines.",
      "Create dashboards, reports, and performance metrics to measure process improvements.",
      "Support the integration of AI tools into existing business systems and workflows.",
    ],
    qualifications: [
      "Bachelor's Degree in Business Administration, Information Technology, Computer Science, Data Analytics, Engineering, Operations Management, Artificial Intelligence, or a related discipline.",
      "Certifications in Process Improvement, Business Analysis, Automation, Artificial Intelligence, Lean, Six Sigma, Project Management, or related fields will be advantageous.",
    ],
    skills: [
      "3-6 years of experience in business analysis, process improvement, operations, automation, or digital transformation.",
      "Strong understanding of workflow analysis and process mapping methodologies.",
      "Familiarity with platforms such as ChatGPT, Claude, Gemini, Zapier, Make, Notion, Airtable, Microsoft Power Automate, n8n, or similar solutions.",
      "Strong analytical, problem-solving, and critical-thinking abilities.",
      "Experience creating SOPs, business documentation, and process frameworks.",
    ],
  },
  {
    title: "Administrative Assistant",
    type: "Full-time",
    department: "Administration",
    location: "Remote",
    overview:
      "Academy is seeking a highly organised and dependable Administrative Assistant who understands that operational excellence is often built behind the scenes. The successful candidate will provide administrative support across various functions of the organisation, helping manage schedules, documentation, communications, reporting, and operational coordination.",
    responsibilities: [
      "Provide day-to-day administrative support to leadership and internal teams.",
      "Manage calendars, schedules, appointments, and meeting coordination.",
      "Prepare and maintain reports, records, databases, and organisational documentation.",
      "Coordinate internal communications and ensure timely follow-ups on assigned tasks.",
      "Assist in preparing presentations, proposals, meeting notes, and business documents.",
      "Organise and maintain digital files, records, and operational documentation.",
      "Support project coordination activities and monitor task completion across teams.",
      "Coordinate with external vendors, partners, and stakeholders when necessary.",
    ],
    qualifications: [
      "Bachelor's Degree in Business Administration, Management, Commerce, Office Administration, Communications, or a related discipline.",
      "Additional certifications in administration, project coordination, office management, or business operations will be advantageous.",
    ],
    skills: [
      "2-4 years of experience in administration, executive support, office management, or operations.",
      "Excellent organisational and time-management skills.",
      "Proficiency in Microsoft Office, Google Workspace, and productivity software.",
      "Strong attention to detail and commitment to accuracy.",
      "Experience with project management platforms such as ClickUp, Asana, Trello, Notion, or Monday.com will be advantageous.",
    ],
  },
  {
    title: "Content Creator",
    type: "Full-time",
    department: "Marketing",
    location: "Goa, India",
    overview:
      "Academy is seeking a creative, versatile, and audience-focused Content Creator who understands how to transform ideas into engaging content that informs, inspires, and drives action. The successful candidate will be responsible for developing content across multiple formats, including social media, video, blogs, articles, podcasts, newsletters, campaigns, and brand communications.",
    responsibilities: [
      "Create engaging content across social media platforms, websites, email campaigns, blogs, and digital channels.",
      "Develop content ideas aligned with brand objectives, audience interests, and marketing goals.",
      "Write, edit, and optimise content for various formats and platforms.",
      "Collaborate with designers, video editors, marketers, and subject matter experts to develop high-quality content.",
      "Research industry trends, audience behaviour, and competitor activities to identify content opportunities.",
      "Assist in planning and managing content calendars and publishing schedules.",
      "Participate in content production activities, including video shoots, interviews, podcasts, and webinars where required.",
      "Monitor content performance and recommend improvements based on audience engagement and analytics.",
    ],
    qualifications: [
      "Bachelor's Degree in Marketing, Communications, Journalism, Media Studies, English, Advertising, Public Relations, Business, or a related discipline.",
      "Additional certifications in Content Marketing, Digital Marketing, Social Media Marketing, Copywriting, or Video Production will be advantageous.",
    ],
    skills: [
      "2-5 years of experience in content creation, content marketing, social media, or communications.",
      "Excellent written and verbal communication skills.",
      "Strong storytelling and creative thinking abilities.",
      "Familiarity with Canva, Adobe Creative Suite, CapCut, Premiere Pro, or similar creative tools is advantageous.",
      "A portfolio demonstrating previous content creation work will be highly advantageous.",
    ],
  },
  {
    title: "Copywriter",
    type: "Full-time",
    department: "Content & Editorial",
    location: "Remote",
    overview:
      "Academy is seeking a creative, curious, and detail-oriented Copywriter Intern who understands that great writing does more than communicate. It informs, persuades, inspires, and drives action. As a Copywriter Intern, you will have the opportunity to work on real-world projects across digital marketing, social media, websites, email campaigns, advertising, thought leadership, and learning content.",
    responsibilities: [
      "Assist in writing marketing, advertising, and promotional copy across various digital platforms.",
      "Create content for websites, landing pages, blogs, email campaigns, and social media channels.",
      "Support the development of brand messaging and communication strategies.",
      "Write engaging captions, headlines, call-to-actions, and campaign messaging.",
      "Collaborate with designers, marketers, content creators, and leadership teams on content initiatives.",
      "Review and edit content to ensure accuracy, clarity, consistency, and brand alignment.",
      "Support SEO-driven content creation and optimisation efforts.",
    ],
    qualifications: [
      "Currently pursuing or recently completed a Bachelor's Degree in English, Journalism, Communications, Marketing, Advertising, Media Studies, Public Relations, Business, or a related discipline.",
      "Relevant certifications in Content Marketing, Copywriting, Digital Marketing, or Creative Writing will be advantageous.",
    ],
    skills: [
      "Strong passion for writing, storytelling, and communication.",
      "Excellent written English with strong grammar, spelling, and editing skills.",
      "Ability to adapt writing style for different audiences and platforms.",
      "Basic understanding of branding, marketing, and content strategy.",
      "A portfolio of writing samples, academic work, personal projects, blogs, or published content will be advantageous.",
    ],
    internshipNote:
      "Internships are designed as learning-first opportunities. During the initial 90-day period, interns work on real projects with structured guidance and build their portfolios. Remuneration is not applicable during the first 90 days; continued engagement and any associated compensation is reviewed afterward based on performance, business requirements, and the sole discretion of the company.",
    applyNote: "email your CV, Cover Letter, and any relevant writing samples or portfolio links",
  },
  {
    title: "QA Analyst",
    type: "Full-time",
    department: "Technology & Digital Experience",
    location: "Bangalore, India",
    overview:
      "Academy is seeking a meticulous and quality-focused QA Analyst who believes that exceptional user experiences are built through rigorous testing, attention to detail, and continuous improvement. The successful candidate will play a critical role in maintaining platform quality, improving customer experience, and supporting product releases through structured testing processes.",
    responsibilities: [
      "Develop, execute, and maintain test plans, test cases, and testing documentation.",
      "Perform functional, regression, integration, user acceptance, and exploratory testing.",
      "Conduct front-end and back-end testing to identify defects, inconsistencies, and usability issues.",
      "Validate website functionality across multiple devices, operating systems, browsers, and screen sizes.",
      "Test customer journeys across the platform, including registrations, enrolments, purchases, and account management.",
      "Verify integrations between systems, applications, APIs, payment gateways, and third-party platforms.",
      "Document bugs clearly, accurately, and comprehensively for development teams.",
      "Track defects through resolution and verify fixes before deployment.",
    ],
    qualifications: [
      "Bachelor's Degree in Computer Science, Information Technology, Software Engineering, Information Systems, or a related discipline.",
      "Certifications in Software Testing, Quality Assurance, Agile Methodologies, ISTQB, or related fields will be advantageous.",
    ],
    skills: [
      "Minimum 2-5 years of experience in Quality Assurance, Software Testing, or QA Analysis.",
      "Experience performing manual testing across web and mobile applications.",
      "Familiarity with bug tracking and project management tools such as Jira, ClickUp, Trello, Asana, or Azure DevOps.",
      "Familiarity with API testing tools such as Postman or equivalent platforms is advantageous.",
      "Strong analytical thinking and problem-solving capabilities.",
    ],
  },
  {
    title: "Finance Manager",
    type: "Full-time",
    department: "Finance & Accounts",
    location: "Goa, India",
    overview:
      "Academy is seeking a strategic and detail-oriented Finance Manager who can provide financial leadership while ensuring operational discipline and long-term sustainability. The successful candidate will oversee financial operations, budgeting, forecasting, reporting, compliance, and financial decision-making.",
    responsibilities: [
      "Lead and oversee the day-to-day finance and accounting operations of the organisation.",
      "Prepare monthly, quarterly, and annual financial reports and management accounts.",
      "Develop and manage budgets, forecasts, and financial planning processes.",
      "Monitor cash flow, working capital, and financial performance.",
      "Oversee taxation, statutory compliance, audits, and regulatory requirements.",
      "Establish and maintain financial controls, policies, and procedures.",
      "Support business planning, investment decisions, and growth initiatives through financial analysis.",
      "Manage relationships with auditors, banks, consultants, and external financial stakeholders.",
    ],
    qualifications: [
      "Bachelor's Degree in Finance, Accounting, Commerce, Economics, Business Administration, or a related discipline.",
      "Chartered Accountant (CA), ACCA, CPA, CMA, MBA Finance, or equivalent professional qualification will be highly advantageous.",
    ],
    skills: [
      "Minimum 5-8 years of experience in finance, accounting, financial planning, or financial management roles.",
      "Strong understanding of accounting principles, financial reporting, budgeting, and forecasting.",
      "Experience managing audits, taxation, statutory compliance, and financial controls.",
      "Proficiency in accounting software, ERP systems, Microsoft Excel, and financial reporting tools.",
      "Strong leadership, communication, and stakeholder management skills.",
    ],
  },
  {
    title: "Data Entry Executive",
    type: "Internship",
    department: "Operations",
    location: "Remote",
    overview:
      "Academy is seeking a highly organised and detail-oriented Data Entry Executive Intern who understands that accurate data is the foundation of effective decision-making. As a Data Entry Executive Intern, you will assist with data management, record maintenance, information verification, reporting support, and administrative tasks across various functions of the organisation.",
    responsibilities: [
      "Enter, update, and maintain data accurately across internal systems and databases.",
      "Review information for completeness, consistency, and accuracy before submission.",
      "Assist in maintaining learner records, programme data, customer information, and operational databases.",
      "Organise and manage digital records and documentation.",
      "Verify data from multiple sources and identify discrepancies when required.",
      "Support reporting activities by compiling and preparing information for internal teams.",
      "Assist with spreadsheet management, data cleaning, and information updates.",
    ],
    qualifications: [
      "Currently pursuing or recently completed a Bachelor's Degree in Commerce, Business Administration, Management, Information Technology, Computer Applications, Economics, or a related discipline.",
      "Relevant certifications in Microsoft Excel, Data Management, Business Administration, or Office Productivity tools will be advantageous.",
    ],
    skills: [
      "Strong attention to detail and accuracy.",
      "Proficiency in Microsoft Excel, Google Sheets, and Microsoft Office applications.",
      "Good typing speed and data entry efficiency.",
      "Ability to maintain confidentiality and handle sensitive information responsibly.",
    ],
    internshipNote:
      "Internships are designed as learning-first opportunities. During the initial 90-day period, interns gain hands-on experience by working on live projects and collaborating with different teams. Remuneration is not applicable during the first 90 days; continued engagement and any associated compensation is reviewed afterward based on performance, business requirements, and the sole discretion of the company.",
  },
  {
    title: "Customer Success Manager",
    type: "Full-time",
    department: "Customer Success",
    location: "Remote",
    overview:
      "Academy is seeking a Customer Success Manager who believes that exceptional customer experiences are built through trust, responsiveness, and genuine care. This role is responsible for ensuring learners, clients, and stakeholders receive consistent support throughout their journey while helping maximise engagement, satisfaction, retention, and long-term success.",
    responsibilities: [
      "Serve as the primary point of contact for learners, clients, and stakeholders throughout their journey.",
      "Build strong relationships through proactive communication and ongoing engagement.",
      "Support onboarding activities and ensure a smooth transition into programmes, services, or learning experiences.",
      "Monitor learner and customer engagement levels and identify opportunities to improve participation and satisfaction.",
      "Coordinate with internal teams to resolve customer concerns and ensure timely issue resolution.",
      "Conduct regular follow-ups and check-ins to understand customer needs and gather feedback.",
      "Track customer health metrics, retention indicators, and engagement trends.",
    ],
    qualifications: [
      "Bachelor's Degree in Business Administration, Management, Communications, Marketing, Education, Psychology, Hospitality, or a related discipline.",
      "Additional certifications in Customer Success, Relationship Management, Customer Experience, or Project Management will be advantageous.",
    ],
    skills: [
      "2-5 years of experience in Customer Success, Account Management, Client Servicing, Relationship Management, or Student Services.",
      "Strong interpersonal and relationship-building skills.",
      "Experience working with CRM platforms and customer management systems.",
      "Strong problem-solving and conflict-resolution skills.",
      "A customer-first mindset with a proactive approach to service delivery.",
    ],
  },
  {
    title: "Data Analyst",
    type: "Full-time",
    department: "Analytics & Insights",
    location: "Remote",
    overview:
      "Academy is seeking a detail-oriented and commercially aware Data Analyst who can transform data into meaningful insights that drive better decisions. You will work across multiple functions, analysing learner behaviour, operational performance, marketing effectiveness, and business metrics.",
    responsibilities: [
      "Collect, clean, organise, and analyse data from multiple business sources.",
      "Develop dashboards, reports, and performance tracking systems for various departments.",
      "Analyse learner engagement, course performance, customer behaviour, and operational metrics.",
      "Identify trends, patterns, opportunities, and risks within large datasets.",
      "Support leadership with data-driven recommendations and business insights.",
      "Assist marketing teams in measuring campaign effectiveness and customer acquisition performance.",
      "Create automated reporting processes to improve efficiency and visibility.",
    ],
    qualifications: [
      "Bachelor's Degree in Data Analytics, Statistics, Mathematics, Economics, Business Analytics, Computer Science, Engineering, Commerce, or a related discipline.",
      "Additional certifications in Data Analytics, Business Intelligence, Data Visualisation, SQL, Power BI, or Tableau will be advantageous.",
    ],
    skills: [
      "2-5 years of experience in data analysis, business intelligence, reporting, or analytics-related roles.",
      "Strong proficiency in Microsoft Excel and Google Sheets.",
      "Experience with Power BI, Tableau, Looker Studio, or similar reporting platforms.",
      "Working knowledge of SQL and database querying.",
      "Ability to interpret complex datasets and communicate findings clearly.",
    ],
  },
  {
    title: "Operations Executive",
    type: "Full-time",
    department: "Operations",
    location: "Remote",
    overview:
      "Academy is looking for a proactive and highly organised Operations Executive who enjoys bringing structure, efficiency, and accountability to day-to-day business activities. You will work closely with multiple teams, helping ensure projects move forward smoothly, deadlines are met, and operational processes continue to improve as the organisation grows.",
    responsibilities: [
      "Support the day-to-day operational activities of the organisation.",
      "Coordinate with internal teams to ensure projects, tasks, and deliverables are completed on schedule.",
      "Monitor workflows and identify opportunities to improve efficiency and productivity.",
      "Maintain operational records, trackers, reports, and documentation.",
      "Assist in developing and implementing standard operating procedures (SOPs).",
      "Support learner operations, programme coordination, and administrative activities where required.",
      "Identify operational bottlenecks and recommend practical solutions.",
    ],
    qualifications: [
      "Bachelor's Degree in Business Administration, Management, Operations, Commerce, Project Management, or a related discipline.",
      "Additional certifications in operations, project management, business administration, or process improvement will be advantageous.",
    ],
    skills: [
      "1-3 years of experience in operations, administration, project coordination, or business support.",
      "Strong organisational and time-management skills.",
      "Experience working with project management platforms such as ClickUp, Asana, Monday.com, Trello, or Notion.",
      "A proactive mindset with a strong sense of ownership and accountability.",
    ],
  },
  {
    title: "Social Media Executive",
    type: "Internship",
    department: "Marketing",
    location: "Remote",
    overview:
      "Academy is seeking a creative, proactive, and digitally savvy Social Media Executive Intern who understands that social media is more than publishing content. This internship offers an opportunity to work on real campaigns, contribute ideas, learn modern social media strategies, and gain hands-on experience across content creation, platform management, audience engagement, and performance tracking.",
    responsibilities: [
      "Assist in planning, creating, and scheduling content across social media platforms.",
      "Support the development of content calendars aligned with marketing objectives.",
      "Create engaging captions, content ideas, and platform-specific social media content.",
      "Monitor audience engagement and assist with community management activities.",
      "Support campaign execution across platforms such as LinkedIn, Instagram, Facebook, YouTube, and X.",
      "Assist in tracking and reporting social media performance metrics.",
    ],
    qualifications: [
      "Currently pursuing or recently completed a Bachelor's Degree in Marketing, Communications, Journalism, Media, Advertising, Business, or a related discipline.",
      "Relevant certifications in Social Media Marketing, Digital Marketing, or Content Marketing will be advantageous.",
    ],
    skills: [
      "Strong interest in social media, content creation, digital marketing, and branding.",
      "Understanding of major social media platforms and their best practices.",
      "Basic familiarity with Canva, CapCut, Adobe Creative Suite, or similar creative tools is advantageous.",
      "A positive attitude, willingness to learn, and strong ownership mindset.",
    ],
    internshipNote:
      "Internships are designed as learning-first opportunities. During the initial 90-day period, interns are provided mentorship, practical exposure, and the opportunity to work on real-world projects. Remuneration is not applicable during the first 90 days; continued engagement and any associated compensation is reviewed afterward based on performance, business requirements, and the sole discretion of the company.",
  },
  {
    title: "Jr. Search Engine Optimization Specialist",
    type: "Internship",
    department: "Marketing",
    location: "Remote",
    overview:
      "Academy is looking for a curious, analytical, and growth-oriented Jr. Search Engine Optimization Specialist to join our team. You will work on real projects, contribute to actual SEO initiatives, and gain hands-on exposure to keyword research, content optimisation, technical SEO fundamentals, competitive analysis, and organic growth strategies.",
    responsibilities: [
      "Conduct keyword research to identify ranking opportunities and search intent.",
      "Assist with on-page SEO optimisation, including meta titles, meta descriptions, heading structures, and internal linking.",
      "Support content teams with SEO best practices and content optimisation strategies.",
      "Perform competitor research and analyse industry trends.",
      "Assist in website audits to identify technical, content, and user experience improvements.",
      "Monitor keyword rankings, website performance, and organic traffic trends.",
      "Research backlink opportunities and support authority-building initiatives.",
    ],
    qualifications: [
      "Currently pursuing or recently completed a Bachelor's Degree in Marketing, Business, Communications, Digital Marketing, Information Technology, or a related discipline.",
      "Relevant certifications in SEO, Digital Marketing, or Google Analytics will be advantageous.",
    ],
    skills: [
      "Strong interest in SEO, content marketing, and digital growth.",
      "Familiarity with tools such as Google Search Console, Google Analytics, Ahrefs, SEMrush, or Ubersuggest is advantageous.",
      "Strong research and analytical skills.",
      "Attention to detail and willingness to learn.",
    ],
    internshipNote:
      "Internships are designed as learning-first opportunities. During the initial 90-day period, interns are provided mentorship, practical exposure, and the opportunity to work on real-world projects. Remuneration is not applicable during the first 90 days; continued engagement and any associated compensation is reviewed afterward based on performance, business requirements, and the sole discretion of the company.",
  },
  {
    title: "PPC Specialist",
    type: "Full-time",
    department: "Marketing",
    location: "Goa, India",
    overview:
      "Academy is seeking a results-driven PPC Specialist who understands that paid advertising is more than clicks and impressions. The ideal candidate combines analytical thinking with commercial awareness and understands how to build, manage, and optimise campaigns across multiple digital advertising platforms.",
    responsibilities: [
      "Plan, launch, manage, and optimise PPC campaigns across Google Ads, Meta Ads, LinkedIn Ads, YouTube Ads, and other platforms.",
      "Conduct keyword research, audience research, competitor analysis, and campaign planning.",
      "Monitor campaign budgets, bids, spend allocation, and performance metrics.",
      "Analyse campaign performance and identify opportunities to improve CTR, CPC, CPA, ROAS, and conversion rates.",
      "Create detailed performance reports and provide actionable recommendations.",
      "Implement A/B testing strategies across campaigns, audiences, creatives, and landing pages.",
      "Track and monitor conversion events using analytics and tracking platforms.",
    ],
    qualifications: [
      "Bachelor's Degree in Marketing, Business Administration, Advertising, Communications, Digital Marketing, or a related field.",
      "Relevant certifications from Google, Meta, LinkedIn, HubSpot, or recognised institutions will be advantageous.",
    ],
    skills: [
      "Minimum 2-5 years of experience managing paid advertising campaigns.",
      "Strong understanding of Google Ads, Meta Ads Manager, LinkedIn Campaign Manager, and YouTube Advertising.",
      "Experience with conversion tracking, attribution modelling, and campaign analytics.",
      "Strong analytical and reporting capabilities.",
    ],
  },
];
