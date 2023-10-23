
const store = new Vuex.Store({
    state: {
        uname: "",
        job: null,
        id: null,
    }, 
    mutations: {
        change_uname: (state, username) => {
            state.uname = username;
        },

        job_state: (state, j) => {
            state.job = j;
        },

        jd_id_state: (state, id) => {
            state.id = id;
        }
    }
});

const Applicants = Vue.component("Applicants", {
    template:`
        <div style="background-color:#121212; color:#121212;">
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div class="container-fluid" style="font-size: 20px;">
                    <p v-if="uname" style="color: white; margin-top: auto; margin-bottom: auto;"> {{ uname }} 's Dashboard</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar" style="float: right; text-align: right;">
                        <ul class="nav navbar-nav navbar-right" style="float: right; text-align: right;">

                            <li class="nav-item" v-on:click="btn_dashboard">
                            <a class="nav-link">Dashboard</a>
                            </li>

                            <li class="nav-item" v-on:click="btn_logout">
                            <a class="nav-link">Logout</a>
                            </li>
 
                        </ul>
                        
                    </div>
                </div>
            </nav>
            <table style="padding: 150px; text-align: center; font-size: 28px; background: #F1ABB9; border: 1px solid black; display:flex ; align-items:center; justify-content:center; flex-direction:column;">
                <thead>
                    <th style="border: 1px solid black;"><b>
                        <td style="border: 1px solid black;"> Email </td>
                        <td style="border: 1px solid black;"> First Name </td>
                        <td style="border: 1px solid black;"> Last Name </td>
                        <td style="border: 1px solid black;"> DOB </td>
                        <td style="border: 1px solid black;"> Mobile No. </td>
                    </b></th>
                </thead>
                <tbody  v-for="item in applicants">
                    <tr style="border: 1px solid black;">
                        <td style="border: 1px solid black;">{{ item.email }} </td>
                        <td style="border: 1px solid black;">{{ item.fname }} </td>
                        <td style="border: 1px solid black;">{{ item.lname }} </td>
                        <td style="border: 1px solid black;">{{ item.dob }} </td>
                        <td style="border: 1px solid black;">{{ item.phone }} </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,

    data: function(){
        return{
            uname: this.$store.state.uname,
            applicants: this.$store.state.job
        }
    },

    methods: {
        btn_dashboard: function(){
            return router.push(`/root/${this.uname}`)
        },

        btn_logout: function(){
            return router.push(`/`)
        }
    },

    created: function() {
        id = this.$store.state.id;
        url = "http://localhost:5000/api/applicant/".concat(this.uname).concat("/").concat(id);
        fetch(url, {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    this.$store.commit('job_state', data);
                    this.applicants = data;
                });
        
    },

    computed: {
        
    }
})

const Applied_jobs = Vue.component("Applied", {
    template:`
        <div style="background-color:#121212; color:#121212;">
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div class="container-fluid" style="font-size: 20px;">
                    <p v-if="uname" style="color: white; margin-top: auto; margin-bottom: auto;"> {{ uname }} 's Dashboard</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar" style="float: right; text-align: right;">
                        <ul class="nav navbar-nav navbar-right" style="float: right; text-align: right;">
                            
                            <li class="nav-item" v-on:click="btn_home">
                            <a class="nav-link">Homepage</a>
                            </li>

                            <li class="nav-item" v-on:click="btn_profile">
                            <a class="nav-link">Profile</a>
                            </li>

                            <li class="nav-item" v-on:click="btn_logout">
                            <a class="nav-link">Logout</a>
                            </li>
 
                        </ul>
                        
                    </div>
                </div>
            </nav>
            <div v-if="count" style="padding: 80px;">
                <div v-for="item in job">
                    <div class="container" style="padding: 15px;">
                        <div class="card" style="background-color:#F1ABB9;">
                            <div class="card-body" style="background-color:#F1FBB9;" :id="item.sl_no">
                                <h4 class="card-title"> 
                                    <h2>{{ item.role }}</h2>
                                    <b> Location: </b>{{ item.place }}
                                    <br>
                                </h4>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                
            </div>
            <div v-else style="text-align:center; font-size:32px; display:flex ; align-items:center; justify-content:center; flex-direction:column; padding: 180px;">
                <p style="padding:80px; color: #EDEDED"><h1><b>Haven't applied in Job Yet.</b></h1></p>
            </div>
        </div>
    `,

    data: function(){
        return{
            count: 0,
            uname: this.$store.state.uname,
            job: this.$store.state.job,
        }
    },
    methods: {
        btn_profile: function(){
            return router.push(`/home/${this.uname}/profile`);
        },

        btn_logout: function(){
            return router.push(`/`);
        },

        btn_home: function(){
            return router.push(`/home/${this.uname}`);
        }
    },

    beforeMount: function() {
        url = "http://localhost:5000/api/applied/".concat(this.uname);
        fetch(url, {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    this.$store.commit('job_state', data);
                    this.job = data;
                    this.count = data.length;
                });
        
    },

    computed: {
        
    }
})

const home = Vue.component("user_homepage", {
    template:`
        <div style="background-color:#121212; color:#121212;">
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div class="container-fluid" style="font-size: 20px;">
                    <p v-if="uname" style="color: white; margin-top: auto; margin-bottom: auto;"> {{ uname }} 's Dashboard</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar" style="float: right; text-align: right;">
                        <ul class="nav navbar-nav navbar-right" style="float: right; text-align: right;">
                            
                            <li class="nav-item" v-on:click="btn_applied">
                            <a class="nav-link">Applid Jobs</a>
                            </li>

                            <li class="nav-item" v-on:click="btn_profile">
                            <a class="nav-link">Profile</a>
                            </li>

                            <li class="nav-item" v-on:click="btn_logout">
                            <a class="nav-link">Logout</a>
                            </li>
 
                        </ul>
                        
                    </div>
                </div>
            </nav>
            <div v-if="count" style="padding: 80px;">
                <div v-for="item in job">
                    <div class="container" style="padding: 15px;" v-on:click="details(item.sl_no)">
                        <div class="card" style="background-color:#F1ABB9;">
                            <div class="card-body" style="background-color:#F1FBB9;" :id="item.sl_no">
                                <h4 class="card-title"> 
                                    <h2>{{ item.role }}</h2>
                                    <b> Location: </b>{{ item.place }}
                                    <br>
                                    <b> Company's Name: </b> {{ item.name }}
                                </h4>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                
            </div>
            <div v-else style="text-align:center; font-size:32px; display:flex ; align-items:center; justify-content:center; flex-direction:column; padding: 180px;">
                <p style="padding:80px; color: #EDEDED">No Jobs created. Come again after sometime.</p>
            </div>
        </div>
    `,

    data: function(){
        return{
            count: 0,
            uname: this.$store.state.uname,
            job: this.$store.state.job,
        }
    },
    methods: {
        btn_profile: function(){
            return router.push(`/home/${this.uname}/profile`);
        },

        details: function(id){
            this.$store.commit('jd_id_state', id);
            return router.push(`/home/${this.uname}/jd/${id}`);
        },

        btn_logout: function(){
            return router.push(`/`);
        },

        btn_applied: function(){
            return router.push(`/home/${this.uname}/applied_jobs`);
        }
    },

    beforeMount: function() {
        fetch("http://localhost:5000/api/job", {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    this.$store.commit('job_state', data);
                    this.job = data;
                    this.count = data.length;
                });
        
    },

    computed: {
        /*func: function(){
        fetch("http://localhost:5000/api/job", {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    this.$store.commit('job_state', data);
                    this.job = data;
                    this.count = data.length;
                });

                val =  this.$store.state.job;
                console.log(val);
                if (val.length > 0)
                    this.count = val.length;
        }*/
    }
})

const User_Job_Description = Vue.component("JD", {
    template:`
        <div style="background-color:#121212; color:#121212;">
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div class="container-fluid" style="font-size: 20px;">
                    <p v-if="uname" style="color: white; margin-top: auto; margin-bottom: auto;"> {{ uname }} 's Dashboard</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar" style="float: right; text-align: right;">
                        <ul class="nav navbar-nav navbar-right" style="float: right; text-align: right;">

                            <li class="nav-item" v-on:click="btn_home">
                            <a class="nav-link">Homepage</a>
                            </li>

                            <li class="nav-item" v-on:click="btn_applied">
                            <a class="nav-link">Applied Jobs</a>
                            </li>

                            <li class="nav-item" v-on:click="btn_logout">
                            <a class="nav-link">Logout</a>
                            </li>
 
                        </ul>
                        
                    </div>
                </div>
            </nav>
            <div v-for="item in job">
                <div class="container" style="padding: 100px;">
                    <div class="card" style="background-color:#F1ABB9;">
                        <div class="card-body" style="background-color:#F1FBB9;" :id="item.sl_no">
                            <h4 class="card-title"> 
                                <h2>{{ item.role }}</h2>
                                <b> Location: </b>{{ item.place }}
                                <br>
                                <b> Company's Name: </b> {{ item.name }}
                                <br>
                                <b> Job ID: </b> {{ item.Job_id }}
                                <br> <br>
                                {{ item.details }}
                            </h4>
                            <br>
                            <button class="btn btn-primary" type="submit" name="Apply" v-on:click="apply(item.sl_no)">Apply</button> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    data: function(){
        return{
            uname: this.$store.state.uname,
            job: this.$store.state.job
        }
    },

    methods: {
        btn_home: function(){
            return router.push(`/root/${this.uname}`);
        },

        btn_applied: function(){
            return router.push(`/home/${this.uname}/applied_jobs`);
        },

        btn_logout: function(){
            return router.push(`/`);
        },

        apply: function(id){
            url = "/api/applied/".concat(this.uname).concat("/job/").concat(id);
            fetch(url , {
                method: "POST",
                headers:{ 
                    "Content-Type" :"application/json",
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                },
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data === "Add Profile"){
                    return router.push(`/home/${this.uname}/profile`);
                }
            })
            
            url = "/api/applicant/".concat(this.uname).concat("/").concat(id)
            fetch(url , {
                method: "POST",
                headers:{ 
                    "Content-Type" :"application/json",
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                },
            })
            .then(response => response.json())
            .then(data => console.log(data));

            router.push(`/home/${this.uname}`);
    },

    beforeMount: function() {
        id = this.$store.state.id;
        url = "http://localhost:5000/api/jobdet/".concat(id);
        fetch(url, {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    this.$store.commit('job_state', data);
                    this.job = data;
                });
        
    },

    computed: {
        
    }
}
})

