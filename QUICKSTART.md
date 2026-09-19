# Quick Start Guide

## Frontend Only (Current Setup - Using LocalStorage)

The frontend is already running and fully functional with localStorage as the database.

### Access the Application
- **URL**: http://localhost:5173
- **Status**: ✅ Running

### What You Can Do Right Now:

1. **Create Your First Task**
   - Click "New Task" button on Dashboard or Tasks page
   - Fill in title, category, priority, dates
   - Add subtasks (optional but recommended)
   - Click "Create Task"

2. **Manage Subtasks**
   - Open a task by clicking on it
   - Add subtasks using the input at the bottom
   - Check/uncheck subtasks to see progress update in real-time
   - Edit or delete subtasks

3. **Track Progress**
   - Dashboard shows today's progress
   - Each task shows its own progress bar
   - Progress = (Completed Subtasks / Total Subtasks) × 100

4. **Filter and Search**
   - Use filters: All, Today, Upcoming, Overdue, etc.
   - Filter by category or priority
   - Search by task title

5. **Reschedule Tasks**
   - Open a task
   - Click the calendar icon
   - Select new due date

## Full Stack Setup (Frontend + Backend + PostgreSQL)

### Step 1: Install PostgreSQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Create Database
```bash
sudo -u postgres psql

postgres=# CREATE DATABASE productivity_db;
postgres=# CREATE USER productivity_user WITH PASSWORD 'your_password';
postgres=# GRANT ALL PRIVILEGES ON DATABASE productivity_db TO productivity_user;
postgres=# \q
```

### Step 3: Configure Backend
Edit `productivity-backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/productivity_db
spring.datasource.username=productivity_user
spring.datasource.password=your_password
```

### Step 4: Start Backend
```bash
cd productivity-backend
mvn spring-boot:run
```
Backend runs at: http://localhost:8080

### Step 5: Connect Frontend to Backend
Replace the mock API in `productivity-app/src/services/apiClient.ts` with real API calls.

## Testing the Application

### Basic Test Flow:

1. **Create 3 Tasks for Today:**
   - Task 1: "Learn Java Loops" with 5 subtasks
   - Task 2: "Python Arrays" with 4 subtasks  
   - Task 3: "DAA Sorting" with 6 subtasks

2. **Complete Some Subtasks:**
   - Java Loops: Complete 3/5 (60%)
   - Python Arrays: Complete 3/4 (75%)
   - DAA Sorting: Complete 6/6 (100%)

3. **Check Dashboard:**
   - Total Subtasks: 15
   - Completed: 12
   - Progress: 80%

4. **Test Edge Cases:**
   - Add a subtask to completed task → Progress recalculates
   - Delete a subtask → Progress updates
   - Uncomplete a subtask → Progress decreases

### Expected Results:
- ✅ All progress bars update in real-time
- ✅ Dashboard shows correct calculated values
- ✅ Task status changes automatically (Not Started → In Progress → Completed)
- ✅ Data persists after page refresh
- ✅ Filters work correctly
- ✅ Search finds tasks by title

## Troubleshooting

### Frontend won't start
```bash
cd productivity-app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend won't start
```bash
cd productivity-backend
mvn clean install
mvn spring-boot:run
```

### Database connection error
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify credentials in application.properties
- Check database exists: `psql -U postgres -l`

### CORS errors
- Backend CORS is configured for localhost:5173
- Make sure frontend runs on port 5173
- Check backend CORS config in CorsConfig.java

## Next Steps

1. ✅ Explore the UI - Create tasks, add subtasks, complete them
2. ✅ Test all filters and search
3. ✅ Check dashboard calculations
4. ⏳ Set up PostgreSQL backend (optional)
5. ⏳ Connect frontend to backend API
6. ⏳ Customize categories and priorities

## Support

For detailed documentation, see:
- `README.md` - Complete project documentation
- `productivity-backend/README.md` - Backend API documentation
- `productivity-app/README.md` - Frontend documentation

---

**Current Status**: Frontend is LIVE and fully functional! 🚀
