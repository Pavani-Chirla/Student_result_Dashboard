import tornado.ioloop
import tornado.web
import mysql.connector
import json
import decimal

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "*")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, DELETE,PUT, OPTIONS")

    def options(self, *args, **kwargs):
        
        self.set_status(204)
        self.finish()
        print(args)
        print(kwargs)
    def initialize(self):
        
        self.db = mysql.connector.connect(
            host="localhost",
            user="root",          
            password="12345",  
            
            database="student_result"
        )
        self.cursor = self.db.cursor(dictionary=True)

    def on_finish(self):
        
        if self.cursor:
            self.cursor.close()
        if self.db:
            self.db.close()

class ResultsHandler(BaseHandler):
    def get(self):
        try:
            query = """
                SELECT s.s_id, s.name,
                       IFNULL(SUM(m.marks), 0) AS total_marks
                FROM students s
                LEFT JOIN marks m ON s.id = m.student_id
                GROUP BY s.s_id, s.name ORDER BY s_id
            """
            self.cursor.execute(query)
            results = self.cursor.fetchall()
            
            for r in results:
                for key, value in r.items():
                    if isinstance(value, decimal.Decimal):
                        r[key] = float(value)
            self.write(json.dumps(results))
        except Exception as e:
            self.set_status(500)
            self.write({"error": str(e)})

    def post(self):
        try:
            data = json.loads(self.request.body.decode("utf-8"))
            name = data.get("name")
            id=data.get("id")
            subject = data.get("subject")
            marks = data.get("marks")

            
            self.cursor.execute("SELECT id FROM students WHERE name = %s", (name,))
            student = self.cursor.fetchone()
            if student:
                student_id = student["id"]
            else:
                self.cursor.execute("INSERT INTO students (name,s_id) VALUES (%s,%s)", (name,id))
                student_id = self.cursor.lastrowid

            
            self.cursor.execute("SELECT id FROM subjects WHERE name = %s", (subject,))
            subject_row = self.cursor.fetchone()
            if subject_row:
                subject_id = subject_row["id"]
            else:
                self.cursor.execute("INSERT INTO subjects (name) VALUES (%s)", (subject,))
                subject_id = self.cursor.lastrowid

            
            self.cursor.execute(
                "INSERT INTO marks (student_id, subject_id, marks) VALUES (%s, %s, %s)",
                (student_id, subject_id, marks)
            )
            self.db.commit()

            self.write({"message": "Added successfully", "student_id": student_id})
        except Exception as e:
            self.set_status(500)
            self.write({"error": str(e)})
            
    

class ResultDetailHandler(BaseHandler):
    def get(self, student_id):
        try:
            self.cursor.execute("SELECT id,name FROM students WHERE s_id = %s", (student_id,))
            student = self.cursor.fetchone()
            if not student:
                self.set_status(404)
                self.write({"error": "Student not found"})
                return
        
            self.cursor.execute("""
                SELECT sub.name AS subject, m.marks
                FROM marks m 
                JOIN subjects sub ON m.subject_id = sub.id
                WHERE m.student_id = %s
            """, (student["id"],))
            marks = self.cursor.fetchall()

            result = {
                "s_id": student_id,
                "name": student["name"],
                "marks": marks
            }
            self.write(json.dumps(result))
        except Exception as e:
            self.set_status(500)
            self.write({"error": str(e)})

    def delete(self, student_id):
        try:
            self.cursor.execute("DELETE FROM students WHERE s_id = %s", (student_id,))
            self.db.commit()
            self.write({"message": "Deleted successfully"})
        except Exception as e:
            self.set_status(500)
            self.write({"error": str(e)})
            
    
    def put(self, student_id):
      try:
        data = json.loads(self.request.body.decode("utf-8"))
        subject_name = data.get("subject")
        new_marks = data.get("marks")
        new_name = data.get("name")  

        if not subject_name or new_marks is None:
            self.set_status(400)
            self.write({"error": "Missing subject or marks"})
            return

        if not (0 <= new_marks <= 100):
            self.set_status(400)
            self.write({"error": "Marks must be between 0 and 100"})
            return

       
        if new_name:
            self.cursor.execute("UPDATE students SET name = %s WHERE s_id = %s", (new_name.strip(), student_id))

        
        self.cursor.execute("SELECT id FROM subjects WHERE LOWER(name) = LOWER(%s)", (subject_name.strip().lower(),))
        subject = self.cursor.fetchone()

        if not subject:
            self.set_status(404)
            self.write({"error": f"Subject '{subject_name}' not found"})
            return

        subject_id = subject["id"]
        
        self.cursor.execute("SELECT id,name FROM students WHERE s_id = %s", (student_id,))
        student = self.cursor.fetchone()

        
        self.cursor.execute("""
            UPDATE marks SET marks = %s 
            WHERE student_id = %s AND subject_id = %s
        """, (new_marks, student["id"], subject_id))

        self.db.commit()
        self.write({"message": "Marks (and name if changed) updated successfully"})

      except Exception as e:
        self.set_status(500)
        self.write({"error": str(e)})


        
        
            
class AdminLoginHandler(BaseHandler):
    def post(self):
        try:
            data = json.loads(self.request.body.decode("utf-8"))
            username = data.get("username")
            password = data.get("password")

            self.cursor.execute("SELECT * FROM admins WHERE username = %s AND password = %s", (username, password))
            admin = self.cursor.fetchone()

            if admin:
                self.write({"success": True, "message": "Login successful"})
            else:
                self.set_status(401)
                
                self.write({"error": "Invalid admin credentials"})
        except Exception as e:
            self.set_status(500)
            self.write({"error": str(e)})


class AdminRegisterHandler(BaseHandler):
    def post(self):
        try:
            data = json.loads(self.request.body.decode("utf-8"))
            old_username = data.get("old_username")
            old_password = data.get("old_password")
            new_username = data.get("new_username")
            new_password = data.get("new_password")

            
            self.cursor.execute("SELECT * FROM admins WHERE username=%s AND password=%s", (old_username, old_password))
            admin = self.cursor.fetchone()

            if not admin:
                self.set_status(401)
                self.write({"error": "Invalid existing admin credentials"})
                return

            
            self.cursor.execute("SELECT * FROM admins WHERE username=%s", (new_username,))
            if self.cursor.fetchone():
                self.set_status(400)
                self.write({"error": "New admin username already exists"})
                return

            
            self.cursor.execute("INSERT INTO admins (username, password) VALUES (%s, %s)", (new_username, new_password))
            self.db.commit()

            self.write({"message": "New admin registered successfully!"})

        except Exception as e:
            self.set_status(500)
            self.write({"error": str(e)})



def make_app():
    return tornado.web.Application([
        (r"/results", ResultsHandler),
        (r"/results/([0-9]+)", ResultDetailHandler),
        (r"/admin/login", AdminLoginHandler),
        (r"/admin/register", AdminRegisterHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("✅ Tornado server running on http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()



