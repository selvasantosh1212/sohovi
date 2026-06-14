---
title: "What Is Master Data Management (MDM)? A Plain-English Guide"
slug: "what-is-master-data-management"
category: "Data Quality Glossary"
primaryKeyword: "what is master data management"
supportingKeywords: ["MDM definition", "master data management example", "MDM for small business", "single source of truth data"]
searchIntent: "informational"
wordCountTarget: 1100
audience: "business owners, ops managers, IT teams dealing with inconsistent data across systems"
status: "draft"
seo_title: "What Is Master Data Management (MDM)? A Plain-English Guide"
seo_description: "Master data management (MDM) creates a single authoritative source for key business data like customers, products, and suppliers. Here's what it is and when you need it."
---

# What Is Master Data Management (MDM)? A Plain-English Guide

If your customer "Acme Corp" appears as "Acme Corporation" in your CRM, "ACME Corp." in your billing system, and "Acme" in your spreadsheet — you have a master data problem. Three records, one real company, zero confidence in your reports.

Master data management (MDM) is the practice of creating and maintaining a single, authoritative version of key business entities — customers, products, suppliers, employees, locations — across all your systems.

## What "Master Data" Actually Means

Not all data is master data. Most business data is transactional: orders, invoices, support tickets, log entries. Transactional data records events. Master data describes the core entities involved in those events.

Master data includes:
- **Customers**: The definitive record of who your customers are
- **Products**: The authoritative list of what you sell, with consistent names, SKUs, and attributes
- **Suppliers / Vendors**: The canonical record of who you buy from
- **Employees**: The definitive employee directory
- **Locations**: Standard addresses and geographic data used across systems

When these core entities exist inconsistently across systems, everything built on top of them — reports, forecasts, communications, integrations — inherits the inconsistency.

### Why Master Data Gets Messy

Master data becomes inconsistent through normal business growth:

- You implement a new CRM that imports contacts differently than your old one
- One team enters customer names in title case; another uses all caps
- The same customer signs up twice with slightly different contact details
- A product is named differently in your inventory system vs. your e-commerce store
- You acquire a company and merge their customer database with yours

None of these are mistakes. They're the natural result of systems and teams that weren't coordinated from the start.

## What MDM Does

MDM creates a "golden record" — the authoritative, deduplicated, validated version of each core business entity. This golden record becomes the source of truth that all other systems sync to.

The MDM process typically involves:

**1. Identify master data domains**: Which entities need a golden record? (Customers, products, suppliers, etc.)

**2. Consolidate**: Pull records from all source systems into a central location.

**3. Deduplicate**: Identify and merge duplicate records — the same customer appearing as two entries.

**4. Validate and standardize**: Ensure names, addresses, IDs, and other attributes are in consistent formats.

**5. Create the golden record**: Combine the best attributes from all source records into one authoritative master record.

**6. Distribute**: Push the golden record back to all source systems so they all reflect the same truth.

**7. Govern**: Establish rules for how new records are created and changed so inconsistency doesn't reenter.

[IMAGE: Diagram showing customer records in three different systems consolidating into a single "golden record" in an MDM hub]

## MDM Styles: Centralized vs. Registry vs. Federated

There are different approaches to where the master record lives:

**Centralized (hub-and-spoke):** One central MDM system holds the golden records, and all other systems sync to it. Clean but requires all systems to integrate with the hub.

**Registry style:** Each source system keeps its own data, and the MDM layer maintains a cross-reference index linking equivalent records across systems without moving the data.

**Federated:** Different business units own their own master data, but standards are shared. Common in large organizations with distinct divisions.

For most small and mid-size businesses, a centralized approach — even if the "hub" is a well-maintained CRM or spreadsheet — is the most practical.

## Do Small Businesses Need MDM?

Formal MDM programs are typically associated with enterprise organizations managing millions of records across dozens of systems. But the underlying problem — inconsistent core data — affects businesses of every size.

You probably need an MDM approach (even an informal one) if:
- The same customer appears multiple times in your CRM with different names or details
- Your product names differ between your website, inventory system, and invoices
- Reports from different systems contradict each other on the same metric
- You're planning to merge, acquire, or integrate with another company
- You have multiple tools that all store customer information and they don't agree

For a small business, "MDM" doesn't mean an enterprise software platform. It might mean:
- Designating your CRM as the single source of truth for customer data, and syncing other systems to it
- Running regular deduplication checks on your contact database
- Establishing naming conventions and enforcing them in every system

Sohovi can help with the deduplication and standardization steps — upload your customer or product CSV and get an instant report on duplicates, format inconsistencies, and completeness gaps.

## MDM and Data Quality

MDM is closely related to data quality but distinct from it:

- **Data quality** asks: Is this data accurate, complete, consistent, and timely?
- **MDM** asks: Is there one authoritative version of this entity, and are all systems using it?

MDM is a data quality practice specifically applied to master data. Good MDM produces data that scores well on consistency and uniqueness dimensions. Poor MDM is often the root cause of data quality failures in reports that pull from multiple systems.

## Frequently Asked Questions

**Q: What is an example of master data?**
A customer record in your CRM, a product entry in your catalog, a supplier in your accounts payable system, an employee record in your HR system. These are the core entities your business operates around — not transactional events like orders or payments.

**Q: What's the difference between MDM and a CRM?**
A CRM (Customer Relationship Management system) is one of the systems where customer master data lives. MDM is the practice and process of ensuring that customer data is consistent and authoritative across your CRM and any other system that stores customer information.

**Q: What is a "golden record" in MDM?**
A golden record is the single, definitive version of an entity — a customer, product, or supplier — that is considered the authoritative source of truth. It's created by consolidating, deduplicating, and validating records from multiple source systems.

**Q: Is MDM a software product or a process?**
Both. MDM software tools (like Informatica MDM, Stibo Systems, or Reltio) automate the consolidation and governance of master data. But MDM as a practice — defining standards, assigning ownership, enforcing consistency — is equally important. The process without software is possible at small scale; the software without the process produces technically sophisticated inconsistency.

**Q: What is the most common MDM use case for small businesses?**
Customer deduplication. Most growing businesses accumulate duplicate customer records through multiple sign-up paths, manual entry, and system integrations. Identifying and merging those duplicates is the most accessible entry point into MDM practices.

**Q: How does MDM relate to GDPR?**
GDPR requires businesses to respond to data subject requests — access, correction, erasure. If a customer's data is scattered inconsistently across multiple systems, responding to those requests is difficult and error-prone. MDM ensures you can find all records related to a specific individual and respond completely.

**Q: What's the first step in implementing MDM?**
Identify your most important master data domain — almost always customers or products. Run a deduplication and consistency check on that dataset. The findings from that audit define your first MDM project.

**Q: What does "single source of truth" mean in MDM?**
A single source of truth is the one system or record that is considered authoritative for a given entity. When two systems disagree about a customer's address, the single source of truth is the one you trust and update first. MDM creates and enforces that hierarchy.

---

**MDM is ultimately about making sure your business agrees with itself. When your CRM, billing system, and marketing platform all have the same customer record, reports reconcile, campaigns reach the right people, and decisions are made on reliable information.**

[INTERNAL LINK: How to Find Duplicate Records in a CSV File]
[INTERNAL LINK: What Is Data Quality? A Complete Beginner's Guide]
