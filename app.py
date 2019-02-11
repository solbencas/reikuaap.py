import sqlite3
from random import randint
from pprint import pprint
from flask import Flask, g, render_template
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
def index():
   lugares = query_db('select * from lugares')
   primer_item = lugares[randint(0, len(lugares) - 1)]
   pprint(lugares)
   return render_template("index.html", primer_item = primer_item)