const Job_Description = Vue.component("JD", {
    template:`
        <div style="background-color:#121212; color:#121212;">
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div class="container-fluid" style="font-size: 20px;">
                    <p v-if="uname" style="color: white; margin-top: auto; margin-bottom: auto;"> {{ uname }} 's Dashboard</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar" style="float: right; text-align: right;">
                        <ul class="nav navbar-nav navbar-right" style="float: right; text-align: right;">

                            <li class="nav-item" v-on:click="btn_dashboard">
                            <a class="nav-link">Dashboard</a>
                            </li>

                            <li class="nav-item" v-on:click="btn_logout">
                            <a class="nav-link">Logout</a>
                            </li>
 
                        </ul>
                        
                    </div>
                </div>
            </nav>
            <div v-for="item in job">
                <div class="container" style="padding: 100px;">
                    <div class="card" style="background-color:#F1ABB9;">
                        <div class="card-body" style="background-color:#F1FBB9;" :id="item.sl_no">
                            <h4 class="card-title"> 
                                <h2>{{ item.role }}</h2>
                                <b> Location: </b>{{ item.place }}
                                <br>
                                <b> Company's Name: </b> {{ item.name }}
                                <br>
                                <br>
                                <b> Job ID: </b> {{ item.Job_id }}
                                <br> <br>
                                {{ item.details }}
                            </h4>
                            <br>
                            <button class="btn btn-dark" type="submit" name="Applicants" v-on:click="applicants(item.Job_id)">Job Applicants</button>
                            <button v-on:click="editjob(item.sl_no)" class="btn btn-dark"> Edit </button>
                            <button v-on:click="delete_job(item.sl_no)" class="btn btn-dark"> Delete </button> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    data: function(){
        return{
            uname: this.$store.state.uname,
            job: null
        }
    },

    methods: {
        delete_job: function(id){
            let text = "Press a button!\nEither Delete or Cancel.";
            if (confirm(text) == true) {
                url = "http://localhost:5000/api/job/".concat(this.uname).concat("/").concat(id)
                fetch(url, {
                    method: "DELETE",
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                .then(response => {
                    return response.json( )
                })
                .then(data => 
                    // this is the data we get after putting our data, do whatever you want with this data
                    console.log(data));
            } 
            else {
                text = "You canceled!";
            }
            return router.replace(`/root/${this.uname}`);
        },
        
        editjob: function(id){
            this.$store.commit('jd_id_state', id);
            return router.push(`/root/${this.uname}/job/${id}/edit`);
        },

        btn_dashboard: function(){
            return router.push(`/root/${this.uname}`)
        },

        btn_logout: function(){
            return router.push(`/`)
        },

        applicants: function(id){
            this.$store.commit("jd_id_state", id);
            return router.push(`/root/${this.uname}/job/${id}/applicants`);
        },
    },

    beforeMount: function() {
        id = this.$store.state.id;
        url = "http://localhost:5000/api/jobdet/".concat(id);
        fetch(url, {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    this.$store.commit('job_state', data);
                    this.job = data;
                });
        
    },

    computed: {
        
    }
})

const profile = Vue.component("profile", {
    template: `
        <div>
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div class="container-fluid" style="font-size: 20px;">
                    <p v-if="uname" style="color: white; margin-top: auto; margin-bottom: auto;"> {{ uname }} 's Dashboard</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar">
                        <form class="d-flex">
                            <ul class="navbar-nav me-auto">
                                <li class="nav-item" v-on:click="btn_home">
                                <a class="nav-link">Home</a>
                                </li>

                                <li class="nav-item" v-on:click="btn_applied">
                                <a class="nav-link">Applied Jobs</a>
                                </li>

                                </li>
                                <li class="nav-item" v-on:click="btn_logout">
                                <a class="nav-link">Logout</a>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </nav>

            <p style="text-align: center; font-face: bold; font-size: 24px; margin-top: 80px;">Your Profile</p>
            <div class="container">
                <div class="row">
                    <div class="col-sm-3">

                    </div>
                    <div class="col-sm-6">
                        <form style="text-align: justify;">
                            <p>  
                            <label> First Name: </label>
                            <input type="text" v-model="fname" />

                            <span style="float:right;">
                            <label> Last Name: </label>
                            <input type="text" v-model="lname" />
                            </span></p>

                            <div class="mt-3 mb-3">
                            <label> Date of Birth:  </label>
                            <input type="date" v-model="dob" class="form-control" />
                            </div>

                            <div class="mb-3">
                            <label> Mobile Number: </label>
                            <input type="text" v-model="phone" minlength="10" maxlength="10" required class="form-control" />
                            </div>

                            <button class="btn btn-primary" type="submit" v-on:click="Save"> Save </button>
                        </form>
                    </div>
                    <div class="col-sm-3">
                        
                    </div>
                </div>
            </div>
        </div>
    `,

    data: function(){
        return{
            uname: this.$store.state.uname,
            fname: "",
            lname: "",
            dob: "",
            phone: ""
        }
    },

    methods: {
        Save: function(){
            if (this.uname === "" || this.fname === "" || this.lname === "" || this.dob === "" || this.phone === "")
                return javascript.void(0);
            req_data = {
                "uname" : this.uname,
                "fname" : this.fname,
                "lname" : this.lname,
                "dob" : this.dob,
                "phone" : this.phone
            };

            url = "/api/profile/".concat(this.uname)
            fetch(url , {
                method: "POST",
                headers:{ 
                    "Content-Type" :"application/json",
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                },
                body: JSON.stringify(req_data)
            })
            .then(response => response.json())
            .then(data => console.log(data));

            router.replace(`/home/${this.uname}/profile`);
        },

        btn_home: function(){
            return router.push(`/home/${this.uname}`);
        },

        btn_logout: function(){
            return router.push(`/`);
        },

        btn_applied: function(){
            return router.push(`/home/${this.uname}/applied_jobs`)
        }
    },  

    beforeMount(){
        url = "/api/profile/".concat(this.uname)
        fetch(url, {
            method : "GET",
            headers : {
                'Content-type' : 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
            }
        })
        .then(response => response.json())
        .then(data => {
            this.fname = data.fname;
            this.lname = data.lname;
            this.dob = data.dob;
            this.phone = data.phone;
        })
    },

    computed: {
        
    }
})

const edit_job = Vue.component("job", {
    template: `
        <div>
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div class="container-fluid" style="font-size: 20px;">
                    <p v-if="uname" style="color: white; margin-top: auto; margin-bottom: auto;"> {{ uname }} 's Dashboard</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar" style="float: right; text-align: right;">
                        <ul class="nav navbar-nav navbar-right" style="float: right; text-align: right;">
                            <li class="nav-item">
                            <a class="nav-link" v-on:click="btn_home">Dashboard</a>
                            </li>
                            
                            <li class="nav-item" v-on:click="btn_logout">
                            <a class="nav-link">Logout</a>
                            </li>
 
                        </ul>
                        
                    </div>
                </div>
            </nav>
            <form style="margin-top: 80px; text-align:center;  display:flex ; align-items:center; justify-content:center; flex-direction:column;">
                <p style="font-family: Lucida Sans; font-size: 40px;">Edit the Job details</p>
                <div class="flex-container" style="display: inline; margin: auto;">
                    <div class="mb-3 mt-3">
                    <label> Job ID: </label>
                    <input type="text" class="form-control" v-model="jid" readonly style="border: none; border-bottom: 3px solid black"/>
                    </div class="mb-3">

                    <div class="mb-3">
                    <label> Company's Name: </label>
                    <input type="text" class="form-control" v-model="name" required style="border: none; border-bottom: 3px solid black"/>
                    </div>

                    <div class="mb-3">
                    <label> Location: </label>
                    <input type="text" class="form-control" v-model="place" required style="border: none; border-bottom: 3px solid black"/>
                    </div>

                    <div class="mb-3">
                    <label> role: </label>
                    <input type="text" class="form-control" v-model="role" required style="border: none; border-bottom: 3px solid black"/>
                    </div>

                    <div class="mb-3">
                    <label> Job Details: </label>
                    <textarea class="form-control" v-model="details" required style="border: none; display: block; border-bottom: 3px solid black; width: 1450px; height: 150px;"/>
                    </div>

                    <button class="btn btn-primary" type="submit" v-on:click="editJob(jid)"> Edit </button>
                </div>
            </form>
        </div>
    `,

    data: function(){
        return{
            uname: store.state.uname,
            name: "",
            place: "",
            details: "",
            jid: "",
            role: ""
        }
    },

    methods: {
        editJob: function(id){
            if (this.name === "" || this.place === "" || this.jid === "" || this.details === "" || this.role === "")
                return javascript.void(0);
            data = {
                "name": this.name,
                "place": this.place,
                "role": this.role,
                "details": this.details
            };
            url = "http://localhost:5000/api/job/".concat(this.uname).concat("/").concat(id);
            fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(router.push(`/root/${this.uname}`));
        },
        
        btn_home: function(){
            return router.push(`/root/${this.uname}`);
        },

        btn_logout: function(){
            return router.push(`/`);
        }
    },

    created : function(){
        id = this.$store.state.id;
        url = "http://localhost:5000/api/jobdet/".concat(id);
        fetch(url, {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    this.$store.commit('job_state', data);
                    this.name = data[0].name;
                    this.place = data[0].place;
                    this.details = data[0].details;
                    this.jid = data[0].Job_id;
                    this.role = data[0].role;
                });
        
    }
})

const add_job = Vue.component("job", {
    template: `
        <div>
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div class="container-fluid" style="font-size: 20px;">
                    <p v-if="uname" style="color: white; margin-top: auto; margin-bottom: auto;"> {{ uname }} 's Dashboard</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar" style="float: right; text-align: right;">
                        <ul class="nav navbar-nav navbar-right" style="float: right; text-align: right;">
                            <li class="nav-item">
                            <a class="nav-link" v-on:click="btn_home">Dashboard</a>
                            </li>
                            
                            <li class="nav-item" v-on:click="btn_logout">
                            <a class="nav-link">Logout</a>
                            </li>
 
                        </ul>
                        
                    </div>
                </div>
            </nav>
            <form style="margin-top: 80px; text-align:center;  display:flex ; align-items:center; justify-content:center; flex-direction:column;">
                <p style="font-family: Lucida Sans; font-size: 40px;">Add a new Venue</p>
                <div class="flex-container" style="display: inline; margin: auto;">
                    <div class="mb-3 mt-3">
                    <label> Job ID: </label>
                    <input type="text" class="form-control" v-model="jid" required style="border: none; border-bottom: 3px solid black"/>
                    </div class="mb-3">

                    <div class="mb-3">
                    <label> Company's Name: </label>
                    <input type="text" class="form-control" v-model="name" required style="border: none; border-bottom: 3px solid black"/>
                    </div>

                    <div class="mb-3">
                    <label> Location: </label>
                    <input type="text" class="form-control" v-model="place" required style="border: none; border-bottom: 3px solid black"/>
                    </div>

                    <div class="mb-3">
                    <label> role: </label>
                    <input type="text" class="form-control" v-model="role" required style="border: none; border-bottom: 3px solid black"/>
                    </div>

                    <div class="mb-3">
                    <label> Job Details: </label>
                    <textarea class="form-control" v-model="details" required style="border: none; display: block; border-bottom: 3px solid black; width: 1450px; height: 150px;"/>
                    </div>

                    <button class="btn btn-primary" type="submit" v-on:click="add_job"> Add </button>
                </div>
            </form>
        </div>
    `,

    data: function(){
        return{
            uname: store.state.uname,
            name: "",
            place: "",
            details: "",
            jid: "",
            role: ""
        }
    },

    methods: {
        add_job: function(){
            if (this.name === "" || this.place === "" || this.jid === "" || this.details === "" || this.role === "")
                return javascript.void(0);
            data = {
                "jid": this.jid,
                "name": this.name,
                "place": this.place,
                "role": this.role,
                "details": this.details
            };
            url = "http://localhost:5000/api/job/".concat(this.uname)
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(router.push(`/root/${this.uname}`));
        },
        
        btn_home: function(){
            return router.push(`/root/${this.uname}`);
        },

        btn_logout: function(){
            return router.push(`/`);
        }
    },
})

const dashboard = Vue.component("dashboard", {
    template:`
        <div style="background-color:#121212; color:#121212;">
            <nav class="navbar navbar-expand-sm bg-dark navbar-dark fixed-top">
                <div class="container-fluid" style="font-size: 20px;">
                    <p v-if="uname" style="color: white; margin-top: auto; margin-bottom: auto;"> {{ uname }} 's Dashboard</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar" style="float: right; text-align: right;">
                        <ul class="nav navbar-nav navbar-right" style="float: right; text-align: right;">
                                                        
                            <li class="nav-item" v-on:click="btn_logout">
                            <a class="nav-link">Logout</a>
                            </li>
 
                        </ul>
                        
                    </div>
                </div>
            </nav>
            <div v-if="count" style="padding: 80px;">
                <div v-for="item in job">
                    <div class="container" style="padding: 15px;" v-on:click="details(item.sl_no)">
                        <div class="card" style="background-color:#F1ABB9;">
                            <div class="card-body" style="background-color:#F1FBB9;" :id="item.sl_no">
                                <h4 class="card-title"> 
                                    <h2>{{ item.role }}</h2>
                                    <b> Location: </b>{{ item.place }}
                                    <br>
                                    <b> Company's Name: </b> {{ item.name }}
                                </h4>
                                <br>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <button v-on:click="add_job" class="btn btn-primary" style="border-radius: 60%; margin: auto; text-align: center; font-size: 40px;"> + </button>
            </div>
            <div v-else style="text-align:center; font-size:32px; display:flex ; align-items:center; justify-content:center; flex-direction:column; padding: 180px;">
                <p style="padding:80px; color: #EDEDED">No Jobs created</p>
                <button v-on:click="add_job" class="btn btn-primary" style="border-radius: 60%; font-size: 40px"> + </button>
            </div>
        </div>
    `,

    data: function(){
        return{
            count: 0,
            uname: this.$store.state.uname,
            job: this.$store.state.job,
        }
    },
    methods: {
        

        add_job: function(){
            return router.push(`/root/${this.uname}/job`);
        },

        details: function(id){
            console.log(id);
            this.$store.commit('jd_id_state', id);
            return router.push(`/root/${this.uname}/${id}/details`);
        },

        btn_logout: function(){
            return router.push(`/`)
        },

        expert: async function(id) {
            url ="http://127.0.0.1:5000/api/export".concat("/").concat(id).concat("/").concat(this.uname)
            const res = await fetch(url , {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
              }
            })
        
            if (res.ok) {
              const d = await res.blob()  
              var a = document.createElement("a");
              a.href = window.URL.createObjectURL(d);
              a.download = `theatre_details.csv`;
              a.click();
              //this.$router.push({ path: '/dashboard' })
              alert("Dasboard Exported")
            } else {
              const d = await res.json()
              this.$router.push({ path: '/login' })
              alert(d.message)
            }
        }
    },

    beforeMount: function() {
        fetch("http://localhost:5000/api/job", {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    this.$store.commit('job_state', data);
                    this.job = data;
                    this.count = data.length;
                });
        
    },

    computed: {
        /*func: function(){
        fetch("http://localhost:5000/api/job", {
                    method: "GET",
                    mode: 'cors',
                    headers: {
                        'Content-type' : 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                .then(response => response.json())
                .then(data => {
                    this.$store.commit('job_state', data);
                    this.job = data;
                    this.count = data.length;
                });

                val =  this.$store.state.job;
                console.log(val);
                if (val.length > 0)
                    this.count = val.length;
        }*/
    }
})

const signup = Vue.component("signup-form", {
    template: `
    <div style="background-color:#225855; color:#121212;">
        <div class="container" style=" height:100vh; width:400wh; display:flex ; background-color:#225855; align-items:center;justify-content:center;">
            <div class="row">
                <div class="col-sm-12 col-md-6">
                    <img src="static/login-img.jpg" style="object-fit:contain;" height="600px">
                </div>
                <div class="col-md-6" style="padding:15px; text-align: center; background-color:#EEEEEE; height:600px; display:flex ; align-items:center;justify-content:center; flex-direction:column; ">
                    <form>
                        &nbsp Email: &nbsp &nbsp <input type="email" v-model="email" required />
                        </p>
                        <p>
                        password: <input type="password" v-model="pwd" required />
                        </p>
                        <br>
                        <button v-on:click="post_User" class="btn btn-dark"> Register </button>
                        <br>
                        Already a User? <router-link to="/">Login</router-link>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,
    data: function(){
        return{
            email: "",
            pwd: "",
        }
    },
    methods: {
        post_User: function(){
            if (this.uname === "" || this.pwd === "" || this.uname === null || this.pwd === null)
                return javascript.void(0);
            data = {
                "email": this.email,
                "pwd": this.pwd
            };
            url = "http://localhost:5000/api/signup/POST"
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                alert("Account created");
                return router.push(`/`);
            });
        }
    },
    computed:{

    }
})

