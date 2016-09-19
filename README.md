# Server Diffing with Upguard

Install dependencies
```
$ npm i gulp-cli -g && npm i
```

#### Run it

```
$ gulp run
```

Navigate to http://localhost:8500/ and any changes made will be live reloaded

#### Deploy it
```
$ gulp build
...
[02:34:30] Starting 'server:minify:js'...
[02:34:30] Finished 'minify:html' after 117 ms
[02:34:30] Finished 'minify:css' after 119 ms
[02:34:30] Finished 'server:minify:js' after 84 ms
[02:34:30] Finished 'minify:js' after 122 ms
[02:34:30] Finished 'build' after 12 s

$ docker build -t server .
...
Removing intermediate container 07b48c8f58a7
Step 6 : CMD 'nginx'
 ---> Running in f8a615aa9693
 ---> 493675d657a7
Removing intermediate container f8a615aa9693
Successfully built 493675d657a7

$ docker run docker run -p 80:80 -d

$ # Run the cors-server (Don't forget to set your api keys in index.js)
$ node cors-serv/index.js
```

Navigate to http://localhost/ to see the deployed result
