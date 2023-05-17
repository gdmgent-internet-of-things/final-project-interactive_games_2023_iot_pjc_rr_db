from flask import Blueprint, render_template

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/game1')
def game1():
    return render_template('game1.html')

@main.route('/game2')
def game2():
    return render_template('game2.html')

@main.route('/game3')
def game3():
    return render_template('game3.html')
