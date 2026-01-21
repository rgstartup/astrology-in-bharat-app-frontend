const http = require('http');

http.get('http://localhost:6543/api/v1/expert/list', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received.
    resp.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.data && json.data.length > 0) {
                console.log(JSON.stringify(json.data[0], null, 2));
            } else {
                console.log("No data found or empty array");
                console.log(json);
            }
        } catch (e) {
            console.log("Error parsing JSON");
            console.log(data.substring(0, 500));
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
