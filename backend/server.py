from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_premium: bool = False

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Habit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    category: str
    color: str
    icon: str
    streak: int = 0
    completions: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HabitCreate(BaseModel):
    name: str
    category: str
    color: str = "#4F46E5"
    icon: str = "target"

class HabitComplete(BaseModel):
    date: str

class Expense(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    amount: float
    category: str
    description: str
    date: str
    payment_method: str = "UPI"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ExpenseCreate(BaseModel):
    amount: float
    category: str
    description: str
    date: str
    payment_method: str = "UPI"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return User(**user)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@api_router.post("/auth/signup")
async def signup(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user_data.password)
    user = User(email=user_data.email, name=user_data.name)
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['password'] = hashed_password
    
    await db.users.insert_one(user_dict)
    token = create_access_token(data={"sub": user.id})
    return {"token": token, "user": user}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(credentials.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_doc.pop('password', None)
    if isinstance(user_doc['created_at'], str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    user = User(**user_doc)
    token = create_access_token(data={"sub": user.id})
    return {"token": token, "user": user}

@api_router.get("/user/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.post("/habits", response_model=Habit)
async def create_habit(habit_data: HabitCreate, current_user: User = Depends(get_current_user)):
    habit = Habit(user_id=current_user.id, **habit_data.model_dump())
    habit_dict = habit.model_dump()
    habit_dict['created_at'] = habit_dict['created_at'].isoformat()
    await db.habits.insert_one(habit_dict)
    return habit

@api_router.get("/habits", response_model=List[Habit])
async def get_habits(current_user: User = Depends(get_current_user)):
    habits = await db.habits.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    for habit in habits:
        if isinstance(habit.get('created_at'), str):
            habit['created_at'] = datetime.fromisoformat(habit['created_at'])
    return habits

@api_router.post("/habits/{habit_id}/complete")
async def complete_habit(habit_id: str, completion: HabitComplete, current_user: User = Depends(get_current_user)):
    habit = await db.habits.find_one({"id": habit_id, "user_id": current_user.id}, {"_id": 0})
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    completions = habit.get('completions', [])
    if completion.date not in completions:
        completions.append(completion.date)
        completions.sort()
        
        streak = 0
        today = datetime.now(timezone.utc).date()
        for i in range(len(completions) - 1, -1, -1):
            comp_date = datetime.fromisoformat(completions[i]).date()
            expected_date = today - timedelta(days=streak)
            if comp_date == expected_date:
                streak += 1
            else:
                break
        
        await db.habits.update_one(
            {"id": habit_id},
            {"$set": {"completions": completions, "streak": streak}}
        )
    
    updated_habit = await db.habits.find_one({"id": habit_id}, {"_id": 0})
    if isinstance(updated_habit.get('created_at'), str):
        updated_habit['created_at'] = datetime.fromisoformat(updated_habit['created_at'])
    return Habit(**updated_habit)

@api_router.delete("/habits/{habit_id}")
async def delete_habit(habit_id: str, current_user: User = Depends(get_current_user)):
    result = await db.habits.delete_one({"id": habit_id, "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Habit not found")
    return {"message": "Habit deleted"}

@api_router.post("/expenses", response_model=Expense)
async def create_expense(expense_data: ExpenseCreate, current_user: User = Depends(get_current_user)):
    expense = Expense(user_id=current_user.id, **expense_data.model_dump())
    expense_dict = expense.model_dump()
    expense_dict['created_at'] = expense_dict['created_at'].isoformat()
    await db.expenses.insert_one(expense_dict)
    return expense

@api_router.get("/expenses", response_model=List[Expense])
async def get_expenses(current_user: User = Depends(get_current_user)):
    expenses = await db.expenses.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    for expense in expenses:
        if isinstance(expense.get('created_at'), str):
            expense['created_at'] = datetime.fromisoformat(expense['created_at'])
    return expenses

@api_router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: str, current_user: User = Depends(get_current_user)):
    result = await db.expenses.delete_one({"id": expense_id, "user_id": current_user.id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted"}

@api_router.get("/stats")
async def get_stats(current_user: User = Depends(get_current_user)):
    habits = await db.habits.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    expenses = await db.expenses.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    
    total_habits = len(habits)
    total_streak = sum(h.get('streak', 0) for h in habits)
    max_streak = max([h.get('streak', 0) for h in habits], default=0)
    
    total_expenses = sum(e.get('amount', 0) for e in expenses)
    expense_count = len(expenses)
    
    return {
        "total_habits": total_habits,
        "total_streak": total_streak,
        "max_streak": max_streak,
        "total_expenses": total_expenses,
        "expense_count": expense_count
    }

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()