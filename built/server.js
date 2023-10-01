"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config({ path: "../.env" });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var fs_1 = __importDefault(require("fs"));
var port = 5000;
var app = (0, express_1.default)();
var usersdata = "../JSON/users.json";
var watch_parts_data = "../JSON/watch_parts.json";
var collection_DATA = "../JSON/collections.json";
var docs = "../htmlDocs/";
var mailer = require("nodemailer");
app.listen(port, function () { });
// USES
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_WEBSITE,
    credentials: true
}));
app.use(express_1.default.json());
function my_repo(n, m) {
    return {
        condition: n,
        msg: m
    };
}
function mailsending(email, run, fail) {
    var transport = mailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "fontemmanuel3@gmail.com",
            pass: "rmwuauhqyowrdsfc"
        }
    });
    function mailFunction() {
        return __awaiter(this, void 0, void 0, function () {
            var code, info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code = rand();
                        return [4 /*yield*/, transport.sendMail({
                                from: "BuildIt <fontemmanuel3@gmail.com>",
                                to: email,
                                subject: "Testing Testing 123",
                                html: "<p>".concat(code, "</p>")
                            })];
                    case 1:
                        info = _a.sent();
                        run(code);
                        return [2 /*return*/];
                }
            });
        });
    }
    mailFunction().catch(function (e) {
        fail();
    });
    function rand() {
        var numarr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var code = "";
        for (var i = 0; i < 6; i++) {
            var index = Math.floor(Math.random() * numarr.length);
            code += numarr[index];
        }
        return code;
    }
}
function string_data_auth(data) {
    if (typeof data != "string" || data.length < 1 || typeof JSON.parse(data) != "object") {
        return false;
    }
    return true;
}
// GETSS
app.get("/api/images", function (req, res) {
    fs_1.default.readFile(watch_parts_data, "utf-8", function (err, data) {
        if (err) {
            res.status(501).send("watch_parts file r error");
        }
        else {
            res.status(200).send(JSON.parse(data));
        }
    });
});
app.get("/api/vali", function (req, res) {
    var name = req.query.name != undefined ? req.query.name.toString() : "";
    if (name == "")
        res.end().sendStatus(400);
    fs_1.default.readFile(usersdata, "utf-8", function (err, data) {
        if (err)
            res.status(501).send("users file r error");
        var workwith = JSON.parse(data);
        if (typeof workwith == "string")
            res.status(200).send(my_repo(2, "no data"));
        var if_ehn_dey = workwith.findIndex(function (this_name) { return this_name.username == name; });
        if (if_ehn_dey < 0) {
            res.send(JSON.stringify(my_repo(1, null)));
        }
        else {
            res.send(JSON.stringify(my_repo(0, null)));
        }
    });
});
app.get("/api/Docs/:nameofdoc", function (req, res) {
    var data = req.params.nameofdoc;
    if (data == undefined)
        return res.sendStatus(400);
    fs_1.default.readFile(docs.concat(data, ".htm"), "utf-8", function (err, data) {
        if (err || data == "" || data == undefined)
            res.status(400).send("\"".concat(data, "\" docs file location error"));
        setTimeout(function () {
            res.status(200).send(JSON.stringify(my_repo(1, data.trim())));
        }, 3000);
    });
});
app.get("/api/vmail/:mail", function (req, res) {
    console.log("hey");
    fs_1.default.readFile(usersdata, "utf-8", function (err, data) {
        if (err) {
            res.status(500).send("users file r error");
        }
        else {
            var js_data = JSON.parse(data);
            if (typeof js_data == "object") {
                var loc_email = js_data.findIndex(function (item) { return item.email == req.params.mail; });
                if (loc_email >= 0) {
                    res.send(JSON.stringify(my_repo(2, "in store")));
                }
                else {
                    mailsending(req.params.mail, function (e) { return res.send(JSON.stringify(my_repo(1, e))); }, function () { return res.send(JSON.stringify(my_repo(0, "failed"))); });
                }
            }
            else {
                res.status(500).send("users file empty");
            }
        }
    });
});
app.get("/api/acc_mail/:mail/:user", function (req, res) {
    var sent_data = req.params.mail;
    var user = req.params.user;
    fs_1.default.readFile(usersdata, "utf-8", function (err, data) {
        if (err) {
            res.status(500).send("users file r error");
        }
        else {
            var js_data = JSON.parse(data);
            if (typeof js_data == "object") {
                var loc_email = js_data.findIndex(function (item) { return item.email == sent_data; });
                if (loc_email >= 0) {
                    res.send(JSON.stringify(my_repo(2, "in store")));
                }
                else {
                    setter(js_data);
                }
            }
            else {
                res.status(500).send("users file empty");
            }
        }
    });
    function setter(arr_of_user) {
        var index_of_user = arr_of_user.findIndex(function (item) { return item.username == user; });
        arr_of_user[index_of_user].email = sent_data;
        fs_1.default.writeFile(usersdata, JSON.stringify(arr_of_user), function (err) {
            if (err) {
                res.status(500).send("users file w error");
            }
            else {
                res.send(JSON.stringify(my_repo(1, "succ")));
            }
        });
    }
});
app.get("/api/colls", function (req, res) {
    var user = req.query.u;
    fs_1.default.readFile(collection_DATA, "utf-8", function (e, data) {
        if (e || !string_data_auth(data))
            return res.status(500).send("failed");
        var coll_data = JSON.parse(data), num_of_data = coll_data.filter((function (item) { return item.user == user; }));
        if (num_of_data.length > 0) {
            res.send(my_repo(1, JSON.stringify(num_of_data)));
        }
        else {
            res.send(my_repo(0, "no data"));
        }
    });
});
app.get("/api/check_mail/:mail/:user", function (rq, rs) {
    var user = rq.params.user, email = rq.params.mail;
    fs_1.default.readFile(usersdata, { encoding: "utf-8" }, function (er, dt) {
        if (er)
            return rs.status(500).send("failed to read data from db");
        if (string_data_auth(dt)) {
            var r_data = JSON.parse(dt), found_index = r_data.find(function (item) { return item.email == email && item.username == user; });
            if (found_index == undefined)
                rs.send(JSON.stringify(my_repo(0, "this is not the email registered with this account")));
            else
                rs.send(JSON.stringify(my_repo(1, null)));
        }
        else
            rs.status(500).send("file r error");
    });
});
app.get("/api/all_coll", function (rq, rs) {
    fs_1.default.readFile(collection_DATA, { encoding: "utf-8" }, function (er, dt) {
        if (er)
            rs.status(500).send("Some system error occured while getting collections");
        else {
            if (string_data_auth(dt) && dt != "[]")
                setTimeout(function () {
                    rs.send(dt);
                }, 3000);
            else
                rs.status(303).send("we have no collections at the moment would you like to be the first");
        }
    });
});
// POSTSS
app.post("/api/signup", function (req, res) {
    if (req.body.username && req.body.password) {
        fs_1.default.readFile(usersdata, "utf-8", function (err, data) {
            if (err) {
                res.status(501).send("users file r error");
            }
            else {
                var re_data = data == "" ? [] : JSON.parse(data);
                var user_data = {
                    id: re_data.length < 1 ? 1 : re_data.length + 1,
                    username: req.body.username,
                    password: req.body.password,
                    email: "void"
                };
                re_data.push(user_data);
                fs_1.default.writeFile(usersdata, JSON.stringify(re_data), function (err) {
                    if (err) {
                        res.status(501).send("users file w error");
                    }
                    else {
                        res.status(201).send(JSON.stringify({ message: "successful" }));
                    }
                });
            }
        });
    }
    else {
        res.send(503).send("incomplete data");
    }
});
app.post("/api/login", function (req, res) {
    if (req.body.username && req.body.password) {
        fs_1.default.readFile(usersdata, "utf-8", function (err, data) {
            if (err) {
                res.status(502).send("users System r error");
            }
            else {
                if (data != "") {
                    var r = JSON.parse(data);
                    var userfound = r.findIndex(function (item) { return item.username == req.body.username && item.password == req.body.password; });
                    var namefound = r.findIndex(function (item) { return item.username == req.body.username; });
                    if (userfound >= 0) {
                        var msg = r[userfound].email == "void" ? null : "ver_ver";
                        res.send(JSON.stringify(my_repo(1, msg)));
                    }
                    else if (namefound >= 0) {
                        res.send(JSON.stringify(my_repo(2, "password is invalid")));
                    }
                    else {
                        res.send(JSON.stringify(my_repo(0, "invalid username and password")));
                    }
                }
                else {
                    res.send(JSON.stringify(my_repo(-1, null)));
                }
            }
        });
    }
});
app.post("/api/pval", function (req, res) {
    var pass = req.body;
    fs_1.default.readFile(usersdata, "utf-8", function (err, data) {
        if (err) {
            res.status(500).send("user file r error");
        }
        else {
            if (typeof JSON.parse(data) == "object") {
                var redata = JSON.parse(data);
                var found_user = redata.find(function (item) { return pass.username == item.username; });
                if (found_user != undefined) {
                    if (found_user.password == pass.password) {
                        res.send(JSON.stringify(my_repo(1, "gud")));
                    }
                    else {
                        res.send(JSON.stringify(my_repo(2, "bad")));
                    }
                }
                else {
                    res.send(JSON.stringify(my_repo(0, "imp_po_s")));
                }
            }
            else {
                res.status(500).send("user file p error");
            }
        }
    });
});
app.post("/api/chpass", function (req, res) {
    var data = req.body;
    if (!data) {
        res.status(300).send("required parameters are not available");
    }
    else {
        fs_1.default.readFile(usersdata, "utf-8", function (err, dat) {
            if (err) {
                res.status(300).send("file r error");
            }
            else {
                var read_data = JSON.parse(dat);
                if (typeof read_data == "object") {
                    var num = read_data.findIndex(function (item) { return data.username == item.username; });
                    if (num >= 0) {
                        read_data[num].password = data.password;
                        fs_1.default.writeFile(usersdata, JSON.stringify(read_data), function (err) {
                            if (err) {
                                res.status(300).send("file w error");
                            }
                            else {
                                res.send(JSON.stringify(my_repo(1, "succ")));
                            }
                        });
                    }
                    else {
                        res.send(JSON.stringify(my_repo(0, "this user has either been removed or no longer goes by \"".concat(data.username, "\""))));
                    }
                }
            }
        });
    }
});
app.post("/api/chuser", function (req, res) {
    var data = req.body;
    if (!data)
        res.end(function () {
            res.status(500).send("important parameters are missing");
        });
    fs_1.default.readFile(usersdata, "utf-8", function (err, data_from_file) {
        if (err) {
            res.status(500).send("file r error");
        }
        else {
            var parsed_data = JSON.parse(data_from_file);
            var if_found = parsed_data.findIndex(function (item) { return item.username == data.old_user; });
            if (if_found < 0) {
                res.send(JSON.stringify(my_repo(0, "this user \"".concat(data.old_user, "\" profile does not exist in our database"))));
            }
            else {
                parsed_data[if_found].username = data.new_user;
                fs_1.default.writeFile(usersdata, JSON.stringify(parsed_data), function (err) {
                    if (err) {
                        res.status(500).send("file w error");
                    }
                    else {
                        res.send(JSON.stringify(my_repo(1, "succ")));
                    }
                });
            }
        }
    });
});
app.post("/api/coll_store", function (req, res) {
    var collected_data = req.body;
    var new_array = [];
    fs_1.default.readFile(collection_DATA, "utf-8", function (err, data) {
        if (err)
            return res.sendStatus(500);
        if (string_data_auth(data)) {
            var j_data_1 = JSON.parse(data);
            var find_if_exist_to_user = j_data_1.findIndex(function (item) { return item.user == collected_data.user && parts_check(item.parts.strap_img_name, item.parts.dial_img_name, item.parts.case_img_name); });
            if (find_if_exist_to_user >= 0)
                return res.send(my_repo(2, "f_o_d"));
            var len_1 = j_data_1.length;
            collected_data.id = len_1 + 1;
            j_data_1.push(collected_data);
            setTimeout(function () { return trans_to_db(j_data_1, len_1 + 1); }, 2000);
        }
        else {
            collected_data.id = 1;
            new_array.push(collected_data);
            trans_to_db(new_array, 1);
        }
    });
    function trans_to_db(arr, num) {
        fs_1.default.writeFile(collection_DATA, JSON.stringify(arr), function (err) {
            if (err)
                res.status(200).send(JSON.stringify(my_repo(0, "err_w_file")));
            else
                res.status(200).send(JSON.stringify(my_repo(1, "succ_".concat(num))));
        });
    }
    function parts_check(strap, dial, cas) {
        var b = false;
        var partss = collected_data.parts;
        if (strap == partss.strap_img_name && dial == partss.dial_img_name && cas == partss.case_img_name) {
            b = true;
        }
        return b;
    }
});
// DELETES
app.delete("/api/dels/:id", function (rq, rs) {
    var id = rq.params.id;
    fs_1.default.readFile(collection_DATA, { encoding: "utf-8" }, function (er, dt) {
        if (er)
            return rs.status(500).send("server failure");
        if (string_data_auth(dt)) {
            var collections = JSON.parse(dt);
            var index_coll = collections.findIndex(function (item) { return item.id == parseInt(id); });
            if (index_coll < 0) {
                rs.send(JSON.stringify(my_repo(0, "seems like this collection has been deleted in our records")));
            }
            else {
                collections.splice(index_coll, 1);
                fs_1.default.writeFile(collection_DATA, JSON.stringify(collections), function (er) {
                    if (er)
                        rs.status(500).send("file w error");
                    else
                        rs.send(JSON.stringify(my_repo(1, null)));
                });
            }
        }
        else {
            rs.status(500).send("file r error");
        }
    });
});
