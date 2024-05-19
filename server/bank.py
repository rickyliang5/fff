import logging
from logging.config import dictConfig
from flask import Flask, request, jsonify, session,render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from datetime import datetime
from sqlalchemy import func
from werkzeug.utils import secure_filename
import random
import string
import pytesseract
from PIL import Image
import os



dictConfig({
    'version': 1,
    'formatters': {'default': {
        'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    }},
    'handlers': {'wsgi': {
        'class': 'logging.StreamHandler',
        'stream': 'ext://flask.logging.wsgi_errors_stream',
        'formatter': 'default'
    }},
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bank.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = '1234'
app.config["SESSION_COOKIE_SAMESITE"] = "None"
app.config["SESSION_COOKIE_SECURE"] = True
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = 'C:/Users/Arya/OneDrive/Desktop/Checks'
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    accounts = db.relationship('Account', backref='user', lazy=True)


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    register_date = db.Column(db.DateTime, nullable=False, default=datetime.now)
    account_number = db.Column(db.String(6), unique=True, nullable=False)
    pin = db.Column(db.String(4), nullable=False)
    balance = db.Column(db.Integer, nullable=False, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

class Transactions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    account_number = db.Column(db.String(6), nullable=False)
    transaction_type = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class Management(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)


def serialize(self):
    return {
        'id': self.id,
        'username': self.username,
        'email': self.email,
    }


def generate_account_number():
    return ''.join(random.choices(string.digits, k=6))


def unique_id(user_id, account_number):
    existing_account = Account.query.filter_by(user_id=user_id, account_number=account_number).first()
    return existing_account is None


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if not all([data.get('email'), data.get('username'), data.get('password')]):
        return jsonify({'error': 'All fields are required'}), 400

    if User.query.filter((User.email == data['email']) | (User.username == data['username'])).first():
        return jsonify({'error': 'Email or username already exists'}), 400

    new_user = User(username=data['username'], password=data['password'], email=data['email'])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get('username'), password=data.get('password')).first()
    if user:
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful', 'username': user.username}), 200
    return jsonify({'error': 'Invalid username or password'}), 401


@app.route('/ATMlogin', methods=['POST'])
def ATMlogin():
    data = request.json
    account = Account.query.filter_by(account_number=data.get('number'), pin=data.get('pin')).first()
    if account:
        session['user_id'] = account.user_id
        session['user_atm_account_number'] = account.account_number
        return jsonify({'message': 'Login successful', 'account_number': session.get('user_atm_account_number'),
                        'user_id': account.user_id}), 200
    else:
        return jsonify({'error': 'Invalid account number or PIN'}), 401
    

@app.route('/MGMTLogin', methods = ['POST'])
def MGMTLogin():
    data = request.json
    user = Management.query.filter_by(username=data.get('username'), password=data.get('password')).first()
    if user:
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful', 'username': user.username}), 200
    return jsonify({'error': 'Invalid username or password'}), 401

@app.route('/Transfer', methods=['GET', 'POST'])
def Transfer():
    data = request.get_json()

    initial_account = Account.query.filter_by(account_number=data['initialAccount']).first()
    if not initial_account or initial_account.pin != data['pin']:
        return {"error": "Invalid initial account number or PIN."}, 400

    destination_account = Account.query.filter_by(account_number=data['destinationAccount']).first()
    if not destination_account:
        return {"error": "Invalid destination account number."}, 400

    balance = int(data['deposit'])
    if initial_account.balance < balance:
        return {"error": "Insufficient balance in initial account."}, 400

    initial_account.balance -= balance
    destination_account.balance += balance

    db.session.commit()

    return {"message": "Transfer successful."}, 200


@app.route('/bank', methods=['GET'])
def bank():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            accounts_info = []
            for account in user.accounts:
                accounts_info.append({
                    'account_number': account.account_number,
                    'balance': account.balance
                })
            return jsonify({'username': user.username, 'accounts': accounts_info}), 200
    return jsonify({'error': 'Unauthorized'}), 401


@app.route("/runReport/<accountNumber>", methods = ['GET'])
def runReport(accountNumber):
    app.logger.info('testing info log')
    # Assuming 'account_number' is used to filter accounts
    accounts = Account.query.filter_by(account_number=accountNumber).all()
    if accounts:
        accounts_info = []
        for account in accounts:
            accounts_info.append({
                'account_number': account.account_number,
                'balance': account.balance
            })
        # Assuming you want to return the username of the first account
        return jsonify({'username': accounts[0].user.username, 'accounts': accounts_info}), 200
    return jsonify({'error': 'No accounts found'}), 404


@app.route('/ATM', methods=['GET', 'POST'])
def ATM():
    account_number = session.get('user_atm_account_number')
    account = Account.query.filter_by(account_number=account_number).first()
    if not account:
        return jsonify({'error': 'No account number found in session'}), 401
    if account:
        return jsonify({'balance': account.balance, 'account_number': account.account_number}), 200
    else:
        return jsonify({'error': 'Unauthorized'}), 401


@app.route('/ATMupdate', methods=['GET', 'POST'])
def ATMupdate():
    account_number = session.get('user_atm_account_number')
    account = Account.query.filter_by(account_number=account_number).first()
    if account:
        new_balance = request.json.get('newBalance')
        account.balance = new_balance
        db.session.commit()
        return jsonify({'message': 'Balance Updated'}), 200
    return jsonify({'error': 'Unauthorized'}), 401


@app.route('/upload', methods=['POST', 'GET'])
def upload_file():
    user_id = session.get('user_id')
    if 'file' not in request.files:
        return 'No image part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if file:
        filename = secure_filename(file.filename)
        file.save(filename)
        data = pytesseract.image_to_string(Image.open(filename))
        position = data.find('$')
        if position == -1:
            return 'Dollar sign not found in the image', 400
        amount = []
        position += 1
        while position < len(data) and (data[position].isdigit() or data[position] == '.'):
            amount.append(data[position])
            position += 1
        extracted_amount = float(''.join(amount))
        expected_amount = float(request.form['amount'])
        if extracted_amount == expected_amount:
            account = Account.query.filter_by(account_number=request.form['number']).first()
            if account:
                new_balance = extracted_amount + account.balance
                account.balance = new_balance
                db.session.commit()
                return jsonify({'message': 'Balance Updated'}), 200
            else:
                return 'Account not found', 404
        else:
            return 'Amount mismatch', 400
    return 'Failed to process file', 400


# backend connecting to grab data from the database, serialized is used to format data to json with the frontend can use in the table
@app.route('/data', methods=['GET'])
def get_data():
    accounts = Account.query.all()
    serialized_data = [{
                        'account_id': account.id,
                        'register_date': account.register_date,
                        'account_number': account.account_number,
                        'account_username': account.user.username,
                        'account_user_email': account.user.email,
                        } for account in accounts]
    return jsonify(serialized_data)


# used to render the typescript page
@app.route('/user-table', methods=['POST', 'GET'])
def mgmtTable():
    return render_template('managementHome.tsx')


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('user_atm_account_number', None)
    return 'Logged out successfully'


# added code
# close user account
@app.route('/close-account', methods=['POST'])
@cross_origin(methods=['POST'], supports_credentials=True)
def close_account():
    try:
        data = request.json
        account_number = data.get('accountNumber')
        if account_number is None:
            return jsonify({'error': 'Account number not provided'}), 400

        account = Account.query.filter_by(account_number=account_number).first()
        if account:
            db.session.delete(account)
            db.session.commit()
            return jsonify({'message': 'Account deleted successfully'}), 200
        else:
            return jsonify({'error': 'Account not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# close bank account
@app.route('/confirmation', methods=['DELETE'])
@cross_origin(methods=['DELETE'], supports_credentials=True)
def confirm_account_deletion():
    try:
        account_number = request.args.get('accountNumber')  # Retrieve data from query parameters
        pin = request.args.get('pin')

        if account_number is None or pin is None:
            return jsonify({'error': 'Account number and PIN not provided'}), 400

        account = Account.query.filter_by(account_number=account_number, pin=pin).first()
        if account:
            db.session.delete(account)
            db.session.commit()
            return jsonify({'message': 'Account deleted successfully'}), 200
        else:
            return jsonify({'error': 'Account not found or PIN incorrect'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

        
@app.route('/user-accounts', methods=['GET'])
def user_accounts():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            accounts = [{
                'id': account.id,
                'account_number': account.account_number,
                'balance': account.balance
            } for account in user.accounts]
            return jsonify(accounts), 200
    return jsonify({'error': 'Unauthorized'}), 401


@app.route('/create-account', methods=['POST'])
def create_account():
    user_id = session.get('user_id')
    if user_id:
        user = User.query.get(user_id)
        if user:
            pin = request.json.get('pin')
            # Validate PIN format
            if not pin.isdigit() or len(pin) != 4:
                return jsonify({'error': 'PIN must be a 4-digit number'}), 400

            # Generate a unique account number
            account_number = generate_account_number()
            while not unique_id(user_id, account_number):
                account_number = generate_account_number()

            # Create a new account
            new_account = Account(
                account_number=account_number,
                pin=pin,
                user_id=user_id,
                balance=0  # Set balance to 0
            )
            db.session.add(new_account)
            db.session.commit()
            return jsonify({'message': 'Account created successfully'}), 201

    return jsonify({'error': 'Unauthorized'}), 401

@app.route('/mgmt-close-account', methods=['POST'])
def close_mgmt_account():
    if 'mgmt_user_id' not in session:
        return jsonify({'error': 'Unauthorized access'}), 401

    account_number = request.json.get('accountNumber')
    account = Account.query.filter_by(account_number=account_number).first()

    if not account:
        return jsonify({'error': 'Account not found'}), 404

    db.session.delete(account)
    db.session.commit()
    return jsonify({'message': 'Account successfully deleted'}), 200




@app.route('/user-transactions', methods=['GET'])
def user_transactions():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401

    accounts = Account.query.filter_by(user_id=user_id).all()
    account_numbers = [account.account_number for account in accounts]

    transactions = Transactions.query.filter(Transactions.account_number.in_(account_numbers)).all()
    transactions_data = [
        {
            'transaction_id': transaction.id,
            'account_number': transaction.account_number,
            'transaction_type': transaction.transaction_type,
            'amount': transaction.amount,
            'timestamp': transaction.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        } for transaction in transactions
    ]

    return jsonify(transactions_data)


@app.route('/management/transactions/<account_number>', methods=['GET'])
def management_transactions(account_number):
    # Check if the session user is a management user
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized, please log in'}), 401
    management_user = Management.query.get(session['user_id'])
    if not management_user:
        return jsonify({'error': 'Unauthorized, management privileges required'}), 403
    
    # Fetch transactions for the specified account number
    transactions = Transactions.query.filter_by(account_number=account_number).all()
    if not transactions:
        return jsonify({'message': 'No transactions found for this account'}), 404

    transactions_data = [{
        'transaction_id': transaction.id,
        'account_number': transaction.account_number,
        'transaction_type': transaction.transaction_type,
        'amount': transaction.amount,
        'timestamp': transaction.timestamp.strftime('%Y-%m-%d %H:%M:%S')
    } for transaction in transactions]

    return jsonify(transactions_data)


@app.route('/Transactions', methods=['POST'])
def Transaction():
    data = request.get_json()
    new_transaction = Transactions(
        account_number = data['account_number'],
        transaction_type = data['transaction_type'],
        amount=data['amount'],
        timestamp=data.get('timestamp', datetime.now())
    )
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction created successfully'}), 201



if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
