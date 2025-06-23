import tornado.ioloop
import tornado.web
import mysql.connector
import json
class base(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin","*")
        self.set_header("Access-Control-Allow-Headers","*")
        self.set_header("Access-Control-Allow-Methods","GET,POST,DELETE,OPTIONS")
    def options(self):
        self.set_status(204)
        self.finish()
    def initialize(self):
        self.db=mysql.connector.connect(
            host="localhost",
            user="root",
            password="12345",
            database="students"
        )
        self.cu=self.db.cursor(dictionary=True)
    def on_finish(self):
        if self.cu:
            self.cu.close
        if self.db:
            self.db.close
class AdminLogin(base):
    def post(self):
        try:
            data=json.loads(self.request.body.decode('utf-8'))
            username=data.get('username')
            password=data.get('password')
            self.cu.execute("select * from admins where username=%s and password=%s",(username,password))
            admin=self.cu.fetchone()
            if admin:
                self.write({"message":"True"})
            else:
                self.write({"message":"Invalid admin credentials"})
        except Exception as e:
            self.write({"message":str(e)})
class Dashboard(base):
    def get(self):
        query="""
            select s.s_id,s.name,sum(m.marks) as total from student s JOIN marks m ON m.student_id = s.s_id
        GROUP BY s.s_id, s.name
            """
        self.cu.execute(query)
        student=self.cu.fetchall()
        for s in student:
            s["total"]=float(s["total"])
        self.write(json.dumps(student))
class Delete(base):
    def delete(self):
        try:
            data=json.loads(self.request.body.decode('utf-8'))
            print(data)
            s_id=data.get('e')
            print(s_id)
            self.cu.execute("delete from student where s_id=%s",(s_id,))
            self.db.commit()
            self.write({"message":"deleted successfully"})
        except Exception as e:
            self.write({"message":str(e)})
class Add(base):
    def post(self):
      try:
        data = json.loads(self.request.body)
        s_id = data["id"]
        name = data["name"]
        subjects = data["sub"]
        marks = data["mark"]

        self.cu.execute("INSERT INTO student (s_id, name) VALUES (%s, %s)", (s_id, name))

        for sub, mark in zip(subjects, marks):
            self.cu.execute("SELECT id FROM subject WHERE name = %s", (sub,))
            result = self.cu.fetchone()
            if result:
                subject_id = result["id"]
            else:
                self.cu.execute("INSERT INTO subject (name) VALUES (%s)", (sub,))
                subject_id = self.cu.lastrowid

            self.cu.execute(
                "INSERT INTO marks (student_id, subject_id, marks) VALUES (%s, %s, %s)",
                (s_id, subject_id, mark)
            )

        self.db.commit()
        self.write({"message": "Student result added successfully"})

      except Exception as e:
        self.db.rollback()
        self.write({"message": f"Error: {str(e)}"})
class studentdetail(base):
    def get(self, s_id):
        self.cu.execute("""
            SELECT subject.name AS subject, marks.marks
            FROM marks
            JOIN subject ON marks.subject_id = subject.id
            WHERE marks.student_id = %s
        """, (s_id,))
        data = self.cu.fetchall()
        self.write(json.dumps(data))
def app():
    return tornado.web.Application([
        (r"/",AdminLogin),
        (r"/dashboard",Dashboard),
        (r"/delete",Delete),
        (r"/add",Add),
        (r"/student/([0-9]+)", studentdetail)
        ])
v=app()
v.listen(8888)
print("http://localhost:8888")
tornado.ioloop.IOLoop.current().start()
