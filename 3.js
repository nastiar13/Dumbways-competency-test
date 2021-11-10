function cetakPola(n) {
    for(let i = n; i > 0; i--) {
        if( i % 2 == 1) {
            console.log((" ").repeat(n-i)+("# + ").repeat((i-1)/2) +'#')
        }else {
            console.log((' ').repeat(n-i)+('+ ').repeat(i))
        }
    }
}

cetakPola(7)