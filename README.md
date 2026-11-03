# ⌨️ TypeMaster – Typing Speed Test Application

**Practice. Improve. Master your typing.**

TypeMaster is a web-based Typing Speed Test Application built using Python and Django. It helps users measure their typing speed, accuracy, and overall typing performance through timed typing tests.

## 🌐 Live Demo

[**Open TypeMaster Website**](https://typingspeedtest-hzhd.onrender.com/)

## 📂 GitHub Repository

[**View Source Code**](https://github.com/RohanJagtap431/TypingSpeedTest)

## ✨ Features

- Typing tests with Easy, Medium, and Hard difficulty levels.
- Multiple test durations: 1, 2, and 5 minutes.
- Real-time Words Per Minute (WPM) calculation.
- Typing accuracy calculation.
- Correct and incorrect character tracking.
- Automatic test result saving.
- Performance Dashboard with statistics.
- Typing performance graph.
- Test History management.
- Individual test result deletion.
- Clear all test history option for Admin.
- Responsive user interface for desktop and mobile devices.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend Programming |
| Django | Web Framework |
| HTML5 | Page Structure |
| CSS3 | Styling and Responsive Design |
| JavaScript | Typing Test Logic |
| PostgreSQL | Database |
| Neon | Cloud Database Hosting |
| Render | Web Application Hosting |
| Git & GitHub | Version Control |

## 📸 Application Modules

### 1. Home Page
Introduction to TypeMaster and quick access to typing tests.

### 2. Typing Test
Users can select difficulty and duration, complete typing tests, and view live performance metrics.

### 3. Performance Dashboard
Displays typing statistics, performance graphs, and previous test results.

### 4. Admin Management
Admin can delete individual test records or clear all history.

## ⚙️ Run Locally

### Step 1: Clone Repository

```bash
git clone https://github.com/RohanJagtap431/TypingSpeedTest.git
```

### Step 2: Open Project Folder

```bash
cd TypingSpeedTest
```

### Step 3: Create Virtual Environment

```bash
python -m venv venv
```

### Step 4: Activate Virtual Environment

Windows:

```powershell
venv\Scripts\activate
```

### Step 5: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 6: Configure Environment Variables

Create a `.env` file in the project root directory.

Configure these variables:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
DATABASE_URL=your-postgresql-database-url
```

Do not upload your `.env` file to GitHub.

### Step 7: Apply Migrations

```bash
python manage.py migrate
```

### Step 8: Create Admin Account

```bash
python manage.py createsuperuser
```

### Step 9: Start Development Server

```bash
python manage.py runserver
```

Open:

http://127.0.0.1:8000/

## 🎯 Project Objective

The main objective of TypeMaster is to provide a simple and interactive platform for improving typing speed and accuracy while tracking typing performance over time.

## 👨‍💻 Developer

**Rohan Jagtap**

B.Sc. Computer Science Student

GitHub: [RohanJagtap431](https://github.com/RohanJagtap431)

---

**TypeMaster – Practice. Improve. Master your typing.**
