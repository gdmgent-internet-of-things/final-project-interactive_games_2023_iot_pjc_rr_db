from flask import Flask
from config import Config
from .auth.routes import auth
from .main.routes import main

app = Flask(__name__)
app.config.from_object(Config)

app.register_blueprint(auth)
app.register_blueprint(main)

if __name__ == '__main__':
    app.run(debug=True)
