FROM ghcr.io/puppeteer/puppeteer:19.7.2

# Skip chromium download
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Set work directory
WORKDIR /usr/src/app

# Copy package files into work directory
COPY package*.json ./

# npm clean install to make repeatable automated build process
RUN npm ci

# copy rest of files
COPY . .

# Start command for docker container
CMD [ "node", "index.js" ]