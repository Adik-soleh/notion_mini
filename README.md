# Mini Notion Clone 📝

Sebuah aplikasi web pencatatan berbasis blok yang terinspirasi dari Notion, dibangun menggunakan Express.js dan Vue.js dengan fitur drag & drop dan autentikasi JWT.

## 📋 Deskripsi Project

Mini Notion Clone adalah sistem pencatatan (note) berbasis web yang memungkinkan pengguna membuat dan mengedit note dengan format blok (text, checklist, image, code). Aplikasi ini dilengkapi dengan autentikasi JWT menggunakan HTTP-Only Cookie dan mendukung drag & drop untuk mengubah urutan blok dalam note.

## Jalankan Project 


## 🚀 Installation & Setup

### Prerequisites
- Node.js (v22)
- MySQL/PostgreSQL
- npm atau yarn

### 1. Clone Repository
```bash
git clone <https://gitlab.com/adiksoleh4/teknikal-tes>
cd mini-notion-clone
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Buat file `.env` di folder backend:
```env
DATABASE_URL="mysql://root:passwordbaru123@localhost:3306/notion_clone_db_new"  (sesuaikan db url anda)
JWT_SECRET="asdasdasd"
```

Jalankan migrasi database:
```bash
npm run migrate
```

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Buat file `.env` di folder frontend:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

Start frontend development server:
```bash
npm run dev
```

## 🔧 Development Commands

### Backend
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```


## ✨ Fitur Utama

### 🔐 Authentication
- **Registrasi & Login** menggunakan email & password
- **JWT Token** disimpan dalam HTTP-Only Cookie untuk keamanan
- **Authorization** - User hanya dapat mengakses note miliknya sendiri
- **Logout** dengan penghapusan cookie JWT

### 📝 Notes Management
- **CRUD Operations** - Create, Read, Update, Delete notes
- **Block-Based Structure** - Setiap note terdiri dari blok-blok konten
- **Auto-save** - Perubahan tersimpan otomatis

### 🧩 Block-Based Editor
- **Text Block** - Rich text editor untuk paragraf
- **Checklist Block** - Task list dengan checkbox interaktif
- **Image Block** - Penyisipan gambar dengan URL
- **Code Block** - Editor kode dengan syntax highlighting
- **Drag & Drop** - Mengubah urutan blok dengan mudah

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **MySQL** - Database
- **bcryptjs** - Password hashing
- **cookie-parser** - Cookie handling

### Frontend
- **Vue.js 3** - Progressive framework
- **Vue Router** - Routing
- **Vuex** - State management
- **Sortable.js** - Drag & drop functionality


## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Notes
- `GET /api/notes` - Get all user notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Blocks
- `GET /api/notes/:noteId/blocks` - Get all blocks in note
- `POST /api/notes/:noteId/blocks` - Create new block
- `PUT /api/blocks/:id` - Update block
- `DELETE /api/blocks/:id` - Delete block
- `PUT /api/blocks/reorder` - Reorder blocks

## 🎨 Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── blocks/
│   │   │   ├── TextBlock.vue
│   │   │   ├── ChecklistBlock.vue
│   │   │   ├── ImageBlock.vue
│   │   │   └── CodeBlock.vue
│   │   ├── editor/
│   │   │   ├── BlockEditor.vue
│   │   │   └── DragDropContainer.vue
│   │   └── layout/
│   │       ├── Header.vue
│   │       └── Sidebar.vue
│   ├── pages/
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Dashboard.vue
│   │   └── NotePage.vue
│   ├── stores/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   └── blocks.js
│   └── router/
│       └── index.js
```


## 📝 Usage Guide

1. **Registrasi/Login** - Buat akun baru atau login dengan akun existing
2. **Membuat Note** - Klik tombol "New Note" untuk membuat note baru
3. **Menambah Blok** - Klik tombol "+" untuk menambah blok baru
4. **Edit Konten** - Klik pada blok untuk mengedit konten
5. **Drag & Drop** - Seret blok untuk mengubah urutan
6. **Auto-save** - Perubahan tersimpan otomatis

## 🔒 Security Features

- Password hashing menggunakan bcryptjs
- JWT token disimpan dalam HTTP-Only Cookie
- CORS protection
- Input validation dan sanitization
- XSS protection

## 📦 Deployment


## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**adik soleh** - [adiksoleh4@gmal.com]

## 🙏 Acknowledgments

- Notion untuk inspirasi design dan functionality
- Vue.js community untuk dokumentasi yang excellent
- Express.js untuk framework yang solid dan reliable

---

**Happy Coding! 🚀**