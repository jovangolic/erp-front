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

<img width="1903" height="1153" alt="Defects-list" src="https://github.com/user-attachments/assets/94e84ffa-b3e3-4d87-8ada-8d46d2554e91" />


# Creating new Defect, containing graph with random data
<img width="1903" height="3596" alt="Defects-add" src="https://github.com/user-attachments/assets/0824365f-0dcc-45aa-8463-2211fec3f4d3" />

# Edit defect, containing graph with random data
<img width="1903" height="3694" alt="Defects-edit" src="https://github.com/user-attachments/assets/70829a6e-5459-4664-8fe2-526ef2c09967" />


# API integration and validation

The frontend uses Axios to communicate with backend REST API services. Each entity (eg items, users, invoices) has its own defined API methods for creating, updating, deleting and searching. Data validation and display of error messages have been implemented to make each interaction with the system clear to the user.

# Example for running, the frontned part:
You can use VSC or other EDI, than in terminal do this: cd erp-front, npm install, npm run dev . After, open the browser, and write this http://localhost:5173/defects 
This is going to be the pattern, for the all components.

# Current status

Working on UI/UX design

# © 2025 G-Soft ERP System – All rights reserved. Property of Jovan Golic
