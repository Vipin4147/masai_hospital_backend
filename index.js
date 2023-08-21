const express = require("express");

// const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const { connection } = require("./config/db.js");

const { UserModel } = require("./models/usermodel.js");

const { DoctorModel } = require("./models/doctormodel.js");

const { authenticate } = require("./middleware/authenticate.js");

const app = express();

const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    res.send("welcome user");
  } catch (error) {
    console.log("err", error);
  }
});

app.post("/signup", async (req, res) => {
  const { email, password, confirm_pass } = req.body;

  if (password != confirm_pass) {
    alert("password not matched please enter again");
    res.send({ msg: "password not matched" });
    return;
  } else {
    const user = await UserModel.find({ email });

    if (user.length > 0) {
      res.send({ msg: "already registered please login" });
    } else {
      bcrypt.hash(password, 6, async (err, hashed_pass) => {
        if (err) {
          console.log(err);
          res.send("err", err);
        }
        const new_user = await new UserModel({
          email,
          password: hashed_pass,
        });
        new_user.save();
        res.send({ msg: "user registered successfully" });
      });
    }
  }
});

// login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await UserModel.find({ email });
  if (user.length > 0) {
    const hashed_pass = await bcrypt.compare(password, user[0].password);
    if (!hashed_pass) {
      console.log("Invalid Credentials");
      alert("Invalid Credentials");
      res.send("Invalid Credentials");
    } else {
      const token = jwt.sign({ userId: user[0]._id }, "masai");
      console.log(token);
      res.send({ msg: "Login successful", token });
    }
  }
});

app.post("/appointments", authenticate, async (req, res) => {
  try {
    const { name, image, specialization, experience, location, slots, fee } =
      req.body;

    const date = Date.now();

    const doctor = await DoctorModel({
      name,
      image,
      specialization,
      experience,
      location,
      date,
      slots,
      fee,
    });

    doctor.save();
    res.send({ msg: "appointment created successfully" });
  } catch (error) {
    console.log("err", error);
    res.send({ err: error });
  }
});

app.get("/appointments", authenticate, async (req, res) => {
  try {
    const doctors = await DoctorModel.find();
    res.send(doctors);
  } catch (error) {
    console.log("err", error);
    res.send("err", error);
  }
});

app.get("/appointments/:specialization", authenticate, async (req, res) => {
  try {
    const specialization = req.params.specialization;
    const doctors = await DoctorModel.find({ specialization });
    if (doctors.length == 0) {
      res.send({ msg: "No doctor found" });
    } else {
      res.send(doctors);
    }
  } catch (error) {
    console.log("err", error);
    res.send("err", error);
  }
});

app.get("/appointment/:order", authenticate, async (req, res) => {
  try {
    const dat = req.params.order;
    const doctors = await DoctorModel.find({}).sort({ date: dat });
    if (doctors.length == 0) {
      res.send({ msg: "No doctor found" });
    } else {
      res.send(doctors);
    }
  } catch (error) {
    console.log("err", error);
    res.send("err", error);
  }
});

app.get("/appoint/:search", authenticate, async (req, res) => {
  try {
    const search = req.params.search;
    const doctors = await DoctorModel.find({ name: search });
    if (doctors.length == 0) {
      res.send({ msg: "No doctor found" });
    } else {
      res.send(doctors);
    }
  } catch (error) {
    console.log("err", error);
    res.send("err", error);
  }
});

app.patch("/appointments/:id", async (req, res) => {
  try {
    const payload = req.body;
    const ID = req.params.id;

    const doctor = await DoctorModel.findByIdAndUpdate(ID, payload);
    res.send({ msg: "Information updated successfully" });
  } catch (error) {
    console.log("err", error);
    res.send(error);
  }
});

app.delete("/appointments/:id", async (req, res) => {
  try {
    const ID = req.params.id;
    const doctor = await DoctorModel.findByIdAndDelete(ID);
    res.send({ msg: "information deleted successfully" });
  } catch (error) {
    console.log("err", error);
    res.send(error);
  }
});

app.listen(6100, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
  console.log("running at 6100");
});
