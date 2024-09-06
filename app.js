const express = require("express") 
const app = express() 
const port = 1111
app.use(express.json()) 
app.use(express.urlencoded())
app.use(express.static("public"))
 

app.listen(port , ()=>{ 
    console.log('connected...') 
})

const {Pool} = require("pg")
const pool = new Pool({
    user : 'postgres',
    host : 'localhost',
    database : 'crud_project',
    password : 'Saman1384',
    port : 5432
})

async function creat_table(){
    await pool.query(`CREATE TABLE IF NOT EXISTS students (
    Name VARCHAR(50),
    Family VARCHAR(100),
    Id INTEGER PRIMARY KEY,
    Date_of_birth VARCHAR(15),
    Major VARCHAR(30),
    Univercity VARCHAR(50)
    )` , async (err)=>{
        if (err) await console.log(err)
        else console.log("Table created succesfully...")            
    })}
    creat_table()
    let students = null
    
    async function reload_data(callback){

        await pool.query(`SELECT * FROM students` , (err , res)=>{
            students =  res.rows
            callback()
        })
 
    }
    reload_data(()=>{
        console.log(students)
        
        app.get('/students' , (req , res)=>{
            res.send(students)
        })
        app.get('/' , (req , res)=>{ 
            res.sendFile(__dirname+"/index.html")
        }) 
        
        app.get('/students/:id' , (req , res)=>{
            const student = students.find(x => x.id == Number(req.params.id))
            if (!student) {res.status(404).send("Data is not given...")}
            else{res.send(student)}
        })
    
    })
    

    

        
    
        







    function add_student(student){
        try{
        pool.query(`INSERT INTO students (Name , Family , Id , Date_of_birth , Major , Univercity) VALUES ($1 , $2 , $3 , $4 , $5 , $6) ON CONFLICT DO NOTHING` 
        , [student.name , student.family , student.id , student.dob , student.major , student.uni])
            console.log("Data added sucesfully...")
        }catch(err){
            console.log(err)
        }
        
    }


app.post("/students" , (req , res) => {

    const student = {
        name : req.body.name , 
        family : req.body.family,
        id : req.body.id,
        dob : req.body.dob,
        major : req.body.major,
        uni : req.body.uni
    }
    add_student(student)
    students.push(student)
    
    res.send(student)
   

    
})
app.put("/students/:id" , (req , res) => {
    const student = students.find(x => x.id == Number(req.params.id))
    if (!student) {res.status(404).send("Data is not given...")}
    else{

            student.name = req.body.name,
            student.family = req.body.family,
            student.id = req.body.id,
            student.dob = req.body.dob,
            student.major = req.body.major,
            student.uni = req.body.uni
    }
    pool.query(`UPDATE students
        SET Name = $1 , Family = $2 , Date_of_birth = $3 , Major = $4 , Univercity = $5 WHERE Id = $6` ,
    [req.body.name , req.body.family , req.body.dob , req.body.major , req.body.uni , req.body.id])
    console.log("Data updated succesfully...")
})
app.delete("/students/:id" , (req , res) => {
    const student = students.find(x => x.id == Number(req.params.id))
    pool.query(`DELETE FROM students
        WHERE id = $1` , [student.id])
  
    students.splice(students.indexOf(student) , 1)
    console.log("Data deleted succesfully...")
})

         


