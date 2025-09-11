# Frontend – React + Vite

# Front-end is not finished yet, currently, UI/UX is in progress

## ERP Frontend System G-soft ERP for micro, small and medium-sized enterprises
## Description:
G-soft is an ERP software developed with the aim of helping micro, small and medium-sized enterprises to improve, offer and expand their business.
It was developed using SOLID principles of software development, which makes it sustainable, easily upgradeable and suitable for long-term maintenance. It is these features that make G-soft a valuable product for IT companies and potential partners.

Current functionalities:
• Storage
• Logistics
• Accounting
• Material management
• Production planning
• Quality control
Disclaimer:

G-soft is not a copy of existing ERP systems, but an original solution tailored to local market needs.

The application is organized by components, with a structure that includes:

    components/ – for reusable components like buttons, input fields, tables, etc.

    pages/ – for all pages such as Dashboard, Inventory, Invoices, Users, etc.

    utils/ – part where all API calls related to backend controllers are located

    shared/enums/ – all enums that are synchronized with the backend, for consistency

# About page
<img width="1920" height="955" alt="ERP-About-image" src="https://github.com/user-attachments/assets/67010ed6-be00-4656-a48f-01bfe71b88b9" />

# Defect List Page

The **Defect List** page is part of the **Quality Control** module.  

- The central section of the screen is dedicated to a single defect, with various search and filter options (by ID, code, name, description, severity, and status).  
- Below the defect search area, there is a table that lists all inspections related to the selected defect.  
- The table is currently limited to 10 rows per page, with navigation buttons (**Previous** and **Next**) to switch between pages.  
- Above the table, additional filters allow users to refine the inspection results by parameters such as status, confirmation, and date range.  
- The design intention for this page is to remain **user-friendly and easy to navigate**, ensuring that users can quickly find and manage defect-related inspections. 

<img width="1903" height="1120" alt="Exapmle-defect-list-page jsx" src="https://github.com/user-attachments/assets/bead4fa8-c8f9-46ee-b5b9-6864561b1539" />

# API integration and validation

The frontend uses Axios to communicate with backend REST API services. Each entity (eg items, users, invoices) has its own defined API methods for creating, updating, deleting and searching. Data validation and display of error messages have been implemented to make each interaction with the system clear to the user.

# Current status

Working on UI/UX design

# © 2025 G-Soft ERP System – All rights reserved. Property of Jovan Golic
