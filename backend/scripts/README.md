Generate Master Alats XLSX template

This script creates an `alats-template.xlsx` file in this folder with example headers and one sample row.

Notes about templates:
- `alats-template` sheet: the rows that will be imported. The `jenis` column may contain either an existing `jenis_alat` id or the `nama` of the jenis.
- `jenis-template` sheet: helper list of `id` and `nama` for `MasterJenisAlat`. You can copy the real `jenis` ids/names from your database into this sheet before import.
- `sites-template` sheet: helper list of site `id` and `name` to help provide valid `site` values.

If your import fails with `jenis_alat_id` null, ensure that the `jenis` value in the `alats-template` matches an existing `jenis` record (preferably by numeric id).

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
