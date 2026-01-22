const val = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
}).format(0);
console.log(`Value for 0: '${val}'`);

const val2 = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
}).format(1234);
console.log(`Value for 1234: '${val2}'`);
