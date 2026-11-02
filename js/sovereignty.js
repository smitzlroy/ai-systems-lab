window.SOVEREIGNTY = {
  reviewed: "2 November 2026",
  scope: "An EMEA orientation with deeper coverage of twelve country or regional groups. Not every EMEA country, sector, procurement rule or implementing measure is covered. EU/EEA is a starting point, not a substitute for individual national checks.",
  lenses: [
    ["Data residency", "Where information is stored or processed. Ask separately about normal operation, backups, logs, support and recovery."],
    ["Privacy", "Whether information about people is used lawfully, fairly and for a justified purpose. Keeping it nearby does not make an inappropriate use lawful."],
    ["Sovereignty", "Who can make decisions, exercise authority and keep the service running. It includes legal exposure, operational control and the ability to change supplier."],
    ["Compliance", "Meeting the particular obligations that apply to this organisation, activity and service. It requires evidence, not just a location or a supplier's promise."]
  ],
  glossary: [
    ["Jurisdiction", "The legal authority that may apply to an organisation, activity or dispute. It is not necessarily the same place as the server."],
    ["Localisation", "A requirement to keep specified data or activities within a defined territory. Its scope may be narrower than 'all data'."],
    ["Controller / processor", "The controller decides the purposes and means of personal-data processing. A processor handles it on the controller's behalf."],
    ["Subprocessor", "Another organisation a processor engages to help process personal data. Its role and access belong in the assessment."],
    ["Adequacy", "A formal recognition, under a particular regime, that a destination provides the required level of protection. Check the current decision and its scope."],
    ["Transfer safeguards", "Measures such as approved contractual clauses that can support an eligible cross-border transfer. The conditions differ by legal regime."],
    ["Impact assessment", "A structured review of a proposed activity's risks and how they will be addressed. Some laws require it in specified circumstances."],
    ["Attestation / certification / qualification", "Different assurance routes. Ask who assessed what, against which requirements, for which scope and period; do not treat the words as interchangeable."],
    ["Open weights", "Access to a model's learned parameters under a particular licence. Not an automatic right to do anything with the model."],
    ["Disconnected operation", "Running without a live connection to an external service or network. The precise boundary, maintenance process and remaining dependencies still need checking."],
    ["Exit plan", "A practical, contractual plan to move or stop a service without losing essential information, rights or continuity."]
  ],
  lessons: [
    {
      title: "Start with the decision, not the country flag",
      time: "5 min",
      point: "A useful sovereignty requirement describes a decision you need to retain, a dependency you cannot accept, or an outcome you must protect.",
      paragraphs: [
        "A service can store data locally while overseas staff administer it. A locally owned company can depend on foreign software or remote support. A model you can download can still have licence restrictions. These are different questions, not contradictions.",
        "Separate legal requirements from your organisation's own risk appetite. A law might permit a transfer with safeguards, while a public-sector contract demands local operations. Both can matter, but they have different origins and different ways to demonstrate compliance.",
        "Avoid asking whether a supplier is simply sovereign or not. Ask whether a named service, in a named deployment, preserves the controls needed for this particular use. The same supplier may have several very different answers."
      ],
      example: "Fictional example: a public museum's opening-hours assistant and a hospital's patient-record assistant need different evidence, even when both use the same model.",
      task: "Write three sentences: the service's purpose; the decisions you must retain; the consequence if a supplier becomes unavailable.",
      sources: [["European Commission: proposed sovereignty assessment framework", "https://digital-strategy.ec.europa.eu/en/library/proposal-cloud-and-ai-development-act-cada"]]
    },
    {
      title: "Understand who is accountable",
      time: "6 min",
      point: "You can outsource a service without outsourcing every responsibility.",
      paragraphs: [
        "In data-protection law, a controller decides why and how personal data is used; a processor handles it on the controller's behalf. A subprocessor is another organisation brought into that processing chain. The real activity determines the role, not just the label in a presentation.",
        "AI laws use another set of roles. Under the EU AI Act, a provider develops or places an AI system on the market under its name; a deployer uses it under its authority. A cloud host, model developer and application provider may be different organisations. Changing a system or its intended purpose can change the allocation of duties.",
        "Make the chain visible in ordinary language: who supplies the model, who operates the service, who approves its use, who handles complaints, and who can stop it? A list of technology brands does not answer these questions."
      ],
      example: "Fictional example: a software firm builds a hiring tool on a third-party model. Its customer uses the tool. Buying a compliant cloud service does not settle the tool provider's or employer's duties.",
      task: "Draw a five-box responsibility chain. Put an organisation and an accountable role in every box, then mark the unanswered questions.",
      sources: [["GDPR: definitions and controller/processor duties", "https://eur-lex.europa.eu/eli/reg/2016/679/oj"], ["AI Act: roles and risk-based obligations", "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"]]
    },
    {
      title: "Read the rules as layers",
      time: "7 min",
      point: "There is no single EMEA Sovereign AI Act and no universal sovereignty certificate.",
      paragraphs: [
        "Start with personal-data rules: lawful use, individual rights, retention and transfers. Add AI-specific rules based on the intended use and your role. Then check cybersecurity and resilience requirements, sector rules such as finance or health, and public procurement conditions.",
        "A regulation, a national act, regulator guidance, a contract and a certification scheme are not interchangeable. A directive such as NIS2 needs national implementation. A standard can become important because a contract or applicable rule calls for it, even when the standard itself is voluntary.",
        "An act can be enacted before every provision applies. A political agreement is not the same thing as an operative amendment. A government AI strategy expresses direction, not blanket permission to process data. Always record the source, status, scope and date of your interpretation."
      ],
      example: "Fictional example: a financial institution may need privacy safeguards, AI-use assessment and ICT resilience evidence. An ISO certificate does not replace any of those applicability decisions.",
      task: "For one guide entry, classify each source as law, implementing rules, guidance, qualification or proposal. Explain which decision it changes.",
      sources: [["NIS2: EU directive", "https://eur-lex.europa.eu/eli/dir/2022/2555/oj"], ["DORA: financial-sector resilience", "https://eur-lex.europa.eu/eli/reg/2022/2554/oj"], ["AI Act: application updates", "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"]]
    },
    {
      title: "Follow access, not just storage",
      time: "6 min",
      point: "A local data centre is one part of the answer. People, contracts and onward access are the other parts.",
      paragraphs: [
        "Follow the full information journey: the user's question, the documents used to answer it, the answer itself, diagnostic records, backups and support tickets. Ask who may receive or access each item, from where, for what purpose and for how long. Remote access can engage transfer rules even when the primary database stays local; the precise legal test depends on the regime and parties.",
        "An adequacy decision recognises a destination's protection under a particular legal regime. Standard contractual clauses are approved contractual safeguards for eligible transfers. Neither is a substitute for checking scope, onward transfers and any required risk assessment. EU, UK, Turkish and other mechanisms are not automatically interchangeable.",
        "Jurisdiction can follow an organisation or legal relationship as well as a server. The US CLOUD Act is one example of a cross-border lawful-access framework, not proof that every request succeeds or that every US-linked service is prohibited. Local suppliers also face lawful demands. Ask counsel about the actual entities, remedies and conflict-of-law exposure.",
        "Holding an encryption key gives a form of control over access, but its effect depends on how the service works. Do not equate 'customer-managed keys' with proof that no operator can ever read information. Ask what is protected during use, who can authorise access and what happens in an emergency."
      ],
      example: "Fictional example: processing stays in one country, but a troubleshooting ticket contains a customer's prompt and is handled abroad. The support path belongs in the assessment.",
      task: "Ask a supplier to describe its support and recovery paths without using the phrase 'data stays here'. Request a contractual answer, including exceptions.",
      sources: [["ICO: international transfers", "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/"], ["US Department of Justice: CLOUD Act materials", "https://www.justice.gov/criminal/cloud-act-resources"], ["GDPR: international transfers", "https://eur-lex.europa.eu/eli/reg/2016/679/oj"]]
    },
    {
      title: "Choose the control you can actually operate",
      time: "6 min",
      point: "More local responsibility can increase autonomy and increase the work you must do.",
      paragraphs: [
        "A shared managed service may offer speed, specialist operations and lower entry cost. A dedicated service can reserve capacity or strengthen isolation, but dedication alone says nothing about applicable law or operator access.",
        "Customer-operated or partner-operated private environments may give stronger authority over people, updates and access. Disconnected operation can reduce dependence on live external services. It also requires plans for software updates, security fixes, licence rights, support, capacity and recovery.",
        "Open weights mean model parameters are available under a particular licence. They do not automatically mean unrestricted open-source rights, ownership of the original model, access to training data, or legal compliance. Check modification, commercial use, redistribution and termination rights for the exact version.",
        "Autonomy also needs people. A deployment is not meaningfully independent if only the original supplier knows how to restore it. Include skills transfer, documentation, usable exports and a rehearsed exit in the commercial discussion."
      ],
      example: "Fictional example: a team can export its documents but cannot recover the evaluation set or reproduce its approved workflows. It has data portability, but incomplete service portability.",
      task: "Compare two deployment choices using four headings: decisions retained, responsibilities accepted, recurring cost and ability to leave.",
      sources: [["Mistral: published sovereignty position", "https://mistral.ai/sovereign-ai/"], ["Microsoft: public, private and partner options", "https://learn.microsoft.com/en-us/azure/azure-sovereign-clouds/microsoft-sovereign-cloud"], ["EU Data Act", "https://eur-lex.europa.eu/eli/reg/2023/2854/oj"]]
    },
    {
      title: "Turn a claim into an evidence pack",
      time: "6 min",
      point: "A good decision records what is known, what remains uncertain and who accepts the remaining risk.",
      paragraphs: [
        "Ask for the named legal supplier, service description, deployment locations, subprocessor list, permitted support access and data-use terms. Add responsibility allocation, incident obligations, audit rights, continuity arrangements and an exit plan. Ask which statements are contractual commitments rather than marketing.",
        "For a badge, request the certificate or assurance report, its issuing body, scope, validity and exclusions. Does it cover the service, region and operations you are buying? What customer responsibilities and unresolved findings remain? A supplier-wide logo is not enough.",
        "Then test a business scenario: a supplier outage, a rejected access request, a contract ending or a request to delete information. A paper promise and a successful rehearsal are different kinds of evidence. A review pack should contain both where the risk justifies it.",
        "The decision is made by accountable business, legal, privacy, security and procurement owners, not by a chatbot-generated compliance score. Record conditions and a review trigger, such as a new subprocessor, changed model, new country or changed use."
      ],
      example: "Fictional example: an assurance report covers the hosting platform but excludes the new AI service. The right next step is a scope discussion, not assuming the badge carries over.",
      task: "Prepare a one-page recommendation: purpose; applicable obligations; chosen controls; evidence; gaps; accountable owner; next review.",
      sources: [["ANSSI: qualification scope and limitations", "https://cyber.gouv.fr/enjeux-technologiques/cloud/"], ["BSI: what C5 attestation covers", "https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Empfehlungen-nach-Angriffszielen/Cloud-Computing/Kriterienkatalog-C5/C5-FAQ/kriterienkatalog-c5-faq_node.html"]]
    }
  ],
  countries: [
    {
      id: "eu", name: "EU / EEA", region: "Europe",
      hook: "Start with purpose, organisational role and national implementation, not a promise that an EU region solves everything.",
      rules: [
        { title: "GDPR - Regulation (EU) 2016/679", type: "Binding law", status: "Applicable; transfer and processing requirements are separate.", meaning: "Protects personal data through lawful processing, individual rights, accountability and safeguards for international transfers. It is not a blanket rule that all personal data must stay in the EU.", action: "Identify the controller and processors, data purpose and retention; assess the processing and any transfer route.", sources: [["GDPR text", "https://eur-lex.europa.eu/eli/reg/2016/679/oj"]] },
        { title: "AI Act - Regulation (EU) 2024/1689", type: "Binding law / phased application", status: "Prohibitions and AI-literacy duties began applying in February 2025; general-purpose AI obligations in August 2025. Check role-specific exceptions and the current timetable.", meaning: "Regulates particular AI risks and responsibilities. It does not award a general sovereign-AI status. A low-risk assistant and a system used for consequential decisions are different cases.", action: "Document intended purpose, provider/deployer roles and risk category. The Commission page discusses Omnibus-related high-risk timetable changes: verify the adopted amending text and consolidated dates before relying on a delay.", sources: [["Commission overview and timetable", "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"], ["AI Act legal text", "https://eur-lex.europa.eu/eli/reg/2024/1689/oj"]] },
        { title: "NIS2 - Directive (EU) 2022/2555", type: "Directive / national laws", status: "National implementation and entity scope must be checked.", meaning: "Sets cybersecurity risk-management and incident-reporting expectations for covered entities. The applicable national legislation and supervisor matter.", action: "Check sector, size and other inclusion rules, management accountability, supplier risk and incident responsibilities.", sources: [["NIS2 text", "https://eur-lex.europa.eu/eli/dir/2022/2555/oj"]] },
        { title: "DORA - Regulation (EU) 2022/2554", type: "Sector law", status: "Applies from 17 January 2025 to covered financial entities, with a specific framework for critical ICT third parties.", meaning: "Focuses on digital operational resilience: ICT risk, incidents, testing and third-party arrangements. It is not a cloud-provider certification.", action: "Ask how the contract, dependency register, recovery testing and exit plan support the financial entity's obligations.", sources: [["DORA text", "https://eur-lex.europa.eu/eli/reg/2022/2554/oj"]] },
        { title: "Data Act - Regulation (EU) 2023/2854", type: "Binding law / phased provisions", status: "Generally applies from 12 September 2025; some provisions have distinct dates and scope.", meaning: "Includes rules on access to certain data and switching data-processing services. Switching rights are not a guarantee that every AI workload or proprietary model can move unchanged.", action: "Discuss export formats, transition support, contractual barriers and residual dependencies; verify which switching duties apply.", sources: [["Data Act text", "https://eur-lex.europa.eu/eli/reg/2023/2854/oj"]] },
        { title: "Cyber Resilience Act - Regulation (EU) 2024/2847", type: "Product cybersecurity law", status: "Reporting obligations begin 11 September 2026; main obligations from 11 December 2027, subject to scope.", meaning: "Targets products with digital elements and relevant economic operators. It is not a universal rule for every cloud service simply because it uses software.", action: "If supplying a covered product, examine security updates, vulnerability handling and responsibilities throughout its lifecycle.", sources: [["Commission CRA overview", "https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act"]] }
      ],
      watch: "EEA relevance is not the same as automatic application on the EU date: check incorporation and local implementation for Norway, Iceland and Liechtenstein. National health, public-sector, employment and security rules add layers. The standards guide includes French, German, Spanish and Italian schemes.",
      task: "Compare a staff-policy search assistant with an AI tool that ranks job applicants. Explain why the location could stay the same while the obligations change."
    },
    {
      id: "uk", name: "United Kingdom", region: "Europe",
      hook: "Use UK sources and UK transfer mechanisms; an EU assessment is not automatically a UK assessment.",
      rules: [
        { title: "UK GDPR and Data Protection Act 2018", type: "Binding law", status: "Read the current, amended regime and ICO guidance.", meaning: "Govern personal-data use, accountability and rights. Sector and public-law obligations can also constrain the AI use case.", action: "Check lawful basis, impact assessment, automated-decision safeguards and contracts for the intended use.", sources: [["ICO: UK GDPR guidance", "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/"], ["Data Protection Act 2018", "https://www.legislation.gov.uk/ukpga/2018/12/contents"]] },
        { title: "Data (Use and Access) Act 2025", type: "Amending law", status: "Enacted; check commencement for the relevant provision.", meaning: "Changes parts of the UK data-protection framework, including automated decision-making and international-transfer rules. It does not replace the entire UK GDPR regime.", action: "Use updated ICO guidance rather than reusing a pre-2025 checklist. Separate enacted wording from when each change takes effect.", sources: [["ICO: DUAA changes", "https://ico.org.uk/about-the-ico/what-we-do/legislation-we-cover/data-use-and-access-act-2025/the-data-use-and-access-act-2025-duaa-summary-of-the-changes/data-protection/"]] },
        { title: "International-transfer safeguards", type: "Regulatory guidance / legal mechanisms", status: "Check current adequacy regulations, safeguards and the transfer risk assessment / data protection test.", meaning: "The UK IDTA and UK Addendum are mechanisms with their own conditions. An EU standard contract is not, on its own, a universal UK answer.", action: "Include overseas support and onward disclosures in the assessment; check who is responsible for making the restricted transfer.", sources: [["ICO: transfers, safeguards and assessments", "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/"]] }
      ],
      watch: "Do not infer that the EU AI Act applies domestically merely because a supplier operates in Europe. An EU market or use connection may separately matter. Financial, health, equality and public-sector rules need their own checks.",
      task: "A supplier says 'GDPR compliant'. Ask which regime, which activities, which transfer mechanism and which contractual evidence."
    },
    {
      id: "switzerland", name: "Switzerland", region: "Europe",
      hook: "Swiss law is its own regime, not an EU region setting.",
      rules: [
        { title: "Federal Act on Data Protection (FADP)", type: "Binding law", status: "The revised Act has applied since 1 September 2023.", meaning: "The Swiss regulator explicitly says existing data-protection law applies directly to AI-supported processing. Information duties, individual rights and high-risk impact assessments remain relevant.", action: "Assess the actual processing, including automated decisions and transfers, under Swiss law.", sources: [["FDPIC: current law applies to AI", "https://www.edoeb.admin.ch/en/update-current-legislation-directly-applicable-ai"], ["FADP legal text", "https://www.fedlex.admin.ch/eli/cc/2022/491/en"]] },
        { title: "AI-specific regulatory development", type: "Policy / legislative development", status: "The cited FDPIC update describes Convention-related legislative work; it is not itself a new Swiss AI Act.", meaning: "Policy direction can inform planning without replacing currently applicable duties.", action: "Check for subsequent legislation and treaty implementation before treating an announced approach as binding.", sources: [["FDPIC: AI regulatory context", "https://www.edoeb.admin.ch/en/update-current-legislation-directly-applicable-ai"]] }
      ],
      watch: "Financial supervision, professional secrecy, cantonal public-sector rules and contractual restrictions may add requirements.",
      task: "Explain why 'hosted in Switzerland' and 'lawful for this Swiss organisation's use' are different statements."
    },
    {
      id: "turkiye", name: "Türkiye (Turkey)", region: "Europe",
      hook: "Check the Turkish transfer mechanism and any sector restrictions, not just an EU-style privacy promise.",
      rules: [
        { title: "Personal Data Protection Law No. 6698 (KVKK)", type: "Binding law", status: "Read with amendments, including the 2024 changes to Article 9.", meaning: "Covers personal-data processing and international transfers. The lawful-processing question remains separate from the transfer question.", action: "Map roles, data categories and overseas recipients; obtain local advice on sector and registration duties.", sources: [["KVKK: official standard-contract text and legal basis", "https://www.kvkk.gov.tr/SharedFolderServer/CMSFiles/d4577ac6-d2cd-4ff4-839f-4218812c3cdc.pdf"]] },
        { title: "2024 transfer by-law and standard contracts", type: "Implementing rules / safeguards", status: "The by-law was published on 10 July 2024; use the current official mechanism and appropriate role-pair template.", meaning: "The regime provides structured safeguards for eligible transfers. The linked example is controller-to-controller, not the right contract for every relationship.", action: "Check the required template, notification/formalities and onward-transfer conditions. Do not substitute an EU contract without checking Turkish requirements.", sources: [["KVKK: controller-to-controller example (PDF)", "https://www.kvkk.gov.tr/SharedFolderServer/CMSFiles/d4577ac6-d2cd-4ff4-839f-4218812c3cdc.pdf"]] }
      ],
      watch: "Banking, payment, telecoms and public-sector obligations can be stricter than the general personal-data framework. This guide does not catalogue those sector instruments.",
      task: "Explain which additional questions a regulated financial workload raises beyond selecting a Turkish data centre."
    },
    {
      id: "saudi", name: "Saudi Arabia", region: "Middle East",
      hook: "Data protection, national cybersecurity controls and sector rules are different layers.",
      rules: [
        { title: "Personal Data Protection Law (PDPL)", type: "Binding law", status: "Read with amendments and implementing regulations.", meaning: "Governs personal-data processing. It should not be reduced to the claim that all information must remain in the Kingdom.", action: "Establish the processing purpose, roles and data categories before choosing a hosting or transfer arrangement.", sources: [["SDAIA: official transfer regulation and PDPL legal basis", "https://sdaia.gov.sa/Documents/RegulationonPersonalDataEN.pdf"]] },
        { title: "Regulation on Personal Data Transfer Outside the Kingdom", type: "Implementing regulation", status: "The cited official version is 2.0, August 2024; check for later amendments.", meaning: "Sets conditions and safeguards for international transfers, including risk-assessment requirements in specified cases.", action: "Ask which lawful route, safeguards and assessment support the proposed transfer, including onward recipients.", sources: [["SDAIA: transfer regulation (PDF)", "https://sdaia.gov.sa/Documents/RegulationonPersonalDataEN.pdf"]] },
        { title: "NCA Essential and Cloud Cybersecurity Controls", type: "Cybersecurity control framework", status: "CCC-2:2024 extends the Essential Cybersecurity Controls (ECC); the official page flags updated localisation requirements.", meaning: "Saudi Arabia's National Cybersecurity Authority (NCA) sets requirements for cloud providers and tenants within scope. This is not simply an ISO-equivalent badge for any workload.", action: "Confirm organisational scope, data classification and the current localisation/control requirements. Check additional sector rules.", sources: [["NCA: Cloud Cybersecurity Controls", "https://nca.gov.sa/en/regulatory-documents/controls-list/ccc/"]] }
      ],
      watch: "Do not copy an old blanket localisation statement: the NCA source explicitly records changes. Financial and government workloads need additional competent-authority checks.",
      task: "Separate a PDPL transfer assessment from the question of whether an in-scope cloud deployment meets NCA controls."
    },
    {
      id: "uae", name: "United Arab Emirates", region: "Middle East",
      hook: "Start by identifying the legal regime: federal, Dubai International Financial Centre (DIFC) or Abu Dhabi Global Market (ADGM) is not a minor detail.",
      rules: [
        { title: "Federal Decree-Law No. 45 of 2021 (PDPL)", type: "Binding law", status: "In force from 2 January 2022; check exclusions and current implementing measures.", meaning: "Sets a federal personal-data framework, including processing and cross-border transfer requirements. Some categories and regimes are excluded or separately regulated.", action: "Identify the organisation and activity in scope before applying a federal checklist.", sources: [["UAE government: data-protection laws", "https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws"], ["Federal legal text", "https://uaelegislation.gov.ae/en/legislations/1972"]] },
        { title: "DIFC Data Protection Law No. 5 of 2020 and Regulation 10", type: "Separate jurisdiction / AI-related rules", status: "DIFC has its own data-protection regime; Regulation 10 addresses autonomous and semi-autonomous systems.", meaning: "A DIFC entity may face specific expectations for systems processing personal data, not merely a generic UAE residency question.", action: "Check the system's scope and responsibilities against the DIFC rules and guidance, including any relevant assessment or certification process.", sources: [["DIFC: Regulation 10 guidance (PDF)", "https://assets.difc.com/v1/media/edge/images/dubaiintern0078-difcexperie96c5-production-3253/media/project/difcexperiences/difc/difcwebsite/documents/registrars-and-commissioners/guidance-and-handbooks/lawful-processing/dp_regulation_10.pdf"]] },
        { title: "ADGM Data Protection Regulations 2021", type: "Separate jurisdiction", status: "ADGM has its own regulation and transfer safeguards.", meaning: "A disclosure outside ADGM can require a transfer analysis even when the destination is elsewhere within the UAE.", action: "Check adequacy, safeguards or an applicable exception under the ADGM rules rather than assuming national borders settle the question.", sources: [["ADGM: guidance, including international transfers", "https://www.adgm.com/operating-in-adgm/office-of-data-protection/guidance"]] },
        { title: "Federal Law No. 2 of 2019: ICT in health fields", type: "Sector law", status: "Health information needs separate review, including current decisions and exceptions.", meaning: "Sector-specific controls may constrain the handling or location of health information beyond a general privacy assessment.", action: "Identify the responsible health authority and applicable hosting, transfer and approval conditions; do not infer permission from a general cloud contract.", sources: [["UAE government: data and sector legislation", "https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws"]] }
      ],
      watch: "Federal, emirate-level, health, finance and government requirements can overlap. A service advertised as UAE sovereign is not evidence that every applicable regime has been satisfied.",
      task: "An organisation operates in ADGM and uses support elsewhere in the UAE. Explain why 'no international border crossed' is an incomplete answer."
    },
    {
      id: "qatar", name: "Qatar", region: "Middle East",
      hook: "Distinguish the national framework from the Qatar Financial Centre regime.",
      rules: [
        { title: "Law No. 13 of 2016: Personal Data Privacy Protection", type: "Binding law", status: "Use NCSA guidance alongside the law and relevant decisions.", meaning: "Sets duties for personal-data processing. Sensitive or special-nature processing and cross-border handling need an actual scope assessment.", action: "Identify the responsible organisation, purpose, data categories and applicable permissions or safeguards.", sources: [["NCSA: law overview (PDF)", "https://www.ncsa.gov.qa/shared/document_library/94787172324409/33000/2861/1.0~a7829835-014e-4c61-96f6-779b08833b58?mimetype=application/pdf&filename=PDPPL-booklet-NCSA_0%20(2).pdf"]] },
        { title: "QFC Data Protection Regulations and Rules 2021", type: "Separate jurisdiction", status: "Use the QFC Data Protection Office's regime for entities and processing within its scope.", meaning: "QFC has its own rights, duties and international-transfer framework. National and QFC assessments are not interchangeable.", action: "Confirm whether the relevant entity and activity fall within QFC and use the correct transfer and accountability requirements.", sources: [["QFC: official fact sheet (PDF)", "https://www.qfc.qa/media/444bbeol/qfc-data-protection-regulations-2021-fact-sheet.pdf"], ["QFC: regulations and rules guidance (PDF)", "https://www.qfc.qa/media/xp3pqif3/qfc_data_protection_regulations_and_rules_2021_guidance_-_v31.pdf"]] }
      ],
      watch: "Check financial, government and critical-service requirements separately. Do not turn a national AI strategy into a legal permission or a certification.",
      task: "Write the first two questions you would ask before accepting a supplier's 'Qatar compliant' claim."
    },
    {
      id: "south-africa", name: "South Africa", region: "Africa",
      hook: "POPIA is about responsible processing and permitted transfers, not a universal local-hosting requirement.",
      rules: [
        { title: "Protection of Personal Information Act 4 of 2013 (POPIA)", type: "Binding law", status: "Applicable framework; check exemptions and sector obligations.", meaning: "Protects personal information and sets conditions for lawful processing. Its treatment of information about juristic persons is an important difference from many privacy regimes.", action: "Identify the responsible party and operators, purpose, security measures and rights process.", sources: [["Government: POPIA legal text (PDF)", "https://www.gov.za/sites/default/files/gcis_document/201409/3706726-11act4of2013protectionofpersonalinforcorrect.pdf"]] },
        { title: "POPIA sections 71 and 72", type: "Automated-decision / transfer provisions", status: "Apply the precise statutory conditions, not a general AI or localisation slogan.", meaning: "Section 71 addresses certain solely automated decisions; section 72 sets conditions for transfers to foreign third parties.", action: "Review both consequential automated decisions and the legal route for overseas processing. Local hosting does not resolve the decision-making question.", sources: [["POPIA: sections 71-72 in the Act (PDF)", "https://www.gov.za/sites/default/files/gcis_document/201409/3706726-11act4of2013protectionofpersonalinforcorrect.pdf"]] }
      ],
      watch: "A contractual claim of GDPR compliance does not establish POPIA compliance. Finance, health, employment and public-sector obligations may add requirements.",
      task: "Distinguish lawful overseas hosting from lawful use of an automated decision about an individual."
    },
    {
      id: "kenya", name: "Kenya", region: "Africa",
      hook: "Transfers require an evidenced route; cloud access and registration questions must be considered separately.",
      rules: [
        { title: "Data Protection Act 2019", type: "Binding law", status: "Read with the 2021 regulations and current ODPC guidance.", meaning: "Sets rights and obligations for personal-data processing, including conditions for transfers outside Kenya.", action: "Assess lawful processing, impact-assessment needs, controller/processor roles and any registration requirement.", sources: [["Government copy of the Act (PDF)", "https://interior.go.ke/wp-content/uploads/2026/06/27.-Data-Protection-Act-2019.pdf"]] },
        { title: "General Regulations 2021 and draft transfer guidance", type: "Implementing rules / draft guidance", status: "The Office of the Data Protection Commissioner (ODPC) consulted on draft guidance in 2026. A final version was not verified in this review.", meaning: "The Act and Regulations provide the binding framework. Draft guidance is a learning aid, not a replacement for that framework or proof of a new requirement. Particular data or strategic interests can require additional local controls.", action: "Document the basis for transfers, onward access and any applicable localisation conditions. Check whether ODPC has issued final guidance before relying on the consultation text.", sources: [["ODPC: draft guidance consultation", "https://www.odpc.go.ke/draft-guidance-notes/"], ["ODPC: regulator and current resources", "https://www.odpc.go.ke/"]] }
      ],
      watch: "Check the current national cloud/public-sector policies and sector regulator requirements for the actual buyer. This is not a catalogue of every local-storage obligation.",
      task: "Identify the evidence needed when a locally hosted service uses an overseas support organisation."
    },
    {
      id: "nigeria", name: "Nigeria", region: "Africa",
      hook: "Use the 2023 Act and current NDPC implementation materials, not an old NDPR-only checklist.",
      rules: [
        { title: "Nigeria Data Protection Act 2023", type: "Binding law", status: "The principal framework administered by the NDPC.", meaning: "Covers lawful processing, accountability, rights and international transfers. Organisational scale and significance can affect compliance responsibilities.", action: "Establish roles, lawful basis, security and rights handling, then review the applicable transfer conditions.", sources: [["NDPC: official regulator and Act resources", "https://ndpc.gov.ng/"]] },
        { title: "General Application and Implementation Directive (GAID) 2025", type: "Regulatory directive", status: "Read alongside the Act and current NDPC notices.", meaning: "Provides implementation detail including designation/registration of controllers and processors of major importance, compliance measures and audit returns.", action: "Check whether the organisation falls into the relevant category and which registrations, reporting and governance duties follow.", sources: [["NDPC: GAID 2025 (PDF)", "https://ndpc.gov.ng/wp-content/uploads/2025/07/NDP-ACT-GAID-2025-MARCH-20TH.pdf"]] }
      ],
      watch: "Banking, telecoms and public-sector policies may add requirements. Neither 'African region' nor 'GDPR compliant' is a Nigerian legal conclusion.",
      task: "Explain why choosing a nearby data centre does not answer controller registration or cross-border transfer questions."
    },
    {
      id: "egypt", name: "Egypt", region: "Africa",
      hook: "Check implementation and licensing carefully; older accounts saying executive regulations are still pending can be misleading.",
      rules: [
        { title: "Personal Data Protection Law No. 151 of 2020", type: "Binding law", status: "Read with the published executive regulations and current competent-authority requirements.", meaning: "Governs covered electronic personal-data processing, with licensing/permission and cross-border questions that need local review.", action: "Determine scope and exclusions, processing roles and what authorisations are needed before relying on a hosting plan.", sources: [["Egyptian Court of Cassation: implementing-decree record", "https://www.cc.gov.eg/legislation/3269947493"]] },
        { title: "Ministerial Decree No. 816 of 2025", type: "Executive regulations", status: "Official court metadata confirms publication. The full text on that portal requires an account; this guide does not verify each procedural deadline.", meaning: "The existence of implementing regulations changes the research task: verify the current practical process rather than assuming the 2020 law lacks implementation.", action: "Obtain the authoritative text and confirm licensing, permits, transfer approvals and transitional arrangements with qualified local advice.", sources: [["Official legislation entry (Arabic; access limits)", "https://www.cc.gov.eg/legislation/3269947493"]] }
      ],
      watch: "Evidence limitation: this entry is orientation, not a verified operational compliance procedure. Do not use it to calculate an enforcement deadline or conclude that an authorisation is unnecessary.",
      task: "List the documents you would need before telling a buyer that a particular cross-border service can be used."
    },
    {
      id: "morocco", name: "Morocco", region: "Africa",
      hook: "Separate personal-data transfer procedures from cloud qualifications for sensitive public and critical systems.",
      rules: [
        { title: "Law No. 09-08 and CNDP transfer procedures", type: "Binding law / regulatory procedure", status: "The data-protection authority CNDP describes permitted routes and authorisations. Its page was search-indexed but direct retrieval was unavailable during this review; confirm the current procedure with the authority.", meaning: "Transfers are subject to conditions; notification or authorisation of the underlying processing and the transfer question must not be conflated.", action: "Use the CNDP process for the relevant destination and safeguards, including any required authorisation.", sources: [["CNDP: transfers abroad", "https://www.cndp.ma/transfert-de-donnees-a-letranger/"]] },
        { title: "Cybersecurity Law No. 05-20; Decree 2-24-921; Order 3-17-25", type: "Cybersecurity law / cloud qualification rules", status: "The DGSSI describes a qualification regime for covered entities and critical infrastructure with sensitive systems or data.", meaning: "The framework addresses organisational, legal, operational and technical requirements. Scope and qualification level matter; it is not a rule for every Moroccan private-sector workload.", action: "Confirm whether the buyer and information are in scope, then verify the exact provider qualification, level and location/operator obligations.", sources: [["DGSSI: cloud qualification requirements", "https://www.dgssi.gov.ma/fr/textes-legislatifs-et-reglementaires/arrete-du-chef-du-gouvernement-ndeg-3-17-25-du-7-safar-1447/"], ["DGSSI: Decree 2-24-921 (French PDF)", "https://dgssi.gov.ma/sites/default/files/legislative/brochure/2025-04/DECREE%202.24.921%20FR%20.pdf"]] }
      ],
      watch: "A European cloud qualification is not automatically a Moroccan qualification, and a cloud qualification does not replace a personal-data transfer assessment.",
      task: "Explain why CNDP and DGSSI answer different parts of a sensitive cloud procurement."
    }
  ],
  standards: [
    { title: "ISO/IEC 27001", type: "Management-system certification", proves: "A scoped information-security management system can be independently certified against the standard.", not: "Not proof that every product is secure, that all data stays local or that all laws are satisfied.", ask: "Which organisation, services and sites are in scope? Which version, certification body, validity dates and exclusions apply?", sources: [["ISO: 27001", "https://www.iso.org/standard/27001"]] },
    { title: "ISO/IEC 27701", type: "Privacy management-system standard", proves: "A structured way to manage privacy responsibilities. The 2025 edition defines privacy information management requirements.", not: "Not a blanket GDPR approval or an international-transfer permission.", ask: "Which edition and certification scope are claimed? How does the privacy management system cover the service and its controller/processor roles?", sources: [["ISO: 27701:2025", "https://www.iso.org/standard/27701"]] },
    { title: "ISO/IEC 42001", type: "AI management-system certification", proves: "Evidence about an organisation's system for governing AI risks and responsibilities within the certified scope.", not: "Not certification that a particular model is safe in every use, nor automatic conformity with the EU AI Act.", ask: "Does the scope include the AI service and its development or deployment activities? What system-specific evidence is still required?", sources: [["ISO: 42001", "https://www.iso.org/standard/42001"]] },
    { title: "ISO 22301", type: "Business-continuity management certification", proves: "Evidence of a scoped management system for preparing for and recovering from disruption.", not: "Not a guarantee of zero downtime or independence from every supplier.", ask: "Which operations are covered, what recovery objectives were tested, and when was the last realistic exercise?", sources: [["ISO: 22301", "https://www.iso.org/standard/75106.html"]] },
    { title: "SOC 2", type: "Independent assurance report", proves: "An auditor reports on controls against selected trust-services criteria. Type I addresses a point in time; Type II also addresses operation over a period.", not: "Not a government-issued sovereignty certificate. Reports can include exceptions and customer responsibilities.", ask: "Which system, criteria and period? Which subservice organisations are included or excluded? What does the opinion actually say?", sources: [["AICPA: SOC suite of services", "https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services"]] },
    { title: "BSI C5", type: "Cloud-control attestation", proves: "An auditor examines defined cloud services and regions against BSI's cloud criteria.", not: "Not a BSI-issued certificate for the entire supplier. BSI explicitly distinguishes attestation from its own certification.", ask: "Request the actual report, criteria version, assessed service/regions, period, findings and customer obligations.", sources: [["BSI: C5 FAQ", "https://www.bsi.bund.de/EN/Themen/Unternehmen-und-Organisationen/Informationen-und-Empfehlungen/Empfehlungen-nach-Angriffszielen/Cloud-Computing/Kriterienkatalog-C5/C5-FAQ/kriterienkatalog-c5-faq_node.html"]] },
    { title: "SecNumCloud (France)", type: "National cloud-service qualification", proves: "ANSSI qualification assesses a defined offer against technical, operational and legal requirements, including protection from certain extraterritorial-law risks.", not: "Not blanket qualification of all of a supplier's services or of the applications customers build on top. 'In qualification' is not 'qualified'.", ask: "Find the exact offer and current status in ANSSI's catalogue. Check the qualification scope, version and validity.", sources: [["ANSSI: cloud and qualification resources", "https://cyber.gouv.fr/enjeux-technologiques/cloud/"], ["ANSSI: qualification FAQ", "https://cyber.gouv.fr/enjeux-technologiques/cloud/faq-qualification-secnumcloud/"]] },
    { title: "HDS (France)", type: "Sector-specific hosting certification", proves: "Certification for specified health-data hosting activities under the French framework.", not: "Not approval of every clinical AI use, every data transfer or every service offered by a certified company.", ask: "Which hosting activities and services are covered? Does the contractual service match the certificate and current framework?", sources: [["French Digital Health Agency: HDS", "https://esante.gouv.fr/produits-services/hds"]] },
    { title: "ENS (Spain)", type: "National security framework / conformity", proves: "Spain's National Security Framework establishes requirements for covered public-sector systems and relevant suppliers; assurance depends on system category.", not: "Not a universal EMEA sovereignty passport or a supplier-wide statement without a defined system.", ask: "Which system, category and conformity evidence? Which responsibilities remain with the public-sector customer?", sources: [["Official Gazette: Royal Decree 311/2022", "https://www.boe.es/buscar/doc.php?id=BOE-A-2022-7191"]] },
    { title: "ACN cloud qualification (Italy)", type: "Public-sector cloud qualification", proves: "An Italian qualification framework and catalogue identify specific services/infrastructure and their qualification levels for public administration.", not: "Not evidence that every offer from that company is qualified or suitable for every class of public data.", ask: "Check the exact catalogue entry, level, validity and the administration's classification of its information and service.", sources: [["ACN: cloud framework and catalogue", "https://www.acn.gov.it/portale/en/web/guest/cloud/"]] },
    { title: "CSA STAR", type: "Cloud assurance programme", proves: "A route to publish cloud-control assurance, with different assessment approaches and levels.", not: "A registry entry is not automatically an independent certification. A self-assessment and a third-party assessment are different evidence.", ask: "Which level and assessment route? Which service and control scope? Is the underlying evidence current?", sources: [["Cloud Security Alliance: STAR", "https://cloudsecurityalliance.org/star"]] },
    { title: "NIST AI Risk Management Framework", type: "Voluntary guidance", proves: "Provides a practical structure for governing, mapping, measuring and managing AI risks. It is useful internationally despite its US origin.", not: "Not a NIST-issued product certification, an EMEA law or proof that an organisation has implemented the guidance.", ask: "Show the actual risk decisions, evaluation evidence and accountable owners, not just a framework reference in a slide.", sources: [["NIST: AI RMF", "https://www.nist.gov/itl/ai-risk-management-framework"]] }
  ],
  watchlist: [
    { title: "Cloud and AI Development Act (CADA)", status: "Proposal - not treated here as an enacted obligation", text: "The Commission's proposal addresses capacity, innovation and an EU-wide sovereignty assessment framework with a public-sector adoption mechanism. This is directly relevant to future buying criteria. Follow the legislative process and final text; the word 'Act' in a proposal's title does not make it law.", sources: [["Commission proposal", "https://digital-strategy.ec.europa.eu/en/library/proposal-cloud-and-ai-development-act-cada"], ["COM(2026) 502", "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=COM:2026:502:FIN"]] },
    { title: "AI Omnibus and AI Act dates", status: "Changing timetable - verify the operative text", text: "The Commission overview discusses an Omnibus political agreement and changed high-risk application dates. This guide deliberately does not convert an announcement into a compliance deadline. Compare the current consolidated Act, any adopted amendment and applicable transitional rules.", sources: [["Commission: current AI Act overview", "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"], ["Legal text and version history", "https://eur-lex.europa.eu/eli/reg/2024/1689/oj"]] },
    { title: "EUCS cloud certification", status: "The linked ENISA document is a draft candidate scheme", text: "Do not use the historical candidate document as evidence that a provider has an adopted EUCS certificate. Check subsequent adoption, accredited assessment arrangements and the exact claim before relying on it.", sources: [["ENISA: candidate EUCS scheme", "https://certification.enisa.europa.eu/publications/candidate-eucs-scheme-v10_en"]] }
  ],
  providers: [
    {
      name: "Mistral", lens: "Control of the AI capability, not just its hosting location",
      position: "Mistral's published position emphasises retaining control over data, adapted models, accumulated know-how, compute and ongoing operations. It argues that organisations should be able to keep improving and operating their AI rather than losing that capability when a supplier relationship ends.",
      offers: "Its public materials describe open-weight model options, customisation, customer-chosen deployment boundaries and Mistral Compute / AI Cloud. Managed regional services and self-operated models are different choices, with different rights and responsibilities.",
      useful: "A useful lens when an organisation wants to retain its adaptations, evaluation assets and practical ability to move or operate a model.",
      limits: "French origin, European hosting or open weights do not alone establish lawful use, a particular certification or independence from every dependency. Not every model has the same licence or deployment options.",
      questions: ["What exact model version and licence are we buying or deploying?", "Which adaptations, evaluation assets and operating rights survive termination?", "Can we move and operate the service without the original provider, and has that been demonstrated?"],
      sources: [["Mistral: sovereignty position", "https://mistral.ai/sovereign-ai/"], ["Mistral: cloud offering", "https://mistral.ai/cloud/"]]
    },
    {
      name: "Microsoft", lens: "A range of public, private and national-partner options",
      position: "Microsoft presents sovereignty as a choice of control posture for each workload, balancing cloud services with stronger local operational authority where required.",
      offers: "Microsoft Sovereign Cloud describes Sovereign Public Cloud, Sovereign Private Cloud and National Partner Clouds. Public documentation includes Azure Local and local/disconnected options; availability and service coverage vary by geography and deployment.",
      useful: "A useful lens for organisations that need a mix of managed cloud and locally operated services without assuming every workload needs the same control model.",
      limits: "A public-cloud control, private-cloud feature and partner-operated offer are not interchangeable commitments. A European boundary does not by itself establish an EMEA-wide guarantee or resolve all legal-access questions.",
      questions: ["Which services, data categories, support activities and countries are inside the contracted boundary?", "Who operates this specific deployment, including emergencies and updates?", "Which capabilities are available here now, and what external dependencies remain in the proposed operating mode?"],
      sources: [["Microsoft Learn: Sovereign Cloud", "https://learn.microsoft.com/en-us/azure/azure-sovereign-clouds/microsoft-sovereign-cloud"], ["Microsoft: disconnected offering announcement", "https://blogs.microsoft.com/blog/2026/02/24/microsoft-sovereign-cloud-adds-governance-productivity-and-support-for-large-ai-models-securely-running-even-when-completely-disconnected/"]]
    },
    {
      name: "AWS", lens: "A separately operated European cloud environment",
      position: "AWS describes its European Sovereign Cloud as physically and logically separate from its other regions, with dedicated European operational and governance arrangements.",
      offers: "AWS announced general availability of its European Sovereign Cloud in January 2026. A separate environment should be assessed against its own service catalogue and operating arrangements, not assumed to be identical to standard AWS regions.",
      useful: "A useful lens for buyers seeking a managed cloud with a differentiated European operating boundary.",
      limits: "EU-specific arrangements do not automatically satisfy Saudi, UAE or African requirements. Separation is not a substitute for legal review of entities, contracts, access and dependencies.",
      questions: ["Is the required AI service and model available in this environment?", "Which account, support, metadata and recovery arrangements differ from ordinary regions?", "What evidence supports the independence and continuity claims for this exact service?"],
      sources: [["AWS: European Sovereign Cloud launch", "https://aws.amazon.com/blogs/aws/opening-the-aws-european-sovereign-cloud/"]]
    },
    {
      name: "Google Cloud", lens: "Data-boundary, partner-operated and disconnected choices",
      position: "Google presents a portfolio that combines location and access controls, regional operating partners and customer-site deployments.",
      offers: "Its public portfolio includes Google Cloud Data Boundary, country-specific partner approaches and Google Distributed Cloud in connected and air-gapped forms. Air-gapped is a particular deployment model, not a description of every Google AI service.",
      useful: "A useful lens when the buyer wants to compare managed service controls with much more isolated operation.",
      limits: "Service availability, operator arrangements and qualification status must be checked per offer. 'Designed for' a framework does not mean an offer is already qualified.",
      questions: ["Which organisation operates the service and authorises access?", "Which AI capabilities are included in the proposed deployment rather than the global product catalogue?", "What support, maintenance and licence dependencies remain without an internet connection?"],
      sources: [["Google: sovereign-cloud portfolio", "https://cloud.google.com/sovereign-cloud"], ["Google: Distributed Cloud air-gapped", "https://cloud.google.com/distributed-cloud-air-gapped"]]
    },
    {
      name: "OVHcloud", lens: "European infrastructure and specifically qualified offers",
      position: "OVHcloud emphasises European operation and offers with defined security and sovereignty assurance, including SecNumCloud-qualified services.",
      offers: "Its SecNumCloud catalogue distinguishes named qualified offerings. The buyer must still check the authoritative ANSSI scope and the AI components placed on top of that infrastructure.",
      useful: "A useful lens when procurement demands a specific national qualification rather than a broad sovereignty claim.",
      limits: "A qualified infrastructure offer does not automatically qualify every managed AI product or the customer's application. Qualification scope matters more than the company logo.",
      questions: ["Is the exact proposed offer currently listed as qualified?", "Is the AI service inside that scope or an additional component?", "Who is responsible for the model, application, access decisions and ongoing evidence?"],
      sources: [["OVHcloud: SecNumCloud offers", "https://www.ovhcloud.com/en/secnumcloud/"], ["ANSSI: independent qualification resources", "https://cyber.gouv.fr/enjeux-technologiques/cloud/"]]
    },
    {
      name: "Core42", lens: "Regional operating arrangements and AI capacity",
      position: "Core42 positions its cloud and AI offerings around regional sovereignty needs, with UAE-centric controls in parts of its portfolio.",
      offers: "Public materials distinguish Sovereign AI Cloud, Sovereign Public Cloud using Microsoft Azure with Core42 controls, and private-cloud offerings. Global AI capacity and a UAE-specific control boundary are not the same promise.",
      useful: "A useful lens for examining how a regional operator combines local delivery with international technology suppliers.",
      limits: "Local ownership or operation does not remove every external dependency or make every service appropriate for all UAE legal regimes. Assess the exact contracting entity, location and service chain.",
      questions: ["Which legal entity and service are contracting with us?", "Where do this workload, its support and its recovery copies operate?", "Which duties belong to Core42, underlying technology suppliers and the customer?"],
      sources: [["Core42: public portfolio", "https://www.core42.ai/"], ["Core42: Sovereign AI Cloud", "https://www.core42.ai/products/ai-cloud"]]
    }
  ],
  exercises: [
    {
      id: "location", title: "The local-hosting shortcut",
      story: "Fictional case: a UAE organisation wants a staff-policy assistant. The supplier offers local hosting, overseas support and an ISO 27001 certificate. The buyer has not yet established whether the relevant entity is under federal, DIFC or ADGM rules.",
      question: "What is the most useful next step?",
      choices: [
        ["Approve it because the database is local.", false, "Local storage does not settle legal scope, support access, the processing purpose or the certificate's service coverage."],
        ["Identify the regime, map support access and request service-specific evidence.", true, "Yes. Establish the legal entity and use, then assess data access and evidence. This identifies the next work; it does not yet approve the deployment."],
        ["Reject every international supplier automatically.", false, "Supplier nationality alone is not the applicable legal test. Identify the actual obligations and permitted arrangements before deciding."]
      ],
      takeaway: "The legal boundary and the information journey both matter.",
      links: [["UAE guide", "#sovereignty/atlas"], ["Badges and evidence", "#sovereignty/standards"]]
    },
    {
      id: "purpose", title: "Same hosting, different use",
      story: "Fictional case: an EU organisation starts with an assistant that finds published training policies. A new proposal would have the system rank job applicants and influence selection decisions.",
      question: "What should change before proceeding?",
      choices: [
        ["Nothing: the supplier's certificate still covers the cloud.", false, "Hosting evidence does not settle the risks and obligations created by a changed intended purpose."],
        ["Only the country where the model runs.", false, "Moving the model does not resolve role-specific AI, privacy, employment or equality obligations."],
        ["Reassess intended purpose, legal roles, risk classification and decision safeguards.", true, "Yes. Recruitment is a significant AI Act assessment area, with scope rules and exceptions to examine. Legal/privacy and accountable business owners should reassess the proposed use; this exercise is not a final classification."]
      ],
      takeaway: "A change in purpose can be more important than a change in infrastructure.",
      links: [["EU / EEA guide", "#sovereignty/atlas"], ["Accountability lesson", "#sovereignty/learn"]]
    },
    {
      id: "exit", title: "The independence claim",
      story: "Fictional case: a team can download model weights, but its agreement is unclear about adapted models after termination. Only the supplier has the evaluation set and recovery instructions.",
      question: "Which evidence would most improve the decision?",
      choices: [
        ["Clear surviving rights, complete handover and a rehearsed recovery or exit.", true, "Yes. Practical autonomy combines legal rights, retained assets, people and a tested process. Exportable weights alone do not prove the service can continue."],
        ["A statement that the model is open, with no version or licence.", false, "Open weights do not establish the permissions attached to the exact model or the rights to adaptations."],
        ["A promise that a locally owned supplier will never fail.", false, "Ownership does not remove continuity or commercial risk. Ask what you can actually do if the relationship ends."]
      ],
      takeaway: "Sovereignty includes the capability to keep going, not just a place to start.",
      links: [["Compare provider positions", "#sovereignty/providers"], ["Control and operating choices", "#sovereignty/learn"]]
    }
  ],
  evidence: [
    ["Purpose and people", "What decision does the service support, who is affected, and what happens when it is wrong?"],
    ["Applicable obligations", "Which country, entity, sector and contractual rules apply? Who has confirmed that interpretation?"],
    ["Data and access", "Where do inputs, outputs, records, backups and support information go? Who can access them?"],
    ["Supplier commitments", "Which service, legal entity, operator, terms and assurance scope are actually being offered?"],
    ["Continuity and exit", "What survives an outage or termination? Have the rights, handover, skills and recovery been tested?"],
    ["Accountable decision", "Who accepts remaining risks, what conditions apply, and what change triggers a new review?"]
  ]
};
