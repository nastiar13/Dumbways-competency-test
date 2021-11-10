function totalMoney() {
    
    const now = 1000000000;
    const bank = 350000000;
    const other = now - bank;

    let totalProfit = 0;
    let bankProfit = bank * 3.5 / 100;
    let oblProfit = other * 30 / 100 * 13 / 100;
    let bProfit = other * 35 / 100 * 12.5 / 100;
    let aProfit = other * 35 / 100 * 14.5 / 100;

    [bankProfit, oblProfit, aProfit, bProfit].forEach(a => {
        totalProfit += a*2;
    })

    return console.log(now + totalProfit);

}

totalMoney()