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

> This question requires us to use `docker run` and change the entry point to check the version of pip (although we could do it without changing the entry point).
> I like using `--rm` to make sure we leave no dangling contaiers, and `-it` so that we can interact with the container through our terminal.

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

> Docker containers will communicate using the service name as the hostname and the internal port exposed by the service. In this case:

**Answer:**
- postgres:5432
- db:5432

## Question 3

_Download the green taxi trips data for November 2025 and the zones dataset:_

```bash
wget https://d37ci6vzurychx.cloudfront.net/trip-data/green_tripdata_2025-11.parquet
wget https://github.com/DataTalksClub/nyc-tlc-data/releases/download/misc/taxi_zone_lookup.csv
```
_For the trips in November 2025 (lpep_pickup_datetime between '2025-11-01' and '2025-12-01', exclusive of the upper bound), how many trips had a `trip_distance` of less than or equal to 1 mile?_

> We could create a docker-compose.yaml file to deploy a database (along with some data ingestion script), pgAdmin, but it is faster to use duckdb on this question to practice our SQL.
> So using duckdb, we can load the parquet file and run the following query. We use `COUNT(*)` to count all rows that satisfy the `WHERE` clause. In this case, we make sure our trip distance is less than or equal to 1 mile and that the trip happened in November. Notice that we use single quotes instead of double quotes. Double quotes are used for column names, and it would've caused an error if we had tried it in this query:
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

> This question required a bit more planning. I used the `CAST` function here since we're only interested in the day and not the time, however, it doesn't matter if we cast it or not since the output will still show us the row with the max distance.
> Next I used the `MAX` function since we are being asked to find the longest trip distance, and we attach a `WHERE` clause to reduce it to trips with less than 100 miles. Finally, we make sure to add a `GROUP BY` clause to group by day because we want the longest trip distance per day.

```sql
SELECT
  CAST(lpep_pickup_datetime AS DATE) AS "day",
  MAX(trip_distance) AS max_dist
FROM trip
WHERE trip_distance < 100
GROUP BY "day"
ORDER BY max_dist DESC
LIMIT 1;
```

**Answer:** 2025-11-14



## Question 5

_Which was the pickup zone with the largest `total_amount` (sum of all trips) on November 18th, 2025?_

> For this question, we need to join the trip data with the zones data to get the zone names. We do this by matching the `PULocationID` from the trip data with the `LocationID` from the zones data. Notice that I used double quotes around "Zone" since it is a reserved keyword in SQL. I used `CAST` again to extract the date from the timestamp, and then we group by `PULocationID` and "Zone" to get the total amount per zone. Finally, we order the results in descending order and limit it to 1 to get the zone with the largest total amount.

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

> Similar to the previous question, we need to join the trip data with the zones data twice: once for the pickup location and once for the dropoff location. We filter the results to only include trips picked up in "East Harlem North" and in November 2025. Finally, we order the results by `tip_amount` in descending order and limit it to 1 to get the dropoff zone with the largest tip.

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

> A quick look at the docs and we can see that the correct sequence is:
**Answer:** terraform init, terraform apply -auto-approve, terraform destroy