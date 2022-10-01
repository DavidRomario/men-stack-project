const UserSchema = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET

const getAll = async (req, res) => {
    const authHeader = req.get("authorization");
    // console.log("Header", authHeader)
    const token = authHeader.split(" ")[1];
    // console.log("TOKEN", token)

    if (!token) {
      return res.status(401).send("Erro no header");
    }

    jwt.verify(token, SECRET, (err) => {
      if(err){
        return res.status(401).send("Não autorizado")
      }

    });

    UserSchema.find(function (err, users) {
    if (err) {
      res.status(500).send({ message: err.message });
    }
    res.status(200).send(users);
  });
};

const createUser = async (req, res) => {

  //bcrypt.haschSync(Valor a ser hasherizado, salt)

  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  try {
    //acessar as informações do body da requisição

    const newUser = new UserSchema(req.body);
    console.log("Novo usuario criado", newUser);

    const savedUser = await newUser.save();
    console.log("Novo usuario salvo no banco", savedUser)

    res.status(201).send({
      message: "Novo usuário criado com sucesso",
      savedUser,
    });
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  getAll,
  createUser,
};
