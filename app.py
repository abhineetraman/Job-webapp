from flask import Flask, send_from_directory, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import scoped_session, sessionmaker
from flask_restful import Resource, Api,  fields, marshal_with, reqparse
from applications.validation import NotFoundError, BusinessValidationError, AuthorisationError
from flask_cors import CORS
from os import path
from datetime import timedelta
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager

from applications.models import db, User, JobDetails, AppliedJobs, Profile, Applicants

app = Flask(__name__, template_folder="templates")
app.config['SECRET_KEY'] = "21f1005523"
app.config["JWT_SECRET_KEY"] ="21f1005523"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=5)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///JobDB.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
api = Api(app)
app.app_context().push()
CORS(app)
jwt = JWTManager(app)

#with app.app_context():
    #db.create_all()

output_fields = {
    "username": fields.String,
    "password": fields.String,
    "urole": fields.String,
    "accessToken": fields.String
}

create_user_parser = reqparse.RequestParser()
create_user_parser.add_argument('email')
create_user_parser.add_argument('pwd')

class LoginAPI(Resource):
    @marshal_with(output_fields)
    def post(self, email, pwd):
        user = db.session.query(User).filter(User.email==email).first()
        print(user)
        if user:
            if pwd == user.password:
                access_token = create_access_token(identity=email)
                user.accessToken = access_token
                db.session.commit()
                session["cust"] = user.username
            else:
                raise BusinessValidationError(status_code=400, error_code="BE0001", error_message="Incorrect Password")
        else:
            raise NotFoundError(status_code=404)
        
        user = db.session.query(User).filter(User.email==email).first()
        return user, 200


class SignupAPI(Resource):
    def post(self):
        args = create_user_parser.parse_args()
        email = args.get("email", None)
        password = args.get("pwd", None)

        if email is None:
            raise BusinessValidationError(status_code=400, error_code="BE1001", error_message="Email is Required")

        if password is None:
            raise BusinessValidationError(status_code=400, error_code="BE1002", error_message="Password is Required")

        if '@' not in email:
            raise BusinessValidationError(status_code=400, error_code="BE1003", error_message="Invalid email")

        user = db.session.query(User).filter(User.email == email).first()
        if user:
            raise BusinessValidationError(status_code=402, error_code="BE1004", error_message="Duplicate Value")

        uname = ""
        for i in email:
            if i != '@':
                uname += i
            if i == '@':
                break
        
        temp_user = User(email=email, password = password, username=uname, accessToken="a", urole="user")
        db.session.add(temp_user)
        db.session.commit()

        return "Account Created", 200


job_det_output = {
    "sl_no": fields.Integer,
    "Job_id": fields.String,
    "name": fields.String,
    "place": fields.String,
    "role": fields.String,
    "details": fields.String
}


class JobDetailsAPI(Resource):
    @jwt_required()
    @marshal_with(job_det_output)
    def get(self, id):
        job = db.session.query(JobDetails).filter(JobDetails.sl_no == id).all()
        return job, 200


create_job_parser = reqparse.RequestParser()
create_job_parser.add_argument('jid')
create_job_parser.add_argument('name')
create_job_parser.add_argument('place')
create_job_parser.add_argument('role')
create_job_parser.add_argument('details')


update_job_parser = reqparse.RequestParser()
update_job_parser.add_argument("name")
update_job_parser.add_argument("place")
update_job_parser.add_argument("role")
update_job_parser.add_argument("details")

job_output = {
    "sl_no": fields.Integer,
    "Job_id": fields.String,
    "name": fields.String,
    "place": fields.String,
    "role": fields.String
}


