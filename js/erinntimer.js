function getErinnTime(datetime) {
    const h = datetime.getHours();
    const m = datetime.getMinutes();
    const s = datetime.getSeconds();

    const real_seconds = Number(h) * 3600 + Number(m) * 60 + Number(s);
    const erinn_seconds = real_seconds % (36 * 60);
    const erinn_time = (24) * (erinn_seconds / (36 * 60));

    const eh = Math.floor(erinn_time);
    const em = Math.floor(60 * (erinn_time - Math.floor(erinn_time)));

    return [eh, em];
}


$(document).ready(function () {
    // ◆エリン時計
    setInterval(function () {
        const [eh, em] = getErinnTime(new Date());

        const ehh = ('0' + eh).slice(-2);
        const emm = ('0' + em).slice(-2);

        $("#mabi-clock #time").text(ehh + ":" + emm);

    }, 1000);
});