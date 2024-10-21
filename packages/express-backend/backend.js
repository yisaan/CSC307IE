import express from "express";
import cors from "cors";
import userService from "./services/user-service"; 

const app = express();
const port = 8000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello Earth!");
});


app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    userService.getUsers(name, job)
        .then((result) => {
            res.json({ users_list: result });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error retrieving users.");
        });
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"];
    
    userService.findUserById(id)
        .then((result) => {
            if (result) {
                res.json(result);
            } else {
                res.status(404).send("User not found.");
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error retrieving user.");
        });
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    
    userService.addUser(userToAdd)
        .then((createdUser) => {
            res.status(201).json({ message: "User created", user: createdUser });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error creating user.");
        });
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];

    userService.findUserById(id)
        .then((user) => {
            if (!user) {
                res.status(404).send("User not found.");
            } else {
                userService.deleteUserById(id)
                    .then(() => res.status(204).send())
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send("Error deleting user.");
                    });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error retrieving user.");
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
