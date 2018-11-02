var today = (function() {
    var today = new Date();
    return {
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
    }
}())
console.log(today)