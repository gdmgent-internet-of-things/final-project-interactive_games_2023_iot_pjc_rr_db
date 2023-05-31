from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect
from flask_wtf.csrf import generate_csrf
from flask_login import current_user, login_required, UserMixin
from werkzeug.utils import secure_filename
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, FileField
from wtforms.validators import DataRequired, Email, EqualTo
import os
from alembic import op
import sqlalchemy as sa


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'secretkey'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login_manager = LoginManager(app)



class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False, server_default='')


    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Register')
 
 
class Leaderboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False)
    score = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f"Leaderboard(username='{self.username}', score={self.score})"

with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
     return render_template('home.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username).first()
        if user is None or not user.verify_password(password):
            error_message = 'Invalid username or password'
            return render_template('login.html', error_message=error_message)
        login_user(user)
        return redirect(url_for('home'))
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if User.query.filter_by(username=username).first():
            flash('Username already exists')
            return redirect(url_for('register'))

        new_user = User(username=username)
        new_user.password = password

        db.session.add(new_user)
        db.session.commit()

        return redirect(url_for('login'))

    return render_template('register.html')


@app.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    logout_user()
    flash('You have been logged out')
    return redirect(url_for('home'))


@app.route('/game1')
@login_required
def game1():
    return render_template('game1.html')

@app.route('/game2')
@login_required
def game2():
    return render_template('game2.html')

@app.route('/game3')
@login_required
def game3():
    return render_template('game3.html')


@app.route('/leaderboard', methods=['GET', 'POST'])
@login_required
def leaderboard():
    if request.method == 'POST':
        score = request.form.get('score') 
        if score is not None:
            score = int(score)
            leaderboard_entry = Leaderboard.query.filter_by(username=current_user.username).first()
            if leaderboard_entry:
                if score > leaderboard_entry.score:
                    leaderboard_entry.score = score
            else:
                leaderboard_entry = Leaderboard(username=current_user.username, score=score)
                db.session.add(leaderboard_entry)
            db.session.commit()
        return "Score updated", 200
    else:
        scores = Leaderboard.query.order_by(Leaderboard.score.desc()).all()
        return render_template('leaderboard.html', scores=scores)



@app.route('/users')
@login_required
def users():
    all_users = User.query.all()
    return render_template('users.html', all_users=all_users)
