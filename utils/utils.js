const dayjs = require("dayjs")

const generateMessage = (username,text,group) => {
    return {
        username,
        text,
        group,
        createdAt:dayjs().format('DD-MM-YYYY hh:mm A')
    }
}

module.exports = {
    generateMessage
}