# Open Data Discovery Platform local demo environment
* * *

The following is a set of instructions to run ODD Platform locally using docker and docker-compose.
This configuration is basic and best suited as a demo sandbox.

This environment consists of:
* ODD Platform – an application that ingests, structurizes, indexes and provides a collected metadata via REST API and UI
* ODD Platform Enricher – a tool to inject a metadata sample into the Platform
* PostgreSQL sample database
* ODD Collector – a lightweight service which gathers metadata from all your data sources

## Prerequisites

* Docker Engine 19.03.0+
* Preferably the latest docker-compose

## Step 1: Configuring and running ODD Platform with a metadata sample in it

### Assumptions

* Ports 5432 and 8080 are free. Commands to check that might be:
    * Linux/Mac: `lsof -i -P -n | grep LISTEN | grep <PORT_NUMBER>`
    * Windows Powershell: `Get-NetTCPConnection | where Localport -eq <PORT_NUMBER> | select Localport,OwningProcess`

    Replace `<PORT_NUMBER>` with 5432 and 8080. Empty output means that the port is free and ready to go.

### Execution

Run **from the project root folder** `docker-compose -f docker/demo.yaml up -d odd-platform-enricher`.

### Result

1. Open http://localhost:8080/management/datasources in your browser

You should be able to see 10 predefined data sources in the list

2. Go to the **Catalog** section

You should be able to see metadata sample injected into the Platform

## Step 2: Configuring and running Collector to gather metadata from the sample data source

### Create Collector entity

1. Go to the http://localhost:8080/management/collectors and select `Add collector`
2. Complete the following fields:
    * **Name**
    * **Namespace** (optional)
    * **Description** (optional)
3. Click **Save**. Your collector should appear in the list
4. Copy the token by clicking **Copy** right to the token value

### Configure and run the Collector

1. Paste the token obtained in the previous step into the `docker/config/collector_config.yaml` file under the `token` entry
2. If you'd like, you may change the name of the `postgresql` plugin under the `name` entry.
3. Save the changed file and run **from the project root folder** `docker-compose -f docker/demo.yaml up -d odd-collector`.

### Result

1. Open http://localhost:8080/management/datasources in your browser

You should be able to see a new data source with the name you've passed into the collector_config.yaml file
(Default is `postgresql-step2-test`). Overall you should see 11 data sources in the list

2. Go to the **Catalog** section. Select the created data source in the `Datasources` filter

You should be able to see 11 new entities of different types injected into the Platform

## Step 3 (Optional): Configuring and running Collector to gather metadata from your own data sources

### Assumptions

