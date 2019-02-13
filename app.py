import sqlite3
from random import randint
from pprint import pprint
from flask import Flask, g, render_template, jsonify, url_for
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
   item = lugares[randint(0, len(lugares) - 1)]
   pprint(lugares)
   return render_template('index.html', item = item)


@app.route("/nosotros")
def nosotros():
   return render_template('nosotros.html')

@app.route('/json')
def json_response():
    lugares = query_db('select * from lugares')

    lugares_dict = []

    for i in lugares:
        lugares_dict.append({
            "titulo": i[1],
            "subtitulo": i[2],
            "latitud": i[3],
            "longitud": i[4],
            "imagen": i[5],
            "descripcion": i[6],
            "fuente": i[7],
        })

    return jsonify(lugares_dict)

@app.route('/insertar_score/<nombre>/<score>')
def score(nombre, score):

    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()

    item = [nombre, score]

    try:
        c.execute('insert into score (jugador, puntaje) values (?,?)', item)
    except sqlite3.IntegrityError as e:
        return jsonify({"success": False, "message": "Ha ocurrido un error al insertar los datos"})

    conn.commit()

    return jsonify({"success": True, "message": "Se han insertado los datos exitosamente"})


@app.route('/getscore')
def lista_scores ():
    scores=query_db('select * from score')
    return jsonify(scores)