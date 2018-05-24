var appConfig = {
    title: "PamperMoi Admin",
    lang: "en",
    dateFormat: "dd/mm/yy",
    //apiBase: 'http://54.191.103.99:3002/api/v1/',
    apiBase: window.location.protocol + "//" + window.location.host + "/api/v1/en/",
};


var socketInfo = {
    socketURL: window.location.protocol + "//" + window.location.host,
    adminRequest: "adminRequest",
};