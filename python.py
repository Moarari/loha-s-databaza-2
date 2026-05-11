from flask import Flask, jsonify, request, send_from_directory
import os

app = Flask(__name__)

# Simulácia databázy v pamäti
people = [
    {"id": 1, "name": "Anna", "age": 25, "image": "https://via.placeholder.com/100"},
    {"id": 2, "name": "Peter", "age": 30, "image": "https://via.placeholder.com/100"}
]
next_id = 3

# Cesta k hlavnej stránke (index.html)
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# API: Načítanie a pridanie ľudí
@app.route('/api', methods=['GET', 'POST'])
def handle_people():
    global next_id
    if request.method == 'GET':
        return jsonify(people)
    
    if request.method == 'POST':
        new_person = request.get_json()
        new_person['id'] = next_id
        next_id += 1
        people.append(new_person)
        return jsonify(new_person), 201

# API: Vymazanie človeka
@app.route('/api/<int:person_id>', methods=['DELETE'])
def delete_person(person_id):
    global people
    people = [p for p in people if p['id'] != person_id]
    return '', 204

if __name__ == '__main__':
    # Render potrebuje port z prostredia alebo 5000, a host 0.0.0.0
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port))
