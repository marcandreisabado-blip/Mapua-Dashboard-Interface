---
name: Mapúa Findr public-report boundary
description: Privacy and access-control boundary for found-item reports before Mapúa sign-in is implemented.
---

## Rule

Until Mapúa sign-in and authorization exist, found-item submissions are anonymous and listings are public. Keep reporter identity, contact information, student IDs, serial numbers, and private claim-verification details out of this report and browse flow. Add access control and abuse protections before using it for campus operations.

**Why:** This implementation makes reporting and search persistent without adding an identity provider. Public item descriptions are useful to the community, but identity and verification details require a protected workflow.

**How to apply:** Preserve this boundary when extending the item schema, API, and UI. Add Mapúa authentication before associating a report with a person or enabling private claims and custody actions.
