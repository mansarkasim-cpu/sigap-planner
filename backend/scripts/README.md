Generate Master Alats XLSX template

This script creates an `alats-template.xlsx` file in this folder with example headers and one sample row.

Prerequisites
- Node.js installed
- The project `backend` dependencies include `xlsx`. If not installed, run from repository root:

```
cd backend
npm install
```

Run

```
node backend/scripts/generate-alats-template.js
```

The file `backend/scripts/alats-template.xlsx` will be created. You can edit the headers or add rows as needed before importing via the Master Alat upload UI.