const login = Vue.component("login-form", {
    template: `
        <div style="background-color:#225855; color:#121212;">
            <div class="container" style=" height:100vh; width:400wh; display:flex ; background-color:#225855; align-items:center;justify-content:center;">
                <div class="row">
                    <div class="col-sm-12 col-md-6">
                        <img src="static/login-img.jpg" style="object-fit:contain;" height="600px">
                    </div>
                    <div class="col-md-6" style="padding:15px; text-align: center; background-color:#EEEEEE; height:600px; display:flex ; align-items:center;justify-content:center; flex-direction:column; ">
                        <form>
                            Email: &nbsp &nbsp &nbsp<input type="text" v-model="email" required/>
                            </p>
                            <p>
                            password: <input type="password" v-model="pwd" required/>
                            </p>
                            <br>
                            <button v-on:click="login_check" class="btn btn-primary"> Login </button>
                            <br>
                            Not a User? <router-link to="/Signup">Sign Up</router-link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function(){
        return{
            uname: "",
            email: "",
            pwd: "",
            role: ""
        }
    },
    methods: {
        login_check: function(){
            if (this.email === "" || this.pwd === "" || this.email === null || this.pwd === null)
                return javascript.void(0);
            url = "http://localhost:5000/api/login/".concat(this.email).concat("/").concat(this.pwd);
            fetch(url, {
                method : "POST",
                headers:{
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if(data.urole == "admin"){
                    this.uname = data.username;
                    this.$store.commit('change_uname', this.uname);
                    localStorage.setItem('accessToken', data.accessToken);
                    return router.push(`/root/${this.uname}`);
                }
                else if(data.urole == "user"){
                    this.uname = data.username;
                    this.$store.commit('change_uname', this.uname);
                    localStorage.setItem('accessToken', data.accessToken);
                    return router.push(`/home/${this.uname}`);
                }
                else
                    alert("Wrong Password");
            })
        }
    },
    computed: {
        
    }
})

const routes = [{
    path: '/',
    component: login
}, {
    path:'/Signup',
    component: signup
}, {
    path:'/root/:uname',
    component: dashboard
}, {
    path:'/home/:uname',
    component: home
}, {
    path: '/root/:uname/job',
    component: add_job
}, {
    path: '/root/:uname/job/:id/edit',
    component: edit_job
}, {
    path: '/root/:uname/:sl_no/details',
    component: Job_Description
}, {
    path: '/home/:uname/applied_jobs',
    component: Applied_jobs
}, {
    path: '/home/:uname/profile',
    component: profile
}, {
    path: '/home/:uname/jd/:id',
    component: User_Job_Description
}, {
    path: '/root/:uname/job/:id/applicants',
    component: Applicants
}];

const router = new VueRouter({
    routes
})

var app = new Vue({
    el: '#app',
    router: router,
    store: store,
})