class JobAPI(Resource):
    @jwt_required()
    @marshal_with(job_output)
    def get(self):
        job = db.session.query(JobDetails).all()
        return job, 200

    @jwt_required()
    def post(self, uname):
        if uname != "admin":
            raise AuthorisationError(status_code=500, error_message="You are not Authorised")
        args = create_job_parser.parse_args()
        Job_id = args.get("jid", None)
        name = args.get("name", None)
        place = args.get("place", None)
        role = args.get("role", None)
        details = args.get("details", None)

        if Job_id is None:
            raise BusinessValidationError(status_code=400, error_code="BE2001", error_message="Job ID is Required")
        
        if name is None:
            raise BusinessValidationError(status_code=400, error_code="BE2002", error_message="Name is Required")
        
        if place is None:
            raise BusinessValidationError(status_code=400, error_code="BE2003", error_message="Place is Required")
        
        if role is None:
            raise BusinessValidationError(status_code=400, error_code="BE2004", error_message="Role is Required")
        
        if details is None:
            raise BusinessValidationError(status_code=400, error_code="BE2005", error_message="Job Detail is Required")
        
        job = db.session.query(JobDetails).filter(JobDetails.Job_id == Job_id).first()
        if job:
            raise BusinessValidationError(status_code=402, error_code="BE1004", error_message="Duplicate Value")
        
        temp_job = JobDetails(Job_id=Job_id, name=name, place=place, role=role, details=details)
        db.session.add(temp_job)
        db.session.commit()

        return "Job added", 200
    
    @jwt_required()
    def put(self, id, uname):
        if uname != "admin":
            raise AuthorisationError(status_code=500, error_message="You are not Authorised")
        job = db.session.query(JobDetails).filter(JobDetails.Job_id==id).first()
        args = update_job_parser.parse_args()
        name = args.get("name", None)
        place = args.get("place", None)
        role = args.get("role", None)
        details = args.get("details", None)

        if job is None:
            raise NotFoundError(status_code=404)
        
        elif name is None:
            raise BusinessValidationError(status_code=400, error_code="BE2006", error_message="Name is Required")
        
        elif place is None:
            raise BusinessValidationError(status_code=400, error_code="BE2007", error_message="Place is Required")
        
        elif role is None:
            raise BusinessValidationError(status_code=400, error_code="BE2008", error_message="Role is Required")
        
        elif details is None:
            raise BusinessValidationError(status_code=400, error_code="BE2009", error_message="Details is Required")
        
        elif job:
            job.name = name
            job.role = role
            job.place = place
            job.details = details
            db.session.commit()

            return "Updated", 200

    @jwt_required()
    def delete(self, id, uname):
        if uname != "admin":
            raise AuthorisationError(status_code=500, error_message="You are not Authorised")
        temp_job = db.session.query(JobDetails).filter(JobDetails.sl_no==id).first()

        if temp_job is None:
            raise NotFoundError(status_code=404)
        
        db.session.delete(temp_job)
        db.session.commit()

        return "Job deleted", 200




appl_job_output = {
    "sl_no": fields.Integer,
    "Job_id": fields.String,
    "name": fields.String,
    "place": fields.String,
    "role": fields.String
}


class AppliedJobAPI(Resource):
    @jwt_required()
    @marshal_with(appl_job_output)
    def get(self, uname):
        user = User.query.filter_by(username=uname).first()
        if user:
            if not (user.urole == "user"):
                raise AuthorisationError(status_code=500, error_message="You are not Authorised")
        appl_job = db.session.query(AppliedJobs).filter(AppliedJobs.uname == uname).all()
        return appl_job, 200

    @jwt_required()
    def post(self, uname, id):
        user = User.query.filter_by(username=uname).first()
        if user:
            if not (user.urole == "user"):
                raise AuthorisationError(status_code=500, error_message="You are not Authorised")
        
        prof = Profile.query.filter_by(uname=uname).first()

        if prof is None:
            return "Add Profile"
        
        temp_data = db.session.query(JobDetails).filter(JobDetails.sl_no == id).first()

        Job_id, place, role = "", "", ""

        if temp_data:
            Job_id = temp_data.Job_id
            place = temp_data.place
            role = temp_data.role

        appl_job = AppliedJobs(Job_id=Job_id, uname=uname, place=place, role=role)
        db.session.add(appl_job)
        db.session.commit()

        return "Job applied", 200


create_profile_parser = reqparse.RequestParser()
create_profile_parser.add_argument('uname')
create_profile_parser.add_argument('fname')
create_profile_parser.add_argument('lname')
create_profile_parser.add_argument('dob')
create_profile_parser.add_argument('phone')

prof_output = {
    "fname" : fields.String,
    "lname" : fields.String,
    "dob" : fields.String,
    "phone" : fields.Integer
}

