
function getTrend(currentMonth, previousMonth) {
    if (currentMonth > previousMonth) {
        return "greater";
    }
    if (currentMonth < previousMonth) {
        return "less";
    }
    if (currentMonth == previousMonth) {
        return "equal";
    }
}

module.exports = getTrend;