const Router = require("express");
const router = new Router();
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");

const secretKey = config.get("secretKey");

const generateAcsessToken = (id, email) => {
  const payload = {
    id,
    email,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
};

router.post(
  "/registration",
  [
    check("username", "Имя пользователя не может быть пустым").notEmpty(),
    check("email", "Неверный email").isEmail(),
    check(
      "password",
      "Пароль должен быть больше 6 и меньше 12 символов"
    ).isLength({ min: 6, max: 12 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { username, email, password } = req.body;
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким ником уже существует" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = await new User({ username, email, password: hashPassword });
      await user.save();
      return res.json({ message: "Пользователь был успешно зарегистрирован" });
    } catch (error) {
      console.log(error, "ошибка на регистрации");
      res.status(400).json({ message: "Registration error" });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const {  email, password } = req.body;
    const registredUser = await User.findOne({ email });
    if (!registredUser) {
      res.status(400).json(`Пользователь ${username} не найден`);
    }
    const valisPasswod = bcrypt.compareSync(password, registredUser.password);
    if (!valisPasswod) {
      res.status(400).json("Неверный пароль");
    }
    const token = generateAcsessToken(registredUser._id, registredUser.email);
    return res.json({token})
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Login error" });
  }
});

router.get("/users", (req, res) => {
  try {
    res.send("its get a users");
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Registration error" });
  }
});

module.exports = router;
