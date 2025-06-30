# Frontend – React + Vite

The frontend of the SLAM ERP system application is developed in a modern JavaScript environment using React in combination with Vita for fast build and hot-reloading during development. The goal is to create an intuitive and responsive user interface that enables easy management of storage, logistics and finances.

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
