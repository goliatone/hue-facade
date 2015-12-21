# Hue facade


#### Configuration
Edit **config/hue-facade.json**:

```json
{
    "bridges": [
        {
            "id": "desk",
            "host": "192.168.75.135",
            "user": "2b365f3514536e0e30a843a26cacb45a"
        },{
            "id": "guest",
            "host": "192.168.75.148",
            "user": "a301a0f03959abae3586639646eb203f"
        }
    ],
    "options":{
        "offDelay": 4000,
        "onDelay": 5000,
        "onParams": [0, 0.58, 1],
        "onTransitionTime": 50,
        "offParams": [0, 0.58, 0],
        "offTransitionTime": 40
    }
}

```

#### Development
To discover bridges, use UPNP feature:

https://www.meethue.com/api/nupnp



<!--
//--expose_gc => global.gc()

//PM2_KILL_TIMEOUT=60000 pm2 start ./bin/worker --name hue-worker
//pm2 sendSignal SIGINT 0|hue-worker <= pm2 will actually restart if we exit.
//pm2 stop 0|hue-worker will send SIGINT and not restart.
-->
