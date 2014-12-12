MONAD
=====

```
  Monetizable
  O
  N
  Alternative for captcha that we
maDe up
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

***You may need to delete a couple of ```require``` or ```include``` statements from the zf1 project inside vendors

APIs
----

```
    /**
     * Get a random ad image, with its accompanying required action.
     *
     * @path /index/get-question
     * @method GET
     *
     * @return object [id{int}, image{string}, question{string}]
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

```
    /**
     * Verify that a given [x,y] is within the required target for a given ad
     *
     * @path /index/verify
     * @method POST
     *
     * @postParam id int Ad id
     * @postParam resp string Two Comma-separated ints representing the [x,y] coords from the user action
     *
     * @return string|json
     */
```
