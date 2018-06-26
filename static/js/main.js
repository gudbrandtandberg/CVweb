cfg = {position: "clear",
           dropOffBoard: "trash",
           orientation: "white",
           sparePieces: false,
           showErrors: "console"
        }

var board = ChessBoard('board', cfg);

var init = function() {

    // The displayed chessboard (chessboard.js)

    //var board = ChessBoard('board', cfg);

    var endpoint = document.getElementById("endpoint").innerHTML
    
    var cv_algo_url = endpoint + "cv_algo/"
    var feedback_url = endpoint + "feedback/"
    var analyze_url = endpoint + "analyze/"

    $("#upload-form").submit(function(event) {
        event.preventDefault()
        var file = document.getElementById("image-input").files[0]
        // TODO input check, crop. etc.
        var formData = new FormData(this);
        
        $.ajax({
            url: cv_algo_url,
            method: "POST", 
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                //parse data = {FEN: "...", id: "..."}
                res = JSON.parse(data)
                
                if (res.error == "false") {
                    setFEN(res.FEN)
                    document.getElementById("raw-id-input").value = res.id
                    $("#feedback-pane").show()
                    $("#image-preview").hide()
                    $("#board").show()

                } else {
                    console.log(res)
                }
            },
            error: function(xmlHttpRequest, textStatus, errorThrown) {
                if (xmlHttpRequest.readyState == 0 || xmlHttpRequest.status == 0) {
                    alert("Connection to ChessVision server failed. It is probably sleeping..")
                    return
                } else {
                    alert(textStatus)
                }
            }
        })
    })

    $("#feedback-form").submit(function(event) {
    
        event.preventDefault()
        var position = board.position()
        console.log(position)

        var formData = new FormData(this);
        formData.append("position", JSON.stringify(position))

        flip = document.getElementById("reversed-input").checked ? "true" : "false"
        formData.append("flip", flip)
    
        $.ajax({
            url: feedback_url,
            method: "POST",
            data: formData, 
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                res = JSON.parse(data)
                document.getElementById("feedback-pane").style.display = "none"
                if (res.success == "true") {
                    alert("Thanks for your feedback!")
                } else {
                    alert("Something went wrong, your feedback was not taken into consideration")
                    }           
                },
            error: function(data) {
                alert(data)
                console.log(data)
                }
            })
        })

    $("#analyze-form").submit(function(event) {
        event.preventDefault()
        var formData = new FormData(this);

        // get valid fen from board + input tags.
        var fen = board.fen()
        fen = expandFen(fen)
        console.log(fen)

        formData.append("FEN", fen)

        $.ajax({
            url: analyze_url,
            method: "POST",
            data: formData, 
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                res = JSON.parse(data)
                if (res.success == "false") {
                    alert("Analysis failed..")
                    return
                }
                alert("Best move is " + res.bestMove)
                },
            error: function(data) {
                alert("error")
                console.log(data)
                }
            })
    })

    var expandFen = function(fen) {
        var move = document.querySelector('input[name="move"]:checked').value;
        var castle = "-"
        var ep = "-"
        var halfmove = "0"
        var fullmove = "1"
        var sep = " "
        var toAdd = [move, castle, ep, halfmove, fullmove]

        for (var i=0; i < toAdd.length; i++) {
            fen += sep
            fen += toAdd[i]
        }

        return fen
    }

    document.getElementById('image-input').onchange = function (evt) {

        $("#board").hide()

        var tgt = evt.target || window.event.srcElement,
            files = tgt.files;

        // FileReader support
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function(data) {
                var imageData = data.target.result
                // Show preview of uploaded image
                document.getElementById("image-preview").src = imageData
            }
            fr.readAsDataURL(files[0]);
        }
        else {
            console.log("Cancelled load..")
        }

        $("#image-preview").show()
    }

    }; // end init()

var setFEN = function(fen) {
    
    orientation = document.getElementById("reversed-input").checked ? "black" : "white"
    board.orientation(orientation)
    board.position(fen, true)
    
}

$(document).ready(init);