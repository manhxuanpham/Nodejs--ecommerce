const app = require("./src/app");
const PORT = process.env.DEV_APP_PORT  || 3055

const server = app.listen(PORT, () => {
    console.log("ecommerce start with",PORT);
})

// process.on('SIGINT', () => {
//     server.close( ()=> {
//         console.log("exit server express")
//       //  app.notify.send(...ping)
//     })
// })
