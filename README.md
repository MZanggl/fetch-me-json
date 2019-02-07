# fetch-me-json

> High level API for fetch with sensible defaults making client server requests a breeze.

## Installation

`npm i fetch-me-json`

## Usage

### Convention
```
import JSONFetch from 'fetch-me-json'

JSONFetch.<<method>>(<<endpoint>>, <<parameters>>)
    .then(<<JSON-ResponseBody>> => ...)
    .catch(<<errorMessage>> => ...)
```

### GET requests
```javascript
import JSONFetch from 'fetch-me-json'
JSONFetch.get('/resources/1')
    .then(bodyInJSON => console.log(bodyInJSON))
    .catch(errorMessage => console.log(errorMessage))
```

You can also pass query parameters.

```javascript
import JSONFetch from 'fetch-me-json'
JSONFetch.get('/resources/1', {
    optional_parameter: 1
})
```

### POST, PUT, PATCH, DELETE

```javascript
import JSONFetch from 'fetch-me-json'

JSONFetch.post('/resources', {
    id: 1,
    name: 'Tyler',
    type: 1,
})

JSONFetch.delete('/resources/1')

JSONFetch.put('/resources/1', {
    name: 'Durden',
    type: 1,
})

JSONFetch.patch('/resources/1', {
    type: 2,
})
```

## Advanced

### internal fetch

Internally this is the fetch that will be executed for everyting except for `GET`. You can configure these to your liking (see below).

```javascript
{
    method: 'put' | 'post' | 'patch' | 'delete'
    body: JSON.stringify(parameters),
    mode: 'same-origin',
    credentials: 'same-origin',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
}
```

### Configurations

```javascript
import JSONFetch from 'fetch-me-json'

const configurations = {
    errorKey: 'error'
}

JSONFetch.config(configurations)
```

List of possible configurations

| key  | description | default | 
|---|---|---|
| errorKey | The key (from the response) that should be thrown in the case of an error | message  |
| defaultParameters  | define default parameters you always want to pass along  |   |
| fetch  | parameters to be passed down to the global fetch method (except for get), overrides existing parameters  | *see **internal fetch** above* |