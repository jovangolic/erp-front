# Frontend – React + Vite

# Front-end is not finished yet, currently, work in progress

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

# API integration and validation

The frontend uses Axios to communicate with backend REST API services. Each entity (eg items, users, invoices) has its own defined API methods for creating, updating, deleting and searching. Data validation and display of error messages have been implemented to make each interaction with the system clear to the user.

# Current status

The frontend part is currently in an early stage of development (20%), but the key parts of the system are already defined and functional. The focus is on backend integration, user authentication, and the development of a basic user interface for managing warehouse operations.

© 2025 SLAM ERP – All rights reserved.
