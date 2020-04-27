# robo-jiji

## final count down edition:

TODO:

- [x] Gerer les notifications selon préférences
- [ ] Finir le UI + CSS + installation wizard
- [x] Hasher les passwords
- [ ] full deployment avec AWS (EC2, RDS, domain, SSL, fs...)
- [ ] Tests, Tests, Tests
- [ ] Securité
- [ ] Small roll out
- [ ] Intégrer les messages txts
- [ ] Sécurité & tests

## AWS beanStalk:

Our setup is in single instance environnement with a self signed certificat that
is uploaded via extensions files. (using https-instance-securitygroup and https-instance)
used https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/configuring-https-ssl.html to create certificat
When ready to deploy for real look over the following:

- get a domain name and register it with AWS domain thing.... should be easy to get free certificat
- enable load balancer and multiples instances via env config

### steps to deploy:

- npm run build in /client and replace /build folder in express by created build
- set http in www file if its not already there
- set AWS or custom URL in serverURL
- set AWS DB configs in config/config.js file for DB
- use `// zip ../jiji69_1.zip -r * .[^.]*` to create a bundle file
- upload it to beanstalks via AWS console
