import sqlite3
from flask import Flask, g
import sys

DATABASE = 'reikuappdb.db'

app = Flask(__name__)

def get_db():
   db = getattr(g, '_database', None)
   if db is None:
       db = g._database = sqlite3.connect(DATABASE)
   return db

def query_db(query, args=(), one=False):
   cur = get_db().execute(query, args)
   rv = cur.fetchall()
   cur.close()
   return (rv[0] if rv else None) if one else rv

@app.route("/")
def hello():

   lugares = query_db('select * from lugares')
   print(lugares[0], file=sys.stderr)


   return "Hello World"
