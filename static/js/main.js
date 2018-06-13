{
    var init = function () {

        var board = ChessBoard('board', 'start');

        /*$("#theform").submit(function(event) {
            event.preventDefault()
            var file = document.getElementById("imageinput").files[0]
            // TODO input check. 

            var formData = new FormData(this);
            
            $.ajax({
                url: "http://40.91.195.137:8080/",
                method: "POST", 
                data: formData,
                success: function (data) {
                    setFEN(data)
                },
                error: function(msg) {
                    console.log(msg)
                },
                cache: false,
                contentType: false,
                processData: false})

            var reader = new FileReader();
            reader.onload = function(data) {
                var imageData = data.target.result
                // Show preview of uploaded image
                document.getElementById("inputpreview").src = imageData
                $('#inputpreview').css('transform','rotate(90 deg)');
                // Send base64 encoded image to backend..
            }
            reader.readAsDataURL(file); 
        })*/
    }; // end init()

    var setFEN = function (fenstring) {
        var cfg = {
            position: fenstring
        };

        var board = ChessBoard('board', cfg);
    }

    $(document).ready(init);
}