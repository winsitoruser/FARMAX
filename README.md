# Farmanesia Platform B2B ERP

Proyek ini adalah implementasi frontend untuk Platform B2B ERP Farmanesia, menggunakan Next.js dengan TypeScript dan Tailwind CSS.

## Arsitektur Sistem

Proyek ini mengimplementasikan arsitektur sistem Farmanesia yang terdiri dari beberapa lapisan:

1. **Farmanesia Parent System**
   - Admin Dashboard (Manajemen Mitra & Pelaporan Global)
   - Monitoring Center (Pelacakan Aktivitas & Analitik Lintas Mitra)
   - System Admin (Konfigurasi Tenant & Manajemen Akses)

2. **Multi-tenant Management Layer**
   - Tenant Router
   - Role Manager
   - API Gateway
   - Data Aggregator

3. **Partner ERP System Modules**
   - **Core Modules**
     - POS System
     - Pharmacy
     - Inventory
     - Finance
     - Procurement
     - CRM
     - Reports
     - Compliance
     - Admin
   - **Multi-branch Management**
     - Branch Admin
     - Stock Transfer
     - Permissions
     - Cross Access
     - Unified Sales
     - Staff Management
     - Branch Reports
     - Role Matrix

4. **Data Layer**
   - Tenant Databases
   - Consolidated Data Warehouse
   - System Configuration Store

5. **Integration Layer**
   - BPJS/Asuransi
   - BPOM
   - Payment Gateway
   - External Systems

## Memulai Pengembangan

Pertama, jalankan server pengembangan:

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) dengan browser Anda untuk melihat hasilnya.

## Struktur Folder

Proyek ini menggunakan struktur folder berikut:

- `/pages` - Halaman-halaman aplikasi
- `/modules` - Modul-modul bisnis sesuai arsitektur sistem
- `/components` - Komponen UI yang dapat digunakan kembali
- `/hooks` - Custom React hooks
- `/lib` - Utilitas dan fungsi-fungsi helper
- `/public` - Aset statis seperti gambar dan ikon
- `/styles` - File-file CSS global dan konfigurasi Tailwind

## Teknologi yang Digunakan

- Next.js
- TypeScript
- Tailwind CSS
- React
- ShadcnUI
