## Run development server

```bash
yarn
yarn dev
```

## Code formatting

We use [Prettier](https://prettier.io/) for code formatting.

There is a pre-commit hook that checks code formatting and fails commit if it
doesn't matches the configuration.

To automatically format the code run:

```bash
yarn format
```

## **API**

### Endpoint Descriptions

#### getTasks

```
 /public/getTasks/:userCourseId/:iLearnFromNameCode
```

##### Usage

other than getting sequential tasks for a certain user we can fetch a specific task using qyery => task, (you need to be an admin!) for example, by writing 
```
/public/getTasks/:userCourseId/:iLearnFromNameCode?task=150
```
we will get task with the ordinal number of 150

#### special/getTasks

```
 /public/special/getTasks?taskId=...
```
or
```
 /public//special/getTasks?taskType=translate&limit=1&iLearnFromNameCode=geo
```

##### Usage

if you want to get certain task with an _id use first endpoint, if you want to get a certain taskType tasks with certain iLearnFromNameCode parameter use the second one, remember! if you wont specify the limit query it will be set to 10 automatically.


