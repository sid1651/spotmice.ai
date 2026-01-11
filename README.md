
so for the ai sugetion the ai sugetion will pop up u nead to doubel clike on it to get permenatly and it will be shared or else the ai sugetion will be lost 

Step 1: Clone the Repository
git clone https://github.com/your-username/real_time_music_collaboration.git
cd real_time_music_collaboration

mongod db is tracking the version and all the projects are being saved 
the ui is not so greate but i did it max i coud do in 4 days 
I have hard code all the api since this was the asesment u dont need to change anything just look for the env.




🧠 Step 2: Backend Setup (Server)
1️⃣ Move into server directory
cd server

2️⃣ Install backend dependencies
npm install

3️⃣ Create environment file

Create a file named .env inside server/

PORT=5000
MONGO_URI=mongodb://localhost:27017/spotmice
GEMINI_API_KEY=YOUR_GEMINI_API_KEY


🔑 Get Gemini API key from
https://aistudio.google.com/app/apikey
4️⃣ Start MongoDB (if not running)
Windows
mongod
macOS / Linux
sudo systemctl start mongod
Verify:
mongo

5️⃣ Start Backend Server
npm run dev
Backend will run at:
http://localhost:5000
🎨 Step 3: Frontend Setup (Client)
1️⃣ Open a new terminal
Navigate to project root again:
cd ..
cd client

2️⃣ Install frontend dependencies
npm install

3️⃣ Start frontend
npm run dev
Frontend will run at:
http://localhost:5173
🎹 Step 4: Use the Application
Open http://localhost:5173
Enter your name
Enter a room ID
Double-click on grid to add notes
Drag notes to edit
Click 🤖 AI Harmony
Accept or Reject AI suggestions
Open another browser/tab → join same room ID
Refresh page → project reloads from MongoDB
💾 Step 5: Verify MongoDB Data
Open Mongo shell:
mongo
use music_collab
db.projects.find().pretty()
You should see saved notes and project IDs.
🧪 Common Issues & Fixes
❌ Gemini AI not working
✔ Check .env API key
✔ Restart backend
npm run dev
✔ Ensure backend is running
✔ Same room ID in all tabs
✔ Ensure mongod is running
✔ Check console logs for 💾 Project saved

🛑 Stop the Project

Press CTRL + C in both terminals.

 so other way is just docker compose up built but if u run frontend in docker some styling is lost and some feccers are also lost so the best way it install all dependency and run localy atleast run frotend withoud docker to get maximum benifits and stars or review can help me motivate and help me make make more such projects .
