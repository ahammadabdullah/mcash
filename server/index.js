const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.tfydztw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// verify token
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(403).send({ message: " access forbidden" });
  }
  jwt.verify(token, process.env.secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.user = decoded;
    next();
  });
};
async function run() {
  try {
    // collections
    const userCollection = client.db("mCash").collection("users");
    const transactionCollection = client.db("mCash").collection("transactions");

    // registration api
    app.post("/v1/register", async (req, res) => {
      const { email, pin, name, number, role } = req.body;
      const filter = { $or: [{ email }, { number }] };
      const user = await userCollection.findOne(filter);
      let balance = 0;
      let status = "verified";
      if (user) {
        res
          .status(400)
          .send({ success: false, message: "User already exists" });
      } else {
        if (role === "user") {
          balance = 40;
        } else if (role === "agent") {
          balance = 100000;
          status = "pending";
        }
        const newUser = await userCollection.insertOne({
          email,
          pin,
          name,
          number,
          role,
          balance,
          status,
          isLoggedIn: true,
        });
        const token = jwt.sign(
          { number: number, role: role },
          process.env.secretKey,
          {
            expiresIn: "1h",
          }
        );
        res
          .status(200)
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .send({ success: true, message: "User created successfully" });
      }
    });

    // login api
    app.put("/v1/login", async (req, res) => {
      const { number, pin } = req.body;
      const user = await userCollection.findOne({ number });
      if (user) {
        if (user.isLoggedIn === true) {
          res
            .status(400)
            .send({ success: false, message: "User already logged in" });
          return;
        }
        if (user.pin === pin) {
          const result = await userCollection.updateOne(
            { number },
            { $set: { isLoggedIn: true } }
          );
          const token = jwt.sign(
            { number: user.number, role: user.role },
            process.env.secretKey,
            {
              expiresIn: "1h",
            }
          );
          res
            .status(200)
            .cookie("token", token, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
            })
            .send({ success: true, message: "Login successful" });
        } else {
          res
            .status(400)
            .send({ success: false, message: "Wrong Credentials" });
        }
      } else {
        res.status(400).send({ success: false, message: "Wrong Credentials" });
      }
    });
    // logout api
    app.put("/v1/logout", async (req, res) => {
      const { number } = req.body;
      const result = await userCollection.updateOne(
        { number },
        { $set: { isLoggedIn: false } }
      );
      res
        .clearCookie("token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        })
        .status(200)
        .send({ success: true, message: "Logout successful" });
    });

    // get user by number api
    app.get("/v1/users/:number", async (req, res) => {
      const projection = {
        password: 0,
      };
      const result = await userCollection.findOne(
        {
          number: req.params.number,
        },
        { projection }
      );
      res.status(200).send(result);
    });

    // send money user to user
    app.post("/v1/sendMoney", async (req, res) => {
      const info = req.body;
      let fee = 0;
      const amount = parseInt(info.amount);
      const sender = await userCollection.findOne({ number: info.sender });
      const receiver = await userCollection.findOne({ number: info.receiver });
      const admin = await userCollection.findOne({ email: "admin@mcash.com" });
      if (sender.pin !== info.pin) {
        res.send({ success: false, message: "Wrong pin" });
        return;
      }
      if (!receiver) {
        res.send({ success: false, message: "Receiver not found" });
        return;
      }
      if (sender.balance < info.amount) {
        res.send({ success: false, message: "Insufficient balance" });
        return;
      }
      if (info.amount > 100) {
        fee = 5;
      }
      const sent = await userCollection.updateOne(
        { number: info.sender },
        { $inc: { balance: -(amount + fee) } }
      );
      const received = await userCollection.updateOne(
        { number: info.receiver },
        { $inc: { balance: amount } }
      );
      const adminIncome = await userCollection.updateOne(
        { email: "admin@mcash.com" },
        { $inc: { balance: fee } }
      );
      const transactionDetails = {
        sender: info.sender,
        receiver: info.receiver,
        amount: info.amount,
        date: new Date(),
        type: "send money",
      };
      const result = await transactionCollection.insertOne(transactionDetails);
      res.send({ success: true, message: "Money sent successfully" });
      console.log(result);
    });

    // cash out to agents

    app.post("/v1/cashOut", async (req, res) => {
      const info = req.body;
      const amount = parseInt(info.amount);
      const fee = (amount / 100) * 1.5;
      const adminFee = (amount / 100) * 0.5;
      const agentFee = (amount / 100) * 1;
      const sender = await userCollection.findOne({ number: info.userNumber });
      const agent = await userCollection.findOne({ number: info.agentNumber });
      if (sender.pin !== info.pin) {
        res.send({ success: false, message: "Wrong pin" });
        return;
      }
      if (sender.balance < info.amount) {
        res.send({ success: false, message: "Insufficient balance" });
        return;
      }
      if (agent.role !== "agent") {
        res.send({ success: false, message: "Agent not found" });
        return;
      }
      const sent = await userCollection.updateOne(
        { number: info.userNumber },
        { $inc: { balance: -(amount + fee) } }
      );
      const received = await userCollection.updateOne(
        { number: info.agentNumber },
        { $inc: { balance: amount, income: agentFee } }
      );

      const adminIncome = await userCollection.updateOne(
        { email: "admin@mcash.com" },
        { $inc: { balance: adminFee } }
      );
      const transactionDetails = {
        sender: info.userNumber,
        receiver: info.agentNumber,
        amount: info.amount,
        date: new Date(),
        type: "cash out",
      };
      const result = await transactionCollection.insertOne(transactionDetails);
      res.send({ success: true, message: "Cash out successful" });
    });

    // get user transaction details
    app.get("/v1/userTransactions/:number", async (req, res) => {
      const userNumber = req.params.number;
      const filter = {
        $or: [{ sender: userNumber }, { receiver: userNumber }],
      };
      const result = await transactionCollection
        .find(filter)
        .sort({ _id: -1 })
        .limit(100)
        .toArray();
      res.send(result);
    });
    // get all transaction details

    app.get("/v1/transactions", async (req, res) => {
      const result = await transactionCollection.find().toArray();
      res.send(result);
    });
    // get agent requests
    app.get("/v1/agentRequests", async (req, res) => {
      const result = await userCollection
        .find({ role: "agent", status: "pending" })
        .toArray();
      res.send(result);
    });

    // approve agent
    app.put("/v1/approveAgent/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "verified" } }
      );
      res.send({ success: true, message: "Agent approved successfully" });
    });
    // decline agent

    app.put("/v1/declineAgent/:id", async (req, res) => {
      const id = req.params.id;
      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "declined" } }
      );
      res.send({ success: true, message: "Agent declined successfully" });
    });

    // get verified agents for users
    app.get("/v1/verifiedAgents", async (req, res) => {
      const projection = {
        pin: 0,
        balance: 0,
      };
      const result = await userCollection
        .find({ role: "agent", status: "verified" }, { projection })
        .toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/v1", (req, res) => {
  res.send("First version of this server is running well");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
