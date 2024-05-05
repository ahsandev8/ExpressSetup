import express from "express";

const app = express();

// read body data form post request
app.use(express.json());

const PORT = process.env.PORT || 4000;

const usersData = [
    { id: 1, username: "jhon", displayName: "Jhon" },
    { id: 2, username: "dev", displayName: "Dev" },
    { id: 3, username: "joy", displayName: "Joy" },
];

app.get("/", (req, res) => {
    res.status(201).send({ data: "hello" });
});

app.get("/users", (req, res) => {
    const {
        query: { filter, value },
    } = req;

    if (filter && value) return res.send(usersData.filter((user) => user[filter].includes(value)));

    return res.send(usersData);
});

app.get("/users/:id", (req, res) => {
    const parseId = parseInt(req.params.id);
    if (isNaN(parseId)) return res.status(400).send({ meg: "Bad request. Invalid Id." });

    const userFind = usersData.find((user) => user.id === parseId);
    if (!userFind) return res.sendStatus(404);
    return res.send(userFind);
});

app.post("/users", (req, res) => {
    const { body } = req;

    const newUser = { id: usersData[usersData.length - 1].id + 1, ...body };
    usersData.push(newUser);
    return res.status(201).send(newUser);
});

app.put("/users/:id", (req, res) => {
    const {
        body,
        params: { id },
    } = req;

    const parseId = parseInt(id);
    if (isNaN(parseId)) return res.sendStatus(400);

    const findUserIndex = usersData.findIndex((user) => user.id === parseId);

    if (findUserIndex === -1) return res.sendStatus(400);

    usersData[findUserIndex] = { id: parseId, ...body };

    return res.sendStatus(200);
});

app.patch("/users/:id", (req, res) => {
    const {
        body,
        params: { id },
    } = req;

    const parseId = parseInt(id);
    if (isNaN(parseId)) return res.sendStatus(400);

    const findUserIndex = usersData.findIndex((user) => user.id === parseId);

    if (findUserIndex === -1) return res.sendStatus(400);

    usersData[findUserIndex] = { ...usersData[findUserIndex], ...body };

    return res.sendStatus(200);
});

app.delete("/users/:id", (req, res) => {
    const {
        params: { id },
    } = req;

    const parseId = parseInt(id);
    if (isNaN(parseId)) return res.sendStatus(400);

    const findUserIndex = usersData.findIndex((user) => user.id === parseId);

    if (findUserIndex === -1) return res.sendStatus(404);

    usersData.splice(findUserIndex, 1);
    // usersData.pop(findUserIndex);

    return res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`);
});
