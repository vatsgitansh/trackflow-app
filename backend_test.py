import requests
import sys
import json
from datetime import datetime, timedelta

class HabitTrackerAPITester:
    def __init__(self, base_url="https://everyday-assistant.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (Expected: {expected_status})"
                try:
                    error_data = response.json()
                    details += f", Response: {error_data}"
                except:
                    details += f", Response: {response.text[:200]}"
            
            self.log_test(name, success, details)
            
            if success:
                try:
                    return response.json()
                except:
                    return {}
            return None

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return None

    def test_signup(self):
        """Test user signup"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_data = {
            "name": f"Test User {timestamp}",
            "email": f"test{timestamp}@example.com",
            "password": "TestPass123!"
        }
        
        response = self.run_test(
            "User Signup",
            "POST",
            "auth/signup",
            200,
            data=test_data
        )
        
        if response and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            return True
        return False

    def test_login(self):
        """Test user login with existing credentials"""
        if not self.token:
            return False
            
        # Create a new user for login test
        timestamp = datetime.now().strftime('%H%M%S') + "login"
        signup_data = {
            "name": f"Login Test User {timestamp}",
            "email": f"login{timestamp}@example.com", 
            "password": "LoginPass123!"
        }
        
        # First signup
        signup_response = self.run_test(
            "Login Test - Signup",
            "POST", 
            "auth/signup",
            200,
            data=signup_data
        )
        
        if not signup_response:
            return False
            
        # Then login
        login_data = {
            "email": signup_data["email"],
            "password": signup_data["password"]
        }
        
        response = self.run_test(
            "User Login",
            "POST",
            "auth/login", 
            200,
            data=login_data
        )
        
        return response and 'token' in response

    def test_get_profile(self):
        """Test get user profile"""
        response = self.run_test(
            "Get User Profile",
            "GET",
            "user/profile",
            200
        )
        return response is not None

    def test_create_habit(self):
        """Test creating a habit"""
        habit_data = {
            "name": "Test Habit",
            "category": "Health",
            "color": "#4F46E5",
            "icon": "target"
        }
        
        response = self.run_test(
            "Create Habit",
            "POST",
            "habits",
            200,
            data=habit_data
        )
        
        if response and 'id' in response:
            return response['id']
        return None

    def test_get_habits(self):
        """Test getting habits"""
        response = self.run_test(
            "Get Habits",
            "GET", 
            "habits",
            200
        )
        return response is not None

    def test_complete_habit(self, habit_id):
        """Test completing a habit"""
        if not habit_id:
            return False
            
        completion_data = {
            "date": datetime.now().isoformat()
        }
        
        response = self.run_test(
            "Complete Habit",
            "POST",
            f"habits/{habit_id}/complete",
            200,
            data=completion_data
        )
        return response is not None

    def test_delete_habit(self, habit_id):
        """Test deleting a habit"""
        if not habit_id:
            return False
            
        response = self.run_test(
            "Delete Habit",
            "DELETE",
            f"habits/{habit_id}",
            200
        )
        return response is not None

    def test_create_expense(self):
        """Test creating an expense"""
        expense_data = {
            "amount": 500.0,
            "category": "Food",
            "description": "Test lunch expense",
            "date": datetime.now().strftime('%Y-%m-%d'),
            "payment_method": "UPI"
        }
        
        response = self.run_test(
            "Create Expense",
            "POST",
            "expenses",
            200,
            data=expense_data
        )
        
        if response and 'id' in response:
            return response['id']
        return None

    def test_get_expenses(self):
        """Test getting expenses"""
        response = self.run_test(
            "Get Expenses",
            "GET",
            "expenses", 
            200
        )
        return response is not None

    def test_delete_expense(self, expense_id):
        """Test deleting an expense"""
        if not expense_id:
            return False
            
        response = self.run_test(
            "Delete Expense",
            "DELETE",
            f"expenses/{expense_id}",
            200
        )
        return response is not None

    def test_get_stats(self):
        """Test getting user stats"""
        response = self.run_test(
            "Get User Stats",
            "GET",
            "stats",
            200
        )
        return response is not None

    def run_all_tests(self):
        """Run comprehensive API tests"""
        print("🚀 Starting Habit Tracker API Tests...")
        print(f"Testing against: {self.base_url}")
        print("=" * 50)

        # Test authentication flow
        if not self.test_signup():
            print("❌ Signup failed - stopping tests")
            return False

        self.test_login()
        self.test_get_profile()

        # Test habits flow
        habit_id = self.test_create_habit()
        self.test_get_habits()
        
        if habit_id:
            self.test_complete_habit(habit_id)
            self.test_delete_habit(habit_id)

        # Test expenses flow  
        expense_id = self.test_create_expense()
        self.test_get_expenses()
        
        if expense_id:
            self.test_delete_expense(expense_id)

        # Test stats
        self.test_get_stats()

        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return False

def main():
    tester = HabitTrackerAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_reports/backend_test_results.json', 'w') as f:
        json.dump({
            "summary": {
                "total_tests": tester.tests_run,
                "passed_tests": tester.tests_passed,
                "success_rate": f"{(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%",
                "timestamp": datetime.now().isoformat()
            },
            "test_results": tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())