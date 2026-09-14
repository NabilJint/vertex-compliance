#!/usr/bin/env npx tsx
/**
 * Seed script: generates NDJSON for Sanity dataset import.
 * Run: npx tsx migration/seed.ts > migration/seed.ndjson
 * Import: cd studio && npx sanity dataset import migration/seed.ndjson --replace
 */

type NdjsonDoc = Record<string, unknown>

function ndjson(doc: NdjsonDoc): string {
  return JSON.stringify(doc)
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function blockText(text: string): NdjsonDoc[] {
  return text.split('\n\n').filter(Boolean).map((paragraph) => ({
    _type: 'block',
    _key: slugify(paragraph.slice(0, 40)),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `${slugify(paragraph.slice(0, 30))}-span`,
        text: paragraph,
        marks: [],
      },
    ],
  }))
}

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------

const categories = [
  {
    _id: 'category-data-privacy',
    _type: 'category',
    title: 'Data Privacy & Protection',
    slug: { _type: 'slug', current: 'data-privacy-protection' },
    description:
      'Training on handling personal data, privacy regulations, and data protection best practices.',
  },
  {
    _id: 'category-workplace-safety',
    _type: 'category',
    title: 'Workplace Safety',
    slug: { _type: 'slug', current: 'workplace-safety' },
    description:
      'Health and safety protocols, hazard identification, and emergency preparedness in the workplace.',
  },
  {
    _id: 'category-financial-compliance',
    _type: 'category',
    title: 'Financial Compliance',
    slug: { _type: 'slug', current: 'financial-compliance' },
    description:
      'Regulatory requirements for financial reporting, anti-money laundering, and fiduciary duties.',
  },
  {
    _id: 'category-ethics-conduct',
    _type: 'category',
    title: 'Ethics & Conduct',
    slug: { _type: 'slug', current: 'ethics-conduct' },
    description:
      'Code of conduct, anti-harassment, conflicts of interest, and ethical workplace behavior.',
  },
  {
    _id: 'category-cybersecurity',
    _type: 'category',
    title: 'Cybersecurity',
    slug: { _type: 'slug', current: 'cybersecurity' },
    description:
      'Information security awareness, phishing prevention, and secure data handling practices.',
  },
]

const trainers = [
  {
    _id: 'trainer-sarah-chen',
    _type: 'trainer',
    name: 'Dr. Sarah Chen',
    slug: { _type: 'slug', current: 'sarah-chen' },
    expertise: 'Data Privacy & GDPR',
    bio: blockText(
      'Dr. Sarah Chen is a leading data privacy scholar with over 15 years of experience advising Fortune 500 companies on GDPR compliance, cross-border data transfers, and privacy-by-design frameworks. She holds a J.D. from Stanford Law School and a Ph.D. in Computer Science from MIT.'
    ),
  },
  {
    _id: 'trainer-james-rodriguez',
    _type: 'trainer',
    name: 'James Rodriguez',
    slug: { _type: 'slug', current: 'james-rodriguez' },
    expertise: 'Workplace Safety & OSHA Compliance',
    bio: blockText(
      'James Rodriguez is a certified safety professional (CSP) with 20 years of experience in occupational health and safety. He has conducted over 500 workplace safety audits and specializes in building safety cultures in manufacturing, construction, and healthcare environments.'
    ),
  },
  {
    _id: 'trainer-emily-watson',
    _type: 'trainer',
    name: 'Emily Watson',
    slug: { _type: 'slug', current: 'emily-watson' },
    expertise: 'Financial Regulation & Compliance',
    bio: blockText(
      'Emily Watson is a former SEC enforcement attorney turned compliance educator. With 12 years in financial regulation, she specializes in anti-money laundering (AML), know-your-customer (KYC) requirements, and insider trading prevention for financial institutions.'
    ),
  },
  {
    _id: 'trainer-michael-okonkwo',
    _type: 'trainer',
    name: 'Michael Okonkwo',
    slug: { _type: 'slug', current: 'michael-okonkwo' },
    expertise: 'Ethics & Corporate Governance',
    bio: blockText(
      'Michael Okonkwo is a governance and ethics consultant who has helped over 200 organizations build robust compliance programs. He is a former Chief Compliance Officer at a multinational corporation and holds certifications in ethics and compliance management.'
    ),
  },
  {
    _id: 'trainer-priya-sharma',
    _type: 'trainer',
    name: 'Priya Sharma',
    slug: { _type: 'slug', current: 'priya-sharma' },
    expertise: 'Cybersecurity & Information Security',
    bio: blockText(
      'Priya Sharma is a CISSP-certified cybersecurity professional with a background in threat intelligence and incident response. She has trained thousands of employees across industries on phishing awareness, secure coding practices, and data breach prevention.'
    ),
  },
  {
    _id: 'trainer-david-kim',
    _type: 'trainer',
    name: 'David Kim',
    slug: { _type: 'slug', current: 'david-kim' },
    expertise: 'Health, Safety & Environmental Compliance',
    bio: blockText(
      'David Kim is an environmental health and safety (EHS) specialist with expertise in chemical safety, hazardous materials handling, and environmental regulations. He has worked with OSHA, EPA, and international bodies on compliance standards.'
    ),
  },
]

// ---------------------------------------------------------------------------
// LESSONS
// ---------------------------------------------------------------------------

interface LessonInput {
  id: string
  title: string
  videoUrl: string
  duration: number // seconds
  isFreePreview?: boolean
  employeeCount: number
  notes: string
  keyPoints: string[]
  proTip: string
  resources: { type: string; title: string; description: string; url: string }[]
}

function makeLesson(input: LessonInput): NdjsonDoc {
  return {
    _id: `lesson-${input.id}`,
    _type: 'lesson',
    title: input.title,
    slug: { _type: 'slug', current: input.id },
    videoUrl: input.videoUrl,
    duration: input.duration,
    isFreePreview: input.isFreePreview ?? false,
    employeeCount: input.employeeCount,
    notes: blockText(input.notes),
    keyPoints: input.keyPoints,
    proTip: input.proTip,
    resources: input.resources,
  }
}

