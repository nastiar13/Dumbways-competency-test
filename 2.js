function sort(arr) {
    let array = arr
    let order = "Dumbways is awesome".split("")
    for(let i = 0; i < array.length; i++) {
        for(let j = 0; j+i < order.length; j++) {
            if(array[i] == order[j]) {
                [array[i],array[j+1]] = [array[j+1],array[i]]
            }
        }
    }
    return console.log([array.join(''),order.join('')])
}

sort(['u', 'D', 'm', 'w', 'b', 'a', 'y', 's', 'i', 's', 'w', 'a', 'e', 's', 'e', 'o', 'm',' ' ,' '])