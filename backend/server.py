from flask import Flask, send_from_directory
from veiculos import veiculos_bp
import os

app = Flask(__name__, static_url_path='', static_folder='static')
app.register_blueprint(veiculos_bp)

@app.route('/')
def home():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