const lessons: LessonInput[] = [
  // ── Course 1: Data Privacy Fundamentals ──────────────────────────────
  {
    id: 'dp-01-understanding-personal-data',
    title: 'Understanding Personal Data',
    videoUrl: 'https://www.youtube.com/watch?v=JukEQq4XeCc',
    duration: 480,
    isFreePreview: true,
    employeeCount: 342,
    notes:
      'Personal data is any information that relates to an identified or identifiable individual. This includes names, email addresses, phone numbers, IP addresses, location data, and even pseudonymous data if re-identification is possible.\n\nUnder GDPR, personal data is defined broadly to include any information that can be used to identify a person directly or indirectly. The key test is whether the data can be linked to a specific individual through reasonable means.\n\nSensitive personal data (special category data) includes racial or ethnic origin, political opinions, religious beliefs, trade union membership, genetic data, biometric data, health data, and data concerning a person\'s sex life or sexual orientation. This data requires additional protections and explicit consent.',
    keyPoints: [
      'Personal data covers any information that can identify a person directly or indirectly',
      'Sensitive personal data requires explicit consent and additional safeguards',
      'Pseudonymous data is still personal data if re-identification is possible',
      'Data protection applies regardless of the format or storage medium',
    ],
    proTip:
      'When in doubt about whether data is personal, ask: could someone use this to identify an individual? If the answer is yes, treat it as personal data.',
    resources: [
      {
        type: 'article',
        title: 'GDPR Article 4 - Definitions',
        description: 'Official GDPR text defining personal data and related terms.',
        url: 'https://gdpr-info.eu/art-4-gdpr/',
      },
      {
        type: 'guide',
        title: 'ICO Guide to Personal Data',
        description: 'UK Information Commissioner\'s guide to understanding personal data.',
        url: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/what-is-personal-data/',
      },
    ],
  },
  {
    id: 'dp-02-data-processing-principles',
    title: 'Data Processing Principles',
    videoUrl: 'https://www.youtube.com/watch?v=Tm0Ap0dzdkk',
    duration: 600,
    employeeCount: 338,
    notes:
      'The seven data processing principles form the foundation of all data protection laws. These principles must be embedded in every stage of data handling.\n\n1. Lawfulness, Fairness, and Transparency: Data must be processed legally, fairly, and in a transparent manner. Individuals must be informed about how their data is used.\n\n2. Purpose Limitation: Data must be collected for specified, explicit, and legitimate purposes and not further processed in a manner incompatible with those purposes.\n\n3. Data Minimization: Data collected must be adequate, relevant, and limited to what is necessary for the purposes for which it is processed.\n\n4. Accuracy: Data must be accurate and kept up to date. Reasonable steps must be taken to ensure inaccurate data is erased or rectified.\n\n5. Storage Limitation: Data must be kept in identifiable form for no longer than necessary for the purposes for which it is processed.\n\n6. Integrity and Confidentiality: Data must be processed in a manner that ensures appropriate security, including protection against unauthorized or unlawful processing and accidental loss or damage.\n\n7. Accountability: The data controller must be able to demonstrate compliance with all of the above principles.',
    keyPoints: [
      'Seven principles govern all lawful data processing activities',
      'Purpose limitation means data collected for one use cannot be repurposed without consent',
      'Data minimization requires collecting only what is strictly necessary',
      'Accountability means organizations must demonstrate compliance, not just claim it',
    ],
    proTip:
      'Create a data processing inventory that maps each type of data to its purpose, legal basis, retention period, and security measures. This makes accountability audits straightforward.',
    resources: [
      {
        type: 'article',
        title: 'GDPR Article 5 - Principles',
        description: 'Official GDPR text on data processing principles.',
        url: 'https://gdpr-info.eu/art-5-gdpr/',
      },
    ],
  },
  {
    id: 'dp-03-data-subject-rights',
    title: 'Data Subject Rights',
    videoUrl: 'https://www.youtube.com/watch?v=76fcelayw00',
    duration: 540,
    employeeCount: 330,
    notes:
      'Data subjects have eight key rights under GDPR that organizations must respect and facilitate.\n\n1. Right to Be Informed: Individuals must be told what data is collected, how it is used, how long it is kept, and who it is shared with.\n\n2. Right of Access: Individuals can request a copy of all personal data held about them, along with details of how it is processed.\n\n3. Right to Rectification: Individuals can have inaccurate personal data corrected and incomplete data completed.\n\n4. Right to Erasure (Right to Be Forgotten): Individuals can request deletion of their personal data in certain circumstances.\n\n5. Right to Restrict Processing: Individuals can request that their data is not processed in certain circumstances.\n\n6. Right to Data Portability: Individuals can receive their personal data in a structured, commonly used, machine-readable format.\n\n7. Right to Object: Individuals can object to processing based on legitimate interests, direct marketing, or scientific/historical research.\n\n8. Rights Related to Automated Decision-Making: Individuals have the right not to be subject to decisions based solely on automated processing, including profiling, that produce legal or significant effects.',
    keyPoints: [
      'Eight rights protect individuals over their personal data',
      'Right of access requires organizations to provide data within one month',
      'Right to erasure has specific exceptions, such as legal obligations',
      'Automated decision-making rights protect against unfair profiling',
    ],
    proTip:
      'Build a standardized request form for data subject access requests (DSARs). Track response deadlines in a central system to avoid missing the one-month window.',
    resources: [
      {
        type: 'article',
        title: 'GDPR Rights Overview',
        description: 'Comprehensive guide to all data subject rights under GDPR.',
        url: 'https://gdpr-info.eu/chapter3-gdpr/',
      },
    ],
  },
  {
    id: 'dp-04-data-breach-notification',
    title: 'Data Breach Notification',
    videoUrl: 'https://www.youtube.com/watch?v=Ppku70h2Up4',
    duration: 420,
    employeeCount: 325,
    notes:
      'A personal data breach is a security incident that leads to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to personal data. Organizations must have clear breach response procedures.\n\nNotification to the supervisory authority must happen within 72 hours of becoming aware of a breach, unless the breach is unlikely to result in a risk to individuals. The notification must include the nature of the breach, categories and approximate number of individuals affected, likely consequences, and measures taken or proposed.\n\nIf the breach is likely to result in a high risk to individuals, those individuals must be notified without undue delay. The notification must describe the nature of the breach in clear and plain language and provide contact details for further information.\n\nMaintaining a breach register is mandatory. All breaches must be documented regardless of whether they require notification to the authority or individuals.',
    keyPoints: [
      'Breaches must be reported to the supervisory authority within 72 hours',
      'Individuals must be notified when there is a high risk to their rights and freedoms',
      'All breaches must be recorded in a breach register, regardless of severity',
      'Notification must include nature, impact, and remediation measures',
    ],
    proTip:
      'Run tabletop breach response exercises quarterly. The 72-hour window leaves no time to figure out roles and responsibilities during an actual incident.',
    resources: [
      {
        type: 'article',
        title: 'GDPR Breach Notification Rules',
        description: 'Official guidance on breach notification requirements.',
        url: 'https://gdpr-info.eu/art-33-gdpr/',
      },
    ],
  },
  // ── Course 2: Workplace Safety Essentials ────────────────────────────
  {
    id: 'ws-01-hazard-identification',
    title: 'Hazard Identification and Risk Assessment',
    videoUrl: 'https://www.youtube.com/watch?v=Y7MnjcxxUDw',
    duration: 600,
    isFreePreview: true,
    employeeCount: 456,
    notes:
      'Hazard identification is the cornerstone of workplace safety. A hazard is anything that has the potential to cause harm, including physical objects, chemicals, biological agents, psychological factors, and environmental conditions.\n\nThe risk assessment process involves five steps: identify hazards, determine who might be harmed and how, evaluate the risks and decide on precautions, record findings and implement measures, and review the assessment regularly.\n\nCommon workplace hazards include slips, trips, and falls; manual handling injuries; machinery and equipment hazards; electrical hazards; chemical exposure; noise and vibration; and ergonomic risks. Each hazard requires specific control measures following the hierarchy of controls.\n\nThe hierarchy of controls prioritizes elimination (removing the hazard entirely), substitution (replacing with less hazardous alternatives), engineering controls (isolating people from the hazard), administrative controls (changing work practices), and personal protective equipment (PPE) as the last line of defense.',
    keyPoints: [
      'Hazard identification covers physical, chemical, biological, and psychosocial risks',
      'The five-step risk assessment process must be documented and reviewed regularly',
      'The hierarchy of controls prioritizes elimination over PPE',
      'Slips, trips, and falls remain the most common workplace hazard',
    ],
    proTip:
      'Conduct informal hazard walks every shift, not just during annual assessments. Frontline workers spot hazards daily and their input is invaluable.',
    resources: [
      {
        type: 'guide',
        title: 'OSHA Risk Assessment Guide',
        description: 'Comprehensive OSHA guidance on workplace risk assessment.',
        url: 'https://www.osha.gov/risk-assessment',
      },
    ],
  },
  {
    id: 'ws-02-emergency-procedures',
    title: 'Emergency Procedures and Evacuation',
    videoUrl: 'https://www.youtube.com/watch?v=m5hRU9b2AZo',
    duration: 540,
    employeeCount: 448,
    notes:
      'Every workplace must have clearly documented emergency procedures that are regularly communicated and practiced through drills. The goal is to ensure all employees know what to do when an emergency occurs.\n\nEmergency procedures must cover fire evacuation, medical emergencies, chemical spills, natural disasters, security threats, and utility failures. Each type of emergency requires specific response protocols, designated roles, and communication chains.\n\nFire evacuation procedures should include alarm recognition, exit routes, assembly points, headcount procedures, and designated fire wardens. Evacuation maps must be posted near exits and in common areas, showing primary and secondary escape routes.\n\nRegular drills are essential. Fire drills should be conducted at least twice a year, and employees should be trained on how to respond to different types of alarms. After each drill, conduct a debrief to identify improvements.',
    keyPoints: [
      'Emergency procedures must cover fire, medical, chemical, and security incidents',
      'Evacuation maps must show primary and secondary escape routes',
      'Fire drills should be conducted at least twice per year',
      'Designated fire wardens and first aiders must be clearly identified',
    ],
    proTip:
      'Label exit routes with glow-in-the-dark signage and conduct drills at unexpected times to test genuine readiness.',
    resources: [
      {
        type: 'guide',
        title: 'OSHA Emergency Action Plans',
        description: 'OSHA requirements for emergency action plans.',
        url: 'https://www.osha.gov/emergency-action-plans',
      },
    ],
  },
  {
    id: 'ws-03-personal-protective-equipment',
    title: 'Personal Protective Equipment (PPE)',
    videoUrl: 'https://www.youtube.com/watch?v=lNnOzLl1gsE',
    duration: 480,
    employeeCount: 440,
    notes:
      'Personal Protective Equipment is the last line of defense in the hierarchy of controls. It should only be used when other control measures are not sufficient to reduce risk to an acceptable level.\n\nPPE categories include head protection (hard hats, bump caps), eye and face protection (safety glasses, goggles, face shields), hand protection (gloves selected for specific hazards), foot protection (safety boots, anti-slip footwear), hearing protection (earplugs, earmuffs), and respiratory protection (dust masks, respirators).\n\nPPE selection must be based on a thorough hazard assessment. Different hazards require different PPE specifications. For example, gloves for chemical handling must be rated for the specific chemicals in use, and respirators must be fitted to each individual.\n\nPPE programs must include proper selection, fitting, training, maintenance, inspection, and replacement schedules. Employees must be trained on correct use, limitations, and when PPE is required.',
    keyPoints: [
      'PPE is the last resort in the hierarchy of controls, not the first',
      'PPE must be matched to specific hazards through a formal assessment',
      'Fit testing is mandatory for respirators and some hearing protection',
      'Regular inspection and replacement schedules prevent PPE failure',
    ],
    proTip:
      'Keep PPE inspection logs and set calendar reminders for replacement dates. Expired or damaged PPE provides a false sense of security.',
    resources: [
      {
        type: 'guide',
        title: 'OSHA PPE Standards',
        description: 'Complete OSHA guidance on personal protective equipment.',
        url: 'https://www.osha.gov/ppe',
      },
    ],
  },
  {
    id: 'ws-04-ergonomics-workplace',
    title: 'Workplace Ergonomics',
    videoUrl: 'https://www.youtube.com/watch?v=ofnpBtO1-gA',
    duration: 420,
    employeeCount: 435,
    notes:
      'Ergonomics is the science of designing the workplace to fit the worker, not forcing the worker to fit the workplace. Poor ergonomics leads to musculoskeletal disorders (MSDs) which are among the most common workplace injuries.\n\nCommon MSDs include carpal tunnel syndrome, tendonitis, back strain, and repetitive strain injuries. Risk factors include repetitive motions, forceful exertions, awkward postures, vibration, and prolonged static positions.\n\nErgonomic assessment should evaluate workstation setup: monitor height and distance, keyboard and mouse position, chair adjustment, desk height, and foot support. The goal is to maintain neutral postures where joints are naturally aligned.\n\nFor office workers, the 20-20-20 rule helps prevent eye strain: every 20 minutes, look at something 20 feet away for 20 seconds. Regular breaks and stretching programs reduce the risk of repetitive strain injuries.',
    keyPoints: [
      'Ergonomic injuries (MSDs) are among the most common and costly workplace injuries',
      'Workstation setup should promote neutral body postures',
      'The 20-20-20 rule reduces eye strain for screen workers',
      'Regular breaks and stretching are essential for repetitive tasks',
    ],
    proTip:
      'Provide standing desk options and encourage position changes every 30 minutes. Movement is the best ergonomic intervention.',
    resources: [
      {
        type: 'guide',
        title: 'OSHA Ergonomics Guidelines',
        description: 'OSHA guidance on preventing ergonomic injuries.',
        url: 'https://www.osha.gov/ergonomics',
      },
    ],
  },
  // ── Course 3: Financial Compliance and AML ──────────────────────────
  {
    id: 'fc-01-anti-money-laundering',
    title: 'Anti-Money Laundering (AML) Basics',
    videoUrl: 'https://www.youtube.com/watch?v=1jzJocpfqsU',
    duration: 600,
    isFreePreview: true,
    employeeCount: 280,
    notes:
      'Money laundering is the process of making illegally gained proceeds appear legal. It typically involves three stages: placement (introducing dirty money into the financial system), layering (disguising the trail through complex transactions), and integration (returning the money to the legitimate economy).\n\nAML regulations require financial institutions to establish compliance programs that include internal policies and procedures, a designated compliance officer, ongoing employee training, and independent testing of the program.\n\nSuspicious Activity Reports (SARs) must be filed when a transaction is suspected of involving money laundering, fraud, or other financial crimes. Currency Transaction Reports (CTRs) must be filed for cash transactions exceeding $10,000.\n\nKnow Your Customer (KYC) procedures are fundamental to AML compliance. These include customer identification, verification of identity, understanding the nature of the customer\'s activities, and ongoing monitoring of transactions.',
    keyPoints: [
      'Money laundering has three stages: placement, layering, and integration',
      'AML compliance programs require policies, a compliance officer, training, and auditing',
      'SARs must be filed for suspicious transactions regardless of amount',
      'KYC procedures include identification, verification, and ongoing monitoring',
    ],
    proTip:
      'When evaluating whether to file a SAR, document your reasoning even if you decide not to file. Regulators examine decision-making processes, not just outcomes.',
    resources: [
      {
        type: 'article',
        title: 'FinCEN AML Guidelines',
        description: 'US Financial Crimes Enforcement Network AML guidance.',
        url: 'https://www.fincen.gov/compliance',
      },
    ],
  },
  {
    id: 'fc-02-know-your-customer',
    title: 'Know Your Customer (KYC) Procedures',
    videoUrl: 'https://www.youtube.com/watch?v=dGH50pb7Pdg',
    duration: 540,
    employeeCount: 275,
    notes:
      'KYC is the process of verifying the identity of clients and understanding the nature of their activities. It is a critical component of AML compliance and applies to banking, insurance, real estate, securities, and other regulated industries.\n\nThe three pillars of KYC are Customer Identification Program (CIP), Customer Due Diligence (CDD), and Enhanced Due Diligence (EDD).\n\nCIP requires collecting and verifying name, date of birth, address, and identification number. Government-issued photo IDs and independent verification sources are standard requirements.\n\nCDD goes beyond identity to understand the customer\'s expected transaction patterns, source of funds, and business relationships. This creates a baseline for monitoring.\n\nEDD is required for higher-risk customers such as politically exposed persons (PEPs), customers in high-risk jurisdictions, and complex business structures. It requires additional scrutiny and more frequent reviews.\n\nOngoing monitoring involves reviewing transactions against expected patterns, updating customer information periodically, and re-assessing risk levels.',
    keyPoints: [
      'KYC has three pillars: CIP, CDD, and EDD',
      'CIP requires verifying name, DOB, address, and identification number',
      'CDD establishes expected transaction patterns as a monitoring baseline',
      'EDD applies to high-risk customers including PEPs and high-risk jurisdictions',
    ],
    proTip:
      'Automate transaction monitoring where possible, but ensure analysts understand why alerts trigger. False positive fatigue is the biggest threat to effective monitoring.',
    resources: [
      {
        type: 'article',
        title: 'FinCEN Customer Due Diligence Rule',
        description: 'Official guidance on the CDD final rule.',
        url: 'https://www.fincen.gov/sites/default/files/shared/FAQ_on_CDD_Rule_508.pdf',
      },
    ],
  },
  {
    id: 'fc-03-sanctions-compliance',
    title: 'Sanctions Compliance',
    videoUrl: 'https://www.youtube.com/watch?v=A1QAv7eNgVo',
    duration: 480,
    employeeCount: 270,
    notes:
      'Sanctions are economic restrictions imposed by governments to achieve foreign policy and national security objectives. They can target countries, entities, and individuals, and financial institutions must screen all transactions against sanctions lists.\n\nThe major sanctions programs include OFAC (US Office of Foreign Assets Control), EU sanctions, and UN Security Council sanctions. OFAC administers and enforces economic sanctions against targeted foreign countries, terrorists, narcotics traffickers, and others.\n\nThe SDN (Specially Designated Nationals) List contains individuals and entities owned or controlled by, or acting for or on behalf of, targeted countries. US persons are generally prohibited from dealing with SDN-listed parties.\n\nSanctions screening must be integrated into customer onboarding, transaction processing, and ongoing monitoring. Screening systems must be updated regularly with the latest sanctions lists and must be capable of fuzzy matching to catch variations in names.\n\nViolations can result in severe penalties including fines in the millions of dollars, loss of banking licenses, and criminal prosecution. Strict liability applies, meaning intent is not required for a violation.',
    keyPoints: [
      'OFAC, EU, and UN maintain separate sanctions lists that must all be screened',
      'SDN-listed parties are completely off-limits for US persons',
      'Screening must occur at onboarding and for every transaction',
      'Sanctions violations carry strict liability with severe financial penalties',
    ],
    proTip:
      'Configure your screening system to flag near-matches and require manual review. A false negative is far more costly than a false positive.',
    resources: [
      {
        type: 'article',
        title: 'OFAC Sanctions Programs',
        description: 'Complete list of OFAC sanctions programs and guidance.',
        url: 'https://ofac.treasury.gov/sanctions-programs-and-country-information',
      },
    ],
  },
  {
    id: 'fc-04-fraud-prevention',
    title: 'Fraud Prevention and Detection',
    videoUrl: 'https://www.youtube.com/watch?v=c4NjIz-ETco',
    duration: 420,
    employeeCount: 268,
    notes:
      'Corporate fraud encompasses a wide range of deceptive activities including financial statement fraud, asset misappropriation, corruption, and cyber fraud. Effective prevention requires a multi-layered approach.\n\nThe fraud triangle identifies three conditions that typically lead to fraud: opportunity (weak internal controls), pressure (financial or personal motivation), and rationalization (justifying the behavior). Removing any one element reduces fraud risk.\n\nInternal controls that prevent fraud include segregation of duties, authorization requirements, physical controls, independent reconciliations, and management oversight. No single control is sufficient; overlapping layers provide the strongest defense.\n\nWhistleblower programs are among the most effective fraud detection tools. Studies consistently show that tips detect more fraud than internal audits, external audits, or internal controls alone. Anonymous reporting channels and anti-retaliation policies encourage reporting.\n\nCommon red flags include lifestyle beyond known means, reluctance to share duties, unusually close vendor relationships, missing documentation, and pressure to meet unrealistic targets.',
    keyPoints: [
      'The fraud triangle identifies opportunity, pressure, and rationalization as fraud drivers',
      'Segregation of duties is the most fundamental internal control against fraud',
      'Whistleblower tips detect more fraud than any other method',
      'Lifestyle beyond means and reluctance to share duties are key red flags',
    ],
    proTip:
      'Rotate financial duties periodically and ensure no single person controls an entire transaction cycle. Segregation of duties is the most effective fraud deterrent.',
    resources: [
      {
        type: 'guide',
        title: 'ACFE Fraud Prevention Guide',
        description: 'Association of Certified Fraud Examiners prevention resources.',
        url: 'https://www.acfe.com/fraud-prevention.aspx',
      },
    ],
  },
  // ── Course 4: Preventing Workplace Harassment ───────────────────────
  {
    id: 'wh-01-understanding-harassment',
    title: 'Understanding Workplace Harassment',
    videoUrl: 'https://www.youtube.com/watch?v=tVtJcVbbjcA',
    duration: 600,
    isFreePreview: true,
    employeeCount: 520,
    notes:
      'Workplace harassment includes any unwelcome conduct based on race, color, religion, sex, national origin, age, disability, or genetic information. When the conduct is severe or pervasive enough to create a hostile work environment or results in an adverse employment decision, it becomes unlawful.\n\nQuid pro quo harassment occurs when employment decisions are based on submission to unwelcome conduct, such as promising a promotion in exchange for sexual favors.\n\nHostile work environment harassment occurs when unwelcome conduct unreasonably interferes with an individual\'s work performance or creates an intimidating, hostile, or offensive working environment.\n\nHarassment can take many forms: verbal (jokes, slurs, epithets), physical (unwanted touching, blocking movement), visual (offensive posters, drawings, emails), and cyber (online bullying, inappropriate messages).\n\nEmployers are liable for harassment by supervisors that results in tangible employment actions. For harassment creating a hostile work environment, employers may be liable if they knew or should have known about the conduct and failed to take prompt corrective action.',
    keyPoints: [
      'Harassment covers conduct based on protected characteristics including race, sex, religion, and age',
      'Quid pro quo involves trading employment benefits for submission to unwelcome conduct',
      'Hostile work environment requires severe or pervasive conduct that interferes with work',
      'Employers are liable when they knew or should have known and failed to act',
    ],
    proTip:
      'Address inappropriate behavior early, even if no complaint has been filed. A culture that tolerates minor misconduct eventually enables serious harassment.',
    resources: [
      {
        type: 'guide',
        title: 'EEOC Harassment Guidance',
        description: 'Equal Employment Commission guidance on workplace harassment.',
        url: 'https://www.eeoc.gov/harassment',
      },
    ],
  },
  {
    id: 'wh-02-bystander-intervention',
    title: 'Bystander Intervention Techniques',
    videoUrl: 'https://www.youtube.com/watch?v=t5mxS_rU6lw',
    duration: 480,
    employeeCount: 510,
    notes:
      'Bystander intervention shifts the responsibility for preventing harassment from solely the victim to everyone in the workplace. When employees witness inappropriate behavior, they have the power to intervene and prevent escalation.\n\nThe Five Ds of bystander intervention provide multiple approaches: Direct (confronting the behavior directly), Distract (creating a diversion to interrupt the situation), Delegate (getting help from someone with authority), Delay (checking in with the target after the incident), and Document (recording the incident for evidence).\n\nNot every intervention requires confrontation. Sometimes a distraction, such as asking the target a question or changing the subject, is the safest and most effective approach. The key is doing something rather than remaining silent.\n\nBarriers to intervention include fear of retaliation, uncertainty about whether the behavior is really harassment, not wanting to make things worse, and diffusion of responsibility in group settings. Training helps overcome these barriers by building confidence and providing practice scenarios.\n\nOrganizations must protect bystanders from retaliation and recognize those who speak up. A culture that rewards intervention creates a self-reinforcing cycle of prevention.',
    keyPoints: [
      'The Five Ds are: Direct, Distract, Delegate, Delay, and Document',
      'Intervention does not always require confrontation; distraction can be effective',
      'Fear of retaliation is the primary barrier to bystander intervention',
      'Organizations must protect and recognize bystanders who speak up',
    ],
    proTip:
      'Practice bystander scenarios in training so that intervention becomes a reflex rather than a decision made under pressure.',
    resources: [
      {
        type: 'guide',
        title: 'Green Dot Bystander Training',
        description: 'Evidence-based bystander intervention program.',
        url: 'https://www.green-dot.org/',
      },
    ],
  },
  {
    id: 'wh-03-reporting-investigation',
    title: 'Reporting and Investigation Processes',
    videoUrl: 'https://www.youtube.com/watch?v=XeVMx4uMA0s',
    duration: 420,
    employeeCount: 505,
    notes:
      'Effective reporting mechanisms are essential for addressing harassment. Employees must have multiple channels for reporting, including direct supervisors, HR, anonymous hotlines, and ombudspersons.\n\nReports must be taken seriously and investigated promptly and thoroughly. Investigations should be conducted by trained, impartial investigators who have no relationship with the parties involved.\n\nThe investigation process includes: receiving the complaint, assessing immediate safety needs, planning the investigation, conducting interviews, collecting and analyzing evidence, reaching findings, and implementing corrective action.\n\nConfidentiality must be maintained to the extent possible while conducting a thorough investigation. All parties involved must be informed of anti-retaliation protections.\n\nDocumentation throughout the investigation is critical. Maintain detailed records of interviews, evidence, findings, and actions taken. This documentation protects both the organization and the individuals involved.\n\nCorrective action should be proportionate to the findings and may include counseling, training, reassignment, suspension, or termination. Follow-up with the complainant ensures the harassment has stopped.',
    keyPoints: [
      'Multiple reporting channels ensure accessibility for all employees',
      'Investigations must be prompt, thorough, and conducted by impartial investigators',
      'Confidentiality must be balanced against the need for a thorough investigation',
      'Anti-retaliation protections must be communicated and enforced',
    ],
    proTip:
      'Train managers to receive complaints without judgment or defensiveness. A poor initial response can discourage reporting and expose the organization to greater liability.',
    resources: [
      {
        type: 'guide',
        title: 'EEOC Investigation Guidance',
        description: 'EEOC guidance on conducting harassment investigations.',
        url: 'https://www.eeoc.gov/investigations',
      },
    ],
  },
  // ── Course 5: Cybersecurity Awareness ───────────────────────────────
  {
    id: 'ca-01-phishing-prevention',
    title: 'Phishing and Social Engineering',
    videoUrl: 'https://www.youtube.com/watch?v=eYeU7wJEkBs',
    duration: 600,
    isFreePreview: true,
    employeeCount: 490,
    notes:
      'Phishing is a cyberattack that uses disguised emails, messages, or calls to trick recipients into revealing sensitive information or installing malware. It remains the most common attack vector for data breaches.\n\nTypes of phishing include spear phishing (targeted at specific individuals), whaling (targeting executives), vishing (voice phishing), smishing (SMS phishing), and clone phishing (replicating legitimate emails with malicious links).\n\nRed flags in phishing emails include urgency and fear tactics, generic greetings, misspellings and grammatical errors, suspicious sender addresses, unexpected attachments, and links that do not match the claimed destination.\n\nSocial engineering extends beyond email to include pretexting (creating false scenarios), baiting (leaving infected media), tailgating (following authorized personnel into restricted areas), and impersonation (posing as IT support or authority figures).\n\nThe best defense is a combination of technical controls (email filtering, URL scanning), process controls (verification procedures), and human awareness (training and reporting). When in doubt, verify through a separate communication channel.',
    keyPoints: [
      'Phishing types include spear phishing, whaling, vishing, and smishing',
      'Red flags include urgency, generic greetings, suspicious links, and unexpected attachments',
      'Social engineering includes pretexting, baiting, tailgating, and impersonation',
      'Verify suspicious requests through a separate communication channel',
    ],
    proTip:
      'Report phishing attempts to your security team immediately. Even if you did not click, your report helps protect others in the organization.',
    resources: [
      {
        type: 'guide',
        title: 'CISA Phishing Guidance',
        description: 'Cybersecurity and Infrastructure Security Agency anti-phishing resources.',
        url: 'https://www.cisa.gov/news-events/news/combating-phishing',
      },
    ],
  },
  {
    id: 'ca-02-password-security',
    title: 'Password Security and Authentication',
    videoUrl: 'https://www.youtube.com/watch?v=PoKYBtpUrtQ',
    duration: 420,
    employeeCount: 485,
    notes:
      'Weak passwords remain one of the most exploited vulnerabilities in cybersecurity. The average data breach involves compromised credentials, making password security a critical防线.\n\nStrong passwords should be at least 16 characters long, include a mix of uppercase and lowercase letters, numbers, and special characters, and avoid dictionary words, personal information, and predictable patterns.\n\nPassword managers generate and store complex, unique passwords for every account, eliminating the need to remember dozens of passwords. They are the single most effective tool for improving password hygiene.\n\nMulti-factor authentication (MFA) adds a second layer of security beyond passwords. Even if a password is compromised, MFA prevents unauthorized access. Hardware security keys provide the strongest MFA, followed by authenticator apps and SMS codes.\n\nNever share passwords, reuse passwords across accounts, or store passwords in plain text. If you suspect a password has been compromised, change it immediately and report the incident.\n\nOrganizations should enforce password policies that require complexity, rotation based on risk level, and lockout after failed attempts. Passkeys are emerging as a passwordless alternative that provides stronger security.',
    keyPoints: [
      'Passwords should be at least 16 characters with mixed character types',
      'Password managers are the most effective tool for password hygiene',
      'MFA prevents unauthorized access even when passwords are compromised',
      'Hardware keys provide the strongest MFA, followed by authenticator apps',
    ],
    proTip:
      'Enable MFA on every account that supports it. Prioritize hardware security keys for high-privilege accounts and authenticator apps for everything else.',
    resources: [
      {
        type: 'guide',
        title: 'NIST Password Guidelines',
        description: 'National Institute of Standards and Technology password recommendations.',
        url: 'https://pages.nist.gov/800-63-3/sp800-63b.html',
      },
    ],
  },
  {
    id: 'ca-03-data-protection-practices',
    title: 'Data Protection Practices',
    videoUrl: 'https://www.youtube.com/watch?v=umqUnLETRy8',
    duration: 480,
    employeeCount: 480,
    notes:
      'Data protection in the workplace requires both technical controls and behavioral habits. Every employee is responsible for protecting the data they handle.\n\nData classification helps determine the appropriate level of protection. Common classifications include public, internal, confidential, and restricted. Each level requires specific handling, storage, and sharing rules.\n\nEncryption protects data both at rest (stored on devices) and in transit (sent over networks). Sensitive data should never be stored on unencrypted devices or transmitted over unsecured channels.\n\nPhysical security is often overlooked but critical. Lock screens when stepping away, secure physical documents in locked drawers, use privacy screens in public spaces, and never leave devices unattended.\n\nEmail security requires verifying recipients before sending sensitive information, using encryption for confidential data, avoiding auto-forwarding rules, and being cautious with attachments.\n\nMobile device security includes using strong device locks, enabling remote wipe capability, avoiding public Wi-Fi for sensitive work, and keeping devices updated.\n\nClean desk and clean screen policies reduce the risk of unauthorized access to sensitive information in shared workspaces.',
    keyPoints: [
      'Data classification (public, internal, confidential, restricted) determines protection requirements',
      'Encryption protects data both at rest and in transit',
      'Physical security includes locked screens, secured documents, and privacy screens',
      'Mobile devices need strong locks, remote wipe, and avoidance of public Wi-Fi',
    ],
    proTip:
      'Use the 3-2-1 backup rule: 3 copies of important data, on 2 different media types, with 1 copy offsite.',
    resources: [
      {
        type: 'guide',
        title: 'NIST Data Protection Guidelines',
        description: 'NIST guidelines on data protection and encryption.',
        url: 'https://csrc.nist.gov/publications/detail/sp/800-175b/rev-1/final',
      },
    ],
  },
  {
    id: 'ca-04-incident-response',
    title: 'Security Incident Response',
    videoUrl: 'https://www.youtube.com/watch?v=CPlBi_gEToE',
    duration: 420,
    employeeCount: 475,
    notes:
      'Every employee plays a role in security incident response. Knowing how to recognize, report, and respond to incidents can dramatically reduce damage.\n\nCommon security incidents include phishing attacks that succeeded, lost or stolen devices, unauthorized access to systems, malware infections, data breaches, and ransomware attacks.\n\nWhen you suspect an incident: stop what you are doing, do not attempt to fix it yourself, disconnect from the network if instructed, document what you observed (screenshots, timestamps, error messages), and report immediately to the security team.\n\nThe incident response lifecycle includes preparation, detection and analysis, containment, eradication, recovery, and lessons learned. While the security team leads the technical response, every employee must cooperate with investigation and follow containment instructions.\n\nDo not delete evidence, do not notify external parties without authorization, and do not attempt to negotiate with attackers. These actions can compromise the investigation and increase organizational risk.\n\nPost-incident, participate in lessons learned sessions and implement recommended changes to prevent recurrence.',
    keyPoints: [
      'Recognize, report, and cooperate: every employee has a role in incident response',
      'Disconnect and document when instructed; do not attempt self-remediation',
      'Do not delete evidence or contact external parties without authorization',
      'Post-incident lessons learned are essential for preventing recurrence',
    ],
    proTip:
      'Save the security team\'s contact information in your phone. You may not have access to email or company systems during an incident.',
    resources: [
      {
        type: 'guide',
        title: 'NIST Incident Response Guide',
        description: 'NIST Computer Security Incident Handling Guide.',
        url: 'https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r2.pdf',
      },
    ],
  },
  // ── Course 6: Anti-Corruption and Bribery ────────────────────────────
  {
    id: 'ac-01-foreign-corruption-practices',
    title: 'Foreign Corrupt Practices Act (FCPA)',
    videoUrl: 'https://www.youtube.com/watch?v=vEycrNoh3XE',
    duration: 600,
    isFreePreview: true,
    employeeCount: 195,
    notes:
      'The Foreign Corrupt Practices Act (FCPA) is a US law that prohibits bribing foreign government officials to obtain or retain business. It applies to all US persons, companies listed on US stock exchanges, and their subsidiaries and agents.\n\nThe FCPA has two main provisions: the anti-bribery provisions and the accounting provisions. The anti-bribery provisions prohibit offering, promising, or authorizing the payment of money or anything of value to foreign officials for the purpose of obtaining or retaining business.\n\nThe accounting provisions require companies to maintain accurate books and records and adequate internal controls. Off-books payments, false entries, and inaccurate records violate these provisions regardless of whether a bribe was paid.\n\nFacilitation payments (grease payments) are narrow exceptions for routine government actions, but many companies prohibit them entirely. The UK Bribery Act, which is broader than the FCPA, criminalizes both public and private sector bribery and has no facilitation payment exception.\n\nThird-party liability is a significant risk. Companies can be liable for bribes paid by agents, consultants, distributors, and joint venture partners acting on their behalf. Due diligence on third parties is essential.\n\nPenalties for FCPA violations are severe: criminal fines up to $250,000 per violation for individuals and $2 million per violation for companies, plus disgorgement of profits and civil penalties up to $16,000 per violation.',
    keyPoints: [
      'FCPA prohibits bribing foreign officials to obtain or retain business',
      'The law covers anti-bribery provisions and accurate accounting requirements',
      'Third-party liability extends to agents, consultants, and joint venture partners',
      'Penalties include criminal fines, disgorgement, and civil penalties in the millions',
    ],
    proTip:
      'When doing business in high-risk countries, engage local counsel before hiring third-party intermediaries. Due diligence on agents and consultants is not optional.',
    resources: [
      {
        type: 'guide',
        title: 'DOJ FCPA Guide',
        description: 'Department of Justice Resource Guide to the FCPA.',
        url: 'https://www.justice.gov/criminal-fraud/page/file/937461/download',
      },
    ],
  },
  {
    id: 'ac-02-gifts-entertainment',
    title: 'Gifts, Entertainment, and Hospitality',
    videoUrl: 'https://www.youtube.com/watch?v=iwPKebjKG5Y',
    duration: 480,
    employeeCount: 190,
    notes:
      'Gifts, entertainment, and hospitality are common courtesies in business relationships but can create corruption risks if not managed properly. The line between appropriate hospitality and improper inducement varies by context.\n\nAcceptable gifts are generally nominal in value, infrequent, transparent, and not intended to influence business decisions. They should comply with the recipient\'s organization policies as well as your own.\n\nRed flags include gifts to government officials, gifts timed to coincide with contract decisions, extravagant entertainment, requests for gifts to be given to third parties, and gifts that cannot be properly documented.\n\nMany companies establish monetary thresholds for gifts and entertainment. Common thresholds range from $50 to $250 per occurrence, with annual limits per recipient. Gifts above the threshold require pre-approval.\n\nAll gifts and entertainment must be documented in a gift register or log. The log should include the date, recipient, value, business purpose, and approver. This creates an audit trail for compliance reviews.\n\nWhen giving gifts, ensure they are legal in both your jurisdiction and the recipient\'s. Some countries restrict gifts to government officials entirely. Cultural norms vary widely; research local customs before engaging.\n\nNever give cash or cash equivalents (gift cards, vouchers) as these are almost universally prohibited in anti-corruption policies.',
    keyPoints: [
      'Gifts must be nominal, infrequent, transparent, and properly documented',
      'Common thresholds range from $50-$250 per occurrence with annual limits',
      'All gifts must be logged with date, recipient, value, and business purpose',
      'Cash and cash equivalents are almost universally prohibited',
    ],
    proTip:
      'When in doubt, decline the gift or entertainment. The reputational cost of a corruption allegation far exceeds the value of any gift.',
    resources: [
      {
        type: 'guide',
        title: 'TRACE Bribery Prevention Guide',
        description: 'TRACE International guidance on gifts and hospitality.',
        url: 'https://traceinternational.org/',
      },
    ],
  },
  {
    id: 'ac-03-conflict-of-interest',
    title: 'Conflict of Interest Management',
    videoUrl: 'https://www.youtube.com/watch?v=eAHaABaUSpM',
    duration: 420,
    employeeCount: 188,
    notes:
      'A conflict of interest occurs when personal interests interfere with, or appear to interfere with, professional judgment and obligations. Conflicts can be actual, potential, or perceived, and all three types must be managed.\n\nCommon conflicts include financial interests in competitors or suppliers, outside employment or consulting, family relationships with colleagues or business partners, personal friendships with vendors or clients, and side businesses that compete with or serve the employer.\n\nDisclosure is the first step in managing conflicts. Most organizations require annual conflict-of-interest disclosures and additional disclosures when new conflicts arise. Failure to disclose is itself a violation, even if the conflict could have been properly managed.\n\nManagement strategies include recusal from decision-making, divestiture of conflicting interests, modification of duties, enhanced oversight, and separation of roles. The appropriate strategy depends on the nature and severity of the conflict.\n\nBoard members and senior executives typically face the most stringent conflict requirements, including independence standards, related-party transaction policies, and pre-clearance for certain activities.\n\nA culture of transparency and proactive disclosure prevents conflicts from becoming compliance violations.',
    keyPoints: [
      'Conflicts can be actual, potential, or perceived — all three must be managed',
      'Annual disclosure is required; failure to disclose is itself a violation',
      'Management strategies include recusal, divestiture, and enhanced oversight',
      'Board members and executives face the most stringent conflict requirements',
    ],
    proTip:
      'Proactively disclose potential conflicts early, even if you are unsure they are real. Disclosure demonstrates integrity and allows the organization to manage the situation appropriately.',
    resources: [
      {
        type: 'guide',
        title: 'SEC Conflict of Interest Rules',
        description: 'Securities and Exchange Commission guidance on conflicts of interest.',
        url: 'https://www.sec.gov/about/reports-publications/investorpubsconflictshtm',
      },
    ],
  },
  // ── Course 7: Diversity, Equity, and Inclusion ─────────────────────
  {
    id: 'de-01-unconscious-bias',
    title: 'Unconscious Bias in the Workplace',
    videoUrl: 'https://www.youtube.com/watch?v=Qvy1lVZ0mR4',
    duration: 600,
    isFreePreview: true,
    employeeCount: 380,
    notes:
      'Unconscious biases are mental shortcuts that lead to automatic judgments outside of conscious awareness. Everyone has unconscious biases, and they influence hiring, promotions, assignments, evaluations, and daily interactions.\n\nCommon types of unconscious bias include affinity bias (favoring people similar to us), confirmation bias (seeking information that confirms existing beliefs), halo effect (letting one positive trait overshadow others), attribution bias (attributing behavior differently based on group membership), and availability bias (relying on easily recalled examples).\n\nResearch consistently shows that diverse teams outperform homogeneous teams when managed well. Diverse perspectives lead to better problem-solving, more innovation, and stronger decision-making.\n\nMitigation strategies include structured interviews with standardized questions, diverse hiring panels, blind resume reviews, objective evaluation criteria, and calibration sessions for performance reviews.\n\nAt the individual level, practice awareness (recognize when biases might be at play), pause (slow down decisions that involve people), and perspective-taking (consider situations from others\' viewpoints).\n\nInclusive behaviors include actively soliciting diverse viewpoints, ensuring all voices are heard in meetings, giving credit appropriately, and addressing microaggressions constructively.',
    keyPoints: [
      'Everyone has unconscious biases that influence professional decisions',
      'Diverse teams outperform homogeneous teams when managed effectively',
      'Structured processes (interviews, evaluations) reduce the impact of bias',
      'Awareness, pausing, and perspective-taking are practical individual strategies',
    ],
    proTip:
      'In meetings, explicitly invite quieter participants to share their perspectives. The best ideas often come from people who feel excluded from the default conversation.',
    resources: [
      {
        type: 'guide',
        title: 'Harvard IAT Resources',
        description: 'Harvard Project Implicit research on unconscious bias.',
        url: 'https://implicit.harvard.edu/implicit/takeatest.html',
      },
    ],
  },
  {
    id: 'de-02-inclusive-leadership',
    title: 'Inclusive Leadership Practices',
    videoUrl: 'https://www.youtube.com/watch?v=UAiB_mbvyNA',
    duration: 540,
    employeeCount: 375,
    notes:
      'Inclusive leadership is the practice of creating an environment where all employees feel valued, respected, and able to contribute fully. Research identifies six signature traits of inclusive leaders: visible commitment, humility, awareness of bias, curiosity about others, cultural intelligence, and effective collaboration.\n\nVisible commitment means leaders demonstrate their dedication to inclusion through actions, not just words. This includes allocating resources, setting goals, holding themselves accountable, and addressing non-inclusive behavior.\n\nHumility involves acknowledging personal limitations, learning from mistakes, and creating space for others\' expertise. Inclusive leaders recognize they do not have all the answers.\n\nAwareness of bias means actively working to recognize and mitigate personal and systemic biases. This includes examining assumptions about capability, potential, and fit.\n\nCuriosity involves genuinely wanting to understand others\' experiences, perspectives, and needs. Inclusive leaders ask questions, listen actively, and seek to understand before being understood.\n\nCultural intelligence is the ability to function effectively across cultures. It includes knowledge of different cultural norms, skills for cross-cultural communication, and motivation to adapt.\n\nEffective collaboration means ensuring diverse teams can work together productively. This includes facilitating constructive conflict, managing power dynamics, and leveraging diverse strengths.',
    keyPoints: [
      'Six traits define inclusive leaders: commitment, humility, bias awareness, curiosity, CQ, and collaboration',
      'Visible commitment requires action and resource allocation, not just statements',
      'Curiosity involves seeking to understand before being understood',
      'Cultural intelligence enables effective functioning across diverse contexts',
    ],
    proTip:
      'Measure inclusion through regular pulse surveys that ask about belonging, psychological safety, and fairness. Data reveals where good intentions are not producing results.',
    resources: [
      {
        type: 'article',
        title: 'Deloitte Inclusive Leadership Research',
        description: 'Deloitte research on the six signature traits of inclusive leaders.',
        url: 'https://www2.deloitte.com/us/en/insights/focus/inclusion.html',
      },
    ],
  },
  {
    id: 'de-03-equity-accessibility',
    title: 'Equity and Accessibility',
    videoUrl: 'https://www.youtube.com/watch?v=JFW2cfzevio',
    duration: 480,
    employeeCount: 370,
    notes:
      'Equity differs from equality. Equality provides everyone with the same resources, while equity distributes resources based on need to achieve equal outcomes. In the workplace, equity means recognizing that different employees face different barriers and providing appropriate support.\n\nAccessibility ensures that people with disabilities can fully participate in the workplace. This includes physical accessibility (ramp access, accessible restrooms), digital accessibility (screen reader compatibility, captioning), and communication accessibility (alternative formats, sign language interpretation).\n\nUnder the Americans with Disabilities Act (ADA), employers must provide reasonable accommodations to qualified individuals with disabilities unless doing so would cause undue hardship. The interactive process is required to identify effective accommodations.\n\nCommon accommodations include flexible work schedules, modified equipment, ergonomic workstations, screen reader software, sign language interpreters, and job restructuring. Most accommodations are low-cost but have significant impact.\n\nDigital accessibility requires that documents, presentations, websites, and internal tools meet WCAG (Web Content Accessibility Guidelines) standards. This includes providing alt text for images, using proper heading structures, ensuring sufficient color contrast, and providing captions for videos.\n\nInclusive language in job descriptions, communications, and policies signals accessibility and belonging to all employees.',
    keyPoints: [
      'Equity distributes resources based on need; equality provides the same resources to all',
      'ADA requires reasonable accommodations through an interactive process',
      'Digital accessibility follows WCAG standards including alt text, headings, and captions',
      'Most accommodations are low-cost with significant impact on inclusion',
    ],
    proTip:
      'Include accessibility requirements in all technology procurement and document creation processes. Retroactive fixes are more expensive and less effective than building inclusively from the start.',
    resources: [
      {
        type: 'guide',
        title: 'ADA Accommodation Guidance',
        description: 'EEOC guidance on reasonable accommodations under the ADA.',
        url: 'https://www.eeoc.gov/laws/guidance/select-issues-assessing-reasonable-accommodation',
      },
    ],
  },
  // ── Course 8: GDPR Compliance Deep Dive ─────────────────────────────
  {
    id: 'gd-01-gdpr-overview',
    title: 'GDPR Principles and Scope',
    videoUrl: 'https://www.youtube.com/watch?v=JukEQq4XeCc',
    duration: 600,
    isFreePreview: true,
    employeeCount: 310,
    notes:
      'The General Data Protection Regulation (GDPR) is the world\'s most comprehensive data protection law. It applies to any organization that processes personal data of individuals in the European Economic Area (EEA), regardless of where the organization is located.\n\nGDPR applies to controllers (organizations that determine the purposes and means of processing) and processors (organizations that process data on behalf of controllers). Both have specific obligations under the regulation.\n\nThe lawful bases for processing are: consent, contract, legal obligation, vital interests, public task, and legitimate interests. Each basis has specific requirements and limitations.\n\nConsent must be freely given, specific, informed, and unambiguous. It must be as easy to withdraw as to give. Pre-ticked boxes and bundled consent do not meet GDPR standards.\n\nData Protection Impact Assessments (DPIAs) are required for high-risk processing, including large-scale processing of special category data, systematic monitoring, and profiling. DPIAs must be conducted before processing begins.\n\nThe GDPR extraterritorial reach means that organizations worldwide must comply if they offer goods or services to, or monitor the behavior of, individuals in the EEA.',
    keyPoints: [
      'GDPR applies to any organization processing EEA residents\' data, regardless of location',
      'Controllers and processors both have specific obligations under the regulation',
      'Six lawful bases for processing include consent, contract, and legitimate interests',
      'DPIAs are required for high-risk processing before it begins',
    ],
    proTip:
      'Map your data flows to understand where personal data comes from, where it goes, and what lawful basis applies to each processing activity.',
    resources: [
      {
        type: 'article',
        title: 'GDPR Full Text',
        description: 'Official GDPR text with all articles.',
        url: 'https://gdpr-info.eu/',
      },
    ],
  },
  {
    id: 'gd-02-data-protection-officer',
    title: 'Data Protection Officer (DPO) Role',
    videoUrl: 'https://www.youtube.com/watch?v=fLkO4aPSj9g',
    duration: 420,
    employeeCount: 305,
    notes:
      'A Data Protection Officer (DPO) is required under GDPR for public authorities, organizations that engage in large-scale systematic monitoring, or organizations that process special category data on a large scale.\n\nThe DPO must have expert knowledge of data protection law and practices. They report to the highest management level and must be given the resources needed to fulfill their tasks.\n\nDPO responsibilities include informing and advising the organization on GDPR obligations, monitoring compliance, providing advice on DPIAs, cooperating with supervisory authorities, and serving as the contact point for data subjects.\n\nThe DPO must operate independently and must not receive instructions regarding the exercise of their tasks. They cannot be dismissed or penalized for performing their duties.\n\nThe DPO can be an internal employee or an external service provider. In either case, they must have the necessary qualifications, independence, and resources.\n\nOrganizations must publish the contact details of the DPO and communicate them to the supervisory authority. The DPO role is not a replacement for other compliance roles but a specialized function focused on data protection.\n\nWhile not required under all data protection laws, appointing a DPO even where not legally mandated demonstrates commitment to data protection and provides a centralized point of expertise.',
    keyPoints: [
      'DPOs are required for public authorities, large-scale monitoring, and large-scale special category processing',
      'The DPO must report to the highest management level and operate independently',
      'DPOs cannot be penalized for performing their duties',
      'The role can be filled internally or by an external service provider',
    ],
    proTip:
      'Even if a DPO is not legally required, designating a data protection lead ensures someone is focused on compliance and provides a contact point for data subjects.',
    resources: [
      {
        type: 'guide',
        title: 'EDPB DPO Guidance',
        description: 'European Data Protection Board guidance on DPOs.',
        url: 'https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-data-protection-officers_en',
      },
    ],
  },
  {
    id: 'gd-03-international-data-transfers',
    title: 'International Data Transfers',
    videoUrl: 'https://www.youtube.com/watch?v=76fcelayw00',
    duration: 540,
    employeeCount: 300,
    notes:
      'Transferring personal data outside the EEA is restricted under GDPR. Data can only be transferred to countries that provide an adequate level of protection, or through appropriate safeguards.\n\nAdequacy decisions by the European Commission identify countries with sufficient data protection. As of 2024, adequacy decisions exist for countries including the US (under the EU-US Data Privacy Framework), UK, Canada, Japan, South Korea, and others.\n\nStandard Contractual Clauses (SCCs) are the most common mechanism for transfers to non-adequate countries. SCCs are pre-approved contract terms that require the data importer to protect the data to EU standards.\n\nBinding Corporate Rules (BCRs) are internal rules approved by supervisory authorities for transfers within multinational corporate groups. BCRs require regulatory approval and are time-consuming to implement.\n\nTransfer Impact Assessments (TIAs) are required alongside SCCs to evaluate whether the laws of the destination country undermine the protections provided by the SCCs.\n\nSupplementary measures may be required when TIAs identify risks, including encryption, pseudonymization, additional contractual commitments, and organizational measures.\n\nThe Schrems II judgment invalidated the Privacy Shield and increased scrutiny of international transfers. Organizations must conduct genuine assessments rather than treating SCCs as a rubber stamp.',
    keyPoints: [
      'Data transfers outside the EEA require adequacy decisions or appropriate safeguards',
      'SCCs are the most common transfer mechanism for non-adequate countries',
      'TIAs must assess whether destination country laws undermine SCC protections',
      'Supplementary measures like encryption may be required based on TIA findings',
    ],
    proTip:
      'Maintain a register of all international data transfers, the transfer mechanism used, and the date of the last TIA review. Regulators increasingly audit transfer compliance.',
    resources: [
      {
        type: 'guide',
        title: 'EDPB Transfer Guidance',
        description: 'European Data Protection Board guidance on international transfers.',
        url: 'https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-en',
      },
    ],
  },
  // ── Course 9: Chemical Safety and Hazmat ────────────────────────────
  {
    id: 'cs-01-safety-data-sheets',
    title: 'Safety Data Sheets (SDS)',
    videoUrl: 'https://www.youtube.com/watch?v=z8UYTNRLu80',
    duration: 480,
    isFreePreview: true,
    employeeCount: 225,
    notes:
      'Safety Data Sheets (SDS) are standardized documents that provide comprehensive information about chemical hazards, safe handling, storage, and emergency measures. They are a critical resource for workplace chemical safety.\n\nThe Globally Harmonized System (GHS) standardizes SDS format into 16 sections: identification, hazard identification, composition, first aid measures, firefighting measures, accidental release measures, handling and storage, exposure controls/PPE, physical and chemical properties, stability and reactivity, toxicological information, ecological information, disposal considerations, transport information, regulatory information, and other information.\n\nSDS must be readily accessible to all employees who work with or near hazardous chemicals. This includes keeping physical copies in accessible locations and maintaining digital copies that can be accessed without internet.\n\nKey sections for daily use include Section 2 (hazard identification) for understanding risks, Section 4 (first aid measures) for emergency response, Section 7 (handling and storage) for safe practices, and Section 8 (exposure controls/PPE) for required protective equipment.\n\nGHS pictograms provide quick visual identification of hazards. Common pictograms include flame (flammable), skull and crossbones (toxic), corrosion (corrosive), health hazard (carcinogen/sensitizer), exclamation mark (irritant), and environment (environmental hazard).\n\nBefore using any chemical, read the SDS, understand the hazards, verify appropriate PPE is available, and ensure proper ventilation and emergency equipment are in place.',
    keyPoints: [
      'SDS follow a standardized 16-section GHS format',
      'SDS must be readily accessible to all employees working with hazardous chemicals',
      'Key sections for daily use: hazard identification, first aid, handling, and PPE',
      'GHS pictograms provide quick visual hazard identification',
    ],
    proTip:
      'Create a quick-reference card summarizing the key hazards and PPE requirements for the chemicals most commonly used in your area.',
    resources: [
      {
        type: 'guide',
        title: 'OSHA Hazard Communication',
        description: 'OSHA guidance on hazard communication standard and SDS requirements.',
        url: 'https://www.osha.gov/hazcom',
      },
    ],
  },
  {
    id: 'cs-02-chemical-handling',
    title: 'Safe Chemical Handling Procedures',
    videoUrl: 'https://www.youtube.com/watch?v=4aYbK1mSHXc',
    duration: 540,
    employeeCount: 220,
    notes:
      'Safe chemical handling requires understanding hazards, following procedures, using appropriate PPE, and maintaining awareness throughout the handling process.\n\nBefore handling any chemical: read the SDS, verify the chemical identity, check expiration dates, inspect containers for damage, ensure proper PPE is available, verify ventilation is adequate, and know the emergency procedures.\n\nIncompatible chemicals must be stored separately to prevent dangerous reactions. Common incompatibilities include acids and bases, oxidizers and flammables, and water-reactive substances and aqueous solutions. Storage areas should be organized with clear labeling and segregation.\n\nSpill response requires knowing the specific procedures for each chemical type. Small spills may be containable with absorbent materials, while large spills require evacuation and professional hazmat response. Never clean up a spill without knowing the chemical and its hazards.\n\nEngineering controls such as fume hoods, local exhaust ventilation, and closed systems reduce exposure at the source and are preferred over PPE alone.\n\nProper waste disposal is essential. Chemical waste must be segregated, labeled, and disposed of according to regulations. Never pour chemicals down drains unless specifically permitted. Contact your EHS department for proper disposal procedures.\n\nDecontamination procedures after handling hazardous chemicals include removing PPE in the correct order, washing hands and exposed skin, and showering if required by the SDS.',
    keyPoints: [
      'Always read the SDS and verify the chemical identity before handling',
      'Incompatible chemicals must be stored separately to prevent dangerous reactions',
      'Engineering controls are preferred over PPE alone for reducing exposure',
      'Chemical waste must be segregated, labeled, and disposed of per regulations',
    ],
    proTip:
      'Label all secondary containers immediately when transferring chemicals. Unlabeled containers are one of the most common causes of chemical incidents.',
    resources: [
      {
        type: 'guide',
        title: 'OSHA Chemical Handling Standards',
        description: 'OSHA standards for safe handling of hazardous chemicals.',
        url: 'https://www.osha.gov/chemical-hazards',
      },
    ],
  },
  {
    id: 'cs-03-hazmat-transport',
    title: 'Hazardous Materials Transportation',
    videoUrl: 'https://www.youtube.com/watch?v=T0xn38nYSig',
    duration: 420,
    employeeCount: 215,
    notes:
      'Transporting hazardous materials is regulated by multiple agencies including DOT (Department of Transportation), IATA (International Air Transport Association), and IMDG (International Maritime Dangerous Goods Code).\n\nProper classification is the first step. Hazardous materials are divided into nine classes: explosives, gases, flammable liquids, flammable solids, oxidizers, toxic substances, radioactive materials, corrosives, and miscellaneous dangerous goods.\n\nPackaging must meet DOT specifications and UN performance standards. Each package must be properly marked with the proper shipping name, identification number, hazard labels, and UN specification marks.\n\nShipping papers (bills of lading, air waybills) must accompany all hazardous material shipments and include the proper shipping name, hazard class, UN number, packing group, and emergency response information.\n\nPlacarding requirements depend on the quantity and hazard class of materials being transported. Vehicles carrying hazardous materials must display the appropriate hazard class placards on all four sides.\n\nTraining is mandatory for all employees who handle, package, or ship hazardous materials. Training must cover general awareness, function-specific skills, safety training, security awareness, and driver training for highway transport.\n\nIncident reporting is required for any release of hazardous materials during transportation. The National Response Center must be notified for releases exceeding reportable quantities.',
    keyPoints: [
      'Hazardous materials are classified into nine DOT classes',
      'Packages require proper shipping name, UN number, hazard labels, and specification marks',
      'Shipping papers must accompany all hazmat shipments',
      'Training is mandatory for all employees handling hazardous materials',
    ],
    proTip:
      'Conduct annual hazmat training refresher courses and maintain training records. DOT auditors will request training documentation during inspections.',
    resources: [
      {
        type: 'guide',
        title: 'DOT Hazardous Materials Regulations',
        description: 'US Department of Transportation hazmat regulations.',
        url: 'https://www.phmsa.dot.gov/hazardous-materials',
      },
    ],
  },
  // ── Course 10: Insider Trading Prevention ────────────────────────────
  {
    id: 'it-01-understanding-insider-trading',
    title: 'Understanding Insider Trading',
    videoUrl: 'https://www.youtube.com/watch?v=pFCWl3RBDWA',
    duration: 600,
    isFreePreview: true,
    employeeCount: 175,
    notes:
      'Insider trading is the buying or selling of securities based on material, nonpublic information. It is illegal under securities laws and can result in severe criminal and civil penalties.\n\nMaterial information is information that a reasonable investor would consider important in making an investment decision. This includes earnings reports, mergers and acquisitions, significant contracts, regulatory approvals, management changes, and financial difficulties.\n\nNonpublic information is information that has not been disseminated to the general public through recognized channels such as press releases, SEC filings, or news services.\n\nInsiders include corporate officers, directors, and employees, as well as anyone who receives material nonpublic information from an insider (known as a tippee). The obligation to not trade or tip extends to family members, friends, and business associates.\n\nTrading windows are designated periods when insiders may trade. They typically open after earnings announcements and close two to four weeks before the next earnings announcement. All trades during open windows must be pre-cleared and reported.\n\nThe penalties for insider trading are severe: criminal fines up to $5 million for individuals and $25 million for entities, imprisonment up to 20 years, civil penalties up to three times the profit gained or loss avoided, and permanent career consequences.\n\nThe SEC uses sophisticated surveillance techniques including market analysis, tip monitoring, and whistleblower incentives to detect insider trading.',
    keyPoints: [
      'Insider trading involves trading on material, nonpublic information',
      'Material information includes earnings, mergers, contracts, and management changes',
      'The prohibition extends to tippees who receive and trade on inside information',
      'Penalties include fines up to $5 million and imprisonment up to 20 years',
    ],
    proTip:
      'When in doubt about whether information is material or nonpublic, do not trade and consult your compliance department. The risk is never worth the potential gain.',
    resources: [
      {
        type: 'guide',
        title: 'SEC Insider Trading Rules',
        description: 'Securities and Exchange Commission insider trading guidance.',
        url: 'https://www.sec.gov/answers/insider-trading',
      },
    ],
  },
  {
    id: 'it-02-trading-windows-preclearance',
    title: 'Trading Windows and Pre-Clearance',
    videoUrl: 'https://www.youtube.com/watch?v=RfF2gH5y_cQ',
    duration: 480,
    employeeCount: 170,
    notes:
      'Trading windows define the periods when insiders may trade company securities. They are designed to prevent trading during blackout periods when material nonpublic information is likely to exist.\n\nThe standard trading window opens after the public release of quarterly or annual earnings and closes two to four weeks before the next earnings announcement. Additional blackout periods may apply around significant corporate events.\n\nPre-clearance requires insiders to obtain written approval from the compliance department or designated officer before executing any trade. Pre-clearance requests must disclose the proposed transaction details and confirm no awareness of material nonpublic information.\n\nPre-clearance is typically valid for a limited period, often 48 hours, and must be renewed if the trade is not executed within that window. Changes to the proposed trade require new pre-clearance.\n\nSection 16 reporting requirements apply to officers, directors, and 10% shareholders. They must file Form 3 (initial statement), Form 4 (changes in ownership), and Form 5 (annual summary) with the SEC. These filings are publicly available.\n\n10b5-1 plans are pre-established trading plans that allow insiders to trade at predetermined times and prices. They must be adopted in good faith during an open trading window, cannot be modified during a blackout, and must include cooling-off periods.\n\nGifts of company securities by insiders are treated as transactions and are subject to the same trading window and pre-clearance requirements.',
    keyPoints: [
      'Trading windows typically open after earnings releases and close before the next earnings',
      'Pre-clearance must be obtained in writing and is valid for a limited period',
      'Section 16 filings (Forms 3, 4, 5) are publicly available and must be timely filed',
      '10b5-1 plans require cooling-off periods and cannot be modified during blackouts',
    ],
    proTip:
      'Set calendar reminders for trading window open and close dates at the beginning of each year. Missing a pre-clearance deadline because of a calendar oversight is preventable.',
    resources: [
      {
        type: 'guide',
        title: 'SEC Rule 10b5-1 Guidance',
        description: 'SEC guidance on pre-arranged trading plans.',
        url: 'https://www.sec.gov/rules/2023/11/insider-trading-arrangements-and-related-disclosures',
      },
    ],
  },
  {
    id: 'it-03-reporting-obligations',
    title: 'Reporting and Compliance Obligations',
    videoUrl: 'https://www.youtube.com/watch?v=K63YzPkxSPw',
    duration: 420,
    employeeCount: 168,
    notes:
      'Insider trading compliance requires ongoing reporting, training, and awareness. Every employee with access to material nonpublic information has obligations under securities laws.\n\nAnnual certification is required from all designated insiders, confirming understanding of insider trading policies, compliance with trading restrictions, and absence of material nonpublic information at the time of any trades.\n\nPersonal trading reports must be submitted periodically as required by company policy. These reports disclose all securities transactions, including those by family members and controlled entities.\n\nInformation barriers (Chinese walls) separate departments with access to material nonpublic information. Employees behind the wall must not communicate material information to those outside the wall without proper authorization and need-to-know basis.\n\nIf you become aware of material nonpublic information, you must not trade, tip, or recommend that anyone else trade. You must also maintain confidentiality and report the situation to your compliance officer.\n\nWhistleblower protections and incentives encourage reporting of insider trading. The SEC Whistleblower Program provides monetary rewards of 10-30% of sanctions collected and prohibits retaliation against whistleblowers.\n\nRecord retention requirements mandate that trading records, pre-clearance documents, certifications, and communications be retained for the periods specified by regulation, typically five to seven years.\n\nCompliance programs must be regularly tested and updated to reflect changes in regulations, corporate structure, and business activities.',
    keyPoints: [
      'Annual certification confirms understanding and compliance with insider trading policies',
      'Information barriers separate departments with access to material nonpublic information',
      'If you become aware of MNPI, do not trade, tip, or recommend others trade',
      'SEC Whistleblower Program provides 10-30% rewards and anti-retaliation protections',
    ],
    proTip:
      'When uncertain whether information is material, err on the side of caution and do not trade. The compliance team can help assess situations confidentially.',
    resources: [
      {
        type: 'guide',
        title: 'SEC Whistleblower Program',
        description: 'SEC guidance on the whistleblower program and protections.',
        url: 'https://www.sec.gov/whistleblower',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// TRAINING PROGRAMS
// ---------------------------------------------------------------------------

interface ProgramInput {
  id: string
  title: string
  summary: string
  level: 'beginner' | 'intermediate' | 'advanced'
  requiredBy: string
  isPopular: boolean
  employeeCount: number
  trainerId: string
  categoryId: string
  learningOutcomes: { icon: string; title: string; description: string }[]
  modules: { title: string; summary: string; lessonIds: string[] }[]
}

function makeProgram(input: ProgramInput): NdjsonDoc {
  return {
    _id: `program-${input.id}`,
    _type: 'trainingProgram',
    title: input.title,
    slug: { _type: 'slug', current: input.id },
    summary: input.summary,
    level: input.level,
    requiredBy: input.requiredBy,
    isPopular: input.isPopular,
    employeeCount: input.employeeCount,
    trainer: { _type: 'reference', _ref: input.trainerId },
    category: { _type: 'reference', _ref: input.categoryId },
    learningOutcomes: input.learningOutcomes.map((lo, i) => ({
      _key: `lo-${input.id}-${i}`,
      icon: lo.icon,
      title: lo.title,
      description: lo.description,
    })),
    modules: input.modules.map((mod, i) => ({
      _key: `mod-${input.id}-${i}`,
      title: mod.title,
      summary: mod.summary,
      lessons: mod.lessonIds.map((lid) => ({
        _type: 'reference',
        _ref: `lesson-${lid}`,
      })),
    })),
  }
}

const programs: ProgramInput[] = [
  {
    id: 'data-privacy-fundamentals',
    title: 'Data Privacy Fundamentals',
    summary:
      'Master the core principles of data protection and privacy regulation. Learn how to handle personal data responsibly, understand data subject rights, and respond to breaches effectively.',
    level: 'beginner',
    requiredBy: '2026-12-31',
    isPopular: true,
    employeeCount: 342,
    trainerId: 'trainer-sarah-chen',
    categoryId: 'category-data-privacy',
    learningOutcomes: [
      { icon: '🔒', title: 'Identify Personal Data', description: 'Recognize what constitutes personal and sensitive data under GDPR and other regulations.' },
      { icon: '⚖️', title: 'Apply Processing Principles', description: 'Apply the seven data processing principles to daily data handling activities.' },
      { icon: '📋', title: 'Fulfill Data Subject Requests', description: 'Process data subject access requests and other rights within required timeframes.' },
      { icon: '🚨', title: 'Respond to Breaches', description: 'Follow breach notification procedures within the 72-hour window.' },
    ],
    modules: [
      {
        title: 'Introduction to Personal Data',
        summary: 'What personal data is and why it matters.',
        lessonIds: [
          'dp-01-understanding-personal-data',
          'dp-02-data-processing-principles',
        ],
      },
      {
        title: 'Data Subject Rights and Requests',
        summary: 'Handling rights requests and responding to individuals.',
        lessonIds: [
          'dp-03-data-subject-rights',
          'dp-04-data-breach-notification',
        ],
      },
    ],
  },
  {
    id: 'workplace-safety-essentials',
    title: 'Workplace Safety Essentials',
    summary:
      'Build a safe working environment through hazard identification, emergency preparedness, and ergonomic best practices. Covers OSHA requirements and practical safety measures.',
    level: 'beginner',
    requiredBy: '2026-09-30',
    isPopular: true,
    employeeCount: 456,
    trainerId: 'trainer-james-rodriguez',
    categoryId: 'category-workplace-safety',
    learningOutcomes: [
      { icon: '🔍', title: 'Identify Hazards', description: 'Recognize common workplace hazards and assess associated risks.' },
      { icon: '🏃', title: 'Emergency Response', description: 'Follow emergency procedures and participate effectively in evacuation drills.' },
      { icon: '🦺', title: 'Use PPE Correctly', description: 'Select, use, and maintain personal protective equipment appropriately.' },
      { icon: '🪑', title: 'Ergonomic Setup', description: 'Configure workstations to prevent musculoskeletal injuries.' },
    ],
    modules: [
      {
        title: 'Hazard Identification and PPE',
        summary: 'Recognizing hazards and protecting yourself with appropriate PPE.',
        lessonIds: [
          'ws-01-hazard-identification',
          'ws-03-personal-protective-equipment',
        ],
      },
      {
        title: 'Emergency Preparedness and Ergonomics',
        summary: 'Being ready for emergencies and setting up healthy workstations.',
        lessonIds: [
          'ws-02-emergency-procedures',
          'ws-04-ergonomics-workplace',
        ],
      },
    ],
  },
  {
    id: 'financial-compliance-aml',
    title: 'Financial Compliance and AML',
    summary:
      'Comprehensive training on anti-money laundering regulations, KYC procedures, sanctions screening, and fraud prevention. Essential for financial services and regulated industries.',
    level: 'intermediate',
    requiredBy: '2026-10-15',
    isPopular: true,
    employeeCount: 280,
    trainerId: 'trainer-emily-watson',
    categoryId: 'category-financial-compliance',
    learningOutcomes: [
      { icon: '💰', title: 'Recognize Money Laundering', description: 'Identify the stages of money laundering and common indicators.' },
      { icon: '🪪', title: 'Apply KYC Procedures', description: 'Conduct customer due diligence and enhanced due diligence for high-risk clients.' },
      { icon: '🌐', title: 'Screen for Sanctions', description: 'Screen transactions against OFAC, EU, and UN sanctions lists.' },
      { icon: '🕵️', title: 'Detect and Prevent Fraud', description: 'Recognize fraud indicators and apply preventive controls.' },
    ],
    modules: [
      {
        title: 'AML and KYC Fundamentals',
        summary: 'Understanding money laundering and verifying customer identities.',
        lessonIds: [
          'fc-01-anti-money-laundering',
          'fc-02-know-your-customer',
        ],
      },
      {
        title: 'Sanctions and Fraud Prevention',
        summary: 'Screening for sanctions and preventing corporate fraud.',
        lessonIds: [
          'fc-03-sanctions-compliance',
          'fc-04-fraud-prevention',
        ],
      },
    ],
  },
  {
    id: 'preventing-workplace-harassment',
    title: 'Preventing Workplace Harassment',
    summary:
      'Understand what constitutes harassment, learn bystander intervention strategies, and know how to report and investigate incidents. Creates a respectful and safe workplace for all.',
    level: 'beginner',
    requiredBy: '2026-08-31',
    isPopular: true,
    employeeCount: 520,
    trainerId: 'trainer-michael-okonkwo',
    categoryId: 'category-ethics-conduct',
    learningOutcomes: [
      { icon: '🚫', title: 'Recognize Harassment', description: 'Identify different forms of harassment including verbal, physical, and cyber.' },
      { icon: '🤝', title: 'Intervene as Bystander', description: 'Apply the Five Ds of bystander intervention to prevent harassment.' },
      { icon: '📝', title: 'Report Effectively', description: 'Navigate reporting channels and understand investigation procedures.' },
      { icon: '🛡️', title: 'Know Your Protections', description: 'Understand anti-retaliation protections and support mechanisms.' },
    ],
    modules: [
      {
        title: 'Understanding Harassment',
        summary: 'Recognizing harassment and its impact on individuals and organizations.',
        lessonIds: [
          'wh-01-understanding-harassment',
          'wh-02-bystander-intervention',
        ],
      },
      {
        title: 'Reporting and Investigation',
        summary: 'How to report incidents and participate in investigations.',
        lessonIds: [
          'wh-03-reporting-investigation',
        ],
      },
    ],
  },
  {
    id: 'cybersecurity-awareness',
    title: 'Cybersecurity Awareness',
    summary:
      'Protect yourself and the organization from cyber threats. Learn to recognize phishing attacks, practice strong password hygiene, protect data, and respond to security incidents.',
    level: 'beginner',
    requiredBy: '2026-11-30',
    isPopular: false,
    employeeCount: 490,
    trainerId: 'trainer-priya-sharma',
    categoryId: 'category-cybersecurity',
    learningOutcomes: [
      { icon: '🎣', title: 'Spot Phishing', description: 'Identify phishing emails, smishing, vishing, and social engineering attempts.' },
      { icon: '🔑', title: 'Practice Password Security', description: 'Use password managers, enable MFA, and create strong credentials.' },
      { icon: '📁', title: 'Protect Data', description: 'Classify and protect data through encryption, physical security, and safe practices.' },
      { icon: '🚨', title: 'Respond to Incidents', description: 'Recognize, report, and cooperate during security incidents.' },
    ],
    modules: [
      {
        title: 'Recognizing Cyber Threats',
        summary: 'Identifying phishing, social engineering, and credential attacks.',
        lessonIds: [
          'ca-01-phishing-prevention',
          'ca-02-password-security',
        ],
      },
      {
        title: 'Protecting and Responding',
        summary: 'Protecting data and responding to security incidents.',
        lessonIds: [
          'ca-03-data-protection-practices',
          'ca-04-incident-response',
        ],
      },
    ],
  },
  {
    id: 'anti-corruption-bribery',
    title: 'Anti-Corruption and Bribery Prevention',
    summary:
      'Navigate anti-corruption regulations including FCPA and UK Bribery Act. Learn to manage gifts, entertainment, and conflicts of interest in compliance with global standards.',
    level: 'intermediate',
    requiredBy: '2026-10-31',
    isPopular: false,
    employeeCount: 195,
    trainerId: 'trainer-michael-okonkwo',
    categoryId: 'category-ethics-conduct',
    learningOutcomes: [
      { icon: '⚖️', title: 'Understand FCPA', description: 'Know the requirements of the Foreign Corrupt Practices Act and UK Bribery Act.' },
      { icon: '🎁', title: 'Manage Gifts and Entertainment', description: 'Apply thresholds and documentation requirements for gifts and hospitality.' },
      { icon: '🔄', title: 'Identify Conflicts of Interest', description: 'Recognize and disclose actual, potential, and perceived conflicts.' },
      { icon: '📋', title: 'Apply Anti-Corruption Controls', description: 'Implement due diligence and compliance controls for third parties.' },
    ],
    modules: [
      {
        title: 'Anti-Corruption Regulations',
        summary: 'Understanding FCPA, UK Bribery Act, and global anti-corruption standards.',
        lessonIds: [
          'ac-01-foreign-corruption-practices',
          'ac-02-gifts-entertainment',
        ],
      },
      {
        title: 'Conflict of Interest Management',
        summary: 'Identifying and managing conflicts of interest in business relationships.',
        lessonIds: [
          'ac-03-conflict-of-interest',
        ],
      },
    ],
  },
  {
    id: 'diversity-equity-inclusion',
    title: 'Diversity, Equity, and Inclusion',
    summary:
      'Build an inclusive workplace by understanding unconscious bias, practicing inclusive leadership, and ensuring equity and accessibility for all employees.',
    level: 'beginner',
    requiredBy: '2026-12-31',
    isPopular: false,
    employeeCount: 380,
    trainerId: 'trainer-michael-okonkwo',
    categoryId: 'category-ethics-conduct',
    learningOutcomes: [
      { icon: '🧠', title: 'Recognize Unconscious Bias', description: 'Understand how cognitive biases affect decisions and interactions.' },
      { icon: '👥', title: 'Practice Inclusive Leadership', description: 'Apply the six traits of inclusive leaders to build stronger teams.' },
      { icon: '♿', title: 'Ensure Accessibility', description: 'Create accessible documents, communications, and workspaces.' },
      { icon: '📊', title: 'Promote Equity', description: 'Distinguish between equality and equity and apply equity-focused practices.' },
    ],
    modules: [
      {
        title: 'Understanding Bias',
        summary: 'Recognizing and mitigating unconscious bias in the workplace.',
        lessonIds: [
          'de-01-unconscious-bias',
          'de-02-inclusive-leadership',
        ],
      },
      {
        title: 'Equity and Accessibility',
        summary: 'Creating equitable and accessible environments for all employees.',
        lessonIds: [
          'de-03-equity-accessibility',
        ],
      },
    ],
  },
  {
    id: 'gdpr-deep-dive',
    title: 'GDPR Compliance Deep Dive',
    summary:
      'Comprehensive GDPR training covering principles, the DPO role, and international data transfers. Designed for teams handling European personal data.',
    level: 'advanced',
    requiredBy: '2026-11-15',
    isPopular: false,
    employeeCount: 310,
    trainerId: 'trainer-sarah-chen',
    categoryId: 'category-data-privacy',
    learningOutcomes: [
      { icon: '🇪🇺', title: 'Master GDPR Principles', description: 'Apply GDPR principles and understand the regulation\'s extraterritorial scope.' },
      { icon: '👤', title: 'Support DPO Functions', description: 'Understand the DPO role and how to work with the data protection officer.' },
      { icon: '✈️', title: 'Manage International Transfers', description: 'Navigate SCCs, adequacy decisions, and transfer impact assessments.' },
      { icon: '📊', title: 'Conduct DPIAs', description: 'Identify when DPIAs are required and how to conduct them effectively.' },
    ],
    modules: [
      {
        title: 'GDPR Fundamentals',
        summary: 'Core GDPR principles, scope, and lawful bases for processing.',
        lessonIds: [
          'gd-01-gdpr-overview',
          'gd-02-data-protection-officer',
        ],
      },
      {
        title: 'International Data Transfers',
        summary: 'Transferring data outside the EEA with appropriate safeguards.',
        lessonIds: [
          'gd-03-international-data-transfers',
        ],
      },
    ],
  },
  {
    id: 'chemical-safety-hazmat',
    title: 'Chemical Safety and Hazmat Handling',
    summary:
      'Safe handling, storage, and transportation of hazardous chemicals. Covers SDS interpretation, chemical handling procedures, and DOT hazmat regulations.',
    level: 'intermediate',
    requiredBy: '2026-10-31',
    isPopular: false,
    employeeCount: 225,
    trainerId: 'trainer-david-kim',
    categoryId: 'category-workplace-safety',
    learningOutcomes: [
      { icon: '📑', title: 'Read Safety Data Sheets', description: 'Interpret all 16 sections of a GHS Safety Data Sheet.' },
      { icon: '🧪', title: 'Handle Chemicals Safely', description: 'Follow proper procedures for chemical handling, storage, and spill response.' },
      { icon: '🚛', title: 'Transport Hazmat', description: 'Comply with DOT regulations for hazardous materials transportation.' },
      { icon: '♻️', title: 'Dispose of Chemical Waste', description: 'Segregate, label, and dispose of chemical waste according to regulations.' },
    ],
    modules: [
      {
        title: 'Chemical Handling Fundamentals',
        summary: 'Understanding SDS, safe handling, and chemical storage.',
        lessonIds: [
          'cs-01-safety-data-sheets',
          'cs-02-chemical-handling',
        ],
      },
      {
        title: 'Hazardous Materials Transportation',
        summary: 'DOT requirements for shipping and transporting hazardous materials.',
        lessonIds: [
          'cs-03-hazmat-transport',
        ],
      },
    ],
  },
  {
    id: 'insider-trading-prevention',
    title: 'Insider Trading Prevention',
    summary:
      'Prevent insider trading by understanding material nonpublic information, trading windows, pre-clearance requirements, and reporting obligations.',
    level: 'advanced',
    requiredBy: '2026-12-15',
    isPopular: false,
    employeeCount: 175,
    trainerId: 'trainer-emily-watson',
    categoryId: 'category-financial-compliance',
    learningOutcomes: [
      { icon: '📈', title: 'Identify MNPI', description: 'Recognize material nonpublic information and the obligations it creates.' },
      { icon: '📅', title: 'Follow Trading Windows', description: 'Comply with trading windows, pre-clearance, and Section 16 reporting.' },
      { icon: '📢', title: 'Report Obligations', description: 'Understand annual certification, personal trading reports, and whistleblower protections.' },
      { icon: '🔒', title: 'Maintain Information Barriers', description: 'Respect Chinese walls and need-to-know restrictions.' },
    ],
    modules: [
      {
        title: 'Insider Trading Basics',
        summary: 'Understanding what insider trading is and why it matters.',
        lessonIds: [
          'it-01-understanding-insider-trading',
          'it-02-trading-windows-preclearance',
        ],
      },
      {
        title: 'Compliance and Reporting',
        summary: 'Reporting obligations and maintaining a compliant trading program.',
        lessonIds: [
          'it-03-reporting-obligations',
        ],
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// VIDEO DOCUMENTS
// ---------------------------------------------------------------------------

function makeVideo(lessonId: string, videoUrl: string, duration: number): NdjsonDoc {
  const videoId = videoUrl.includes('watch?v=')
    ? videoUrl.split('watch?v=')[1]?.split('&')[0] ?? lessonId
    : lessonId

  const chapters = Array.from({ length: Math.ceil(duration / 120) }, (_, i) => ({
    startSeconds: i * 120,
    label: `Section ${i + 1}`,
  }))

  const chunks = Array.from({ length: Math.ceil(duration / 30) }, (_, i) => ({
    startSeconds: i * 30,
    text: `[Transcript chunk for ${lessonId} at ${i * 30}s]`,
  }))

  return {
    _id: `video-${lessonId}`,
    _type: 'video',
    videoId,
    videoUrl,
    chapters,
    chunks,
  }
}

// ---------------------------------------------------------------------------
// GENERATE NDJSON
// ---------------------------------------------------------------------------

const lines: string[] = []

// 1. Categories
for (const cat of categories) {
  lines.push(ndjson(cat))
}

// 2. Trainers
for (const trainer of trainers) {
  lines.push(ndjson(trainer))
}

// 3. Lessons
for (const lesson of lessons) {
  lines.push(ndjson(makeLesson(lesson)))
}

// 4. Training Programs
for (const program of programs) {
  lines.push(ndjson(makeProgram(program)))
}

// 5. Video documents
for (const lesson of lessons) {
  lines.push(ndjson(makeVideo(lesson.id, lesson.videoUrl, lesson.duration)))
}

// Output
process.stdout.write(lines.join('\n') + '\n')
