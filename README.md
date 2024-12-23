# node-template
node-project


## Local Dev setup

Install the packages :

```
npm install
```

Generate the .env file using the [PercipioSecretLoader](https://skillsoftdev.atlassian.net/wiki/spaces/PSS/pages/3535470673/Percipio+Secret+Loader) :

```
npm run load-secrets
```

Note : This assume that you are AWS SSOed and that you are using zscaler/cisco connected. You should have this entry in `~/.aws/config`

```
[profile psl]
sso_start_url = https://skillsoftsso.awsapps.com/start
sso_region = us-east-1 sso_account_id = 214559464274
sso_role_name = EngineeringTeamAccess
region = us-east-1 output = json
```

## Start the services

```
npm run start
```

## lint

`npm run lint`

## Start the tests :

### Run the unit tests :

```
npm run test
```

Note : The tests will be run by the pipeline.