* You've done Step 1 and Step 2
* You already have locally accessible data sources and want to ingest metadata from these data sources into the Platform
* These data sources are supported by Collectors:
    *  [supported data sources by odd-collector](https://github.com/opendatadiscovery/odd-collector/blob/main/README.md)
    *  [supported data sources by odd-collector-aws](https://github.com/opendatadiscovery/odd-collector-aws/blob/main/README.md)

### Configure the existing Collector

1. Add new entries under plugin list in the `docker/config/collector_config.yaml`
   See a documentation [here](https://github.com/opendatadiscovery/odd-collector/blob/main/README.md)
2. Restart the Collector by running **from the project root folder** `docker-compose -f docker/demo.yaml restart odd-collector`


#### QuickStart: plugin your postgresql data

1. Set postgresql service in odd-platform/docker/demo.yaml file
    - Docker service config example
        ```
          test-odd-collector-postgresql:
            image: postgres:13.2-alpine
            # restart: always
            volumes:
            - ./config/dump.sql:/docker-entrypoint-initdb.d/init.sql
            environment:
            - POSTGRES_USER=${TEST_ODD_COLLECTOR_POSTGRES_USER}
            - POSTGRES_PASSWORD=${TEST_ODD_COLLECTOR_POSTGRES_PASSWORD}
            - POSTGRES_DATABASE=${TEST_ODD_COLLECTOR_POSTGRES_DATABASE} 
        ```
2. Open `.env` file to set postgresql config
    - Example
        ```
        TEST_ODD_COLLECTOR_POSTGRES_HOST=test-odd-collector-postgresql
        TEST_ODD_COLLECTOR_POSTGRES_USER=test_odd_collector_postgresql
        TEST_ODD_COLLECTOR_POSTGRES_PASSWORD=test_odd_collector_postgresql_password
        TEST_ODD_COLLECTOR_POSTGRES_DATABASE=test_odd_collector_postgresql
        ```

3. Add your postgresql service name to `odd-collector depends_on` in odd-platform/docker/demo.yaml
    - Example ( Your postgresql service name: `test-odd-collector-postgresql` )
        ```
          odd-collector:
            image: ghcr.io/opendatadiscovery/odd-collector:latest
            # restart: always
            volumes:
            - ./config/collector_config.yaml:/app/collector_config.yaml
            environment:
            - PLATFORM_HOST_URL=${PLATFORM_HOST_URL}
            - SAMPLE_POSTGRES_HOST=sample-postgresql
            - SAMPLE_POSTGRES_USER=${SAMPLE_POSTGRES_USER}
            - SAMPLE_POSTGRES_DATABASE=${SAMPLE_POSTGRES_DATABASE}
            - SAMPLE_POSTGRES_PASSWORD=${SAMPLE_POSTGRES_PASSWORD}
            
            depends_on:
            - sample-postgresql
            - test-odd-collector-postgresql
        ```

4. Open odd-platform/docker/config/collector_config.yaml
    - Edit odd-platform plugin to mapping your postgresql service
        ```
          - type: postgresql
            name: postgresql-step3-test-v0
            host: !ENV ${TEST_ODD_COLLECTOR_POSTGRES_HOST}
            port: 5432
            database: !ENV ${TEST_ODD_COLLECTOR_POSTGRES_DATABASE}
            user: !ENV ${TEST_ODD_COLLECTOR_POSTGRES_USER}
            password: !ENV ${TEST_ODD_COLLECTOR_POSTGRES_PASSWORD}
        ```

5. Active `odd-platform-enricher` service
    ```
    cd odd-platform
    docker-compose -f docker/demo.yaml up -d odd-platform-enricher
    ```

6. Open collectors page to add a new collector
    - http://localhost:8080/management/collectors

7. Copy new collector token & paste it to token in collector_config.yaml
    - odd-platform/docker/config/collector_config.yaml
    - Example
        ```
        default_pulling_interval: 1
        token: "new collector token"
        plugins:
        - type: postgresql
            name: postgresql-step2-test
            host: !ENV ${SAMPLE_POSTGRES_HOST}
            port: 5432
            database: !ENV ${SAMPLE_POSTGRES_DATABASE}
            user: !ENV ${SAMPLE_POSTGRES_USER}
            password: !ENV ${SAMPLE_POSTGRES_PASSWORD}

        - type: postgresql
            name: postgresql-step3-test-v0
            host: !ENV ${TEST_ODD_COLLECTOR_POSTGRES_HOST}
            port: 5432
            database: !ENV ${TEST_ODD_COLLECTOR_POSTGRES_DATABASE}
            user: !ENV ${TEST_ODD_COLLECTOR_POSTGRES_USER}
            password: !ENV ${TEST_ODD_COLLECTOR_POSTGRES_PASSWORD}
        ```

8. Active `odd-collector` service
    ```
    docker-compose -f docker/demo.yaml up -d odd-collector
    ```

9. Check your postgresql datasource exists in odd-platform datasources page
    - http://localhost:8080/management/datasources
    - datasource name: postgresql-step3-test-v0


10. Go to the Catalog section. Select the created data source in the Datasources filter
    - Notice: The result need to be waited for 5~20 seconds. ( Not sure why )


### Result

You should be able to see new data sources and data entities that correspond with them

### Troubleshooting

**My entities from the sample data aren't shown in the platform.**

Check the logs by running **from the project root folder** `docker-compose -f docker/demo.yaml logs -f`

