var board, cropper, cropperOptions;

var init = function() {

    $("#board-state-pane").hide()
    $("#edit-analyze-pane").hide()
    //$("#image-preview").hide()
    //$("#board").hide()
    //$("#preview-container").show()
    $("#board-container").hide()

    cfg = {position: "8/8/8/8/8/8/8/8 w KQkq -",
           dropOffBoard: "trash",
           orientation: "white",
           sparePieces: false,
           showErrors: "console"
        }

    // The displayed chessboard (chessboard.js)
    board = ChessBoard('board', cfg);
    $(window).resize(board.resize);

    cropperOptions = { dragMode: "move",
                cropBoxMovable: false,
                cropBoxResizable: false,
                autoCropArea: 1.0,
                background: true,
                guides: true,
                center: false,
                highlight: true,
                modal: true,
                ready: function(event) {
                    console.log("cropper ready")
                },
                crop: function(event) {
                    console.log("cropping");
                  }
                }


    var endpoint = document.getElementById("endpoint").innerHTML
    
    var cv_algo_url = endpoint + "cv_algo/"
    var feedback_url = endpoint + "feedback/"
    var analyze_url = endpoint + "analyze/"

    $("#upload-form").submit(function(event) {
        event.preventDefault()

        //var file = document.getElementById("image-input").files[0]
        //cropper = $("#image-input").data('cropper');
        //blob = cropper.getCroppedCanvas().toBlob()

        dataURL = cropper.getCroppedCanvas().toDataURL('image/jpeg')
        
        var blobBin = atob(dataURL.split(',')[1]);
        var array = [];
        for(var i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        var file=new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
        var formData = new FormData();
        formData.append("file", file);

        // TODO input check, crop. etc.
    

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
                    $("#board-container").show()
                    $("#preview-container").hide()
                    
                    $("#analyze-edit-pane").show()
                    setFEN(res.FEN)
                    document.getElementById("raw-id-input").value = res.id
                    
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

      var input, canvas, context, output;
      input = document.getElementById("image-input");
      canvas = document.getElementById("image-preview");
      context = canvas.getContext('2d');
      output = document.getElementById("output");
      
      
      input.onchange = function() {
        
        $("#preview-container").show()
        var reader = new FileReader();
        
        reader.addEventListener("loadend", function(arg) {

          var src_image = new Image();
          
          src_image.onload = function() {
            
            canvas.height = src_image.height;
            canvas.width = src_image.width;
            context.drawImage(src_image, 0, 0);
            
            $("#image-preview").cropper(cropperOptions);
            cropper = $("#image-preview").data("cropper");

            cropper.replace(this.src)
          }

          src_image.src = this.result;

          
        });

        reader.readAsDataURL(this.files[0]);
        $("#board-state-pane").show()
        $("#board-container").hide()
      };

} // end init

var setFEN = function(fen) {
    
    orientation = document.getElementById("reversed-input").checked ? "black" : "white"
    board.orientation(orientation)
    board.position(fen, true)
    
}


$(document).ready(init);