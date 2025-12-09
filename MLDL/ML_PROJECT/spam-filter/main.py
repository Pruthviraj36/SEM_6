from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
import imaplib, email
from email.header import decode_header
from email.utils import parseaddr
import hashlib
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_bcrypt import Bcrypt
from datetime import datetime

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key_here' # Change this for production
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Models
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    emails = db.relationship('Email', backref='owner', lazy=True)

class Email(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender = db.Column(db.String(150), nullable=False)
    recipient = db.Column(db.String(150), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    folder = db.Column(db.String(50), default='inbox') # inbox, sent, trash, spam, archive
    is_read = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ML Setup
nltk.download('stopwords', quiet=True)
try:
    model = joblib.load('models/spam_model.pkl')
    vectorizer = joblib.load('models/vectorizer.pkl')
except:
    print("Models not found. Prediction will fail.")
    model = None
    vectorizer = None

# Routes
@app.route('/')
@login_required
def index():
    return render_template('index.html', user=current_user)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash('Login Unsuccessful. Please check username and password', 'danger')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user = User(username=username, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        flash('Your account has been created! You can now log in', 'success')
        return redirect(url_for('login'))
    return render_template('login.html', register=True) # Reuse login template

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/predict', methods=['POST'])
@login_required
def predict():
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500
    
    email_text = request.json.get('text', '')
    vec = vectorizer.transform([email_text])
        avatar_hash = hashlib.md5(email_address.encode('utf-8')).hexdigest()
        
        email_list.append({
            "id": mail.id,
            "from": mail.sender,
            "subject": mail.subject,
            "body": mail.body,
            "timestamp": mail.timestamp.strftime("%Y-%m-%d %H:%M"),
            "folder": mail.folder,
            "avatar_hash": avatar_hash
        })
    return jsonify(email_list)

@app.route("/send", methods=['POST'])
@login_required
def send_email():
    data = request.json
    new_email = Email(
        sender=current_user.username + "@protonclone.com",
        recipient=data['to'],
        subject=data['subject'],
        body=data['body'],
        folder='sent',
        user_id=current_user.id
    )
    db.session.add(new_email)
    db.session.commit()
    return jsonify({'success': True})

@app.route("/move", methods=['POST'])
@login_required
def move_email():
    data = request.json
    email_id = data['id']
    target_folder = data['folder']
    
    email_obj = Email.query.get(email_id)
    if email_obj and email_obj.user_id == current_user.id:
        email_obj.folder = target_folder
        db.session.commit()
        return jsonify({'success': True})
    return jsonify({'success': False}), 400

def init_db():
    with app.app_context():
        db.create_all()
        # Create a test user if not exists
        if not User.query.filter_by(username='test').first():
            hashed_pw = bcrypt.generate_password_hash('password').decode('utf-8')
            test_user = User(username='test', password=hashed_pw)
            db.session.add(test_user)
            
            # Add some mock emails
            emails = [
                Email(sender="promo@shop.com", recipient="test@protonclone.com", subject="Huge Sale!", body="50% off everything!", folder="inbox", user_id=1),
                Email(sender="boss@company.com", recipient="test@protonclone.com", subject="Meeting", body="See you at 10.", folder="inbox", user_id=1),
                Email(sender="scam@winner.com", recipient="test@protonclone.com", subject="You Won!", body="Click here to claim.", folder="spam", user_id=1),
            ]
            db.session.add_all(emails)
            db.session.commit()

if __name__ == '__main__':
    init_db()
    app.run(debug=True)