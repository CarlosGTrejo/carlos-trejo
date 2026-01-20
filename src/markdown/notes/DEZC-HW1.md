---
title: Data Engineering Zoomcamp - Homework 1
description: Answers and (overengineered) solutions for Data Engineering Zoomcamp Homework 1.
date: '2026-01-18'
categories:
    - Data Engineering
    - Docker
    - SQL
    - Terraform
published: true
---

## Question 1

_Run docker with the `python:3.13` image. Use an entrypoint `bash` to interact with the container._
  
_What's the version of `pip` in the image?_

```ansi
docker run --rm -it --entrypoint /bin/bash python:3.13-slim

root@6cad07c87c87512:/# python -m pip --version
pip 25.3 from /usr/local/lib/python3.13/site-packages/pip (python 3.13)
```

**Answer:** 25.3


## Question 2

_Given the following `docker-compose.yaml`, what is the `hostname` and `port` that pgadmin should use to connect to the postgres database?_

```yaml
services:
  db:
    container_name: postgres
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: 'postgres'
      POSTGRES_PASSWORD: 'postgres'
      POSTGRES_DB: 'ny_taxi'
    ports:
      - '5433:5432'
    volumes:
      - vol-pgdata:/var/lib/postgresql/data

  pgadmin:
    container_name: pgadmin
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: "pgadmin@pgadmin.com"
      PGADMIN_DEFAULT_PASSWORD: "pgadmin"
    ports:
      - "8080:80"
    volumes:
      - vol-pgadmin_data:/var/lib/pgadmin

volumes:
  vol-pgdata:
    name: vol-pgdata
  vol-pgadmin_data:
    name: vol-pgadmin_data
```

**Answer:**
Docker containers will communicate using the service name as the hostname and the internal port exposed by the service. In this case:
- postgres:5432
- db:5432

## Question 3

_Download the green taxi trips data for November 2025 and the zones dataset:_

```bash
wget https://d37ci6vzurychx.cloudfront.net/trip-data/green_tripdata_2025-11.parquet
wget https://github.com/DataTalksClub/nyc-tlc-data/releases/download/misc/taxi_zone_lookup.csv
```
_For the trips in November 2025 (lpep_pickup_datetime between '2025-11-01' and '2025-12-01', exclusive of the upper bound), how many trips had a `trip_distance` of less than or equal to 1 mile?_

Using duckdb, we can load the parquet file and run the query:
```sql
CREATE TABLE trip AS SELECT * FROM read_parquet("green_tripdata_2025-11.parquet");

SELECT COUNT(*) FROM trip
WHERE trip_distance <= 1
  AND lpep_pickup_datetime >= '2025-11-01'
  AND lpep_pickup_datetime < '2025-12-01';
```

**Answer:** 8,007


## Question 4

_Which was the pick up day with the longest trip distance? Only consider trips with `trip_distance` less than 100 miles (to exclude data errors). Use the pick up time for your calculations._

```sql
SELECT
  CAST(lpep_pickup_datetime AS DATE) AS day,
  MAX(trip_distance) AS max_dist
FROM trip
WHERE trip_distance < 100
GROUP BY day
ORDER BY max_dist DESC
LIMIT 1;
```

**Answer:** 2025-11-14



## Question 5

_Which was the pickup zone with the largest `total_amount` (sum of all trips) on November 18th, 2025?_

```sql
CREATE TABLE zone_lookup AS SELECT * FROM read_csv_auto('taxi_zone_lookup.csv');

SELECT PULocationID, "Zone", SUM(total_amount) as Total
FROM trip, zones
WHERE CAST(lpep_pickup_datetime AS DATE) = '2025-11-18'
  AND LocationID = PULocationID
GROUP BY PULocationID, "Zone"
ORDER BY Total DESC
LIMIT 1;
┌──────────────┬───────────────────┬────────────────────┐
│ PULocationID │       Zone        │       Total        │
│    int32     │      varchar      │       double       │
├──────────────┼───────────────────┼────────────────────┤
│           74 │ East Harlem North │  9281.919999999998 │
└──────────────┴───────────────────┴────────────────────┘
```

**Answer:** East Harlem North


## Question 6

_For the passengers picked up in the zone named "East Harlem North" in November 2025, which was the drop off zone that had the largest tip?_


```sql
SELECT zdo."Zone" dropoff, tip_amount
FROM trip t
JOIN zones AS zpu
  ON t.PULocationID = zpu.LocationID
JOIN zones AS zdo
  ON t.DOLocationID = zdo.LocationID
WHERE zpu."Zone" = 'East Harlem North'
ORDER BY tip_amount DESC
LIMIT 1;
┌────────────────┬────────────┐
│    dropoff     │ tip_amount │
│    varchar     │   double   │
├────────────────┼────────────┤
│ Yorkville West │   81.89    │
└────────────────┴────────────┘
```

**Answer:** Yorkville West

## Question 7

_Which of the following sequences, respectively, describes the workflow for:_
1. _Downloading the provider plugins and setting up backend,_
2. _Generating proposed changes and auto-executing the plan_
3. _Remove all resources managed by terraform_

**Answer:** terraform init, terraform apply -auto-approve, terraform destroy