# robo-jiji

TODO:

- [ ] Finir le UI fonctionnel (notifications)
- [ ] Faire les retry pour classifer
- [ ] Hasher les passwords
- [ ] Gerer les notifications selon préférences
- [ ] Intégrer les messages txts
- [ ] Sécurité & tests
- [ ] changer <AllowedOrigin>\*</AllowedOrigin> dans AWS pour juste le bon domaine

# robo-jiji

steps pour deployer sur heroku:

- changer le URL dans serverURL.js
- cd /client
- npm run build
- rm -rf express/build
- mv client/build to express/
- changer les configs de .env avec ceux dans envs.txt
- git add .
- git commit -m "yessir"
- git push
- cd /bot-kijiji
- git subtree push --prefix express heroku master
