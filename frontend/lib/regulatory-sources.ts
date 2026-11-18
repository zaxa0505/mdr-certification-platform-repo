import type { RegulatorySourceRecord } from "./project-store";

const verificationDate = "2026-11-17";
const harmonisedSummaryUrl =
  "https://single-market-economy.ec.europa.eu/single-market/goods/european-standards/harmonised-standards/medical-devices_en";
const guidanceIndexUrl =
  "https://health.ec.europa.eu/medical-devices-sector/new-regulations/guidance-mdcg-endorsed-documents-and-other-guidance_en";

export const REGULATORY_SOURCE_CATALOG: RegulatorySourceRecord[] = [
  {
    id: "mdr-2017-745",
    kind: "legislation",
    title: "Medical Device Regulation",
    reference: "Regulation (EU) 2017/745",
    edition: "Consolidated text available on EUR-Lex",
    validity:
      "In force; the Commission lists 26 May 2021 as the date of application. Check the latest consolidated text before regulatory use.",
    verifiedAt: verificationDate,
    verification: "verified",
    harmonisation: "not-applicable",
    harmonisationDetails: "Legislation; harmonised-standard status does not apply.",
    scope:
      "EU requirements for medical devices, including general safety and performance, technical documentation, conformity assessment, clinical evaluation and post-market surveillance.",
    applicabilityGuidance:
      "Assess the product qualification, intended purpose and applicable MDR provisions for this project.",
    verificationNote:
      "The Commission harmonised-standards page identifies the MDR and its application date; the linked EUR-Lex text is the legal source.",
    sources: [
      {
        label: "MDR on EUR-Lex",
        url: "https://eur-lex.europa.eu/eli/reg/2017/745/oj/eng",
      },
      { label: "European Commission: harmonised standards", url: harmonisedSummaryUrl },
    ],
  },
  {
    id: "gdpr-2016-679",
    kind: "legislation",
    title: "General Data Protection Regulation",
    reference: "Regulation (EU) 2016/679",
    edition: "Original regulation; check the current consolidated text",
    validity:
      "Applies when personal data are processed within its scope; verify current legal text and applicable national requirements.",
    verifiedAt: verificationDate,
    verification: "partially-verified",
    harmonisation: "not-applicable",
    harmonisationDetails: "Legislation; harmonised-standard status does not apply.",
    scope:
      "Processing of personal data, including health data, by controllers and processors within the territorial and material scope of the Regulation.",
    applicabilityGuidance:
      "Assess only where this device, its software, clinical investigation or related service processes personal data.",
    verificationNote:
      "The official EUR-Lex source is recorded; project-specific data-protection obligations have not been assessed.",
    sources: [
      {
        label: "GDPR on EUR-Lex",
        url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng",
      },
    ],
  },
  {
    id: "iso-14971",
    kind: "standard",
    title: "Medical devices — Application of risk management to medical devices",
    reference: "ISO 14971:2019",
    edition: "Edition 3, published 2019-12",
    validity:
      "ISO states this edition was reviewed and confirmed in 2025 and remains current.",
    verifiedAt: verificationDate,
    verification: "verified",
    harmonisation: "listed-in-oj",
    harmonisationDetails:
      "EN ISO 14971:2019/A11:2021 is cited in Commission Implementing Decision (EU) 2022/757, effective 2022-05-17; no withdrawal date appears in the Commission summary generated 2026-11-11.",
    scope:
      "Risk-management process for medical devices throughout the lifecycle, including software and IVDs.",
    applicabilityGuidance:
      "Candidate framework for the manufacturer's MDR risk-management process. Its use is voluntary; document why this edition and any European amendments fit this device.",
    verificationNote:
      "Edition/current status checked in the ISO catalogue. OJ reference checked against the Commission summary generated 2026-11-11; the OJ decision is the legal publication source.",
    sources: [
      { label: "ISO catalogue", url: "https://www.iso.org/standard/72704.html" },
      {
        label: "Commission Implementing Decision (EU) 2022/757",
        url: "https://eur-lex.europa.eu/eli/dec_impl/2022/757/oj",
      },
      { label: "Commission summary of harmonised references", url: harmonisedSummaryUrl },
    ],
  },
  {
    id: "iso-tr-24971",
    kind: "standard",
    title: "Medical devices — Guidance on the application of ISO 14971",
    reference: "ISO/TR 24971:2020",
    edition:
      "2020 edition referenced by the existing project; current ISO lifecycle not confirmed",
    validity: "Current edition/status requires confirmation in the ISO catalogue.",
    verifiedAt: null,
    verification: "partially-verified",
    harmonisation: "not-found-in-summary",
    harmonisationDetails:
      "No reference was found in the Commission MDR summary generated 2026-11-11. A technical report is guidance and does not itself establish a presumption of conformity.",
    scope:
      "Guidance for applying ISO 14971 risk-management concepts to medical devices.",
    applicabilityGuidance:
      "Consider when the manufacturer uses ISO 14971; confirm the report's current edition and relevance to the device.",
    verificationNote:
      "Reference and scope come from the existing project. Current ISO lifecycle status was not independently confirmed; do not treat this entry as verified-current.",
    sources: [
      {
        label: "ISO catalogue search",
        url: "https://www.iso.org/search.html?q=ISO%2FTR%2024971%3A2020",
      },
      { label: "Commission summary of harmonised references", url: harmonisedSummaryUrl },
    ],
  },
  {
    id: "iso-13485",
    kind: "standard",
    title:
      "Medical devices — Quality management systems — Requirements for regulatory purposes",
    reference: "ISO 13485:2016",
    edition: "Edition 3, published 2016-03",
    validity:
      "ISO states this edition was reviewed and confirmed in 2025 and remains current.",
    verifiedAt: verificationDate,
    verification: "verified",
    harmonisation: "listed-in-oj",
    harmonisationDetails:
      "EN ISO 13485:2016, including AC:2018 and A11:2021, is listed from 2022-01-05 in Commission Implementing Decision (EU) 2022/6; no withdrawal date appears in the Commission summary generated 2026-11-11.",
    scope:
      "Quality management systems for organisations involved in the design, production, installation or servicing of medical devices.",
    applicabilityGuidance:
      "Evaluate against the manufacturer's organisation and MDR quality-system obligations. Do not equate citing the standard with certification or automatic MDR compliance.",
    verificationNote:
      "Edition/current status checked in the ISO catalogue. OJ reference checked against the Commission summary generated 2026-11-11.",
    sources: [
      { label: "ISO catalogue", url: "https://www.iso.org/standard/13485" },
      {
        label: "Commission Implementing Decision (EU) 2022/6",
        url: "https://eur-lex.europa.eu/eli/dec_impl/2022/6/oj",
      },
      { label: "Commission summary of harmonised references", url: harmonisedSummaryUrl },
    ],
  },
  {
    id: "iec-62304",
    kind: "standard",
    title: "Medical device software — Software life cycle processes",
    reference: "IEC 62304",
    edition: "Current IEC edition and amendments not verified",
    validity: "Not verified in the current IEC catalogue.",
    verifiedAt: null,
    verification: "needs-verification",
    harmonisation: "not-found-in-summary",
    harmonisationDetails:
      "No IEC 62304 reference was found in the Commission MDR summary generated 2026-11-11. This is not a legal determination; verify the relevant OJ decisions and applicable European adoption.",
    scope:
      "Software life-cycle processes for medical-device software, including software that is itself a medical device or part of one.",
    applicabilityGuidance:
      "Assess when the device includes medical-device software; define the software boundary and regulatory role first.",
    verificationNote:
      "The title and scope are recorded as a candidate. The current edition, amendments and European adoption require verification against the official IEC/CEN catalogue.",
    sources: [
      { label: "IEC Webstore", url: "https://webstore.iec.ch/" },
      { label: "Commission summary of harmonised references", url: harmonisedSummaryUrl },
    ],
  },
  {
    id: "iec-62366-1",
    kind: "standard",
    title:
      "Medical devices — Part 1: Application of usability engineering to medical devices",
    reference: "IEC 62366-1",
    edition: "Current IEC edition and amendments not verified",
    validity: "Not verified in the current IEC catalogue.",
    verifiedAt: null,
    verification: "needs-verification",
    harmonisation: "not-found-in-summary",
    harmonisationDetails:
      "No IEC 62366-1 reference was found in the Commission MDR summary generated 2026-11-11. This is not a legal determination; verify the relevant OJ decisions and applicable European adoption.",
    scope:
      "Usability engineering for medical devices, especially user-interface interactions that can affect safety.",
    applicabilityGuidance:
      "Assess where intended users interact with the device or its interface; account for use-related risks and the intended use environment.",
    verificationNote:
      "The title and scope are recorded as a candidate. The current edition, amendments and European adoption require verification against the official IEC/CEN catalogue.",
    sources: [
      { label: "IEC Webstore", url: "https://webstore.iec.ch/" },
      { label: "Commission summary of harmonised references", url: harmonisedSummaryUrl },
    ],
  },
  {
    id: "iec-81001-5-1",
    kind: "standard",
    title:
      "Health software and health IT systems safety, effectiveness and security — Part 5-1: Security — Activities in the product life cycle",
    reference: "IEC 81001-5-1",
    edition: "Current IEC edition and amendments not verified",
    validity: "Not verified in the current IEC catalogue.",
    verifiedAt: null,
    verification: "needs-verification",
    harmonisation: "not-found-in-summary",
    harmonisationDetails:
      "No IEC 81001-5-1 reference was found in the Commission MDR summary generated 2026-11-11. This is not a legal determination; verify the relevant OJ decisions and applicable European adoption.",
    scope:
      "Security activities across the product life cycle of health software and health IT systems.",
    applicabilityGuidance:
      "Assess for health software, connected devices or systems with relevant security risks; tailor scope to the device architecture and threat model.",
    verificationNote:
      "The title and scope are recorded as a candidate. The current edition, amendments and European adoption require verification against the official IEC/CEN catalogue.",
    sources: [
      { label: "IEC Webstore", url: "https://webstore.iec.ch/" },
      { label: "Commission summary of harmonised references", url: harmonisedSummaryUrl },
    ],
  },
  {
    id: "iso-20417",
    kind: "standard",
    title:
      "Medical devices — Information to be supplied by the manufacturer",
    reference: "ISO 20417",
    edition: "Current ISO edition and amendments not verified",
    validity: "Not verified in the current ISO catalogue.",
    verifiedAt: null,
    verification: "needs-verification",
    harmonisation: "not-found-in-summary",
    harmonisationDetails:
      "No ISO 20417 reference was found in the Commission MDR summary generated 2026-11-11. This is not a legal determination; verify the relevant OJ decisions and European adoption.",
    scope:
      "Information supplied by the manufacturer for medical devices, including accompanying information.",
    applicabilityGuidance:
      "Assess where the manufacturer supplies information with or on the device; relate the review to the device, labeling and intended users.",
    verificationNote:
      "The identifier and scope are recorded as a candidate. The current edition, amendments and European adoption require verification against the official ISO/CEN catalogue.",
    sources: [
      {
        label: "ISO catalogue search",
        url: "https://www.iso.org/search.html?q=ISO%2020417",
      },
      { label: "Commission summary of harmonised references", url: harmonisedSummaryUrl },
    ],
  },
  {
    id: "iso-15223-1",
    kind: "standard",
    title:
      "Medical devices — Symbols to be used with information to be supplied by the manufacturer — Part 1: General requirements",
    reference: "ISO 15223-1:2021/Amd 1:2025",
    edition: "Base edition 4 (2021-07), Amendment 1 published 2025",
    validity:
      "The ISO catalogue lists the 2021 edition as under systematic review from 2026-07-15 and lists Amendment 1:2025 as published.",
    verifiedAt: verificationDate,
    verification: "verified",
    harmonisation: "listed-in-oj",
    harmonisationDetails:
      "EN ISO 15223-1:2021/A1:2025 is cited with effect from 2026-06-17. The Commission summary records withdrawal of the unamended EN ISO 15223-1:2021 reference effective 2031-06-15.",
    scope:
      "Symbols used to express information supplied with or on medical devices, their packaging or accompanying information.",
    applicabilityGuidance:
      "Assess where symbols are used on the device, packaging or accompanying information; confirm that each symbol is suitable for the intended market and users.",
    verificationNote:
      "Edition and amendment checked in the ISO catalogue. European reference and transition date checked against the Commission summary generated 2026-11-11.",
    sources: [
      { label: "ISO 15223-1 catalogue", url: "https://www.iso.org/standard/77326.html" },
      { label: "ISO Amendment 1:2025", url: "https://www.iso.org/standard/86270.html" },
      { label: "Commission summary of harmonised references", url: harmonisedSummaryUrl },
      {
        label: "Commission Implementing Decision (EU) 2026/2479",
        url: "https://eur-lex.europa.eu/eli/dec_impl/2026/2479/oj",
      },
    ],
  },
  {
    id: "iso-14155",
    kind: "standard",
    title:
      "Clinical investigation of medical devices for human subjects — Good clinical practice",
    reference: "EN ISO 14155:2026",
    edition:
      "2026 European edition; the OJ summary identifies ISO/FDIS 14155:2025 as its basis",
    validity:
      "Listed in the OJ from 2026-11-10. The prior EN ISO 14155:2020 and A11:2024 reference has a withdrawal date of 2028-05-10.",
    verifiedAt: verificationDate,
    verification: "verified",
    harmonisation: "listed-in-oj",
    harmonisationDetails:
      "EN ISO 14155:2026 is cited by Commission Implementing Decision (EU) 2026/2479 with effect from 2026-11-10. The 2020 edition has a transition period until 2028-05-10.",
    scope:
      "Good clinical practice for the design, conduct, recording and reporting of clinical investigations involving human subjects and medical devices.",
    applicabilityGuidance:
      "Assess when planning or conducting a clinical investigation; it is not automatically applicable to every clinical evaluation.",
    verificationNote:
      "European edition, effective date and predecessor transition checked against the Commission summary generated 2026-11-11 and Decision (EU) 2026/2479.",
    sources: [
      {
        label: "Commission Implementing Decision (EU) 2026/2479",
        url: "https://eur-lex.europa.eu/eli/dec_impl/2026/2479/oj",
      },
      { label: "Commission summary of harmonised references", url: harmonisedSummaryUrl },
    ],
  },
  {
    id: "mdcg-2021-24-rev1",
    kind: "guidance",
    title: "Guidance on classification of medical devices",
    reference: "MDCG 2021-24 rev.1",
    edition: "Revision 1, published April 2026",
    validity: "Listed as current guidance by the Commission on 2026-11-17.",
    verifiedAt: verificationDate,
    verification: "verified",
    harmonisation: "not-applicable",
    harmonisationDetails:
      "MDCG guidance is non-binding and does not create a harmonised-standard presumption of conformity.",
    scope:
      "Classification of medical devices under the MDR, including application of Annex VIII rules.",
    applicabilityGuidance:
      "Consider when determining or documenting this device's MDR classification.",
    verificationNote:
      "Reference, revision, title and publication month checked in the current European Commission MDCG index.",
    sources: [
      {
        label: "MDCG 2021-24 rev.1",
        url: "https://health.ec.europa.eu/document/download/cbb19821-a517-4e13-bf87-fdc6ddd1782e_en?filename=mdcg_2021-24_en.pdf",
      },
      { label: "European Commission MDCG index", url: guidanceIndexUrl },
    ],
  },
  {
    id: "mdcg-2019-11-rev1",
    kind: "guidance",
    title: "Qualification and classification of software under the MDR and IVDR",
    reference: "MDCG 2019-11 rev.1",
    edition: "Revision 1, published June 2025",
    validity: "Listed as current guidance by the Commission on 2026-11-17.",
    verifiedAt: verificationDate,
    verification: "verified",
    harmonisation: "not-applicable",
    harmonisationDetails:
      "MDCG guidance is non-binding and does not create a harmonised-standard presumption of conformity.",
    scope:
      "Qualification and classification of software under Regulations (EU) 2017/745 and 2017/746.",
    applicabilityGuidance:
      "Consider when the product includes software or when software qualification/classification is uncertain.",
    verificationNote:
      "Reference, revision, title and publication month checked in the current European Commission MDCG index.",
    sources: [
      {
        label: "MDCG 2019-11 rev.1",
        url: "https://health.ec.europa.eu/document/download/b45335c5-1679-4c71-a91c-fc7a4d37f12b_en?filename=mdcg_2019_11_en.pdf",
      },
      { label: "European Commission MDCG index", url: guidanceIndexUrl },
    ],
  },
  {
    id: "mdcg-2020-1",
    kind: "guidance",
    title: "Clinical evaluation of medical device software under the MDR",
    reference: "MDCG 2020-1",
    edition: "Published March 2020",
    validity: "Listed by the Commission on 2026-11-17; revision/archival status should be rechecked before use.",
    verifiedAt: verificationDate,
    verification: "partially-verified",
    harmonisation: "not-applicable",
    harmonisationDetails:
      "MDCG guidance is non-binding and does not create a harmonised-standard presumption of conformity.",
    scope:
      "Clinical evaluation of medical-device software under the MDR; the same index entry also addresses IVDR performance evaluation.",
    applicabilityGuidance:
      "Consider for medical-device software clinical evaluation; check the current guidance index for revisions or replacement documents.",
    verificationNote:
      "The current Commission index lists this March 2020 document; its revision/archival state was not independently confirmed.",
    sources: [
      {
        label: "MDCG 2020-1",
        url: "https://health.ec.europa.eu/document/download/19d9e24f-2808-4e00-bfeb-75892047407d_en?filename=md_mdcg_2020_1_guidance_clinic_eva_md_software_en.pdf",
      },
      { label: "European Commission MDCG index", url: guidanceIndexUrl },
    ],
  },
  {
    id: "mdcg-2019-16-rev1",
    kind: "guidance",
    title: "Guidance on cybersecurity for medical devices",
    reference: "MDCG 2019-16 rev.1",
    edition: "Revision 1, published July 2020",
    validity: "Listed by the Commission on 2026-11-17; revision/archival status should be rechecked before use.",
    verifiedAt: verificationDate,
    verification: "partially-verified",
    harmonisation: "not-applicable",
    harmonisationDetails:
      "MDCG guidance is non-binding and does not create a harmonised-standard presumption of conformity.",
    scope:
      "Cybersecurity considerations for medical devices and their regulatory documentation.",
    applicabilityGuidance:
      "Consider for connected, networked or software-enabled devices with cybersecurity risks; check the latest guidance index before use.",
    verificationNote:
      "The current Commission index lists this July 2020 revision; its revision/archival state was not independently confirmed.",
    sources: [
      {
        label: "MDCG 2019-16 rev.1",
        url: "https://health.ec.europa.eu/document/download/b23b362f-8a56-434c-922a-5b3ca4d0a7a1_en?filename=md_cybersecurity_en.pdf",
      },
      { label: "European Commission MDCG index", url: guidanceIndexUrl },
    ],
  },
  {
    id: "mdcg-2025-6",
    kind: "guidance",
    title:
      "FAQ on interplay between the MDR/IVDR and the Artificial Intelligence Act",
    reference: "MDCG 2025-6",
    edition: "Published June 2025",
    validity: "Listed as current guidance by the Commission on 2026-11-17.",
    verifiedAt: verificationDate,
    verification: "verified",
    harmonisation: "not-applicable",
    harmonisationDetails:
      "MDCG guidance is non-binding and does not create a harmonised-standard presumption of conformity.",
    scope:
      "Relationship between medical-device regulations and the Artificial Intelligence Act.",
    applicabilityGuidance:
      "Consider only where the device or its software uses AI and falls within the guidance's subject matter.",
    verificationNote:
      "Reference, title and publication month checked in the current European Commission MDCG index.",
    sources: [
      {
        label: "MDCG 2025-6",
        url: "https://health.ec.europa.eu/document/download/b78a17d7-e3cd-4943-851d-e02a2f22bbb4_en?filename=mdcg_2025-6_en.pdf",
      },
      { label: "European Commission MDCG index", url: guidanceIndexUrl },
    ],
  },
  {
    id: "mdcg-2023-4",
    kind: "guidance",
    title: "Medical Device Software — Hardware combinations",
    reference: "MDCG 2023-4",
    edition: "Published October 2023",
    validity: "Listed as current guidance by the Commission on 2026-11-17.",
    verifiedAt: verificationDate,
    verification: "verified",
    harmonisation: "not-applicable",
    harmonisationDetails:
      "MDCG guidance is non-binding and does not create a harmonised-standard presumption of conformity.",
    scope:
      "Medical-device software intended to work in combination with hardware or hardware components.",
    applicabilityGuidance:
      "Consider only when the device software is intended to work with hardware or hardware components.",
    verificationNote:
      "Reference, title and publication month checked in the current European Commission MDCG index.",
    sources: [
      {
        label: "MDCG 2023-4",
        url: "https://health.ec.europa.eu/document/download/b2c4e715-f2b4-4d24-af60-056b5d41a72e_en?filename=md_mdcg_2023-4_software_en.pdf",
      },
      { label: "European Commission MDCG index", url: guidanceIndexUrl },
    ],
  },
  {
    id: "mdcg-2021-5-rev1",
    kind: "guidance",
    title: "Guidance on standardisation for medical devices",
    reference: "MDCG 2021-5 rev.1",
    edition: "Revision 1; publication date not confirmed from the linked document metadata",
    validity:
      "The Commission harmonised-standards page cites this guidance on 2026-11-17.",
    verifiedAt: verificationDate,
    verification: "partially-verified",
    harmonisation: "not-applicable",
    harmonisationDetails:
      "MDCG guidance is non-binding and does not create a harmonised-standard presumption of conformity.",
    scope:
      "Use and interpretation of standardisation and harmonised standards in support of medical-device legislation.",
    applicabilityGuidance:
      "Consider when selecting standards or interpreting their relationship to MDR requirements.",
    verificationNote:
      "The Commission page confirms the reference and revision; exact publication date and any later replacement should be confirmed before regulatory use.",
    sources: [
      {
        label: "MDCG 2021-5 rev.1",
        url: "https://health.ec.europa.eu/document/download/59ac4cb0-f187-4ca2-814d-82c42cde5408_en?filename=md_mdcg_2021_5_en.pdf",
      },
      { label: "European Commission harmonised standards page", url: harmonisedSummaryUrl },
    ],
  },
];

export function getSafeSourceUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
