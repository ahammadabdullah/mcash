const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://mcash-3bd0b.web.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Access-Control-Allow-Headers",
    ],
  })
);
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:5173",
    "https://mcash-3bd0b.web.app"
  );
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
    const requestCollection = client.db("mCash").collection("requests");

    // registration api
    app.post("/v1/register", async (req, res) => {
      const { email, pin, name, number, role, NID } = req.body;
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
          NID,
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
      try {
        const { number, pin } = req.body;
        const user = await userCollection.findOne({ number });
        if (user) {
          if (user.isLoggedIn === true) {
            res
              .status(400)
              .send({ success: false, message: "User already logged in" });
            return;
          }
          if (user.status === "blocked") {
            res.send({ success: false, message: "User is blocked" });
            return;
          }
          if (user.status === "pending") {
            res.send({ success: false, message: "Agent is not verified yet" });
            return;
          }
          if (user.pin === pin) {
            const token = jwt.sign(
              { number: user.number, role: user.role },
              process.env.secretKey,
              {
                expiresIn: "24h",
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
            const result = await userCollection.updateOne(
              { number },
              { $set: { isLoggedIn: true } }
            );
          } else {
            res
              .status(400)
              .send({ success: false, message: "Wrong Credentials" });
          }
        } else {
          res
            .status(400)
            .send({ success: false, message: "Wrong Credentials" });
        }
      } catch (error) {
        res.send({ success: false, message: "Something went wrong" });
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
    // get user by number api PUBLIC
    app.get("/v1/users/:number", async (req, res) => {
      try {
        const projection = {
          pin: 0,
        };
        const result = await userCollection.findOne(
          {
            number: req.params.number,
          },
          { projection }
        );
        res.status(200).send(result);
      } catch (error) {
        res.send({ success: false, message: "An error occurred" });
      }
    });

    // get all users for admin

    app.get("/v1/allUsers", verifyToken, async (req, res) => {
      const filter = {
        $and: [
          { $or: [{ role: "user" }, { role: "agent" }] },
          { status: { $ne: "pending" } },
        ],
      };
      const projection = {
        pin: 0,
        balance: 0,
      };
      const result = await userCollection
        .find(filter, projection)
        .sort({ role: 1 })
        .toArray();
      res.send(result);
    });

    // user bblock unblock action for admin
    app.put("/v1/userAction/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if (user.status === "verified") {
          const result = await userCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: "blocked" } }
          );
        } else {
          const result = await userCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { status: "verified" } }
          );
        }
        res.send({
          success: true,
          message: "User status updated Successfully",
        });
      } catch (error) {
        res.send({ success: false, message: "Something Went Wrong" });
      }
    });
    // send money user to user
    app.post("/v1/sendMoney", verifyToken, async (req, res) => {
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
    });

    // cash out to agents

    app.post("/v1/cashOut", verifyToken, async (req, res) => {
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
    // cash in to user

    app.post("/v1/cashIn", verifyToken, async (req, res) => {
      const info = req.body;
      const amount = parseInt(info.amount);
      const agent = await userCollection.findOne({ number: info.agentNumber });
      const user = await userCollection.findOne({ number: info.userNumber });
      if (agent.pin !== info.pin) {
        res.send({ success: false, message: "Wrong pin" });
        return;
      }
      if (user.role !== "user") {
        res.send({ success: false, message: "user not found" });
        return;
      }
      if (agent.balance < info.amount) {
        res.send({ success: false, message: "Insufficient balance" });
        return;
      }
      const sent = await userCollection.updateOne(
        { number: info.agentNumber },
        { $inc: { balance: -amount } }
      );
      const received = await userCollection.updateOne(
        { number: info.userNumber },
        { $inc: { balance: amount } }
      );
      const transactionDetails = {
        sender: info.agentNumber,
        receiver: info.userNumber,
        amount: info.amount,
        date: new Date(),
        type: "cash in",
      };
      const result = await transactionCollection.insertOne(transactionDetails);
      res.send({ success: true, message: "Cash in successful" });
    });
    // get user transaction details
    app.get("/v1/userTransactions/:number", verifyToken, async (req, res) => {
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

    app.get("/v1/transactions", verifyToken, async (req, res) => {
      const result = await transactionCollection.find().toArray();
      res.send(result);
    });
    // get agent requests
    app.get("/v1/agentRequests", verifyToken, async (req, res) => {
      const result = await userCollection
        .find({ role: "agent", status: "pending" })
        .toArray();
      res.send(result);
    });

    // approve agent
    app.put("/v1/approveAgent/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const result = await userCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "verified" } }
        );
        res.send({ success: true, message: "Agent approved successfully" });
      } catch (error) {
        res.status(500).send({ success: false, message: "An error occurred" });
      }
    });
    // decline agent

    app.put("/v1/declineAgent/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const result = await userCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "declined" } }
        );
        res.send({ success: true, message: "Agent declined successfully" });
      } catch (error) {
        res.status(500).send({ success: false, message: "An error occurred" });
      }
    });

    // get verified agents for users
    app.get("/v1/verifiedAgents", verifyToken, async (req, res) => {
      const projection = {
        pin: 0,
        balance: 0,
      };
      const result = await userCollection
        .find({ role: "agent", status: "verified" }, { projection })
        .toArray();
      res.send(result);
    });

    // get total balance of this bank
    app.get("/v1/totalBalance", verifyToken, async (_, res) => {
      const result = await userCollection
        .aggregate([
          {
            $group: {
              _id: null,
              total: {
                $sum: "$balance",
              },
            },
          },
        ])
        .toArray();
      res.send(result[0]);
    });

    // cash request for agent to admin

    app.post("/v1/cashRequest", verifyToken, async (req, res) => {
      try {
        const info = req.body;
        const prevReq = await requestCollection.findOne({
          agentNumber: info.agentNumber,
          type: "cash",
        });
        if (prevReq) {
          if (prevReq.status === "pending") {
            res.send({ success: false, message: "Request already sent" });
            return;
          }
        }
        const result = await requestCollection.insertOne(info);
        res.send({ success: true, message: "Request sent successfully" });
      } catch (error) {
        res.status(500).send({ success: false, message: "An error occurred" });
      }
    });

    // get cash request for admin
    app.get("/v1/cashRequestsForAdmin", verifyToken, async (req, res) => {
      const filter = {
        status: "pending",
        type: "cash",
      };
      const result = await requestCollection.find(filter).toArray();
      res.send(result);
    });
    // accept cash request by admin
    app.put("/v1/acceptCashRequest/:id", verifyToken, async (req, res) => {
      try {
        const { number } = req.body;
        const id = req.params.id;
        const update = await userCollection.updateOne(
          { number: number },
          { $inc: { balance: 100000 } }
        );
        const result = await requestCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "accepted" } }
        );
        const transactionDetails = {
          sender: "admin",
          receiver: number,
          amount: 100000,
          date: new Date(),
          type: "cash Request",
        };
        const transaction = await transactionCollection.insertOne(
          transactionDetails
        );
        res.send({ success: true, message: "Request accepted successfully" });
      } catch (error) {
        res.send({ success: false, message: "An error occurred" });
      }
    });

    // withdraw request by agent
    app.post("/v1/withdrawRequest", verifyToken, async (req, res) => {
      const incomingInfo = req.body;
      const sender = await userCollection.findOne({
        number: incomingInfo.agentNumber,
      });

      if (sender.pin !== incomingInfo.pin) {
        res.send({ success: false, message: "Wrong pin" });
        return;
      }
      const prevReq = await requestCollection.findOne({
        agentNumber: incomingInfo.agentNumber,
        type: "withdraw",
      });
      if (prevReq) {
        if (prevReq.status === "pending") {
          res.send({ success: false, message: "Request already sent" });
          return;
        }
      }
      if (sender.balance < incomingInfo.balance) {
        res.send({ success: false, message: "Insufficient balance" });
        return;
      }
      const info = {
        status: "pending",
        type: "withdraw",
        agentNumber: incomingInfo.agentNumber,
        amount: incomingInfo.amount,
        date: incomingInfo.date,
      };
      const result = await requestCollection.insertOne(info);
      res.send({ success: true, message: "Request sent successfully" });
    });
    // get withdraw request for admin
    app.get("/v1/withdrawRequests", verifyToken, async (req, res) => {
      const filter = {
        status: "pending",
        type: "withdraw",
      };
      const result = await requestCollection.find(filter).toArray();
      res.send(result);
    });
    // accept withdraw request by admin
    app.put("/v1/acceptWithdrawRequest/:id", verifyToken, async (req, res) => {
      try {
        const { agentNumber, amount } = req.body;
        const id = req.params.id;
        const update = await userCollection.updateOne(
          { number: agentNumber },
          { $inc: { balance: -amount } }
        );
        const result = await requestCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: "accepted" } }
        );
        const transactionDetails = {
          sender: agentNumber,
          receiver: "admin",
          amount: amount,
          date: new Date(),
          type: "WithDraw",
        };
        const transaction = await transactionCollection.insertOne(
          transactionDetails
        );
        res.send({ success: true, message: "Request accepted successfully" });
      } catch (error) {
        res.send({ success: false, message: "An error occurred" });
      }
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

app.get("/", (req, res) => {
  res.send("Welcome to mCash API");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
