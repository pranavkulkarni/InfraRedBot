exports.test = function (req, res) {
    console.log("yo");
    setTimeout(function() {
        console.log("yo2");
        res.send({"status": 200});
    }, 200000);
}