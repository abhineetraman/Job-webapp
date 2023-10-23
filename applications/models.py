from flask_sqlalchemy import SQLAlchemy
from flask import current_app as app

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "User"
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String, nullable=False)
    username = db.Column(db.String, nullable=False)
    accessToken = db.Column(db.String(255), unique=True, nullable=False)
    urole = db.Column(db.String, nullable=False)


class JobDetails(db.Model):
    __tablename__ = "JobDetails"
    sl_no = db.Column(db.Integer, autoincrement=True, primary_key=True)
    Job_id = db.Column(db.String, nullable=False, unique=True)
    name = db.Column(db.String, nullable=False)
    place = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)
    details = db.Column(db.String, nullable=False)


class AppliedJobs(db.Model):
    __tablename__ ="AppliedJobs"
    sl_no = db.Column(db.Integer, autoincrement=True, primary_key=True)
    uname = db.Column(db.String, db.ForeignKey("User.username"), nullable=False)
    Job_id = db.Column(db.String, db.ForeignKey("JobDetails.Job_id"), nullable=False)
    role = db.Column(db.String, db.ForeignKey("JobDetails.role"), nullable=False)
    place = db.Column(db.String, db.ForeignKey("JobDetails.place"), nullable=False)


class Profile(db.Model):
    __tablename__ = "Profile"
    uname = db.Column(db.String, db.ForeignKey("User.username"), primary_key=True)
    fname = db.Column(db.String, nullable=False)
    lname = db.Column(db.String, nullable=False)
    dob = db.Column(db.String, nullable=False)
    phone = db.Column(db.Integer, nullable=False)

class Applicants(db.Model):
    __tablename__ = "Applicants"
    sl_no = db.Column(db.Integer, autoincrement=True, primary_key=True)
    Job_id = db.Column(db.String, db.ForeignKey("JobDetails.Job_id"), nullable=False)
    email = db.Column(db.String, db.ForeignKey(User.email), nullable=False)
    fname = db.Column(db.String, nullable=False)
    lname = db.Column(db.String, nullable=False)
    dob = db.Column(db.String, nullable=False)
    phone = db.Column(db.Integer, nullable=False)