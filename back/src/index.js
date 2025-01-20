const server = require("./app.js");
const { conn } = require("./db.js")

const PORT = 3001;

conn.sync({ force: true }).then(() => {
    console.log("DB connect success");
    server.listen(PORT, () => {
        console.log(`Server raised in port: ${PORT}`)
    });
});