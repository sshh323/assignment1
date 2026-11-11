# Use Node.js 23 (Alpine for a small image), mirrored via a registry reachable
# from China. git is installed because the build clones this repo below.
#
# If your network can reach the original registry instead, you may switch to:
#   FROM public.ecr.aws/docker/library/node:23
FROM docker.1ms.run/library/node:23-alpine

RUN apk add --no-cache git

WORKDIR /app

# IMPORTANT: replace the URL below with the https URL to YOUR public GitHub repo.
# The container clones your repo and then runs `node src/index.js`.
RUN git clone https://github.com/sshh323/assignment1.git .

ENTRYPOINT ["node", "src/index.js"]
