MONAD
=====

```
Monetizable
O
N
Alternate captcha system that we ma-
De up
```

SETTING UP A LOCAL SERVER
-------------------------

From a terminal, navigate to /api and:

```
    composer install
    php5 -S localhost:8080
```

This will start a local PHP server on ```localhost``` port ```8080```. This way you can access the backend API
at ```http://localhost:8080/...```.

To test your set up, go to ```http://localhost:8080/index/```

APIs
----

```
    /**
     * Get an ad image, with its accompanying required action.
     *
     * @path /index/get-question
     * @return [id{int}, image{string}, question{string}]
     */
```

```
    /**
     * Create a new ad with an accompanying required action.
     *
     * @path /index/insert-question
     * @method POST
     *
     * @postParam imageUrl string Absolute URL to ad image
     * @postParam question string Concise action that the user is asked to perform
     * @postParam validPoints int[] Four [x,y] coords indication sub-image where the action is expected
     *
     * @return string|json
     */
```
