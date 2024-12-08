FROM mcr.microsoft.com/playwright:v1.49.0-jammy

COPY . /e2e-playwright

WORKDIR /e2e-playwright

RUN npm install

CMD [ "npx", "playwright", "test", "--reporter=list" ]