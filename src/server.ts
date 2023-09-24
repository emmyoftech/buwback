require("dotenv").config({path: "../.env"})
import  express from "express";
import  cors  from "cors";
import user from "./interfaces/user";
import fs from "fs";
const port = 5000
const app = express()
const usersdata = "../JSON/users.json"
const watch_parts_data = "../JSON/watch_parts.json"
const collection_DATA = "../JSON/collections.json"
const docs = "../htmlDocs/"
const mailer = require("nodemailer");
type myRepo = {
    condition: number,
    msg: string | null
}
type collection = {
    id: number,
    user: string,
    name: string,
    date: string,
    price: number,
    parts: {
        strap_img_name: string,
        case_img_name: string,
        dial_img_name: string
    }
}
app.listen(port,()=>{})
// USES
app.use(cors({
    origin: process.env.ALLOWED_WEBSITE,
    credentials: true
}))
console.log(process.env.ALLOWED_WEBSITE)
app.use(express.json())

function my_repo(n:number,m:string | null):myRepo{
    return {
        condition:n,
        msg:m
    }
}
function mailsending (email: string , run: (code: string)=> void, fail: ()=> void){
    let transport = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "fontemmanuel3@gmail.com",
            pass: "rmwuauhqyowrdsfc"
        }
    })

    async function mailFunction (){
        let code = rand()
        const info = await transport.sendMail({
            from: "BuildIt <fontemmanuel3@gmail.com>",
            to: email,
            subject: "Testing Testing 123",
            html: `<p>${code}</p>`
        })
        run(code)
    }

    mailFunction().catch((e)=>{
        fail()
    })

    function rand (): string{
        let numarr = [1,2,3,4,5,6,7,8,9]
        let code:string = ""
        for(let i = 0; i < 6; i++){
            let index = Math.floor(Math.random() * numarr.length)
            code += numarr[index]
        }
        return code
    }
}
function string_data_auth(data: any | string):boolean{
    if(typeof data != "string" || data.length < 1 || typeof JSON.parse(data) != "object"){
        return false;
    }
    return true
}
// GETSS
app.get("/api/images",(req,res)=>{
    fs.readFile(watch_parts_data,"utf-8",(err: any , data: any) => {
        if(err){
            res.status(501).send("watch_parts file r error")
        }else{
            res.status(200).send(JSON.parse(data))
        }
    })
})
app.get("/api/vali",(req,res)=>{
    let name : string = req.query.name != undefined ? req.query.name.toString() : "";
    if(name == "") res.end().sendStatus(400)
    fs.readFile(usersdata,"utf-8",(err: any , data: any)=>{
        if(err) res.status(501).send("users file r error")
        let workwith: user[] = JSON.parse(data)
        if(typeof workwith == "string") res.status(200).send(my_repo(2,"no data"))
        let if_ehn_dey:number = workwith.findIndex((this_name : user) => this_name.username == name)
        if(if_ehn_dey < 0){
            res.send(JSON.stringify(my_repo(1,null)))
        }else{
            res.send(JSON.stringify(my_repo(0,null)))
        }
    })
})
app.get("/api/Docs/:nameofdoc",(req,res)=>{
    let data : string = req.params.nameofdoc 
    if(data == undefined ) return res.sendStatus(400)
    fs.readFile(docs.concat(data , ".htm"), "utf-8" , (err: any , data: any)=>{
        if(err || data == "" || data == undefined) res.status(400).send(`"${data}" docs file location error`)
        setTimeout(() => {
            res.status(200).send(JSON.stringify(my_repo(1,data.trim())))
        }, 3000);
    })
})
app.get("/api/vmail/:mail",(req,res)=>{
    mailsending(req.params.mail, (e) => res.send(JSON.stringify(my_repo(1,e))) , ()=> res.send(JSON.stringify(my_repo(0,"failed"))))
})
app.get("/api/acc_mail/:mail/:user", (req,res)=>{
    let sent_data = req.params.mail
    let user = req.params.user
    

    fs.readFile(usersdata,"utf-8",(err:any,data:any)=>{
        if(err){
            res.status(500).send("users file r error")
        }else{
            let js_data = JSON.parse(data)
            if(typeof js_data == "object"){
                let loc_email = js_data.findIndex((item: any) => item.email == sent_data)
                if(loc_email >= 0){
                    res.send(JSON.stringify(my_repo(2,"in store")))
                }else{
                    setter(js_data)
                }
            }else{
                res.status(500).send("users file empty")
            }
        }
    })

    function setter(arr_of_user:user[]){
        let index_of_user = arr_of_user.findIndex((item: user) => item.username == user)
        arr_of_user[index_of_user].email = sent_data
        
        fs.writeFile(usersdata,JSON.stringify(arr_of_user),(err:any)=>{
            if(err){
                res.status(500).send("users file w error")
            }else{
                res.send(JSON.stringify(my_repo(1,"succ")))
            }
        })
    }
})
app.get("/api/colls",(req , res) => {
    let user = req.query.u
    fs.readFile(collection_DATA , "utf-8" , (e,data) =>{
        if(e || !string_data_auth(data)) return res.status(500).send("failed")
        let coll_data: collection[] = JSON.parse(data),
        num_of_data = coll_data.filter((item => item.user == user))
        if(num_of_data.length > 0){
            res.send(my_repo(1,JSON.stringify(num_of_data)))
        }else{
            res.send(my_repo(0,"no data"))
        }
    })
})
app.get("/api/check_mail/:mail/:user" , (rq , rs) => {
    const user = rq.params.user,
    email = rq.params.mail

    fs.readFile(usersdata,{encoding:"utf-8"}, (er , dt) => {
        if(er) return rs.status(500).send("failed to read data from db")
        if(string_data_auth(dt)){
            let r_data: user[] = JSON.parse(dt),
            found_index : user | undefined = r_data.find((item) => item.email == email && item.username == user)

            if(found_index == undefined)
                rs.send(JSON.stringify(my_repo(0,"this is not the email registered with this account")))
            else
                rs.send(JSON.stringify(my_repo(1,null)))
        }else
        rs.status(500).send("file r error")
    })
})
app.get("/api/all_coll" , (rq , rs) =>{
    fs.readFile(collection_DATA , {encoding: "utf-8"} , (er , dt) => {
        if(er)
            rs.status(500).send("Some system error occured while getting collections")
        else{
            if(string_data_auth(dt) && dt != "[]")
                setTimeout(() => {
                    rs.send(dt)
                }, 3000);
            else
            rs.status(303).send("we have no collections at the moment would you like to be the first")
        }
    })
})