class ProfileAPI(Resource):
    @jwt_required()
    @marshal_with(prof_output)
    def get(self, uname):
        user = db.session.query(User).filter(User.username == uname).filter(User.urole == "user").first()
        if user is None:
            raise AuthorisationError(status_code=500, error_message="You are not Authorised")
        prof = db.session.query(Profile).filter(uname == uname).first()
        return prof, 200

    @jwt_required()
    def post(self, uname):
        user = db.session.query(User).filter(User.username == uname).filter(User.urole == "user").first()
        if user is None:
            raise AuthorisationError(status_code=500, error_message="You are not Authorised")
        args = create_profile_parser.parse_args()
        fname = args.get("fname", None)
        lname = args.get("lname", None)
        dob = args.get("dob", None)
        phone = args.get("phone", None)
        uname = args.get("uname", None)

        print(args)

        if fname is None:
            raise BusinessValidationError(status_code=400, error_code="BE5001", error_message="First Name is Required")
        
        if lname is None:
            raise BusinessValidationError(status_code=400, error_code="BE5002", error_message="Last Name is Required")
        
        if dob is None:
            raise BusinessValidationError(status_code=400, error_code="BE5003", error_message="Date of Birth is Required")
        
        if phone is None:
            raise BusinessValidationError(status_code=400, error_code="BE5004", error_message="Phone number is required")

        profile = db.session.query(Profile).filter(Profile.uname == uname).first()
        if profile:
            if fname is not None:
                profile.fname =fname
            
            if lname is not None:
                profile.lname = lname
            
            if dob is not None:
                print(uname)
                profile.dob = dob
                print(profile.dob)

            if phone is not None:
                profile.phone = phone
            
            db.session.commit()
        
        else:
            temp_prof = Profile(uname=uname, fname=fname, lname=lname, dob=dob, phone=phone)
            db.session.add(temp_prof)
            db.session.commit()

        return "Profile Updated", 200


appli_output = {
    "email" : fields.String,
    "fname" : fields.String,
    "lname" : fields.String,
    "dob" : fields.String,
    "phone" : fields.Integer
}


class ApplicantsAPI(Resource):
    @jwt_required()
    @marshal_with(appli_output)
    def get(self, uname, id):
        user = db.session.query(User).filter(User.username == uname).filter(User.urole == "user").first()
        if user:
            raise AuthorisationError(status_code=500, error_message="You are not Authorised")
        appli = db.session.query(Applicants).filter(Applicants.Job_id == id).all()
        return appli, 200

    def post(Self, uname, id):
        user = db.session.query(User).filter(User.username == uname).filter(User.urole == "user").first()
        if not user:
            raise AuthorisationError(status_code=500, error_message="You are not Authorised")
        
        prof = Profile.query.filter_by(uname=uname).first()

        fname, lname, dob, phone, email, jid = "", "", "", "", "", ""
        if prof:
            fname = prof.fname
            lname = prof.lname
            dob = prof.dob
            phone = prof.phone

        if user:
            email = user.email
        
        print(fname, lname, dob, phone, email, jid)
        temp_job = JobDetails.query.filter_by(sl_no=id).first()
        if temp_job:
            jid = temp_job.Job_id
        
        temp_appli = Applicants(Job_id=jid, email=email, fname=fname, lname=lname, dob=dob, phone=phone)
        print(temp_appli)
        db.session.add(temp_appli)
        db.session.commit()

        return "Applicant applied", 200



from applications.controllers import *

api.add_resource(LoginAPI, "/api/login/<string:email>/<string:pwd>")
api.add_resource(SignupAPI, "/api/signup/POST")
api.add_resource(JobAPI, "/api/job", "/api/job/<string:uname>", "/api/job/<string:uname>/<string:id>")
api.add_resource(JobDetailsAPI, "/api/jobdet/<int:id>")
api.add_resource(AppliedJobAPI, "/api/applied/<string:uname>", "/api/applied/<string:uname>/job/<int:id>")
api.add_resource(ProfileAPI, "/api/profile/<string:uname>")
api.add_resource(ApplicantsAPI, "/api/applicant/<string:uname>/<string:id>")


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)