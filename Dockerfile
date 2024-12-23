FROM 510467250861.dkr.ecr.us-east-1.amazonaws.com/percipio-base:node-22-alpine
ARG PROJECT_KEY="ENGSEC"
ARG POD_NAME="node-template"
LABEL group=$PROJECT_KEY

ENV HOME /home/deploy
ENV NODE_ENV production
WORKDIR $HOME
COPY package.json $HOME
COPY .npmrc $HOME

RUN apk -U --no-cache && \
  npm install --omit=dev --omit=optional --loglevel=error

COPY . $HOME

RUN chown -R ssuser:ssuser $HOME

USER ssuser

EXPOSE 8080

CMD [ "npm", "run", "start:production" ]