// POSTSS
app.post("/api/signup" ,(req,res)=>{
    if(req.body.username && req.body.password){
        fs.readFile("./JSON/users.json","utf-8",(err: any , data: any)=>{
            if(err){
                res.status(501).send("users file r error")
            }else{
                let re_data = data == "" ? [] :JSON.parse(data);
                let user_data : user = {
                    id: re_data.length < 1 ? 1 : re_data.length + 1,
                    username: req.body.username,
                    password: req.body.password,
                    email: "void"
                }
                re_data.push(user_data)
                fs.writeFile("./JSON/users.json",JSON.stringify(re_data),(err: any)=>{
                    if(err){
                        res.status(501).send("users file w error")
                    }else{
                        res.status(201).send(JSON.stringify({message: "successful"}))
                    }
                })
            }
        })
    }else{
        res.send(503).send("incomplete data")
    }
})
app.post("/api/login",(req,res)=>{
    if(req.body.username && req.body.password){
        fs.readFile("./JSON/users.json","utf-8",(err:any , data: string)=>{
            if(err){
                res.status(502).send("users System r error")
            }else{
                if(data != ""){
                    let r: user[] = JSON.parse(data)
                    let userfound = r.findIndex((item) => item.username == req.body.username && item.password == req.body.password)
                    let namefound = r.findIndex((item) => item.username == req.body.username)
                    
                    if(userfound >= 0){
                        let msg = r[userfound].email == "void" ? null : "ver_ver"
                        res.send(JSON.stringify(my_repo(1 , msg)))
                    }else if(namefound >= 0){
                        res.send(JSON.stringify(my_repo(2 , "password is invalid")))
                    }else{
                        res.send(JSON.stringify(my_repo(0 , "invalid username and password")))
                    }
                }else{
                    res.send(JSON.stringify(my_repo(-1 , null)))
                }
                
            }
        })
    }
})
app.post("/api/pval",(req,res)=>{
    let pass = req.body

    fs.readFile(usersdata,"utf-8",(err:any , data: any)=>{
        if(err){
            res.status(500).send("user file r error")
        }else{
            if(typeof JSON.parse(data) == "object"){
                let redata = JSON.parse(data)
                let found_user = redata.find((item : user) => pass.username == item.username)
                if(found_user != undefined){
                    if(found_user.password == pass.password){
                        res.send(JSON.stringify(my_repo(1,`gud`)))
                    }else{
                        res.send(JSON.stringify(my_repo(2,`bad`)))
                    }
                }else{
                    res.send(JSON.stringify(my_repo(0,`imp_po_s`)))
                }
            }else{
                res.status(500).send("user file p error")
            }
        }
    })
})
app.post("/api/chpass",(req,res)=>{
    let data = req.body
    if(!data){
        res.status(300).send("required parameters are not available")
    }else{
        fs.readFile(usersdata,"utf-8", (err:any , dat: any)=>{
            if(err){
                res.status(300).send("file r error")
            }else{
                let read_data: user[] = JSON.parse(dat)
                if(typeof read_data == "object"){
                    let num = read_data.findIndex((item: user) => data.username == item.username)
                    if(num >= 0){
                        read_data[num].password = data.password
                        fs.writeFile(usersdata,JSON.stringify(read_data),(err:any)=>{
                            if(err){
                                res.status(300).send("file w error")
                            }else{
                                res.send(JSON.stringify(my_repo(1,"succ")))
                            }
                        })
                    }else{
                        res.send(JSON.stringify(my_repo(0,`this user has either been removed or no longer goes by "${data.username}"`)))
                    }
                }
            }
        })
    }
})
app.post("/api/chuser",(req,res)=>{
    const data = req.body
    if(!data) res.end(()=>{
        res.status(500).send("important parameters are missing")
    })

    fs.readFile(usersdata,"utf-8",(err:any , data_from_file: any)=>{
        if(err){
            res.status(500).send("file r error")
        }else{
            const parsed_data: user[] = JSON.parse(data_from_file)
            
            let if_found = parsed_data.findIndex((item) => item.username == data.old_user)
            

            if(if_found < 0){
                res.send(JSON.stringify(my_repo(0,`this user "${data.old_user}" profile does not exist in our database`)))
            }else{
                parsed_data[if_found].username = data.new_user
                
                fs.writeFile(usersdata,JSON.stringify(parsed_data),(err:any)=>{
                    if(err){
                        res.status(500).send("file w error")
                    }else{
                        res.send(JSON.stringify(my_repo(1,"succ")))
                    }
                })
            }
        }
    })
})
app.post("/api/coll_store",(req,res)=>{
    let collected_data: collection = req.body
    let new_array:collection[] = []
    fs.readFile(collection_DATA,"utf-8",(err:any , data: any) => {
        if(err) return res.sendStatus(500)
        if(string_data_auth(data)){
            let j_data:collection[] = JSON.parse(data);
            let find_if_exist_to_user =  j_data.findIndex((item) => item.user == collected_data.user && parts_check(item.parts.strap_img_name , item.parts.dial_img_name , item.parts.case_img_name))
            if(find_if_exist_to_user >= 0 ) return res.send(my_repo(2,"f_o_d"))
            let len = j_data.length
            collected_data.id = len + 1
            j_data.push(collected_data)
            setTimeout(() => trans_to_db(j_data , len + 1) , 2000);
        }else{
            collected_data.id = 1
            new_array.push(collected_data)
            trans_to_db(new_array , 1)
        }
    })

    function trans_to_db(arr:collection[] , num:number){
        fs.writeFile(collection_DATA,JSON.stringify(arr),(err:any)=>{
            if(err)
                res.status(200).send(JSON.stringify(my_repo(0,"err_w_file")));
            else
                res.status(200).send(JSON.stringify(my_repo(1,`succ_${num}`)));
        })
    }

    function parts_check (strap: string ,dial: string , cas: string) : boolean{
        let b: boolean = false
        let partss = collected_data.parts

        if(strap == partss.strap_img_name && dial == partss.dial_img_name && cas == partss.case_img_name){
            b = true
        }

        return b
    }
})

// DELETES

app.delete("/api/dels/:id",(rq , rs)=>{
    let id = rq.params.id
    fs.readFile(collection_DATA , {encoding: "utf-8"} , (er , dt) => {
        if(er) return rs.status(500).send("server failure")
        if(string_data_auth(dt)){
            let collections : collection[] = JSON.parse(dt)
            let index_coll = collections.findIndex((item) => item.id == parseInt(id))
            if(index_coll < 0){
                rs.send(JSON.stringify(my_repo(0 , "seems like this collection has been deleted in our records")))
            }else{
                collections.splice(index_coll,1)
                fs.writeFile(collection_DATA , JSON.stringify(collections) , (er) => {
                    if(er)
                        rs.status(500).send("file w error")
                    else
                        rs.send(JSON.stringify(my_repo(1 , null)))
                })
            }
        }else{
            rs.status(500).send("file r error")
        }
    })
})