requirejs.config({
    baseUrl: 'src/scripts',
    waitSeconds: 20,
    paths: {
    },
    urlArgs: "t=" + (new Date()).getTime()
});