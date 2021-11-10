const isDup = (arr, email) => {
    return arr.find(e => e.email == email)
}

const isMatch = (arr, email, pass) => {
    return arr.find(e => e.email == `${email}` && e.pass == `${pass}`)
}


module.exports = {isDup, isMatch}